"use client";
import { useState, useEffect } from "react";
import { 
  Users, Briefcase, Handshake, TrendingUp, Plus, Check, X, 
  Eye, Edit, Trash2, Search, Filter, BarChart3, Settings,
  LogOut, Shield, Clock, AlertCircle, CheckCircle, UserPlus, Link as LinkIcon, Copy, UserCog, Menu
} from "lucide-react";
import {
  getAllInscriptions, getStats, deleteInscription, updateInscription, saveInscription,
  generateAccessToken, getTeamMembers, saveTeamMember, deleteTeamMember, updateTeamMember
} from "@/utils/storage";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const WA_NUM1 = "2250705503089";
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

// CSS pour le responsive mobile
const RESPONSIVE_CSS = `
@media (max-width: 768px) {
  .admin-sidebar {
    transform: translateX(-100%) !important;
  }
  .admin-sidebar.mobile-open {
    transform: translateX(0) !important;
  }
  .mobile-overlay {
    display: block !important;
  }
  .admin-content {
    margin-left: 0 !important;
    padding: 1rem !important;
  }
  .mobile-header {
    display: flex !important;
  }
  .admin-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .admin-table {
    min-width: 800px;
  }
  .stat-grid {
    grid-template-columns: 1fr !important;
  }
}
@media (min-width: 769px) {
  .mobile-header {
    display: none !important;
  }
  .mobile-overlay {
    display: none !important;
  }
}
@media (max-width: 768px) {
  .col-secondary {
    display: none !important;
  }
}
`;

function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{ __html: RESPONSIVE_CSS }} />;
}

function StatCard({ icon: Icon, label, value, subValue, color, bgGradient }) {
  return (
    <div style={{
      background: bgGradient || "white",
      borderRadius: "16px",
      padding: "1.3rem",
      boxShadow: "0 2px 8px rgba(0,0,0,.06)",
      border: "1px solid #E5E7EB",
      transition: "transform .2s, box-shadow .2s"
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.06)";
      }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".8rem" }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: "12px",
          background: color || "#1B6B47",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Icon size={24} color="white" strokeWidth={2.5} />
        </div>
        {subValue && (
          <span style={{
            background: `${color}18`,
            color: color,
            fontSize: ".7rem",
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: "99px"
          }}>
            {subValue}
          </span>
        )}
      </div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#111", marginBottom: ".2rem" }}>
        {value}
      </div>
      <div style={{ color: "#666", fontSize: ".82rem", fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, onLogout, mobileOpen, setMobileOpen }) {
  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
    { id: "talents", label: "Gestion Talents", icon: Users },
    { id: "recruteurs", label: "Recruteurs", icon: Briefcase },
    { id: "partenaires", label: "Partenaires", icon: Handshake },
    { id: "team", label: "Gestion du Personnel", icon: UserCog },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  const handleMenuClick = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="mobile-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            zIndex: 998,
            display: "none"
          }}
        />
      )}

      <div 
        className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: 260,
          background: "linear-gradient(180deg,#0B1628,#162F52)",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid rgba(240,192,64,.2)",
          boxShadow: "4px 0 24px rgba(0,0,0,.3)",
          zIndex: 999,
          transition: "transform .3s ease"
        }}>
        {/* Logo */}
        <div style={{ padding: "1.5rem 1.2rem", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "linear-gradient(135deg,#C9960F,#F0C040)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem"
            }}>
              🛡️
            </div>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", color: "#F0C040", fontWeight: 900, fontSize: "1.1rem" }}>
                TalentProof
              </div>
              <div style={{ color: "rgba(255,255,255,.5)", fontSize: ".7rem", fontWeight: 600 }}>
                ADMIN PANEL
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: "1rem .8rem", overflowY: "auto" }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: ".7rem",
                padding: ".75rem 1rem",
                borderRadius: "10px",
                border: "none",
                background: activeTab === item.id ? "rgba(240,192,64,.15)" : "transparent",
                color: activeTab === item.id ? "#F0C040" : "rgba(255,255,255,.6)",
                cursor: "pointer",
                fontSize: ".88rem",
                fontWeight: 600,
                marginBottom: ".4rem",
                transition: "all .2s",
                textAlign: "left"
              }}
              onMouseEnter={e => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = "rgba(255,255,255,.05)";
                  e.currentTarget.style.color = "rgba(255,255,255,.9)";
                }
              }}
              onMouseLeave={e => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,.6)";
                }
              }}>
              <item.icon size={18} strokeWidth={2.5} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,.1)" }}>
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: ".7rem",
              padding: ".75rem 1rem",
              borderRadius: "10px",
              border: "1px solid rgba(239,68,68,.3)",
              background: "rgba(239,68,68,.1)",
              color: "#FCA5A5",
              cursor: "pointer",
              fontSize: ".85rem",
              fontWeight: 700,
              transition: "all .2s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(239,68,68,.2)";
              e.currentTarget.style.color = "#EF4444";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(239,68,68,.1)";
              e.currentTarget.style.color = "#FCA5A5";
            }}>
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
}

