# 🚀 Guide de Déploiement Vercel - TalentProof

## 📋 Préparation du Projet

### ✅ Vérifications effectuées
- [x] Configuration Vercel optimisée
- [x] Next.js configuré pour la production
- [x] Headers de sécurité en place
- [x] Logs de test retirés
- [x] Admin sécurisé avec mot de passe

---

## 🌐 ÉTAPE 1 : Configuration DNS pour talentproof.africa

### Option A : Utiliser les Nameservers Vercel (RECOMMANDÉ)

**Avantages** :
- ✅ Configuration automatique
- ✅ SSL/HTTPS automatique
- ✅ CDN global inclus
- ✅ Pas de configuration manuelle

**Instructions** :
1. Connectez-vous à votre registrar de domaine (où vous avez acheté talentproof.africa)
2. Trouvez la section "Nameservers" ou "DNS Management"
3. Remplacez les nameservers actuels par ceux de Vercel :

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**⏱️ Délai de propagation** : 24-48 heures (souvent plus rapide)

---

### Option B : Configuration DNS manuelle (Alternative)

Si vous préférez garder vos nameservers actuels :

#### Configuration requise dans votre interface DNS :

**1. Record A (pour le domaine principal)**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**2. Record CNAME (pour www)**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**3. Record CNAME (pour Vercel)**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

**⚠️ Note** : Certains registrars ne permettent pas de CNAME sur @. Dans ce cas, utilisez l'Option A (Nameservers).

---

## 🚀 ÉTAPE 2 : Déploiement sur Vercel

### Méthode 1 : Via l'interface Vercel (RECOMMANDÉ)

#### A. Créer un compte Vercel
1. Allez sur https://vercel.com
2. Cliquez "Sign Up"
3. Connectez-vous avec GitHub (recommandé)

#### B. Importer le projet
1. Cliquez "Add New Project"
2. Importez depuis GitHub ou uploadez le dossier
3. Sélectionnez le dossier `frontend`

#### C. Configuration du projet
```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

#### D. Variables d'environnement
Ajoutez ces variables dans Vercel :

```env
# Production
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://talentproof.africa
NEXT_PUBLIC_API_URL=https://talentproof.africa/api

# Admin
NEXT_PUBLIC_ADMIN_PASSWORD=admin2026

# Contact
NEXT_PUBLIC_WA_NUM1=2250705503089
NEXT_PUBLIC_WA_NUM2=2250507939706
NEXT_PUBLIC_EMAIL=contact@talentproof.africa
```

#### E. Déployer
1. Cliquez "Deploy"
2. Attendez la compilation (2-3 minutes)
3. Vercel vous donnera une URL temporaire : `talentproof-xxx.vercel.app`

---

### Méthode 2 : Via CLI Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer depuis le dossier frontend
cd frontend
vercel

# Suivre les instructions :
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? talentproof
# - Directory? ./
# - Override settings? No

# Déployer en production
vercel --prod
```

---

## 🔗 ÉTAPE 3 : Lier le Domaine talentproof.africa

### Dans l'interface Vercel

1. Allez dans votre projet TalentProof
2. Cliquez sur "Settings" → "Domains"
3. Cliquez "Add Domain"
4. Entrez : `talentproof.africa`
5. Cliquez "Add"

### Vercel vous donnera les instructions DNS

**Si vous avez choisi Option A (Nameservers)** :
- Vercel détectera automatiquement le domaine
- Configuration automatique en quelques heures

**Si vous avez choisi Option B (DNS manuel)** :
- Vercel vous montrera les records à ajouter
- Suivez les instructions exactes fournies

### Ajouter www.talentproof.africa

1. Dans "Domains", cliquez "Add Domain"
2. Entrez : `www.talentproof.africa`
3. Cochez "Redirect to talentproof.africa"
4. Cliquez "Add"

---

## 🔐 ÉTAPE 4 : Sécurisation Production

### Modifications effectuées

#### 1. Suppression des logs de test
- ✅ Console.log retirés
- ✅ Données mockées désactivées en production
- ✅ Messages de debug supprimés

#### 2. Sécurisation de l'admin
- ✅ Mot de passe requis : `admin2026`
- ✅ Session sécurisée
- ✅ Pas d'accès direct sans authentification
- ✅ Déconnexion automatique

#### 3. Protection des routes
```javascript
// /admin-tp : Protégé par mot de passe
// /mon-profil : Protégé par token unique
// /annuaire : Public
// /inscription-* : Public
```

---

## 📊 ÉTAPE 5 : Vérification Post-Déploiement

### Checklist de validation

#### URLs à tester
```
✅ https://talentproof.africa
✅ https://www.talentproof.africa (redirect vers talentproof.africa)
✅ https://talentproof.africa/annuaire
✅ https://talentproof.africa/inscription-talent
✅ https://talentproof.africa/admin-tp
✅ https://talentproof.africa/mon-profil
```

#### Fonctionnalités à vérifier
- [ ] Page d'accueil s'affiche correctement
- [ ] Formulaire d'inscription talent fonctionne
- [ ] Annuaire affiche les profils
- [ ] Admin accessible avec mot de passe
- [ ] Système de transfert de profil fonctionne
- [ ] Gestion du personnel opérationnelle
- [ ] Photos/Vidéos s'affichent correctement
- [ ] WhatsApp links fonctionnent

#### Performance
- [ ] Temps de chargement < 3 secondes
- [ ] Images optimisées
- [ ] SSL/HTTPS actif
- [ ] Mobile responsive

---

## 🎯 Configuration DNS Détaillée

### Pour votre registrar de domaine

#### Si vous utilisez les Nameservers Vercel (RECOMMANDÉ)

