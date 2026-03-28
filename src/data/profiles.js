/* ══════════════════════════════════════════════════
   SOURCE UNIQUE — profils + partenaires
   mediaType: "video" | "image"
   Règle de tri feed :
     hasVideo || hasImage → FIL VIDÉO
     hasDoc              → ANNUAIRE
     aucun               → ANNUAIRE (simple)
══════════════════════════════════════════════════ */

/* ── Palette visuelle par métier (simule une vraie photo) ── */
export const MEDIA_PALETTE = {
  "💻": { bg: "135deg, #0F2027 0%, #203A43 50%, #2C5364 100%", accent: "#38BDF8" },
  "✂️": { bg: "135deg, #4A1942 0%, #C5467A 50%, #FF9A9E 100%", accent: "#F9A8D4" },
  "🚗": { bg: "135deg, #0D1B2A 0%, #1B263B 50%, #415A77 100%", accent: "#90E0EF" },
  "🔧": { bg: "135deg, #1A0A00 0%, #3D1C00 50%, #6B3A1F 100%", accent: "#FB923C" },
  "🍳": { bg: "135deg, #1A0500 0%, #7C2D12 50%, #C2410C 100%", accent: "#FED7AA" },
  "⚡": { bg: "135deg, #0C0A1E 0%, #1E1B4B 50%, #312E81 100%", accent: "#A5B4FC" },
  "🧱": { bg: "135deg, #1C0D00 0%, #451A03 50%, #78350F 100%", accent: "#FCD34D" },
};

