import { LABELS, TYPES, commentText, pdfDate, exportRows } from './format.js';

const COPY = {
  fr: {
    language:'Langue', eyebrow:'DU PDF AU TABLEAU, SIMPLEMENT', headline:'Vos commentaires PDF,\nprêts pour Excel.',
    lead:'Extrayez, vérifiez et téléchargez. Vos documents restent sur votre appareil.',
    privacy:'Traitement local · aucun document envoyé', step1:'Choisir un PDF', step2:'Vérifier les commentaires', step3:'Télécharger Excel',
    dropTitle:'Déposez votre PDF ici', dropHint:'ou choisissez un fichier sur votre appareil', choose:'Choisir un PDF', demo:'Essayer un exemple',
    uploadNote:'Un PDF à la fois · notes, zones de texte, surlignages, textes barrés et lignes', clear:'Effacer / changer', cancel:'Annuler',
    preview:'PRÉVISUALISATION', resultsTitle:'Vérifiez vos commentaires', statComments:'commentaires exportables', statPages:'pages analysées', statAuthors:'auteurs',
    searchLabel:'Recherche', searchPlaceholder:'Rechercher un commentaire…', authorLabel:'Auteur', typeLabel:'Type', pageLabel:'Page PDF',
    allAuthors:'Tous les auteurs', allTypes:'Tous les types', allPages:'Toutes les pages', resetFilters:'Réinitialiser les filtres',
    pageHeading:'Page', dateHeading:'Date', commentHeading:'Commentaire', previous:'Précédent', next:'Suivant',
    acceptPartial:'J’ai pris connaissance des pages incomplètes et je souhaite exporter ce résultat partiel.',
    exportTitle:'Votre tableau Excel', exportHint:'L’export inclut tous les commentaires retenus, même avec un filtre actif.', download:'Télécharger Excel',
    helpTitle:'Fonctionnement et limites',
    helpLocal:'Le PDF est lu dans votre navigateur. Les bibliothèques sont incluses avec l’outil; aucune analyse distante ni sauvegarde de vos documents n’est effectuée.',
    helpTypes:'Comme en version 0.6, les surlignages sans note et les lignes sans contenu sont exclus. Les notes et zones de texte, ainsi que les textes barrés sans note, sont conservés. Les types non pris en charge sont signalés.',
    helpEstimate:'Le texte sous un surlignage ou un texte barré est estimé. Un fragment peut contenir plus de caractères que la sélection. Vérifiez-le dans le PDF original.',
    helpLimits:'Les annotations aplaties dans une image ne peuvent pas être récupérées. Les PDF protégés par mot de passe doivent être déverrouillés au préalable. Les propriétés spécifiques à un éditeur peuvent ne pas être disponibles.',
    helpVolume:'Cible : jusqu’à 300 Mo et 500 pages sur ordinateur. La consommation mémoire et le temps dépendent du document et de votre appareil. Le fichier est lu par portions; seules les pages utiles sont analysées pour le texte couvert.',
    helpExport:'Le navigateur choisit le dossier de téléchargement. Le fichier Excel comporte No, Page, Auteur, Date et Commentaire. Effacer libère les références de cette session, sans garantir un effacement sécurisé de la mémoire.',
    footer:'Un outil d’Anthony Chéruel · PDF uniquement', loading:'Chargement de l’outil…', ready:'Prêt à ouvrir votre PDF.',
    opening:'Lecture du PDF…', complete:'Extraction terminée. Vérifiez le tableau avant de télécharger.',
    empty:'Aucun commentaire exportable trouvé. Consultez les informations d’extraction; les annotations peuvent être absentes, exclues ou aplaties.',
    partial:'Extraction partielle : certains éléments n’ont pas pu être lus. Consultez les informations d’extraction avant l’export.',
    cancelled:'Analyse annulée. Vous pouvez choisir un autre PDF.', exportCancelled:'Création Excel annulée.', exporting:'Création du fichier Excel…',
    downloaded:'Téléchargement lancé. Votre navigateur gère l’enregistrement du fichier.',
    multiple:'Choisissez un seul PDF à la fois.', fileType:'Seuls les fichiers PDF sont acceptés.', emptyFile:'Le fichier est vide (0 octet).',
    invalidPdf:'Ce fichier ne contient pas un PDF valide.', corrupt:'Le PDF est illisible ou corrompu.', password:'Ce PDF est protégé par mot de passe. Ouvrez une copie déverrouillée.',
    readError:'Impossible de lire le fichier local. Sélectionnez-le à nouveau.', unexpected:'Le traitement a échoué. Essayez à nouveau ou avec un autre PDF.',
    dependencies:'Impossible de charger l’outil. Lancez Lancer.cmd puis ouvrez http://127.0.0.1:8765 dans un navigateur récent.',
    longCell:'Un commentaire dépasse la limite Excel de 32 767 caractères. Aucun texte n’a été tronqué; l’export est bloqué.',
    exportError:'Impossible de générer Excel. Les commentaires restent disponibles dans le tableau.',
    noMatch:'Aucun commentaire ne correspond aux filtres.', estimated:'Texte estimé', reply:'Réponse',
    warnings:'Informations d’extraction', filtered:'commentaires affichés sur', total:'au total',
    excludedHighlights:'surlignage(s) sans note exclus, comme en 0.6.', excludedLines:'ligne(s) sans contenu exclues, comme en 0.6.',
    unsupported:'Annotation(s) hors périmètre', failedPages:'Pages non analysées', textFailures:'Pages dont le texte couvert est illisible',
    missingText:'marquage(s) sans texte couvert récupérable. La note associée est conservée.',
    estimatedWarning:'Le texte sous les surlignages et textes barrés est estimé; vérifiez-le dans le PDF original.',
    large:'Au-delà de la cible de 300 Mo : le traitement dépendra des ressources de votre appareil.',
    progress:(page,total,count) => `Page ${page} / ${total} · ${count} commentaires`,
    pagination:(page,total) => `Affichage ${page} / ${total}`, downloadCount: count => `Télécharger Excel · ${count}`,
    duration: seconds => `Analyse en ${seconds} s`, meta:(size,pages) => `${size}${pages ? ` · ${pages} ${pages === 1 ? 'page' : 'pages'}` : ''}`,
  },
  en: {
    language:'Language', eyebrow:'FROM PDF TO SPREADSHEET, SIMPLY', headline:'Your PDF comments,\nready for Excel.',
    lead:'Extract, review and download. Your documents stay on your device.',
    privacy:'Local processing · no document uploads', step1:'Choose a PDF', step2:'Review comments', step3:'Download Excel',
    dropTitle:'Drop your PDF here', dropHint:'or choose a file from your device', choose:'Choose a PDF', demo:'Try an example',
    uploadNote:'One PDF at a time · notes, text boxes, highlights, strikeouts and lines', clear:'Clear / change', cancel:'Cancel',
    preview:'PREVIEW', resultsTitle:'Review your comments', statComments:'exportable comments', statPages:'pages analysed', statAuthors:'authors',
    searchLabel:'Search', searchPlaceholder:'Search comments…', authorLabel:'Author', typeLabel:'Type', pageLabel:'PDF page',
    allAuthors:'All authors', allTypes:'All types', allPages:'All pages', resetFilters:'Reset filters',
    pageHeading:'Page', dateHeading:'Date', commentHeading:'Comment', previous:'Previous', next:'Next',
    acceptPartial:'I have reviewed the incomplete pages and wish to export these partial results.',
    exportTitle:'Your Excel spreadsheet', exportHint:'The export includes all retained comments, even when a filter is active.', download:'Download Excel',
    helpTitle:'How it works and limitations',
    helpLocal:'The PDF is read in your browser. Libraries are included with this tool; no remote analysis or document storage takes place.',
    helpTypes:'As in version 0.6, highlights without notes and lines without content are excluded. Notes, text boxes and strikeouts without notes are retained. Unsupported types are reported.',
    helpEstimate:'Text covered by a highlight or strikeout is estimated. A fragment may contain more characters than the selection. Check it against your original PDF.',
    helpLimits:'Annotations flattened into an image cannot be recovered. Password-protected PDFs must be unlocked beforehand. Editor-specific properties may not be available.',
    helpVolume:'Target: up to 300 MB and 500 pages on desktop. Memory and time depend on the document and device. The file is read in chunks; marked text is extracted only on relevant pages.',
    helpExport:'Your browser controls the download folder. The Excel columns are No, Page, Author, Date and Comment. Clear releases this session’s references, without guaranteeing secure memory erasure.',
    footer:'A tool by Anthony Chéruel · PDF only', loading:'Loading the tool…', ready:'Ready to open your PDF.',
    opening:'Reading the PDF…', complete:'Extraction complete. Review the table before downloading.',
    empty:'No exportable comments found. Check the extraction information; annotations may be absent, excluded or flattened.',
    partial:'Partial extraction: some elements could not be read. Review the extraction information before exporting.',
    cancelled:'Analysis cancelled. You can choose another PDF.', exportCancelled:'Excel generation cancelled.', exporting:'Creating the Excel file…',
    downloaded:'Download started. Your browser manages saving the file.',
    multiple:'Choose one PDF at a time.', fileType:'Only PDF files are accepted.', emptyFile:'The file is empty (0 bytes).',
    invalidPdf:'This file does not contain a valid PDF.', corrupt:'The PDF is unreadable or corrupt.', password:'This PDF is password protected. Open an unlocked copy.',
    readError:'Unable to read the local file. Select it again.', unexpected:'Processing failed. Try again or choose another PDF.',
    dependencies:'Unable to load the tool. Run Lancer.cmd and open http://127.0.0.1:8765 in a recent browser.',
    longCell:'A comment exceeds Excel’s 32,767-character cell limit. No text was truncated; export is blocked.',
    exportError:'Unable to generate Excel. The comments remain available in the table.',
    noMatch:'No comments match these filters.', estimated:'Estimated text', reply:'Reply', warnings:'Extraction information',
    filtered:'comments shown out of', total:'total', excludedHighlights:'highlight(s) without notes excluded, as in 0.6.',
    excludedLines:'line(s) without content excluded, as in 0.6.', unsupported:'Unsupported annotation(s)',
    failedPages:'Unreadable pages', textFailures:'Pages with unreadable marked text', missingText:'mark(s) with no recoverable covered text. Any associated note is retained.',
    estimatedWarning:'Text under highlights and strikeouts is estimated; check it against the original PDF.',
    large:'Above the 300 MB target: processing will depend on your device’s resources.',
    progress:(page,total,count) => `Page ${page} / ${total} · ${count} comments`,
    pagination:(page,total) => `View ${page} / ${total}`, downloadCount: count => `Download Excel · ${count}`,
    duration: seconds => `Analysed in ${seconds} s`, meta:(size,pages) => `${size}${pages ? ` · ${pages} ${pages === 1 ? 'page' : 'pages'}` : ''}`,
  },
};

