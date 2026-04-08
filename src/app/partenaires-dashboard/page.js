import Link from "next/link";

export const metadata = {
  title: "Tableau de bord Partenaires — TalentProof Afrique",
  description: "Gérez votre présence sur TalentProof et accédez à vos statistiques de recrutement.",
};

const OFFRES = [
  {
    nom:"Starter",
    prix:"Gratuit",
    couleur:"#6B7280",
    bg:"linear-gradient(135deg,#1F2937,#374151)",
    features:[
      "Badge Partenaire sur votre profil",
      "Apparition dans le fil des talents",
      "Bouton de contact intégré",
      "Jusqu'à 5 demandes d'accès/mois",
    ],
    cta:"Commencer gratuitement",
    ctaHref:"/partenaire"
  },
  {
    nom:"Pro",
    prix:"Sur devis",
    couleur:"#F0C040",
    bg:"linear-gradient(135deg,#1A1200,#3D2800)",
    highlight:true,
    features:[
      "Tout Starter inclus",
      "Statistiques en temps réel",
      "Accès illimité aux documents",
      "Mise en avant dans l'annuaire",
      "Support dédié WhatsApp",
    ],
    cta:"Demander un devis",
    ctaHref:"https://wa.me/2250705503089?text=Bonjour%20TalentProof%2C%20je%20souhaite%20devenir%20partenaire%20officiel%20Pro."
  },
  {
    nom:"Entreprise",
    prix:"Sur mesure",
    couleur:"#4A9EFF",
    bg:"linear-gradient(135deg,#0B1628,#1A3560)",
    features:[
      "Tout Pro inclus",
      "Intégration API",
      "Tableau de bord personnalisé",
      "Accès multi-utilisateurs",
      "SLA et contrat dédié",
    ],
    cta:"Nous contacter",
    ctaHref:"https://wa.me/2250705503089?text=Bonjour%20TalentProof%2C%20je%20souhaite%20devenir%20partenaire%20officiel%20Entreprise."
  }
];

const ETAPES = [
  { num:"01", icon:"📝", titre:"Inscris ton organisation", desc:"Remplis le formulaire partenaire avec le nom, le secteur et le contact de ton école ou entreprise." },
  { num:"02", icon:"✅", titre:"Validation sous 24h", desc:"Notre équipe vérifie ton dossier et active ton badge Partenaire TalentProof." },
  { num:"03", icon:"🚀", titre:"Apparais dans le fil", desc:"Ton organisation est visible par les 14 000+ talents. Tu reçois des contacts directs." },
  { num:"04", icon:"📊", titre:"Suis tes résultats", desc:"Accède à tes statistiques : vues, contacts, demandes d'accès aux documents." },
];

