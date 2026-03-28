"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { href: "/",                      label: "Fil Vidéo",          icon: "🎥", desc: "Preuves en action"           },
  { href: "/annuaire",              label: "Annuaire Diplômés",  icon: "🎓", desc: "Certifiés & expérimentés"    },
  { href: "/recruteur",             label: "Espace Recruteur",   icon: "🏢", desc: "Trouver un talent"           },
  { href: "/partenaires-dashboard", label: "Espace Partenaires", icon: "✦",  desc: "Écoles & entreprises", gold: true },
];

export default function Navbar({ onInscription }) {
  const path          = usePathname();
  const router        = useRouter();
  const [open, setOpen]       = useState(false);
  const [navQ, setNavQ]       = useState("");
  const [dark, setDark]       = useState(false);
  const searchRef             = useRef();

  // Initialise le thème depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tp_theme");
    if (saved === "dark") { document.documentElement.classList.add("dark"); setDark(true); }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("tp_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tp_theme", "light");
    }
  };

  const handleNavSearch = (e) => {
    if (e.key === "Enter" && navQ.trim()) {
      router.push(`/?q=${encodeURIComponent(navQ.trim())}`);
      setNavQ("");
      setOpen(false);
    }
  };

  // Ferme le menu au changement de page
  useEffect(() => { setOpen(false); }, [path]);

  // Empêche le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href) => href === "/" ? path === "/" : path.startsWith(href);

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 300,
        background: "var(--g900,#071F15)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
      }}>
        <div style={{
          maxWidth: 1180, margin: "0 auto",
          padding: "0 1.25rem", height: 58,
          display: "flex", alignItems: "center", gap: "0.75rem",
        }}>

          {/* ── Logo ── */}
          <a href="/" style={{ textDecoration: "none", flexShrink: 0, marginRight: "0.25rem" }}>
            <span style={{ color: "#F0C040", fontWeight: 900, fontSize: "1.25rem", letterSpacing: "-0.4px" }}>
              Talent<span style={{ color: "white" }}>Proof</span>
            </span>
          </a>

          {/* ── Liens desktop ── */}
          <div style={{ display: "flex", flex: 1, alignItems: "stretch", height: "100%" }}
               className="nav-links-desktop">
            {TABS.map(({ href, label, icon, gold }) => (
              <a key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: "0.3rem",
                padding: "0 0.9rem", textDecoration: "none",
                fontWeight: gold ? 800 : 600, fontSize: "0.86rem",
                whiteSpace: "nowrap",
                color: isActive(href) ? "#F0C040" : gold ? "#F0C040CC" : "rgba(255,255,255,0.68)",
                borderBottom: isActive(href) ? "2.5px solid #F0C040" : "2.5px solid transparent",
                borderTop: "2.5px solid transparent",
                transition: "color 0.15s, border-color 0.15s",
                opacity: gold && !isActive(href) ? 0.88 : 1,
              }}
                onMouseEnter={e => { if (!isActive(href)) e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { if (!isActive(href)) e.currentTarget.style.color = gold ? "#F0C040CC" : "rgba(255,255,255,0.68)"; }}
              >
                <span style={{ fontSize: "0.9rem" }}>{icon}</span>
                {label}
              </a>
            ))}
          </div>

          {/* ── Recherche (desktop) ── */}
          <div style={{
            flex: "0 1 260px", background: "rgba(255,255,255,0.07)",
            borderRadius: "99px", display: "flex", alignItems: "center",
            padding: "0 0.9rem", border: "1px solid rgba(255,255,255,0.1)", height: 35,
          }} className="nav-search">
            <span style={{ color: "rgba(255,255,255,0.35)", marginRight: "0.4rem", fontSize: "0.85rem" }}>🔍</span>
            <input
              ref={searchRef}
              placeholder="Métier, ville, nom… (Entrée pour chercher)"
              value={navQ}
              onChange={e => setNavQ(e.target.value)}
              onKeyDown={handleNavSearch}
              style={{ background: "transparent", border: "none", outline: "none", color: "white", fontSize: "0.84rem", width: "100%" }}
            />
          </div>

          {/* ── Toggle dark mode ── */}
          <button
            onClick={toggleTheme}
            title={dark ? "Mode clair" : "Mode sombre"}
            style={{
              flexShrink: 0, background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: "99px",
              padding: "0.3rem 0.65rem", cursor: "pointer", color: "white",
              fontSize: "0.95rem", transition: "background 0.15s",
            }}
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {/* ── CTA S'inscrire ── */}
          <button className="btn-gold"
            style={{ flexShrink: 0, padding: "0.45rem 1.1rem", fontSize: "0.82rem" }}
            onClick={onInscription}>
            + Créer mon profil
          </button>

          {/* ── Burger (mobile uniquement) ── */}
          <button
            className="nav-burger"
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
            style={{
              display: "none", flexShrink: 0,
              background: open ? "rgba(255,255,255,0.1)" : "transparent",
              border: "1.5px solid rgba(255,255,255,0.2)",
              borderRadius: "0.55rem", padding: "0.35rem 0.55rem",
              cursor: "pointer", color: "white",
            }}
          >
            {/* 3 barres → croix */}
            <div style={{ width: 20, height: 14, display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "all 0.2s" }}>
              <span style={{
                display: "block", height: 2, background: "white", borderRadius: 2,
                transformOrigin: "left center",
                transform: open ? "rotate(45deg) translate(2px,-1px)" : "none",
                transition: "transform 0.22s",
              }}/>
              <span style={{
                display: "block", height: 2, background: "white", borderRadius: 2,
                opacity: open ? 0 : 1, transition: "opacity 0.18s",
              }}/>
              <span style={{
                display: "block", height: 2, background: "white", borderRadius: 2,
                transformOrigin: "left center",
                transform: open ? "rotate(-45deg) translate(2px,1px)" : "none",
                transition: "transform 0.22s",
              }}/>
            </div>
          </button>
        </div>

        {/* ── Menu burger déroulant (mobile) ── */}
        <div className="nav-burger-menu" style={{
          display: "none",
          position: "fixed", top: 58, left: 0, right: 0, bottom: 0,
          zIndex: 299,
          visibility: open ? "visible" : "hidden",
          opacity: open ? 1 : 0,
          transition: "opacity 0.22s, visibility 0.22s",
        }}>
          {/* Fond semi-transparent cliquable */}
          <div onClick={() => setOpen(false)} style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
          }}/>

          {/* Panneau de liens */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            background: "var(--g900,#071F15)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
            padding: "0.5rem 0 1rem",
            transform: open ? "translateY(0)" : "translateY(-8px)",
            transition: "transform 0.22s",
          }}>
            {TABS.map(({ href, label, icon, desc, gold }) => (
              <a key={href} href={href} onClick={() => setOpen(false)} style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "0.85rem 1.5rem", textDecoration: "none",
                borderLeft: isActive(href) ? "3px solid #F0C040" : "3px solid transparent",
                background: isActive(href) ? "rgba(240,192,64,0.08)" : "transparent",
                transition: "background 0.12s",
              }}
                onMouseEnter={e => { if (!isActive(href)) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (!isActive(href)) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{
                  width: 36, height: 36, borderRadius: "0.65rem", flexShrink: 0,
                  background: isActive(href) ? "rgba(240,192,64,0.15)" : "rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem",
                }}>{icon}</span>
                <div>
                  <div style={{
                    fontWeight: 700, fontSize: "0.95rem",
                    color: isActive(href) ? "#F0C040" : gold ? "#F0C040CC" : "white",
                  }}>{label}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.77rem", marginTop: "1px" }}>{desc}</div>
                </div>
                {isActive(href) && (
                  <span style={{ marginLeft: "auto", color: "#F0C040", fontSize: "0.9rem" }}>●</span>
                )}
              </a>
            ))}

            {/* Séparateur + CTA mobile */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "0.75rem 1.5rem 0.5rem" }}/>
            <div style={{ padding: "0 1.5rem" }}>
              <button className="btn-gold" style={{ width: "100%", fontSize: "0.9rem", padding: "0.7rem" }}
                onClick={() => { setOpen(false); onInscription?.(); }}>
                + Créer mon profil gratuitement
              </button>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @media (max-width: 720px) {
          .nav-links-desktop { display: none !important; }
          .nav-search        { display: none !important; }
          .nav-burger        { display: flex !important; }
          .nav-burger-menu   { display: block !important; }
        }
        @media (min-width: 721px) {
          .nav-burger        { display: none !important; }
          .nav-burger-menu   { display: none !important; }
        }
      `}</style>
    </>
  );
}