function DashboardTab({ stats }) {
  const [realStats, setRealStats] = useState({ talents: 0, pending: 0, recruteurs: 0, partenaires: 0 });
  const [derniersTalents, setDerniersTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkModal, setLinkModal] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [{ count: totalTalents }, { count: pending }, { count: recruteurs }, { count: partenaires }, { data: derniers }] = await Promise.all([
        supabase.from('talents').select('*', { count: 'exact', head: true }),
        supabase.from('talents').select('*', { count: 'exact', head: true }).eq('statut', 'attente'),
        supabase.from('recruteurs').select('*', { count: 'exact', head: true }),
        supabase.from('partenaires').select('*', { count: 'exact', head: true }),
        supabase.from('talents').select('id, prenom, nom, metier, ville, statut, created_at').order('id', { ascending: false }).limit(5)
      ]);
      setRealStats({ talents: totalTalents || 0, pending: pending || 0, recruteurs: recruteurs || 0, partenaires: partenaires || 0 });
      setDerniersTalents(derniers || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function validerTalent(id) {
    await supabase.from('talents').update({ statut: 'actif' }).eq('id', id);
    fetchDashboardData();
  }

  async function supprimerTalent(id) {
    if (!confirm('Supprimer ce talent ?')) return;
    await supabase.from('talents').delete().eq('id', id);
    fetchDashboardData();
  }

  function envoyerLien(talent) {
    const token = btoa(`${talent.id}-${Date.now()}`);
    const lien = `${window.location.origin}/mon-profil?token=${token}&id=${talent.id}`;
    setLinkModal({ nom: `${talent.prenom} ${talent.nom}`, lien });
  }

  return (
    <div>
      {realStats.pending > 0 && (
        <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#dc2626', fontWeight: 600 }}>
          ⚠️ {realStats.pending} talent(s) en attente de validation
        </div>
      )}

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Talents', value: realStats.talents, color: '#10b981', icon: '👥' },
          { label: 'En attente', value: realStats.pending, color: '#f59e0b', icon: '⏳' },
          { label: 'Recruteurs', value: realStats.recruteurs, color: '#3b82f6', icon: '🏢' },
          { label: 'Partenaires', value: realStats.partenaires, color: '#8b5cf6', icon: '🤝' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '20px 16px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{loading ? '...' : s.value}</div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Derniers talents */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>🕐 Derniers inscrits</h3>
        {loading ? <p style={{ color: '#9ca3af' }}>Chargement...</p> : derniersTalents.length === 0 ? <p style={{ color: '#9ca3af' }}>Aucun talent</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                {['Nom', 'Métier', 'Ville', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {derniersTalents.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{t.prenom} {t.nom}</td>
                  <td style={{ padding: '10px 12px', color: '#6b7280' }}>{t.metier}</td>
                  <td style={{ padding: '10px 12px', color: '#6b7280' }}>{t.ville}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ background: t.statut === 'actif' ? '#d1fae5' : '#fee2e2', color: t.statut === 'actif' ? '#059669' : '#dc2626', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {t.statut === 'actif' ? 'Actif' : 'Attente'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {t.statut !== 'actif' && (
                        <button onClick={() => validerTalent(t.id)} title="Valider" style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 13 }}>✅</button>
                      )}
                      <button onClick={() => envoyerLien(t)} title="Envoyer lien" style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 13 }}>🔗</button>
                      <button onClick={() => supprimerTalent(t.id)} title="Supprimer" style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal lien */}
      {linkModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 480, width: '90%' }}>
            <h3 style={{ margin: '0 0 8px' }}>🔗 Lien d&apos;accès au profil</h3>
            <p style={{ color: '#6b7280', margin: '0 0 16px' }}>Envoyez ce lien à <strong>{linkModal.nom}</strong> sur WhatsApp.</p>
            <div style={{ background: '#f3f4f6', borderRadius: 8, padding: 12, fontSize: 13, wordBreak: 'break-all', marginBottom: 16 }}>{linkModal.lien}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { navigator.clipboard.writeText(linkModal.lien); }} style={{ flex: 1, background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', cursor: 'pointer', fontWeight: 600 }}>📋 Copier</button>
              <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(linkModal.lien)}`)} style={{ flex: 1, background: '#25d366', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', cursor: 'pointer', fontWeight: 600 }}>WhatsApp</button>
              <button onClick={() => setLinkModal(null)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TalentsTab({ talents, onRefresh }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newTalent, setNewTalent] = useState({
    prenom: "", nom: "", metier: "", ville: "", pays: "Côte d'Ivoire",
    telephone: "", email: "", bio: "", experience: "Débutant (moins de 1 an)",
    disponibilite: "immediate", competences: ""
  });

  const filtered = talents.filter(t => {
    if (!t.prenom && !t.nom) return false;
    if (statusFilter !== "tous" && t.statut !== statusFilter) return false;
    if (search && !`${t.prenom} ${t.nom} ${t.metier} ${t.ville}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAddTalent = async () => {
    if (!newTalent.prenom || !newTalent.nom || !newTalent.metier || !newTalent.telephone) {
      alert("Veuillez remplir les champs obligatoires (prénom, nom, métier, téléphone)");
      return;
    }
    setAdding(true);
    const { data, error } = await supabase.from('talents').insert([{
      prenom: newTalent.prenom,
      nom: newTalent.nom,
      metier: newTalent.metier,
      ville: newTalent.ville || null,
      pays: newTalent.pays || null,
      telephone: newTalent.telephone,
      bio: newTalent.bio || null,
      experience: newTalent.experience || null,
      disponibilite: newTalent.disponibilite,
      verified: false,
      statut: 'actif',
    }]).select().single();
    setAdding(false);
    if (error) { alert("Erreur Supabase : " + error.message); return; }
    const link = `${window.location.origin}/finaliser-profil?id=${data.id}`;
    setShowAddModal(false);
    setGeneratedResult({ nom: `${newTalent.prenom} ${newTalent.nom}`, telephone: newTalent.telephone, url: link, id: data.id });
    setNewTalent({ prenom: "", nom: "", metier: "", ville: "", pays: "Côte d'Ivoire", telephone: "", email: "", bio: "", experience: "Débutant (moins de 1 an)", disponibilite: "immediate", competences: "" });
    onRefresh();
  };

  const handleValidate = (id) => {
    const result = updateInscription('talents', id, { status: "active" });
    if (result.success) {
      onRefresh();
      alert("✅ Profil validé !");
    }
  };

  const handleDelete = (id, nom) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le profil de ${nom} ?`)) {
      const result = deleteInscription('talents', id);
      if (result.success) {
        onRefresh();
        alert("✅ Profil supprimé");
      }
    }
  };

  const generateAccessLink = (talent) => {
    return `${window.location.origin}/finaliser-profil?tel=${talent.telephone}`;
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("✅ Lien copié ! Envoyez-le au talent sur WhatsApp.");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: 900, color: "#111", margin: 0 }}>
          👥 Gestion des Talents ({talents.length})
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".5rem",
            background: "linear-gradient(135deg,#1B6B47,#2D9A68)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: ".7rem 1.3rem",
            fontSize: ".85rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 12px rgba(27,107,71,.3)"
          }}>
          <Plus size={18} />
          <span style={{ display: "inline" }}>Ajouter</span>
        </button>
      </div>

      {/* Filtres */}
      <div style={{ background: "white", borderRadius: "14px", padding: "1rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,.06)", border: "1px solid #E5E7EB" }}>
        <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", position: "relative" }}>
            <Search size={18} color="#9CA3AF" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              style={{
                width: "100%",
                padding: ".6rem .8rem .6rem 2.8rem",
                borderRadius: "8px",
                border: "1.5px solid #E5E7EB",
                fontSize: ".85rem",
                outline: "none"
              }}
            />
          </div>
          <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
            {[
              ["tous", "Tous"],
              ["pending", "Attente"],
              ["active", "Actifs"]
            ].map(([val, lab]) => (
              <button
                key={val}
                onClick={() => setStatusFilter(val)}
                style={{
                  padding: ".6rem .8rem",
                  borderRadius: "8px",
                  border: `1.5px solid ${statusFilter === val ? "#1B6B47" : "#E5E7EB"}`,
                  background: statusFilter === val ? "#1B6B47" : "white",
                  color: statusFilter === val ? "white" : "#666",
                  fontSize: ".8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}>
                {lab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des talents - Tableau responsive */}
      <div className="admin-table-wrapper" style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", border: "1px solid #E5E7EB", overflow: "auto" }}>
        <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "180px" }}>Talent</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "140px" }}>Métier</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "120px" }}>Ville</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "100px" }}>Statut</th>
              <th className="col-secondary" style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "100px" }}>Date</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "center", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "140px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>
                  Aucun talent trouvé
                </td>
              </tr>
            ) : filtered.map(talent => (
              <tr key={talent.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                <td style={{ padding: ".9rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#E5E7EB,#CBD5E1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      flexShrink: 0
                    }}>
                      👤
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: ".85rem", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {talent.prenom} {talent.nom}
                      </div>
                      {talent.createdBy === "admin" && (
                        <span style={{ fontSize: ".7rem", color: "#7C3AED" }}>✨ Manuel</span>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ padding: ".9rem 1rem", fontSize: ".85rem", color: "#666" }}>
                  {talent.metier === "Autre métier" ? talent.autreMetier : talent.metier}
                </td>
                <td style={{ padding: ".9rem 1rem", fontSize: ".85rem", color: "#666" }}>{talent.ville}</td>
                <td style={{ padding: ".9rem 1rem" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: "99px",
                    fontSize: ".72rem",
                    fontWeight: 700,
                    background: talent.status === "active" ? "#DCFCE7" : "#FEF2F2",
                    color: talent.status === "active" ? "#166534" : "#991B1B",
                    whiteSpace: "nowrap"
                  }}>
                    {talent.status === "active" ? "Actif" : "Attente"}
                  </span>
                </td>
                <td className="col-secondary" style={{ padding: ".9rem 1rem", fontSize: ".8rem", color: "#9CA3AF", whiteSpace: "nowrap" }}>
                  {formatDate(talent.createdAt)}
                </td>
                <td style={{ padding: ".9rem 1rem" }}>
                  <div style={{ display: "flex", gap: ".4rem", justifyContent: "center", flexWrap: "wrap" }}>
                    {talent.statut !== 'actif' && (
                      <button
                        onClick={async () => {
                          await supabase.from('talents').update({ statut: 'actif' }).eq('id', talent.id);
                          onRefresh();
                        }}
                        title="Valider"
                        style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: 13, marginRight: 6 }}
                      >✅</button>
                    )}
                    <button
                      onClick={() => setShowLinkModal(talent)}
                      title="Lien"
                      style={{
                        padding: ".4rem",
                        borderRadius: "6px",
                        border: "none",
                        background: "#FEF9EE",
                        color: "#C9960F",
                        cursor: "pointer"
                      }}>
                      <LinkIcon size={16} />
                    </button>
                    {talent.status === "pending" && (
                      <button 
                        onClick={() => handleValidate(talent.id)}
                        title="Valider"
                        style={{
                          padding: ".4rem",
                          borderRadius: "6px",
                          border: "none",
                          background: "#DCFCE7",
                          color: "#166534",
                          cursor: "pointer"
                        }}>
                        <Check size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(talent.id, `${talent.prenom} ${talent.nom}`)}
                      title="Supprimer"
                      style={{
                        padding: ".4rem",
                        borderRadius: "6px",
                        border: "none",
                        background: "#FEF2F2",
                        color: "#DC2626",
                        cursor: "pointer"
                      }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajouter talent */}
      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "white",
            borderRadius: "20px",
            padding: "2rem",
            maxWidth: 600,
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,.3)"
          }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#111", marginBottom: "1.5rem" }}>
              ➕ Ajouter un talent
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: ".8rem" }}>
                <input 
                  placeholder="Prénom *" 
                  value={newTalent.prenom}
                  onChange={e => setNewTalent({...newTalent, prenom: e.target.value})}
                  style={{
                    padding: ".7rem .9rem",
                    borderRadius: "8px",
                    border: "1.5px solid #E5E7EB",
                    fontSize: ".9rem",
                    outline: "none"
                  }} 
                />
                <input 
                  placeholder="Nom *" 
                  value={newTalent.nom}
                  onChange={e => setNewTalent({...newTalent, nom: e.target.value})}
                  style={{
                    padding: ".7rem .9rem",
                    borderRadius: "8px",
                    border: "1.5px solid #E5E7EB",
                    fontSize: ".9rem",
                    outline: "none"
                  }} 
                />
              </div>
              <input 
                placeholder="Métier *" 
                value={newTalent.metier}
                onChange={e => setNewTalent({...newTalent, metier: e.target.value})}
                style={{
                  padding: ".7rem .9rem",
                  borderRadius: "8px",
                  border: "1.5px solid #E5E7EB",
                  fontSize: ".9rem",
                  outline: "none"
                }} 
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: ".8rem" }}>
                <input 
                  placeholder="Ville" 
                  value={newTalent.ville}
                  onChange={e => setNewTalent({...newTalent, ville: e.target.value})}
                  style={{
                    padding: ".7rem .9rem",
                    borderRadius: "8px",
                    border: "1.5px solid #E5E7EB",
                    fontSize: ".9rem",
                    outline: "none"
                  }} 
                />
                <input 
                  placeholder="Pays" 
                  value={newTalent.pays}
                  onChange={e => setNewTalent({...newTalent, pays: e.target.value})}
                  style={{
                    padding: ".7rem .9rem",
                    borderRadius: "8px",
                    border: "1.5px solid #E5E7EB",
                    fontSize: ".9rem",
                    outline: "none"
                  }} 
                />
              </div>
              <input 
                placeholder="Téléphone/WhatsApp *" 
                value={newTalent.telephone}
                onChange={e => setNewTalent({...newTalent, telephone: e.target.value})}
                style={{
                  padding: ".7rem .9rem",
                  borderRadius: "8px",
                  border: "1.5px solid #E5E7EB",
                  fontSize: ".9rem",
                  outline: "none"
                }} 
              />
              <input 
                placeholder="Email (optionnel)" 
                value={newTalent.email}
                onChange={e => setNewTalent({...newTalent, email: e.target.value})}
                style={{
                  padding: ".7rem .9rem",
                  borderRadius: "8px",
                  border: "1.5px solid #E5E7EB",
                  fontSize: ".9rem",
                  outline: "none"
                }} 
              />
              <textarea 
                placeholder="Bio / Présentation" 
                value={newTalent.bio}
                onChange={e => setNewTalent({...newTalent, bio: e.target.value})}
                rows={3}
                style={{
                  padding: ".7rem .9rem",
                  borderRadius: "8px",
                  border: "1.5px solid #E5E7EB",
                  fontSize: ".9rem",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit"
                }} 
              />
              <div style={{ display: "flex", gap: ".6rem", marginTop: ".5rem", flexWrap: "wrap" }}>
                <button onClick={() => setShowAddModal(false)} style={{
                  flex: "1 1 120px",
                  padding: ".7rem",
                  borderRadius: "10px",
                  border: "1.5px solid #E5E7EB",
                  background: "white",
                  color: "#666",
                  fontWeight: 700,
                  fontSize: ".85rem",
                  cursor: "pointer"
                }}>
                  Annuler
                </button>
                <button onClick={handleAddTalent} disabled={adding} style={{
                  flex: "2 1 180px",
                  padding: ".7rem",
                  borderRadius: "10px",
                  border: "none",
                  background: adding ? "#9CA3AF" : "linear-gradient(135deg,#1B6B47,#2D9A68)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: ".85rem",
                  cursor: adding ? "wait" : "pointer"
                }}>
                  {adding ? "Enregistrement…" : "Ajouter le talent"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal résultat création talent → lien finaliser-profil */}
      {generatedResult && (
        <div onClick={() => setGeneratedResult(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"1rem" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"white",borderRadius:"20px",padding:"2rem",maxWidth:500,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.3)" }}>
            <div style={{ textAlign:"center",marginBottom:"1.2rem" }}>
              <div style={{ fontSize:"2.5rem",marginBottom:".4rem" }}>✅</div>
              <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.1rem",color:"#111" }}>
                {generatedResult.nom} ajouté !
              </div>
              <div style={{ color:"#666",fontSize:".82rem",marginTop:".3rem" }}>
                Envoyez ce lien au talent pour qu'il finalise son profil (photo, vidéo, PIN).
              </div>
            </div>
            <div style={{ background:"#F0FDF4",border:"1.5px solid #86EFAC",borderRadius:"12px",padding:"1rem",marginBottom:"1rem" }}>
              <div style={{ fontSize:".72rem",color:"#16A34A",fontWeight:700,marginBottom:".4rem" }}>LIEN DE FINALISATION</div>
              <div style={{ fontSize:".8rem",color:"#111",wordBreak:"break-all",lineHeight:1.5 }}>{generatedResult.url}</div>
            </div>
            <div style={{ display:"flex",gap:".6rem",flexWrap:"wrap" }}>
              <button onClick={() => { navigator.clipboard.writeText(generatedResult.url); alert("✅ Lien copié !"); }}
                style={{ flex:"1 1 120px",display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",padding:".7rem",borderRadius:"10px",border:"none",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",fontWeight:800,fontSize:".85rem",cursor:"pointer" }}>
                <Copy size={16}/> Copier
              </button>
              {generatedResult.telephone && (
                <a href={`https://wa.me/${generatedResult.telephone.replace(/\D/g,'')}?text=${encodeURIComponent(`Bonjour ${generatedResult.nom.split(' ')[0]}, voici le lien pour finaliser ton profil TalentProof : ${generatedResult.url}`)}`}
                  target="_blank" rel="noreferrer"
                  style={{ flex:"1 1 120px",display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",padding:".7rem",borderRadius:"10px",background:"#25D366",color:"white",fontWeight:700,fontSize:".85rem",textDecoration:"none" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.527 5.852L.057 23.5l5.797-1.497A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.162-1.416l-.37-.218-3.441.889.917-3.346-.24-.387A9.944 9.944 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Lien d'accès */}
      {showLinkModal && (
        <div onClick={() => setShowLinkModal(null)} style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "white",
            borderRadius: "20px",
            padding: "2rem",
            maxWidth: 500,
            width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,.3)"
          }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#111", marginBottom: "1rem" }}>
              🔗 Lien d'accès au profil
            </h2>
            <p style={{ color: "#666", fontSize: ".85rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              Envoyez ce lien à <strong>{showLinkModal.prenom} {showLinkModal.nom}</strong> sur WhatsApp.
            </p>
            
            <div style={{ background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: "12px", padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: ".75rem", color: "#9CA3AF", marginBottom: ".4rem", fontWeight: 600 }}>LIEN D'ACCÈS</div>
              <div style={{ fontSize: ".8rem", color: "#111", wordBreak: "break-all", lineHeight: 1.5 }}>
                {generateAccessLink(showLinkModal)}
              </div>
            </div>

            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
              <button 
                onClick={() => copyLink(generateAccessLink(showLinkModal))}
                style={{
                  flex: "1 1 120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".4rem",
                  padding: ".7rem",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg,#C9960F,#F0C040)",
                  color: "#0D3B2E",
                  fontWeight: 800,
                  fontSize: ".85rem",
                  cursor: "pointer"
                }}>
                <Copy size={16} />
                Copier
              </button>
              <a 
                href={`https://wa.me/${showLinkModal.telephone}?text=${encodeURIComponent(`Bonjour ${showLinkModal.prenom}, voici le lien pour accéder à ton profil TalentProof : ${generateAccessLink(showLinkModal)}`)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: "1 1 120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".4rem",
                  padding: ".7rem",
                  borderRadius: "10px",
                  border: "none",
                  background: "#25D366",
                  color: "white",
                  fontWeight: 700,
                  fontSize: ".85rem",
                  textDecoration: "none"
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RecruteursTab({ recruteurs, onRefresh }) {
  const handleValidate = (id) => {
    const result = updateInscription('recruteurs', id, { status: "active" });
    if (result.success) {
      onRefresh();
      alert("✅ Recruteur validé !");
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: 900, color: "#111", marginBottom: "1.5rem" }}>
        🏢 Recruteurs ({recruteurs.length})
      </h1>

      <div className="admin-table-wrapper" style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", border: "1px solid #E5E7EB", overflow: "auto" }}>
        <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "150px" }}>Entreprise</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "130px" }}>Contact</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "180px" }}>Email</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "100px" }}>Statut</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "center", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "100px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recruteurs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>
                  Aucun recruteur inscrit
                </td>
              </tr>
            ) : recruteurs.map(rec => (
              <tr key={rec.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                <td style={{ padding: ".9rem 1rem", fontWeight: 700, fontSize: ".85rem", color: "#111" }}>
                  {rec.entreprise || rec.nomEntreprise}
                </td>
                <td style={{ padding: ".9rem 1rem", fontSize: ".85rem", color: "#666" }}>
                  {rec.nomResponsable}
                </td>
                <td style={{ padding: ".9rem 1rem", fontSize: ".8rem", color: "#666" }}>{rec.email}</td>
                <td style={{ padding: ".9rem 1rem" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: "99px",
                    fontSize: ".72rem",
                    fontWeight: 700,
                    background: rec.status === "active" ? "#DCFCE7" : "#FEF2F2",
                    color: rec.status === "active" ? "#166534" : "#991B1B",
                    whiteSpace: "nowrap"
                  }}>
                    {rec.status === "active" ? "Actif" : "Attente"}
                  </span>
                </td>
                <td style={{ padding: ".9rem 1rem" }}>
                  <div style={{ display: "flex", gap: ".4rem", justifyContent: "center" }}>
                    {rec.status === "pending" && (
                      <button 
                        onClick={() => handleValidate(rec.id)}
                        style={{ padding: ".4rem", borderRadius: "6px", border: "none", background: "#DCFCE7", color: "#166534", cursor: "pointer" }}>
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PartenairesTab({ partenaires, onRefresh }) {
  const handleValidate = (id) => {
    const result = updateInscription('partenaires', id, { status: "active" });
    if (result.success) {
      onRefresh();
      alert("✅ Partenaire validé !");
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: 900, color: "#111", marginBottom: "1.5rem" }}>
        🤝 Partenaires ({partenaires.length})
      </h1>

      <div className="admin-table-wrapper" style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", border: "1px solid #E5E7EB", overflow: "auto" }}>
        <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "150px" }}>Organisation</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "120px" }}>Type</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "130px" }}>Contact</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "100px" }}>Statut</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "center", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "100px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partenaires.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>
                  Aucun partenaire inscrit
                </td>
              </tr>
            ) : partenaires.map(part => (
              <tr key={part.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                <td style={{ padding: ".9rem 1rem", fontWeight: 700, fontSize: ".85rem", color: "#111" }}>
                  {part.organisation || part.nomOrganisation}
                </td>
                <td style={{ padding: ".9rem 1rem", fontSize: ".85rem", color: "#666" }}>
                  {part.typePartenariat === "formation" ? "🎓 Formation" : 
                   part.typePartenariat === "entreprise" ? "💼 Entreprise" :
                   part.typePartenariat === "apporteur" ? "🤝 Apporteur" : "🌍 ONG"}
                </td>
                <td style={{ padding: ".9rem 1rem", fontSize: ".85rem", color: "#666" }}>{part.nomContact}</td>
                <td style={{ padding: ".9rem 1rem" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: "99px",
                    fontSize: ".72rem",
                    fontWeight: 700,
                    background: part.status === "active" ? "#DCFCE7" : "#FEF2F2",
                    color: part.status === "active" ? "#166534" : "#991B1B",
                    whiteSpace: "nowrap"
                  }}>
                    {part.status === "active" ? "Actif" : "Attente"}
                  </span>
                </td>
                <td style={{ padding: ".9rem 1rem" }}>
                  <div style={{ display: "flex", gap: ".4rem", justifyContent: "center" }}>
                    {part.status === "pending" && (
                      <button 
                        onClick={() => handleValidate(part.id)}
                        style={{ padding: ".4rem", borderRadius: "6px", border: "none", background: "#DCFCE7", color: "#166534", cursor: "pointer" }}>
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ROLE_LABELS = { moderateur:"🛡️ Modérateur", support:"🎧 Support", editeur:"✏️ Éditeur" };

function TeamTab({ onRefresh }) {
  const [team, setTeam] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newMember, setNewMember] = useState({ nom: "", email: "", role: "moderateur", pin: "" });

  useEffect(() => { loadTeam(); }, []);

  const loadTeam = async () => {
    const { data } = await supabase.from("personnel_tp").select("*").order("created_at", { ascending: false });
    setTeam(data || []);
  };

  const handleAddMember = async () => {
    if (!newMember.nom || !newMember.email || !newMember.pin) {
      alert("Veuillez remplir tous les champs obligatoires (nom, email, PIN)");
      return;
    }
    if (newMember.pin.length < 4) {
      alert("Le PIN doit contenir au moins 4 caractères");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("personnel_tp").insert([{
      nom: newMember.nom,
      email: newMember.email,
      role: newMember.role,
      pin: newMember.pin,
      status: "active",
    }]);
    setSaving(false);
    if (error) { alert("Erreur : " + error.message); return; }
    setShowAddModal(false);
    setNewMember({ nom: "", email: "", role: "moderateur", pin: "" });
    loadTeam();
    alert("✅ Membre ajouté avec succès !");
  };

  const handleDelete = async (id, nom) => {
    if (!confirm(`Supprimer ${nom} de l'équipe ?`)) return;
    await supabase.from("personnel_tp").delete().eq("id", id);
    loadTeam();
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await supabase.from("personnel_tp").update({ status: newStatus }).eq("id", id);
    loadTeam();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: 900, color: "#111", margin: 0 }}>
          👥 Personnel ({team.length})
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".5rem",
            background: "linear-gradient(135deg,#7C3AED,#9333EA)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: ".7rem 1.3rem",
            fontSize: ".85rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 12px rgba(124,58,237,.3)"
          }}>
          <UserPlus size={18} />
          <span>Ajouter</span>
        </button>
      </div>

      {/* Info box */}
      <div style={{ background: "#EEF2FF", border: "1.5px solid #C7D2FE", borderRadius: "14px", padding: "1.2rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".5rem", flexWrap: "wrap" }}>
          <Shield size={18} color="#4F46E5" />
          <span style={{ fontWeight: 800, color: "#4338CA", fontSize: ".9rem" }}>
            Gestion des accès modérateurs
          </span>
        </div>
        <p style={{ color: "#6366F1", fontSize: ".8rem", lineHeight: 1.6, margin: 0 }}>
          Les modérateurs peuvent valider les profils et gérer les inscriptions.
        </p>
      </div>

      {/* Liste de l'équipe */}
      <div className="admin-table-wrapper" style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", border: "1px solid #E5E7EB", overflow: "auto" }}>
        <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "150px" }}>Membre</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "180px" }}>Email</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "120px" }}>Rôle</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "100px" }}>Statut</th>
              <th className="col-secondary" style={{ padding: ".9rem 1rem", textAlign: "left", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "100px" }}>Date</th>
              <th style={{ padding: ".9rem 1rem", textAlign: "center", fontSize: ".75rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: ".5px", minWidth: "80px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>
                  Aucun membre. Ajoutez votre premier collaborateur !
                </td>
              </tr>
            ) : team.map(member => (
              <tr key={member.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                <td style={{ padding: ".9rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#7C3AED,#9333EA)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: ".9rem",
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {(member.nom||"?")[0].toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: ".85rem", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {member.nom}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: ".9rem 1rem", fontSize: ".85rem", color: "#666" }}>{member.email}</td>
                <td style={{ padding: ".9rem 1rem" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: "99px",
                    fontSize: ".72rem",
                    fontWeight: 700,
                    background: "#EEF2FF",
                    color: "#4F46E5",
                    whiteSpace: "nowrap"
                  }}>
                    {ROLE_LABELS[member.role] || member.role}
                  </span>
                </td>
                <td style={{ padding: ".9rem 1rem" }}>
                  <button
                    onClick={() => toggleStatus(member.id, member.status)}
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: "99px",
                      fontSize: ".72rem",
                      fontWeight: 700,
                      background: member.status === "active" ? "#DCFCE7" : "#FEF2F2",
                      color: member.status === "active" ? "#166534" : "#991B1B",
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap"
                    }}>
                    {member.status === "active" ? "✓ Actif" : "✕ Inactif"}
                  </button>
                </td>
                <td className="col-secondary" style={{ padding: ".9rem 1rem", fontSize: ".8rem", color: "#9CA3AF", whiteSpace: "nowrap" }}>
                  {formatDate(member.created_at || member.createdAt)}
                </td>
                <td style={{ padding: ".9rem 1rem" }}>
                  <div style={{ display: "flex", gap: ".4rem", justifyContent: "center" }}>
                    <button 
                      onClick={() => handleDelete(member.id, member.nom)}
                      title="Supprimer"
                      style={{
                        padding: ".4rem",
                        borderRadius: "6px",
                        border: "none",
                        background: "#FEF2F2",
                        color: "#DC2626",
                        cursor: "pointer"
                      }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajouter membre */}
      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "white",
            borderRadius: "20px",
            padding: "2rem",
            maxWidth: 500,
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,.3)"
          }}>
            <h2 style={{ fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#111",marginBottom:"1.5rem" }}>
              ➕ Ajouter un collaborateur
            </h2>
            <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
              <input
                placeholder="Nom complet *"
                value={newMember.nom}
                onChange={e => setNewMember({...newMember, nom: e.target.value})}
                style={{ padding:".7rem .9rem",borderRadius:"8px",border:"1.5px solid #E5E7EB",fontSize:".9rem",outline:"none" }}
              />
              <input
                type="email"
                placeholder="Email *"
                value={newMember.email}
                onChange={e => setNewMember({...newMember, email: e.target.value})}
                style={{ padding:".7rem .9rem",borderRadius:"8px",border:"1.5px solid #E5E7EB",fontSize:".9rem",outline:"none" }}
              />
              <div>
                <label style={{ display:"block",fontSize:".8rem",fontWeight:700,color:"#444",marginBottom:".5rem" }}>Rôle</label>
                <select
                  value={newMember.role}
                  onChange={e => setNewMember({...newMember, role: e.target.value})}
                  style={{ width:"100%",padding:".7rem .9rem",borderRadius:"8px",border:"1.5px solid #E5E7EB",fontSize:".9rem",outline:"none",cursor:"pointer" }}>
                  <option value="moderateur">🛡️ Modérateur</option>
                  <option value="support">🎧 Support</option>
                  <option value="editeur">✏️ Éditeur</option>
                </select>
              </div>
              <div>
                <label style={{ display:"block",fontSize:".8rem",fontWeight:700,color:"#444",marginBottom:".5rem" }}>PIN d'accès *</label>
                <input
                  type="password"
                  placeholder="Min. 4 caractères"
                  value={newMember.pin}
                  onChange={e => setNewMember({...newMember, pin: e.target.value})}
                  style={{ width:"100%",padding:".7rem .9rem",borderRadius:"8px",border:"1.5px solid #E5E7EB",fontSize:".9rem",outline:"none" }}
                />
                <div style={{ color:"#9CA3AF",fontSize:".74rem",marginTop:".3rem" }}>Le personnel se connectera avec ce PIN via /admin-tp</div>
              </div>
              <div style={{ display:"flex",gap:".6rem",marginTop:".5rem",flexWrap:"wrap" }}>
                <button onClick={() => setShowAddModal(false)} style={{ flex:"1 1 120px",padding:".7rem",borderRadius:"10px",border:"1.5px solid #E5E7EB",background:"white",color:"#666",fontWeight:700,fontSize:".85rem",cursor:"pointer" }}>
                  Annuler
                </button>
                <button onClick={handleAddMember} disabled={saving} style={{ flex:"2 1 180px",padding:".7rem",borderRadius:"10px",border:"none",background:saving?"#9CA3AF":"linear-gradient(135deg,#7C3AED,#9333EA)",color:"white",fontWeight:800,fontSize:".85rem",cursor:saving?"wait":"pointer" }}>
                  {saving ? "Enregistrement…" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  return (
    <div>
      <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.3rem, 4vw, 1.8rem)", fontWeight: 900, color: "#111", marginBottom: "1.5rem" }}>
        ⚙️ Paramètres
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,.06)", border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#111", marginBottom: "1rem" }}>
            🔐 Sécurité
          </h2>
          <button style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".5rem",
            background: "#FEF2F2",
            color: "#DC2626",
            border: "1.5px solid #FCA5A5",
            borderRadius: "10px",
            padding: ".7rem 1.2rem",
            fontSize: ".85rem",
            fontWeight: 700,
            cursor: "pointer"
          }}>
            <Shield size={16} />
            Changer mot de passe
          </button>
        </div>

        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,.06)", border: "1px solid #E5E7EB" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#111", marginBottom: "1rem" }}>
            💾 Données
          </h2>
          <button 
            onClick={() => {
              const data = {
                talents: getAllInscriptions('talents'),
                recruteurs: getAllInscriptions('recruteurs'),
                partenaires: getAllInscriptions('partenaires'),
                exportedAt: new Date().toISOString()
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `talentproof-export-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: ".5rem",
              background: "#F0FDF4",
              color: "#166534",
              border: "1.5px solid #86EFAC",
              borderRadius: "10px",
              padding: ".7rem 1.2rem",
              fontSize: ".85rem",
              fontWeight: 700,
              cursor: "pointer"
            }}>
            📥 Exporter données
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [talents, setTalents] = useState([]);
  const [recruteurs, setRecruteurs] = useState([]);
  const [partenaires, setPartenaires] = useState([]);
  const [stats, setStats] = useState({ talents: {}, recruteurs: {}, partenaires: {} });

  const loadData = async () => {
    const [
      { data: talentsData },
      { data: recruteursData },
      { data: partenairesData }
    ] = await Promise.all([
      supabase.from('talents').select('*').order('created_at', { ascending: false }),
      supabase.from('recruteurs').select('*').order('created_at', { ascending: false }),
      supabase.from('partenaires').select('*').order('created_at', { ascending: false })
    ]);
    setTalents(talentsData || []);
    setRecruteurs(recruteursData || []);
    setPartenaires(partenairesData || []);
    setStats({
      talents:    { total: talentsData?.length || 0,    pending: talentsData?.filter(t => t.statut === 'attente').length || 0 },
      recruteurs: { total: recruteursData?.length || 0, pending: 0 },
      partenaires:{ total: partenairesData?.length || 0,pending: 0 },
    });
  };

  const MAX_ATTEMPTS = 3;
  const BLOCK_DURATION = 5 * 60 * 1000;

  const handleLogin = async (e) => {
    e.preventDefault();

    const blockData = JSON.parse(sessionStorage.getItem("tp_admin_block") || "{}");
    if (blockData.blockedUntil && Date.now() < blockData.blockedUntil) {
      const minutesLeft = Math.ceil((blockData.blockedUntil - Date.now()) / 60000);
      setError(`Trop de tentatives. Réessayez dans ${minutesLeft} minute(s).`);
      return;
    }

    if (password === ADMIN_PASSWORD) {
      sessionStorage.removeItem("tp_admin_block");
      setIsAuthenticated(true);
      setError("");
      sessionStorage.setItem("tp_admin_auth", "true");
      loadData();
    } else {
      const attempts = (blockData.attempts || 0) + 1;
      if (attempts >= MAX_ATTEMPTS) {
        sessionStorage.setItem("tp_admin_block", JSON.stringify({ attempts, blockedUntil: Date.now() + BLOCK_DURATION }));
        setError("3 tentatives échouées. Accès bloqué 5 minutes.");
      } else {
        sessionStorage.setItem("tp_admin_block", JSON.stringify({ attempts }));
        setError(`Mot de passe incorrect. ${MAX_ATTEMPTS - attempts} tentative(s) restante(s).`);
      }

      // Vérifier le PIN du personnel dans Supabase
      const { data: personnel } = await supabase
        .from("personnel_tp")
        .select("*")
        .eq("pin", password)
        .eq("status", "active")
        .maybeSingle();
      if (personnel) {
        sessionStorage.removeItem("tp_admin_block");
        setIsAuthenticated(true);
        setError("");
        sessionStorage.setItem("tp_admin_auth", "true");
        sessionStorage.setItem("tp_admin_role", personnel.role);
        sessionStorage.setItem("tp_admin_name", personnel.nom);
        loadData();
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setMobileOpen(false);
    sessionStorage.removeItem("tp_admin_auth");
  };

  useEffect(() => {
    if (sessionStorage.getItem("tp_admin_auth") === "true") {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  // Page de connexion
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0B1628,#162F52)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        fontFamily: "system-ui,sans-serif"
      }}>
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "2.5rem 2rem",
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,.4)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              width: 70,
              height: 70,
              borderRadius: "16px",
              background: "linear-gradient(135deg,#C9960F,#F0C040)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 1rem",
              boxShadow: "0 8px 24px rgba(201,150,15,.3)"
            }}>
              🛡️
            </div>
            <h1 style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: "1.6rem",
              fontWeight: 900,
              color: "#111",
              marginBottom: ".4rem"
            }}>
              Admin TalentProof
            </h1>
            <p style={{ color: "#666", fontSize: ".85rem" }}>
              Interface réservée à l'équipe
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label style={{
                display: "block",
                color: "#444",
                fontWeight: 700,
                fontSize: ".85rem",
                marginBottom: ".5rem"
              }}>
                Mot de passe administrateur
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: ".9rem 1rem",
                  borderRadius: "12px",
                  border: `2px solid ${error ? "#EF4444" : "#E5E7EB"}`,
                  fontSize: ".95rem",
                  outline: "none",
                  transition: "border-color .2s"
                }}
                onFocus={e => e.target.style.borderColor = error ? "#EF4444" : "#1B6B47"}
                onBlur={e => e.target.style.borderColor = error ? "#EF4444" : "#E5E7EB"}
              />
              {error && (
                <div style={{
                  color: "#EF4444",
                  fontSize: ".8rem",
                  marginTop: ".4rem",
                  display: "flex",
                  alignItems: "center",
                  gap: ".3rem"
                }}>
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg,#1B6B47,#2D9A68)",
                color: "white",
                fontWeight: 800,
                fontSize: "1rem",
                padding: "1rem",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(27,107,71,.3)",
                transition: "transform .2s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              🔓 Se connecter
            </button>
          </form>

          <div style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#FEF9EE",
            border: "1px solid #FCD34D",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ color: "#92400E", fontSize: ".8rem", lineHeight: 1.6 }}>
              <strong>⚠️ Accès restreint</strong><br />
              Interface réservée à l'équipe TalentProof.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard admin
  return (
    <>
      <GlobalStyles />
      <div style={{ display: "flex", minHeight: "100vh", background: "#F0F4F0", fontFamily: "system-ui,sans-serif" }}>
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Contenu principal */}
        <div className="admin-content" style={{ marginLeft: 260, flex: 1, padding: "2rem", minHeight: "100vh" }}>
          {/* Header mobile avec burger */}
          <div className="mobile-header" style={{
            display: "none",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
            background: "white",
            padding: ".8rem 1rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,.06)",
            border: "1px solid #E5E7EB"
          }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#1B6B47" }}>
              TalentProof Admin
            </div>
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: "linear-gradient(135deg,#1B6B47,#2D9A68)",
                border: "none",
                color: "white",
                cursor: "pointer"
              }}>
              <Menu size={20} />
            </button>
          </div>

          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Header desktop */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem"
            }}
            className="desktop-header">
              <div>
                <div style={{ color: "#9CA3AF", fontSize: ".8rem", fontWeight: 600, marginBottom: ".2rem" }}>
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#111", margin: 0 }}>
                  Bienvenue, Admin 👋
                </h2>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: ".6rem",
                background: "white",
                padding: ".6rem 1rem",
                borderRadius: "12px",
                border: "1px solid #E5E7EB"
              }}>
                <Shield size={18} color="#1B6B47" />
                <span style={{ fontSize: ".85rem", fontWeight: 700, color: "#1B6B47" }}>
                  Super Admin
                </span>
              </div>
            </div>

            {/* Contenu selon l'onglet */}
            {activeTab === "dashboard" && <DashboardTab stats={stats} />}
            {activeTab === "talents" && <TalentsTab talents={talents} onRefresh={loadData} />}
            {activeTab === "recruteurs" && <RecruteursTab recruteurs={recruteurs} onRefresh={loadData} />}
            {activeTab === "partenaires" && <PartenairesTab partenaires={partenaires} onRefresh={loadData} />}
            {activeTab === "team" && <TeamTab onRefresh={loadData} />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>
    </>
  );
}
