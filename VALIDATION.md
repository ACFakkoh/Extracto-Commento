# Validation de la version 0.8.1

Mise à jour UI : 3 octobre 2026. Palette et composants inspirés de QuickerUnits v0.2, bandeau marine, cartes blanches, accents turquoise et menthe. Les moteurs PDF et Excel sont inchangés. Le scénario de régression a été réexécuté avec succès dans Chrome et Edge. L’interface a aussi été contrôlée en FR/EN, en mode simple et lot, aux largeurs 320, 375, 768, 1024 et 1440 px : aucun débordement global, focus clavier visible. Captures ordinateur et mobile inspectées dans `tests/output/`.

Validation initiale du moteur : 1 octobre 2026. Essais automatiques dans de vrais navigateurs Windows : **Chrome 154.0.8037.58** et **Microsoft Edge 154.0.4258.48**, via Playwright. Le code Python de la version bureau est resté intact.

## Résultats

- Extraction des cinq types PDF cibles, auteur, date et accents.
- Surlignage sans note et ligne vide exclus; texte barré sans note conservé.
- Texte sous surlignage et texte barré retrouvé sur un document synthétique.
- Annotations masquées incluses avec `intent: any`; réponse conservée, Popup ignoré.
- Auteur absent et date invalide présentés explicitement.
- Commentaire contenant du HTML affiché comme texte; aucun élément HTML ni script créé.
- Chaîne ressemblant à une formule conservée comme texte Excel; XML vérifié sans formule.
- Excel téléchargé ouvert comme archive ZIP : valeurs, cinq colonnes en mode simple, six colonnes en mode lot, quantité, toutes les lignes malgré un filtre actif, en-têtes, gel des volets et avertissement neutre vérifiés.
- Sélection de plusieurs PDF, dépôts successifs, ajout pendant l’analyse et combinaison dans un seul Excel. Lot synthétique de trois PDF : 13 commentaires, nom du fichier pour chaque ligne, numérotation globale et pages propres aux sources. Onglet Fichiers incluant le PDF sans commentaires.
- Filtres, recherche, filtre par fichier, FR/EN, effacement et pagination vérifiés.
- PDF corrompu au milieu d’un lot : les autres PDF sont conservés et les fichiers suivants analysés. Export bloqué avant acceptation du résultat partiel; fichier omis mentionné dans Excel.
- Annulation d’un lot : les commentaires des PDF terminés restent disponibles, le fichier actif et les fichiers en attente sont signalés comme annulés. Un nouvel ajout complète le lot et réinitialise l’acceptation du résultat partiel.
- Titre EXTRACTO COMMENTO, version affichée, mention de traitement local, date et lien GitHub vérifiés. Disclaimer du pied de page comparé à la cellule A5 de l’Excel : identique.
- Fichiers vides sans commentaires, fichiers invalides et corrompus : états distincts.
- Commentaire au-delà de la capacité Excel : export bloqué sans troncature.
- Annulation pendant le traitement de 500 pages, puis nouvel import réussi.
- Échecs simulés de lecture d’annotations et de texte dans PDF.js : résultat partiel, export bloqué avant acceptation et avertissement présent dans Excel. En mode lot, les pages incomplètes sont identifiées par leur fichier et le PDF concerné affiche l’état Partiel.
- Aucun appel réseau externe à la page ni aucune requête HTTP d’écriture observés pendant le scénario; les PDF sélectionnés n’ont pas été envoyés au serveur.
- Captures sur ordinateur et largeur mobile de 390 px inspectées; tableau défilable horizontalement sans débordement global.
- PDF historique local « Template commentaires possibles.pdf » : **12 annotations retenues**, sans modifier ou copier ce fichier dans la distribution publique.
- Test de volume : PDF synthétique de **300 140 654 octets**, **500 pages**, **500 commentaires**, traité en environ **0,7 seconde** dans Chrome sur ce poste. Cette durée concerne ce document synthétique simple, pas une promesse sur les plans réels.

Les résultats détaillés par navigateur et les captures sont dans `tests/output/`. Le scénario de volume est enregistré dans `validation-chrome.json` lors d’une exécution Chrome avec `--stress`.

## Portée de la mesure de 300 Mo

Le gros fichier est un PDF valide comportant un flux embarqué volumineux et des notes sur 500 pages. L’application n’a pas besoin de décoder ce flux pour lire les annotations. Le test valide le volume du fichier, les demandes de portions et le parcours de 500 pages; **il ne représente pas la complexité de 300 Mo de plans, images et polices variées**. Le pic de mémoire total des processus navigateur/worker n’a pas été mesuré.

La cible de 300 Mo reste donc à confirmer sur les documents réels de l’utilisateur, avec une machine et un délai acceptables définis. La compatibilité générale avec des corpus Adobe, Foxit et Bluebeam n’a pas encore été démontrée. Le PDF historique n’a pas été comparé à une sortie exécutée du moteur PyMuPDF 0.6 dans cette session.

## À vérifier sur les fichiers réels

1. PDF représentatifs de chaque éditeur, avec surlignages multiligne et pages tournées.
2. PDF de 50 à 500 pages et documents proches de 300 Mo; temps, mémoire, annulation.
3. Réponses, groupes et propriétés propres au logiciel de création.
4. Ouverture et présentation des classeurs dans Microsoft Excel; le contrôle automatique portait sur leur contenu OOXML.
5. Corpus de référence validé manuellement pour la précision du texte couvert.

Les essais actuels couvrent l’application locale et ses parcours d’extraction. Ils ne remplacent pas une validation métier de tous les PDF possibles.