const $ = id => document.getElementById(id);
let lang = navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
let result = null;
let fileName = '', fileSize = 0, tablePage = 1;
let controller = null, exportWorker = null, busy = false, libraryReady = false;
let operation = 0, statusKey = 'loading', statusKind = '';
let extractPdf;
const PAGE_SIZE = 50;
const t = key => COPY[lang][key];
const displaySize = bytes => bytes < 1024*1024 ? `${(bytes/1024).toFixed(0)} ${lang === 'fr' ? 'Ko' : 'KB'}` : `${(bytes/1024/1024).toFixed(1)} ${lang === 'fr' ? 'Mo' : 'MB'}`;

function showStatus(key, kind = '') {
  statusKey = key; statusKind = kind;
  $('status').textContent = t(key) || t('unexpected');
  $('status-box').className = `status-box ${kind}`;
}

function setBusy(value) {
  busy = value;
  $('choose').disabled = value || !libraryReady;
  $('demo').disabled = value || !libraryReady;
  $('file').disabled = value || !libraryReady;
  $('language').disabled = value;
  $('progress-card').hidden = !value;
  updateDownload();
}

function updateDownload() {
  const partial = result && (result.failedPages.length || result.textFailures.length);
  $('download').disabled = busy || !result?.records.length || (partial && !$('accept-partial').checked);
  $('download').textContent = result?.records.length ? t('downloadCount')(result.records.length) : t('download');
}

