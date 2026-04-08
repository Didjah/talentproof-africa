// Système de sauvegarde locale des inscriptions
// Les données sont stockées dans localStorage en attendant le backend

export const saveInscription = (type, data) => {
  try {
    // Récupérer les inscriptions existantes
    const key = `tp_inscriptions_${type}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Ajouter la nouvelle inscription avec timestamp et ID
    const newInscription = {
      id: Date.now(),
      ...data,
      status: 'validated', // Validation automatique
      verified: true,
      created_at: new Date().toISOString(),
      validated_at: new Date().toISOString()
    };
    
    existing.push(newInscription);
    
    // Sauvegarder
    localStorage.setItem(key, JSON.stringify(existing));
    
    // Mettre à jour les stats globales
    updateStats(type);
    
    return { success: true, id: newInscription.id };
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
    return { success: false, error: error.message };
  }
};

export const getInscriptions = (type) => {
  try {
    const key = `tp_inscriptions_${type}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (error) {
    console.error('Erreur lecture:', error);
    return [];
  }
};

export const getAllInscriptions = (type) => {
  // Si un type est spécifié, retourner juste ce type
  if (type) {
    return getInscriptions(type);
  }
  // Sinon retourner tout
  return {
    talents: getInscriptions('talents'),
    recruteurs: getInscriptions('recruteurs'),
    partenaires: getInscriptions('partenaires')
  };
};

export const deleteInscription = (type, id) => {
  try {
    const key = `tp_inscriptions_${type}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = existing.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
    updateStats(type);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateInscription = (type, id, updates) => {
  try {
    const key = `tp_inscriptions_${type}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.map(item => 
      item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
    );
    localStorage.setItem(key, JSON.stringify(updated));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const updateStats = (type) => {
  try {
    const stats = JSON.parse(localStorage.getItem('tp_stats') || '{}');
    const inscriptions = getInscriptions(type);
    
    stats[type] = {
      total: inscriptions.length,
      nouveaux: inscriptions.filter(i => {
        const date = new Date(i.created_at);
        const now = new Date();
        const diff = now - date;
        return diff < 24 * 60 * 60 * 1000; // Dernières 24h
      }).length,
      enAttente: inscriptions.filter(i => i.status === 'pending').length,
      actifs: inscriptions.filter(i => i.status === 'validated' || i.status === 'active').length
    };
    
    localStorage.setItem('tp_stats', JSON.stringify(stats));
  } catch (error) {
    console.error('Erreur mise à jour stats:', error);
  }
};

export const getStats = () => {
  try {
    const stats = JSON.parse(localStorage.getItem('tp_stats') || '{}');
    return {
      talents: stats.talents || { total: 0, nouveaux: 0, enAttente: 0, actifs: 0 },
      recruteurs: stats.recruteurs || { total: 0, nouveaux: 0, enAttente: 0, actifs: 0 },
      partenaires: stats.partenaires || { total: 0, nouveaux: 0, enAttente: 0, actifs: 0 }
    };
  } catch (error) {
    return {
      talents: { total: 0, nouveaux: 0, enAttente: 0, actifs: 0 },
      recruteurs: { total: 0, nouveaux: 0, enAttente: 0, actifs: 0 },
      partenaires: { total: 0, nouveaux: 0, enAttente: 0, actifs: 0 }
    };
  }
};

// Export des données pour backup
export const exportData = () => {
  const data = {
    talents: getInscriptions('talents'),
    recruteurs: getInscriptions('recruteurs'),
    partenaires: getInscriptions('partenaires'),
    stats: getStats(),
    exported_at: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `talentproof_backup_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Gestion des tokens d'accès pour les talents
export const generateAccessToken = (talentId, telephone) => {
  const token = btoa(`${talentId}-${telephone}-${Date.now()}-${Math.random()}`);
  const tokens = JSON.parse(localStorage.getItem('tp_access_tokens') || '{}');
  tokens[token] = {
    talentId,
    telephone,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 an
  };
  localStorage.setItem('tp_access_tokens', JSON.stringify(tokens));
  return token;
};

export const validateAccessToken = (token, talentId) => {
  try {
    const tokens = JSON.parse(localStorage.getItem('tp_access_tokens') || '{}');
    const tokenData = tokens[token];
    if (!tokenData) return false;
    if (tokenData.talentId !== parseInt(talentId)) return false;
    if (new Date(tokenData.expiresAt) < new Date()) return false;
    return true;
  } catch {
    return false;
  }
};

export const getTalentByToken = (token, talentId) => {
  if (!validateAccessToken(token, talentId)) return null;
  const talents = getInscriptions('talents');
  return talents.find(t => t.id === parseInt(talentId));
};

// Gestion de l'équipe admin
export const saveTeamMember = (member) => {
  try {
    const team = JSON.parse(localStorage.getItem('tp_team') || '[]');
    const newMember = {
      id: Date.now(),
      ...member,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    team.push(newMember);
    localStorage.setItem('tp_team', JSON.stringify(team));
    return { success: true, id: newMember.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getTeamMembers = () => {
  try {
    return JSON.parse(localStorage.getItem('tp_team') || '[]');
  } catch {
    return [];
  }
};

export const deleteTeamMember = (id) => {
  try {
    const team = JSON.parse(localStorage.getItem('tp_team') || '[]');
    const filtered = team.filter(m => m.id !== id);
    localStorage.setItem('tp_team', JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateTeamMember = (id, updates) => {
  try {
    const team = JSON.parse(localStorage.getItem('tp_team') || '[]');
    const updated = team.map(m => 
      m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
    );
    localStorage.setItem('tp_team', JSON.stringify(updated));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const authenticateTeamMember = (email, password) => {
  try {
    const team = JSON.parse(localStorage.getItem('tp_team') || '[]');
    const member = team.find(m => m.email === email && m.password === password && m.status === 'active');
    return member || null;
  } catch {
    return null;
  }
};
