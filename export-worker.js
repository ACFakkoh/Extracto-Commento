/* ExcelJS runs in a separate worker so generating Excel remains cancellable. */
importScripts('./vendor/exceljs.min.js');

self.onmessage = async ({ data }) => {
  try {
    const { rows, sourceName, lang, failedPages, textFailures, omittedFiles, batch, disclaimer, sources } = data;
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
    sheet.getCell('A1').value = batch ? (fr ? 'Fichiers du lot :' : 'Batch files:') : (fr ? 'Titre du fichier :' : 'File title:');
    sheet.getCell('D1').value = batch ? (fr ? 'Voir l’onglet Fichiers' : 'See the Files sheet') : sourceName;
    sheet.getCell('A2').value = fr ? 'Date de l’extraction :' : 'Extraction date:';
    sheet.getCell('D2').value = `${stamp.getFullYear()}-${pad(stamp.getMonth()+1)}-${pad(stamp.getDate())} ${pad(stamp.getHours())}:${pad(stamp.getMinutes())}:${pad(stamp.getSeconds())}`;
    sheet.getCell('A3').value = fr ? 'Nombre de commentaires :' : 'Number of comments:';
    sheet.getCell('D3').value = rows.length;
    for (const address of ['A1', 'A2', 'A3']) sheet.getCell(address).font = { bold: true };
    if (failedPages.length || textFailures.length || omittedFiles.length) {
      sheet.getCell('A4').value = fr ? 'Extraction partielle :' : 'Partial extraction:';
      sheet.getCell('A4').font = { bold: true, color: { argb: 'FFA35213' } };
      sheet.getCell('D4').value = [
        failedPages.length ? `${fr ? 'Pages illisibles' : 'Unreadable pages'}: ${failedPages.join(', ')}` : '',
        textFailures.length ? `${fr ? 'Texte couvert indisponible' : 'Marked text unavailable'}: ${textFailures.join(', ')}` : '',
        omittedFiles.length ? `${fr ? 'Fichiers non extraits' : 'Files not extracted'}: ${omittedFiles.join(', ')}` : '',
      ].filter(Boolean).join(' | ');
    }
    sheet.getCell('A5').value = disclaimer;
    sheet.getCell('A5').font = { italic: true, size: 10 };
    const headings = fr ? ['No', ...(batch ? ['Fichier'] : []), 'Page', 'Auteur', 'Date', 'Commentaire'] : ['No', ...(batch ? ['File'] : []), 'Page', 'Author', 'Date', 'Comment'];
    sheet.getRow(7).values = headings;
    for (const row of rows) sheet.addRow(row); // Strings stay strings, never formula objects.
    const border = { style: 'thin', color: { argb: 'FFBFC8C4' } };
    for (let row = 7; row <= sheet.rowCount; row++) {
      for (let column = 1; column <= headings.length; column++) {
        const cell = sheet.getCell(row, column);
        cell.border = { top: border, bottom: border, left: border, right: border };
        cell.alignment = { wrapText: true, vertical: 'middle', horizontal: column === headings.length || (batch && column === 2) ? 'left' : 'center' };
        if (row === 7) cell.font = { bold: true };
      }
    }
    for (let column = 1; column <= headings.length; column++) {
      let width = 10;
      for (let row = 7; row <= sheet.rowCount; row++) width = Math.max(width, String(sheet.getCell(row, column).value ?? '').length + 2);
      sheet.getColumn(column).width = Math.min(width, 80);
    }
    sheet.autoFilter = { from: { row: 7, column: 1 }, to: { row: sheet.rowCount, column: headings.length } };
    if (batch) {
      const files = workbook.addWorksheet(fr ? 'Fichiers' : 'Files', { views:[{state:'frozen',ySplit:1}] });
      files.addRow(fr ? ['Fichier','État','Pages','Commentaires','Détail'] : ['File','Status','Pages','Comments','Detail']);
      for (const source of sources) files.addRow(source);
      files.getRow(1).font = { bold:true };
      files.columns.forEach((column,index) => { column.width = [42,22,12,16,70][index]; column.alignment = { wrapText:true,vertical:'top' }; });
      files.autoFilter = { from:'A1',to:`E${files.rowCount}` };
    }
    // Metadata is subject to the same cell limit as comments; never truncate it silently.
    workbook.eachSheet(sheet => sheet.eachRow(row => row.eachCell(cell => {
      if (typeof cell.value === 'string' && cell.value.length > 32767) throw new Error('longCell');
    })));
    const bytes = await workbook.xlsx.writeBuffer();
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    self.postMessage({ buffer }, [buffer]);
  } catch (error) { self.postMessage({ error: error.message }); }
};
