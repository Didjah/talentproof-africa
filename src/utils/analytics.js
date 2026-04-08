/**
 * TalentProof Analytics - Système de tracking local
 * Stockage persistant dans localStorage
 */

// Clés de stockage
const STORAGE_KEYS = {
  CONTACTS: 'tp_contacts_count',
  CONTACT_EVENTS: 'tp_contact_events',
  PROFILES: 'tp_profiles',
  STATS: 'tp_stats'
};

/**
 * Initialise les données analytics si elles n'existent pas
 */
export function initAnalytics() {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, '0');
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CONTACT_EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.CONTACT_EVENTS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    // Profils de démonstration
    const demoProfiles = [
      { id: 1, nom: "Moussa Diallo", metier: "Chauffeur", ville: "Dakar", pays: "SN", statut: "Vérifié", dateCreation: "2026-03-15", contacts: 12 },
      { id: 2, nom: "Fatou Ndiaye", metier: "Couturière", ville: "Abidjan", pays: "CI", statut: "Vérifié", dateCreation: "2026-03-18", contacts: 23 },
      { id: 3, nom: "Kofi Mensah", metier: "Électricien", ville: "Lagos", pays: "NG", statut: "En attente", dateCreation: "2026-03-25", contacts: 5 },
    ];
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(demoProfiles));
  }
}

/**
 * Enregistre un clic sur le bouton WhatsApp
 * @param {Object} data - Données de l'événement (profilId, profilNom, source, etc.)
 */
export function trackWhatsAppClick(data = {}) {
  if (typeof window === 'undefined') return;
  
  try {
    // Incrémenter le compteur total
    const currentCount = parseInt(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '0');
    localStorage.setItem(STORAGE_KEYS.CONTACTS, String(currentCount + 1));
    
    // Enregistrer l'événement détaillé
    const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_EVENTS) || '[]');
    const newEvent = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'whatsapp_click',
      ...data
    };
    events.push(newEvent);
    
    // Garder seulement les 1000 derniers événements
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }
    
    localStorage.setItem(STORAGE_KEYS.CONTACT_EVENTS, JSON.stringify(events));
    
    // Mettre à jour le compteur de contacts du profil si profilId fourni
    if (data.profilId) {
      updateProfileContactCount(data.profilId);
    }
    
    console.log('📊 TalentProof Analytics: WhatsApp click tracked', newEvent);
  } catch (error) {
    console.error('Erreur tracking:', error);
  }
}

/**
 * Met à jour le compteur de contacts d'un profil
 */
function updateProfileContactCount(profilId) {
  try {
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const profile = profiles.find(p => p.id === profilId);
    if (profile) {
      profile.contacts = (profile.contacts || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    }
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
  }
}

/**
 * Récupère les statistiques globales
 */
export function getGlobalStats() {
  if (typeof window === 'undefined') return null;
  
  try {
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const contactsCount = parseInt(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '0');
    const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_EVENTS) || '[]');
    
    // Calculer la ville la plus active
    const villeCount = {};
    profiles.forEach(p => {
      villeCount[p.ville] = (villeCount[p.ville] || 0) + (p.contacts || 0);
    });
    const topVille = Object.entries(villeCount).sort((a, b) => b[1] - a[1])[0];
    
    return {
      totalProfiles: profiles.length,
      totalContacts: contactsCount,
      topVille: topVille ? topVille[0] : 'N/A',
      topVilleContacts: topVille ? topVille[1] : 0,
      verifiedProfiles: profiles.filter(p => p.statut === 'Vérifié').length,
      pendingProfiles: profiles.filter(p => p.statut === 'En attente').length,
      recentEvents: events.slice(-10).reverse(),
    };
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    return null;
  }
}

/**
 * Récupère tous les profils
 */
export function getAllProfiles() {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
  } catch (error) {
    console.error('Erreur récupération profils:', error);
    return [];
  }
}

/**
 * Ajoute un nouveau profil
 */
export function addProfile(profileData) {
  if (typeof window === 'undefined') return false;
  
  try {
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const newProfile = {
      id: Date.now(),
      dateCreation: new Date().toISOString().split('T')[0],
      contacts: 0,
      statut: 'En attente',
      ...profileData
    };
    profiles.push(newProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    return true;
  } catch (error) {
    console.error('Erreur ajout profil:', error);
    return false;
  }
}

/**
 * Met à jour le statut d'un profil
 */
export function updateProfileStatus(profilId, newStatus) {
  if (typeof window === 'undefined') return false;
  
  try {
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const profile = profiles.find(p => p.id === profilId);
    if (profile) {
      profile.statut = newStatus;
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    return false;
  }
}

/**
 * Réinitialise toutes les données (pour tests)
 */
export function resetAnalytics() {
  if (typeof window === 'undefined') return;
  
  if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toutes les données analytics ?')) {
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.CONTACT_EVENTS);
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    initAnalytics();
    alert('✅ Données réinitialisées !');
    window.location.reload();
  }
}
