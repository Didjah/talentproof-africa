"use client";
import Link from "next/link";
import { CheckCircle, Users, Zap, Shield, Globe, TrendingUp } from "lucide-react";

const VALEURS = [
  {
    icon: <Shield size={28} color="#F0C040" strokeWidth={2.5}/>,
    titre: "Vérification rigoureuse",
    desc: "Chaque profil est vérifié par notre équipe sous 24h. Badge officiel pour les talents authentiques."
  },
  {
    icon: <Zap size={28} color="#F0C040" strokeWidth={2.5}/>,
    titre: "Rapidité de mise en relation",
    desc: "Contact direct via WhatsApp. Pas d'intermédiaire, pas de délai. Recrutez en quelques clics."
  },
  {
    icon: <Users size={28} color="#F0C040" strokeWidth={2.5}/>,
    titre: "Inclusif & accessible",
    desc: "Diplômé ou pas — tout le monde a sa place. La preuve, c'est ce que tu sais faire."
  },
  {
    icon: <Globe size={28} color="#F0C040" strokeWidth={2.5}/>,
    titre: "Couverture panafricaine",
    desc: "9 pays couverts, 14 000+ talents. Du Sénégal au Nigeria, de la Côte d'Ivoire au Ghana."
  }
];

const CHIFFRES = [
  { valeur: "14 000+", label: "Talents inscrits", icon: "👥" },
  { valeur: "9 pays", label: "Couverts en Afrique", icon: "🌍" },
  { valeur: "24h", label: "Validation des profils", icon: "⚡" },
  { valeur: "3", label: "Partenaires actifs", icon: "🤝" },
  { valeur: "100%", label: "Gratuit pour les talents", icon: "🎁" },
  { valeur: "0", label: "Intermédiaire", icon: "🚀" }
];

const ETAPES = [
  {
    num: "01",
    titre: "Le talent s'inscrit",
    desc: "Vidéo de 60 sec ou photo de ses réalisations. Pas besoin de diplôme.",
    color: "#2563EB"
  },
  {
    num: "02",
    titre: "Nous vérifions",
    desc: "Notre équipe valide le profil sous 24h. Badge officiel attribué.",
    color: "#7C3AED"
  },
  {
    num: "03",
    titre: "Visible dans le fil",
    desc: "Le talent apparaît dans l'annuaire. Les recruteurs le contactent directement.",
    color: "#16A34A"
  },
  {
    num: "04",
    titre: "Mise en relation",
    desc: "Contact WhatsApp direct. Pas de formulaire, pas d'attente.",
    color: "#F0C040"
  }
];

const POURQUOI = [
  {
    question: "Pourquoi TalentProof ?",
    reponse: "En Afrique, des millions de talents qualifiés restent invisibles faute de diplôme ou de réseau. TalentProof change la donne : ici, la preuve c'est ce que tu sais faire."
  },
  {
    question: "Comment ça marche ?",
    reponse: "Simple : le talent montre son savoir-faire (vidéo ou photo), nous vérifions, et il devient visible par des milliers de recruteurs. Contact direct via WhatsApp."
  },
  {
    question: "C'est vraiment gratuit ?",
    reponse: "Oui, 100% gratuit pour les talents. Les recruteurs et partenaires ont accès à des offres premium pour plus de visibilité et de fonctionnalités."
  },
  {
    question: "Qui peut s'inscrire ?",
    reponse: "Tout le monde ! Chauffeur, aide ménagère, couturière, développeur, mécanicien... Diplômé ou autodidacte, tu as ta place sur TalentProof."
  }
];

