"use client";
import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import FloatingHelp from "../../components/layout/FloatingHelp";
import { waTalentProof } from "../../utils/whatsapp";

const STEPS = [
  {
    num: 1,
    icon: "📱",
    title: "Scanne le QR Code",
    desc: "Ouvre l'appareil photo de ton téléphone et pointe-le vers le QR Code. Tu seras redirigé directement vers notre chat WhatsApp.",
    tip: "Pas besoin d'application supplémentaire — WhatsApp s'ouvre automatiquement.",
    color: "#075E54",
    bg: "#DCFCE7",
  },
  {
    num: 2,
    icon: "🎙️",
    title: "Envoie ton nom et ton métier",
    desc: "Appuie sur le micro 🎙️ et dis simplement : « Bonjour, je m'appelle [Ton Nom] et je suis [Ton Métier] à [Ta Ville]. » Tu peux aussi l'écrire en texte simple.",
    tip: "Pas besoin d'écrire parfaitement — notre équipe s'occupe de tout.",
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
  {
    num: 3,
    icon: "🔨",
    title: "Choisis ton métier",
    desc: "Réponds avec l'icône qui correspond à ton activité :",
    metiers: [
      { icon: "🔨", label: "Menuisier" },
      { icon: "🚗", label: "Chauffeur" },
      { icon: "🧱", label: "Maçon" },
      { icon: "👗", label: "Couturière" },
      { icon: "🔧", label: "Mécanicien" },
      { icon: "🍳", label: "Cuisinier(e)" },
      { icon: "💻", label: "Développeur(se)" },
      { icon: "⚡", label: "Électricien" },
    ],
    tip: "Tu ne trouves pas ton métier ? Envoie juste son nom, on s'adapte !",
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    num: 4,
    icon: "📸",
    title: "Envoie ta preuve visuelle",
    desc: "Prends une photo ou une courte vidéo (max 60 sec) de ton chantier, atelier, cuisine ou réalisation. Envoie-la directement dans le chat WhatsApp.",
    tip: "Une seule bonne photo suffit. C'est ta preuve — elle parle pour toi !",
    color: "#0D9488",
    bg: "#CCFBF1",
  },
];

function StepCard({ step, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? step.bg : "var(--surface)",
        border: `2px solid ${isActive ? step.color + "60" : "var(--border)"}`,
        borderRadius: "1rem", padding: "1.25rem",
        cursor: "pointer", transition: "all 0.2s",
        boxShadow: isActive ? `0 4px 20px ${step.color}22` : "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        {/* Numéro */}
        <div style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: isActive ? step.color : "var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 900, fontSize: "1.1rem",
          transition: "background 0.2s",
        }}>
          {step.num}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <span style={{ fontSize: "1.3rem" }}>{step.icon}</span>
            <span style={{ fontWeight: 800, fontSize: "0.98rem", color: isActive ? step.color : "var(--t1)" }}>
              {step.title}
            </span>
          </div>

          {isActive && (
            <>
              <p style={{ color: "var(--t2)", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "0.75rem" }}>
                {step.desc}
              </p>

              {/* Grille métiers (étape 3) */}
              {step.metiers && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  {step.metiers.map(m => (
                    <span key={m.label} style={{
                      background: "white", border: `1.5px solid ${step.color}50`,
                      borderRadius: "0.65rem", padding: "0.5rem 0.85rem",
                      fontSize: "0.88rem", fontWeight: 700, color: step.color,
                      display: "flex", alignItems: "center", gap: "0.35rem",
                    }}>
                      {m.icon} {m.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Astuce */}
              <div style={{
                background: "rgba(255,255,255,0.65)", borderRadius: "0.65rem",
                padding: "0.6rem 0.85rem", fontSize: "0.82rem", color: step.color,
                fontWeight: 600, display: "flex", gap: "0.4rem",
              }}>
                💡 {step.tip}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GuideWhatsApp() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg,#075E54 0%,#128C7E 60%,#25D366 100%)",
        padding: "3rem 1.5rem 2.5rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }}/>
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <span style={{
            display: "inline-block", background: "rgba(255,255,255,0.18)",
            color: "white", fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.8px",
            padding: "4px 14px", borderRadius: "99px", marginBottom: "1rem",
          }}>📱 GUIDE D&apos;INSCRIPTION</span>

          <h1 style={{ color: "white", fontWeight: 900, fontSize: "clamp(1.5rem,4vw,2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
            Inscris-toi sur TalentProof<br/>
            <span style={{ color: "#DCFCE7" }}>via WhatsApp en 4 étapes</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 440, margin: "0 auto 1.75rem" }}>
            Pas besoin de CV, ni d&apos;ordinateur. Ton téléphone et ta passion suffisent.
          </p>

          <a
            href={waTalentProof("je veux m'inscrire avec ma preuve visuelle.")}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.65rem",
              background: "white", color: "#075E54",
              fontWeight: 900, fontSize: "1rem", padding: "0.9rem 2rem",
              borderRadius: "99px", textDecoration: "none",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>💬</span>
            Commencer maintenant
          </a>
        </div>
      </div>

      {/* ── QR Code Section ── */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1.25rem 0" }}>
        <div style={{
          background: "var(--surface)", borderRadius: "1.25rem",
          boxShadow: "var(--shadow-md)", border: "1px solid var(--border)",
          padding: "1.5rem", display: "flex", gap: "1.5rem",
          alignItems: "center", flexWrap: "wrap",
        }}>
          {/* QR Code simulé */}
          <div style={{
            width: 120, height: 120, flexShrink: 0, borderRadius: "0.85rem",
            background: "white", border: "2px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "0.3rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}>
            {/* QR Pattern simulé */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,10px)", gap: "2px" }}>
              {[1,1,1,0,1,1,1, 1,0,1,0,1,0,1, 1,0,1,0,1,0,1, 0,0,0,1,0,0,0,
                1,0,1,0,1,0,1, 1,0,1,0,1,0,1, 1,1,1,0,1,1,1].map((v,i) => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: "1px",
                  background: v ? "#075E54" : "transparent",
                }}/>
              ))}
            </div>
            <div style={{ fontSize: "0.6rem", color: "var(--t3)", fontWeight: 600, marginTop: "2px" }}>
              SCAN ME
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--t1)", marginBottom: "0.35rem" }}>
              📱 Scanner avec ton téléphone
            </div>
            <p style={{ color: "var(--t2)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "0.85rem" }}>
              Ouvre l&apos;appareil photo et scanne le code. Tu seras dirigé directement vers notre chat WhatsApp.
            </p>
            <a
              href={waTalentProof("je veux m'inscrire avec ma preuve visuelle.")}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "#25D366", color: "white", borderRadius: "99px",
                padding: "0.55rem 1.1rem", fontWeight: 700, fontSize: "0.85rem",
                textDecoration: "none",
              }}
            >
              💬 Ouvrir WhatsApp directement
            </a>
          </div>
        </div>
      </div>

      {/* ── Étapes ── */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.75rem 1.25rem" }}>
        <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--t1)", marginBottom: "1rem" }}>
          📋 Les 4 étapes, en détail
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {STEPS.map((step, i) => (
            <StepCard
              key={step.num}
              step={step}
              isActive={activeStep === i}
              onClick={() => setActiveStep(i === activeStep ? -1 : i)}
            />
          ))}
        </div>

        {/* CTA final */}
        <div style={{
          marginTop: "2rem", background: "linear-gradient(135deg,#075E54,#128C7E)",
          borderRadius: "1.25rem", padding: "2rem",
          textAlign: "center", boxShadow: "0 4px 24px rgba(7,94,84,0.3)",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🚀</div>
          <div style={{ color: "white", fontWeight: 900, fontSize: "1.1rem", marginBottom: "0.35rem" }}>
            Prêt(e) à montrer ton talent ?
          </div>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.88rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>
            Rejoins des milliers de travailleurs africains qui ont déjà leur profil TalentProof.
          </p>
          <a
            href={waTalentProof("je veux m'inscrire avec ma preuve visuelle.")}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.65rem",
              background: "white", color: "#075E54",
              fontWeight: 900, fontSize: "1rem", padding: "0.85rem 2rem",
              borderRadius: "99px", textDecoration: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>💬</span>
            Je m&apos;inscris maintenant
          </a>
        </div>

        {/* Lien retour */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a href="/" style={{ color: "var(--g700)", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none" }}>
            ← Retour au fil des talents
          </a>
        </div>
      </div>

      <FloatingHelp />
    </div>
  );
}
