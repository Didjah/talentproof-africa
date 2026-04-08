// app/guide/page.js
"use client";
import Link from "next/link";

const ETAPES = [
  {
    num: "01",
    icon: "🎙️",
    titre: "Enregistre ton message vocal",
    desc: "Appuie sur le bouton micro sur la page d'accueil. Tu as 60 secondes pour dire : ton prénom, ton métier, ta ville, et ton expérience. Exemple : « Bonjour, je m'appelle Moussa, je suis chauffeur VTC à Dakar depuis 7 ans. »",
    tips: ["Parle clairement et lentement", "Trouve un endroit calme", "Pas besoin d'être parfait !"],
    color: "#F0C040",
    bg: "linear-gradient(135deg,#1A1200,#3D2800)"
  },
  {
    num: "02",
    icon: "📸",
    titre: "Ajoute une photo de ton travail",
    desc: "Prends en photo une réalisation concrète : ta voiture, une robe que tu as cousue, une installation électrique, un repas que tu as cuisiné. Cette photo sera ta \"preuve\" visible par les recruteurs.",
    tips: ["Bonne lumière naturelle", "Photo nette et cadrée", "Montre ton travail fini"],
    color: "#4A9EFF",
    bg: "linear-gradient(135deg,#0B1628,#1A3560)"
  },
  {
    num: "03",
    icon: "📱",
    titre: "Envoie via WhatsApp (si tu préfères)",
    desc: "Si tu n'as pas accès à internet facilement, envoie juste un message vocal ou une photo sur notre WhatsApp TalentProof. Notre équipe crée ton profil pour toi — gratuitement, en moins de 24h.",
    tips: ["Gratuit et sans inscription", "Réponse sous 24h", "Équipe disponible 7j/7"],
    color: "#25D366",
    bg: "linear-gradient(135deg,#071F15,#1B6B47)"
  },
  {
    num: "04",
    icon: "✅",
    titre: "Ton profil est en ligne !",
    desc: "Une fois ton profil créé, les recruteurs et particuliers peuvent te trouver sur TalentProof. Ils peuvent voir ta vidéo ou photo, et te contacter directement sur WhatsApp. Ton profil reste visible gratuitement.",
    tips: ["Profil visible par des milliers de recruteurs", "Contact direct sans intermédiaire", "Tu restes maître de tes infos"],
    color: "#D06EFF",
    bg: "linear-gradient(135deg,#1A0018,#3D0038)"
  },
];

const FAQ = [
  { q: "C'est vraiment gratuit ?", r: "Oui, à 100%. Créer ton profil, être visible et recevoir des contacts ne coûte rien." },
  { q: "Je n'ai pas de diplôme, puis-je m'inscrire ?", r: "Absolument. TalentProof est fait pour toi. Ton expérience et ta preuve (vidéo ou photo) comptent plus que tout diplôme." },
  { q: "Mes données vocales sont-elles sécurisées ?", r: "Oui. Tes enregistrements sont utilisés uniquement pour créer ton profil. Consulte notre page Confidentialité pour tous les détails." },
  { q: "Puis-je modifier mon profil ?", r: "Oui. Contacte-nous sur WhatsApp pour toute modification : nouveau métier, nouvelle ville, nouvelle photo." },
  { q: "Les recruteurs peuvent-ils voir mon numéro de téléphone ?", r: "Non. Ils te contactent via WhatsApp grâce à un lien sécurisé. Tu décides de répondre ou non." },
];

