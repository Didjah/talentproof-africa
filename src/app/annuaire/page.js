"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const WA_NUM1 = "2250705503089";
const WA_NUM2 = "2250507939706";

const DISPO_COLOR = { immediate: "#16A34A", "1_month": "#D97706", negotiable: "#6B7280" };
const DISPO_LABEL = { immediate: "Disponible", "1_month": "Dans 1 mois", negotiable: "À négocier" };

const TYPE_STYLE = {
  expert:   { label: "Expert",   bg: "#1D4ED8", color: "white" },
  pratique: { label: "Pratique", bg: "#D97706", color: "white" },
  simple:   { label: "Simple",   bg: "#6B7280", color: "white" },
};

const TYPE_GRAD = {
  expert:   { grad: "linear-gradient(135deg,#0B1628,#1A3560)", accent: "#4A9EFF" },
  pratique: { grad: "linear-gradient(135deg,#1A1000,#3D2800)", accent: "#EAB308" },
  simple:   { grad: "linear-gradient(135deg,#071F15,#1B6B47)", accent: "#F0C040" },
};

function getGrad(type) {
  return TYPE_GRAD[type] || TYPE_GRAD.simple;
}

function parseCompetences(competences) {
  if (!competences) return [];
  if (Array.isArray(competences)) return competences;
  return competences.split(",").map((s) => s.trim()).filter(Boolean);
}

function WaLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.527 5.852L.057 23.5l5.797-1.497A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.162-1.416l-.37-.218-3.441.889.917-3.346-.24-.387A9.944 9.944 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
    </svg>
  );
}

function Modal({ onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", maxWidth: 700, width: "100%", borderRadius: "18px", overflow: "hidden", background: "#111" }}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 10, right: 12, background: "rgba(255,255,255,.12)", border: "none", borderRadius: "50%", width: 34, height: 34, color: "white", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
        >✕</button>
        {children}
      </div>
    </div>
  );
}

