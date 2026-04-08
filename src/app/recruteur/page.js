import Link from "next/link";

export const metadata = {
  title: "Espace Recruteur — TalentProof Afrique",
  description: "Trouvez les meilleurs talents africains vérifiés pour vos besoins professionnels.",
};

const AVANTAGES = [
  { icon:"🔍", titre:"Recherche ciblée", desc:"Filtre par métier, ville, disponibilité et type de profil." },
  { icon:"✅", titre:"Profils vérifiés", desc:"Chaque talent est contrôlé par notre équipe avant publication." },
  { icon:"🔒", titre:"Documents sécurisés", desc:"Accède aux diplômes et certificats sur demande approuvée." },
  { icon:"💬", titre:"Contact direct WhatsApp", desc:"Contacte le talent directement, sans intermédiaire." },
  { icon:"📊", titre:"Statistiques en temps réel", desc:"Suis tes contacts et recrutements depuis ton tableau de bord." },
  { icon:"🌍", titre:"9 pays couverts", desc:"Dakar, Abidjan, Accra, Lagos, Bamako, Lomé et plus encore." },
];

const TEMOIGNAGES = [
  { nom:"Aminata Traoré", role:"DRH, PME Abidjan", txt:"En 48h j'ai trouvé un électricien certifié. La qualité des profils est impressionnante.", avatar:"👩‍💼" },
  { nom:"Jean-Baptiste Koné", role:"Propriétaire, Villa Dakar", txt:"J'ai recruté une aide ménagère de confiance. Le système de vérification me rassure.", avatar:"👨‍💼" },
];

