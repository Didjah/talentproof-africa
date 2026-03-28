"use client";
import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import PartnerCard from "../../components/feed/PartnerCard";
import { InscriptionModal } from "../../components/feed/Modals";

/* ── Partenaire simulé (futur : chargé depuis /api/partners/me) ── */
const MON_PROFIL = {
  id: "p-demo",
  type: "partner",
  badge: "PARTENAIRE OFFICIEL",
  nom: "CFPT Abidjan",
  soustitre: "Centre de Formation Professionnelle & Technique",
  pays: "🇨🇮", ville: "Abidjan",
  description: "Formez-vous aux métiers de demain. Nos 12 filières certifiantes préparent à l'emploi en 6 à 18 mois. Taux d'insertion : 87%.",
  stats: [
    { val: "2 400+", lbl: "diplômés/an" },
    { val: "12",     lbl: "filières"    },
    { val: "87%",    lbl: "insertion"   },
  ],
  cta1: { label: "Voir nos formations", href: "#" },
  cta2: { label: "Nous contacter",      href: "#" },
  logo: "🏫",
  theme: "formation",
  insertAfter: 1,
};

/* ── Statistiques simulées ── */
const STATS_SEMAINE = [
  { icon: "👁️",  label: "Vues de la publicité",    value: "14 280", delta: "+12%",  up: true,  color: "#F0C040" },
  { icon: "🖱️",  label: "Clics sur vos CTAs",       value: "1 043",  delta: "+8%",   up: true,  color: "#34D399" },
  { icon: "🎓",  label: "Élèves inscrits (ce mois)",value: "47",     delta: "+3",    up: true,  color: "#60A5FA" },
  { icon: "💬",  label: "Contacts WhatsApp reçus",  value: "128",    delta: "+21%",  up: true,  color: "#A78BFA" },
  { icon: "📍",  label: "Portée géographique",      value: "9 pays", delta: "stable",up: null,  color: "#F97316" },
  { icon: "⭐",  label: "Score de visibilité",      value: "94 / 100",delta: "+2pts",up: true,  color: "#F0C040" },
];

/* ── Historique de performances (graphique simulé) ── */
const PERF_7J = [
  { jour: "Lun", vues: 1820, clics: 134 },
  { jour: "Mar", vues: 2100, clics: 158 },
  { jour: "Mer", vues: 1950, clics: 142 },
  { jour: "Jeu", vues: 2380, clics: 187 },
  { jour: "Ven", vues: 2640, clics: 210 },
  { jour: "Sam", vues: 1780, clics: 122 },
  { jour: "Dim", vues: 1610, clics: 90  },
];
const MAX_VUES = Math.max(...PERF_7J.map(d => d.vues));

/* ── Formations existantes ── */
const FORMATIONS_INITIALES = [
  { id: 1, titre: "BTS Génie Civil",          duree: "2 ans",  places: 30, inscrits: 24, status: "active"   },
  { id: 2, titre: "CAP Électrotechnique",      duree: "18 mois",places: 20, inscrits: 20, status: "complet"  },
  { id: 3, titre: "Certificat Développement Web", duree: "6 mois", places: 25, inscrits: 11, status: "active" },
];

/* ═══════════════════════════════════════════════════
   COMPOSANTS UI
═══════════════════════════════════════════════════ */

function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "2.5rem 0 1.5rem" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,150,15,0.4))" }}/>
      <span style={{ color: "var(--gold)", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase" }}>✦</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(201,150,15,0.4), transparent)" }}/>
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <span style={{ fontSize: "1.2rem" }}>{icon}</span>
        <h2 style={{ fontWeight: 900, fontSize: "1.1rem", color: "var(--g900,#071F15)", margin: 0 }}>{title}</h2>
      </div>
      {subtitle && <p style={{ color: "var(--t3)", fontSize: "0.83rem", marginTop: "0.2rem", marginLeft: "1.8rem" }}>{subtitle}</p>}
    </div>
  );
}

