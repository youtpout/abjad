# 🕌 Alphabet Arabe - الأبجدية العربية

Un jeu éducatif interactif pour apprendre l'alphabet arabe avec audio.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vite](https://img.shields.io/badge/vite-5.x-646CFF.svg)
![React](https://img.shields.io/badge/react-18.x-61DAFB.svg)

## ✨ Fonctionnalités

- 📖 **28 lettres arabes** avec les 4 formes d'écriture (isolée, initiale, médiane, finale)
- 🔊 **Audio intégré** - cliquez sur n'importe quelle lettre pour l'entendre
- ◌َ **Voyelles (Harakat)** - Fatha, Kasra, Damma, Sukun et plus
- 🎯 **Quiz interactif** - 3 modes de jeu pour tester vos connaissances
- 📱 **Responsive** - fonctionne sur mobile, tablette et desktop

## 🚀 Déploiement rapide sur GitHub Pages

### Méthode 1: Déploiement automatique (recommandé)

1. **Créer un repo GitHub**
   ```bash
   # Sur GitHub, créer un nouveau repo (ex: abdjad)
   ```

2. **Cloner et pousser le code**
   ```bash
   cd arabic-alphabet
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/youtpout/abdjad.git
   git push -u origin main
   ```

3. **Activer GitHub Pages**
   - Aller dans **Settings** → **Pages**
   - Source: **GitHub Actions**
   - Le workflow se déclenche automatiquement à chaque push!

4. **C'est tout!** 🎉
   - URL: `https://youtpout.github.io/abdjad/`

### Méthode 2: Déploiement manuel

```bash
# Installer les dépendances
npm install

# Build le projet
npm run build

# Déployer manuellement
npm run deploy
```

## ⚙️ Configuration importante

Si votre repo a un **nom différent** de `arabic-alphabet`, modifiez `vite.config.js`:

```js
export default defineConfig({
  // Remplacez par le nom de votre repo
  base: '/VOTRE_NOM_DE_REPO/',
  // ...
})
```

## 🛠️ Développement local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

## 📦 Optimisations incluses

- ⚡ **Vite** - Build ultra-rapide
- 🗜️ **Compression Gzip/Brotli** - Fichiers compressés
- 📦 **Code splitting** - Chargement optimisé
- 🎨 **CSS critique inline** - Pas de FOUC
- 🔗 **Preconnect** - Connexions anticipées aux CDN
- 🖼️ **Assets inlining** - Moins de requêtes HTTP
- 📱 **Font display swap** - Texte visible immédiatement

## 📊 Taille du bundle

| Fichier | Taille | Gzip |
|---------|--------|------|
| JS | ~45 KB | ~15 KB |
| CSS | ~2 KB | ~1 KB |

## 🎓 Comment jouer

1. **Mode Lettres** - Cliquez sur une lettre pour voir ses formes et écouter sa prononciation
2. **Mode Voyelles** - Explorez les signes diacritiques et testez-les avec différentes lettres  
3. **Mode Quiz** - Testez vos connaissances avec 3 types de quiz

## 📝 License

MIT License - Libre d'utilisation et de modification.

---

Made with ❤️ pour l'apprentissage de l'arabe
