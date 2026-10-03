import { LABELS, TYPES, DISCLAIMERS, commentText, pdfDate, exportRows } from './format.js';

const COPY = {
  fr: {
    language:'Langue', lead:'Vos commentaires PDF, prêts pour Excel. Extrayez, vérifiez et téléchargez.',
    privacy:'Traitement 100 % local', privacyDetail:'Aucun document n’est envoyé en ligne. Vos PDF restent sur votre appareil.',
    step1:'Choisir les PDF', step2:'Vérifier les commentaires', step3:'Télécharger Excel',
    modeLabel:'Mode d’extraction', singleMode:'Un PDF', batchMode:'Plusieurs PDF → un Excel',
    batchDropTitle:'Déposez vos PDF ici', batchDropHint:'Ensemble ou en plusieurs dépôts : les fichiers s’ajoutent au même lot.',
    batchChoose:'Ajouter des PDF', batchNote:'Analyse un fichier à la fois · un seul Excel combiné avec le nom du PDF pour chaque commentaire',
    batchName: count => `Lot de ${count} PDF`, fileLabel:'Fichier', allFiles:'Tous les fichiers', omittedFiles:'Fichiers non extraits',
    queued:'En attente', processing:'Analyse en cours', done:'Terminé', partialFile:'Partiel', fileError:'Non extrait', fileCancelled:'Annulé',
    documentList:'PDF du lot', batchCancelled:'Analyse annulée. Les PDF déjà terminés restent disponibles; les autres fichiers sont signalés comme non extraits.',
    dropTitle:'Déposez votre PDF ici', dropHint:'ou choisissez un fichier sur votre appareil', choose:'Choisir un PDF', demo:'Essayer un exemple',
    uploadNote:'Un PDF à la fois · notes, zones de texte, surlignages, textes barrés et lignes', clear:'Effacer / changer', cancel:'Annuler',
    preview:'PRÉVISUALISATION', resultsTitle:'Vérifiez vos commentaires', statComments:'commentaires exportables', statPages:'pages analysées', statAuthors:'auteurs',
    searchLabel:'Recherche', searchPlaceholder:'Rechercher un commentaire…', authorLabel:'Auteur', typeLabel:'Type', pageLabel:'Page PDF',
    allAuthors:'Tous les auteurs', allTypes:'Tous les types', allPages:'Toutes les pages', resetFilters:'Réinitialiser les filtres',
    pageHeading:'Page', dateHeading:'Date', commentHeading:'Commentaire', previous:'Précédent', next:'Suivant',
    acceptPartial:'J’ai pris connaissance des pages ou fichiers incomplets et je souhaite exporter ce résultat partiel.',
    exportTitle:'Votre tableau Excel', exportHint:'L’export inclut tous les commentaires retenus, même avec un filtre actif.', download:'Télécharger Excel',
    helpTitle:'Fonctionnement et limites',
    helpLocal:'Le PDF est lu dans votre navigateur. Les bibliothèques sont incluses avec l’outil; aucune analyse distante ni sauvegarde de vos documents n’est effectuée.',
    helpTypes:'Comme en version 0.6, les surlignages sans note et les lignes sans contenu sont exclus. Les notes et zones de texte, ainsi que les textes barrés sans note, sont conservés. Les types non pris en charge sont signalés.',
    helpEstimate:'Le texte sous un surlignage ou un texte barré est estimé. Un fragment peut contenir plus de caractères que la sélection. Vérifiez-le dans le PDF original.',
    helpLimits:'Les annotations aplaties dans une image ne peuvent pas être récupérées. Les PDF protégés par mot de passe doivent être déverrouillés au préalable. Les propriétés spécifiques à un éditeur peuvent ne pas être disponibles.',
    helpVolume:'Cible : jusqu’à 300 Mo et 500 pages sur ordinateur. La consommation mémoire et le temps dépendent du document et de votre appareil. Le fichier est lu par portions; seules les pages utiles sont analysées pour le texte couvert.',
    helpExport:'Le navigateur choisit le dossier de téléchargement. Excel comporte No, Page, Auteur, Date et Commentaire. En mode plusieurs PDF, une colonne Fichier et un onglet Fichiers identifient les sources et leur état. Effacer libère les références de cette session, sans garantir un effacement sécurisé de la mémoire.',
    updated:'Dernière mise à jour :', updatedDate:'3 octobre 2026', github:'Code source sur GitHub',
    loading:'Chargement de l’outil…', ready:'Prêt à ouvrir vos PDF.',
    opening:'Lecture du PDF…', complete:'Extraction terminée. Vérifiez le tableau avant de télécharger.',
    empty:'Aucun commentaire exportable trouvé. Consultez les informations d’extraction; les annotations peuvent être absentes, exclues ou aplaties.',
    partial:'Extraction partielle : certains éléments n’ont pas pu être lus. Consultez les informations d’extraction avant l’export.',
    cancelled:'Analyse annulée. Vous pouvez choisir un autre PDF.', exportCancelled:'Création Excel annulée.', exporting:'Création du fichier Excel…',
    downloaded:'Téléchargement lancé. Votre navigateur gère l’enregistrement du fichier.',
    multiple:'Pour déposer plusieurs fichiers, sélectionnez le mode « Plusieurs PDF → un Excel ».', fileType:'Seuls les fichiers PDF sont acceptés.', emptyFile:'Le fichier est vide (0 octet).',
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
    language:'Language', lead:'Your PDF comments, ready for Excel. Extract, review and download.',
    privacy:'100% local processing', privacyDetail:'No documents are sent online. Your PDFs stay on your device.',
    step1:'Choose PDFs', step2:'Review comments', step3:'Download Excel',
    modeLabel:'Extraction mode', singleMode:'One PDF', batchMode:'Multiple PDFs → one Excel',
    batchDropTitle:'Drop your PDFs here', batchDropHint:'Together or in successive drops: files are added to the same batch.',
    batchChoose:'Add PDFs', batchNote:'One file analysed at a time · one combined Excel with the source PDF for every comment',
    batchName: count => `Batch of ${count} PDFs`, fileLabel:'File', allFiles:'All files', omittedFiles:'Files not extracted',
    queued:'Queued', processing:'Analysing', done:'Complete', partialFile:'Partial', fileError:'Not extracted', fileCancelled:'Cancelled',
    documentList:'Batch PDFs', batchCancelled:'Analysis cancelled. Completed PDFs remain available; other files are listed as not extracted.',
    dropTitle:'Drop your PDF here', dropHint:'or choose a file from your device', choose:'Choose a PDF', demo:'Try an example',
    uploadNote:'One PDF at a time · notes, text boxes, highlights, strikeouts and lines', clear:'Clear / change', cancel:'Cancel',
    preview:'PREVIEW', resultsTitle:'Review your comments', statComments:'exportable comments', statPages:'pages analysed', statAuthors:'authors',
    searchLabel:'Search', searchPlaceholder:'Search comments…', authorLabel:'Author', typeLabel:'Type', pageLabel:'PDF page',
    allAuthors:'All authors', allTypes:'All types', allPages:'All pages', resetFilters:'Reset filters',
    pageHeading:'Page', dateHeading:'Date', commentHeading:'Comment', previous:'Previous', next:'Next',
    acceptPartial:'I have reviewed the incomplete pages or files and wish to export these partial results.',
    exportTitle:'Your Excel spreadsheet', exportHint:'The export includes all retained comments, even when a filter is active.', download:'Download Excel',
    helpTitle:'How it works and limitations',
    helpLocal:'The PDF is read in your browser. Libraries are included with this tool; no remote analysis or document storage takes place.',
    helpTypes:'As in version 0.6, highlights without notes and lines without content are excluded. Notes, text boxes and strikeouts without notes are retained. Unsupported types are reported.',
    helpEstimate:'Text covered by a highlight or strikeout is estimated. A fragment may contain more characters than the selection. Check it against your original PDF.',
    helpLimits:'Annotations flattened into an image cannot be recovered. Password-protected PDFs must be unlocked beforehand. Editor-specific properties may not be available.',
    helpVolume:'Target: up to 300 MB and 500 pages on desktop. Memory and time depend on the document and device. The file is read in chunks; marked text is extracted only on relevant pages.',
    helpExport:'Your browser controls the download folder. Excel includes No, Page, Author, Date and Comment. Multiple PDF mode adds a File column and a Files sheet with each source and its status. Clear releases this session’s references, without guaranteeing secure memory erasure.',
    updated:'Last updated:', updatedDate:'October 3, 2026', github:'Source code on GitHub',
    loading:'Loading the tool…', ready:'Ready to open your PDFs.',
    opening:'Reading the PDF…', complete:'Extraction complete. Review the table before downloading.',
    empty:'No exportable comments found. Check the extraction information; annotations may be absent, excluded or flattened.',
    partial:'Partial extraction: some elements could not be read. Review the extraction information before exporting.',
    cancelled:'Analysis cancelled. You can choose another PDF.', exportCancelled:'Excel generation cancelled.', exporting:'Creating the Excel file…',
    downloaded:'Download started. Your browser manages saving the file.',
    multiple:'To drop several files, select “Multiple PDFs → one Excel”.', fileType:'Only PDF files are accepted.', emptyFile:'The file is empty (0 bytes).',
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
let mode = 'single', documents = [];
let fileName = '', fileSize = 0, tablePage = 1;
let controller = null, exportWorker = null, busy = false, libraryReady = false;
let operation = 0, statusKey = 'loading', statusKind = '';
let extractPdf;
const PAGE_SIZE = 50;
const t = key => COPY[lang][key];
const displaySize = bytes => bytes < 1024*1024 ? `${(bytes/1024).toFixed(0)} ${lang === 'fr' ? 'Ko' : 'KB'}` : `${(bytes/1024/1024).toFixed(1)} ${lang === 'fr' ? 'Mo' : 'MB'}`;
const isPartial = () => Boolean(result && (result.failedPages.length || result.textFailures.length || result.omittedFiles.length));
const canAdd = () => libraryReady && (!busy || (mode === 'batch' && controller && !controller.signal.aborted));

function showStatus(key, kind = '') {
  statusKey = key; statusKind = kind;
  $('status').textContent = t(key) || t('unexpected');
  $('status-box').className = `status-box ${kind}`;
}

function setBusy(value) {
  busy = value;
  $('choose').disabled = !canAdd();
  $('demo').disabled = value || !libraryReady;
  $('file').disabled = !canAdd();
  $('language').disabled = value;
  $('import-mode').disabled = value;
  $('progress-card').hidden = !value;
  updateDownload();
}

function updateDownload() {
  $('download').disabled = busy || !result?.records.length || (isPartial() && !$('accept-partial').checked);
  $('download').textContent = result?.records.length ? t('downloadCount')(result.records.length) : t('download');
}

function step(index) {
  [...$('steps').children].forEach((item, position) => item.className = position === index ? 'current' : position < index ? 'done' : '');
}

function reset() {
  operation++;
  controller?.abort(); controller = null;
  exportWorker?.terminate(); exportWorker = null;
  result = null; documents = []; fileName = ''; fileSize = 0;
  $('file').value = ''; $('file-card').hidden = true; $('dropzone').hidden = false; $('results').hidden = true;
  $('rows').replaceChildren(); $('accept-partial').checked = false;
  clearFilters(); updateMode(); renderDocuments(); setBusy(false); step(0); showStatus(libraryReady ? 'ready' : 'loading');
}

function updateMode() {
  const batch = mode === 'batch';
  $('file').multiple = batch;
  $('dropzone').hidden = !batch && documents.length > 0;
  $('file-filter-label').hidden = !batch;
  $('file-heading').hidden = !batch;
  document.querySelector('.filters').classList.toggle('batch',batch);
  $('upload-title').textContent = t(batch ? 'batchDropTitle' : 'dropTitle');
  $('choose').textContent = t(batch ? 'batchChoose' : 'choose');
  document.querySelector('[data-i18n="dropHint"]').textContent = t(batch ? 'batchDropHint' : 'dropHint');
  document.querySelector('[data-i18n="uploadNote"]').textContent = t(batch ? 'batchNote' : 'uploadNote');
}

function sourceDetail(source) {
  if (source.error) return t(source.error);
  if (!source.result) return '';
  return `${t('meta')(displaySize(source.size),source.result.pages)} · ${source.result.records.length} ${t('statComments')}`;
}

function sourceStatus(source) {
  if (source.error) return t(source.status === 'cancelled' ? 'fileCancelled' : 'fileError');
  return source.result && (source.result.failedPages.length || source.result.textFailures.length) ? t('partialFile') : t(source.status);
}

function renderDocuments() {
  $('file-card').hidden = !documents.length;
  $('filename').textContent = mode === 'batch' ? t('batchName')(documents.length) : fileName;
  $('filemeta').textContent = t('meta')(displaySize(fileSize),result?.pages || 0);
  const list = $('document-list');
  list.hidden = mode !== 'batch' || !documents.length;
  list.setAttribute('aria-label',t('documentList'));
  list.replaceChildren(...documents.map(source => {
    const item = document.createElement('li'); item.className = `document ${source.status}`;
    const info = document.createElement('div');
    const name = document.createElement('strong'); name.textContent = source.name;
    const detail = document.createElement('p'); detail.textContent = sourceDetail(source) || displaySize(source.size);
    const status = document.createElement('span'); status.className = 'document-status';
    status.textContent = sourceStatus(source);
    info.append(name,detail); item.append(info,status); return item;
  }));
}

function combineResults() {
  const completed = documents.filter(source => source.result);
  if (!completed.length) { result = null; return; }
  result = { records:[],pages:0,excludedHighlights:0,excludedLines:0,unsupported:{},failedPages:[],textFailures:[],missingText:0,elapsedMs:0,
    omittedFiles:documents.filter(source => source.error).map(source => `${source.name}: ${t(source.error)}`) };
  for (const source of completed) {
    const extracted = source.result;
    for (const record of extracted.records) result.records.push({ ...record,no:result.records.length+1,sourceId:source.id,sourceName:source.name });
    for (const key of ['pages','excludedHighlights','excludedLines','missingText','elapsedMs']) result[key] += extracted[key];
    for (const [type,count] of Object.entries(extracted.unsupported)) result.unsupported[type] = (result.unsupported[type] || 0) + count;
    for (const key of ['failedPages','textFailures']) result[key].push(...extracted[key].map(page => mode === 'batch' ? `${source.name} · ${page}` : page));
  }
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
  options('file-filter', documents.filter(source => source.result).map(source => source.id), 'allFiles', id => documents.find(source => source.id === id).name);
}

function clearFilters() {
  $('search').value = '';
  for (const id of ['author-filter','type-filter','page-filter','file-filter']) $(id).value = '';
  tablePage = 1;
}

function renderTable() {
  if (!result) return;
  const query = $('search').value.toLocaleLowerCase(lang).trim();
  const author = $('author-filter').value, type = $('type-filter').value, page = $('page-filter').value, source = $('file-filter').value;
  const records = result.records.filter(record =>
    (!author || record.author === JSON.parse(author)) && (!type || record.type === type) && (!page || record.page === Number(page)) && (!source || record.sourceId === source) &&
    (!query || [commentText(record,lang), record.sourceName, record.author || LABELS[lang].unknown, LABELS[lang][record.type], pdfDate(record.modified,lang), String(record.page)]
      .some(value => value.toLocaleLowerCase(lang).includes(query))));
  const views = Math.max(1,Math.ceil(records.length / PAGE_SIZE));
  tablePage = Math.min(tablePage,views);
  const fragment = document.createDocumentFragment();
  for (const record of records.slice((tablePage-1)*PAGE_SIZE,tablePage*PAGE_SIZE)) {
    const row = document.createElement('tr');
    const values = [['number',record.no],...(mode === 'batch' ? [['source',record.sourceName]] : []),['page',record.page],['author',record.author || LABELS[lang].unknown],['date',pdfDate(record.modified,lang)],['type',LABELS[lang][record.type]]];
    for (const [kind,value] of values) {
      const cell = document.createElement('td'); cell.className = `${kind}-cell`; cell.textContent = value; row.append(cell);
    }
    const cell = document.createElement('td'); cell.className = 'comment-cell';
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
    cell.colSpan = mode === 'batch' ? 7 : 6; cell.className = 'empty-row'; cell.textContent = t('noMatch'); row.append(cell); fragment.append(row);
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
  if (result.omittedFiles.length) warnings.push(`${t('omittedFiles')} : ${result.omittedFiles.join(' | ')}`);
  if (result.missingText) warnings.push(`${result.missingText} ${t('missingText')}`);
  if (result.records.some(record => record.estimated)) warnings.push(t('estimatedWarning'));
  if (documents.some(source => source.size > 300*1024*1024)) warnings.push(t('large'));
  $('diagnostics').hidden = !warnings.length;
  $('diagnostics-title').textContent = `${t('warnings')} · ${warnings.length}`;
  $('warning-list').replaceChildren(...warnings.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  const partial = isPartial();
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
  $('disclaimer').textContent = DISCLAIMERS[lang];
  updateMode(); combineResults(); renderDocuments();
  showStatus(statusKey,statusKind);
  if (result) renderResults();
  else if (fileName) $('filemeta').textContent = t('meta')(displaySize(fileSize),0);
}

function addFiles(files) {
  if (!files.length || !canAdd()) return;
  if (mode === 'single' && files.length !== 1) { showStatus('multiple','error'); return; }
  if (mode === 'single') reset();
  for (const file of files) documents.push({ id:String(documents.length+1),name:file.name,size:file.size,file,status:'queued' });
  fileName = documents[0].name; fileSize = documents.reduce((sum,source) => sum+source.size,0);
  $('accept-partial').checked = false;
  updateMode(); renderDocuments(); updateDownload(); step(0);
  if (!busy) void processQueue();
}

async function processQueue() {
  const token = ++operation;
  controller = new AbortController();
  const signal = controller.signal;
  setBusy(true); showStatus('opening');
  let source;
  try {
    while ((source = documents.find(item => item.status === 'queued'))) {
      source.status = 'processing'; renderDocuments();
      $('progress').removeAttribute('value'); $('progress-label').textContent = `${source.name} · ${t('opening')}`;
      try {
        source.result = await extractPdf(source.file,{ signal,onProgress:({ page,total,count }) => {
          if (token !== operation) return;
          $('progress').max = total; $('progress').value = page;
          $('progress-label').textContent = `${source.name} · ${t('progress')(page,total,count)}`;
        }});
        if (token !== operation) return;
        source.status = 'done';
      } catch (error) {
        if (token !== operation) return;
        source.error = error.name === 'AbortError' ? 'cancelled' : error.name === 'PasswordException' ? 'password'
          : ['InvalidPDFException','FormatError'].includes(error.name) ? 'corrupt' : COPY[lang][error.message] ? error.message : 'unexpected';
        source.status = source.error === 'cancelled' ? 'cancelled' : 'error';
        if (signal.aborted) {
          for (const pending of documents.filter(item => item.status === 'queued')) {
            pending.status = 'cancelled'; pending.error = 'cancelled'; delete pending.file;
          }
        }
      } finally { delete source.file; }
      combineResults(); renderDocuments();
      $('results').hidden = !result;
      if (result) renderResults();
      if (signal.aborted) break;
    }
    step(result ? 1 : 0);
    if (signal.aborted) showStatus(mode === 'batch' ? 'batchCancelled' : 'cancelled');
    else if (mode === 'single' && documents[0].error) showStatus(documents[0].error,'error');
    else if (isPartial() || documents.some(item => item.error)) showStatus('partial','error');
    else showStatus(result?.records.length ? 'complete' : 'empty',result?.records.length ? 'success' : '');
  } finally {
    if (token === operation) { controller = null; setBusy(false); }
  }
}

function download() {
  if ($('download').disabled || !result) return;
  const batch = mode === 'batch';
  const rows = exportRows(result.records,lang,batch);
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
    const stem = batch ? 'Extracto_Commento_lot' : fileName.replace(/\.pdf$/i,'');
    link.download = `${stem.replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').slice(0,160)}_extraction_comm.xlsx`;
    document.body.append(link); link.click(); link.remove();
    // Leave the download time to consume the URL; release it afterwards.
    setTimeout(() => URL.revokeObjectURL(url),30000);
    finish(); step(2); showStatus('downloaded','success');
  };
  const sources = documents.map(source => [source.name,sourceStatus(source),
    source.result?.pages ?? '',source.result?.records.length ?? '',source.error ? t(source.error) : [
      source.result?.failedPages.length ? `${t('failedPages')}: ${source.result.failedPages.join(', ')}` : '',
      source.result?.textFailures.length ? `${t('textFailures')}: ${source.result.textFailures.join(', ')}` : '',
    ].filter(Boolean).join(' | ')]);
  exportWorker.postMessage({ rows,sourceName:fileName,lang,batch,disclaimer:DISCLAIMERS[lang],sources,
    failedPages:result.failedPages,textFailures:result.textFailures,omittedFiles:result.omittedFiles });
}

$('choose').addEventListener('click',() => $('file').click());
$('file').addEventListener('change',() => { const files = [...$('file').files]; $('file').value = ''; addFiles(files); });
for (const id of ['mode-single','mode-batch']) $(id).addEventListener('change',event => { mode = event.target.value; reset(); });
$('clear').addEventListener('click',reset);
$('cancel').addEventListener('click',() => {
  if (exportWorker) { operation++; exportWorker.terminate(); exportWorker = null; setBusy(false); showStatus('exportCancelled'); }
  else { controller?.abort(); setBusy(true); }
});
$('download').addEventListener('click',download);
$('accept-partial').addEventListener('change',updateDownload);
$('language').addEventListener('change',event => { lang = event.target.value; translate(); });
for (const id of ['search','author-filter','type-filter','page-filter','file-filter']) $(id).addEventListener(id === 'search' ? 'input' : 'change',() => { tablePage = 1; renderTable(); });
$('reset-filters').addEventListener('click',() => { clearFilters(); renderTable(); });
$('previous').addEventListener('click',() => { tablePage--; renderTable(); });
$('next').addEventListener('click',() => { tablePage++; renderTable(); });
for (const name of ['dragenter','dragover']) $('dropzone').addEventListener(name,event => { event.preventDefault(); if (canAdd()) $('dropzone').classList.add('drag'); });
$('dropzone').addEventListener('dragleave',event => { if (!$('dropzone').contains(event.relatedTarget)) $('dropzone').classList.remove('drag'); });
document.addEventListener('dragover',event => { if ([...event.dataTransfer.types].includes('Files')) event.preventDefault(); });
document.addEventListener('drop',event => {
  event.preventDefault(); $('dropzone').classList.remove('drag');
  addFiles([...event.dataTransfer.files]);
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
    setBusy(false); addFiles([new File([blob],'exemple-commentaires.pdf',{ type:'application/pdf' })]);
  } catch { if (token === operation) { setBusy(false); showStatus('readError','error'); } }
});

translate();
import('./extract.js').then(module => {
  extractPdf = module.extractPdf; libraryReady = true; setBusy(false); showStatus('ready');
}).catch(() => showStatus('dependencies','error'));
