// ═══════════════════════════════════════════════════════
// TALENTPROOF - SERVICE API
// Gestion centralisée des appels API backend
// ═══════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Classe d'erreur personnalisée pour les erreurs API
 */
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Wrapper fetch avec gestion d'erreurs et retry
 */
async function fetchAPI(endpoint, options = {}) {
  const { retries = 0, ...fetchOptions } = options;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });

    // Tenter de parser la réponse JSON
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // Si le parsing échoue, utiliser le texte brut
      data = { message: await response.text() };
    }

    if (!response.ok) {
      throw new APIError(
        data.message || `Erreur ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    // Si c'est déjà une APIError, la relancer
    if (error instanceof APIError) {
      throw error;
    }

    // Erreur réseau ou autre
    if (retries > 0) {
      console.log(`Retry ${retries} tentatives restantes...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchAPI(endpoint, { ...options, retries: retries - 1 });
    }

    throw new APIError(
      'Impossible de se connecter au serveur. Vérifie ta connexion.',
      0,
      null
    );
  }
}

// ═══════════════════════════════════════════════════════
// API TALENTS / PROFILS
// ═══════════════════════════════════════════════════════

export const talentAPI = {
  /**
   * Récupérer tous les profils avec filtres et pagination
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise<{data: Array, total: number, page: number}>}
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Filtres de recherche
    if (filters.metier) params.append('metier', filters.metier);
    if (filters.ville) params.append('ville', filters.ville);
    if (filters.pays) params.append('pays', filters.pays);
    if (filters.disponible) params.append('disponible', filters.disponible);
    if (filters.hasVideo !== undefined) params.append('hasVideo', filters.hasVideo);
    if (filters.hasDocument !== undefined) params.append('hasDocument', filters.hasDocument);
    
    // Pagination
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    return fetchAPI(`/profiles${queryString ? `?${queryString}` : ''}`, {
      retries: 2,
    });
  },

  /**
   * Récupérer un profil par ID
   * @param {string} id - ID du profil
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    return fetchAPI(`/profiles/${id}`, { retries: 2 });
  },

  /**
   * Recherche de talents par texte libre
   * @param {string} query - Texte de recherche
   * @param {Object} filters - Filtres additionnels
   * @returns {Promise<{data: Array, total: number}>}
   */
  search: async (query, filters = {}) => {
    const params = new URLSearchParams({ q: query, ...filters });
    return fetchAPI(`/search?${params.toString()}`, { retries: 2 });
  },

  /**
   * Créer un nouveau profil
   * @param {Object} profileData - Données du profil
   * @returns {Promise<Object>}
   */
  create: async (profileData) => {
    return fetchAPI('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Mettre à jour un profil
   * @param {string} id - ID du profil
   * @param {Object} updates - Données à mettre à jour
   * @returns {Promise<Object>}
   */
  update: async (id, updates) => {
    return fetchAPI(`/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Supprimer un profil
   * @param {string} id - ID du profil
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    return fetchAPI(`/profiles/${id}`, {
      method: 'DELETE',
    });
  },
};

// ═══════════════════════════════════════════════════════
// API AUTHENTIFICATION
// ═══════════════════════════════════════════════════════

export const authAPI = {
  /**
   * Connexion utilisateur
   * @param {string} phone - Numéro de téléphone
   * @param {string} password - Mot de passe
   * @returns {Promise<{token: string, user: Object}>}
   */
  login: async (phone, password) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  },

  /**
   * Inscription utilisateur
   * @param {Object} userData - Données utilisateur
   * @returns {Promise<{token: string, user: Object}>}
   */
  register: async (userData) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Vérifier le token actuel
   * @param {string} token - JWT token
   * @returns {Promise<Object>}
   */
  verify: async (token) => {
    return fetchAPI('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * Déconnexion
   * @returns {Promise<Object>}
   */
  logout: async () => {
    return fetchAPI('/auth/logout', {
      method: 'POST',
    });
  },
};

// ═══════════════════════════════════════════════════════
// API DOCUMENTS
// ═══════════════════════════════════════════════════════

export const documentAPI = {
  /**
   * Upload un document
   * @param {File} file - Fichier à uploader
   * @param {string} profileId - ID du profil
   * @returns {Promise<Object>}
   */
  upload: async (file, profileId) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('profileId', profileId);

    return fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
      // Ne pas définir Content-Type, le navigateur le fera automatiquement
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new APIError(data.message, response.status, data);
      }
      return data;
    });
  },

  /**
   * Récupérer les documents d'un profil
   * @param {string} profileId - ID du profil
   * @returns {Promise<Array>}
   */
  getByProfile: async (profileId) => {
    return fetchAPI(`/documents/profile/${profileId}`);
  },

  /**
   * Supprimer un document
   * @param {string} documentId - ID du document
   * @returns {Promise<Object>}
   */
  delete: async (documentId) => {
    return fetchAPI(`/documents/${documentId}`, {
      method: 'DELETE',
    });
  },
};

// ═══════════════════════════════════════════════════════
// API BADGES
// ═══════════════════════════════════════════════════════

export const badgeAPI = {
  /**
   * Récupérer les badges d'un profil
   * @param {string} profileId - ID du profil
   * @returns {Promise<Array>}
   */
  getByProfile: async (profileId) => {
    return fetchAPI(`/badges/profile/${profileId}`);
  },

  /**
   * Attribuer un badge à un profil
   * @param {string} profileId - ID du profil
   * @param {string} badgeType - Type de badge
   * @returns {Promise<Object>}
   */
  assign: async (profileId, badgeType) => {
    return fetchAPI('/badges/assign', {
      method: 'POST',
      body: JSON.stringify({ profileId, badgeType }),
    });
  },
};

// ═══════════════════════════════════════════════════════
// EXPORT PAR DÉFAUT
// ═══════════════════════════════════════════════════════

export default {
  talent: talentAPI,
  auth: authAPI,
  document: documentAPI,
  badge: badgeAPI,
};

// Export de l'erreur pour gestion dans les composants
export { APIError };