/* ════════════════════════════════════════════════
   PROFILS — FIL VIDÉO  (hasVideo || hasImage)
════════════════════════════════════════════════ */
export const TOUS_PROFILS = [
  {
    id: "v1", nom: "Nadia Essomba",    metier: "Développeuse", ville: "Douala",
    pays: "🇨🇲", experience: 4, avatar: "💻", disponible: "1_month",
    hasVideo: true, hasImage: false, hasDoc: false,
    mediaType: "video", phone: "237690123456", likes: 34,
    bio: "React & Node.js. Passionnée de fintech et d'applications mobiles pour l'Afrique subsaharienne.",
    tags: ["React", "Node.js", "Fintech"],
  },
  {
    id: "v2", nom: "Fatou Koné",       metier: "Couturière",   ville: "Abidjan",
    pays: "🇨🇮", experience: 5, avatar: "✂️", disponible: "immediate",
    hasVideo: false, hasImage: true, hasDoc: false,
    mediaType: "image", phone: "2250707234567", likes: 58, fromWhatsApp: true,
    imageCaption: "Robe de mariée wax — collection été 2025",
    bio: "Créations wax et bazin. Robes de mariage et tenues de cérémonie sur mesure. Livraison partout en CI.",
    tags: ["Wax", "Cérémonie", "Sur mesure"],
  },
  {
    id: "v3", nom: "Chidi Okonkwo",    metier: "Chauffeur",    ville: "Lagos",
    pays: "🇳🇬", experience: 9, avatar: "🚗", disponible: "immediate",
    hasVideo: true, hasImage: false, hasDoc: false,
    mediaType: "video", phone: "2348023456789", likes: 27,
    bio: "VTC professionnel et transport de personnel entreprise. Anglais courant. Voiture récente.",
    tags: ["VTC", "Corporate", "Anglais"],
  },
  {
    id: "v4", nom: "Mariam Ouédraogo", metier: "Couturière",   ville: "Ouagadougou",
    pays: "🇧🇫", experience: 3, avatar: "✂️", disponible: "immediate",
    hasVideo: false, hasImage: true, hasDoc: false,
    mediaType: "image", phone: "22670345678", likes: 41, fromWhatsApp: true,
    imageCaption: "Tenue brodée à la main — commande mariage Ouagadougou",
    bio: "Mode africaine contemporaine. Créations brodées à la main, wax imprimé et textile local burkinabé.",
    tags: ["Broderie", "Wax", "Mode locale"],
  },
  {
    id: "v5", nom: "Boubacar Sow",     metier: "Soudeur",      ville: "Niamey",
    pays: "🇳🇪", experience: 6, avatar: "🔧", disponible: "1_month",
    hasVideo: false, hasImage: true, hasDoc: false,
    mediaType: "image", phone: "22796456789", likes: 19,
    imageCaption: "Portail métallique forgé — commande privée 2025",
    bio: "Soudure à l'arc et oxyacétylénique. Fabrication de portes, fenêtres métalliques et structures légères.",
    tags: ["Soudure arc", "Métallerie", "Fabrication"],
  },
  {
    id: "v6", nom: "Koffi Mensah",     metier: "Cuisinier",    ville: "Lomé",
    pays: "🇹🇬", experience: 7, avatar: "🍳", disponible: "immediate",
    hasVideo: true, hasImage: false, hasDoc: false,
    mediaType: "video", phone: "22890567890", likes: 63, fromWhatsApp: true,
    bio: "Cuisine africaine et fusion. Spécialiste des buffets d'entreprise et mariages. 7 ans en restauration.",
    tags: ["Fusion", "Buffet", "Événements"],
  },

  /* ── ANNUAIRE (hasDoc) ── */
  { id:"a1", nom:"Amadou Diallo",   metier:"Maçon",        ville:"Dakar",         pays:"🇸🇳", experience:8,  avatar:"🧱", disponible:"immediate", phone:"221776123456", likes:45, hasVideo:true,  hasDoc:true,  docLabel:"BTS Génie Civil",                         issuedBy:"Université Cheikh Anta Diop",  issuedYear:2018, bio:"Spécialiste fondations, carrelage et finitions. 8 ans sur des chantiers résidentiels à Dakar.", tags:["Fondations","Carrelage","Finitions"] },
  { id:"a2", nom:"Ibrahim Traoré",  metier:"Chauffeur",    ville:"Bamako",         pays:"🇲🇱", experience:12, avatar:"🚗", disponible:"negotiable", phone:"22366234567",  likes:22, fromWhatsApp:true, hasVideo:false, hasDoc:true,  docLabel:"Permis Poids Lourd + FIMO",               issuedBy:"École de conduite BAMAKO Pro", issuedYear:2014, bio:"Transport de marchandises inter-villes Mali–Sénégal–Guinée. Ponctuel, sérieux, référencé.",   tags:["Poids lourd","Longue distance","FIMO"] },
  { id:"a3", nom:"Moussa Coulibaly",metier:"Soudeur",      ville:"Conakry",        pays:"🇬🇳", experience:10, avatar:"🔧", disponible:"immediate", phone:"224622345678", likes:38, hasVideo:true,  hasDoc:true,  docLabel:"Certificat Soudure TIG/MIG",              issuedBy:"CFPT Conakry",                 issuedYear:2016, bio:"Soudure TIG et MIG, charpente métallique, garde-corps décoratifs sur mesure.",             tags:["TIG","MIG","Charpente"] },
  { id:"a4", nom:"Aïsha Mensah",    metier:"Cuisinière",   ville:"Accra",          pays:"🇬🇭", experience:6,  avatar:"🍳", disponible:"immediate", phone:"233244456789", likes:51, hasVideo:true,  hasDoc:true,  docLabel:"CAP Cuisine Africaine & Continentale",   issuedBy:"École Hôtelière d'Accra",      issuedYear:2020, bio:"Cuisine africaine et continentale. Traiteur événementiel jusqu'à 500 personnes.",          tags:["Traiteur","Événementiel","Africain"] },
  { id:"a5", nom:"Léa Randriamaro", metier:"Développeuse", ville:"Antananarivo",   pays:"🇲🇬", experience:2,  avatar:"💻", disponible:"immediate", phone:"261341567890", likes:17, hasVideo:true,  hasDoc:true,  docLabel:"Licence Informatique",                    issuedBy:"Université d'Antananarivo",    issuedYear:2023, bio:"Flutter & Firebase. Applications mobiles e-commerce et santé numérique.",                  tags:["Flutter","Firebase","Mobile"] },
  { id:"s1", nom:"Kofi Asante",     metier:"Maçon",        ville:"Kumasi",         pays:"🇬🇭", experience:15, avatar:"🧱", disponible:"negotiable", phone:"233246678901", likes:9,  hasVideo:false, hasDoc:false, bio:"Maçonnerie traditionnelle et moderne. Chef de chantier 15 ans.", tags:["Chef de chantier","Résidentiel","Traditionnel"] },
  { id:"s2", nom:"Seydou Ba",       metier:"Électricien",  ville:"Dakar",          pays:"🇸🇳", experience:7,  avatar:"⚡", disponible:"immediate", phone:"221777789012", likes:14, hasVideo:false, hasDoc:false, bio:"Installation électrique résidentielle et industrielle. Dépannage 24h/24.", tags:["Basse tension","Dépannage","Industrie"] },
];

