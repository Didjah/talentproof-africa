# ⚡ Déploiement Rapide - TalentProof sur Vercel

## 🎯 ACTIONS IMMÉDIATES (15 minutes)

---

## ÉTAPE 1 : Créer un compte Vercel (2 min)

1. Allez sur : **https://vercel.com/signup**
2. Cliquez "Continue with GitHub" (recommandé)
3. Autorisez l'accès à votre compte GitHub

---

## ÉTAPE 2 : Déployer le projet (5 min)

### Option A : Via GitHub (RECOMMANDÉ)

1. **Pushez votre code sur GitHub** (si pas déjà fait)
   ```bash
   cd c:\Users\HP\Desktop\TalentProof
   git init
   git add .
   git commit -m "TalentProof v5.5 - Ready for production"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/talentproof.git
   git push -u origin main
   ```

2. **Dans Vercel Dashboard**
   - Cliquez "Add New Project"
   - Sélectionnez votre repo GitHub "talentproof"
   - Cliquez "Import"

3. **Configuration**
   ```
   Framework Preset: Next.js (détecté automatiquement)
   Root Directory: frontend
   Build Command: npm run build (auto)
   Output Directory: .next (auto)
   Install Command: npm install (auto)
   ```

4. **Variables d'environnement**
   Cliquez "Environment Variables" et ajoutez :
   ```
   NEXT_PUBLIC_SITE_URL = https://talentproof.africa
   NEXT_PUBLIC_WA_NUM1 = 2250705503089
   NEXT_PUBLIC_WA_NUM2 = 2250507939706
   NEXT_PUBLIC_EMAIL = contact@talentproof.africa
   NODE_ENV = production
   ```

5. **Déployez**
   - Cliquez "Deploy"
   - Attendez 2-3 minutes
   - ✅ Vous obtenez une URL : `talentproof-xxx.vercel.app`

---

### Option B : Via CLI Vercel (Alternative)

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
cd frontend
vercel --prod

# Suivre les instructions à l'écran
```

---

## ÉTAPE 3 : Configurer le domaine talentproof.africa (3 min)

### Dans Vercel Dashboard

1. Allez dans votre projet → **Settings** → **Domains**
2. Cliquez **"Add Domain"**
3. Entrez : `talentproof.africa`
4. Cliquez **"Add"**
5. Vercel vous montre les instructions DNS

### Ajoutez aussi www

1. Cliquez encore **"Add Domain"**
2. Entrez : `www.talentproof.africa`
3. Cochez **"Redirect to talentproof.africa"**
4. Cliquez **"Add"**

---

## ÉTAPE 4 : Configurer les DNS (5 min)

### 🎯 VALEURS DNS À COPIER

**Allez dans votre interface de gestion de domaine et configurez :**

```
NAMESERVERS (Recommandé) :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**OU (si nameservers impossible) :**

```
RECORD A :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECORD CNAME :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ⏰ ÉTAPE 5 : Attendre la propagation (2-24h)

### Que se passe-t-il ?
- 🌍 Les DNS se propagent dans le monde entier
- 🔒 Vercel génère le certificat SSL automatiquement
- ⚡ Le CDN se configure pour l'Afrique

### Vérification en temps réel
- **URL** : https://dnschecker.org
- **Domaine** : talentproof.africa
- **Type** : NS (Nameservers) ou A (IP)

### Quand c'est prêt ?
✅ Tous les serveurs (ou la majorité) affichent les nouvelles valeurs

---

## 🧪 ÉTAPE 6 : Tester en production

### URLs à vérifier
```
✅ https://talentproof.africa
✅ https://www.talentproof.africa
✅ https://talentproof.africa/annuaire
✅ https://talentproof.africa/inscription-talent
✅ https://talentproof.africa/admin-tp (mot de passe: admin2026)
```

### Fonctionnalités à tester
- [ ] Page d'accueil charge rapidement
- [ ] Formulaire d'inscription fonctionne
- [ ] Annuaire affiche les profils
- [ ] Admin accessible avec mot de passe
- [ ] Liens WhatsApp fonctionnent
- [ ] Responsive sur mobile

---

## 🎉 C'EST EN LIGNE !

### Votre site est maintenant accessible sur :
```
🌐 https://talentproof.africa
```

### Prochaines actions :
1. ✅ Partager le lien sur les réseaux sociaux
2. ✅ Inscrire les premiers talents
3. ✅ Inviter les recruteurs
4. ✅ Développer les partenariats

---

## 📊 Monitoring

### Dans Vercel Dashboard
- **Analytics** : Trafic en temps réel
- **Deployments** : Historique des déploiements
- **Logs** : Erreurs et warnings
- **Performance** : Vitesse de chargement

---

## 🔄 Mises à jour futures

### Déploiement automatique (si GitHub connecté)
```
1. Modifiez le code localement
2. Commitez : git commit -m "Update"
3. Pushez : git push
4. Vercel déploie automatiquement !
```

### Déploiement manuel
```bash
cd frontend
vercel --prod
```

---

## 📞 Support

**Technique** :
- WhatsApp : +225 07 05 50 30 89
- Email : contact@talentproof.africa

**Vercel** :
- Docs : https://vercel.com/docs
- Support : https://vercel.com/support

---

## ✅ CHECKLIST COMPLÈTE

### Préparation
- [x] Code finalisé et testé
- [x] Build réussit localement
- [x] Variables d'environnement préparées

### Déploiement
- [ ] Compte Vercel créé
- [ ] Projet déployé sur Vercel
- [ ] URL temporaire testée (talentproof-xxx.vercel.app)

### Configuration DNS
- [ ] Domaine ajouté dans Vercel
- [ ] Nameservers modifiés dans le registrar
- [ ] Propagation DNS en cours

### Validation
- [ ] https://talentproof.africa accessible
- [ ] SSL/HTTPS actif (cadenas 🔒)
- [ ] Toutes les pages fonctionnent
- [ ] Admin sécurisé
- [ ] Mobile responsive

### Lancement
- [ ] Annonce sur les réseaux sociaux
- [ ] Premiers talents inscrits
- [ ] Recruteurs invités
- [ ] Partenariats activés

---

**🚀 TalentProof est prêt à conquérir l'Afrique !**

---

**Document créé le** : 31 mars 2026
**Version** : 5.5 - Déploiement Express
**Temps estimé** : 15 minutes + propagation DNS