function ModalPhoto({ p, onClose }) {
  const phone = p.telephone || WA_NUM1;
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(`Bonjour ${p.prenom}, j'ai vu ta photo sur TalentProof.`)}`;
  const photoUrl = p.preuve_url || p.avatar_url;
  return (
    <Modal onClose={onClose}>
      <div style={{ background: "linear-gradient(135deg,#071F15,#1B6B47)", padding: ".9rem 1.1rem .7rem" }}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, color: "white", fontSize: ".9rem" }}>
          📸 {p.prenom} {p.nom} — Réalisation
        </div>
      </div>
      {photoUrl ? (
        <img src={photoUrl} alt={`Photo de ${p.prenom}`} style={{ width: "100%", maxHeight: 480, objectFit: "cover", display: "block" }} />
      ) : (
        <div style={{ background: "linear-gradient(135deg,#1A0018,#3D0038)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3.5rem 1rem", textAlign: "center" }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: ".9rem" }}>Photo en cours de validation</div>
        </div>
      )}
      <div style={{ padding: ".8rem 1.1rem", background: "#1a1a1a", display: "flex", justifyContent: "flex-end" }}>
        <a href={waUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", background: "#25D366", color: "white", fontWeight: 700, fontSize: ".79rem", padding: ".5rem 1rem", borderRadius: "99px", textDecoration: "none" }}>
          <WaLogo size={15} /> Contacter {p.prenom}
        </a>
      </div>
    </Modal>
  );
}

function CarteProfilCard({ p }) {
  const [modal, setModal] = useState(null);
  const phone = p.telephone || WA_NUM1;
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(`Bonjour ${p.prenom}, j'ai vu ton profil sur TalentProof et je souhaite te contacter.`)}`;
  const ts = TYPE_STYLE[p.typeProfile] || TYPE_STYLE.simple;
  const { grad, accent } = getGrad(p.typeProfile);
  const tags = parseCompetences(p.competences);
  const photoUrl = p.avatar_url || p.preuve_url;
  const hasPhoto = !!(p.preuve_url || p.avatar_url);

  return (
    <>
      {modal === "photo" && <ModalPhoto p={p} onClose={() => setModal(null)} />}

      <Link href={`/annuaire/${p.id}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          style={{ background: "white", borderRadius: "18px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.08)", transition: "transform .2s,box-shadow .2s", display: "flex", flexDirection: "column", cursor: "pointer" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1),0 12px 32px rgba(0,0,0,.12)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.08)"; }}
        >
          {/* Bannière */}
          <div style={{ height: 90, background: grad, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 30%,${accent}22 0%,transparent 65%)` }} />
            {photoUrl ? (
              <img src={photoUrl} alt={`${p.prenom} ${p.nom}`} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: `2px solid ${accent}`, position: "relative", zIndex: 1 }} />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", border: `2px solid ${accent}`, position: "relative", zIndex: 1 }}>👤</div>
            )}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />

            {/* Badge type */}
            <div style={{ position: "absolute", top: ".5rem", left: ".55rem" }}>
              <span style={{ background: ts.bg, color: ts.color, fontSize: ".58rem", fontWeight: 700, padding: "3px 9px", borderRadius: "99px", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
                {ts.label}
              </span>
            </div>

            {/* Badge Photo */}
            {hasPhoto && (
              <div style={{ position: "absolute", top: ".5rem", right: ".55rem" }}>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setModal("photo"); }}
                  style={{ background: "rgba(15,118,110,.9)", color: "white", fontSize: ".58rem", fontWeight: 700, padding: "3px 9px", borderRadius: "99px", border: "none", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,.3)", transition: "transform .15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  📸 Photo
                </button>
              </div>
            )}
          </div>

          {/* Corps */}
          <div style={{ padding: ".9rem .95rem 1rem", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".32rem" }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: ".92rem", color: "#111" }}>
                  {p.prenom} {p.nom}
                </div>
                <div style={{ color: "#1B6B47", fontWeight: 700, fontSize: ".78rem", marginTop: "2px" }}>
                  {p.metier}{p.experience ? ` · ${p.experience}` : ""}
                </div>
                <div style={{ color: "#9CA3AF", fontSize: ".72rem" }}>
                  📍 {[p.ville, p.pays].filter(Boolean).join(", ")}
                </div>
                {p.niveau_etude && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: ".28rem", background: "#F3F4F6", color: "#6B7280", fontSize: ".67rem", fontWeight: 600, padding: "2px 8px", borderRadius: "99px", marginTop: "3px" }}>
                    🎓 {p.niveau_etude}
                  </div>
                )}
              </div>
              {p.disponibilite && (
                <span style={{ fontSize: ".65rem", fontWeight: 700, color: DISPO_COLOR[p.disponibilite] || "#6B7280", display: "flex", alignItems: "center", gap: 3, flexShrink: 0, marginLeft: ".5rem" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: DISPO_COLOR[p.disponibilite] || "#6B7280", display: "inline-block" }} />
                  {DISPO_LABEL[p.disponibilite] || p.disponibilite}
                </span>
              )}
            </div>

            {/* Compétences */}
            {tags.length > 0 && (
              <div style={{ display: "flex", gap: ".27rem", flexWrap: "wrap", margin: ".42rem 0 .52rem" }}>
                {tags.slice(0, 4).map((t) => (
                  <span key={t} style={{ background: "#F0FDF4", color: "#166534", fontSize: ".66rem", fontWeight: 600, padding: "2px 7px", borderRadius: "99px", border: "1px solid #D1FAE5" }}>{t}</span>
                ))}
                {tags.length > 4 && (
                  <span style={{ background: "#F3F4F6", color: "#6B7280", fontSize: ".66rem", fontWeight: 600, padding: "2px 7px", borderRadius: "99px" }}>+{tags.length - 4}</span>
                )}
              </div>
            )}

            {/* Bouton WhatsApp */}
            <div style={{ marginTop: "auto", paddingTop: ".52rem" }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem", background: "#25D366", color: "white", fontWeight: 700, fontSize: ".82rem", padding: ".6rem", borderRadius: "99px", textDecoration: "none", boxShadow: "0 2px 8px rgba(37,211,102,.25)", transition: "transform .15s,box-shadow .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,211,102,.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,211,102,.25)"; }}
              >
                <WaLogo size={16} /> Contacter via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default function AnnuairePage() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchMetier, setSearchMetier] = useState("");
  const [filterType, setFilterType] = useState("tous");

  useEffect(() => {
    async function loadTalents() {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from("talents")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) {
        setError(err.message);
      } else {
        setTalents(data || []);
      }
      setLoading(false);
    }
    loadTalents();
  }, []);

  const metiers = [...new Set(talents.map((t) => t.metier).filter(Boolean))].sort();

  const filtered = talents.filter((t) => {
    const matchMetier = !searchMetier || (t.metier || "").toLowerCase().includes(searchMetier.toLowerCase());
    const matchType = filterType === "tous" || t.typeProfile === filterType;
    return matchMetier && matchType;
  });

  return (
    <main style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Inter',sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#0B1628,#162F52)", padding: "2.5rem 1.5rem 2rem", textAlign: "center" }}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem,4vw,2.2rem)", color: "white", marginBottom: ".4rem" }}>
          Annuaire des Talents
        </div>
        <div style={{ color: "rgba(255,255,255,.6)", fontSize: ".9rem", marginBottom: "1.5rem" }}>
          {loading ? "Chargement…" : `${filtered.length} talent${filtered.length !== 1 ? "s" : ""} trouvé${filtered.length !== 1 ? "s" : ""}`}
        </div>

        {/* Filtres */}
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", justifyContent: "center", maxWidth: 700, margin: "0 auto" }}>
          <input
            type="text"
            placeholder="🔍 Rechercher un métier…"
            value={searchMetier}
            onChange={(e) => setSearchMetier(e.target.value)}
            style={{ flex: "1 1 200px", padding: ".65rem 1rem", borderRadius: "99px", border: "none", fontSize: ".88rem", outline: "none", background: "rgba(255,255,255,.12)", color: "white", backdropFilter: "blur(8px)" }}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: ".65rem 1rem", borderRadius: "99px", border: "none", fontSize: ".88rem", outline: "none", background: "rgba(255,255,255,.12)", color: "white", cursor: "pointer", backdropFilter: "blur(8px)" }}
          >
            <option value="tous" style={{ background: "#1A3560" }}>Tous les types</option>
            <option value="expert" style={{ background: "#1A3560" }}>Expert</option>
            <option value="pratique" style={{ background: "#1A3560" }}>Pratique</option>
            <option value="simple" style={{ background: "#1A3560" }}>Simple</option>
          </select>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#6B7280" }}>
            <div style={{ fontSize: "2rem", marginBottom: ".75rem" }}>⏳</div>
            <div style={{ fontWeight: 600 }}>Chargement des talents…</div>
          </div>
        )}

        {!loading && error && (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#DC2626" }}>
            <div style={{ fontSize: "2rem", marginBottom: ".75rem" }}>⚠️</div>
            <div style={{ fontWeight: 600 }}>Erreur : {error}</div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#6B7280" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: ".4rem" }}>Aucun talent trouvé</div>
            <div style={{ fontSize: ".85rem" }}>Modifie les filtres pour voir plus de résultats.</div>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.25rem" }}>
            {filtered.map((p) => (
              <CarteProfilCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
