"use client";
import { useState, useEffect } from "react";
import { getGlobalStats, getAllProfiles, updateProfileStatus, resetAnalytics, initAnalytics } from "@/utils/analytics";
import { TrendingUp, Users, MousePointerClick, MapPin, CheckCircle, Clock, BarChart3, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");

  // Mot de passe admin simple (à changer en production)
  const ADMIN_PASSWORD = "talentproof2026";

  useEffect(() => {
    // Vérifier si déjà authentifié dans la session
    const isAuth = sessionStorage.getItem("tp_admin_auth") === "true";
    if (isAuth) {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    initAnalytics();
    const statsData = getGlobalStats();
    const profilesData = getAllProfiles();
    setStats(statsData);
    setProfiles(profilesData);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("tp_admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
      loadData();
    } else {
      setError("❌ Mot de passe incorrect");
      setPassword("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("tp_admin_auth");
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleStatusChange = (profilId, newStatus) => {
    updateProfileStatus(profilId, newStatus);
    loadData();
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleReset = () => {
    resetAnalytics();
    loadData();
  };

  // Page de connexion
  if (!isAuthenticated) {
    return (
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0B1628,#0F2744,#162F52)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
        <div style={{background:"white",borderRadius:"24px",padding:"3rem 2.5rem",maxWidth:450,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.5)"}}>
          <div style={{textAlign:"center",marginBottom:"2rem"}}>
            <div style={{fontSize:"3.5rem",marginBottom:"1rem"}}>🔐</div>
            <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.8rem",fontWeight:800,color:"#1A365D",marginBottom:".5rem"}}>
              Dashboard Admin
            </h1>
            <p style={{color:"#666",fontSize:".9rem"}}>TalentProof Business Intelligence</p>
          </div>

          <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
            <div>
              <label style={{display:"block",color:"#444",fontWeight:600,fontSize:".9rem",marginBottom:".6rem"}}>
                Mot de passe administrateur
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                autoFocus
                style={{
                  width:"100%",
                  padding:"1rem 1.2rem",
                  borderRadius:"12px",
                  border:"2px solid #E5E7EB",
                  fontSize:".95rem",
                  outline:"none",
                  transition:"border-color .2s"
                }}
                onFocus={e=>e.target.style.borderColor="#1A365D"}
                onBlur={e=>e.target.style.borderColor="#E5E7EB"}
              />
            </div>

            {error && (
              <div style={{
                background:"#FEE2E2",
                color:"#DC2626",
                padding:".8rem 1rem",
                borderRadius:"10px",
                fontSize:".85rem",
                fontWeight:600,
                textAlign:"center"
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                background:"linear-gradient(135deg,#1A365D,#2D4A7C)",
                color:"white",
                fontWeight:800,
                fontSize:"1rem",
                padding:"1rem",
                borderRadius:"12px",
                border:"none",
                cursor:"pointer",
                boxShadow:"0 4px 16px rgba(26,54,93,.3)",
                transition:"transform .2s"
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              Accéder au Dashboard
            </button>
          </form>

          <div style={{marginTop:"2rem",textAlign:"center"}}>
            <a href="/" style={{color:"#1A365D",fontSize:".85rem",fontWeight:600,textDecoration:"none"}}>
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard principal
  return (
    <div style={{minHeight:"100vh",background:"#F0F4F0"}}>
      {/* Header */}
      <header style={{
        background:"linear-gradient(135deg,#1A365D,#2D4A7C)",
        borderBottom:"2px solid #ECC94B",
        boxShadow:"0 4px 24px rgba(0,0,0,.3)",
        padding:"1rem 1.5rem"
      }}>
        <div style={{maxWidth:1400,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
            <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.4rem",color:"#ECC94B"}}>
              📊 Dashboard TalentProof
            </div>
            <button onClick={handleRefresh}
              style={{
                background:"rgba(236,201,75,.15)",
                border:"1px solid rgba(236,201,75,.3)",
                borderRadius:"8px",
                padding:".5rem .8rem",
                color:"#ECC94B",
                cursor:"pointer",
                display:"flex",
                alignItems:"center",
                gap:".4rem",
                fontSize:".8rem",
                fontWeight:600
              }}>
              <RefreshCw size={14}/> Actualiser
            </button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:".8rem"}}>
            <a href="/" style={{color:"rgba(255,255,255,.7)",fontSize:".85rem",textDecoration:"none",fontWeight:600}}>
              ← Accueil
            </a>
            <button onClick={handleLogout}
              style={{
                background:"rgba(255,255,255,.1)",
                border:"1px solid rgba(255,255,255,.2)",
                borderRadius:"8px",
                padding:".5rem 1rem",
                color:"white",
                cursor:"pointer",
                fontSize:".85rem",
                fontWeight:600
              }}>
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div style={{maxWidth:1400,margin:"0 auto",padding:"2rem 1.5rem"}}>
        
        {/* Cartes de statistiques */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem",marginBottom:"2.5rem"}}>
          
          {/* Total Inscrits */}
          <div style={{
            background:"linear-gradient(135deg,#1B6B47,#2D9A68)",
            borderRadius:"20px",
            padding:"2rem",
            boxShadow:"0 4px 20px rgba(27,107,71,.3)",
            position:"relative",
            overflow:"hidden"
          }}>
            <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.08)"}}/>
            <div style={{position:"relative"}}>
              <div style={{display:"flex",alignItems:"center",gap:".8rem",marginBottom:"1rem"}}>
                <div style={{background:"rgba(255,255,255,.15)",borderRadius:"12px",padding:".7rem",display:"flex"}}>
                  <Users size={24} color="white" strokeWidth={2.5}/>
                </div>
                <div style={{color:"rgba(255,255,255,.7)",fontSize:".85rem",fontWeight:600}}>Total Inscrits</div>
              </div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:"3rem",fontWeight:900,color:"white",lineHeight:1}}>
                {stats?.totalProfiles || 0}
              </div>
              <div style={{marginTop:".8rem",display:"flex",alignItems:"center",gap:".4rem",color:"rgba(255,255,255,.6)",fontSize:".8rem"}}>
                <CheckCircle size={14}/> {stats?.verifiedProfiles || 0} vérifiés
                <span style={{margin:"0 .3rem"}}>·</span>
                <Clock size={14}/> {stats?.pendingProfiles || 0} en attente
              </div>
            </div>
          </div>

          {/* Total Contacts WhatsApp */}
          <div style={{
            background:"linear-gradient(135deg,#D69E2E,#ECC94B)",
            borderRadius:"20px",
            padding:"2rem",
            boxShadow:"0 4px 20px rgba(236,201,75,.4)",
            position:"relative",
            overflow:"hidden"
          }}>
            <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(26,54,93,.08)"}}/>
            <div style={{position:"relative"}}>
              <div style={{display:"flex",alignItems:"center",gap:".8rem",marginBottom:"1rem"}}>
                <div style={{background:"rgba(26,54,93,.15)",borderRadius:"12px",padding:".7rem",display:"flex"}}>
                  <MousePointerClick size={24} color="#1A365D" strokeWidth={2.5}/>
                </div>
                <div style={{color:"#92400E",fontSize:".85rem",fontWeight:600}}>Clics WhatsApp</div>
              </div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:"3rem",fontWeight:900,color:"#1A365D",lineHeight:1}}>
                {stats?.totalContacts || 0}
              </div>
              <div style={{marginTop:".8rem",color:"#92400E",fontSize:".8rem",fontWeight:600}}>
                💬 Contacts générés
              </div>
            </div>
          </div>

          {/* Ville la plus active */}
          <div style={{
            background:"linear-gradient(135deg,#0B1628,#162F52)",
            borderRadius:"20px",
            padding:"2rem",
            boxShadow:"0 4px 20px rgba(11,22,40,.4)",
            position:"relative",
            overflow:"hidden"
          }}>
            <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(236,201,75,.08)"}}/>
            <div style={{position:"relative"}}>
              <div style={{display:"flex",alignItems:"center",gap:".8rem",marginBottom:"1rem"}}>
                <div style={{background:"rgba(236,201,75,.15)",borderRadius:"12px",padding:".7rem",display:"flex"}}>
                  <MapPin size={24} color="#ECC94B" strokeWidth={2.5}/>
                </div>
                <div style={{color:"rgba(255,255,255,.7)",fontSize:".85rem",fontWeight:600}}>Ville la plus active</div>
              </div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:"2.2rem",fontWeight:900,color:"#ECC94B",lineHeight:1,marginBottom:".5rem"}}>
                {stats?.topVille || 'N/A'}
              </div>
              <div style={{color:"rgba(255,255,255,.6)",fontSize:".8rem",fontWeight:600}}>
                📍 {stats?.topVilleContacts || 0} contacts
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des profils */}
        <div style={{background:"white",borderRadius:"20px",padding:"2rem",boxShadow:"0 4px 20px rgba(0,0,0,.08)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem"}}>
            <div>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#1A365D",marginBottom:".3rem"}}>
                📋 Tous les Profils
              </h2>
              <p style={{color:"#666",fontSize:".85rem"}}>Gestion et suivi des talents inscrits</p>
            </div>
            <button onClick={handleReset}
              style={{
                background:"#FEE2E2",
                color:"#DC2626",
                border:"1px solid #FCA5A5",
                borderRadius:"8px",
                padding:".6rem 1rem",
                fontSize:".8rem",
                fontWeight:700,
                cursor:"pointer",
                display:"flex",
                alignItems:"center",
                gap:".4rem"
              }}>
              🗑️ Réinitialiser données
            </button>
          </div>

          {/* Tableau responsive */}
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:".9rem"}}>
              <thead>
                <tr style={{background:"#F9FAFB",borderBottom:"2px solid #E5E7EB"}}>
                  <th style={{padding:"1rem",textAlign:"left",fontWeight:700,color:"#1A365D",fontSize:".85rem"}}>ID</th>
                  <th style={{padding:"1rem",textAlign:"left",fontWeight:700,color:"#1A365D",fontSize:".85rem"}}>Nom</th>
                  <th style={{padding:"1rem",textAlign:"left",fontWeight:700,color:"#1A365D",fontSize:".85rem"}}>Métier</th>
                  <th style={{padding:"1rem",textAlign:"left",fontWeight:700,color:"#1A365D",fontSize:".85rem"}}>Ville</th>
                  <th style={{padding:"1rem",textAlign:"center",fontWeight:700,color:"#1A365D",fontSize:".85rem"}}>Contacts</th>
                  <th style={{padding:"1rem",textAlign:"left",fontWeight:700,color:"#1A365D",fontSize:".85rem"}}>Date</th>
                  <th style={{padding:"1rem",textAlign:"left",fontWeight:700,color:"#1A365D",fontSize:".85rem"}}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profil, idx) => (
                  <tr key={profil.id} style={{borderBottom:"1px solid #F0F0F0",transition:"background .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"1rem",color:"#9CA3AF",fontWeight:600}}>#{profil.id}</td>
                    <td style={{padding:"1rem",color:"#111",fontWeight:700}}>{profil.nom}</td>
                    <td style={{padding:"1rem",color:"#1B6B47",fontWeight:600}}>{profil.metier}</td>
                    <td style={{padding:"1rem",color:"#666"}}>
                      <div style={{display:"flex",alignItems:"center",gap:".3rem"}}>
                        <MapPin size={14} color="#9CA3AF"/>
                        {profil.ville}
                      </div>
                    </td>
                    <td style={{padding:"1rem",textAlign:"center"}}>
                      <span style={{
                        background:"#EFF6FF",
                        color:"#1D4ED8",
                        fontWeight:700,
                        fontSize:".85rem",
                        padding:".3rem .7rem",
                        borderRadius:"99px"
                      }}>
                        {profil.contacts || 0}
                      </span>
                    </td>
                    <td style={{padding:"1rem",color:"#9CA3AF",fontSize:".85rem"}}>{profil.dateCreation}</td>
                    <td style={{padding:"1rem"}}>
                      <select
                        value={profil.statut}
                        onChange={(e) => handleStatusChange(profil.id, e.target.value)}
                        style={{
                          padding:".4rem .7rem",
                          borderRadius:"8px",
                          border:"1.5px solid",
                          borderColor: profil.statut === "Vérifié" ? "#86EFAC" : "#FCD34D",
                          background: profil.statut === "Vérifié" ? "#F0FDF4" : "#FEF9EE",
                          color: profil.statut === "Vérifié" ? "#15803D" : "#92400E",
                          fontWeight:700,
                          fontSize:".8rem",
                          cursor:"pointer",
                          outline:"none"
                        }}>
                        <option value="Vérifié">✓ Vérifié</option>
                        <option value="En attente">⏳ En attente</option>
                        <option value="Suspendu">⛔ Suspendu</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {profiles.length === 0 && (
            <div style={{textAlign:"center",padding:"3rem 1rem",color:"#9CA3AF"}}>
              <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>📭</div>
              <div style={{fontWeight:600,fontSize:".95rem"}}>Aucun profil enregistré</div>
            </div>
          )}
        </div>

        {/* Événements récents */}
        {stats?.recentEvents && stats.recentEvents.length > 0 && (
          <div style={{background:"white",borderRadius:"20px",padding:"2rem",boxShadow:"0 4px 20px rgba(0,0,0,.08)",marginTop:"2rem"}}>
            <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#1A365D",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:".5rem"}}>
              <BarChart3 size={22} color="#ECC94B"/> Activité Récente
            </h3>
            <div style={{display:"flex",flexDirection:"column",gap:".8rem"}}>
              {stats.recentEvents.map((event, idx) => (
                <div key={event.id} style={{
                  display:"flex",
                  alignItems:"center",
                  gap:"1rem",
                  padding:".9rem 1.1rem",
                  background:"#F9FAFB",
                  borderRadius:"12px",
                  border:"1px solid #E5E7EB"
                }}>
                  <div style={{
                    background:"linear-gradient(135deg,#25D366,#20BA5A)",
                    borderRadius:"10px",
                    padding:".6rem",
                    display:"flex",
                    flexShrink:0
                  }}>
                    <MousePointerClick size={18} color="white"/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:"#111",fontWeight:700,fontSize:".9rem"}}>
                      Contact WhatsApp {event.profilNom ? `- ${event.profilNom}` : ''}
                    </div>
                    <div style={{color:"#9CA3AF",fontSize:".75rem",marginTop:".2rem"}}>
                      {new Date(event.timestamp).toLocaleString('fr-FR')}
                      {event.source && ` · ${event.source}`}
                    </div>
                  </div>
                  <div style={{
                    background:"#DCFCE7",
                    color:"#166534",
                    fontSize:".75rem",
                    fontWeight:700,
                    padding:".3rem .7rem",
                    borderRadius:"99px",
                    flexShrink:0
                  }}>
                    ✓ Tracké
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info box */}
        <div style={{
          background:"linear-gradient(135deg,#FEF9EE,#FFF7E0)",
          border:"2px solid #ECC94B",
          borderRadius:"16px",
          padding:"1.5rem",
          marginTop:"2rem"
        }}>
          <div style={{display:"flex",alignItems:"flex-start",gap:"1rem"}}>
            <div style={{fontSize:"2rem",flexShrink:0}}>💡</div>
            <div>
              <div style={{fontWeight:700,color:"#92400E",fontSize:".95rem",marginBottom:".5rem"}}>
                Données stockées localement
              </div>
              <p style={{color:"#B45309",fontSize:".85rem",lineHeight:1.6}}>
                Toutes les statistiques sont sauvegardées dans le localStorage de votre navigateur. 
                Les données persistent même après rafraîchissement de la page. 
                Utilisez le bouton "Réinitialiser" pour effacer toutes les données de test.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