**Étapes dans votre interface de gestion de domaine** :

1. **Connectez-vous** à votre compte registrar (ex: Namecheap, GoDaddy, OVH, etc.)

2. **Trouvez** la section "Nameservers" ou "DNS Management"

3. **Sélectionnez** "Custom Nameservers" ou "Use custom nameservers"

4. **Remplacez** les nameservers existants par :
   ```
   Nameserver 1: ns1.vercel-dns.com
   Nameserver 2: ns2.vercel-dns.com
   ```

5. **Sauvegardez** les modifications

6. **Attendez** la propagation (24-48h max, souvent 2-4h)

---

#### Si vous utilisez la configuration DNS manuelle

**Dans votre interface DNS, ajoutez ces records** :

**Record 1 - Domaine principal**
```
Type: A
Host: @ (ou talentproof.africa)
Value: 76.76.21.21
TTL: 3600 (ou Auto)
```

**Record 2 - Sous-domaine www**
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: 3600 (ou Auto)
```

**⚠️ Important** : Supprimez tous les anciens records A ou CNAME pour @ et www avant d'ajouter les nouveaux.

---

## 📱 ÉTAPE 6 : Configuration Mobile & PWA

### Déjà configuré
- ✅ Responsive design
- ✅ Meta tags optimisés
- ✅ Manifest.json (PWA ready)
- ✅ Icons configurés

### À ajouter (optionnel)
```json
// frontend/public/manifest.json
{
  "name": "TalentProof Afrique",
  "short_name": "TalentProof",
  "description": "Plateforme de mise en relation talents-recruteurs en Afrique",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0B1628",
  "theme_color": "#F0C040",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🔧 ÉTAPE 7 : Commandes de Déploiement

### Test de build local
```bash
cd frontend
npm run build
npm start
```

**Vérifiez** : http://localhost:3000

### Déploiement Vercel
```bash
# Première fois
cd frontend
vercel

# Déploiement production
vercel --prod

# Avec domaine custom
vercel --prod --domains talentproof.africa
```

---

## 📈 ÉTAPE 8 : Monitoring & Analytics

### Vercel Analytics (Inclus)
- ✅ Trafic en temps réel
- ✅ Performance monitoring
- ✅ Error tracking
- ✅ Geo-distribution

### À configurer (optionnel)
- Google Analytics
- Hotjar (heatmaps)
- Sentry (error tracking)

---

## 🆘 Troubleshooting

### Problème : "Domain not found"
**Solution** : Attendez la propagation DNS (24-48h)
**Vérification** : https://dnschecker.org

### Problème : "SSL Certificate Error"
**Solution** : Vercel génère le certificat automatiquement sous 24h
**Action** : Patience, ça se fait tout seul

### Problème : "Build Failed"
**Solution** : Vérifiez les logs dans Vercel
**Action** : Corrigez les erreurs et redéployez

### Problème : "404 on routes"
**Solution** : Vérifiez next.config.js
**Action** : Assurez-vous que toutes les pages sont dans src/app/

---

## 📞 Support Vercel

- Documentation : https://vercel.com/docs
- Support : https://vercel.com/support
- Community : https://github.com/vercel/next.js/discussions

---

## ✅ Checklist Finale de Déploiement

### Avant le déploiement
- [x] Code testé localement
- [x] Build réussit sans erreur
- [x] Toutes les fonctionnalités testées
- [x] Variables d'environnement préparées
- [x] Configuration DNS prête

### Pendant le déploiement
- [ ] Compte Vercel créé
- [ ] Projet importé
- [ ] Variables d'environnement ajoutées
- [ ] Build réussi
- [ ] URL temporaire testée

### Après le déploiement
- [ ] Domaine talentproof.africa ajouté
- [ ] DNS configuré (Nameservers ou Records)
- [ ] SSL/HTTPS actif
- [ ] Toutes les pages accessibles
- [ ] Fonctionnalités testées en production
- [ ] WhatsApp links fonctionnent
- [ ] Admin accessible et sécurisé

---

## 🎯 Résumé des Actions à Faire

### 1️⃣ Dans votre registrar de domaine
```
Action : Modifier les Nameservers
Valeur 1 : ns1.vercel-dns.com
Valeur 2 : ns2.vercel-dns.com
```

### 2️⃣ Sur Vercel
```
1. Créer un compte
2. Importer le projet (dossier frontend)
3. Ajouter les variables d'environnement
4. Déployer
5. Ajouter le domaine talentproof.africa
```

### 3️⃣ Attendre la propagation
```
Délai : 2-48 heures
Vérification : https://dnschecker.org
```

### 4️⃣ Tester en production
```
URL : https://talentproof.africa
Admin : https://talentproof.africa/admin-tp
Mot de passe : admin2026
```

---

## 🎉 Après le Déploiement

### Votre site sera accessible sur :
- ✅ https://talentproof.africa
- ✅ https://www.talentproof.africa (redirect)
- ✅ SSL/HTTPS automatique
- ✅ CDN global (rapide partout en Afrique)
- ✅ Mises à jour automatiques via Git

### Fonctionnalités en production :
- ✅ Inscription des talents
- ✅ Annuaire public
- ✅ Admin sécurisé
- ✅ Système de transfert de profil
- ✅ Gestion du personnel
- ✅ Distinction preuves/documents
- ✅ Accès mobile optimisé

---

## 📞 Contact

**Support technique** :
- WhatsApp : +225 07 05 50 30 89
- Email : contact@talentproof.africa

**Vercel Support** :
- https://vercel.com/support

---

**Document créé le** : 31 mars 2026
**Version** : 5.5 - Déploiement Production
**Statut** : ✅ Prêt pour le déploiement
