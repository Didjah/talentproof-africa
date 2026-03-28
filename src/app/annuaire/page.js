"use client";
import { useState, useMemo } from "react";
import Navbar from "../../components/layout/Navbar";
import FloatingHelp from "../../components/layout/FloatingHelp";
import { InscriptionModal } from "../../components/feed/Modals";
import { PROFILS_ANNUAIRE, metiersOf } from "../../data/profiles";
import { waLink, waShare, waTalentProof } from "../../utils/whatsapp";

const DISPO_COLOR = { immediate: "#16A34A", "1_month": "#D97706", negotiable: "#6B7280" };
const DISPO_LABEL = { immediate: "Disponible maintenant", "1_month": "Dispo dans 1 mois", negotiable: "À négocier" };

/* ── Badge document ── */
function DocBadge({ docLabel, issuedBy, issuedYear }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        background: "#FFFBEB", border: "1px solid #F0C04060",
        borderRadius: "0.6rem", padding: "0.45rem 0.85rem",
        cursor: "pointer", transition: "background 0.15s",
      }}>
        <span style={{ fontSize: "1rem" }}>📜</span>
        <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#78450A" }}>
          {docLabel}
        </span>
        <span style={{ color: "#A0671A", fontSize: "0.78rem", marginLeft: "auto" }}>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div style={{
          background: "#FFFBEB", border: "1px solid #F0C04040",
          borderTop: "none", borderRadius: "0 0 0.6rem 0.6rem",
          padding: "0.65rem 0.85rem", fontSize: "0.8rem", color: "#78450A",
        }}>
          <div><strong>Émis par :</strong> {issuedBy}</div>
          {issuedYear && <div><strong>Année :</strong> {issuedYear}</div>}
          <button style={{
            marginTop: "0.5rem", background: "var(--g700)", color: "white",
            border: "none", borderRadius: "99px", padding: "0.35rem 1rem",
            fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
          }}>
            Télécharger
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Barre d'expérience ── */
function ExpBar({ years, max = 15 }) {
  const pct = Math.min(100, (years / max) * 100);
  const label = years >= 10 ? "Expert" : years >= 5 ? "Confirmé" : "Junior";
  const color = years >= 10 ? "#D97706" : years >= 5 ? "var(--g700)" : "#2563EB";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--t3)", fontWeight: 500 }}>
          {years} ans d&apos;expérience
        </span>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color }}>{label}</span>
      </div>
      <div style={{ background: "var(--border)", borderRadius: "99px", height: "5px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "99px", transition: "width 0.6s" }}/>
      </div>
    </div>
  );
}

