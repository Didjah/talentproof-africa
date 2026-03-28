"use client";
import { useState } from "react";

/* ══════════════════════════════════════════════════
   UTILS
══════════════════════════════════════════════════ */
const DISPO = {
  immediate: { label: "Disponible maintenant", color: "#16A34A" },
  "1_month": { label: "Dispo dans 1 mois",     color: "#D97706" },
  negotiable:{ label: "À négocier",             color: "#6B7280" },
};

function Avatar({ emoji, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg,#1B6B47,#2D9966)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.48, boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    }}>{emoji}</div>
  );
}

function DispoTag({ d }) {
  const info = DISPO[d] || DISPO.negotiable;
  return (
    <span style={{
      fontSize: "0.74rem", fontWeight: 600, color: info.color,
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: info.color, display: "inline-block" }}/>
      {info.label}
    </span>
  );
}

function ActionRow({ profil, onContact }) {
  const [liked, setLiked]   = useState(false);
  const [saved, setSaved]   = useState(false);
  return (
    <div style={{
      display: "flex", gap: "0.5rem", marginTop: "1rem",
      paddingTop: "0.85rem", borderTop: "1px solid var(--border)",
      flexWrap: "wrap",
    }}>
      <button className="btn-gold" style={{ flex: "1 1 auto", padding: "0.6rem 1rem", fontSize: "0.85rem" }}
        onClick={onContact}>
        💬 Contacter
      </button>
      <button className="btn-ghost" style={{ padding: "0.6rem 0.9rem" }}
        onClick={() => setLiked(l => !l)}>
        {liked ? "❤️" : "🤍"}
      </button>
      <button className="btn-ghost" style={{ padding: "0.6rem 0.9rem" }}
        onClick={() => setSaved(s => !s)}>
        {saved ? "🔖" : "📌"}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   TYPE 1 — CERTIFIÉ  (diplôme/certificat disponible)
   → Badge doré "Certifié", aperçu document cliquable
══════════════════════════════════════════════════ */
export function CardCertifie({ profil, onContact, onWatch }) {
  const [docOpen, setDocOpen] = useState(false);

  return (
    <article className="card-enter" style={{
      background: "var(--surface)", borderRadius: "var(--radius-card)",
      boxShadow: "var(--shadow-sm)", overflow: "hidden",
      border: "1.5px solid #F0C04040",
    }}>
      {/* Bandeau doré */}
      <div style={{
        background: "linear-gradient(135deg,#5C3A00 0%,#8B5E00 50%,#5C3A00 100%)",
        padding: "0.6rem 1.25rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span className="badge-certified">✦ CERTIFIÉ</span>
        <span style={{ color: "rgba(255,220,100,0.75)", fontSize: "0.78rem" }}>
          Document vérifié
        </span>
      </div>

      <div style={{ padding: "1.25rem" }}>
        {/* Header profil */}
        <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start", marginBottom: "0.9rem" }}>
          <Avatar emoji={profil.avatar} size={50} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--t1)" }}>{profil.nom}</span>
            </div>
            <div style={{ color: "var(--gold)", fontWeight: 700, fontSize: "0.88rem" }}>
              {profil.metier} · {profil.experience} ans d&apos;exp.
            </div>
            <div style={{ color: "var(--t3)", fontSize: "0.82rem", marginTop: "1px" }}>
              📍 {profil.ville} {profil.pays}
            </div>
          </div>
          <DispoTag d={profil.disponible} />
        </div>

        {/* Bio */}
        <p style={{ color: "var(--t2)", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "1rem" }}>
          {profil.bio}
        </p>

        {/* Aperçu document */}
        <button onClick={() => setDocOpen(d => !d)} style={{
          width: "100%", background: "var(--gold-bg)", border: "1.5px solid #F0C04060",
          borderRadius: "0.75rem", padding: "0.8rem 1rem", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "0.25rem",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.4rem" }}>📜</span>
            <span style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontWeight: 700, fontSize: "0.88rem", color: "#78450A" }}>
                {profil.docLabel || "Diplôme / Certificat disponible"}
              </span>
              <span style={{ fontSize: "0.77rem", color: "#A0671A" }}>
                Clique pour voir le document
              </span>
            </span>
          </span>
          <span style={{ color: "#A0671A", fontWeight: 700 }}>{docOpen ? "▲" : "▼"}</span>
        </button>

        {docOpen && (
          <div style={{
            background: "#FFFBEB", border: "1px solid #F0C04060",
            borderRadius: "0 0 0.75rem 0.75rem", padding: "1rem",
            marginBottom: "0.25rem",
          }}>
            <div style={{ background: "#F9FAFB", borderRadius: "0.5rem", padding: "1.5rem", textAlign: "center", color: "var(--t3)", fontSize: "0.88rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📄</div>
              <div style={{ fontWeight: 600, color: "var(--t2)" }}>{profil.docLabel || "Certificat de compétence"}</div>
              <div style={{ marginTop: "0.25rem" }}>Émis par : {profil.issuedBy || "Institution partenaire"}</div>
              <button className="btn-primary" style={{ marginTop: "0.85rem", fontSize: "0.82rem", padding: "0.5rem 1.2rem" }}>
                Télécharger le document
              </button>
            </div>
          </div>
        )}

        {/* Vidéo si disponible */}
        {profil.hasVideo && (
          <button onClick={onWatch} style={{
            width: "100%", background: "#EDE9FE", border: "1px solid #C4B5FD",
            borderRadius: "0.75rem", padding: "0.65rem 1rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
            cursor: "pointer", marginTop: "0.5rem",
          }}>
            <span style={{ fontSize: "1.2rem" }}>🎥</span>
            <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "#5B21B6" }}>
              Voir aussi la preuve vidéo
            </span>
          </button>
        )}

        <ActionRow profil={profil} onContact={onContact} />
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════════
   TYPE 2 — VIDÉO  (pas de diplôme, vidéo en avant)
   → Grand player 16:9, overlay infos, bouton play
══════════════════════════════════════════════════ */
export function CardVideo({ profil, onContact, onWatch }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article className="card-enter" style={{
      background: "var(--surface)", borderRadius: "var(--radius-card)",
      boxShadow: "var(--shadow-md)", overflow: "hidden",
    }}>
      {/* ── Miniature vidéo 16:9 ── */}
      <div
        style={{ position: "relative", aspectRatio: "16/9", cursor: "pointer", overflow: "hidden" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onWatch}
      >
        {/* Fond dégradé simulant une thumbnail */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, #071F15 0%, #1B6B47 45%, #0D3B2E 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "filter 0.2s",
          filter: hovered ? "brightness(0.75)" : "brightness(1)",
        }}>
          <span style={{ fontSize: "clamp(4rem, 10vw, 6rem)", opacity: 0.35 }}>{profil.avatar}</span>
        </div>

        {/* Bouton Play */}
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.82)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
            transform: hovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.18s, background 0.18s",
          }}>
            <span style={{ fontSize: "1.6rem", marginLeft: 4 }}>▶</span>
          </div>
        </div>

        {/* Durée simulée */}
        <div style={{
          position: "absolute", bottom: "0.6rem", right: "0.75rem",
          background: "rgba(0,0,0,0.75)", color: "white",
          fontSize: "0.75rem", fontWeight: 600, padding: "2px 7px",
          borderRadius: "4px", letterSpacing: "0.3px",
        }}>
          0:60
        </div>

        {/* Badge vidéo */}
        <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
          <span className="badge-video">🎥 Preuve vidéo</span>
        </div>

        {/* Overlay infos bas */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.78))",
          padding: "1.5rem 1rem 0.75rem",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s",
        }}>
          <div style={{ color: "white", fontWeight: 700 }}>{profil.nom}</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.84rem" }}>
            {profil.metier} · {profil.ville} {profil.pays}
          </div>
        </div>
      </div>

      {/* ── Infos sous la vidéo ── */}
      <div style={{ padding: "1.1rem 1.25rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
          <Avatar emoji={profil.avatar} size={42} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: "0.98rem", color: "var(--t1)" }}>{profil.nom}</div>
            <div style={{ color: "var(--g700)", fontWeight: 700, fontSize: "0.85rem" }}>
              {profil.metier} · {profil.experience} ans
            </div>
            <div style={{ color: "var(--t3)", fontSize: "0.8rem" }}>
              📍 {profil.ville} {profil.pays}
            </div>
          </div>
          <DispoTag d={profil.disponible} />
        </div>

        <p style={{ color: "var(--t2)", fontSize: "0.88rem", lineHeight: 1.65, marginTop: "0.75rem" }}>
          {profil.bio}
        </p>

        <ActionRow profil={profil} onContact={onContact} />
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════════
   TYPE 3 — SIMPLE  (pas de vidéo ni diplôme)
   → Style Moovijob : propre, lisible, expérience
