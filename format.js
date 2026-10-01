export const TYPES = ['Text', 'FreeText', 'Highlight', 'StrikeOut', 'Line'];

export const DISCLAIMERS = {
  fr: 'Extracto Commento — Vérifiez les résultats avant utilisation. Le texte couvert par un surlignage ou un texte barré est estimé.',
  en: 'Extracto Commento — Review results before use. Text covered by highlights or strikeouts is estimated.',
};

export const LABELS = {
  fr: {
    unknown: 'Auteur inconnu', invalidDate: 'Date invalide',
    Text: 'Note', FreeText: 'Zone de texte', Highlight: 'Texte surligné',
    StrikeOut: 'Texte barré', Line: 'Dimension ajoutée',
  },
  en: {
    unknown: 'Unknown author', invalidDate: 'Invalid date',
    Text: 'Note', FreeText: 'Text box', Highlight: 'Highlighted text',
    StrikeOut: 'Struck-through text', Line: 'Dimension added',
  },
};

export function cleanText(value = '') {
  return String(value).replace(/[\n\r]/g, ' ')
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x84\x86-\x9f]/g, '').trim();
}

// Match 0.6: the PDF modification date's calendar day, without timezone conversion.
export function pdfDate(value, lang = 'fr') {
  if (!value) return 'N/A';
  const raw = String(value).replaceAll('D:', '').slice(0, 8);
  if (!/^\d{8}$/.test(raw)) return LABELS[lang].invalidDate;
  const year = Number(raw.slice(0, 4));
  const month = Number(raw.slice(4, 6));
  const day = Number(raw.slice(6, 8));
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  if (year < 1 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return LABELS[lang].invalidDate;
  }
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

export function commentText(record, lang = 'fr') {
  const label = LABELS[lang][record.type];
  if (record.type === 'Highlight' || record.type === 'StrikeOut') {
    const content = record.markedText ? `${label}: "${record.markedText}"` : label;
    return record.note ? `${content} — ${record.note}` : content;
  }
  if (record.type === 'Line') return `${label}: "${record.note}"`;
  return record.note;
}

export function exportRows(records, lang = 'fr', batch = false) {
  return records.map(record => [record.no, ...(batch ? [record.sourceName] : []), record.page,
    record.author || LABELS[lang].unknown, pdfDate(record.modified, lang), commentText(record, lang)]);
}