export default function RecruteurPage() {
  return (
    <div style={{ minHeight:"100vh", background:"#F0F4F0", fontFamily:"system-ui,sans-serif" }}>

      {/* Header hero */}
      <div style={{ background:"linear-gradient(135deg,#0B1628,#0F2744,#162F52)", padding:"2.5rem 1rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"rgba(240,192,64,.07)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:640, margin:"0 auto", position:"relative" }}>
          <Link href="/" style={{ color:"rgba(255,255,255,0.5)", fontSize:".79rem", textDecoration:"none", display:"inline-block", marginBottom:".8rem" }}>← Retour</Link>
          <div style={{ display:"inline-block", background:"rgba(240,192,64,.14)", color:"#F0C040", fontSize:".66rem", fontWeight:800, letterSpacing:".9px", textTransform:"uppercase", padding:"4px 12px", borderRadius:"99px", marginBottom:".85rem", border:"1px solid rgba(240,192,64,.3)" }}>
            🏢 ESPACE RECRUTEUR
          </div>
          <h1 style={{ fontFamily:"'Sora',sans-serif", color:"#F5F0E8", fontWeight:900, fontSize:"clamp(1.3rem,4vw,1.85rem)", lineHeight:1.25, margin:"0 0 .65rem" }}>
            Recrutez les meilleurs talents<br/>
            <span style={{ color:"#F0C040" }}>d'Afrique en 48 heures.</span>
          </h1>
          <p style={{ color:"rgba(210,225,245,.72)", fontSize:".88rem", lineHeight:1.7, marginBottom:"1.5rem" }}>
            14 000+ profils vérifiés — chauffeurs, artisans, personnels de maison, techniciens.
            Tous disponibles, joignables directement sur WhatsApp.
          </p>
          <div style={{ display:"flex", gap:".65rem", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/inscription-entreprise" style={{ display:"inline-flex", alignItems:"center", gap:".45rem", background:"linear-gradient(135deg,#C9960F,#F0C040)", color:"#0D3B2E", fontWeight:800, fontSize:".9rem", padding:".78rem 1.75rem", borderRadius:"99px", textDecoration:"none", boxShadow:"0 4px 18px rgba(201,150,15,.42)" }}>
              🏢 S'inscrire maintenant
            </Link>
            <Link href="/annuaire" style={{ display:"inline-flex", alignItems:"center", gap:".45rem", color:"rgba(255,255,255,.78)", fontWeight:600, fontSize:".88rem", padding:".78rem 1.4rem", borderRadius:"99px", textDecoration:"none", border:"1.5px solid rgba(255,255,255,.22)" }}>
              🔍 Parcourir l'annuaire
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:820, margin:"0 auto", padding:"1.5rem 1rem" }}>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:".75rem", marginBottom:"1.5rem" }}>
          {[["14 000+","talents inscrits"],["9 pays","couverts"],["48h","délai moyen de recrutement"]].map(([v,l]) => (
            <div key={l} style={{ background:"white", borderRadius:"14px", padding:"1rem .75rem", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:"clamp(1rem,3vw,1.3rem)", color:"#1B6B47" }}>{v}</div>
              <div style={{ color:"#888", fontSize:".72rem", marginTop:"3px" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Avantages */}
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.05rem", color:"#111", marginBottom:".85rem" }}>
          Pourquoi choisir TalentProof ?
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:".75rem", marginBottom:"1.5rem" }}>
          {AVANTAGES.map((a,i) => (
            <div key={i} style={{ background:"white", borderRadius:"14px", padding:"1rem", boxShadow:"0 2px 8px rgba(0,0,0,.05)", display:"flex", gap:".7rem", alignItems:"flex-start" }}>
              <span style={{ fontSize:"1.4rem", flexShrink:0 }}>{a.icon}</span>
              <div>
                <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:".85rem", color:"#111", marginBottom:".18rem" }}>{a.titre}</div>
                <div style={{ color:"#666", fontSize:".78rem", lineHeight:1.55 }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Témoignages */}
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.05rem", color:"#111", marginBottom:".85rem" }}>
          Ils ont recruté via TalentProof
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:".75rem", marginBottom:"1.5rem" }}>
          {TEMOIGNAGES.map((t,i) => (
            <div key={i} style={{ background:"white", borderRadius:"14px", padding:"1.1rem", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
              <div style={{ color:"#F0C040", fontSize:"1.2rem", marginBottom:".5rem" }}>★★★★★</div>
              <p style={{ color:"#444", fontSize:".82rem", lineHeight:1.68, fontStyle:"italic", marginBottom:".65rem" }}>
                « {t.txt} »
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#0B1628,#162F52)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:".8rem", color:"#111" }}>{t.nom}</div>
                  <div style={{ color:"#888", fontSize:".72rem" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background:"linear-gradient(135deg,#071F15,#1B6B47)", borderRadius:"18px", padding:"1.6rem 1rem", textAlign:"center" }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, color:"white", fontSize:"1.05rem", marginBottom:".4rem" }}>
            Prêt à recruter ?
          </div>
          <p style={{ color:"rgba(255,255,255,.65)", fontSize:".82rem", marginBottom:"1.1rem" }}>
            Inscrivez votre entreprise pour accéder aux meilleurs talents d'Afrique.
          </p>
          <div style={{ display:"flex", gap:".65rem", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/inscription-entreprise" style={{ display:"inline-flex", alignItems:"center", gap:".4rem", background:"linear-gradient(135deg,#C9960F,#F0C040)", color:"#0D3B2E", fontWeight:800, fontSize:".88rem", padding:".72rem 1.7rem", borderRadius:"99px", textDecoration:"none", boxShadow:"0 4px 18px rgba(201,150,15,.42)" }}>
              🏢 S'inscrire maintenant
            </Link>
            <Link href="/annuaire" style={{ display:"inline-flex", alignItems:"center", gap:".4rem", color:"white", fontWeight:600, fontSize:".88rem", padding:".72rem 1.5rem", borderRadius:"99px", textDecoration:"none", border:"1.5px solid rgba(255,255,255,.3)" }}>
              🔍 Voir l'annuaire
            </Link>
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:"1.5rem", color:"#AAA", fontSize:".73rem", paddingBottom:"1.5rem" }}>
          <Link href="/" style={{ color:"#1B6B47", textDecoration:"none", fontWeight:600 }}>← TalentProof</Link>
          {" · "}
          <Link href="/mentions-legales" style={{ color:"#888", textDecoration:"none" }}>Mentions légales</Link>
          {" · "}
          <Link href="/confidentialite" style={{ color:"#888", textDecoration:"none" }}>Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}