export default function GuidePage() {
  return (
    <div style={{ minHeight:"100vh", background:"#F0F4F0", fontFamily:"system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0B1628,#162F52)", padding:"1.5rem 1rem" }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <Link href="/" style={{ color:"rgba(255,255,255,0.6)", fontSize:".82rem", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:".3rem", marginBottom:".75rem" }}>
            ← Retour
          </Link>
          <h1 style={{ fontFamily:"'Sora',sans-serif", color:"#F5F0E8", fontWeight:900, fontSize:"clamp(1.3rem,4vw,1.7rem)", margin:"0 0 .3rem" }}>
            📖 Guide d'utilisation
          </h1>
          <p style={{ color:"rgba(210,225,245,.72)", fontSize:".84rem", margin:0 }}>
            Comment créer ton profil TalentProof en 4 étapes simples
          </p>
        </div>
      </div>

      <div style={{ maxWidth:720, margin:"0 auto", padding:"1.25rem 1rem" }}>

        {/* Intro */}
        <div style={{ background:"white", borderRadius:"18px", padding:"1.25rem", marginBottom:"1.2rem", border:"1.5px solid #D1FAE5", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:".75rem" }}>
            <span style={{ fontSize:"1.5rem", flexShrink:0 }}>💡</span>
            <div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:".92rem", color:"#065F46", marginBottom:".2rem" }}>Pas besoin de diplôme ni d'email</div>
              <div style={{ color:"#047857", fontSize:".82rem", lineHeight:1.6 }}>
                TalentProof accepte tout le monde. Chauffeur, aide ménagère, couturière, mécanicien — si tu as de l'expérience, tu as ta place ici. Il suffit de ta voix ou d'une photo.
              </div>
            </div>
          </div>
        </div>

        {/* Étapes */}
        {ETAPES.map((e, i) => (
          <div key={i} style={{ background:"white", borderRadius:"18px", overflow:"hidden", marginBottom:"1rem", boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)" }}>
            <div style={{ background:e.bg, padding:"1.1rem 1.1rem .9rem", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-30, right:-30, width:100, height:100, borderRadius:"50%", background:`${e.color}15`, pointerEvents:"none" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:".65rem", position:"relative" }}>
                <div style={{ width:42, height:42, borderRadius:"50%", background:`${e.color}25`, border:`2px solid ${e.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.35rem", flexShrink:0 }}>{e.icon}</div>
                <div>
                  <div style={{ color:`${e.color}`, fontSize:".68rem", fontWeight:800, letterSpacing:".8px", textTransform:"uppercase" }}>ÉTAPE {e.num}</div>
                  <div style={{ fontFamily:"'Sora',sans-serif", color:"white", fontWeight:800, fontSize:".95rem", lineHeight:1.25 }}>{e.titre}</div>
                </div>
              </div>
            </div>
            <div style={{ padding:"1rem 1.1rem" }}>
              <p style={{ color:"#444", fontSize:".84rem", lineHeight:1.68, margin:"0 0 .75rem" }}>{e.desc}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:".3rem" }}>
                {e.tips.map((t, j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:".45rem", fontSize:".78rem", color:"#555" }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:e.color, flexShrink:0 }}/>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* FAQ */}
        <div style={{ marginTop:"1.5rem", marginBottom:"1.2rem" }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.1rem", color:"#111", marginBottom:".85rem" }}>❓ Questions fréquentes</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:".65rem" }}>
            {FAQ.map((f, i) => (
              <div key={i} style={{ background:"white", borderRadius:"14px", padding:".9rem 1rem", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
                <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:".86rem", color:"#111", marginBottom:".25rem" }}>
                  {f.q}
                </div>
                <div style={{ color:"#555", fontSize:".81rem", lineHeight:1.6 }}>{f.r}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background:"linear-gradient(135deg,#071F15,#1B6B47)", borderRadius:"18px", padding:"1.5rem 1rem", textAlign:"center", marginBottom:"1.5rem" }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, color:"white", fontSize:"1.05rem", marginBottom:".4rem" }}>Prêt à créer ton profil ?</div>
          <p style={{ color:"rgba(255,255,255,.68)", fontSize:".82rem", marginBottom:"1rem" }}>Rejoins 14 000+ talents africains déjà inscrits.</p>
          <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"linear-gradient(135deg,#C9960F,#F0C040)", color:"#0D3B2E", fontWeight:800, fontSize:".88rem", padding:".7rem 1.6rem", borderRadius:"99px", textDecoration:"none", boxShadow:"0 4px 18px rgba(201,150,15,.42)" }}>
            🎙️ Commencer maintenant
          </Link>
        </div>

        {/* Footer */}
        <div style={{ textAlign:"center", color:"#AAA", fontSize:".74rem", paddingBottom:"1.5rem" }}>
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