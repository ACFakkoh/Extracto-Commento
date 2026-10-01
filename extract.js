import * as pdfjs from './vendor/pdfjs/pdf.mjs';
import { TYPES, cleanText } from './format.js';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/pdf.worker.mjs', import.meta.url).href;
const CHUNK = 1024 * 1024;

// PDF.js requests only the local byte ranges it needs. No PDF URL or upload.
class LocalFileTransport extends pdfjs.PDFDataRangeTransport {
  constructor(file, initial, fail) {
    super(file.size, initial, true);
    this.file = file;
    this.fail = fail;
    this.cancelled = false;
  }
  requestDataRange(begin, end) {
    if (this.cancelled) return;
    this.file.slice(begin, end).arrayBuffer().then(buffer => {
      if (!this.cancelled) this.onDataRange(begin, new Uint8Array(buffer));
    }).catch(error => { if (!this.cancelled) this.fail(error); });
  }
  abort() { this.cancelled = true; this.file = null; }
}

function aborted(signal) {
  if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
}

// Text item quadrilateral in unrotated PDF space; both text and markup use it.
function textBox(item, styles) {
  const [a, b, c, d, x, y] = item.transform;
  const baseline = Math.hypot(a, b) || 1;
  const ux = a / baseline, uy = b / baseline;
  const vertical = Math.hypot(c, d) || baseline;
  const vx = c / vertical, vy = d / vertical;
  const style = styles[item.fontName] || {};
  const ascent = Number.isFinite(style.ascent) ? style.ascent : 0.85;
  const descent = Number.isFinite(style.descent) ? style.descent : -0.2;
  const width = Math.abs(item.width);
  const height = Math.abs(item.height) || vertical;
  const points = [[x + vx * height * descent, y + vy * height * descent],
    [x + ux * width + vx * height *descent, y + uy * width + vy * height * descent],
    [x + vx * height * ascent, y + vy * height * ascent],
    [x + ux * width + vx * height * ascent, y + uy * width + vy * height * ascent]];
  return {
    x1: Math.min(...points.map(p => p[0])), y1: Math.min(...points.map(p => p[1])),
    x2: Math.max(...points.map(p => p[0])), y2: Math.max(...points.map(p => p[1])),
  };
}

function markBoxes(annotation) {
  const boxes = [];
  const quad = annotation.quadPoints;
  if (quad?.length) {
    for (let i = 0; i + 7 < quad.length; i += 8) {
      const xs = [quad[i], quad[i+2], quad[i+4], quad[i+6]];
      const ys = [quad[i+1], quad[i+3], quad[i+5], quad[i+7]];
      boxes.push({ x1: Math.min(...xs), x2: Math.max(...xs), y1: Math.min(...ys), y2: Math.max(...ys) });
    }
  } else if (annotation.rect?.length === 4) {
    const [x1, y1, x2, y2] = annotation.rect;
    boxes.push({ x1: Math.min(x1,x2), y1: Math.min(y1,y2), x2: Math.max(x1,x2), y2: Math.max(y1,y2) });
  }
  return boxes;
}

export function markedText(annotation, text) {
  const boxes = markBoxes(annotation);
  const selected = [];
  // Preserve PDF.js content order; deduplicate item indices across multiple quads.
  for (const item of text.items) {
    if (!item.str?.trim() || !item.transform) continue;
    const box = textBox(item, text.styles);
    const area = (box.x2 - box.x1) * (box.y2 - box.y1);
    if (area <= 0) continue;
    if (boxes.some(mark => {
      const width = Math.max(0, Math.min(box.x2, mark.x2) - Math.max(box.x1, mark.x1));
      const height = Math.max(0, Math.min(box.y2, mark.y2) - Math.max(box.y1, mark.y1));
      return width * height / area > 0.15;
    })) selected.push(item.str);
  }
  // ponytail: whole text fragments can over-select characters; the UI marks this
  // as estimated. Use glyph-level geometry only if the target corpus needs it.
  return cleanText(selected.join(' '));
}

