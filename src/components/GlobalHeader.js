"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/* ── constantes ── */
const WA_NUM = "2250705503089";
const EMAIL  = "contact@talentproof.africa";

const NAV_LINKS = [
  { label: "Annuaire",           href: "/annuaire" },
  { label: "Espace Recruteur",   href: "/recruteur" },
  { label: "Devenir Partenaire", href: "/partenaires-dashboard" },
];

const SESSION_CONFIGS = [
  { key: "tp_talent",          type: "talent",     nameField: ["nom_complet","prenom"],    profileUrl: "/mon-profil",            label: "Talent" },
  { key: "recruteur_session",  type: "recruteur",  nameField: ["nom_entreprise","prenom"], profileUrl: "/recruteur",             label: "Recruteur" },
  { key: "partenaire_session", type: "partenaire", nameField: ["nom_organisation","nom"],  profileUrl: "/partenaires-dashboard", label: "Partenaire" },
];

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).filter(Boolean).join("").toUpperCase().slice(0, 2);
}

function resolveName(data, fields) {
  for (const f of fields) {
    if (data[f] && String(data[f]).trim()) return String(data[f]).trim();
  }
  return "";
}

/* ── CSS injecté une seule fois ── */
const HEADER_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
@keyframes gh-slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
@keyframes gh-fadeIn    { from{opacity:0;transform:translateY(6px)}  to{opacity:1;transform:translateY(0)} }

.gh-nav-link{color:rgba(255,255,255,.72);text-decoration:none;font-size:.82rem;font-weight:600;padding:.3rem .55rem;border-radius:8px;transition:color .15s,background .15s;white-space:nowrap}
.gh-nav-link:hover{color:white;background:rgba(255,255,255,.1)}
@media(max-width:768px){.gh-nav-link{display:none}}

.gh-mob-menu{animation:gh-slideDown .22s ease}
.gh-mob-link{display:block;color:rgba(255,255,255,.8);text-decoration:none;font-size:.92rem;font-weight:600;padding:.75rem 1rem;border-radius:10px;transition:background .15s}
.gh-mob-link:hover{background:rgba(255,255,255,.08);color:white}

.gh-search-wrap{display:flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:99px;padding:.3rem .7rem .3rem .5rem;transition:background .2s,border-color .2s;cursor:text}
.gh-search-wrap:focus-within{background:rgba(255,255,255,.16);border-color:rgba(240,192,64,.5)}
.gh-search-input{background:transparent;border:none;outline:none;color:white;font-size:.8rem;font-family:inherit;width:130px;transition:width .2s}
.gh-search-input::placeholder{color:rgba(255,255,255,.45)}
.gh-search-input:focus{width:170px}

.gh-create-btn{display:inline-flex;align-items:center;gap:.35rem;background:linear-gradient(135deg,#C9960F,#F0C040);color:#0D3B2E;font-weight:800;font-size:.78rem;padding:.45rem 1rem;border-radius:99px;text-decoration:none;box-shadow:0 3px 14px rgba(201,150,15,.45);white-space:nowrap;flex-shrink:0;transition:transform .15s,box-shadow .15s}
.gh-create-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(201,150,15,.55)}

.gh-avatar-btn{display:flex;align-items:center;gap:.5rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);border-radius:99px;padding:.3rem .75rem .3rem .35rem;cursor:pointer;transition:background .15s;flex-shrink:0}
.gh-avatar-btn:hover{background:rgba(255,255,255,.18)}

