/* ExcelJS runs in a separate worker so generating Excel remains cancellable. */
importScripts('./vendor/exceljs.min.js');

self.onmessage = async ({ data }) => {
  try {
    const { rows, sourceName, lang, failedPages, textFailures } = data;
    const fr = lang === 'fr';
    if (rows.some(row => row.some(value => typeof value === 'string' && value.length > 32767))) {
      throw new Error('longCell');
    }
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Extracto Commento';
    workbook.created = new Date();
    const sheet = workbook.addWorksheet(fr ? 'Commentaires' : 'Comments', {
      views: [{ showGridLines: false, state: 'frozen', ySplit: 7 }],
    });
    const stamp = new Date();
    const pad = value => String(value).padStart(2, '0');
    sheet.getCell('A1').value = fr ? 'Titre du fichier :' : 'File title:';
    sheet.getCell('D1').value = sourceName;
    sheet.getCell('A2').value = fr ? 'Date de l’extraction :' : 'Extraction date:';
    sheet.getCell('D2').value = `${stamp.getFullYear()}-${pad(stamp.getMonth()+1)}-${pad(stamp.getDate())} ${pad(stamp.getHours())}:${pad(stamp.getMinutes())}:${pad(stamp.getSeconds())}`;
    sheet.getCell('A3').value = fr ? 'Nombre de commentaires :' : 'Number of comments:';
    sheet.getCell('D3').value = rows.length;
    for (const address of ['A1', 'A2', 'A3']) sheet.getCell(address).font = { bold: true };
    if (failedPages.length || textFailures.length) {
      sheet.getCell('A4').value = fr ? 'Extraction partielle :' : 'Partial extraction:';
      sheet.getCell('A4').font = { bold: true, color: { argb: 'FFA35213' } };
      sheet.getCell('D4').value = [
        failedPages.length ? `${fr ? 'Pages illisibles' : 'Unreadable pages'}: ${failedPages.join(', ')}` : '',
        textFailures.length ? `${fr ? 'Texte couvert indisponible' : 'Marked text unavailable'}: ${textFailures.join(', ')}` : '',
      ].filter(Boolean).join(' | ');
    }
    sheet.getCell('A5').value = fr
      ? 'Extracto Commento — Vérifiez les résultats avant utilisation. Le texte couvert par un surlignage ou un texte barré est estimé.'
      : 'Extracto Commento — Review results before use. Text covered by highlights or strikeouts is estimated.';
    sheet.getCell('A5').font = { italic: true, size: 10 };
    sheet.getRow(7).values = fr ? ['No', 'Page', 'Auteur', 'Date', 'Commentaire'] : ['No', 'Page', 'Author', 'Date', 'Comment'];
    for (const row of rows) sheet.addRow(row); // Strings stay strings, never formula objects.
    const border = { style: 'thin', color: { argb: 'FFBFC8C4' } };
    for (let row = 7; row <= sheet.rowCount; row++) {
      for (let column = 1; column <= 5; column++) {
        const cell = sheet.getCell(row, column);
        cell.border = { top: border, bottom: border, left: border, right: border };
        cell.alignment = { wrapText: true, vertical: 'middle', horizontal: column <= 4 ? 'center' : 'left' };
        if (row === 7) cell.font = { bold: true };
      }
    }
    for (let column = 1; column <= 5; column++) {
      let width = 10;
      for (let row = 7; row <= sheet.rowCount; row++) width = Math.max(width, String(sheet.getCell(row, column).value ?? '').length + 2);
      sheet.getColumn(column).width = Math.min(width, 80);
    }
    sheet.autoFilter = { from: { row: 7, column: 1 }, to: { row: sheet.rowCount, column: 5 } };
    const bytes = await workbook.xlsx.writeBuffer();
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    self.postMessage({ buffer }, [buffer]);
  } catch (error) { self.postMessage({ error: error.message }); }
};
