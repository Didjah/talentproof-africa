# 🎨 MAQUETTE DÉTAILLÉE - NOUVELLE PAGE D'ACCUEIL

**Version :** 2.0  
**Date :** 29 mars 2026  
**Pour :** TalentProof Afrique

---

## 📐 STRUCTURE VISUELLE COMPLÈTE

### 🎯 Section 1 : HERO (Above the Fold)

```
┌────────────────────────────────────────────────────────────────┐
│  [NAVBAR - Sticky]                                             │
│  Logo | Fil Vidéo | Annuaire | Recruteur | Partenaires | 🔍  │
│  [+ Créer mon profil]                                          │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                                                                 │
│  🎯 HERO SECTION                                               │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  [Badge: 🤝 Pour tous les talents d'Afrique]                   │
│                                                                 │
│  Diplômé, certifié, autodidacte —                             │
│  ta preuve, c'est ce que tu sais faire.                       │
│                                                                 │
│  Chauffeur, aide ménagère, couturière, gardien...             │
│  Tout le monde a sa place — 14 000+ talents, 9 pays.          │
│                                                                 │
│  [+ Créer mon profil]  [📋 Annuaire →]                        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ 🚗       │  │ ⚡       │  │ ✂️       │                    │
│  │ Moussa D.│  │ Kofi A.  │  │ Fatou N. │                    │
│  │ Chauffeur│  │ Électr.  │  │ Coutur.  │                    │
│  │ 📍 Dakar │  │ 📍 Accra │  │ 📍 Abidj.│                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Caractéristiques :**
- **Fond :** Dégradé vert forêt (#0B1628 → #162F52)
- **Typographie :** Sora 900 pour le titre principal
- **Animation :** Fade-in progressif des cartes talents
- **CTA :** Bouton doré avec effet glow
- **Hauteur :** 85vh sur desktop, auto sur mobile

---

### 🔍 Section 2 : BARRE DE RECHERCHE INTELLIGENTE

```
┌────────────────────────────────────────────────────────────────┐
│  🔍  [Métier, compétence, ville ou nom...]          [Filtres]  │
│                                                                 │
│  Essaie : [Chauffeur] [Aide ménagère] [Gardien] [Couturière]  │
│                                                                 │
│  💡 Pas besoin de diplôme                                      │
│  Une photo ou un vocal de 60 sec suffit. Tu as ta place ici.  │
└────────────────────────────────────────────────────────────────┘
```

**Fonctionnalités :**
- **Autocomplete :** Suggestions en temps réel
- **Filtres rapides :** Métier, ville, type de preuve
- **Compteur de résultats :** "23 résultats sur 14 000"
- **Suggestions populaires :** Chips cliquables
- **État vide :** Message encourageant

---

### 📱 Section 3 : FEED DE TALENTS (3 Types de Cartes)

#### Type A : CARTE CERTIFIÉ (Badge Doré)

```
┌────────────────────────────────────────────────────────────────┐
│  ✦✦✦ CERTIFIÉ ✦✦✦                    Document vérifié         │
├────────────────────────────────────────────────────────────────┤
│  🧑 Amadou Diop                                    ● Disponible │
│  ⚡ Électricien · 12 ans d'exp.                                │
│  📍 Dakar, Sénégal                                             │
│                                                                 │
│  Installation électrique résidentielle et industrielle.        │
│  Certifié SENELEC. Interventions d'urgence 24/7.              │
│                                                                 │
│  📜 [Certificat SENELEC - Niveau 3]  [Voir le document ▼]     │
│                                                                 │
│  🎥 [Voir aussi la preuve vidéo]                               │
│                                                                 │
│  [💬 Contacter]  [🤍 42]  [📌]                                 │
└────────────────────────────────────────────────────────────────┘
```

**Design :**
- **Bordure :** 1.5px solid #F0C040 (or)
- **Bandeau supérieur :** Dégradé or foncé (#5C3A00 → #8B5E00)
- **Badge :** "✦ CERTIFIÉ" en or brillant
- **Document :** Accordéon cliquable avec aperçu
- **Ombre :** Plus prononcée pour se démarquer

---

#### Type B : CARTE VIDÉO (Player 16:9)

```
┌────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  🎥 Preuve vidéo                              0:60      │ │
│  │                                                          │ │
│  │                    ▶ PLAY                               │ │
│  │                                                          │ │
│  │  [Hover: Nom + Métier + Ville]                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  🧑 Fatou Ndiaye                                  ● Dispo 1 mois│
│  ✂️ Couturière · 12 ans d'exp.                                │
│  📍 Abidjan, Côte d'Ivoire                                     │
│                                                                 │
│  Tenues de cérémonie wax et bazin sur mesure.                 │
│  Créations uniques alliant tradition et modernité.            │
│                                                                 │
│  [💬 Contacter]  [🤍 41]  [📌]                                 │
└────────────────────────────────────────────────────────────────┘
```

**Design :**
- **Player :** Aspect ratio 16:9, thumbnail avec dégradé
- **Badge :** "🎥 Preuve vidéo" en violet (#5D21D3)
- **Hover :** Overlay avec infos + bouton play agrandi
- **Durée :** Badge en bas à droite
- **Transition :** Smooth scale sur hover

---

#### Type C : CARTE SIMPLE (Style Moovijob)

```
┌────────────────────────────────────────────────────────────────┐
│  🧑 Kofi Mensah                    ⚠️ Sans preuve             │
│  🔧 Mécanicien                                                 │
│  📍 Lagos, Nigeria  ⏱ 9 ans d'exp.  ● À négocier             │
│                                                                 │
│  Niveau d'expérience                                           │
│  ████████████░░░░░░░░ 60%                                      │
│                                                                 │
│  Installation et dépannage électrique toutes marques.         │
│  Certifié, travail soigné.                                    │
│                                                                 │
│  [Contacter]  Pas encore de vidéo · Encourage-le !            │
└────────────────────────────────────────────────────────────────┘
```

**Design :**
- **Layout :** Horizontal (avatar + infos côte à côte)
- **Badge :** "⚠️ Sans preuve" en gris neutre
- **Barre d'expérience :** Visuelle et progressive
- **Ton :** Encourageant, pas punitif
- **CTA :** Bouton simple, message bienveillant

---

### 🎙️ Section 4 : INSCRIPTION VOCALE

```
┌────────────────────────────────────────────────────────────────┐
│                    🎙️ INSCRIPTION VOCALE                       │
│  ══════════════════════════════════════════════════════════    │
│                                                                 │
│  Pas d'email, pas de CV ?                                      │
│  Parle — on s'occupe du reste.                                │
│                                                                 │
│  60 secondes pour décrire ton métier.                          │
│  Notre équipe crée ton profil gratuitement.                    │
│                                                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐                                │
│  │ 🎙️  │  │ ✨   │  │ 🚀   │                                │
│  │Parle │  │On crée│  │Visible│                               │
│  └──────┘  └──────┘  └──────┘                                │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │  Appuie sur le micro et parle de ton métier.         │   │
│  │  60 secondes maximum.                                 │   │
│  │                                                        │   │
│  │                    🎤                                  │   │
│  │              [Bouton Micro Doré]                      │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────── ou via WhatsApp ───────────────               │
│                                                                 │
│  [📱 S'inscrire via WhatsApp]                                  │
│                                                                 │
│  60 sec · 0 € · Sans formulaire                                │
└────────────────────────────────────────────────────────────────┘
```

**Fonctionnalités :**
- **Enregistreur :** MediaRecorder API avec visualisation audio
- **États :** Idle → Recording → Preview → Sending → Done
- **Feedback :** Animations et messages clairs
- **Fallback :** Bouton WhatsApp géant si micro refusé
- **Compteurs :** Statistiques rassurantes

---

### 🤝 Section 5 : PARTENAIRES

```
┌────────────────────────────────────────────────────────────────┐
│           ✦ POUR LES ÉCOLES & ENTREPRISES                      │
│  ══════════════════════════════════════════════════════════    │
│                                                                 │
│  Vous recrutez ou formez ?                                     │
│  Rejoignez TalentProof.                                        │
│                                                                 │
│  [💼 Business] [🎓 Écoles] [🌍 Afrique]                        │
│                                                                 │
│  Votre marque employeur au cœur de 14 000+ talents            │
│  africains. Recrutez plus vite, réduisez vos coûts.           │
│                                                                 │
│  3 partenaires · 14 000+ talents · 9 pays couverts            │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Nous contacter                                         │   │
│  │ ✉️ contact@talentproof.africa                          │   │
│  │ [📱 WhatsApp 1] [📱 WhatsApp 2]                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [✦ Devenir Partenaire]                                        │
└────────────────────────────────────────────────────────────────┘
```

**Design :**
- **Fond :** Dégradé vert foncé (#071F15 → #1B4332)
- **Boutons :** 3 couleurs (violet, bleu, cyan) pour différencier
- **Compteurs :** Chiffres dorés avec glow effect
- **Contact :** Encadré avec fond semi-transparent
- **CTA :** Bouton doré XXL

---

### 📄 Section 6 : FOOTER

```
┌────────────────────────────────────────────────────────────────┐
│                    TalentProof Afrique                         │
│                ✉️ contact@talentproof.africa                   │
│                                                                 │
│  [📱 WhatsApp 1] [📱 WhatsApp 2]                               │
│                                                                 │
│  Accueil · Annuaire · Guide · Recruteur · Partenaires         │
│  Inscription · Mentions légales · Confidentialité              │
│                                                                 │
│  © 2026 TalentProof Afrique — Tous droits réservés            │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎨 DESIGN SYSTEM DÉTAILLÉ

### Couleurs

```css
/* Primaires */
--primary-900: #071F15;  /* Vert forêt très foncé */
--primary-800: #0B1628;  /* Bleu-vert nuit */
--primary-700: #1B6B47;  /* Vert principal */
--primary-600: #2D9A68;  /* Vert clair */
--primary-500: #3DB87E;  /* Vert vif */

/* Or (Confiance) */
--gold-900: #5C3A00;     /* Or très foncé */
--gold-800: #78450A;     /* Or foncé */
--gold-700: #C9960F;     /* Or principal */
--gold-600: #F0C040;     /* Or clair */
--gold-500: #FFD666;     /* Or très clair */

/* Neutrals */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

/* Sémantiques */
--success: #16A34A;      /* Disponible */
--warning: #D97706;      /* Dispo 1 mois */
--info: #2563EB;         /* Info */
--danger: #DC2626;       /* Erreur */

/* Badges */
--badge-certified: linear-gradient(135deg, #C9960F, #F0C040);
--badge-video: #5D21D3;  /* Violet */
--badge-simple: #6B7280; /* Gris */
```

### Typographie

```css
/* Familles */
--font-display: 'Sora', sans-serif;        /* Titres */
--font-body: 'DM Sans', sans-serif;        /* Corps */
--font-mono: 'JetBrains Mono', monospace;  /* Code */

/* Tailles */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Poids */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### Espacements

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Ombres

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);

/* Spéciales */
--shadow-gold: 0 4px 20px rgba(201, 150, 15, 0.45);
--shadow-glow: 0 0 20px rgba(240, 192, 64, 0.4);
```

### Bordures

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.25rem;   /* 20px */
--radius-full: 9999px;   /* Cercle */

--radius-card: var(--radius-xl);
--radius-button: var(--radius-full);
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile First */
--mobile: 0px;        /* 0-639px */
--tablet: 640px;      /* 640-1023px */
--desktop: 1024px;    /* 1024-1279px */
--wide: 1280px;       /* 1280px+ */

/* Conteneurs max-width */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1180px;
```

---

## ⚡ ANIMATIONS

### Transitions Standard

```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
--transition-slower: 500ms ease;
```

### Animations Clés

```css
/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Glow Pulse */
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 0 8px rgba(240, 192, 64, 0.15);
  }
  50% {
    box-shadow: 0 0 0 18px rgba(240, 192, 64, 0.07);
  }
}