export default function AboutPage() {
  return (
    <div style={{ minHeight:"100vh", background:"#F0F4F0", fontFamily:"system-ui,sans-serif" }}>
      
      {/* Hero Section */}
      <div style={{ background:"linear-gradient(135deg,#071F15,#0D3B2E,#1B4332)", padding:"3rem 1rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, borderRadius:"50%", background:"rgba(240,192,64,.06)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-60, left:-60, width:220, height:220, borderRadius:"50%", background:"rgba(240,192,64,.04)", pointerEvents:"none" }}/>
        
        <div style={{ maxWidth:720, margin:"0 auto", position:"relative" }}>
          <Link href="/" style={{ color:"rgba(255,255,255,0.5)", fontSize:".82rem", textDecoration:"none", display:"inline-block", marginBottom:"1rem" }}>
            ← Retour à l'accueil
          </Link>
          
          <div style={{ display:"inline-block", background:"linear-gradient(135deg,#C9960F,#F0C040)", color:"#3D1C00", fontSize:".68rem", fontWeight:900, letterSpacing:".9px", textTransform:"uppercase", padding:"5px 14px", borderRadius:"99px", marginBottom:"1rem", boxShadow:"0 2px 12px rgba(201,150,15,.45)" }}>
            ✦ À PROPOS
          </div>
          
          <h1 style={{ fontFamily:"'Sora',sans-serif", color:"white", fontWeight:900, fontSize:"clamp(1.5rem,5vw,2.2rem)", lineHeight:1.2, margin:"0 0 .8rem" }}>
            La preuve par le talent<br/>
            <span style={{ color:"#F0C040" }}>pour l'Afrique.</span>
          </h1>
          
          <p style={{ color:"rgba(210,225,245,.72)", fontSize:".95rem", lineHeight:1.75, maxWidth:580, margin:"0 auto 2rem" }}>
            TalentProof est la première plateforme africaine qui valorise les compétences réelles plutôt que les diplômes. 
            <strong style={{ color:"white" }}> Ton talent compte, diplôme ou pas.</strong>
          </p>

          <div style={{ display:"flex", gap:".7rem", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/inscription-talent" style={{ display:"inline-flex", alignItems:"center", gap:".4rem", background:"linear-gradient(135deg,#C9960F,#F0C040)", color:"#0D3B2E", fontWeight:800, fontSize:".9rem", padding:".8rem 1.7rem", borderRadius:"99px", textDecoration:"none", boxShadow:"0 4px 18px rgba(201,150,15,.42)" }}>
              🎙️ Créer mon profil
            </Link>
            <Link href="/annuaire" style={{ display:"inline-flex", alignItems:"center", gap:".4rem", color:"rgba(255,255,255,.8)", fontWeight:700, fontSize:".88rem", padding:".8rem 1.5rem", borderRadius:"99px", textDecoration:"none", border:"1.5px solid rgba(255,255,255,.25)" }}>
              📋 Voir l'annuaire
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"2rem 1rem" }}>

        {/* Chiffres clés */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:".85rem", marginBottom:"2.5rem" }}>
          {CHIFFRES.map((c, i) => (
            <div key={i} style={{ background:"white", borderRadius:"16px", padding:"1.2rem 1rem", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,.05)", border:"1px solid #E5E7EB" }}>
              <div style={{ fontSize:"2rem", marginBottom:".3rem" }}>{c.icon}</div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:"1.3rem", color:"#1B6B47", marginBottom:".15rem" }}>{c.valeur}</div>
              <div style={{ color:"#666", fontSize:".75rem", fontWeight:600 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Notre mission */}
        <div style={{ background:"white", borderRadius:"20px", padding:"2rem 1.5rem", marginBottom:"2rem", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.3rem", color:"#111", marginBottom:".6rem", textAlign:"center" }}>
            🎯 Notre Mission
          </h2>
          <p style={{ color:"#555", fontSize:".92rem", lineHeight:1.8, textAlign:"center", maxWidth:650, margin:"0 auto 1.5rem" }}>
            Rendre visible <strong style={{ color:"#1B6B47" }}>chaque talent africain</strong>, qu'il soit diplômé ou autodidacte. 
            Créer une infrastructure de confiance qui permet aux recruteurs de trouver rapidement les bonnes personnes, 
            et aux talents de prouver leurs compétences sans barrière administrative.
          </p>
          
          <div style={{ background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)", border:"1.5px solid #86EFAC", borderRadius:"14px", padding:"1.2rem", textAlign:"center" }}>
            <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1rem", color:"#065F46", marginBottom:".4rem" }}>
              💡 Le principe TalentProof
            </div>
            <p style={{ color:"#047857", fontSize:".85rem", lineHeight:1.7, margin:0 }}>
              <strong>Pas de CV compliqué. Pas de lettre de motivation.</strong><br/>
              Juste une vidéo de 60 secondes ou une photo de ton travail. C'est ça, ta preuve.
            </p>
          </div>
        </div>

        {/* Nos valeurs */}
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.2rem", color:"#111", marginBottom:"1.2rem", textAlign:"center" }}>
          ✨ Nos Valeurs
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"1rem", marginBottom:"2.5rem" }}>
          {VALEURS.map((v, i) => (
            <div key={i} style={{ background:"white", borderRadius:"16px", padding:"1.4rem", boxShadow:"0 2px 8px rgba(0,0,0,.05)", border:"1px solid #E5E7EB" }}>
              <div style={{ marginBottom:".8rem" }}>{v.icon}</div>
              <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:".95rem", color:"#111", marginBottom:".4rem" }}>
                {v.titre}
              </h3>
              <p style={{ color:"#666", fontSize:".82rem", lineHeight:1.65, margin:0 }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Comment ça marche */}
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.2rem", color:"#111", marginBottom:"1.2rem", textAlign:"center" }}>
          🔄 Comment ça marche ?
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1rem", marginBottom:"2.5rem" }}>
          {ETAPES.map((e, i) => (
            <div key={i} style={{ background:"white", borderRadius:"16px", padding:"1.3rem", boxShadow:"0 2px 8px rgba(0,0,0,.05)", border:"1px solid #E5E7EB", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, width:"100%", height:4, background:`linear-gradient(90deg,${e.color},${e.color}99)` }}/>
              <div style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:".7rem" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:`${e.color}18`, border:`2px solid ${e.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:".85rem", color:e.color, flexShrink:0 }}>
                  {e.num}
                </div>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:".9rem", color:"#111", margin:0 }}>
                  {e.titre}
                </h3>
              </div>
              <p style={{ color:"#666", fontSize:".8rem", lineHeight:1.6, margin:0 }}>
                {e.desc}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.2rem", color:"#111", marginBottom:"1.2rem", textAlign:"center" }}>
          ❓ Questions fréquentes
        </h2>
        <div style={{ display:"flex", flexDirection:"column", gap:".9rem", marginBottom:"2.5rem" }}>
          {POURQUOI.map((faq, i) => (
            <div key={i} style={{ background:"white", borderRadius:"16px", padding:"1.3rem", boxShadow:"0 2px 8px rgba(0,0,0,.05)", border:"1px solid #E5E7EB" }}>
              <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:".92rem", color:"#1B6B47", marginBottom:".5rem" }}>
                {faq.question}
              </h3>
              <p style={{ color:"#555", fontSize:".85rem", lineHeight:1.7, margin:0 }}>
                {faq.reponse}
              </p>
            </div>
          ))}
        </div>

        {/* Notre vision */}
        <div style={{ background:"linear-gradient(135deg,#0B1628,#162F52)", borderRadius:"20px", padding:"2.5rem 1.5rem", textAlign:"center", position:"relative", overflow:"hidden", marginBottom:"2rem" }}>
          <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", background:"rgba(240,192,64,.08)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-40, left:-40, width:160, height:160, borderRadius:"50%", background:"rgba(240,192,64,.06)", pointerEvents:"none" }}/>
          
          <div style={{ position:"relative", maxWidth:600, margin:"0 auto" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:".8rem" }}>🚀</div>
            <h2 style={{ fontFamily:"'Sora',sans-serif", color:"white", fontWeight:900, fontSize:"1.3rem", marginBottom:".7rem" }}>
              Notre Vision pour 2027
            </h2>
            <p style={{ color:"rgba(210,225,245,.75)", fontSize:".9rem", lineHeight:1.8, marginBottom:"1.5rem" }}>
              Devenir <strong style={{ color:"#F0C040" }}>la référence panafricaine</strong> pour la mise en relation talents-recruteurs. 
              100 000 talents vérifiés, présence dans 20 pays, partenariats avec les plus grandes écoles et entreprises du continent.
            </p>
            
            <div style={{ display:"flex", gap:"2rem", justifyContent:"center", flexWrap:"wrap" }}>
              {[
                ["100K", "talents visés"],
                ["20 pays", "couverture"],
                ["500+", "partenaires"]
              ].map(([v, l]) => (
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Sora',sans-serif", color:"#F0C040", fontWeight:900, fontSize:"1.4rem", textShadow:"0 0 20px rgba(240,192,64,.4)" }}>{v}</div>
                  <div style={{ color:"rgba(255,255,255,.5)", fontSize:".75rem", marginTop:"3px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* L'équipe */}
        <div style={{ background:"white", borderRadius:"20px", padding:"2rem 1.5rem", marginBottom:"2rem", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.2rem", color:"#111", marginBottom:".6rem", textAlign:"center" }}>
            👨‍💼 L'Équipe TalentProof
          </h2>
          <p style={{ color:"#666", fontSize:".88rem", lineHeight:1.75, textAlign:"center", maxWidth:600, margin:"0 auto 1.5rem" }}>
            Une équipe passionnée et engagée pour révolutionner le recrutement en Afrique. 
            Basés à Abidjan, nous travaillons chaque jour pour rendre visible chaque talent du continent.
          </p>
          
          <div style={{ display:"flex", gap:"1.2rem", justifyContent:"center", flexWrap:"wrap" }}>
            <div style={{ background:"#F9FAFB", borderRadius:"14px", padding:"1.2rem", textAlign:"center", minWidth:180, border:"1px solid #E5E7EB" }}>
              <div style={{ width:70, height:70, borderRadius:"50%", background:"linear-gradient(135deg,#1B6B47,#2D9A68)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem", margin:"0 auto .6rem" }}>
                👨‍💼
              </div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:".9rem", color:"#111", marginBottom:".2rem" }}>
                Fondateur & CEO
              </div>
              <div style={{ color:"#666", fontSize:".78rem" }}>
                Vision & Stratégie
              </div>
            </div>

            <div style={{ background:"#F9FAFB", borderRadius:"14px", padding:"1.2rem", textAlign:"center", minWidth:180, border:"1px solid #E5E7EB" }}>
              <div style={{ width:70, height:70, borderRadius:"50%", background:"linear-gradient(135deg,#C9960F,#F0C040)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem", margin:"0 auto .6rem" }}>
                👩‍💻
              </div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:".9rem", color:"#111", marginBottom:".2rem" }}>
                Équipe Tech
              </div>
              <div style={{ color:"#666", fontSize:".78rem" }}>
                Développement & Innovation
              </div>
            </div>

            <div style={{ background:"#F9FAFB", borderRadius:"14px", padding:"1.2rem", textAlign:"center", minWidth:180, border:"1px solid #E5E7EB" }}>
              <div style={{ width:70, height:70, borderRadius:"50%", background:"linear-gradient(135deg,#2563EB,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem", margin:"0 auto .6rem" }}>
                👥
              </div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:".9rem", color:"#111", marginBottom:".2rem" }}>
                Équipe Validation
              </div>
              <div style={{ color:"#666", fontSize:".78rem" }}>
                Vérification des profils
              </div>
            </div>
          </div>
        </div>

        {/* Call to action final */}
        <div style={{ background:"linear-gradient(135deg,#FEF9EE,#FFF7E0)", border:"2px solid #FCD34D", borderRadius:"20px", padding:"2rem 1.5rem", textAlign:"center" }}>
          <div style={{ fontSize:"2.8rem", marginBottom:".6rem" }}>🤝</div>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:"1.25rem", color:"#92400E", marginBottom:".6rem" }}>
            Rejoins la communauté TalentProof
          </h2>
          <p style={{ color:"#B45309", fontSize:".88rem", lineHeight:1.7, marginBottom:"1.5rem", maxWidth:500, margin:"0 auto 1.5rem" }}>
            Que tu sois talent, recruteur, école ou entreprise — il y a une place pour toi sur TalentProof.
          </p>
          
          <div style={{ display:"flex", gap:".7rem", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/inscription-talent" style={{ display:"inline-flex", alignItems:"center", gap:".4rem", background:"linear-gradient(135deg,#1B6B47,#2D9A68)", color:"white", fontWeight:800, fontSize:".88rem", padding:".7rem 1.5rem", borderRadius:"99px", textDecoration:"none", boxShadow:"0 4px 16px rgba(27,107,71,.32)" }}>
              🎙️ Je suis un talent
            </Link>
            <Link href="/inscription-entreprise" style={{ display:"inline-flex", alignItems:"center", gap:".4rem", background:"white", color:"#1B6B47", fontWeight:700, fontSize:".88rem", padding:".7rem 1.5rem", borderRadius:"99px", textDecoration:"none", border:"1.5px solid #D1FAE5" }}>
              🏢 Je recrute
            </Link>
            <Link href="/partenaire" style={{ display:"inline-flex", alignItems:"center", gap:".4rem", background:"white", color:"#1B6B47", fontWeight:700, fontSize:".88rem", padding:".7rem 1.5rem", borderRadius:"99px", textDecoration:"none", border:"1.5px solid #D1FAE5" }}>
              🤝 Devenir partenaire
            </Link>
          </div>
        </div>

        {/* Footer links */}
        <div style={{ textAlign:"center", marginTop:"2rem", paddingTop:"1.5rem", borderTop:"1px solid #E5E7EB" }}>
          <div style={{ display:"flex", gap:".6rem", justifyContent:"center", flexWrap:"wrap", fontSize:".78rem", marginBottom:".6rem" }}>
            {[
              ["Accueil", "/"],
              ["Annuaire", "/annuaire"],
              ["Recruteur", "/recruteur"],
              ["Partenaires", "/partenaires-dashboard"],
              ["Mentions légales", "/mentions-legales"],
              ["Confidentialité", "/confidentialite"]
            ].map(([label, href]) => (
              <Link key={href} href={href} style={{ color:"#666", textDecoration:"none", transition:"color .15s" }} onMouseEnter={e => e.currentTarget.style.color = "#1B6B47"} onMouseLeave={e => e.currentTarget.style.color = "#666"}>
                {label}
              </Link>
            ))}
          </div>
          <div style={{ color:"#9CA3AF", fontSize:".72rem" }}>
            © {new Date().getFullYear()} TalentProof Afrique — Tous droits réservés
          </div>
        </div>
      </div>
    </div>
  );
}