/* ════════════════════════════════════════════════
   PARTENAIRES — insérés dans le fil
   position : index après lequel insérer la carte
════════════════════════════════════════════════ */
export const PARTENAIRES = [
  {
    id: "p1",
    type: "partner",
    badge: "PARTENAIRE OFFICIEL",
    nom: "CFPT Abidjan",
    soustitre: "Centre de Formation Professionnelle & Technique",
    pays: "🇨🇮", ville: "Abidjan",
    description: "Formez-vous aux métiers de demain. Nos 12 filières certifiantes préparent à l'emploi en 6 à 18 mois. Taux d'insertion : 87%.",
    stats: [
      { val: "2 400+", lbl: "diplômés/an" },
      { val: "12",     lbl: "filières" },
      { val: "87%",    lbl: "insertion" },
    ],
    cta1: { label: "Voir nos formations", href: "#" },
    cta2: { label: "Nous contacter", href: "#" },
    logo: "🏫",
    theme: "formation",
    insertAfter: 1, // après le 2e talent
  },
  {
    id: "p2",
    type: "partner",
    badge: "PROMOTION",
    nom: "Orange Afrique Emploi",
    soustitre: "Programme de recrutement digital 2025",
    pays: "🌍", ville: "Dakar · Abidjan · Douala",
    description: "Orange recrute 300 techniciens réseau et développeurs mobiles en Afrique subsaharienne. Salaire compétitif + formation continue + mobilité internationale.",
    stats: [
      { val: "300",    lbl: "postes ouverts" },
      { val: "18",     lbl: "pays" },
      { val: "CDI",    lbl: "contrat" },
    ],
    cta1: { label: "Voir les offres", href: "#" },
    cta2: { label: "Nous contacter", href: "#" },
    logo: "📡",
    theme: "entreprise",
    insertAfter: 3, // après le 4e talent
  },
  {
    id: "p3",
    type: "partner",
    badge: "PARTENAIRE OFFICIEL",
    nom: "Institut Technique de Dakar",
    soustitre: "BTP · Électricité · Plomberie · Menuiserie",
    pays: "🇸🇳", ville: "Dakar",
    description: "60 ans d'excellence dans la formation aux métiers du bâtiment. Ateliers équipés, instructeurs certifiés, stages en entreprise garantis.",
    stats: [
      { val: "60 ans", lbl: "d'expérience" },
      { val: "4",      lbl: "filières BTP" },
      { val: "100%",   lbl: "stage garanti" },
    ],
    cta1: { label: "Voir nos formations", href: "#" },
    cta2: { label: "Nous contacter", href: "#" },
    logo: "🏗️",
    theme: "formation",
    insertAfter: 5, // après le 6e talent
  },
];

export const PROFILS_VIDEO    = TOUS_PROFILS.filter(p => (p.hasVideo || p.hasImage) && !p.hasDoc);
export const PROFILS_ANNUAIRE = TOUS_PROFILS.filter(p => p.hasDoc || (!p.hasVideo && !p.hasImage && !p.hasDoc));
export const metiersOf        = (arr) => ["Tous", ...Array.from(new Set(arr.map(p => p.metier))).sort()];
