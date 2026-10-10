# Portfolio personnel — Abdoul Aziz Kébé

Portfolio professionnel statique, entièrement en français, réalisé **sans framework** ni backend.
Écrit en **HTML5**, **CSS3** et **JavaScript natif**. Compatible **GitHub Pages**.

---

## 1. Contenu du projet

| Fichier        | Rôle                                                        |
| -------------- | ----------------------------------------------------------- |
| `index.html`   | Structure du site et contenu éditorial                      |
| `style.css`    | Design complet (thèmes, responsive, animations)             |
| `script.js`    | Menu mobile, thème, animations, accessibilité               |
| `README.md`    | Ce fichier                                                  |

Aucune dépendance, aucun secret, aucune clé API. Tout fonctionne en local et en statique.

---

## 2. Ouvrir le site localement

### Option A — double-clic (la plus simple)

1. Ouvrez le dossier du projet dans l'explorateur Windows.
2. Double-cliquez sur **`index.html`**.
   Il s'ouvrira dans votre navigateur par défaut (Chrome, Firefox, Edge…).

### Option B — via OpenCode / terminal

```powershell
# PowerShell, dans le dossier du projet
start .\index.html
```

### Option C — petit serveur local (facultatif)

Si vous préférez un serveur local, avec Python installé :

```powershell
python -m http.server 8000
# puis ouvrez http://localhost:8000
```

Avec Node.js :

```powershell
npx serve .
```

> Aucune de ces options n'est nécessaire : le site fonctionne directement en `file://`.

---

## 3. Personnalisation — les éléments à remplacer

L'identité (logo « Mon Portfolio »,
nom **Abdoul Aziz Kébé**, titre « Instituteur • Développeur VBA & Vibe Coder »,
e-mail `kebe776@gmail.com`, localisation **Dakar, Sénégal**, statistiques et
photo de profil) est déjà intégrée. Les valeurs restantes à modifier
sont entourées de crochets dans le code et repérables avec une recherche de
`[` ou `à personnaliser`.

### Dans `index.html`

| Emplacement | Chercher / remplacer |
| --- | --- |
| Lien « voir site » de GestiEcole | `href` du tag dans la carte projet principale |
| Projets | blocs `<article class="project">` (dupliquer pour en ajouter) |
| LinkedIn / X / autre | `href` des `.social` |

### Photo de profil

La photo est affichée dans l'accueil et dans « À propos », depuis le fichier
local `assets/images/abdoul-aziz-kebe.jpg`. Pour la remplacer : écrasez ce
fichier avec votre nouvelle photo (format JPEG, de préférence carré ou
portrait) en conservant le même nom. Aucune modification de code n'est
nécessaire ; `object-fit: cover` évite toute déformation.

### Dans `style.css`

- Palette de couleurs : variables `--bg`, `--accent`, `--cyan` dans `:root` (mode sombre)
  et `:root[data-theme="light"]` (mode clair).
- Polices : variables `--font-sans` et `--font-display` (polices système, modifiables).

### Dans `script.js`

- Titre animé du héros (boucle écriture / effacement) : constante `WORDS`.

---

## 4. Ajouter un projet

1. Dans `index.html`, localisez la section `#projets`.
2. Dupliquez un bloc `<article class="project reveal">…</article>`.
3. Remplacez le titre, la description, les tags et les liens.
4. Pour un projet « en cours », utilisez le badge ambre :

```html
<div class="project__badge"><span class="pulse"></span> En développement</div>
```

> **GestiEcole** est présenté comme projet principal **disponible** (version 1.0.0) :
> son lien « voir site » pointe vers
> `https://kebe776-blip.github.io/gestiecole-site/`. Le badge cyan
> `.project__badge--live` signale un projet en ligne.

---

## 5. Publication sur GitHub Pages

1. Créez un dépôt GitHub (public pour le plan gratuit).
2. Poussez les fichiers :

   ```powershell
   git init
   git add .
   git commit -m "Portfolio : site statique HTML/CSS/JS"
   git branch -M main
   git remote add origin https://github.com/VOTRE_PSEUDO/VOTRE_REPO.git
   git push -u origin main
   ```

3. Sur GitHub : **Settings → Pages → Source : Deploy from a branch → `main` / `(root)` → Save**.
4. Le site sera disponible à l'adresse
   `https://VOTRE_PSEUDO.github.io/VOTRE_REPO/`.

Tous les chemins de ressources sont **relatifs** (`style.css`, `script.js`) :
le site fonctionne à la racine comme dans un sous-dossier.

> ⚠️ Aucune commande Git de publication n'a été exécutée pour vous.

---

## 6. Accessibilité & performance

- Navigation clavier complète, lien d'évitement, focus visible, ARIA appropriés.
- Contrastes adaptés aux deux thèmes.
- Respect de `prefers-reduced-motion` (animations désactivées sur demande).
- JavaScript sans dépendance, animations limitées à `opacity` / `transform`
  (mises en page fluides, pas de recalcul coûteux).
- Images : ajoutez des attributs `alt` et compressez vos visuels (WebP recommandé).

---

## 7. Compatibilité

- Navigateurs modernes : Chrome, Firefox, Edge, Safari (versions récentes).
- Responsive : mobile, tablette, ordinateur.
- Fonctionne hors ligne et sans serveur.
