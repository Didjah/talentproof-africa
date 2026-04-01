# 🚀 Guide de Déploiement TalentProof

## 📋 Prérequis

- Compte GitHub (gratuit)
- Compte Vercel (gratuit) : https://vercel.com
- Git installé sur votre machine

---

## 🎯 Étape 1 : Préparer le projet

### 1.1 Vérifier que tout fonctionne localement

```bash
cd c:\Users\HP\Desktop\TalentProof\frontend
npm run dev
```

Ouvrir http://localhost:3002 et vérifier que tout s'affiche correctement.

### 1.2 Créer un fichier .env.local (si nécessaire)

Le fichier `.env.local.example` est déjà présent. Si vous avez des variables d'environnement, créez `.env.local` :

```bash
# Exemple
NEXT_PUBLIC_API_URL=https://api.talentproof.africa
```

---

## 🌐 Étape 2 : Déployer sur Vercel (RECOMMANDÉ)

### Option A : Déploiement via GitHub (Recommandé)

#### 1. Créer un dépôt GitHub

```bash
# Initialiser Git (si pas déjà fait)
cd c:\Users\HP\Desktop\TalentProof
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - TalentProof ready for deployment"

# Créer un repo sur GitHub.com puis :
git remote add origin https://github.com/VOTRE_USERNAME/talentproof.git
git branch -M main
git push -u origin main
```

#### 2. Connecter à Vercel

1. Aller sur https://vercel.com
2. Se connecter avec GitHub
3. Cliquer sur "New Project"
4. Importer le repo `talentproof`
5. Configurer :
   - **Framework Preset** : Next.js
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build` (détecté automatiquement)
   - **Output Directory** : `.next` (détecté automatiquement)
6. Cliquer sur "Deploy"

✅ **Votre site sera en ligne en 2-3 minutes !**

### Option B : Déploiement direct (sans GitHub)

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer depuis le dossier frontend
cd c:\Users\HP\Desktop\TalentProof\frontend
vercel

# Suivre les instructions :
# - Set up and deploy? Yes
# - Which scope? Votre compte
# - Link to existing project? No
# - Project name? talentproof
# - Directory? ./
# - Override settings? No

# Pour déployer en production
vercel --prod
```

---

## 🔒 Étape 3 : Sécurité (Déjà configuré)

### ✅ Protections déjà en place :

1. **HTTPS automatique** : Vercel force HTTPS par défaut
2. **En-têtes de sécurité** : Configurés dans `vercel.json`
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: 1; mode=block
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy: microphone=(self)

3. **Protection des formulaires** : Next.js protège automatiquement contre les injections XSS

### 🔐 Recommandations supplémentaires :

- Activer **Vercel Firewall** (dans les paramètres du projet)
- Configurer **Rate Limiting** pour éviter les abus
- Ajouter **Google reCAPTCHA** sur les formulaires sensibles (optionnel)

---

## 📱 Étape 4 : Vérifier le Responsive Design

### ✅ Le site est déjà responsive !

Le design utilise :
- `clamp()` pour les tailles de police adaptatives
- `flexbox` et `grid` avec `auto-fill` et `minmax()`
- Media queries CSS pour les petits écrans
- `overflow-x: auto` pour les filtres horizontaux
- Viewport meta tag configuré dans Next.js

### Tester sur mobile :

1. **Chrome DevTools** : F12 → Toggle device toolbar (Ctrl+Shift+M)
2. **Tester sur iPhone** : Safari → Responsive Design Mode
3. **Tester sur Android** : Chrome → Inspect → Device Mode

---

## 🎨 Étape 5 : Domaine personnalisé (Optionnel)

### Acheter un domaine

- **Namecheap** : ~10€/an
- **OVH** : ~8€/an
- **Google Domains** : ~12€/an

Suggestions :
- `talentproof.africa`
- `talentproof.ci`
- `talentproof.app`

### Configurer le domaine sur Vercel

1. Aller dans **Project Settings** → **Domains**
2. Ajouter votre domaine
3. Suivre les instructions DNS fournies par Vercel
4. Attendre la propagation DNS (5-30 minutes)

✅ **HTTPS sera automatiquement activé par Vercel**

---

## 📊 Étape 6 : Monitoring et Analytics

### Vercel Analytics (Gratuit)

1. Aller dans **Project Settings** → **Analytics**
2. Activer **Web Analytics**
3. Voir les statistiques de trafic en temps réel

### Google Analytics (Optionnel)

Ajouter dans `frontend/src/app/layout.js` :

```javascript
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
<Script id="google-analytics">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

---

## 🔄 Étape 7 : Mises à jour continues

### Déploiement automatique (avec GitHub)

Chaque fois que vous faites un `git push`, Vercel redéploie automatiquement :

```bash
# Faire des modifications
git add .
git commit -m "Description des changements"
git push

# Vercel déploie automatiquement en 2-3 minutes
```

### Déploiement manuel (sans GitHub)

```bash
cd c:\Users\HP\Desktop\TalentProof\frontend
vercel --prod
```

---

## ✅ Checklist finale avant le lancement

- [ ] Tester toutes les pages (/, /annuaire, /guide, /mentions-legales, /inscription, /recruteur)
- [ ] Vérifier les liens WhatsApp et email
- [ ] Tester l'enregistreur vocal sur mobile
- [ ] Vérifier le responsive sur iPhone et Android
- [ ] Tester les modals (vidéo, photo, documents)
- [ ] Vérifier que le lightbox fonctionne
- [ ] Configurer les variables d'environnement sur Vercel (si nécessaire)
- [ ] Activer Vercel Analytics
- [ ] Partager le lien avec l'équipe

---

## 🎉 Votre site sera accessible via :

- **URL Vercel** : `https://talentproof.vercel.app` (ou similaire)
- **Domaine personnalisé** : `https://talentproof.africa` (si configuré)

### 📞 Support

- **Email** : contact@talentproof.africa
- **WhatsApp** : +225 07 05 50 30 89

---

## 🛠️ Commandes utiles

```bash
# Développement local
npm run dev

# Build de production (test local)
npm run build
npm start

# Déployer sur Vercel
vercel --prod

# Voir les logs de déploiement
vercel logs

# Rollback vers une version précédente
vercel rollback
```

---

## 🌍 Performance et SEO

### ✅ Déjà optimisé :

- **Next.js 14** : Server-side rendering et optimisation automatique
- **Images optimisées** : Utilisation d'Unsplash avec paramètres de qualité
- **Fonts optimisées** : Google Fonts avec `display=swap`
- **CSS inline** : Pas de fichiers CSS externes lourds
- **Lazy loading** : Composants chargés à la demande

### 📈 Score attendu :

- **Performance** : 90-95/100
- **Accessibility** : 85-90/100
- **Best Practices** : 95-100/100
- **SEO** : 90-95/100

---

## 🎯 Prochaines étapes (après le lancement)

1. **Backend API** : Connecter à une vraie base de données (MongoDB, PostgreSQL)
2. **Authentification** : Système de login pour les talents et recruteurs
3. **Paiements** : Intégrer Orange Money / MTN Mobile Money pour les services premium
4. **Notifications** : SMS ou WhatsApp pour alerter les talents des nouvelles opportunités
5. **Dashboard Admin** : Interface pour gérer les profils et modérations

---

**🚀 Bon lancement avec TalentProof !**