/* Scale Bounce */
@keyframes scaleBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

## 🎯 INTERACTIONS

### États des Boutons

```css
/* Bouton Primaire (Doré) */
.btn-primary {
  background: linear-gradient(135deg, #C9960F, #F0C040);
  color: #0D3B2E;
  box-shadow: var(--shadow-gold);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(201, 150, 15, 0.55);
}
.btn-primary:active {
  transform: translateY(0);
}

/* Bouton Secondaire (Vert) */
.btn-secondary {
  background: linear-gradient(135deg, #1B6B47, #2D9A68);
  color: white;
}

/* Bouton Ghost */
.btn-ghost {
  background: transparent;
  border: 1.5px solid var(--gray-200);
  color: var(--gray-700);
}
.btn-ghost:hover {
  background: var(--gray-50);
}
```

### États des Cartes

```css
.card {
  transition: transform var(--transition-base),
              box-shadow var(--transition-base);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

---

## 📊 MÉTRIQUES DE PERFORMANCE

### Objectifs Lighthouse

- **Performance :** 90+ (mobile), 95+ (desktop)
- **Accessibility :** 95+
- **Best Practices :** 95+
- **SEO :** 100

### Optimisations Clés

1. **Images :** Next.js Image avec lazy loading
2. **Fonts :** Preload + font-display: swap
3. **CSS :** Critical CSS inline, reste en async
4. **JS :** Code splitting par route
5. **API :** Debounce sur recherche (300ms)

---

## 🔄 ÉTATS DE CHARGEMENT

### Skeleton Loaders

```
┌────────────────────────────────────────┐
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                        │
│  ████████████████░░░░░░░░░░░░░░░░░░░  │
│  ████████████████████░░░░░░░░░░░░░░░  │
│                                        │
│  [░░░░░░░░░]  [░░░]  [░░░]            │
└────────────────────────────────────────┘
```

### Messages d'État

- **Chargement :** "Chargement des talents..."
- **Vide :** "Aucun résultat — essaie 'Gardien'"
- **Erreur :** "Oups ! Réessaie dans un instant."
- **Succès :** "✅ Profil créé avec succès !"

---

## 🌍 ADAPTATION MOBILE

### Changements Clés

1. **Hero :** Hauteur auto, padding réduit
2. **Recherche :** Full width, filtres en modal
3. **Cartes :** 1 colonne, espacement réduit
4. **Navigation :** Burger menu avec overlay
5. **CTA :** Sticky bottom bar sur scroll

### Touch Targets

- **Minimum :** 44x44px (Apple HIG)
- **Recommandé :** 48x48px (Material Design)
- **Espacement :** 8px minimum entre éléments

---

**Cette maquette est prête à être implémentée ! 🚀**

Veux-tu que je crée les composants React correspondants ?
