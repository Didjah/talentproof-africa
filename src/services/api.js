import { supabase } from '../lib/supabaseClient';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// TALENTPROOF - SERVICE API
// Gestion centralisÃ©e des appels API backend
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Classe d'erreur personnalisÃ©e pour les erreurs API
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

    // Tenter de parser la rÃ©ponse JSON
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // Si le parsing Ã©choue, utiliser le texte brut
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
    // Si c'est dÃ©jÃ  une APIError, la relancer
    if (error instanceof APIError) {
      throw error;
    }

    // Erreur rÃ©seau ou autre
    if (retries > 0) {
      console.log(`Retry ${retries} tentatives restantes...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchAPI(endpoint, { ...options, retries: retries - 1 });
    }

    throw new APIError(
      'Impossible de se connecter au serveur. VÃ©rifie ta connexion.',
      0,
      null
    );
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// API TALENTS / PROFILS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const talentAPI = {
  /**
   * RÃ©cupÃ©rer tous les profils avec filtres et pagination
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise<{data: Array, total: number, page: number}>}
   */
  getAll: async (filters = {}) => {
    let query = supabase.from('talents').select('*');
    if (filters.metier) query = query.eq('metier', filters.metier);
    if (filters.ville) query = query.eq('ville', filters.ville);
    if (filters.pays) query = query.eq('pays', filters.pays);
    if (filters.niveau) query = query.eq('niveau', filters.niveau);
    const { data, error } = await query;
    if (error) throw error;
    return { data: data || [], total: data?.length || 0 };
    // ancien code supprimé
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
   * RÃ©cupÃ©rer un profil par ID
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
   * CrÃ©er un nouveau profil
   * @param {Object} profileData - DonnÃ©es du profil
   * @returns {Promise<Object>}
   */
  create: async (profileData) => {
    return fetchAPI('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Mettre Ã  jour un profil
   * @param {string} id - ID du profil
   * @param {Object} updates - DonnÃ©es Ã  mettre Ã  jour
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// API AUTHENTIFICATION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const authAPI = {
  /**
   * Connexion utilisateur
   * @param {string} phone - NumÃ©ro de tÃ©lÃ©phone
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
   * @param {Object} userData - DonnÃ©es utilisateur
   * @returns {Promise<{token: string, user: Object}>}
   */
  register: async (userData) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * VÃ©rifier le token actuel
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
   * DÃ©connexion
   * @returns {Promise<Object>}
   */
  logout: async () => {
    return fetchAPI('/auth/logout', {
      method: 'POST',
    });
  },
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// API DOCUMENTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const documentAPI = {
  /**
   * Upload un document
   * @param {File} file - Fichier Ã  uploader
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
      // Ne pas dÃ©finir Content-Type, le navigateur le fera automatiquement
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new APIError(data.message, response.status, data);
      }
      return data;
    });
  },

  /**
   * RÃ©cupÃ©rer les documents d'un profil
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// API BADGES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const badgeAPI = {
  /**
   * RÃ©cupÃ©rer les badges d'un profil
   * @param {string} profileId - ID du profil
   * @returns {Promise<Array>}
   */
  getByProfile: async (profileId) => {
    return fetchAPI(`/badges/profile/${profileId}`);
  },

  /**
   * Attribuer un badge Ã  un profil
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// EXPORT PAR DÃ‰FAUT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export default {
  talent: talentAPI,
  auth: authAPI,
  document: documentAPI,
  badge: badgeAPI,
};

// Export de l'erreur pour gestion dans les composants
export { APIError };


