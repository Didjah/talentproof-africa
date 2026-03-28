"use client";
import { useState } from "react";

/* ══════════════════════════════════════════════════
   CARTE PARTENAIRE / SPONSORISÉE
   Deux thèmes : "formation" (vert doré) | "entreprise" (bleu nuit doré)
══════════════════════════════════════════════════ */

const THEMES = {
  formation: {
    bg:      "linear-gradient(135deg, #0D3B2E 0%, #1B6B47 55%, #2D9966 100%)",
    badge:   { bg: "linear-gradient(135deg, #C9960F, #F0C040)", color: "#3D1C00" },
    stat:    { color: "#F0C040" },
    cta1:    { bg: "linear-gradient(135deg, #C9960F, #F0C040)", color: "#0D3B2E" },
    cta2:    { bg: "transparent", color: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(255,255,255,0.35)" },
    shine:   "rgba(240,192,64,0.07)",
  },
  entreprise: {
    bg:      "linear-gradient(135deg, #0F172A 0%, #1E3A5F 55%, #1D4ED8 100%)",
    badge:   { bg: "linear-gradient(135deg, #F59E0B, #FCD34D)", color: "#1C1917" },
    stat:    { color: "#FCD34D" },
    cta1:    { bg: "linear-gradient(135deg, #F59E0B, #FCD34D)", color: "#0F172A" },
    cta2:    { bg: "transparent", color: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(255,255,255,0.3)" },
    shine:   "rgba(252,211,77,0.06)",
  },
};

export default function PartnerCard({ partenaire }) {
  const [expanded, setExpanded] = useState(false);
  const theme = THEMES[partenaire.theme] || THEMES.formation;

  return (
    <article className="card-enter" style={{
      borderRadius: "var(--radius-card)", overflow: "hidden",
      boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
      position: "relative",
    }}>
      {/* ── Fond principal ── */}
      <div style={{ background: theme.bg, padding: "1.5rem" }}>

        {/* Effet brillance décoratif */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 280, height: 280, borderRadius: "50%",
          background: theme.shine, pointerEvents: "none",
        }}/>
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 200, height: 200, borderRadius: "50%",
          background: theme.shine, pointerEvents: "none",
        }}/>

        {/* ── Header : badge + logo ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {/* Badge PARTENAIRE OFFICIEL / PROMOTION */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: theme.badge.bg, color: theme.badge.color,
              fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.8px",
              padding: "3px 10px", borderRadius: "99px",
              boxShadow: "0 2px 10px rgba(201,150,15,0.4)",
              width: "fit-content",
            }}>
              ✦ {partenaire.badge}
            </span>
            {/* Label "Sponsorisé" discret */}
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.68rem", letterSpacing: "0.3px" }}>
              Sponsorisé
            </span>
          </div>

          {/* Logo entreprise */}
          <div style={{
            width: 52, height: 52, borderRadius: "0.85rem",
            background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.75rem",
          }}>
            {partenaire.logo}
          </div>
        </div>

        {/* ── Nom & Localisation ── */}
        <div style={{ position: "relative", marginBottom: "0.75rem" }}>
          <h3 style={{ color: "white", fontWeight: 900, fontSize: "1.15rem", margin: 0, lineHeight: 1.25 }}>
            {partenaire.nom}
          </h3>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", marginTop: "0.2rem" }}>
            {partenaire.soustitre}
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", marginTop: "0.15rem" }}>
            📍 {partenaire.ville} {partenaire.pays}
          </div>
        </div>

        {/* ── Description ── */}
        <p style={{
          color: "rgba(255,255,255,0.78)", fontSize: "0.88rem", lineHeight: 1.7,
          position: "relative", marginBottom: "1.25rem",
        }}>
          {expanded ? partenaire.description : partenaire.description.slice(0, 110) + (partenaire.description.length > 110 ? "…" : "")}
          {partenaire.description.length > 110 && (
            <button onClick={() => setExpanded(e => !e)} style={{
              background: "none", border: "none", color: theme.stat.color,
              fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", marginLeft: "0.35rem",
            }}>
              {expanded ? "Moins ▲" : "Lire plus ▼"}
            </button>
          )}
        </p>

        {/* ── Stats en ligne ── */}
        <div style={{
          display: "flex", gap: "0", marginBottom: "1.25rem",
          background: "rgba(0,0,0,0.2)", borderRadius: "0.75rem", overflow: "hidden",
          position: "relative",
        }}>
          {partenaire.stats.map(({ val, lbl }, i) => (
            <div key={lbl} style={{
              flex: 1, textAlign: "center", padding: "0.75rem 0.5rem",
              borderRight: i < partenaire.stats.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}>
              <div style={{ color: theme.stat.color, fontWeight: 900, fontSize: "1.1rem" }}>{val}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.73rem", marginTop: "1px" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* ── Boutons CTA ── */}
        <div style={{ display: "flex", gap: "0.65rem", position: "relative", flexWrap: "wrap" }}>
          <a href={partenaire.cta1.href} style={{
            flex: "1 1 auto", textAlign: "center", textDecoration: "none",
            background: theme.cta1.bg, color: theme.cta1.color,
            fontWeight: 800, fontSize: "0.88rem", borderRadius: "99px",
            padding: "0.7rem 1.25rem",
            boxShadow: "0 4px 16px rgba(201,150,15,0.35)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(201,150,15,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 4px 16px rgba(201,150,15,0.35)"; }}
          >
            {partenaire.cta1.label} →
          </a>
          <a href={partenaire.cta2.href} style={{
            flex: "1 1 auto", textAlign: "center", textDecoration: "none",
            background: theme.cta2.bg, color: theme.cta2.color,
            fontWeight: 600, fontSize: "0.88rem", borderRadius: "99px",
            padding: "0.7rem 1.25rem",
            border: theme.cta2.border,
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            💬 {partenaire.cta2.label}
          </a>
        </div>
      </div>
    </article>
  );
}