/* ── Carte Moovijob ── */
function AnnuaireCard({ profil, onContact, index }) {
  const hasCert = profil.hasDoc;
  const hasVid  = profil.hasVideo;
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(profil.likes || 0);

  const handleLike = () => {
    setLiked(l => !l);
    setLikes(n => liked ? n - 1 : n + 1);
  };

  return (
    <article className="card-enter" style={{
      animationDelay: `${index * 0.05}s`,
      background: "var(--surface)", borderRadius: "0.85rem",
      boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
      padding: 0, overflow: "hidden",
      transition: "box-shadow 0.2s, transform 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* ── Bande gauche colorée ── */}
      <div style={{ display: "flex" }}>
        <div style={{
          width: 5, flexShrink: 0,
          background: hasCert
            ? "linear-gradient(180deg, var(--gold), var(--gold-lt))"
            : "linear-gradient(180deg, var(--g500), var(--g700))",
        }}/>

        <div style={{ flex: 1, padding: "1.1rem 1.25rem" }}>
          {/* ── Header ── */}
          <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start", marginBottom: "0.85rem" }}>
            {/* Avatar */}
            <div style={{
              width: 52, height: 52, borderRadius: "0.75rem", flexShrink: 0,
              background: hasCert
                ? "linear-gradient(135deg,#78450A,#C9960F)"
                : "linear-gradient(135deg, var(--g800), var(--g600,#2D9966))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>{profil.avatar}</div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--t1)" }}>{profil.nom}</span>
                {profil.fromWhatsApp && <span className="badge-whatsapp">📱 WhatsApp</span>}
                {hasCert && <span style={{
                  background: "linear-gradient(135deg,var(--gold),var(--gold-lt))",
                  color: "#5C3A00", fontSize: "0.7rem", fontWeight: 800,
                  padding: "2px 8px", borderRadius: "99px",
                }}>✦ CERTIFIÉ</span>}
                {hasVid && !hasCert && <span style={{
                  background: "#EDE9FE", color: "#5B21B6",
                  fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "99px",
                }}>🎥 Vidéo dispo</span>}
                {!hasCert && !hasVid && <span style={{
                  background: "#F3F4F6", color: "#9CA3AF",
                  fontSize: "0.7rem", fontWeight: 600, padding: "2px 8px", borderRadius: "99px",
                }}>Profil simple</span>}
              </div>
              <div style={{ fontWeight: 700, color: "var(--g700)", fontSize: "0.88rem", marginTop: "0.1rem" }}>
                {profil.metier}
              </div>
              <div style={{ display: "flex", gap: "1rem", color: "var(--t3)", fontSize: "0.8rem", marginTop: "0.2rem", flexWrap: "wrap" }}>
                <span>📍 {profil.ville} {profil.pays}</span>
                <span style={{ color: DISPO_COLOR[profil.disponible], fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: DISPO_COLOR[profil.disponible], display: "inline-block" }}/>
                  {DISPO_LABEL[profil.disponible]}
                </span>
              </div>
            </div>
          </div>

          {/* ── Barre expérience ── */}
          <div style={{ marginBottom: "0.85rem" }}>
            <ExpBar years={profil.experience} />
          </div>

          {/* ── Tags ── */}
          {profil.tags?.length > 0 && (
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
              {profil.tags.map(t => (
                <span key={t} style={{
                  background: "var(--g100)", color: "var(--g700)",
                  fontSize: "0.75rem", fontWeight: 600,
                  padding: "0.2rem 0.65rem", borderRadius: "99px",
                }}>{t}</span>
              ))}
            </div>
          )}

          {/* ── Bio ── */}
          <p style={{ color: "var(--t2)", fontSize: "0.87rem", lineHeight: 1.65, marginBottom: "0.85rem" }}>
            {profil.bio}
          </p>

          {/* ── Document (si certifié) ── */}
          {hasCert && (
            <div style={{ marginBottom: "0.85rem" }}>
              <DocBadge docLabel={profil.docLabel} issuedBy={profil.issuedBy} issuedYear={profil.issuedYear} />
            </div>
          )}

          {/* ── Pas de preuve → encouragement ── */}
          {!hasCert && !hasVid && (
            <div style={{
              background: "#FFF7ED", border: "1px dashed #FCD34D",
              borderRadius: "0.6rem", padding: "0.6rem 0.85rem",
              fontSize: "0.8rem", color: "#92400E", marginBottom: "0.85rem",
            }}>
              💡 Ce talent n&apos;a pas encore ajouté de preuve. Contacte-le directement.
            </div>
          )}

          {/* ── Actions ── */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            {/* Contacter (message personnalisé) */}
            <button className="btn-primary" style={{ fontSize: "0.83rem", padding: "0.5rem 1.1rem" }}
              onClick={onContact}>
              💬 Contacter
            </button>
            {hasVid && (
              <button className="btn-ghost" style={{ fontSize: "0.83rem", padding: "0.5rem 1rem" }}>
                🎥 Voir la vidéo
              </button>
            )}
            {/* Partager le profil sur WhatsApp */}
            <a href={waShare(profil.nom, profil.metier, profil.ville)}
              target="_blank" rel="noreferrer"
              title="Partager ce profil"
              style={{
                padding: "0.5rem 0.85rem", borderRadius: "99px", textDecoration: "none",
                background: "#DCF8C6", color: "#075E54", fontWeight: 700, fontSize: "0.8rem",
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                border: "1.5px solid #b7e4a0",
              }}>
              ↗ Partager
            </a>
            {/* Appel direct */}
            {profil.phone && (
              <a href={`tel:+${profil.phone}`}
                title={`Appeler ${profil.nom}`}
                style={{
                  padding: "0.5rem 0.75rem", borderRadius: "99px", textDecoration: "none",
                  background: "#EFF6FF", color: "#1D4ED8", fontWeight: 700, fontSize: "1rem",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  border: "1.5px solid #BFDBFE",
                }}>
                📞
              </a>
            )}
            {/* Like */}
            <button
              onClick={handleLike}
              style={{
                padding: "0.5rem 0.75rem", borderRadius: "99px", border: "1.5px solid",
                borderColor: liked ? "#FDA4AF" : "var(--border)",
                background: liked ? "#FFF1F2" : "transparent",
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem",
                fontSize: "0.82rem", fontWeight: 700,
                color: liked ? "#E11D48" : "var(--t3)",
                transition: "all 0.15s",
              }}
            >
              {liked ? "❤️" : "🤍"} {likes}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Stats résumé ── */
function StatsBar({ profils }) {
  const certifies = profils.filter(p => p.hasDoc).length;
  const avecVideo = profils.filter(p => p.hasVideo).length;
  const dispos    = profils.filter(p => p.disponible === "immediate").length;
  return (
    <div style={{
      display: "flex", gap: "1rem", flexWrap: "wrap",
      background: "var(--surface)", borderRadius: "var(--radius-card)",
      padding: "1rem 1.5rem", marginBottom: "1.25rem",
      boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
    }}>
      {[
        { val: profils.length, lbl: "profils total",       color: "var(--t1)" },
        { val: certifies,      lbl: "✦ certifiés",          color: "var(--gold)" },
        { val: avecVideo,      lbl: "🎥 avec vidéo",        color: "#5B21B6" },
        { val: dispos,         lbl: "disponibles maintenant",color: "#16A34A" },
      ].map(({ val, lbl, color }) => (
        <div key={lbl} style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
          <span style={{ fontWeight: 800, fontSize: "1.25rem", color }}>{val}</span>
          <span style={{ color: "var(--t3)", fontSize: "0.82rem" }}>{lbl}</span>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════
   PAGE ANNUAIRE
════════════════════════════════════════════════ */
export default function AnnuairePage() {
  const [metier,      setMetier]      = useState("Tous");
  const [search,      setSearch]      = useState("");
  const [dispOnly,    setDispOnly]    = useState(false);
  const [certOnly,    setCertOnly]    = useState(false);
  const [inscriModal, setInscriModal] = useState(false);
  const [toast,       setToast]       = useState(null);

  const METIERS = metiersOf(PROFILS_ANNUAIRE);

  const profils = useMemo(() => PROFILS_ANNUAIRE.filter(p => {
    if (metier !== "Tous" && p.metier !== metier) return false;
    if (dispOnly && p.disponible !== "immediate") return false;
    if (certOnly && !p.hasDoc) return false;
    if (search && !`${p.nom} ${p.metier} ${p.ville} ${p.tags?.join(" ")}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [metier, search, dispOnly, certOnly]);

  const contact = (p) => {
    window.open(waLink(p.nom, p.metier, p.phone), "_blank", "noreferrer");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar onInscription={() => setInscriModal(true)} />

      {/* ── En-tête page ── */}
      <div style={{
        background: "linear-gradient(135deg, #3D1C00 0%, #78450A 100%)",
        padding: "2.5rem 1.25rem",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ color: "#F0C040", fontWeight: 800, fontSize: "clamp(1.3rem, 3vw, 1.75rem)", marginBottom: "0.3rem" }}>
                🎓 Annuaire des Diplômés & Certifiés
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", maxWidth: 540, lineHeight: 1.6 }}>
                Travailleurs avec diplômes, certificats ou attestations professionnelles.
                Style sobre, expérience au premier plan.
              </p>
            </div>
            <a href="/" style={{
              color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.25)", borderRadius: "99px",
              padding: "0.45rem 1.1rem", fontWeight: 600, flexShrink: 0,
            }}>
              🎥 Voir le Fil Vidéo →
            </a>
          </div>
        </div>
      </div>

      {/* ── Filtres ── */}
      <div style={{
        background: "var(--surface)", borderBottom: "1px solid var(--border)",
        padding: "0.85rem 1.25rem",
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>

          {/* Recherche */}
          <div style={{
            flex: "1 1 220px", background: "#F9FAFB", border: "1.5px solid var(--border)",
            borderRadius: "99px", display: "flex", alignItems: "center",
            padding: "0 0.9rem", height: 38,
          }}>
            <span style={{ color: "var(--t3)", marginRight: "0.4rem", fontSize: "0.85rem" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Nom, métier, ville, compétence…"
              style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.88rem", width: "100%", color: "var(--t1)" }}
            />
          </div>

          {/* Sélect métier */}
          <select value={metier} onChange={e => setMetier(e.target.value)} style={{
            border: "1.5px solid var(--border)", borderRadius: "99px",
            padding: "0.4rem 1rem", fontSize: "0.88rem", fontWeight: 600,
            background: "white", color: "var(--t1)", cursor: "pointer", outline: "none",
          }}>
            {METIERS.map(m => <option key={m}>{m}</option>)}
          </select>

          {/* Toggles */}
          {[
            { label: "✦ Certifiés seulement", val: certOnly, set: setCertOnly },
            { label: "⚡ Disponibles maintenant", val: dispOnly, set: setDispOnly },
          ].map(({ label, val, set }) => (
            <button key={label} onClick={() => set(v => !v)} style={{
              padding: "0.4rem 1rem", borderRadius: "99px", fontSize: "0.83rem",
              fontWeight: 600, cursor: "pointer", border: "1.5px solid",
              borderColor: val ? "var(--g700)" : "var(--border)",
              background: val ? "var(--g100)" : "white",
              color: val ? "var(--g700)" : "var(--t2)",
              transition: "all 0.15s",
            }}>{label} {val ? "✓" : ""}</button>
          ))}

          {(metier !== "Tous" || search || certOnly || dispOnly) && (
            <button onClick={() => { setMetier("Tous"); setSearch(""); setCertOnly(false); setDispOnly(false); }} style={{
              padding: "0.4rem 0.9rem", borderRadius: "99px", fontSize: "0.82rem",
              border: "1.5px solid #FCA5A5", background: "#FEF2F2", color: "#DC2626", cursor: "pointer", fontWeight: 600,
            }}>✕ Effacer</button>
          )}
        </div>
      </div>

      {/* ── Corps ── */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "1.5rem 1.25rem" }}>
        <StatsBar profils={profils} />

        {profils.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--t3)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔍</div>
            <div style={{ fontWeight: 700, color: "var(--t2)" }}>Aucun profil trouvé.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {profils.map((p, i) => (
              <AnnuaireCard key={p.id} profil={p} index={i} onContact={() => contact(p)} />
            ))}
          </div>
        )}

        {/* CTA bas */}
        <div style={{
          marginTop: "2rem", background: "var(--surface)", borderRadius: "var(--radius-card)",
          padding: "1.75rem", textAlign: "center", border: "1px solid var(--border)",
        }}>
          <div style={{ fontWeight: 800, color: "var(--t1)", fontSize: "0.98rem", marginBottom: "0.4rem" }}>
            Tu as un diplôme ou un certificat ?
          </div>
          <div style={{ color: "var(--t3)", fontSize: "0.87rem", marginBottom: "1rem" }}>
            Rejoins l&apos;annuaire et laisse ton document parler pour toi.
          </div>
          <button className="btn-gold" onClick={() => setInscriModal(true)}>
            + Ajouter mon profil diplômé
          </button>
        </div>
      </div>

      {inscriModal && <InscriptionModal onClose={() => setInscriModal(false)} />}
      <FloatingHelp />

      {toast && (
        <div style={{
          position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
          background: "var(--g800)", color: "white", padding: "0.7rem 1.5rem",
          borderRadius: "99px", fontWeight: 600, fontSize: "0.88rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)", zIndex: 3000,
          animation: "fadeUp 0.25s ease both", whiteSpace: "nowrap",
        }}>💬 Message envoyé à {toast} !</div>
      )}
    </div>
  );
}