function step(index) {
  [...$('steps').children].forEach((item, position) => item.className = position === index ? 'current' : position < index ? 'done' : '');
}

function reset() {
  operation++;
  controller?.abort(); controller = null;
  exportWorker?.terminate(); exportWorker = null;
  result = null; fileName = ''; fileSize = 0;
  $('file').value = ''; $('file-card').hidden = true; $('dropzone').hidden = false; $('results').hidden = true;
  $('rows').replaceChildren(); $('accept-partial').checked = false;
  clearFilters(); setBusy(false); step(0); showStatus(libraryReady ? 'ready' : 'loading');
}

function options(id, values, label, render = value => value) {
  const select = $(id), previous = select.value;
  select.replaceChildren(new Option(t(label), ''));
  for (const [value,text] of values.map(value => [value,render(value)])) select.add(new Option(text,value));
  select.value = previous;
  if (select.selectedIndex < 0) select.value = '';
}

function buildFilters() {
  const records = result?.records || [];
  const authors = [...new Set(records.map(record => record.author))].sort((a,b) => a.localeCompare(b,lang));
  options('author-filter', authors.map(author => JSON.stringify(author)), 'allAuthors', value => JSON.parse(value) || LABELS[lang].unknown);
  options('type-filter', TYPES.filter(type => records.some(record => record.type === type)), 'allTypes', type => LABELS[lang][type]);
  options('page-filter', [...new Set(records.map(record => record.page))].sort((a,b) => a-b).map(String), 'allPages');
}

