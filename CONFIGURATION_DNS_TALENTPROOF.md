# 🌐 Configuration DNS pour talentproof.africa

## 📍 INSTRUCTIONS PRÉCISES POUR VOTRE REGISTRAR

---

## ✅ OPTION RECOMMANDÉE : Nameservers Vercel

### Pourquoi cette option ?
- ✅ Configuration automatique (zéro erreur)
- ✅ SSL/HTTPS instantané
- ✅ CDN global optimisé pour l'Afrique
- ✅ Mises à jour DNS automatiques
- ✅ Performance maximale

### 🎯 VALEURS À COPIER-COLLER

**Dans votre interface de gestion de domaine, section "Nameservers" :**

```
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com
```

### 📝 Étapes détaillées

#### 1. Connectez-vous à votre registrar
Exemples de registrars populaires :
- Namecheap : https://namecheap.com
- GoDaddy : https://godaddy.com
- OVH : https://ovh.com
- Google Domains : https://domains.google
- Gandi : https://gandi.net

#### 2. Trouvez votre domaine talentproof.africa
- Cliquez sur "Manage" ou "Gérer"
- Cherchez "Domain Settings" ou "Paramètres du domaine"

#### 3. Accédez aux Nameservers
Cherchez une section nommée :
- "Nameservers"
- "DNS Servers"
- "Serveurs de noms"
- "Name Server Settings"

#### 4. Changez le mode
Sélectionnez :
- "Custom Nameservers" ou
- "Use custom nameservers" ou
- "Serveurs de noms personnalisés"

#### 5. Entrez les valeurs Vercel
```
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com
```

#### 6. Sauvegardez
- Cliquez "Save" ou "Enregistrer"
- Confirmez les modifications

#### 7. Attendez la propagation
- **Délai normal** : 2-4 heures
- **Délai maximum** : 24-48 heures
- **Vérification** : https://dnschecker.org

---

## 🔄 OPTION ALTERNATIVE : Configuration DNS Manuelle

### Si vous ne pouvez pas changer les nameservers

**Dans votre interface DNS, ajoutez ces 2 records :**

### Record 1 : Domaine principal (talentproof.africa)

```
Type: A
Name: @ (ou laissez vide, ou "talentproof.africa")
Value: 76.76.21.21
TTL: 3600 (ou Auto)
Priority: N/A
```

### Record 2 : Sous-domaine www

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (ou Auto)
Priority: N/A
```

### ⚠️ Important
- **Supprimez** tous les anciens records A ou CNAME pour @ et www
- **Ne gardez** que les nouveaux records Vercel
- **Vérifiez** qu'il n'y a pas de conflit avec d'autres records

---

## 📸 Captures d'écran des interfaces populaires

### Namecheap
```
1. Dashboard → Domain List → Manage
2. Advanced DNS → Nameserver Type → Custom DNS
3. Entrez : ns1.vercel-dns.com et ns2.vercel-dns.com
4. Cliquez la coche verte pour sauvegarder
```

### GoDaddy
```
1. My Products → Domains → DNS
2. Nameservers → Change → Custom
3. Entrez : ns1.vercel-dns.com et ns2.vercel-dns.com
4. Save
```

### OVH
```
1. Noms de domaine → talentproof.africa
2. Serveurs DNS → Modifier les serveurs DNS
3. DNS personnalisés
4. Entrez : ns1.vercel-dns.com et ns2.vercel-dns.com
5. Valider
```

---

## 🔍 Vérification de la Configuration

### Étape 1 : Vérifier les Nameservers
```bash
# Windows (CMD)
nslookup -type=NS talentproof.africa

# Résultat attendu :
# ns1.vercel-dns.com
# ns2.vercel-dns.com
```

### Étape 2 : Vérifier la propagation DNS
Allez sur : https://dnschecker.org
- Entrez : `talentproof.africa`
- Type : `A` ou `NS`
- Vérifiez que les serveurs du monde entier voient la nouvelle configuration

### Étape 3 : Tester l'accès
```
https://talentproof.africa → Doit afficher votre site
https://www.talentproof.africa → Doit rediriger vers talentproof.africa
```

---

## ⏱️ Timeline de Déploiement

### Jour 1 - Configuration (Vous)
- ✅ Créer compte Vercel
- ✅ Déployer le projet
- ✅ Configurer les DNS

### Jour 1-2 - Propagation (Automatique)
- ⏳ DNS se propage mondialement
- ⏳ Vercel génère le certificat SSL
- ⏳ CDN se configure

### Jour 2 - Validation (Vous)
- ✅ Tester toutes les URLs
- ✅ Vérifier les fonctionnalités
- ✅ Tester sur mobile
- ✅ Partager le lien !

---

## 🎯 VALEURS DNS - RÉCAPITULATIF

### Pour copier-coller dans votre interface :

**OPTION 1 - Nameservers (RECOMMANDÉ)**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**OPTION 2 - Records DNS (Alternative)**
```
Record A :
  Type: A
  Name: @
  Value: 76.76.21.21
  TTL: 3600

Record CNAME :
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  TTL: 3600
```

---

## 🚨 Erreurs Courantes à Éviter

### ❌ Erreur 1 : Garder les anciens records
**Problème** : Conflit entre anciens et nouveaux records
**Solution** : Supprimez TOUS les anciens records A et CNAME avant d'ajouter les nouveaux

### ❌ Erreur 2 : Mauvais TTL
**Problème** : Propagation très lente
**Solution** : Utilisez TTL = 3600 (1 heure) ou Auto

### ❌ Erreur 3 : Oublier le www
**Problème** : www.talentproof.africa ne fonctionne pas
**Solution** : Ajoutez le record CNAME pour www

### ❌ Erreur 4 : Tester trop tôt
**Problème** : "Site not found" alors que la config est bonne
**Solution** : Attendez 2-4 heures minimum avant de tester

---

## 📞 Support

### Si vous avez des difficultés

**1. Vérifiez votre registrar**
- Chaque registrar a une interface différente
- Cherchez "DNS" ou "Nameservers" dans les menus
- Consultez la documentation de votre registrar

**2. Contactez le support de votre registrar**
- Demandez : "Comment changer les nameservers pour pointer vers Vercel ?"
- Donnez-leur : ns1.vercel-dns.com et ns2.vercel-dns.com

**3. Support Vercel**
- Documentation : https://vercel.com/docs/concepts/projects/domains
- Support : https://vercel.com/support

---

## ✅ Confirmation de Réussite

### Vous saurez que c'est réussi quand :

1. ✅ https://talentproof.africa affiche votre site
2. ✅ Le cadenas 🔒 (SSL) est présent dans la barre d'adresse
3. ✅ https://www.talentproof.africa redirige vers talentproof.africa
4. ✅ Toutes les pages fonctionnent
5. ✅ L'admin est accessible sur /admin-tp
6. ✅ Les inscriptions fonctionnent

---

## 🎉 Félicitations !

Une fois la configuration DNS terminée, **talentproof.africa sera en ligne** et accessible partout dans le monde !

**Prochaines étapes** :
1. Partager le lien sur les réseaux sociaux
2. Commencer à inscrire les premiers talents
3. Inviter les recruteurs
4. Développer les partenariats

---

**Document créé le** : 31 mars 2026
**Version** : 5.5 - Configuration DNS
**Statut** : ✅ Instructions prêtes pour la manipulation