export async function extractPdf(file, { signal, onProgress = () => {} } = {}) {
  aborted(signal);
  if (!/\.pdf$/i.test(file.name)) throw new Error('fileType');
  if (!file.size) throw new Error('emptyFile');
  const initial = new Uint8Array(await file.slice(0, Math.min(CHUNK, file.size)).arrayBuffer());
  aborted(signal);
  if (!new TextDecoder('latin1').decode(initial.subarray(0, 1024)).includes('%PDF-')) throw new Error('invalidPdf');
  let readError;
  let task;
  const transport = new LocalFileTransport(file, initial, error => {
    readError = error;
    void task?.destroy();
  });
  const cancel = () => { transport.abort(); void task?.destroy(); };
  signal?.addEventListener('abort', cancel, { once: true });
  const result = { records: [], pages: 0, excludedHighlights: 0, excludedLines: 0,
    unsupported: {}, failedPages: [], textFailures: [], missingText: 0, elapsedMs: 0 };
  const started = performance.now();
  try {
    task = pdfjs.getDocument({ range: transport, rangeChunkSize: CHUNK,
      disableAutoFetch: true, disableStream: true, isEvalSupported: false,
      stopAtErrors: true, enableXfa: false,
      cMapUrl: new URL('./vendor/pdfjs/cmaps/', import.meta.url).href,
      standardFontDataUrl: new URL('./vendor/pdfjs/standard_fonts/', import.meta.url).href,
      wasmUrl: new URL('./vendor/pdfjs/wasm/', import.meta.url).href,
      iccUrl: new URL('./vendor/pdfjs/iccs/', import.meta.url).href,
    });
    const document = await task.promise;
    result.pages = document.numPages;
    // Sequential work bounds live page/text data even for 500 pages.
    for (let pageNo = 1; pageNo <= document.numPages; pageNo++) {
      aborted(signal);
      if (readError) throw new Error('readError');
      let page;
      try {
        page = await document.getPage(pageNo);
        const annotations = await page.getAnnotations({ intent: 'any' });
        const retained = [];
        for (const annotation of annotations) {
          const type = annotation.subtype;
          if (['Popup', 'Link', 'Widget'].includes(type)) continue;
          if (!TYPES.includes(type)) {
            const key = type || 'Unknown';
            result.unsupported[key] = (result.unsupported[key] || 0) + 1;
            continue;
          }
          const note = cleanText(annotation.contentsObj?.str ?? annotation.contents ?? '');
          if (type === 'Highlight' && !note) { result.excludedHighlights++; continue; }
          if (type === 'Line' && !note) { result.excludedLines++; continue; }
          retained.push({ annotation, note });
        }
        let text;
        if (retained.some(({ annotation }) => ['Highlight', 'StrikeOut'].includes(annotation.subtype))) {
          try { text = await page.getTextContent(); }
          catch { aborted(signal); result.textFailures.push(pageNo); }
        }
        for (const { annotation, note } of retained) {
          const type = annotation.subtype;
          const isMarkup = type === 'Highlight' || type === 'StrikeOut';
          const covered = isMarkup && text ? markedText(annotation, text) : '';
          if (isMarkup && !covered) result.missingText++;
          result.records.push({ no: result.records.length + 1, page: pageNo, type, note,
            author: cleanText(annotation.titleObj?.str ?? annotation.title ?? ''),
            modified: annotation.modificationDate || '', markedText: covered,
            estimated: isMarkup, reply: Boolean(annotation.inReplyTo && annotation.replyType !== 'Group'),
          });
        }
      } catch (error) {
        aborted(signal);
        if (readError) throw new Error('readError');
        result.failedPages.push(pageNo);
      } finally { page?.cleanup(); }
      onProgress({ page: pageNo, total: result.pages, count: result.records.length });
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    aborted(signal);
    if (readError) throw new Error('readError');
    result.elapsedMs = performance.now() - started;
    return result;
  } catch (error) {
    aborted(signal);
    if (readError) throw new Error('readError');
    throw error;
  } finally {
    signal?.removeEventListener('abort', cancel);
    transport.abort();
    if (task) { try { await task.destroy(); } catch { /* Already destroyed on cancel. */ } }
  }
}