function clearFilters() {
  $('search').value = '';
  for (const id of ['author-filter','type-filter','page-filter']) $(id).value = '';
  tablePage = 1;
}

function renderTable() {
  if (!result) return;
  const query = $('search').value.toLocaleLowerCase(lang).trim();
  const author = $('author-filter').value, type = $('type-filter').value, page = $('page-filter').value;
  const records = result.records.filter(record =>
    (!author || record.author === JSON.parse(author)) && (!type || record.type === type) && (!page || record.page === Number(page)) &&
    (!query || [commentText(record,lang), record.author || LABELS[lang].unknown, LABELS[lang][record.type], pdfDate(record.modified,lang), String(record.page)]
      .some(value => value.toLocaleLowerCase(lang).includes(query))));
  const views = Math.max(1,Math.ceil(records.length / PAGE_SIZE));
  tablePage = Math.min(tablePage,views);
  const fragment = document.createDocumentFragment();
  for (const record of records.slice((tablePage-1)*PAGE_SIZE,tablePage*PAGE_SIZE)) {
    const row = document.createElement('tr');
    for (const value of [record.no,record.page,record.author || LABELS[lang].unknown,pdfDate(record.modified,lang),LABELS[lang][record.type]]) {
      const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
    }
    const cell = document.createElement('td');
    const text = commentText(record,lang);
    if (text.length > 260) {
      const details = document.createElement('details'); details.className = 'comment-details';
      const summary = document.createElement('summary'); summary.textContent = `${text.slice(0,210)}…`;
      const full = document.createElement('p'); full.textContent = text;
      details.append(summary,full); cell.append(details);
    } else { const copy = document.createElement('p'); copy.className = 'comment-copy'; copy.textContent = text; cell.append(copy); }
    for (const [show,label] of [[record.estimated,'estimated'],[record.reply,'reply']]) {
      if (show) { const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = t(label); cell.append(tag); }
    }
    row.append(cell); fragment.append(row);
  }
  if (!records.length) {
    const row = document.createElement('tr'), cell = document.createElement('td');
    cell.colSpan = 6; cell.className = 'empty-row'; cell.textContent = t('noMatch'); row.append(cell); fragment.append(row);
  }
  $('rows').replaceChildren(fragment);
  $('visible-count').textContent = `${records.length} ${t('filtered')} ${result.records.length} ${t('total')}`;
  $('pagination-label').textContent = t('pagination')(tablePage,views);
  $('previous').disabled = tablePage === 1;
  $('next').disabled = tablePage >= views;
}

