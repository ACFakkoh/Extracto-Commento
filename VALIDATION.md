# Validation de la première version bêta

Date : 1 octobre 2026. Essais automatiques dans de vrais navigateurs Windows : **Chrome 154.0.8037.58** et **Microsoft Edge 154.0.4258.48**, via Playwright. Le code Python de la version bureau est resté intact.

## Résultats

- Extraction des cinq types PDF cibles, auteur, date et accents.
- Surlignage sans note et ligne vide exclus; texte barré sans note conservé.
- Texte sous surlignage et texte barré retrouvé sur un document synthétique.
- Annotations masquées incluses avec `intent: any`; réponse conservée, Popup ignoré.
- Auteur absent et date invalide présentés explicitement.
- Commentaire contenant du HTML affiché comme texte; aucun élément HTML ni script créé.
- Chaîne ressemblant à une formule conservée comme texte Excel; XML vérifié sans formule.
- Excel téléchargé ouvert comme archive ZIP : valeurs, cinq colonnes, quantité, toutes les lignes malgré un filtre actif, en-têtes, gel des volets et avertissement neutre vérifiés.
- Filtres, recherche, FR/EN, effacement et pagination vérifiés.
- Fichiers vides sans commentaires, fichiers invalides et corrompus : états distincts.
- Commentaire au-delà de la capacité Excel : export bloqué sans troncature.
- Annulation pendant le traitement de 500 pages, puis nouvel import réussi.
- Échecs simulés de lecture d’annotations et de texte dans PDF.js : résultat partiel, export bloqué avant acceptation et avertissement présent dans Excel.
- Aucun appel réseau externe à la page observé pendant le scénario; les PDF sélectionnés n’ont pas été envoyés au serveur.
- Captures sur ordinateur et largeur mobile de 390 px inspectées; tableau défilable horizontalement sans débordement global.
- PDF historique local « Template commentaires possibles.pdf » : **12 annotations retenues**, sans modifier ou copier ce fichier dans la distribution publique.
- Test de volume : PDF synthétique de **300 140 654 octets**, **500 pages**, **500 commentaires**, traité en environ **2 secondes** dans Chrome sur ce poste.

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

Les essais actuels rendent le prototype utilisable localement. Ils ne remplacent pas une validation métier de tous les PDF possibles.
