# NUANCE — ta landing page

## Les fichiers
- `index.html` : tout le contenu (textes, sections, liens)
- `style.css` : tout le design (couleurs en haut du fichier, dans `:root`)
- `images/` : dossier à créer pour tes photos

## Tes photos (noms à respecter)
| Fichier | Où il apparaît |
|---|---|
| `images/hero.jpg` | Grand portrait en haut de la page (format paysage, 2000 px de large minimum) |
| `images/model-cutout.png` | Femme détourée au centre de « Your complete color analysis » (déjà générée sur Higgsfield) |
| `images/deep-before.jpg` / `deep-after.jpg` / `fair-before.jpg` / `fair-after.jpg` | Avant / après de « Real results » (déjà générés) |
| `images/before.jpg` / `images/after.jpg` | Curseur avant / après de « Colors that change everything » (déjà générés, nouvelle femme) |

Les autres blocs photo (avant / après, comparaison) sont des dégradés provisoires.
Dans `style.css`, cherche les commentaires 👉 et remplace le `background: linear-gradient(...)` par
`background: url("images/ton-fichier.jpg") center / cover;`

## À personnaliser (cherche 👉 et « # »)
1. Le nom **NUANCE** (logo, titre de la page, footer, « The NUANCE way », « Your NUANCE guide »)
2. Tous les `href="#"` des boutons « Start my analysis » → ton lien Tally (questionnaire + photos), qui redirige ensuite vers Stripe
3. Les chiffres d'exemple de la section « Why » (marqués *)
4. Les citations (expert, client) → de vrais avis

## Parcours d'achat : bouton → formulaire → paiement Stripe (49 €)
Tous les boutons « Start my analysis » ouvrent **`start.html`** (prénom, nom, email sur le fond brun du hero).
Au clic sur **Continue**, la cliente est envoyée sur le paiement Stripe avec son email pré-rempli.

À remplir en haut du script de `start.html` :
- `STRIPE_LINK` : ton Payment Link Stripe à 49 € (`https://buy.stripe.com/...`)
- `FORM_ENDPOINT` : où enregistrer prénom / nom / email (ex. **Formspree**, gratuit : crée un formulaire et colle son URL `https://formspree.io/f/...`). Laisse vide si tu ne veux rien enregistrer.

Ensuite, dans Stripe → Payment Link → **After payment** → redirection vers ton **formulaire Tally** (questionnaire + photos).

### Obligations légales (France / UE)
- **Mentions légales** + **CGV** (pages liées dans le footer)
- **Droit de rétractation** : pour un service numérique exécuté rapidement, ajoute dans Tally une case
  « Je demande l'exécution immédiate et renonce à mon droit de rétractation »
- **RGPD** : photos = données personnelles. Indique qui y a accès (toi seule) et la suppression à la fin du rapport
- Fais relire tes CGV par un professionnel si possible

## Mettre en ligne sur Vercel (sans terminal)
1. Crée un compte gratuit sur **github.com**
2. Clique sur **+** en haut à droite → **New repository** (pas « New issue ») → nom : `nuance-site` → **Create repository**
3. Clique sur **uploading an existing file** → fais glisser `index.html`, `start.html`, `style.css` et ton dossier `images` → **Commit changes**
4. Crée un compte gratuit sur **vercel.com** avec « Continue with GitHub »
5. **Add New… → Project** → choisis `nuance-site` → **Deploy**
6. En 30 secondes ton site est en ligne sur `nuance-site.vercel.app`

### Ton nom de domaine
Vercel → ton projet → **Settings → Domains** → tape ton domaine (ex. `nuance.com`).
Vercel t'affiche 1 ou 2 lignes à copier chez ton registrar (OVH, Gandi…). HTTPS est automatique.

### Modifier le site ensuite
Sur GitHub, ouvre `index.html` → icône crayon ✏️ → modifie → **Commit changes**.
Vercel remet le site à jour tout seul en quelques secondes.