export default function PartenairesDashboardPage() {
  return (
    <div style={{ minHeight:"100vh", background:"#F0F4F0", fontFamily:"system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#071F15,#0D3B2E,#1B4332)", padding:"2.5rem 1rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-70, right:-70, width:260, height:260, borderRadius:"50%", background:"rgba(240,192,64,.06)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-55, left:-55, width:190, height:190, borderRadius:"50%", background:"rgba(240,192,64,.04)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:640, margin:"0 auto", position:"relative" }}>
          <Link href="/" style={{ color:"rgba(255,255,255,0.5)", fontSize:".79rem", textDecoration:"none", display:"inline-block", marginBottom:".8rem" }}>← Retour</Link>
          <div style={{ display:"inline-block", background:"linear-gradient(135deg,#C9960F,#F0C040)", color:"#3D1C00", fontSize:".66rem", fontWeight:900, letterSpacing:".9px", textTransform:"uppercase", padding:"4px 13px", borderRadius:"99px", marginBottom:".9rem", boxShadow:"0 2px 12px rgba(201,150,15,.45)" }}>
            ✦ PROGRAMME PARTENAIRES
          </div>
          <h1 style={{ fontFamily:"'Sora',sans-serif", color:"white", fontWeight:900, fontSize:"clamp(1.3rem,4vw,1.85rem)", lineHeight:1.25, margin:"0 0 .65rem" }}>
            Rejoignez TalentProof<br/>
            <span style={{ color:"#F0C040" }}>en tant que Partenaire Officiel.</span>
          </h1>
          <p style={{ color:"rgba(210,225,245,.68)", fontSize:".88rem", lineHeight:1.7, marginBottom:"1.5rem" }}>
            Votre école ou entreprise apparaît directement dans le fil de 14 000+ talents africains.
            Badge officiel, statistiques en direct, bouton de contact intégré.
          </p>
          <div style={{ display:"flex", gap:".65rem", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/partenaire"
              style={{ display:"inline-flex", alignItems:"center", gap:".45rem", background:"linear-gradient(135deg,#C9960F,#F0C040)", color:"#0D3B2E", fontWeight:800, fontSize:".9rem", padding:".78rem 1.75rem", borderRadius:"99px", textDecoration:"none", boxShadow:"0 4px 18px rgba(201,150,15,.42)" }}>
              ✦ Devenir Partenaire
            </Link>
            <a href="#offres" style={{ display:"inline-flex", alignItems:"center", gap:".45rem", color:"rgba(255,255,255,.75)", fontWeight:600, fontSize:".88rem", padding:".78rem 1.4rem", borderRadius:"99px", textDecoration:"none", border:"1.5px solid rgba(255,255,255,.22)" }}>
              Voir les offres ↓
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:840, margin:"0 auto", padding:"1.5rem 1rem" }}>

        {/* Stats partenaires */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:".75rem", marginBottom:"1.5rem" }}>
          {[["3","partenaires actifs"],["14 000+","talents dans le fil"],["9 pays","couverts"]].map(([v,l]) => (
            <div key={l} style={{ background:"white", borderRadius:"14px", padding:"1rem .75rem", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:"clamp(1.1rem,3vw,1.4rem)", color:"#1B6B47" }}>{v}</div>
              <div style={{ color:"#888", fontSize:".7rem", marginTop:"3px" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Comment ça marche */}
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.05rem", color:"#111", marginBottom:".85rem" }}>
          Comment devenir Partenaire ?
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))", gap:".7rem", marginBottom:"1.5rem" }}>
          {ETAPES.map((e,i) => (
            <div key={i} style={{ background:"white", borderRadius:"14px", padding:"1rem", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:".5rem" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#071F15,#1B6B47)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 }}>{e.icon}</div>
                <span style={{ color:"#1B6B47", fontSize:".65rem", fontWeight:800, letterSpacing:".5px" }}>ÉTAPE {e.num}</span>
              </div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:".83rem", color:"#111", marginBottom:".22rem" }}>{e.titre}</div>
              <div style={{ color:"#666", fontSize:".76rem", lineHeight:1.55 }}>{e.desc}</div>
            </div>
          ))}
        </div>

        {/* Offres */}
        <h2 id="offres" style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.05rem", color:"#111", marginBottom:".85rem" }}>
          Nos offres
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:".85rem", marginBottom:"1.5rem" }}>
          {OFFRES.map((o,i) => (
            <div key={i} style={{ borderRadius:"18px", overflow:"hidden", boxShadow: o.highlight ? "0 6px 28px rgba(201,150,15,.3)" : "0 2px 8px rgba(0,0,0,.06)", border: o.highlight ? `2px solid ${o.couleur}` : "2px solid transparent", display:"flex", flexDirection:"column" }}>
              <div style={{ background:o.bg, padding:"1.1rem 1rem .9rem" }}>
                {o.highlight && (
                  <div style={{ display:"inline-block", background:`${o.couleur}25`, color:o.couleur, border:`1px solid ${o.couleur}55`, fontSize:".6rem", fontWeight:700, padding:"2px 8px", borderRadius:"99px", marginBottom:".4rem" }}>
                    ⭐ RECOMMANDÉ
                  </div>
                )}
                <div style={{ fontFamily:"'Sora',sans-serif", color:"white", fontWeight:900, fontSize:".95rem" }}>{o.nom}</div>
                <div style={{ color:o.couleur, fontWeight:800, fontSize:"1.15rem", marginTop:"2px" }}>{o.prix}</div>
              </div>
              <div style={{ background:"white", padding:"1rem", flex:1, display:"flex", flexDirection:"column" }}>
                <ul style={{ paddingLeft:"1rem", margin:"0 0 1rem", display:"flex", flexDirection:"column", gap:".35rem" }}>
                  {o.features.map((f,j) => (
                    <li key={j} style={{ color:"#444", fontSize:".78rem", lineHeight:1.5 }}>{f}</li>
                  ))}
                </ul>
                <a href={o.ctaHref} target={o.ctaHref.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  style={{ display:"block", textAlign:"center", background: o.highlight ? `linear-gradient(135deg,#C9960F,#F0C040)` : `${o.couleur}18`, color: o.highlight ? "#0D3B2E" : o.couleur, border: o.highlight ? "none" : `1.5px solid ${o.couleur}55`, fontWeight:700, fontSize:".8rem", padding:".6rem", borderRadius:"99px", textDecoration:"none", marginTop:"auto" }}>
                  {o.cta}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact direct */}
        <div style={{ background:"linear-gradient(135deg,#0B1628,#162F52)", borderRadius:"18px", padding:"1.5rem 1rem", textAlign:"center", marginBottom:"1.5rem" }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, color:"white", fontSize:"1rem", marginBottom:".35rem" }}>
            Des questions sur le programme ?
          </div>
          <p style={{ color:"rgba(210,225,245,.65)", fontSize:".82rem", marginBottom:"1rem" }}>
            Notre équipe te répond directement sur WhatsApp.
          </p>
          <a href="https://wa.me/2250705503089?text=Bonjour%20TalentProof%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20le%20programme%20partenaires." target="_blank" rel="noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"#25D366", color:"white", fontWeight:800, fontSize:".88rem", padding:".72rem 1.65rem", borderRadius:"99px", textDecoration:"none", boxShadow:"0 4px 18px rgba(37,211,102,.35)" }}>
            <span style={{ fontSize:"1.15rem" }}>💬</span> Nous écrire sur WhatsApp
          </a>
        </div>

        <div style={{ textAlign:"center", color:"#AAA", fontSize:".73rem", paddingBottom:"1.5rem" }}>
          <Link href="/" style={{ color:"#1B6B47", textDecoration:"none", fontWeight:600 }}>← TalentProof</Link>
          {" · "}
          <Link href="/recruteur" style={{ color:"#888", textDecoration:"none" }}>Espace Recruteur</Link>
          {" · "}
          <Link href="/mentions-legales" style={{ color:"#888", textDecoration:"none" }}>Mentions légales</Link>
          {" · "}
          <Link href="/confidentialite" style={{ color:"#888", textDecoration:"none" }}>Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}