function renderDiagnostics() {
  const warnings = [];
  if (result.excludedHighlights) warnings.push(`${result.excludedHighlights} ${t('excludedHighlights')}`);
  if (result.excludedLines) warnings.push(`${result.excludedLines} ${t('excludedLines')}`);
  const unsupported = Object.entries(result.unsupported);
  if (unsupported.length) warnings.push(`${t('unsupported')} : ${unsupported.map(([type,count]) => `${type} (${count})`).join(', ')}`);
  if (result.failedPages.length) warnings.push(`${t('failedPages')} : ${result.failedPages.join(', ')}`);
  if (result.textFailures.length) warnings.push(`${t('textFailures')} : ${result.textFailures.join(', ')}`);
  if (result.missingText) warnings.push(`${result.missingText} ${t('missingText')}`);
  if (result.records.some(record => record.estimated)) warnings.push(t('estimatedWarning'));
  if (fileSize > 300*1024*1024) warnings.push(t('large'));
  $('diagnostics').hidden = !warnings.length;
  $('diagnostics-title').textContent = `${t('warnings')} · ${warnings.length}`;
  $('warning-list').replaceChildren(...warnings.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  const partial = Boolean(result.failedPages.length || result.textFailures.length);
  $('partial-box').hidden = !partial;
  if (partial) $('diagnostics').open = true;
}

function renderResults() {
  $('count').textContent = result.records.length;
  $('pages').textContent = result.pages - result.failedPages.length;
  $('authors').textContent = new Set(result.records.map(record => record.author)).size;
  $('elapsed').textContent = t('duration')((result.elapsedMs/1000).toFixed(1));
  $('filemeta').textContent = t('meta')(displaySize(fileSize),result.pages);
  buildFilters(); renderDiagnostics(); renderTable(); updateDownload();
}

function translate() {
  document.documentElement.lang = lang;
  document.title = lang === 'fr' ? 'Extracto Commento — PDF vers Excel' : 'Extracto Commento — PDF to Excel';
  $('language').value = lang;
  document.querySelectorAll('[data-i18n]').forEach(element => element.textContent = t(element.dataset.i18n));
  document.querySelectorAll('[data-placeholder]').forEach(element => element.placeholder = t(element.dataset.placeholder));
  $('steps').setAttribute('aria-label',lang === 'fr' ? 'Étapes' : 'Steps');
  showStatus(statusKey,statusKind);
  if (result) renderResults();
  else if (fileName) $('filemeta').textContent = t('meta')(displaySize(fileSize),0);
}

async function start(file) {
  if (!file || busy || !libraryReady) return;
  reset();
  const token = ++operation;
  controller = new AbortController();
  const signal = controller.signal;
  fileName = file.name; fileSize = file.size;
  $('filename').textContent = fileName;
  $('filemeta').textContent = t('meta')(displaySize(fileSize),0);
  $('dropzone').hidden = true; $('file-card').hidden = false;
  $('progress').removeAttribute('value'); $('progress-label').textContent = t('opening');
  setBusy(true); showStatus('opening'); step(0);
  try {
    const extracted = await extractPdf(file,{ signal, onProgress: ({ page,total,count }) => {
      if (token !== operation) return;
      $('progress').max = total; $('progress').value = page;
      $('progress-label').textContent = t('progress')(page,total,count);
    }});
    if (token !== operation) return;
    result = extracted;
    $('results').hidden = false;
    renderResults(); step(1);
    showStatus(result.failedPages.length || result.textFailures.length ? 'partial' : result.records.length ? 'complete' : 'empty', result.records.length ? 'success' : '');
  } catch (error) {
    if (token !== operation) return;
    const key = error.name === 'AbortError' ? 'cancelled' : error.name === 'PasswordException' ? 'password'
      : ['InvalidPDFException','FormatError'].includes(error.name) ? 'corrupt' : COPY[lang][error.message] ? error.message : 'unexpected';
    showStatus(key,key === 'cancelled' ? '' : 'error');
  } finally {
    if (token === operation) { controller = null; setBusy(false); }
  }
}

function download() {
  if ($('download').disabled || !result) return;
  const rows = exportRows(result.records,lang);
  if (rows.some(row => row.some(value => typeof value === 'string' && value.length > 32767))) { showStatus('longCell','error'); return; }
  const token = ++operation;
  setBusy(true); showStatus('exporting');
  $('progress-label').textContent = t('exporting'); $('progress').removeAttribute('value');
  exportWorker = new Worker(new URL('./export-worker.js',import.meta.url));
  const finish = () => { exportWorker?.terminate(); exportWorker = null; setBusy(false); };
  exportWorker.onerror = () => { if (token === operation) { finish(); showStatus('exportError','error'); } };
  exportWorker.onmessage = ({ data }) => {
    if (token !== operation) return;
    if (data.error) { finish(); showStatus(data.error === 'longCell' ? 'longCell' : 'exportError','error'); return; }
    const url = URL.createObjectURL(new Blob([data.buffer],{ type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace(/\.pdf$/i,'').replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').slice(0,160)}_extraction_comm.xlsx`;
    document.body.append(link); link.click(); link.remove();
    // Leave the download time to consume the URL; release it afterwards.
    setTimeout(() => URL.revokeObjectURL(url),30000);
    finish(); step(2); showStatus('downloaded','success');
  };
  exportWorker.postMessage({ rows, sourceName:fileName, lang, failedPages:result.failedPages, textFailures:result.textFailures });
}

$('choose').addEventListener('click',() => $('file').click());
$('file').addEventListener('change',() => { const file = $('file').files[0]; $('file').value = ''; void start(file); });
$('clear').addEventListener('click',reset);
$('cancel').addEventListener('click',() => {
  if (exportWorker) { operation++; exportWorker.terminate(); exportWorker = null; setBusy(false); showStatus('exportCancelled'); }
  else controller?.abort();
});
$('download').addEventListener('click',download);
$('accept-partial').addEventListener('change',updateDownload);
$('language').addEventListener('change',event => { lang = event.target.value; translate(); });
for (const id of ['search','author-filter','type-filter','page-filter']) $(id).addEventListener(id === 'search' ? 'input' : 'change',() => { tablePage = 1; renderTable(); });
$('reset-filters').addEventListener('click',() => { clearFilters(); renderTable(); });
$('previous').addEventListener('click',() => { tablePage--; renderTable(); });
$('next').addEventListener('click',() => { tablePage++; renderTable(); });
for (const name of ['dragenter','dragover']) $('dropzone').addEventListener(name,event => { event.preventDefault(); if (!busy) $('dropzone').classList.add('drag'); });
$('dropzone').addEventListener('dragleave',event => { if (!$('dropzone').contains(event.relatedTarget)) $('dropzone').classList.remove('drag'); });
document.addEventListener('dragover',event => { if ([...event.dataTransfer.types].includes('Files')) event.preventDefault(); });
document.addEventListener('drop',event => {
  event.preventDefault(); $('dropzone').classList.remove('drag');
  if (busy || !libraryReady) return;
  if (event.dataTransfer.files.length !== 1) { showStatus('multiple','error'); return; }
  void start(event.dataTransfer.files[0]);
});
$('demo').addEventListener('click',async () => {
  if (busy) return;
  const token = ++operation;
  setBusy(true);
  try {
    const response = await fetch('./example.pdf');
    if (!response.ok) throw new Error('readError');
    const blob = await response.blob();
    if (token !== operation) return;
    setBusy(false); await start(new File([blob],'exemple-commentaires.pdf',{ type:'application/pdf' }));
  } catch { if (token === operation) { setBusy(false); showStatus('readError','error'); } }
});

translate();
import('./extract.js').then(module => {
  extractPdf = module.extractPdf; libraryReady = true; setBusy(false); showStatus('ready');
}).catch(() => showStatus('dependencies','error'));
