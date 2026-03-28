"use client";
import { useState } from "react";
import { waTalentProof } from "../../utils/whatsapp";

const WA_CONSEILLER = waTalentProof("j'ai besoin d'aide pour mon inscription sur TalentProof.");

export default function FloatingHelp() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", right: "1.5rem",
      zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.6rem",
    }}>
      {/* Menu déroulant */}
      {open && (
        <div className="float-pop" style={{
          background: "var(--surface)", borderRadius: "1rem",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          border: "1px solid var(--border)",
          overflow: "hidden", minWidth: 230,
        }}>
          {/* En-tête */}
          <div style={{
            background: "linear-gradient(135deg,#075E54,#128C7E)",
            padding: "0.85rem 1rem",
          }}>
            <div style={{ color: "white", fontWeight: 800, fontSize: "0.92rem" }}>
              💬 Besoin d&apos;aide ?
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", marginTop: "2px" }}>
              On est là pour toi 🙌
            </div>
          </div>

          {/* Options */}
          <div style={{ padding: "0.5rem" }}>
            <a
              href={WA_CONSEILLER}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.75rem 0.85rem", borderRadius: "0.65rem",
                textDecoration: "none", transition: "background 0.12s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--g100)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{
                width: 38, height: 38, borderRadius: "0.65rem", flexShrink: 0,
                background: "#DCF8C6", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.2rem",
              }}>💬</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--t1)" }}>
                  Parler à un conseiller
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--t3)" }}>
                  Réponse en quelques minutes
                </div>
              </div>
            </a>

            <a
              href="/guide-whatsapp"
              onClick={() => setOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.75rem 0.85rem", borderRadius: "0.65rem",
                textDecoration: "none", transition: "background 0.12s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--g100)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{
                width: 38, height: 38, borderRadius: "0.65rem", flexShrink: 0,
                background: "var(--g100)", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.2rem",
              }}>📖</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--t1)" }}>
                  Voir le guide d&apos;inscription
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--t3)" }}>
                  Inscription via WhatsApp, étape par étape
                </div>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Bouton principal */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 58, height: 58, borderRadius: "50%",
          background: open
            ? "linear-gradient(135deg,#075E54,#128C7E)"
            : "linear-gradient(135deg,#25D366,#128C7E)",
          border: "none", cursor: "pointer", color: "white",
          fontSize: open ? "1.4rem" : "1.6rem",
          boxShadow: "0 4px 24px rgba(37,211,102,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.18s, background 0.18s",
          transform: open ? "rotate(45deg) scale(1.05)" : "scale(1)",
        }}
        aria-label="Besoin d'aide ?"
      >
        {open ? "✕" : "?"}
      </button>
    </div>
  );
}
