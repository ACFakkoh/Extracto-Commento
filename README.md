# Extracto Commento — PDF vers Excel

Version 0.7.0-beta.1 · 1 octobre 2026

Application statique PDF seulement : ouvrir un document, vérifier les commentaires dans un tableau avec recherche et filtres, puis télécharger un classeur Excel. Traitement documentaire dans le navigateur. Les dépendances sont incluses dans `vendor/`; aucune connexion Internet n’est nécessaire pendant l’utilisation locale.

## Essayer en ligne

[Ouvrir Extracto Commento](https://acfakkoh.github.io/Extracto-Commento/)

Choisir un PDF, vérifier les commentaires et télécharger Excel. Le fichier PDF reste sur l’appareil; GitHub Pages fournit les fichiers de l’interface. Utiliser **Essayer un exemple** pour découvrir l’outil avec un PDF synthétique.

Première version bêta : la cible de 300 Mo et 500 pages reste à valider sur des documents réels représentatifs. Les résultats des essais sont décrits dans [VALIDATION.md](VALIDATION.md).

## Démarrer en local sur Windows

1. Double-cliquer sur **Lancer.cmd**.
2. Le navigateur s’ouvre sur **http://127.0.0.1:8765**. Garder la fenêtre du serveur ouverte.
3. Choisir un PDF ou utiliser **Essayer un exemple**.
4. Vérifier le tableau, puis cliquer sur **Télécharger Excel**.
5. Pour arrêter, fermer la fenêtre du serveur ou appuyer sur Ctrl+C.

Si le serveur est déjà lancé, ouvrir simplement l’adresse ci-dessus. Si le port est utilisé par autre chose, lancer depuis PowerShell :

```powershell
$env:PORT = '8766'
node server.mjs --open
```

Le lanceur utilise Node.js présent dans le PATH, ou celui fourni par Codex sur ce poste. Sur un autre ordinateur, installer Node.js LTS ou servir ce dossier avec un autre serveur statique. Le serveur local ne lit pas les PDF choisis par l’utilisateur : il fournit seulement les fichiers de l’interface et l’exemple synthétique.

**Ne pas ouvrir `index.html` directement en double-cliquant dessus.** Les modules JavaScript et workers demandent une adresse HTTP locale ou HTTPS.

## Comportement

- Un PDF à la fois, par sélection ou glisser-déposer.
- Notes (`Text`), zones de texte (`FreeText`), surlignages (`Highlight`), textes barrés (`StrikeOut`) et lignes (`Line`).
- Règles 0.6 conservées : surlignages sans note et lignes sans contenu exclus; textes barrés sans note retenus.
- Texte couvert par un surlignage ou un texte barré estimé à partir de la géométrie PDF, marqué comme estimé dans l’interface.
- FR/EN détecté selon le navigateur et modifiable manuellement.
- Tableau en lecture seule, recherche, filtres auteur/type/page et pagination de 50 lignes.
- Export des **cinq colonnes** No, Page, Auteur, Date, Commentaire, avec métadonnées et mise en forme.
- L’export principal conserve **tous les commentaires retenus**, indépendamment des filtres du tableau. Le bouton affiche la quantité exportée.
- Fichier : `nom_du_pdf_extraction_comm.xlsx`. Le navigateur décide de l’emplacement et des collisions de noms.
- Avertissements sur les exclusions, types non pris en charge et texte couvert manquant.
- En cas de page ou de texte illisible : résultat partiel, acceptation explicite avant l’export et avertissement dans Excel.
- Annulation de l’analyse ou de la génération Excel; bouton Effacer pour revenir au choix de fichier.

L’interface, les fichiers Excel générés et les ressources de cette version ont une identité indépendante. Aucun asset de marque de la version bureau n’a été repris. Les données présentes dans les PDF importés restent les données du document original.

## Gros fichiers et limites

Objectif : fichiers jusqu’à **300 Mo** et **500 pages** sur ordinateur. PDF.js reçoit les portions demandées depuis `File.slice()`; les pages sont traitées successivement, sans rendu d’images. Le texte est demandé seulement sur les pages contenant des marquages retenus. Le classeur est créé dans un autre worker.

Cette stratégie évite de charger et copier volontairement tout le fichier dans le fil principal. **PDF.js garde néanmoins ses propres structures et buffers, qui peuvent consommer beaucoup de mémoire.** Le nombre d’objets, la compression et les polices influencent les performances. Voir [VALIDATION.md](VALIDATION.md) pour ce qui a réellement été testé.

Les annotations aplaties dans une image ne sont pas récupérables avec ce moteur. Pas d’OCR ni d’extraction Word. Déverrouiller les PDF protégés avant utilisation. Les extensions de Bluebeam, Foxit ou Adobe (mesures, états, groupes, etc.) ne sont pas garanties : les cinq types standard ci-dessus sont la cible. Une ligne annotée est libellée « Dimension ajoutée » comme en 0.6; aucune mesure n’est recalculée.

Le texte couvert peut inclure plus de caractères que la sélection lorsque le PDF regroupe le texte en grands fragments. Vérifier contre le PDF original. Un commentaire dépassant 32 767 caractères bloque l’export Excel; aucun texte n’est tronqué silencieusement.

## Fichiers principaux

| Fichier | Rôle |
| --- | --- |
| index.html / styles.css | Interface |
| app.js | État, filtres, traductions, téléchargement |
| extract.js | Lecture par portions, PDF.js, normalisation et géométrie |
| format.js | Libellés, dates et chaînes Excel |
| export-worker.js | Création du classeur dans un worker |
| vendor/ | PDF.js 5.6.205, ExcelJS 4.4.0, ressources et licences |
| example.pdf | Démonstration synthétique de cinq annotations |
| server.mjs / Lancer.cmd | Serveur local et lanceur Windows |
| tests/ | Essais navigateur et générateur de documents synthétiques |

## Vérifications reproductibles

Aucune installation de package n’est nécessaire pour utiliser l’application. Pour exécuter les essais, utiliser Node.js, Google Chrome et les dépendances de développement installées, ou les bibliothèques du runtime Codex déjà présentes sur ce poste.

```powershell
node tests/smoke.mjs
node tests/smoke.mjs --stress
```

Sur un poste sans les bibliothèques Codex, lancer `npm install` dans ce dossier avant les tests. Les dépendances de développement servent uniquement aux tests et ne sont pas requises pour l’app.

Pour Microsoft Edge :

```powershell
$env:TEST_BROWSER = 'msedge'
node tests/smoke.mjs
Remove-Item Env:TEST_BROWSER
```

Les tests fabriquent des PDF synthétiques dans `tests/generated/`, écrivent les captures et Excel contrôlés dans `tests/output/`, et lisent aussi le PDF d’exemple historique lorsqu’il est présent dans le dossier parent. Le mode `--stress` crée un PDF de 300 Mo avec un gros flux embarqué et 500 pages annotées. Ce fichier volumineux peut être supprimé après l’essai.

## Préparation pour GitHub Pages

Les fichiers de l’application utilisent des chemins relatifs. Publier `index.html`, `styles.css`, `favicon.svg`, `app.js`, `format.js`, `extract.js`, `export-worker.js`, `example.pdf` et `vendor/`, avec les licences. Le serveur Node et les tests ne sont pas nécessaires sur GitHub Pages. Le site peut être servi sous `/nom-du-depot/`.

GitHub Pages sert la branche `main` depuis la racine. Le fichier `.nojekyll` conserve les ressources statiques et leurs noms. Un push sur `main` publie la version suivante.

Les licences des dépendances sont conservées dans `vendor/`. Cette première distribution contient le code web et des exemples synthétiques; elle ne contient pas de documents de travail.
