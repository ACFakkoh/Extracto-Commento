// Render the shipped synthetic demo for visual inspection, without a PDF server.
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { dependency, root } from './fixtures.mjs';
import { createServer } from '../server.mjs';
const server = createServer();
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const browser = await dependency('playwright').chromium.launch({channel:'chrome',headless:true});
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(async () => {
    const pdfjs = await import('./vendor/pdfjs/pdf.mjs');
    const pdfDocument = await pdfjs.getDocument({
      data:new Uint8Array(await (await fetch('./example.pdf')).arrayBuffer()),
      standardFontDataUrl:new URL('./vendor/pdfjs/standard_fonts/',location.href).href,
    }).promise;
    const pdfPage = await pdfDocument.getPage(1), viewport = pdfPage.getViewport({scale:1.4});
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
    window.document.body.replaceChildren(canvas);
    await pdfPage.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
    await pdfDocument.destroy();
  });
  await page.locator('canvas').screenshot({path:path.join(root,'tests','output','example-page.png')});
  await writeFile(path.join(root,'tests','output','visual-check.txt'),'Synthetic demo rendered successfully.\n');
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
