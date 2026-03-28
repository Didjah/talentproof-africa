"use client";
import { useState, useMemo } from "react";
import { waLink } from "../../utils/whatsapp";

/* ─────────────────────────────────────────────
   DONNÉES SIMULÉES — remplacer par appel API
   GET /api/profiles?is_published=true
───────────────────────────────────────────── */
const PROFILS_MOCK = [
  { id: "1",  nom: "Amadou Diallo",    metier: "Maçon",       ville: "Dakar",      pays: "🇸🇳", experience: 8,  hasVideo: true,  hasDoc: true,  disponible: "immediate",  avatar: "🧱", bio: "Spécialiste en fondations et carrelage. 8 ans de chantiers résidentiels à Dakar." },
  { id: "2",  nom: "Fatou Koné",       metier: "Couturière",  ville: "Abidjan",    pays: "🇨🇮", experience: 5,  hasVideo: true,  hasDoc: false, disponible: "immediate",  avatar: "✂️", bio: "Créations wax et bazin. Robes de mariage et tenues de cérémonie sur mesure." },
  { id: "3",  nom: "Ibrahim Traoré",   metier: "Chauffeur",   ville: "Bamako",     pays: "🇲🇱", experience: 12, hasVideo: false, hasDoc: true,  disponible: "negotiable", avatar: "🚗", bio: "Permis poids lourd. Transport de marchandises inter-villes Mali–Sénégal." },
  { id: "4",  nom: "Nadia Essomba",    metier: "Développeuse",ville: "Douala",     pays: "🇨🇲", experience: 4,  hasVideo: true,  hasDoc: true,  disponible: "1_month",    avatar: "💻", bio: "React & Node.js. Passionnée de fintech et solutions mobiles pour l'Afrique." },
  { id: "5",  nom: "Moussa Coulibaly", metier: "Soudeur",     ville: "Conakry",    pays: "🇬🇳", experience: 10, hasVideo: true,  hasDoc: false, disponible: "immediate",  avatar: "🔧", bio: "Soudure TIG/MIG, charpente métallique, garde-corps décoratifs." },
  { id: "6",  nom: "Aïsha Mensah",     metier: "Cuisinière",  ville: "Accra",      pays: "🇬🇭", experience: 6,  hasVideo: true,  hasDoc: true,  disponible: "immediate",  avatar: "🍳", bio: "Cuisine africaine et continentale. Traiteur événementiel jusqu'à 500 personnes." },
  { id: "7",  nom: "Seydou Ba",        metier: "Électricien", ville: "Dakar",      pays: "🇸🇳", experience: 7,  hasVideo: false, hasDoc: true,  disponible: "immediate",  avatar: "⚡", bio: "Installation électrique résidentielle et industrielle. Certification BT." },
  { id: "8",  nom: "Chidi Okonkwo",    metier: "Chauffeur",   ville: "Lagos",      pays: "🇳🇬", experience: 9,  hasVideo: true,  hasDoc: true,  disponible: "immediate",  avatar: "🚗", bio: "VTC professionnel, transport de personnel entreprise. Anglais courant." },
  { id: "9",  nom: "Mariam Ouédraogo", metier: "Couturière",  ville: "Ouagadougou",pays: "🇧🇫", experience: 3,  hasVideo: true,  hasDoc: false, disponible: "immediate",  avatar: "✂️", bio: "Mode africaine contemporaine. Créations personnalisées brodées à la main." },
  { id: "10", nom: "Kofi Asante",      metier: "Maçon",       ville: "Kumasi",     pays: "🇬🇭", experience: 15, hasVideo: false, hasDoc: true,  disponible: "negotiable", avatar: "🧱", bio: "Maçonnerie traditionnelle et moderne. Chef de chantier confirmé." },
  { id: "11", nom: "Léa Randriamaro",  metier: "Développeuse",ville: "Antananarivo",pays:"🇲🇬", experience: 2,  hasVideo: true,  hasDoc: true,  disponible: "immediate",  avatar: "💻", bio: "Flutter & Firebase. Applications mobiles e-commerce et santé numérique." },
  { id: "12", nom: "Boubacar Sow",     metier: "Soudeur",     ville: "Niamey",     pays: "🇳🇪", experience: 6,  hasVideo: true,  hasDoc: false, disponible: "1_month",    avatar: "🔧", bio: "Soudure à l'arc et oxyacétylénique. Fabrication de portes et fenêtres métalliques." },
];

