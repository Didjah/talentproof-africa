"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import GlobalHeader from "@/components/GlobalHeader";

const WA_NUM = "2250507939706";

function WaLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.527 5.852L.057 23.5l5.797-1.497A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.162-1.416l-.37-.218-3.441.889.917-3.346-.24-.387A9.944 9.944 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
    </svg>
  );
}

export default function AnnoncesPartenaires() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const charger = async () => {
      const { data: anns, error } = await supabase
        .from("annonces")
        .select("*, auteur_id, auteur_type")
        .eq("statut", "active")
        .eq("auteur_type", "partenaire")
        .order("created_at", { ascending: false });

      if (error || !anns || anns.length === 0) {
        setLoading(false);
        return;
      }

      const partIds = [...new Set(anns.map(a => a.auteur_id))];
      const { data: parts } = await supabase
        .from("partenaires")
        .select("id,contact_telephone,nom_organisation")
        .in("id", partIds);

      const partMap = Object.fromEntries((parts || []).map(p => [p.id, p]));

      setAnnonces(anns.map(a => ({
        ...a,
        _auteur: partMap[a.auteur_id] || null,
      })));
      setLoading(false);
    };
    charger();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0" }}>
      <GlobalHeader />

      {/* En-tête */}
      <div style={{
        background: "linear-gradient(135deg,#071F15,#0D3B2E,#1B4332)",
        padding: "2.5rem 1rem 2rem",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: ".5rem",
            background: "rgba(240,192,64,.12)", border: "1px solid rgba(240,192,64,.28)",
            borderRadius: "99px", padding: ".35rem .95rem", marginBottom: ".75rem",
          }}>
            <span style={{ fontSize: ".72rem", color: "#F0C040", fontWeight: 700, letterSpacing: ".06em" }}>
              🤝 OFFRES PARTENAIRES
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 900,
            fontSize: "clamp(1.3rem,4vw,1.9rem)", color: "white",
            marginBottom: ".5rem", lineHeight: 1.25,
          }}>
            Offres Partenaires
          </h1>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".9rem", margin: 0 }}>
            Annonces publiées directement par nos partenaires vérifiés (écoles, organisations…)
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6B7280" }}>
            Chargement des offres…
          </div>
        ) : annonces.length === 0 ? (
          <div style={{
            background: "white", borderRadius: "18px", padding: "3rem 1rem",
            textAlign: "center", color: "#9CA3AF", border: "1px solid #E5E7EB",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>🤝</div>
            <div style={{ fontWeight: 700, color: "#444", fontSize: ".95rem" }}>
              Aucune offre partenaire pour le moment
            </div>
            <p style={{ fontSize: ".85rem", marginTop: ".5rem" }}>
              Les annonces des partenaires apparaîtront ici dès qu&apos;elles seront publiées.
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}>
            {annonces.map(a => {
              const tel = a._auteur?.contact_telephone;
              const organisation = a._auteur?.nom_organisation || "Partenaire";
              const waUrl = tel
                ? `https://wa.me/${tel.replace(/\D/g, "")}?text=${encodeURIComponent(`Bonjour, j'ai vu votre offre "${a.titre}" sur TalentProof et je suis intéressé(e).`)}`
                : `https://wa.me/${WA_NUM}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par l'offre "${a.titre}" sur TalentProof.`)}`;

              return (
                <div
                  key={a.id}
                  style={{
                    background: "#fff", borderRadius: "18px", padding: "1.2rem 1.25rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,.08)", border: "1px solid #E5E7EB",
                    display: "flex", flexDirection: "column", gap: ".7rem",
                    transition: "box-shadow .2s,transform .2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.08)"; e.currentTarget.style.transform = "none"; }}
                >
                  {/* Badges */}
                  <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                    {a.urgent && (
                      <span style={{ background: "#FEF2F2", color: "#DC2626", fontSize: ".68rem", fontWeight: 800, padding: "3px 9px", borderRadius: "99px", border: "1px solid #FECACA" }}>
                        🔴 URGENT
                      </span>
                    )}
                    <span style={{ background: "#F0FDF4", color: "#15803D", fontSize: ".68rem", fontWeight: 700, padding: "3px 9px", borderRadius: "99px", border: "1px solid #86EFAC" }}>
                      🤝 {organisation}
                    </span>
                  </div>

                  {/* Titre */}
                  <div>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: ".95rem", color: "#111", marginBottom: ".3rem", lineHeight: 1.25 }}>
                      {a.titre}
                    </div>
                    <div style={{ color: "#6B7280", fontSize: ".78rem" }}>
                      {a.metier && <>💼 {a.metier}&nbsp;·&nbsp;</>}
                      {a.ville && <>📍 {a.ville}</>}
                    </div>
                  </div>

                  {/* Description */}
                  {a.description && (
                    <p style={{
                      color: "#374151", fontSize: ".82rem", lineHeight: 1.65, margin: 0,
                      display: "-webkit-box", WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {a.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: ".5rem", flexWrap: "wrap" }}>
                    <span style={{ color: "#9CA3AF", fontSize: ".72rem" }}>
                      {new Date(a.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <a
                      href={waUrl} target="_blank" rel="noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: ".35rem",
                        background: "#25D366", color: "white", fontWeight: 700, fontSize: ".75rem",
                        padding: ".42rem .9rem", borderRadius: "99px", textDecoration: "none",
                        whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(37,211,102,.3)",
                      }}
                    >
                      <WaLogo size={14} /> Contacter
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