/* Carte stat individuelle */
function StatCard({ stat }) {
  return (
    <div style={{
      background: "white", borderRadius: "1rem", padding: "1.25rem 1.35rem",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid var(--border,#E5E9E7)",
      display: "flex", flexDirection: "column", gap: "0.5rem",
      transition: "transform 0.18s, box-shadow 0.18s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "0.65rem",
          background: `${stat.color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.2rem",
        }}>{stat.icon}</div>
        {stat.up !== null && (
          <span style={{
            fontSize: "0.73rem", fontWeight: 700, borderRadius: "99px",
            padding: "2px 8px",
            background: stat.up ? "#D1FAE5" : "#FEE2E2",
            color: stat.up ? "#065F46" : "#991B1B",
          }}>
            {stat.up ? "↑" : "↓"} {stat.delta}
          </span>
        )}
        {stat.up === null && (
          <span style={{ fontSize: "0.73rem", fontWeight: 600, color: "var(--t3,#7A9186)", background: "#F3F4F6", padding: "2px 8px", borderRadius: "99px" }}>
            {stat.delta}
          </span>
        )}
      </div>
      <div style={{ fontWeight: 900, fontSize: "1.5rem", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
      <div style={{ color: "var(--t3,#7A9186)", fontSize: "0.8rem", fontWeight: 500 }}>{stat.label}</div>
    </div>
  );
}

/* Mini graphique en barres */
function MiniChart() {
  return (
    <div style={{
      background: "white", borderRadius: "1rem", padding: "1.35rem",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid var(--border,#E5E9E7)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#071F15" }}>Activité — 7 derniers jours</div>
          <div style={{ color: "var(--t3,#7A9186)", fontSize: "0.78rem", marginTop: "2px" }}>Vues et clics quotidiens</div>
        </div>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "#F0C040", display: "inline-block" }}/>
            Vues
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "#34D399", display: "inline-block" }}/>
            Clics
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end", height: 100 }}>
        {PERF_7J.map(({ jour, vues, clics }) => {
          const hVues  = (vues  / MAX_VUES) * 100;
          const hClics = (clics / MAX_VUES) * 100;
          return (
            <div key={jour} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
              <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 80 }}>
                <div style={{ flex: 1, background: "#F0C040", borderRadius: "3px 3px 0 0", height: `${hVues}%`, minHeight: 4, transition: "height 0.5s" }}/>
                <div style={{ flex: 1, background: "#34D399", borderRadius: "3px 3px 0 0", height: `${hClics}%`, minHeight: 4, transition: "height 0.5s" }}/>
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--t3,#7A9186)", fontWeight: 600 }}>{jour}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Carte formation */
function FormationRow({ f, onDelete }) {
  const statusStyles = {
    active:  { bg: "#D1FAE5", color: "#065F46", label: "Active"   },
    complet: { bg: "#FEE2E2", color: "#991B1B", label: "Complet"  },
    draft:   { bg: "#F3F4F6", color: "#6B7280", label: "Brouillon"},
  };
  const s = statusStyles[f.status] || statusStyles.draft;
  const pct = Math.round((f.inscrits / f.places) * 100);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "1rem",
      padding: "0.9rem 1.1rem", background: "white",
      borderRadius: "0.85rem", border: "1px solid var(--border,#E5E9E7)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)", flexWrap: "wrap",
    }}>
      <div style={{ flex: "1 1 180px" }}>
        <div style={{ fontWeight: 700, fontSize: "0.93rem", color: "#071F15" }}>{f.titre}</div>
        <div style={{ color: "var(--t3,#7A9186)", fontSize: "0.78rem", marginTop: "2px" }}>⏱ {f.duree}</div>
      </div>

      <div style={{ flex: "1 1 120px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--t3,#7A9186)", marginBottom: "0.3rem" }}>
          <span>{f.inscrits} inscrits</span><span>{f.places} places</span>
        </div>
        <div style={{ background: "#F3F4F6", borderRadius: "99px", height: 5, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", borderRadius: "99px", background: pct >= 100 ? "#EF4444" : "#1B6B47", transition: "width 0.5s" }}/>
        </div>
      </div>

      <span style={{ background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "99px" }}>
        {s.label}
      </span>

      <div style={{ display: "flex", gap: "0.4rem" }}>
        <button style={{ background: "var(--g100,#EEF7F2)", border: "none", borderRadius: "0.5rem", padding: "0.4rem 0.75rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, color: "var(--g700,#1B6B47)" }}>
          ✏️ Modifier
        </button>
        <button onClick={() => onDelete(f.id)} style={{ background: "#FEF2F2", border: "none", borderRadius: "0.5rem", padding: "0.4rem 0.75rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, color: "#DC2626" }}>
          🗑
        </button>
      </div>
    </div>
  );
}

/* Modal "Ajouter une formation" */
function ModalFormation({ onClose, onSave }) {
  const [form, setForm] = useState({ titre: "", duree: "", places: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "1rem",
    }}>
      <div style={{
        background: "white", borderRadius: "1.5rem", width: "100%", maxWidth: 460,
        padding: "2rem", boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        animation: "fadeUp 0.25s ease both",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontWeight: 900, fontSize: "1.1rem", color: "#071F15", margin: 0 }}>➕ Ajouter une formation</h3>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: "0.95rem", color: "#6B7280" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { key: "titre",  label: "Titre de la formation *", ph: "Ex: BTS Génie Civil"      },
            { key: "duree",  label: "Durée *",                  ph: "Ex: 2 ans, 6 mois…"       },
            { key: "places", label: "Nombre de places *",       ph: "Ex: 25", type: "number"   },
          ].map(({ key, label, ph, type }) => (
            <div key={key}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#0D3B2E", marginBottom: "0.35rem" }}>{label}</label>
              <input type={type || "text"} className="input" placeholder={ph}
                value={form[key]} onChange={e => set(key, e.target.value)} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.65rem", marginTop: "1.5rem" }}>
          <button className="btn-gold" style={{ flex: 1 }}
            onClick={() => { if (form.titre && form.duree && form.places) { onSave(form); onClose(); } }}>
            Ajouter la formation
          </button>
          <button className="btn-ghost" onClick={onClose} style={{ flex: "0 0 auto" }}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

/* Modal "Modifier la bannière" */
function ModalBanniere({ onClose }) {
  const [nom,  setNom]  = useState(MON_PROFIL.nom);
  const [desc, setDesc] = useState(MON_PROFIL.description);
  const [saved, setSaved] = useState(false);

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "1rem",
    }}>
      <div style={{
        background: "white", borderRadius: "1.5rem", width: "100%", maxWidth: 480,
        padding: "2rem", boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        animation: "fadeUp 0.25s ease both",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontWeight: 900, fontSize: "1.1rem", color: "#071F15", margin: 0 }}>✏️ Modifier ma bannière</h3>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: "0.95rem", color: "#6B7280" }}>✕</button>
        </div>

        {saved ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✅</div>
            <div style={{ fontWeight: 800, color: "#0D3B2E", fontSize: "1.05rem" }}>Bannière mise à jour !</div>
            <div style={{ color: "var(--t3,#7A9186)", fontSize: "0.87rem", marginTop: "0.3rem" }}>Visible dans le fil vidéo dans quelques instants.</div>
            <button className="btn-gold" style={{ marginTop: "1.25rem" }} onClick={onClose}>Fermer</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#0D3B2E", marginBottom: "0.35rem" }}>Nom de l&apos;établissement</label>
                <input className="input" value={nom} onChange={e => setNom(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#0D3B2E", marginBottom: "0.35rem" }}>Description (affichée dans le fil)</label>
                <textarea className="input" rows={4} value={desc} onChange={e => setDesc(e.target.value)}
                  style={{ resize: "vertical", fontFamily: "inherit" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#0D3B2E", marginBottom: "0.35rem" }}>Logo / Icône</label>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {["🏫","🏗️","💼","🎓","🏭","📡","🌍","⚙️"].map(e => (
                    <button key={e} style={{ fontSize: "1.5rem", padding: "0.4rem 0.6rem", borderRadius: "0.5rem", border: "1.5px solid var(--border,#E5E9E7)", cursor: "pointer", background: "white", transition: "border-color 0.15s" }}
                      onMouseEnter={ev => ev.currentTarget.style.borderColor = "#1B6B47"}
                      onMouseLeave={ev => ev.currentTarget.style.borderColor = "#E5E9E7"}
                    >{e}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.65rem", marginTop: "1.5rem" }}>
              <button className="btn-gold" style={{ flex: 1 }} onClick={() => setSaved(true)}>
                Enregistrer les modifications
              </button>
              <button className="btn-ghost" onClick={onClose}>Annuler</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE PRINCIPALE — PARTENAIRES DASHBOARD
═══════════════════════════════════════════════════ */
export default function PartenairesDashboard() {
  const [formations,    setFormations]    = useState(FORMATIONS_INITIALES);
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalBanOpen,  setModalBanOpen]  = useState(false);
  const [periode,       setPeriode]       = useState("7j");
  const [inscriModal,   setInscriModal]   = useState(false);

  const addFormation = (f) => {
    setFormations(prev => [...prev, {
      id: Date.now(), titre: f.titre, duree: f.duree,
      places: Number(f.places), inscrits: 0, status: "draft",
    }]);
  };
  const deleteFormation = (id) => setFormations(prev => prev.filter(f => f.id !== id));

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F2", fontFamily: "Inter, sans-serif" }}>
      <Navbar onInscription={() => setInscriModal(true)} />

      {/* ══ HERO HEADER ════════════════════════════ */}
      <div style={{
        background: "linear-gradient(135deg, #071F15 0%, #0D3B2E 40%, #1B6B47 100%)",
        padding: "3rem 1.5rem 4rem", position: "relative", overflow: "hidden",
      }}>
        {/* Décorations */}
        {[["-80px","-80px",320],["auto","-60px",200,"-60px"]].map(([t,r,s,b],i) => (
          <div key={i} style={{ position:"absolute", top:t, right:r, bottom:b, width:s, height:s, borderRadius:"50%", background:"rgba(240,192,64,0.06)", pointerEvents:"none" }}/>
        ))}

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          {/* Breadcrumb */}
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", marginBottom: "1rem" }}>
            <a href="/" style={{ color: "inherit", textDecoration: "none" }}>TalentProof</a>
            {" / "}
            <span style={{ color: "#F0C040" }}>Espace Partenaires</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              {/* Badge Premium */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: "0.85rem" }}>
                <span style={{
                  background: "linear-gradient(135deg,#C9960F,#F0C040)", color: "#3D1C00",
                  fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.8px",
                  padding: "4px 12px", borderRadius: "99px",
                  boxShadow: "0 2px 12px rgba(201,150,15,0.5)",
                }}>✦ PARTENAIRE OFFICIEL</span>
              </div>

              <h1 style={{ color: "white", fontWeight: 900, fontSize: "clamp(1.5rem,3vw,2.1rem)", margin: "0 0 0.4rem", lineHeight: 1.2 }}>
                Bienvenue, <span style={{ color: "#F0C040" }}>{MON_PROFIL.nom}</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.9rem", margin: 0 }}>
                {MON_PROFIL.soustitre} · {MON_PROFIL.ville} {MON_PROFIL.pays}
              </p>
            </div>

            {/* Actions rapides */}
            <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
              <button className="btn-gold" style={{ fontSize: "0.88rem" }} onClick={() => setModalBanOpen(true)}>
                ✏️ Modifier ma bannière
              </button>
              <button className="btn-ghost" style={{ color: "rgba(255,255,255,0.75)", borderColor: "rgba(255,255,255,0.25)", fontSize: "0.88rem" }}
                onClick={() => setModalFormOpen(true)}>
                ➕ Ajouter une formation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CONTENU PRINCIPAL ══════════════════════ */}
      <div style={{ maxWidth: 1100, margin: "-1.75rem auto 0", padding: "0 1.5rem 3rem", position: "relative" }}>

        {/* ── Sélecteur période ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", background: "white", borderRadius: "99px", border: "1px solid var(--border,#E5E9E7)", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {["7j","30j","90j"].map(p => (
              <button key={p} onClick={() => setPeriode(p)} style={{
                padding: "0.4rem 1rem", border: "none", cursor: "pointer", fontSize: "0.82rem",
                fontWeight: 600, background: periode === p ? "#0D3B2E" : "transparent",
                color: periode === p ? "white" : "var(--t3,#7A9186)",
                transition: "background 0.15s",
              }}>
                {p === "7j" ? "7 jours" : p === "30j" ? "30 jours" : "90 jours"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grille de stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {STATS_SEMAINE.map(s => <StatCard key={s.label} stat={s} />)}
        </div>

        {/* ── Graphique ── */}
        <MiniChart />

        <GoldDivider />

        {/* ── Ma Promotion (preview carte dans le fil) ── */}
        <SectionTitle
          icon="📢"
          title="Ma Promotion dans le Fil Vidéo"
          subtitle="Voici exactement à quoi ressemble votre carte vue par les talents et recruteurs."
        />

        <div style={{ maxWidth: 540, marginBottom: "1.25rem" }}>
          <PartnerCard partenaire={MON_PROFIL} />
        </div>

        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <button className="btn-gold" style={{ fontSize: "0.88rem" }} onClick={() => setModalBanOpen(true)}>
            ✏️ Modifier ma bannière
          </button>
          <a href="/" style={{
            fontSize: "0.88rem", padding: "0.6rem 1.25rem", borderRadius: "99px",
            background: "white", color: "#1B6B47", border: "1.5px solid #1B6B47",
            textDecoration: "none", fontWeight: 700, display: "inline-block",
          }}>
            👁️ Voir dans le fil public
          </a>
        </div>

        <GoldDivider />

        {/* ── Mes formations ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
          <SectionTitle
            icon="🎓"
            title="Mes Formations"
            subtitle={`${formations.length} formation${formations.length > 1 ? "s" : ""} configurée${formations.length > 1 ? "s" : ""}`}
          />
          <button className="btn-gold" style={{ fontSize: "0.85rem", marginBottom: "1.25rem" }}
            onClick={() => setModalFormOpen(true)}>
            ➕ Ajouter une formation
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {formations.map(f => (
            <FormationRow key={f.id} f={f} onDelete={deleteFormation} />
          ))}
          {formations.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--t3,#7A9186)", background: "white", borderRadius: "1rem", border: "1px dashed var(--border,#E5E9E7)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</div>
              <div style={{ fontWeight: 600 }}>Aucune formation configurée</div>
              <button className="btn-gold" style={{ marginTop: "0.85rem", fontSize: "0.85rem" }}
                onClick={() => setModalFormOpen(true)}>
                Ajouter ma première formation
              </button>
            </div>
          )}
        </div>

        <GoldDivider />

        {/* ── Conseils Premium ── */}
        <SectionTitle icon="💡" title="Conseils pour maximiser votre visibilité" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: "0.85rem" }}>
          {[
            { icon: "🎯", titre: "Complétez vos stats",       texte: "Les partenaires avec 3 statistiques renseignées reçoivent 2× plus de clics." },
            { icon: "📸", titre: "Ajoutez des photos",         texte: "Une bannière avec photo de campus augmente l'engagement de 40%." },
            { icon: "🕐", titre: "Publiez le jeudi",           texte: "Le fil enregistre le plus grand trafic le jeudi entre 18h et 21h." },
            { icon: "🔗", titre: "Liez votre site web",        texte: "Les profils avec lien externe convertissent 3× mieux." },
          ].map(({ icon, titre, texte }) => (
            <div key={titre} style={{
              background: "white", borderRadius: "0.85rem", padding: "1.1rem",
              border: "1px solid var(--border,#E5E9E7)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontSize: "1.4rem", marginBottom: "0.45rem" }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0D3B2E", marginBottom: "0.3rem" }}>{titre}</div>
              <div style={{ color: "var(--t3,#7A9186)", fontSize: "0.8rem", lineHeight: 1.6 }}>{texte}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ MODALS ════════════════════════════════ */}
      {modalFormOpen && <ModalFormation onClose={() => setModalFormOpen(false)} onSave={addFormation} />}
      {modalBanOpen  && <ModalBanniere  onClose={() => setModalBanOpen(false)} />}
    </div>
  );
}
