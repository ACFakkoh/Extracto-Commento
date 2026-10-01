import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import fs from 'node:fs';

export const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const generated = path.join(root,'tests','generated');
const require = createRequire(import.meta.url);
export function dependency(name) {
  try { return require(name); }
  catch {
    const runtime = path.join(process.env.USERPROFILE || process.env.HOME,'.cache','codex-runtimes','codex-primary-runtime','dependencies','node','node_modules');
    return createRequire(path.join(runtime,'package.json'))(name);
  }
}
const { PDFDocument, StandardFonts, PDFName, PDFString, PDFHexString } = dependency('pdf-lib');

function addAnnotation(document,page,type,rect,note,author='Alex',date='D:20261001140000-04\'00\'',extra={}) {
  const properties = { Type:'Annot', Subtype:type, Rect:rect, Contents:PDFHexString.fromText(note),
    T:PDFHexString.fromText(author), M:PDFString.of(date), F:4, P:page.ref, ...extra };
  const annotation = document.context.register(document.context.obj(properties));
  let annotations = page.node.lookup(PDFName.of('Annots'));
  if (!annotations) { annotations = document.context.obj([]); page.node.set(PDFName.of('Annots'),annotations); }
  annotations.push(annotation);
  return annotation;
}

export async function createFixtures() {
  await mkdir(generated,{ recursive:true });
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  const page = document.addPage([595,842]);
  page.drawText('Extracto Commento - PDF de demonstration',{ x:40,y:790,size:21,font });
  page.drawText('Document synthetique. Les commentaires sont des annotations PDF.',{ x:40,y:758,size:11,font });
  const markup = (text,y) => { page.drawText(text,{ x:60,y,size:14,font }); return [60,y-4,60+font.widthOfTextAtSize(text,14),y+16]; };
  const high = markup('Texte a revoir',690), strike = markup('Texte a retirer',635);
  addAnnotation(document,page,'Text',[40,725,62,747],'Vérifier la cote indiquée.','Alex');
  addAnnotation(document,page,'FreeText',[60,550,320,581],'Préciser la référence du plan.','Sam',undefined,{ DA:PDFString.of('/Helv 12 Tf 0 g') });
  addAnnotation(document,page,'Highlight',high,'Confirmer cette formulation.','Alex',undefined,{ QuadPoints:[high[0],high[3],high[2],high[3],high[0],high[1],high[2],high[1]], C:[1,1,0] });
  addAnnotation(document,page,'StrikeOut',strike,'','Sam',undefined,{ QuadPoints:[strike[0],strike[3],strike[2],strike[3],strike[0],strike[1],strike[2],strike[1]] });
  addAnnotation(document,page,'Line',[60,470,320,492],'250 mm','Alex',undefined,{ L:[60,480,320,480] });
  page.drawText('5 commentaires attendus : note, zone de texte, surlignage, texte barre, ligne.',{ x:40,y:410,size:11,font });
  if (!fs.existsSync(path.join(root,'example.pdf'))) await writeFile(path.join(root,'example.pdf'),await document.save());

  const fixture = await PDFDocument.create();
  const ff = await fixture.embedFont(StandardFonts.Helvetica);
  const p = fixture.addPage([595,842]);
  p.drawText('Synthetic extraction checks',{ x:40,y:800,size:20,font:ff });
  const marked = [60,690,220,718];
  p.drawText('Highlighted words',{ x:60,y:700,size:14,font:ff });
  const struck = [60,640,220,668];
  p.drawText('Struck words',{ x:60,y:650,size:14,font:ff });
  const parent = addAnnotation(fixture,p,'Text',[40,750,62,772],'<img src=x onerror="window.pwned=1"> =1+1','Élodie');
  addAnnotation(fixture,p,'Popup',[250,700,440,800],'','',undefined,{ Parent:parent });
  addAnnotation(fixture,p,'FreeText',[60,570,320,600],'Texte libre avec accents : été.','Sam',undefined,{ DA:PDFString.of('/Helv 12 Tf 0 g') });
  addAnnotation(fixture,p,'Highlight',marked,'Keep highlight','Alex',undefined,{ QuadPoints:[60,718,220,718,60,690,220,690] });
  addAnnotation(fixture,p,'Highlight',[250,690,350,718],'','Alex');
  addAnnotation(fixture,p,'StrikeOut',struck,'','Sam',undefined,{ QuadPoints:[60,668,220,668,60,640,220,640] });
  addAnnotation(fixture,p,'Line',[60,500,250,520],'250 mm','Alex',undefined,{ L:[60,510,250,510] });
  addAnnotation(fixture,p,'Line',[60,450,250,470],'','Alex',undefined,{ L:[60,460,250,460] });
  addAnnotation(fixture,p,'Square',[300,400,350,450],'Unsupported square');
  addAnnotation(fixture,p,'Text',[40,400,62,422],'=1+1','','D:20260230');
  addAnnotation(fixture,p,'Text',[40,350,62,372],'Hidden note retained','Alex',undefined,{ F:2 });
  addAnnotation(fixture,p,'Text',[40,300,62,322],'A reply','Sam',undefined,{ IRT:parent, RT:'R' });
  await writeFile(path.join(generated,'annotations.pdf'),await fixture.save());
  const empty = await PDFDocument.create(); empty.addPage();
  await writeFile(path.join(generated,'empty.pdf'),await empty.save());
  await writeFile(path.join(generated,'invalid.pdf'),'Not a PDF');
  await writeFile(path.join(generated,'corrupt.pdf'),'%PDF-1.7\nnot a document');
  const long = await PDFDocument.create();
  addAnnotation(long,long.addPage(),'Text',[40,700,62,722],'A'.repeat(33000));
  await writeFile(path.join(generated,'long.pdf'),await long.save());
  const partial = await PDFDocument.create();
  addAnnotation(partial,partial.addPage(),'Text',[40,700,62,722],'Readable note');
  const brokenPage = partial.addPage();
  addAnnotation(partial,brokenPage,'Highlight',[40,700,160,722],'Note survives broken text');
  brokenPage.drawText('Marked words',{x:40,y:705,size:14,font:await partial.embedFont(StandardFonts.Helvetica)});
  addAnnotation(partial,partial.addPage(),'Text',[40,700,62,722],'Simulate unreadable page');
  await writeFile(path.join(generated,'partial.pdf'),await partial.save());
  const pages = await PDFDocument.create();
  for (let index=0;index<500;index++) addAnnotation(pages,pages.addPage(),'Text',[40,700,62,722],`Page ${index+1}`);
  await writeFile(path.join(generated,'pages.pdf'),await pages.save());
}