const TOUS_METIERS = ["Tous les métiers", ...Array.from(new Set(PROFILS_MOCK.map(p => p.metier))).sort()];
const DISPO_LABEL  = { immediate: "Disponible", "1_month": "Dispo dans 1 mois", negotiable: "À négocier" };
const DISPO_COLOR  = { immediate: "#16A34A", "1_month": "#D97706", negotiable: "#6B7280" };

function TrustBadge({ hasDoc, hasVideo }) {
  if (hasDoc && hasVideo) return <span style={badge("#DCFCE7","#15803D")}>✅ Profil vérifié</span>;
  if (hasDoc)             return <span style={badge("#DBEAFE","#1D4ED8")}>📄 Document dispo</span>;
  if (hasVideo)           return <span style={badge("#EDE9FE","#6D28D9")}>🎥 Vidéo dispo</span>;
  return                         <span style={badge("#F3F4F6","#6B7280")}>⚠️ Aucune preuve</span>;
}
const badge = (bg, color) => ({
  background: bg, color, fontSize: "0.72rem", fontWeight: 700,
  padding: "0.25rem 0.65rem", borderRadius: "9999px", whiteSpace: "nowrap",
});

/* ── Modal lecteur vidéo ── */
function VideoModal({ profil, onClose }) {
  if (!profil) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "1rem", backdropFilter: "blur(6px)",
    }}>
      <div style={{
        background: "#0D3B2E", borderRadius: "1.5rem", padding: "2rem",
        width: "100%", maxWidth: "560px", position: "relative",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "1rem", right: "1rem",
          background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
          width: "2rem", height: "2rem", color: "white", cursor: "pointer",
          fontSize: "1rem", lineHeight: "2rem", textAlign: "center",
        }}>✕</button>

        {/* Lecteur simulé */}
        <div style={{
          background: "#000", borderRadius: "1rem", aspectRatio: "16/9",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", marginBottom: "1.5rem", overflow: "hidden",
          position: "relative",
        }}>
          <div style={{ fontSize: "5rem" }}>{profil.avatar}</div>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
            padding: "1.5rem 1rem 1rem",
          }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
              {profil.nom} — {profil.metier}
            </div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem" }}>
              {profil.ville} {profil.pays}
            </div>
          </div>
          {/* Barre de lecture simulée */}
          <div style={{
            position: "absolute", bottom: "0", left: 0, right: 0, height: "3px",
            background: "rgba(255,255,255,0.2)",
          }}>
            <div style={{ width: "35%", height: "100%", background: "#D4A017" }} />
          </div>
        </div>

        {/* Infos profil */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: "1.15rem" }}>{profil.nom}</div>
            <div style={{ color: "#D4A017", fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
              {profil.metier} · {profil.experience} ans d&apos;expérience
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", lineHeight: 1.6 }}>{profil.bio}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
          <a href={waLink(profil.nom, profil.metier, profil.phone)}
            target="_blank" rel="noreferrer"
            style={{
              flex: 1, background: "#25D366", color: "white",
              border: "none", borderRadius: "9999px", padding: "0.75rem 1.25rem",
              fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
              textAlign: "center", textDecoration: "none",
            }}>
            💬 Contacter sur WhatsApp
          </a>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.1)", color: "white",
            border: "1px solid rgba(255,255,255,0.2)", borderRadius: "9999px",
            padding: "0.75rem 1.25rem", fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
          }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   PAGE PRINCIPALE — DASHBOARD RECRUTEUR
