// ═══════════════════════════════════════════════════════
// TALENTPROOF - ZUSTAND STORE
// Gestion d'état globale pour les talents
// ═══════════════════════════════════════════════════════

import { create } from 'zustand';
import { talentAPI } from '../services/api';

export const useTalentStore = create((set, get) => ({
  // ─────────────────────────────────────────────────────
  // ÉTAT
  // ─────────────────────────────────────────────────────
  
  talents: [],
  loading: false,
  error: null,
  
  // Filtres de recherche
  filters: {
    metier: '',
    ville: '',
    pays: '',
    disponible: '',
    hasVideo: undefined,
    hasDocument: undefined,
  },
  
  // Pagination
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    hasMore: true,
  },
  
  // Recherche textuelle
  searchQuery: '',

  // ─────────────────────────────────────────────────────
  // ACTIONS - FILTRES
  // ─────────────────────────────────────────────────────
  
  /**
   * Mettre à jour les filtres et relancer la recherche
   */
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }, // Reset à la page 1
    }));
    get().fetchTalents();
  },

  /**
   * Réinitialiser tous les filtres
   */
  resetFilters: () => {
    set({
      filters: {
        metier: '',
        ville: '',
        pays: '',
        disponible: '',
        hasVideo: undefined,
        hasDocument: undefined,
      },
      searchQuery: '',
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        hasMore: true,
      },
    });
    get().fetchTalents();
  },

  /**
   * Mettre à jour la requête de recherche
   */
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  // ─────────────────────────────────────────────────────
  // ACTIONS - PAGINATION
  // ─────────────────────────────────────────────────────
  
  /**
   * Changer de page
   */
  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
    get().fetchTalents();
  },

  /**
   * Charger la page suivante (infinite scroll)
   */
  loadMore: async () => {
    const { pagination, loading } = get();
    
    if (loading || !pagination.hasMore) return;
    
    const nextPage = pagination.page + 1;
    set((state) => ({
      pagination: { ...state.pagination, page: nextPage },
      loading: true,
    }));

    try {
      const { filters } = get();
      const response = await talentAPI.getAll({
        ...filters,
        page: nextPage,
        limit: pagination.limit,
      });

      set((state) => ({
        talents: [...state.talents, ...response.data],
        pagination: {
          ...state.pagination,
          total: response.total,
          hasMore: response.data.length === pagination.limit,
        },
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
    }
  },

  // ─────────────────────────────────────────────────────
  // ACTIONS - FETCH
  // ─────────────────────────────────────────────────────
  
  /**
   * Récupérer les talents avec les filtres actuels
   */
  fetchTalents: async () => {
    const { filters, pagination, searchQuery } = get();
    
    set({ loading: true, error: null });

    try {
      // Si recherche textuelle, utiliser l'endpoint search
      const response = searchQuery
        ? await talentAPI.search(searchQuery, {
            ...filters,
            page: pagination.page,
            limit: pagination.limit,
          })
        : await talentAPI.getAll({
            ...filters,
            page: pagination.page,
            limit: pagination.limit,
          });

      set({
        talents: response.data || [],
        pagination: {
          ...pagination,
          total: response.total || 0,
          hasMore: (response.data || []).length === pagination.limit,
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Erreur fetch talents:', error);
      set({
        error: error.message || 'Erreur lors du chargement des talents',
        loading: false,
        talents: [], // Vider en cas d'erreur
      });
    }
  },

  /**
   * Rechercher des talents par texte
   */
  searchTalents: async (query) => {
    set({ 
      searchQuery: query,
      pagination: { ...get().pagination, page: 1 },
      loading: true,
      error: null,
    });

    try {
      const { filters, pagination } = get();
      const response = await talentAPI.search(query, {
        ...filters,
        page: 1,
        limit: pagination.limit,
      });
      
      set({
        talents: response.data || [],
        pagination: {
          ...pagination,
          total: response.total || 0,
          page: 1,
          hasMore: (response.data || []).length === pagination.limit,
        },
        loading: false,
      });
    } catch (error) {
      console.error('Erreur recherche:', error);
      set({
        error: error.message || 'Erreur lors de la recherche',
        loading: false,
        talents: [],
      });
    }
  },

  /**
   * Récupérer un talent spécifique par ID
   */
  fetchTalentById: async (id) => {
    set({ loading: true, error: null });

    try {
      const talent = await talentAPI.getById(id);
      return talent;
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // ─────────────────────────────────────────────────────
  // ACTIONS - RESET
  // ─────────────────────────────────────────────────────
  
  /**
   * Réinitialiser complètement le store
   */
  reset: () => {
    set({
      talents: [],
      loading: false,
      error: null,
      filters: {
        metier: '',
        ville: '',
        pays: '',
        disponible: '',
        hasVideo: undefined,
        hasDocument: undefined,
      },
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        hasMore: true,
      },
      searchQuery: '',
    });
  },

  // ─────────────────────────────────────────────────────
  // SÉLECTEURS (Helpers)
  // ─────────────────────────────────────────────────────
  
  /**
   * Vérifier si des filtres sont actifs
   */
  hasActiveFilters: () => {
    const { filters, searchQuery } = get();
    return !!(
      filters.metier ||
      filters.ville ||
      filters.pays ||
      filters.disponible ||
      filters.hasVideo !== undefined ||
      filters.hasDocument !== undefined ||
      searchQuery
    );
  },

  /**
   * Obtenir le nombre de filtres actifs
   */
  getActiveFiltersCount: () => {
    const { filters, searchQuery } = get();
    let count = 0;
    
    if (filters.metier) count++;
    if (filters.ville) count++;
    if (filters.pays) count++;
    if (filters.disponible) count++;
    if (filters.hasVideo !== undefined) count++;
    if (filters.hasDocument !== undefined) count++;
    if (searchQuery) count++;
    
    return count;
  },
}));

// ═══════════════════════════════════════════════════════
// HOOKS PERSONNALISÉS
// ═══════════════════════════════════════════════════════

/**
 * Hook pour accéder uniquement aux talents
 */
export const useTalents = () => useTalentStore((state) => state.talents);

/**
 * Hook pour accéder uniquement au loading
 */
export const useTalentsLoading = () => useTalentStore((state) => state.loading);

/**
 * Hook pour accéder uniquement à l'erreur
 */
export const useTalentsError = () => useTalentStore((state) => state.error);

/**
 * Hook pour accéder aux filtres
 */
export const useTalentsFilters = () => useTalentStore((state) => state.filters);

/**
 * Hook pour accéder à la pagination
 */
export const useTalentsPagination = () => useTalentStore((state) => state.pagination);

/**
 * Hook pour les actions de recherche
 */
export const useTalentsActions = () => useTalentStore((state) => ({
  fetchTalents: state.fetchTalents,
  searchTalents: state.searchTalents,
  setFilters: state.setFilters,
  resetFilters: state.resetFilters,
  setPage: state.setPage,
  loadMore: state.loadMore,
  setSearchQuery: state.setSearchQuery,
}));

export default useTalentStore;