══════════════════════════════════════════════════ */
export function CardSimple({ profil, onContact }) {
  return (
    <article className="card-enter" style={{
      background: "var(--surface)", borderRadius: "var(--radius-card)",
      boxShadow: "var(--shadow-sm)",
      border: "1px solid var(--border)",
      padding: "1.25rem",
      display: "flex", gap: "1rem", alignItems: "flex-start",
    }}>
      <Avatar emoji={profil.avatar} size={52} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Ligne 1 */}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.15rem" }}>
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--t1)" }}>{profil.nom}</span>
          <span className="badge-simple">⚠️ Sans preuve</span>
        </div>

        {/* Ligne 2 */}
        <div style={{ fontWeight: 700, color: "var(--g700)", fontSize: "0.88rem" }}>
          {profil.metier}
        </div>

        {/* Ligne 3 */}
        <div style={{
          display: "flex", gap: "1rem", color: "var(--t3)", fontSize: "0.82rem",
          marginTop: "0.25rem", flexWrap: "wrap",
        }}>
          <span>📍 {profil.ville} {profil.pays}</span>
          <span>⏱ {profil.experience} ans d&apos;expérience</span>
          <DispoTag d={profil.disponible} />
        </div>

        {/* Barre d'expérience */}
        <div style={{ marginTop: "0.75rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--t3)", marginBottom: "0.3rem", fontWeight: 500 }}>
            Niveau d&apos;expérience
          </div>
          <div style={{ background: "var(--border)", borderRadius: "99px", height: "5px", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: "99px",
              background: "linear-gradient(90deg, var(--g700), var(--g500))",
              width: `${Math.min(100, (profil.experience / 15) * 100)}%`,
              transition: "width 0.6s ease",
            }}/>
          </div>
        </div>

        {/* Bio */}
        <p style={{ color: "var(--t2)", fontSize: "0.85rem", lineHeight: 1.6, marginTop: "0.7rem" }}>
          {profil.bio}
        </p>

        {/* CTA */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.9rem", flexWrap: "wrap" }}>
          <button className="btn-primary" style={{ fontSize: "0.82rem", padding: "0.5rem 1.1rem" }}
            onClick={onContact}>
            Contacter
          </button>
          <span style={{
            fontSize: "0.78rem", color: "var(--t3)", fontStyle: "italic",
            display: "flex", alignItems: "center",
          }}>
            Pas encore de vidéo · Encourage-le à en ajouter une !
          </span>
        </div>
      </div>
    </article>
  );
}