.gh-dropdown{position:absolute;top:calc(100% + 8px);right:0;min-width:210px;background:#1A365D;border:1px solid rgba(236,201,75,.22);border-radius:14px;box-shadow:0 12px 36px rgba(0,0,0,.45);overflow:hidden;animation:gh-fadeIn .18s ease;z-index:300}
.gh-dd-link{display:flex;align-items:center;gap:.65rem;color:rgba(255,255,255,.85);text-decoration:none;font-size:.84rem;font-weight:600;padding:.72rem 1rem;transition:background .15s}
.gh-dd-link:hover{background:rgba(236,201,75,.1);color:white}
.gh-dd-sep{height:1px;background:rgba(255,255,255,.1);margin:.25rem 0}
.gh-dd-logout{display:flex;align-items:center;gap:.65rem;width:100%;background:transparent;border:none;color:#FCA5A5;font-size:.84rem;font-weight:600;padding:.72rem 1rem;cursor:pointer;transition:background .15s;font-family:inherit}
.gh-dd-logout:hover{background:rgba(239,68,68,.12)}

@media(max-width:768px){
  .gh-search-input{width:80px}
  .gh-search-input:focus{width:100px}
  .gh-create-btn{display:none !important}
  .gh-nav-links{display:none !important}
  .gh-logo-img{height:38px !important}
  .gh-logo-text{font-size:.95rem !important}
  .gh-search-wrap{padding:.25rem .55rem .25rem .45rem !important}
  .gh-avatar-name{display:none !important}
}
@media(max-width:400px){
  .gh-logo-img{height:35px !important}
  .gh-logo-text{font-size:.85rem !important}
  .gh-search-input{width:60px}
  .gh-search-input:focus{width:80px}
}
`;

function WaLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.527 5.852L.057 23.5l5.797-1.497A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.162-1.416l-.37-.218-3.441.889.917-3.346-.24-.387A9.944 9.944 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
    </svg>
  );
}

export default function GlobalHeader() {
  const router = useRouter();
  const [session, setSession]       = useState(null);
  const [hydrated, setHydrated]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const [navSearch, setNavSearch]   = useState("");
  const navSearchRef = useRef(null);
  const dropRef      = useRef(null);

  /* ── lecture localStorage côté client uniquement ── */
  useEffect(() => {
    for (const cfg of SESSION_CONFIGS) {
      try {
        const raw = localStorage.getItem(cfg.key);
        if (raw) {
          const data = JSON.parse(raw);
          const name = resolveName(data, cfg.nameField);
          setSession({ ...cfg, name, data });
          break;
        }
      } catch {}
    }
    setHydrated(true);
  }, []);

  /* ferme le dropdown au clic extérieur */
  useEffect(() => {
    if (!dropOpen) return;
    const close = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [dropOpen]);

  /* ferme le menu mobile au clic extérieur */
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => { if (!e.target.closest("[data-gh-menu]")) setMenuOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  const handleNavSearch = (e) => {
    if (e.key === "Enter" && navSearch.trim()) {
      router.push(`/annuaire?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch(""); setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    SESSION_CONFIGS.forEach(cfg => localStorage.removeItem(cfg.key));
    setSession(null); setDropOpen(false); setMenuOpen(false);
    router.refresh();
  };

  const initials = session ? getInitials(session.name) : "";

  /* couleurs avatar selon le type */
  const avatarBg = session?.type === "recruteur"
    ? "linear-gradient(135deg,#1E3A5F,#2563EB)"
    : session?.type === "partenaire"
    ? "linear-gradient(135deg,#071F15,#1B6B47)"
    : "linear-gradient(135deg,#4F46E5,#7C3AED)";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HEADER_CSS }} />

      <header style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "linear-gradient(135deg,#0B1628 0%,#0F2744 60%,#162F52 100%)",
        borderBottom: "1px solid rgba(240,192,64,.18)",
        boxShadow: "0 4px 24px rgba(0,0,0,.4)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1rem", display: "flex", alignItems: "center", gap: "1rem", height: 58 }}>

          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: ".45rem", textDecoration: "none", flexShrink: 0 }}>
            <img src="/logo-talentproof.jpg" alt="TalentProof" style={{ height: 55, width: "auto", objectFit: "contain" }} className="gh-logo-img" />
            <span className="gh-logo-text" style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#ECC94B", whiteSpace: "nowrap" }}>TalentProof</span>
          </a>

          {/* Liens desktop */}
          <nav className="gh-nav-links" style={{ display: "flex", alignItems: "center", gap: ".1rem", flex: 1, justifyContent: "center", flexWrap: "nowrap" }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className="gh-nav-link">{l.label}</a>
            ))}
          </nav>

          {/* Barre de recherche */}
          <div className="gh-search-wrap" style={{ flexShrink: 0 }} onClick={() => navSearchRef.current?.focus()}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={navSearchRef}
              className="gh-search-input"
              value={navSearch}
              onChange={e => setNavSearch(e.target.value)}
              onKeyDown={handleNavSearch}
              placeholder="Métier, ville, nom…"
            />
          </div>

          {/* Zone droite : avatar OU bouton créer profil (hydraté) */}
          {hydrated && (
            session ? (
              /* ── CONNECTÉ : avatar + dropdown ── */
              <div ref={dropRef} style={{ position: "relative", flexShrink: 0 }}>
                <button
                  className="gh-avatar-btn"
                  onClick={() => setDropOpen(o => !o)}
                  aria-label="Menu utilisateur"
                >
                  {/* Cercle initiales */}
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: avatarBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Sora',sans-serif", fontWeight: 800,
                    fontSize: ".72rem", color: "white", flexShrink: 0,
                    border: "1.5px solid rgba(240,192,64,.5)",
                  }}>
                    {initials}
                  </div>
                  {/* Nom cliquable */}
                  <span className="gh-avatar-name" style={{
                    color: "white", fontWeight: 700, fontSize: ".8rem",
                    maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {session.name || session.label}
                  </span>
                  {/* Chevron */}
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {dropOpen && (
                  <div className="gh-dropdown">
                    {/* En-tête dropdown */}
                    <div style={{ padding: ".75rem 1rem .5rem", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                      <div style={{ color: "rgba(255,255,255,.45)", fontSize: ".72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: ".25rem" }}>
                        {session.label}
                      </div>
                      <div style={{ color: "white", fontWeight: 700, fontSize: ".88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {session.name || "—"}
                      </div>
                    </div>

                    <div style={{ padding: ".35rem 0" }}>
                      <a href={session.profileUrl} className="gh-dd-link" onClick={() => setDropOpen(false)}>
                        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Mon espace
                      </a>
                      <a href="/annuaire" className="gh-dd-link" onClick={() => setDropOpen(false)}>
                        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        Annuaire
                      </a>
                      <a href="/" className="gh-dd-link" onClick={() => setDropOpen(false)}>
                        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        Accueil
                      </a>
                      <div className="gh-dd-sep"/>
                      <button className="gh-dd-logout" onClick={handleLogout}>
                        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── NON CONNECTÉ : bouton créer profil ── */
              <a href="/inscription-talent" className="gh-create-btn">
                + Créer mon profil
              </a>
            )
          )}

          {/* Burger mobile */}
          <button
            data-gh-menu
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)",
              borderRadius: "8px", width: 36, height: 36, cursor: "pointer", flexShrink: 0,
              color: "white",
            }}
          >
            {menuOpen
              ? <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </div>

        {/* ── Menu mobile déroulant ── */}
        {menuOpen && (
          <div data-gh-menu className="gh-mob-menu" style={{
            background: "#1A365D",
            borderTop: "1px solid rgba(236,201,75,.2)",
            padding: "1.2rem",
          }}>
            {/* En-tête menu */}
            <div style={{ marginBottom: "1rem", paddingBottom: ".8rem", borderBottom: "1px solid rgba(236,201,75,.15)" }}>
              {session ? (
                <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: avatarBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: ".8rem", color: "white",
                    border: "1.5px solid rgba(240,192,64,.5)", flexShrink: 0,
                  }}>{initials}</div>
                  <div>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: ".92rem", color: "#ECC94B" }}>{session.name || session.label}</div>
                    <div style={{ color: "rgba(255,255,255,.5)", fontSize: ".72rem" }}>{session.label} connecté(e)</div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#ECC94B" }}>Menu</div>
                  <div style={{ color: "rgba(255,255,255,.6)", fontSize: ".75rem", marginTop: ".2rem" }}>Navigation TalentProof</div>
                </div>
              )}
            </div>

            {/* Liens principaux */}
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginBottom: "1rem" }}>
              {[
                { href: "/mon-profil",            icon: "👤", label: "Mon Profil",         sub: "Gérer mon compte" },
                { href: "/annuaire",              icon: "🔍", label: "Trouver un talent",  sub: "Annuaire complet" },
                { href: "/recruteur",             icon: "💼", label: "Espace Recruteur",   sub: "Trouvez vos talents" },
                { href: "/partenaires-dashboard", icon: "🤝", label: "Espace Partenaire",  sub: "Tableau de bord" },
                { href: "/aide",                  icon: "❓", label: "Aide & Support",     sub: "FAQ et assistance" },
              ].map(item => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{
                  display: "flex", alignItems: "center", gap: ".7rem",
                  background: "rgba(236,201,75,.08)", border: "1px solid rgba(236,201,75,.2)",
                  borderRadius: "12px", padding: ".85rem 1rem", textDecoration: "none", transition: "all .2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(236,201,75,.15)"; e.currentTarget.style.borderColor = "rgba(236,201,75,.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(236,201,75,.08)"; e.currentTarget.style.borderColor = "rgba(236,201,75,.2)"; }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "white", fontWeight: 700, fontSize: ".92rem" }}>{item.label}</div>
                    <div style={{ color: "rgba(255,255,255,.5)", fontSize: ".72rem" }}>{item.sub}</div>
                  </div>
                </a>
              ))}

              {/* Déconnexion si connecté */}
              {session && (
                <button onClick={handleLogout} style={{
                  display: "flex", alignItems: "center", gap: ".7rem",
                  background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)",
                  borderRadius: "12px", padding: ".85rem 1rem", cursor: "pointer",
                  fontFamily: "inherit", transition: "all .2s", width: "100%",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,.16)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,.08)"; }}
                >
                  <span style={{ fontSize: "1.1rem" }}>🚪</span>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ color: "#FCA5A5", fontWeight: 700, fontSize: ".92rem" }}>Déconnexion</div>
                    <div style={{ color: "rgba(255,255,255,.4)", fontSize: ".72rem" }}>Quitter ma session</div>
                  </div>
                </button>
              )}
            </div>

            {/* Bouton inscription (si non connecté) */}
            {!session && (
              <a href="/inscription-talent" onClick={() => setMenuOpen(false)} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem",
                background: "linear-gradient(135deg,#D69E2E,#ECC94B)", color: "#1A365D",
                fontWeight: 800, fontSize: ".9rem", padding: ".8rem", borderRadius: "12px",
                textDecoration: "none", marginBottom: "1rem", boxShadow: "0 4px 16px rgba(236,201,75,.4)",
              }}>
                + Créer mon profil gratuitement
              </a>
            )}

            {/* Contact rapide */}
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              <a href={`https://wa.me/${WA_NUM}`} target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: ".35rem", background: "#25D366", color: "white", fontWeight: 700, fontSize: ".78rem", padding: ".5rem .9rem", borderRadius: "99px", textDecoration: "none", flex: 1, justifyContent: "center" }}>
                <WaLogo size={14} /> WhatsApp
              </a>
              <a href={`mailto:${EMAIL}`}
                style={{ display: "inline-flex", alignItems: "center", gap: ".35rem", background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.8)", fontSize: ".78rem", fontWeight: 600, padding: ".5rem .9rem", borderRadius: "99px", textDecoration: "none", border: "1px solid rgba(255,255,255,.2)", flex: 1, justifyContent: "center" }}>
                ✉️ Email
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