════════════════════════════════════════════ */
export default function DashboardRecruteur() {
  const [metierFiltre,  setMetierFiltre]  = useState("Tous les métiers");
  const [villeFiltre,   setVilleFiltre]   = useState("");
  const [videoSeulement,setVideoSeulement]= useState(false);
  const [profilSelectionne, setProfilSelectionne] = useState(null);
  const [vue, setVue] = useState("grille"); // "grille" | "liste"

  const profils = useMemo(() => {
    return PROFILS_MOCK.filter(p => {
      if (metierFiltre !== "Tous les métiers" && p.metier !== metierFiltre) return false;
      if (villeFiltre && !p.ville.toLowerCase().includes(villeFiltre.toLowerCase())) return false;
      if (videoSeulement && !p.hasVideo) return false;
      return true;
    });
  }, [metierFiltre, villeFiltre, videoSeulement]);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F2", fontFamily: "Inter, sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{
        background: "#0D3B2E",
        padding: "1rem 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
        flexWrap: "wrap", gap: "0.75rem",
      }}>
        <div>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ color: "#D4A017", fontWeight: 900, fontSize: "1.35rem" }}>
              Talent<span style={{ color: "white" }}>Proof</span>
            </span>
          </a>
          <span style={{
            marginLeft: "0.75rem", background: "rgba(212,160,23,0.18)",
            color: "#F0C040", fontSize: "0.75rem", fontWeight: 700,
            padding: "0.2rem 0.65rem", borderRadius: "9999px",
            border: "1px solid rgba(212,160,23,0.3)",
          }}>Espace Recruteur</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.88rem" }}>
          {profils.length} talent{profils.length > 1 ? "s" : ""} trouvé{profils.length > 1 ? "s" : ""}
        </div>
      </header>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ── TITRE ── */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#0D3B2E", margin: 0 }}>
            Trouver un talent 🌍
          </h1>
          <p style={{ color: "#6B7280", marginTop: "0.4rem", fontSize: "0.97rem" }}>
            Filtrez par métier ou ville et visionnez les preuves vidéo directement.
          </p>
        </div>

        {/* ── FILTRES ── */}
        <div style={{
          background: "white", borderRadius: "1.25rem",
          padding: "1.25rem 1.5rem", marginBottom: "1.75rem",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center",
        }}>

          {/* Filtre métier */}
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#0D3B2E", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Métier
            </label>
            <select value={metierFiltre} onChange={e => setMetierFiltre(e.target.value)} style={{
              width: "100%", border: "1.5px solid #D1D5DB", borderRadius: "0.75rem",
              padding: "0.6rem 0.9rem", fontSize: "0.95rem", background: "white",
              outline: "none", cursor: "pointer", color: "#111827",
            }}>
              {TOUS_METIERS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          {/* Filtre ville */}
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#0D3B2E", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Ville
            </label>
            <input value={villeFiltre} onChange={e => setVilleFiltre(e.target.value)}
              placeholder="Ex: Dakar, Abidjan…" style={{
                width: "100%", border: "1.5px solid #D1D5DB", borderRadius: "0.75rem",
                padding: "0.6rem 0.9rem", fontSize: "0.95rem", outline: "none",
                boxSizing: "border-box",
              }} />
          </div>

          {/* Toggle vidéo seulement */}
          <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#0D3B2E", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Preuves
            </label>
            <button onClick={() => setVideoSeulement(v => !v)} style={{
              padding: "0.6rem 1.1rem", borderRadius: "0.75rem", fontWeight: 600,
              fontSize: "0.88rem", cursor: "pointer", border: "1.5px solid",
              borderColor: videoSeulement ? "#1B6B47" : "#D1D5DB",
              background: videoSeulement ? "#EEF7F2" : "white",
              color: videoSeulement ? "#1B6B47" : "#6B7280",
              transition: "all 0.15s",
            }}>
              🎥 Vidéo uniquement {videoSeulement ? "✓" : ""}
            </button>
          </div>

          {/* Vue grille / liste + reset */}
          <div style={{ flex: "0 0 auto", display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            {(metierFiltre !== "Tous les métiers" || villeFiltre || videoSeulement) && (
              <button onClick={() => { setMetierFiltre("Tous les métiers"); setVilleFiltre(""); setVideoSeulement(false); }} style={{
                padding: "0.6rem 1rem", borderRadius: "0.75rem",
                border: "1.5px solid #FCA5A5", background: "#FEF2F2", color: "#DC2626",
                fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
              }}>
                ✕ Effacer
              </button>
            )}
            <div style={{ display: "flex", border: "1.5px solid #D1D5DB", borderRadius: "0.75rem", overflow: "hidden" }}>
              {["grille", "liste"].map(v => (
                <button key={v} onClick={() => setVue(v)} style={{
                  padding: "0.6rem 0.85rem", border: "none", cursor: "pointer",
                  background: vue === v ? "#0D3B2E" : "white",
                  color: vue === v ? "white" : "#6B7280", fontSize: "1rem",
                }}>
                  {v === "grille" ? "⊞" : "☰"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CHIPS MÉTIERS RAPIDES ── */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          {TOUS_METIERS.slice(1).map(m => (
            <button key={m} onClick={() => setMetierFiltre(metierFiltre === m ? "Tous les métiers" : m)} style={{
              padding: "0.4rem 1rem", borderRadius: "9999px", fontSize: "0.85rem",
              fontWeight: 600, cursor: "pointer", border: "1.5px solid",
              borderColor: metierFiltre === m ? "#1B6B47" : "#D1D5DB",
              background: metierFiltre === m ? "#1B6B47" : "white",
              color: metierFiltre === m ? "white" : "#374151",
              transition: "all 0.15s",
            }}>
              {m}
            </button>
          ))}
        </div>

        {/* ── RÉSULTATS ── */}
        {profils.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem", color: "#9CA3AF" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#374151" }}>Aucun talent trouvé</div>
            <div style={{ marginTop: "0.4rem" }}>Essaie avec d&apos;autres filtres.</div>
          </div>
        ) : vue === "grille" ? (
          /* ── VUE GRILLE ── */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}>
            {profils.map(p => (
              <div key={p.id} style={{
                background: "white", borderRadius: "1.25rem",
                overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                transition: "transform 0.2s, box-shadow 0.2s",
                display: "flex", flexDirection: "column",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.13)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}
              >
                {/* Bannière */}
                <div style={{
                  background: "linear-gradient(135deg, #0D3B2E, #1B6B47)",
                  padding: "1.5rem 1.25rem 1rem",
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                }}>
                  <div style={{ fontSize: "2.8rem" }}>{p.avatar}</div>
                  <TrustBadge hasDoc={p.hasDoc} hasVideo={p.hasVideo} />
                </div>

                {/* Contenu */}
                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0D3B2E" }}>{p.nom}</div>
                  <div style={{ color: "#D4A017", fontWeight: 700, fontSize: "0.92rem", marginTop: "0.15rem" }}>
                    {p.metier} · {p.experience} ans
                  </div>
                  <div style={{ color: "#6B7280", fontSize: "0.85rem", marginTop: "0.3rem" }}>
                    📍 {p.ville} {p.pays}
                  </div>
                  <div style={{ color: "#6B7280", fontSize: "0.82rem", marginTop: "0.6rem", lineHeight: 1.6, flex: 1 }}>
                    {p.bio.length > 90 ? p.bio.slice(0, 90) + "…" : p.bio}
                  </div>

                  {/* Disponibilité */}
                  <div style={{ marginTop: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: DISPO_COLOR[p.disponible] }} />
                    <span style={{ fontSize: "0.8rem", color: DISPO_COLOR[p.disponible], fontWeight: 600 }}>
                      {DISPO_LABEL[p.disponible]}
                    </span>
                  </div>

                  {/* Bouton */}
                  <button
                    onClick={() => setProfilSelectionne(p)}
                    disabled={!p.hasVideo}
                    style={{
                      marginTop: "1rem", width: "100%", padding: "0.7rem",
                      borderRadius: "9999px", border: "none", cursor: p.hasVideo ? "pointer" : "not-allowed",
                      background: p.hasVideo
                        ? "linear-gradient(135deg, #D4A017, #F0C040)"
                        : "#F3F4F6",
                      color: p.hasVideo ? "#0D3B2E" : "#9CA3AF",
                      fontWeight: 700, fontSize: "0.9rem",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={e => p.hasVideo && (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={e => p.hasVideo && (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {p.hasVideo ? "▶ Visionner la preuve vidéo" : "Pas encore de vidéo"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── VUE LISTE ── */
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {profils.map(p => (
              <div key={p.id} style={{
                background: "white", borderRadius: "1rem",
                padding: "1rem 1.5rem", boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap",
              }}>
                <div style={{ fontSize: "2rem", minWidth: "2.5rem", textAlign: "center" }}>{p.avatar}</div>
                <div style={{ flex: "1 1 200px" }}>
                  <div style={{ fontWeight: 700, color: "#0D3B2E" }}>{p.nom}</div>
                  <div style={{ color: "#D4A017", fontSize: "0.85rem", fontWeight: 600 }}>{p.metier} · {p.experience} ans</div>
                  <div style={{ color: "#6B7280", fontSize: "0.82rem" }}>📍 {p.ville} {p.pays}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <TrustBadge hasDoc={p.hasDoc} hasVideo={p.hasVideo} />
                  <button
                    onClick={() => setProfilSelectionne(p)}
                    disabled={!p.hasVideo}
                    style={{
                      padding: "0.5rem 1.1rem", borderRadius: "9999px", border: "none",
                      cursor: p.hasVideo ? "pointer" : "not-allowed",
                      background: p.hasVideo ? "linear-gradient(135deg,#D4A017,#F0C040)" : "#F3F4F6",
                      color: p.hasVideo ? "#0D3B2E" : "#9CA3AF",
                      fontWeight: 700, fontSize: "0.85rem",
                    }}>
                    {p.hasVideo ? "▶ Voir la vidéo" : "Pas de vidéo"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL VIDÉO ── */}
      <VideoModal profil={profilSelectionne} onClose={() => setProfilSelectionne(null)} />
    </div>
  );
}
