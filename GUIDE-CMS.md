# Guide d'utilisation du site — Gîte chez Martin

Ce document explique comment modifier le contenu du site **gite-chez-martin.fr**
sans avoir besoin du développeur. Tout passe par un outil simple appelé
**Sanity Studio**, accessible depuis votre navigateur.

---

## 1. Se connecter au Studio

1. Ouvrez votre navigateur et allez à l'adresse de votre Studio
   (URL fournie séparément, en général `https://gite-chez-martin.sanity.studio`).
2. Connectez-vous avec votre compte Google ou GitHub
   (le compte qui a été invité au projet).
3. Vous arrivez sur le tableau de bord. À gauche, la barre de navigation liste
   tout ce que vous pouvez modifier.

> 💡 Vous pouvez vous connecter depuis n'importe quel ordinateur,
> tablette ou téléphone. Les modifications sont enregistrées dans le cloud.

---

## 2. Le principe : brouillon → publication

Sanity fonctionne avec un système de **brouillons** :

- Quand vous modifiez un champ, votre changement est **automatiquement enregistré
  comme brouillon** (vous voyez un point orange à côté du document).
- Tant que vous n'avez pas cliqué sur **Publish** (bouton vert en bas à droite),
  rien n'apparaît sur le site public.
- Pour annuler des changements non publiés, cliquez sur le menu `…` à côté du
  bouton Publish puis **Discard changes**.

> ⚠️ N'oubliez jamais de cliquer **Publish** après vos modifications,
> sinon elles ne seront pas visibles en ligne.

Une fois publié, le site se met à jour en quelques secondes (rechargez la page
pour voir le résultat).

---

## 3. Vue d'ensemble du Studio

La barre de gauche est organisée en 5 zones :

| Section | Contenu |
| --- | --- |
| 📐 **Paramètres du site** | Logo, contact, liens externes (Airbnb, Facebook…), couleurs, menu, SEO |
| 🏠 **Page d'accueil** | Toutes les sections de la page principale (présentation, hébergements, galerie, tarifs, avis, activités, contact) |
| 🛏️ **Hébergements** | Vos chambres et studios |
| ⭐ **Avis clients** | Les témoignages affichés sur le site |
| 🗺️ **Activités & tourisme** | Les choses à découvrir autour du gîte |
| 💶 **Tarifs & saisons** | Les prix par période |
| 📄 **Pages secondaires** | Mentions légales, politique de confidentialité |

---

## 4. Modifier les éléments les plus courants

### 4.1. Changer un texte (titre, paragraphe, phrase)

