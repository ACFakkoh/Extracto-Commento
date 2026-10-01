# Dépendances distribuées

- **PDF.js / pdfjs-dist 5.6.205**, Mozilla Foundation, licence Apache-2.0. Distribution incluse depuis le runtime local : `vendor/pdfjs/pdf.mjs`, worker, CMaps, polices standard, profils ICC et WebAssembly. Licence principale : `vendor/pdfjs/LICENSE`. Les notices et licences des ressources copiées restent dans leurs répertoires. Source : https://github.com/mozilla/pdf.js
- **ExcelJS 4.4.0**, licence MIT. Distribution officielle téléchargée depuis le paquet npm `exceljs@4.4.0`. Fichiers : `vendor/exceljs.min.js` et `vendor/EXCELJS-LICENSE`. Source : https://github.com/exceljs/exceljs

`vendor/SHA256SUMS.json` inventorie les empreintes SHA-256 des fichiers fournis. Les dépendances sont locales; aucune ressource n’est chargée depuis un CDN à l’utilisation.

Les dépendances des tests (`playwright`, `pdf-lib`, `jszip`) ne sont pas copiées dans la distribution navigateur. Elles sont indiquées dans `package.json` pour reproduire les vérifications.