// A valid classic PDF with a large embedded stream and 500 annotated pages.
// This probes file volume and pagination, not real image/text complexity.
export function createLargeFixture() {
  const destination = path.join(generated,'large-300mb.pdf');
  const output = fs.openSync(destination,'w');
  const offsets = [0]; let position = 0;
  const write = value => { const buffer = typeof value === 'string' ? Buffer.from(value) : value; fs.writeSync(output,buffer); position += buffer.length; };
  const object = (id,value) => { offsets[id] = position; write(`${id} 0 obj\n${value}\nendobj\n`); };
  try {
    write('%PDF-1.7\n');
    object(1,'<< /Type /Catalog /Pages 2 0 R /Names << /EmbeddedFiles << /Names [(padding.dat) << /Type /Filespec /F (padding.dat) /EF << /F 3 0 R >> >>] >> >> >>');
    object(2,`<< /Type /Pages /Count 500 /Kids [${Array.from({length:500},(_,index) => `${4+index*2} 0 R`).join(' ')}] >>`);
    offsets[3] = position;
    const length = 300_000_000;
    write(`3 0 obj\n<< /Type /EmbeddedFile /Length ${length} >>\nstream\n`);
    const chunk = Buffer.alloc(1024*1024);
    for (let done=0;done<length;done+=chunk.length) write(chunk.subarray(0,Math.min(chunk.length,length-done)));
    write('\nendstream\nendobj\n');
    for(let index=0;index<500;index++) {
      const id=4+index*2;
      object(id,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << >> /Annots [${id+1} 0 R] >>`);
      object(id+1,`<< /Type /Annot /Subtype /Text /Rect [40 700 62 722] /Contents (Page ${index+1}) /T (Synthetic) /M (D:20261001) >>`);
    }
    const xref = position;
    write(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
    for(let id=1;id<offsets.length;id++) write(`${String(offsets[id]).padStart(10,'0')} 00000 n \n`);
    write(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  } finally { fs.closeSync(output); }
  return destination;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await createFixtures();
  if (process.argv.includes('--large')) createLargeFixture();
  console.log('Synthetic PDFs created.');
}
