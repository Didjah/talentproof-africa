"use client";
import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import PartnerCard from "../components/feed/PartnerCard";
import FloatingHelp from "../components/layout/FloatingHelp";
import { VideoPlayerModal, InscriptionModal } from "../components/feed/Modals";
import { PROFILS_VIDEO, PARTENAIRES, MEDIA_PALETTE, metiersOf } from "../data/profiles";
import { waLink, waShare, waTalentProof } from "../utils/whatsapp";

const DISPO_COLOR = { immediate: "#16A34A", "1_month": "#D97706", negotiable: "#6B7280" };
const DISPO_LABEL = { immediate: "Disponible", "1_month": "Dispo dans 1 mois", negotiable: "À négocier" };

/* ══════════════════════════════════════════════════
   MÉDIA VIDÉO — thumbnail 16:9 avec bouton play
══════════════════════════════════════════════════ */
function MediaVideo({ profil, onClick }) {
  const [hov, setHov] = useState(false);
  const pal = MEDIA_PALETTE[profil.avatar] || { bg: "135deg, #071F15, #1B6B47", accent: "#F0C040" };

  return (
    <div
      style={{ position: "relative", aspectRatio: "16/9", cursor: "pointer", overflow: "hidden" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(${pal.bg})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        filter: hov ? "brightness(0.65) saturate(1.4)" : "brightness(1)",
        transition: "filter 0.25s",
      }}>
        <span style={{ fontSize: "clamp(4rem,10vw,7rem)", opacity: 0.22, userSelect: "none" }}>
          {profil.avatar}
        </span>
      </div>

      {/* Play button */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 68, height: 68, borderRadius: "50%",
          background: hov ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.82)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 28px rgba(0,0,0,0.4)",
          transform: hov ? "scale(1.12)" : "scale(1)",
          transition: "transform 0.2s, background 0.2s",
        }}>
          <span style={{ fontSize: "1.7rem", marginLeft: 5 }}>▶</span>
        </div>
      </div>

      {/* Durée */}
      <div style={{
        position: "absolute", bottom: "0.65rem", right: "0.8rem",
        background: "rgba(0,0,0,0.72)", color: "white",
        fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", borderRadius: "5px",
      }}>0:60</div>

      {/* Badge */}
      <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
        <span style={{
          background: "rgba(93,33,211,0.85)", color: "white",
          fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px",
          borderRadius: "99px", backdropFilter: "blur(4px)",
        }}>🎥 Preuve vidéo</span>
      </div>

      {/* Tags */}
      {profil.tags?.length > 0 && (
        <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", display: "flex", gap: "0.3rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {profil.tags.slice(0, 2).map(t => (
            <span key={t} style={{
              background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.85)",
              fontSize: "0.68rem", fontWeight: 600, padding: "2px 7px", borderRadius: "99px",
            }}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MÉDIA IMAGE — format carré 1:1, style Instagram
══════════════════════════════════════════════════ */
function MediaImage({ profil }) {
  const [hov, setHov] = useState(false);
  const pal = MEDIA_PALETTE[profil.avatar] || { bg: "135deg, #071F15, #1B6B47", accent: "#F0C040" };

  return (
    <div
      style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", cursor: "default" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      {/* Fond simulant une photo de réalisation */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(${pal.bg})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.4s ease",
        transform: hov ? "scale(1.04)" : "scale(1)",
      }}>
        {/* Motif décoratif simulant du contenu photo */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at 70% 30%, ${pal.accent}18 0%, transparent 60%),
                       radial-gradient(circle at 30% 70%, ${pal.accent}10 0%, transparent 50%)`,
        }}/>
        <span style={{ fontSize: "clamp(5rem,14vw,9rem)", opacity: 0.18, userSelect: "none", position: "relative" }}>
          {profil.avatar}
        </span>
      </div>

      {/* Overlay gradient bas — légende photo */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(transparent 0%, rgba(0,0,0,0.7) 100%)",
        padding: "2rem 1rem 0.85rem",
        transform: hov ? "translateY(0)" : "translateY(4px)",
        transition: "transform 0.3s",
      }}>
        {profil.imageCaption && (
          <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.82rem", fontWeight: 500, lineHeight: 1.4 }}>
            📸 {profil.imageCaption}
          </div>
        )}
      </div>

      {/* Badge IMAGE */}
      <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
        <span style={{
          background: "rgba(15,118,110,0.85)", color: "white",
          fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px",
          borderRadius: "99px", backdropFilter: "blur(4px)",
        }}>📸 Réalisation</span>
      </div>

      {/* Accent couleur en coin */}
      <div style={{
        position: "absolute", top: "0.75rem", right: "0.75rem",
        width: 12, height: 12, borderRadius: "50%",
        background: pal.accent, boxShadow: `0 0 12px ${pal.accent}`,
      }}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CARTE TALENT — multi-format (video | image)
══════════════════════════════════════════════════ */
function TalentFeedCard({ profil, onWatch, onContact, index }) {
  const isVideo = profil.mediaType === "video";
  const [liked,  setLiked]  = useState(false);
  const [likes,  setLikes]  = useState(profil.likes || 0);

  const handleLike = () => {
    setLiked(l => !l);
    setLikes(n => liked ? n - 1 : n + 1);
  };

  return (
    <article className="card-enter" style={{
      animationDelay: `${index * 0.07}s`,
      background: "var(--surface)", borderRadius: "var(--radius-card)",
      overflow: "hidden", boxShadow: "var(--shadow-md)",
    }}>
      {/* ── Zone média ── */}
      {isVideo
        ? <MediaVideo profil={profil} onClick={onWatch} />
        : <MediaImage profil={profil} />
      }

      {/* ── Infos sous le média ── */}
      <div style={{ padding: "1rem 1.15rem 1.15rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, var(--g700), var(--g500))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.3rem", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>{profil.avatar}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Nom + badge WhatsApp */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--t1)" }}>{profil.nom}</span>
              {profil.fromWhatsApp && (
                <span className="badge-whatsapp">📱 WhatsApp</span>
              )}
            </div>
            <div style={{ color: "var(--g700)", fontWeight: 700, fontSize: "0.85rem", marginTop: "0.1rem" }}>
              {profil.metier} · {profil.experience} ans
            </div>
            <div style={{ color: "var(--t3)", fontSize: "0.8rem" }}>📍 {profil.ville} {profil.pays}</div>
          </div>

          <span style={{
            fontSize: "0.74rem", fontWeight: 600, color: DISPO_COLOR[profil.disponible],
            display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: DISPO_COLOR[profil.disponible], display: "inline-block" }}/>
            {DISPO_LABEL[profil.disponible]}
          </span>
        </div>

        <p style={{ color: "var(--t2)", fontSize: "0.87rem", lineHeight: 1.65, margin: "0.7rem 0 0" }}>
          {profil.bio}
        </p>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.9rem", paddingTop: "0.85rem", borderTop: "1px solid var(--border)", flexWrap: "wrap", alignItems: "center" }}>
          {isVideo ? (
            <button onClick={onWatch} className="btn-primary" style={{ flex: "1 1 auto", fontSize: "0.88rem", padding: "0.6rem 0.9rem" }}>
              ▶ Regarder la vidéo
            </button>
          ) : (
            <button className="btn-primary" style={{ flex: "1 1 auto", fontSize: "0.88rem", padding: "0.6rem 0.9rem", background: "#0D9488" }}>
              📸 Voir toutes les photos
            </button>
          )}
          {/* Contacter */}
          <a href={waLink(profil.nom, profil.metier, profil.phone)}
            target="_blank" rel="noreferrer"
            className="btn-ghost"
            style={{ flex: "1 1 auto", fontSize: "0.88rem", padding: "0.6rem 0.9rem", textAlign: "center", textDecoration: "none" }}>
            💬 Contacter
          </a>
          {/* Partager */}
          <a href={waShare(profil.nom, profil.metier, profil.ville)}
            target="_blank" rel="noreferrer"
            title="Partager ce profil"
            style={{
              padding: "0.6rem 0.75rem", borderRadius: "99px", textDecoration: "none",
              background: "#DCF8C6", color: "#075E54", fontWeight: 700, fontSize: "0.82rem",
              display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0,
              border: "1.5px solid #b7e4a0",
            }}>
            ↗ Partager
          </a>
          {/* Appel direct */}
          {profil.phone && (
            <a href={`tel:+${profil.phone}`}
              title={`Appeler ${profil.nom}`}
              style={{
                padding: "0.6rem 0.75rem", borderRadius: "99px", textDecoration: "none",
                background: "#EFF6FF", color: "#1D4ED8", fontWeight: 700, fontSize: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                border: "1.5px solid #BFDBFE",
              }}>
              📞
            </a>
          )}
          {/* Like / Recommandation */}
          <button
            onClick={handleLike}
            style={{
              padding: "0.6rem 0.75rem", borderRadius: "99px", border: "1.5px solid",
              borderColor: liked ? "#FDA4AF" : "var(--border)",
              background: liked ? "#FFF1F2" : "transparent",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem",
              fontSize: "0.82rem", fontWeight: 700,
              color: liked ? "#E11D48" : "var(--t3)",
              transition: "all 0.15s", flexShrink: 0,
            }}
          >
            {liked ? "❤️" : "🤍"} {likes}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════════
   WELCOME BANNER — animé, auto-fermeture 4s
══════════════════════════════════════════════════ */
function WelcomeBanner() {
  const [visible,  setVisible]  = useState(false);
  const [leaving,  setLeaving]  = useState(false);

  useEffect(() => {
    // N'affiche qu'une fois par session
    if (sessionStorage.getItem("tp_welcomed")) return;
    const t1 = setTimeout(() => setVisible(true), 300);
    const t2 = setTimeout(() => { setLeaving(true); }, 4000);
    const t3 = setTimeout(() => { setVisible(false); sessionStorage.setItem("tp_welcomed", "1"); }, 4400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => { setVisible(false); sessionStorage.setItem("tp_welcomed", "1"); }, 380);
  };

  if (!visible) return null;

  const words = ["Découvre", "les", "meilleurs", "talents", "d'Afrique", "en", "vidéo", "🌍"];

  return (
    <div className={leaving ? "welcome-out" : "welcome-in"} style={{
      position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)",
      zIndex: 500, width: "calc(100% - 2rem)", maxWidth: 560,
    }}>
      <div style={{
        background: "linear-gradient(135deg, #071F15 0%, #1B6B47 100%)",
        borderRadius: "1.25rem", padding: "1rem 1.35rem",
        boxShadow: "0 12px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(240,192,64,0.25)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#F0C040", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "0.3rem" }}>
            ✦ Bienvenue sur TalentProof
          </div>
          <div style={{ color: "white", fontWeight: 800, fontSize: "clamp(0.9rem,2.5vw,1.05rem)", lineHeight: 1.4 }}>
            {words.map((w, i) => (
              <span key={i} className="welcome-word" style={{ animationDelay: `${i * 0.07}s`, marginRight: "0.3rem" }}>
                {w}
              </span>
            ))}
          </div>
        </div>
        <button onClick={dismiss} style={{
          background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
          width: 30, height: 30, color: "rgba(255,255,255,0.6)", cursor: "pointer",
          fontSize: "0.85rem", flexShrink: 0,
        }}>✕</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   BARRE DE RECHERCHE PRINCIPALE
══════════════════════════════════════════════════ */
function SearchBar({ value, onChange, resultCount, total }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef();

  const suggestions = ["Chauffeur", "Couturière", "Soudeur", "Développeuse", "Cuisinier", "Dakar", "Abidjan", "Lagos"];

  return (
    <div style={{
      background: "var(--surface)", borderBottom: "1px solid var(--border)",
      padding: "0.85rem 1.25rem",
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Champ principal */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          background: focused ? "white" : "#F7F9F7",
          border: `2px solid ${focused ? "var(--g500)" : "var(--border)"}`,
          borderRadius: "1rem", padding: "0.65rem 1rem",
          transition: "border-color 0.18s, background 0.18s, box-shadow 0.18s",
          boxShadow: focused ? "0 0 0 4px rgba(45,153,102,0.12)" : "none",
        }}>
          <span style={{ fontSize: "1.15rem", flexShrink: 0 }}>🔍</span>
          <input
            ref={inputRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Cherche un talent par métier, ville ou nom…"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: "clamp(0.9rem,2.5vw,1rem)", color: "var(--t1)",
              fontFamily: "inherit",
            }}
          />
          {value && (
            <button onClick={() => { onChange(""); inputRef.current?.focus(); }} style={{
              background: "#F3F4F6", border: "none", borderRadius: "50%",
              width: 26, height: 26, cursor: "pointer", color: "var(--t3)",
              fontSize: "0.8rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          )}
        </div>

        {/* Suggestions rapides (si champ vide) */}
        {!value && (
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
            <span style={{ color: "var(--t3)", fontSize: "0.78rem", display: "flex", alignItems: "center" }}>Essaie :</span>
            {suggestions.map(s => (
              <button key={s} onClick={() => { onChange(s); inputRef.current?.focus(); }} style={{
                background: "var(--g100)", color: "var(--g700)", border: "none",
                borderRadius: "99px", padding: "0.2rem 0.7rem", fontSize: "0.78rem",
                fontWeight: 600, cursor: "pointer", transition: "background 0.12s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#D1FAE5"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--g100)"}
              >{s}</button>
            ))}
          </div>
        )}

        {/* Résultat de recherche */}
        {value && (
          <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--t3)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{
              background: resultCount > 0 ? "var(--g100)" : "#FEF2F2",
              color: resultCount > 0 ? "var(--g700)" : "#DC2626",
              fontWeight: 700, padding: "1px 8px", borderRadius: "99px",
            }}>{resultCount}</span>
            résultat{resultCount > 1 ? "s" : ""} sur {total} profil{total > 1 ? "s" : ""}
            {resultCount === 0 && <span> — essaie « Couturier » ou « Dakar »</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Bandeau hero ── */
function HeroBanner({ total, images, videos, onInscription }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, var(--g800) 0%, var(--g700) 100%)",
      borderRadius: "var(--radius-card)", padding: "1.5rem",
      marginBottom: "1.25rem", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(240,192,64,0.07)", pointerEvents: "none" }}/>
      <div style={{ position: "relative" }}>
        <div style={{ color: "#F0C040", fontWeight: 800, fontSize: "clamp(1rem,2.5vw,1.2rem)", marginBottom: "0.3rem" }}>
          🎥 Fil des Preuves · Vidéos & Réalisations
        </div>
        <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.87rem", lineHeight: 1.6, marginBottom: "1rem", maxWidth: 500 }}>
          Ici, le talent parle avant tout. <strong style={{ color: "white" }}>{videos} vidéo{videos > 1 ? "s"  : ""}</strong> en action
          et <strong style={{ color: "white" }}>{images} photo{images > 1 ? "s" : ""}</strong> de réalisation.
        </p>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <button className="btn-gold" style={{ fontSize: "0.84rem", padding: "0.5rem 1.15rem" }} onClick={onInscription}>
            + Ajouter ma preuve
          </button>
          <a href="/annuaire" style={{
            fontSize: "0.84rem", padding: "0.5rem 1.15rem", borderRadius: "99px",
            border: "1.5px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.8)",
            textDecoration: "none", fontWeight: 600,
          }}>🎓 Annuaire Diplômés →</a>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   BUILD DU FIL MIXÉ : talents + partenaires
════════════════════════════════════════════════ */
function buildFeed(talents, partenairesActifs) {
  const feed = [];
  talents.forEach((talent, i) => {
    feed.push({ kind: "talent", data: talent });
    const toInsert = partenairesActifs.filter(p => p.insertAfter === i);
    toInsert.forEach(p => feed.push({ kind: "partner", data: p }));
  });
  return feed;
}

/* ════════════════════════════════════════════════
   PAGE PRINCIPALE — FIL VIDÉO
════════════════════════════════════════════════ */
function FilVideoPageContent() {
  const searchParams  = useSearchParams();
  const [metier,      setMetier]      = useState("Tous");
  const [search,      setSearch]      = useState(searchParams.get("q") || "");
  const [videoModal,  setVideoModal]  = useState(null);
  const [inscriModal, setInscriModal] = useState(false);

  // Quand le paramètre ?q= change (depuis la navbar), on met à jour le champ
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) { setSearch(q); setMetier("Tous"); }
  }, [searchParams]);

  const METIERS = metiersOf(PROFILS_VIDEO);

  const talentsFiltres = useMemo(() => {
    const q = search.toLowerCase().trim();
    return PROFILS_VIDEO.filter(p => {
      if (metier !== "Tous" && p.metier !== metier) return false;
      if (q && !`${p.nom} ${p.metier} ${p.ville} ${(p.tags||[]).join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [metier, search]);

  const isFiltered = metier !== "Tous" || search.trim() !== "";

  // Partenaires masqués si filtre actif
  const feedItems = useMemo(() =>
    isFiltered
      ? talentsFiltres.map(d => ({ kind: "talent", data: d }))
      : buildFeed(talentsFiltres, PARTENAIRES)
  , [talentsFiltres, isFiltered]);

  const videos = PROFILS_VIDEO.filter(p => p.mediaType === "video").length;
  const images = PROFILS_VIDEO.filter(p => p.mediaType === "image").length;

  let talentIdx = -1;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <WelcomeBanner />
      <Navbar onInscription={() => setInscriModal(true)} />

      {/* ── Barre de recherche principale ── */}
      <SearchBar
        value={search}
        onChange={(v) => { setSearch(v); setMetier("Tous"); }}
        resultCount={talentsFiltres.length}
        total={PROFILS_VIDEO.length}
      />

      {/* ── Chips métier ── */}
      <div style={{
        overflowX: "auto", display: "flex", gap: "0.5rem",
        padding: "0.65rem 1.25rem", background: "var(--surface)",
        borderBottom: "1px solid var(--border)", scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}>
        {METIERS.map(m => (
          <button key={m} onClick={() => { setMetier(m); setSearch(""); }} style={{
            padding: "0.35rem 1rem", borderRadius: "99px", border: "1.5px solid",
            borderColor: metier === m && !search ? "var(--g700)" : "var(--border)",
            background: metier === m && !search ? "var(--g700)" : "white",
            color: metier === m && !search ? "white" : "var(--t2)",
            fontWeight: 600, fontSize: "0.83rem", cursor: "pointer",
            whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0,
          }}>{m}</button>
        ))}
      </div>

      {/* Corps */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem 1.25rem" }}>
        {!isFiltered && (
          <HeroBanner total={PROFILS_VIDEO.length} videos={videos} images={images} onInscription={() => setInscriModal(true)} />
        )}

        {feedItems.length === 0 ? (
          <div style={{
            background: "var(--surface)", borderRadius: "var(--radius-card)",
            padding: "4rem 1rem", textAlign: "center", color: "var(--t3)",
            border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔍</div>
            <div style={{ fontWeight: 700, color: "var(--t2)", fontSize: "1rem" }}>
              Aucun résultat pour « {search || metier} »
            </div>
            <div style={{ marginTop: "0.35rem", fontSize: "0.88rem" }}>
              Essaie « Chauffeur », « Dakar » ou « Couturier »
            </div>
            <button className="btn-ghost" style={{ marginTop: "1rem" }}
              onClick={() => { setSearch(""); setMetier("Tous"); }}>
              ✕ Effacer la recherche
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {feedItems.map((item, i) => {
              if (item.kind === "partner") {
                return <PartnerCard key={item.data.id} partenaire={item.data} />;
              }
              talentIdx++;
              return (
                <TalentFeedCard
                  key={item.data.id}
                  profil={item.data}
                  index={talentIdx}
                  onWatch={() => item.data.mediaType === "video" && setVideoModal(item.data)}
                  onContact={() => window.open(waLink(item.data.nom, `${item.data.metier} à ${item.data.ville}`), "_blank", "noreferrer")}
                />
              );
            })}

            {/* CTA bas */}
            <div style={{
              background: "var(--surface)", borderRadius: "var(--radius-card)",
              padding: "1.75rem", textAlign: "center",
              border: "1px solid var(--border)", marginTop: "0.5rem",
            }}>
              <div style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>🎬</div>
              <div style={{ fontWeight: 800, color: "var(--t1)", fontSize: "0.98rem", marginBottom: "0.4rem" }}>
                Montre ce que tu sais faire
              </div>
              <div style={{ color: "var(--t3)", fontSize: "0.87rem", marginBottom: "1rem" }}>
                Vidéo de 60 sec ou photo de ta réalisation — c&apos;est toi qui choisis.
              </div>
              <button className="btn-gold" onClick={() => setInscriModal(true)}>
                Créer mon profil gratuitement
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══ SECTION INCLUSION WHATSAPP ════════════ */}
      <div style={{
        background: "linear-gradient(135deg,#075E54 0%,#128C7E 60%,#25D366 100%)",
        padding: "3rem 1.5rem", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Cercles décoratifs */}
        <div style={{ position: "absolute", top: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }}/>
        <div style={{ position: "absolute", bottom: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }}/>

        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          <span style={{
            display: "inline-block", background: "rgba(255,255,255,0.18)",
            color: "white", fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.8px",
            padding: "4px 14px", borderRadius: "99px", marginBottom: "1rem",
          }}>📱 INCLUSION NUMÉRIQUE</span>

          <h2 style={{ color: "white", fontWeight: 900, fontSize: "clamp(1.3rem,3vw,1.85rem)", lineHeight: 1.25, marginBottom: "0.75rem" }}>
            Pas de CV ?<br/>
            <span style={{ color: "#DCFCE7" }}>Inscris-toi par message vocal !</span>
          </h2>

          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 440, margin: "0 auto 1.75rem" }}>
            Envoie-nous simplement un audio ou une photo de ton travail sur WhatsApp.
            Notre équipe crée ton profil pour toi — <strong style={{ color: "white" }}>gratuitement</strong>.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
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
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.28)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)"; }}
            >
              <span style={{ fontSize: "1.5rem" }}>💬</span>
              S&apos;inscrire via WhatsApp
            </a>
            <a
              href="/guide-whatsapp"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: "0.9rem",
                padding: "0.9rem 1.5rem", borderRadius: "99px", textDecoration: "none",
                border: "1.5px solid rgba(255,255,255,0.35)",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              📖 Voir le guide étape par étape →
            </a>
          </div>

          {/* Stats rapides */}
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
            {[["60 sec", "pour s'inscrire"],["0 €","totalement gratuit"],["Audio ou Photo","ta preuve, tu choisis"]].map(([v,l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ color: "white", fontWeight: 900, fontSize: "1.1rem" }}>{v}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.77rem", marginTop: "2px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CTA PARTENAIRE ═════════════════════════ */}
      <div style={{
        background: "linear-gradient(135deg, #071F15 0%, #0D3B2E 50%, #1B4332 100%)",
        padding: "3.5rem 1.5rem", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(240,192,64,0.06)", pointerEvents: "none" }}/>
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(240,192,64,0.04)", pointerEvents: "none" }}/>
        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          <span style={{
            display: "inline-block", background: "linear-gradient(135deg,#C9960F,#F0C040)",
            color: "#3D1C00", fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.8px",
            padding: "4px 14px", borderRadius: "99px", marginBottom: "1.1rem",
            boxShadow: "0 2px 12px rgba(201,150,15,0.45)",
          }}>✦ POUR LES ÉCOLES & ENTREPRISES</span>

          <h2 style={{ color: "white", fontWeight: 900, fontSize: "clamp(1.35rem,3vw,1.9rem)", marginBottom: "0.75rem", lineHeight: 1.25 }}>
            Vous formez les talents de demain ?<br/>
            <span style={{ color: "#F0C040" }}>Rejoignez TalentProof en tant que Partenaire.</span>
          </h2>

          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            Votre école ou entreprise apparaît directement dans le fil des 14 000+ talents africains.
            Statistiques en temps réel, badge officiel, bouton de contact intégré.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/partenaires-dashboard" style={{
              background: "linear-gradient(135deg,#C9960F,#F0C040)", color: "#0D3B2E",
              fontWeight: 900, fontSize: "0.95rem", padding: "0.85rem 2rem",
              borderRadius: "99px", textDecoration: "none",
              boxShadow: "0 4px 20px rgba(201,150,15,0.45)",
              transition: "transform 0.15s, box-shadow 0.15s",
              display: "inline-block",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(201,150,15,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,150,15,0.45)"; }}
            >
              ✦ S&apos;inscrire comme Partenaire
            </a>
            <a href={waTalentProof("je souhaite devenir partenaire TalentProof (école / entreprise).")}
              target="_blank" rel="noreferrer" style={{
                color: "rgba(255,255,255,0.78)", fontWeight: 600, fontSize: "0.9rem",
                padding: "0.85rem 1.75rem", borderRadius: "99px", textDecoration: "none",
                border: "1.5px solid rgba(255,255,255,0.25)",
                transition: "background 0.15s", display: "inline-block",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              💬 Nous contacter sur WhatsApp
            </a>
          </div>

          <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2.25rem" }}>
            {[["3 partenaires", "actifs en ce moment"],["14 000+","talents dans le fil"],["9 pays","couverts"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ color: "#F0C040", fontWeight: 900, fontSize: "1.2rem" }}>{v}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", marginTop: "2px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VideoPlayerModal profil={videoModal} onClose={() => setVideoModal(null)} />
      {inscriModal && <InscriptionModal onClose={() => setInscriModal(false)} />}
      <FloatingHelp />

    </div>
  );
}

export default function FilVideoPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--g700)", fontWeight: 700 }}>Chargement…</div>
      </div>
    }>
      <FilVideoPageContent />
    </Suspense>
  );
}