1. Cliquez sur la section que vous voulez modifier (ex. *Page d'accueil → Hero*).
2. Cliquez dans le champ texte concerné.
3. Tapez votre nouveau texte.
4. Le brouillon est sauvegardé automatiquement. Cliquez **Publish** quand vous
   avez fini.

### 4.2. Onglets FR / EN

Tous les textes destinés aux visiteurs ont **deux onglets** :
**Français (FR)** et **English (EN)**.

- Les deux versions sont déjà rédigées et vérifiées. Vous pouvez modifier
  l'une ou l'autre indépendamment.
- Si vous changez un texte uniquement en FR, la version EN existante reste
  affichée pour les visiteurs anglophones (et inversement).
- **Si vous laissez un champ vide**, le site affichera la version dans
  l'autre langue.

### 4.3. Ajouter / changer une photo

1. Cliquez sur l'image à remplacer.
2. **Replace** pour mettre une nouvelle photo (ou faites-la glisser depuis
   votre ordinateur).
3. Une fois l'image chargée, vous pouvez :
   - **Recadrer** : cliquez sur l'icône recadrage et déplacez les bords.
   - **Définir le point d'intérêt** (le « hotspot ») : cliquez sur l'image
     pour indiquer la zone qui doit toujours rester visible quand l'image
     est rognée sur les petits écrans.
4. Renseignez le **texte alternatif (alt)** en français et en anglais — c'est
   important pour l'accessibilité et le référencement Google
   (ex. "Façade du gîte au coucher du soleil").

> 📸 **Format conseillé** : JPG ou WebP, largeur minimum 2000 px.
> Sanity génère automatiquement les versions optimisées pour mobile.

### 4.4. Réordonner les hébergements / activités / avis

Pour les listes ordonnables (Hébergements, Activités, Avis, Tarifs) :
1. Allez dans la liste (ex. *Hébergements*).
2. **Glissez-déposez** les éléments avec la poignée à gauche pour les
   réordonner. Le nouvel ordre est sauvegardé automatiquement.

### 4.5. Activer / masquer une section sur la page d'accueil

1. Allez dans **Page d'accueil**.
2. Cliquez sur la section concernée (ex. *Activities*).
3. Décochez **Enabled** pour masquer la section sans la supprimer.
4. Publiez.

> Exemple : la section *Location* (carte d'accès) est actuellement masquée.
> Pour l'activer, ouvrez-la et cochez **Enabled**.

### 4.6. Ajouter un nouvel avis client

1. Allez dans **Avis clients**.
2. Cliquez sur **+ Create** en haut à droite.
3. Remplissez : nom, ville/pays, note (1 à 5 étoiles), texte de l'avis,
   date, source (Direct, Google, Airbnb, Booking…).
4. Cochez **Published** pour qu'il apparaisse sur le site.
5. Publiez.

> Les avis ne sont pas obligatoirement traduits — vous pouvez laisser
> chaque avis dans sa langue d'origine, c'est plus authentique.

### 4.7. Mettre à jour les tarifs

1. Allez dans **Tarifs & saisons**.
2. Ouvrez la période concernée (Basse saison / Haute saison).
3. Modifiez le prix par nuit, le minimum de nuits, les dates de début
   et de fin.
4. Vous pouvez ajouter / retirer des éléments dans **Includes** (linge,
   wifi, etc.).
5. Publiez.

Pour ajouter une nouvelle période (ex. *Promo hors saison*) :
**+ Create** dans la liste *Tarifs & saisons*.

---

## 5. Liens externes (Airbnb, Facebook, Google)

Les boutons de réservation et les icônes sociales du pied de page sont
gérés depuis **Paramètres du site → onglet Contact → Liens externes**.

Liens actuellement configurés :

| Lien | Adresse |
| --- | --- |
| **Airbnb** | https://www.airbnb.fr/rooms/1219003730265292345 |
| **Facebook** | https://www.facebook.com/people/Gite-Chez-Martin/61560664446936/ |
| **Google (avis & fiche)** | https://share.google/zixvx3n3hnZkKncI9 |

Pour modifier un lien : remplacez simplement l'URL et publiez.
Pour masquer un lien du site, **videz le champ**.

> ℹ️ Le lien Airbnb apparaît à 3 endroits : bouton du header, footer,
> bouton CTA dans la section contact. Les 3 lisent la même valeur,
> donc une seule modification suffit.

> 💡 Une mention de votre gîte existe sur
> https://chemindecompostelle.com/voie-puy-gr65-via-podiensis/hebergements/chez-martin-monistrol-dallier/.
> Si vous voulez la mettre en valeur, ajoutez un lien dans les
> *Liens du pied de page* (kind: external, label "Vu sur chemindecompostelle.com").

---

## 6. Email, téléphone, adresse

**Paramètres du site → onglet Contact** :

- Email de contact (utilisé partout sur le site et dans les liens `mailto:`)
- Téléphone (utilisé pour les liens `tel:` cliquables sur mobile)
- Adresse postale (affichée dans le footer)

Une seule modification met à jour le site partout.

---

## 7. Couleurs et thème

**Paramètres du site → onglet Thème & visuels** :

| Champ | Usage |
| --- | --- |
| Couleur principale | Boutons, accents, liens (actuellement bleu nuit) |
| Couleur secondaire | Surfaces secondaires (actuellement ivoire) |
| Couleur d'accent | Détails dorés |
| Couleur de fond | Fond du site |
| Couleur du texte | Couleur du corps de texte |

Format obligatoire : `#RRGGBB` (ex. `#3E42A8`).

> ⚠️ Modifier ces valeurs change l'identité visuelle du site.
> Faire un test sur un seul écran d'abord.

---

## 8. SEO et référencement Google

**Paramètres du site → onglet SEO & référencement → SEO par défaut** :

- **Titre** : ce qui apparaît dans l'onglet du navigateur et dans
  les résultats Google (max 60 caractères).
- **Description** : le résumé sous le titre dans Google
  (max 155 caractères).
- **Image de partage** : l'image affichée quand quelqu'un partage le site
  sur WhatsApp, Facebook, LinkedIn (1200×630 px recommandé).

Chaque section / hébergement / page peut avoir son propre SEO qui
remplace celui par défaut.

---

## 9. Multilingue (FR / EN)

Le site est **prêt en français et en anglais**, mais seul le **français
est actuellement actif** côté public.

Pour activer l'anglais :
1. **Paramètres du site → onglet Langues**.
2. Dans **Langues activées**, ajoutez `English`.
3. Publiez.

Le sélecteur FR / EN apparaîtra alors dans le footer du site, et l'URL
`/en` deviendra accessible.

> ⚠️ **Avant d'activer l'EN**, vérifiez que :
> - les **avis clients** sont traduits (ou laissés en FR avec
>   leur origine de pays — c'est aussi acceptable) ;
> - les **mentions légales** et la **politique de confidentialité**
>   sont traduites ou réécrites en EN par un avocat. Ne JAMAIS
>   traduire automatiquement un texte juridique.

---

## 10. Pages secondaires (mentions légales, etc.)

**Pages secondaires** dans la barre de gauche.

- **Mentions légales** et **Politique de confidentialité** existent déjà.
- Pour modifier le texte : ouvrez la page, modifiez le **Body**.
- Pour qu'une page apparaisse en footer : cochez **Show in footer**.

Pour créer une nouvelle page (ex. CGV) :
1. **+ Create** dans la liste.
2. Remplissez **Title** (FR + EN), **Slug** (l'URL — ex. `cgv`),
   **Body** (le contenu).
3. Cochez **Show in footer** si vous voulez le lien dans le pied de page.
4. Publiez.

---

## 11. Périodes d'ouverture et notes

**Paramètres du site → onglet Ouverture** :

- **Périodes d'ouverture** : ajoutez vos périodes d'ouverture/fermeture
  avec dates de début et de fin.
- **Notes sur les disponibilités** : texte libre affiché à côté
  (ex. *"Réservation par email ou téléphone. Arrivée à partir de 16h."*).

---

## 12. Avis Google (optionnel)

Si vous voulez que les avis Google s'affichent automatiquement sur le site :

1. **Paramètres du site → onglet Contact → Avis Google**.
2. Renseignez le **Google Place ID** de votre fiche
   (à récupérer via [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)).
3. Cochez **Fusionner avec les avis Sanity** pour cumuler avis Google +
   témoignages saisis dans Sanity.
4. Côté technique, votre développeur doit configurer une clé API Google
   Places — demandez-lui.

---

## 13. Que faire si…

| Problème | Solution |
| --- | --- |
| J'ai modifié un texte mais rien ne change sur le site | Avez-vous cliqué **Publish** ? Le brouillon ne suffit pas. |
| L'image que j'ai uploadée est déformée | Réglez le **hotspot** (cliquez sur l'image dans le Studio pour définir le point central à conserver). |
| J'ai supprimé un avis par erreur | Les documents supprimés vont dans la corbeille — contactez votre développeur, on peut les restaurer. |
| Je ne vois pas un onglet EN | C'est normal sur certains champs internes (slug, IDs). Tous les champs visibles côté public ont FR + EN. |
| Le menu ne s'affiche pas correctement | Vérifiez **Paramètres du site → Navigation → Menu principal**. Chaque entrée doit avoir un type (anchor / external / internal) et une cible. |
| Je vois une couleur bizarre | Format hexadécimal obligatoire : `#3E42A8`, pas `3E42A8` ni `bleu`. |

---

## 14. Bonnes pratiques

- ✅ **Publiez régulièrement** plutôt qu'en gros lots — c'est plus facile
  à corriger en cas d'erreur.
- ✅ **Testez les liens** après les avoir collés (cliquez sur "ouvrir le
  lien" dans Sanity).
- ✅ **Ajoutez toujours un texte alternatif** sur les images (FR + EN).
- ✅ **Limitez la taille des photos** à ~2-3 Mo avant upload — ça reste
  ample pour la qualité finale, et ça économise votre quota.
- ❌ **Ne supprimez jamais** un hébergement / une activité référencé
  ailleurs sans avoir d'abord retiré la référence (la page d'accueil
  s'affichera vide pour cette section sinon).
- ❌ **Ne renommez pas** un *slug* d'une page déjà en ligne — ça casse
  les liens externes (mémorisés par Google ou dans des emails).

---

## 15. Récapitulatif des champs critiques

Voici les éléments à vérifier régulièrement :

- **Email & téléphone** (Paramètres → Contact) — à jour ?
- **Lien Airbnb** (Paramètres → Liens externes) — pointe vers la
  bonne annonce ?
- **Tarifs & dates** (Tarifs & saisons) — alignés avec votre
  saison en cours ?
- **Périodes d'ouverture** (Paramètres → Ouverture) — cohérentes ?
- **Avis clients** (Avis) — au moins 4-5 visibles, datés, variés ?
- **Photos** — récentes, lumineuses, hotspot bien centré ?

---

## 16. Besoin d'aide ?

- Documentation Sanity officielle :
  [https://www.sanity.io/docs](https://www.sanity.io/docs)
- Pour les questions techniques (panne, anomalie, demande d'évolution) :
  contactez votre développeur — bonjour@atypica.digital.

Bonne édition ✨
