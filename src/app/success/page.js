"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Home, MessageCircle } from "lucide-react";

const WA_NUM = "2250507939706";

function SuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'talent';
  const nom = searchParams.get('nom') || 'Utilisateur';

  const messages = {
    talent: {
      emoji: "🎉",
      titre: `Bienvenue sur TalentProof, ${nom} !`,
      message: "Ton profil a été créé avec succès et validé automatiquement. Tu es maintenant visible par des milliers de recruteurs en Afrique.",
      details: [
        "✅ Profil validé automatiquement",
        "✅ Visible dans l'annuaire",
        "✅ Recruteurs peuvent te contacter",
        "📱 Tu recevras les demandes par WhatsApp"
      ]
    },
    recruteur: {
      emoji: "🏢",
      titre: `Bienvenue ${nom} !`,
      message: "Votre compte recruteur a été créé avec succès. Vous pouvez maintenant accéder à notre annuaire de talents vérifiés.",
      details: [
        "✅ Compte validé automatiquement",
        "✅ Accès à l'annuaire complet",
        "✅ Contact direct avec les talents",
        "📊 Dashboard de suivi disponible"
      ]
    },
    partenaire: {
      emoji: "🤝",
      titre: `Bienvenue parmi nos partenaires, ${nom} !`,
      message: "Votre demande de partenariat a été enregistrée avec succès. Notre équipe va vous contacter sous 24h pour finaliser votre inscription.",
      details: [
        "✅ Demande enregistrée",
        "✅ Validation sous 24h",
        "✅ Code de parrainage à venir",
        "📊 Dashboard partenaire en préparation"
      ]
    }
  };

  const content = messages[type] || messages.talent;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#0B1628,#0F2744,#162F52)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      fontFamily: "system-ui,sans-serif"
    }}>
      <div style={{maxWidth: 550,width: "100%"}}>
        <div style={{background: "white",borderRadius: "24px",padding: "2.5rem 2rem",boxShadow: "0 20px 60px rgba(0,0,0,.4)",textAlign: "center",marginBottom: "1.5rem"}}>
          <div style={{width: 90,height: 90,borderRadius: "50%",background: "linear-gradient(135deg,#16A34A,#22C55E)",display: "flex",alignItems: "center",justifyContent: "center",margin: "0 auto 1.5rem",boxShadow: "0 8px 32px rgba(22,163,74,.3)"}}>
            <CheckCircle size={50} color="white" strokeWidth={2.5} />
          </div>

          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{content.emoji}</div>

          <h1 style={{fontFamily: "'Sora',sans-serif",fontSize: "1.6rem",fontWeight: 900,color: "#111",marginBottom: "1rem",lineHeight: 1.3}}>{content.titre}</h1>

          <p style={{color: "#666",fontSize: ".95rem",lineHeight: 1.7,marginBottom: "1.5rem"}}>{content.message}</p>

          <div style={{background: "#F0FDF4",border: "1.5px solid #86EFAC",borderRadius: "16px",padding: "1.2rem",marginBottom: "1.5rem",textAlign: "left"}}>
            {content.details.map((detail, i) => (
              <div key={i} style={{display: "flex",alignItems: "center",gap: ".6rem",padding: ".4rem 0",fontSize: ".85rem",color: "#065F46",fontWeight: 600}}>
                {detail}
              </div>
            ))}
          </div>

          <div style={{display: "flex",flexDirection: "column",gap: ".8rem"}}>
            <a href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent(`Bonjour TalentProof, je viens de m'inscrire (${nom}). J'ai une question.`)}`} target="_blank" rel="noreferrer" style={{display: "flex",alignItems: "center",justifyContent: "center",gap: ".6rem",background: "linear-gradient(135deg,#25D366,#20BA5A)",color: "white",fontWeight: 800,fontSize: ".95rem",padding: "1rem 1.5rem",borderRadius: "12px",textDecoration: "none",boxShadow: "0 4px 20px rgba(37,211,102,.3)",transition: "transform .2s"}}>
              <MessageCircle size={20} strokeWidth={2.5} />
              Contactez-nous sur WhatsApp
            </a>

            <Link href="/" style={{display: "flex",alignItems: "center",justifyContent: "center",gap: ".6rem",background: "white",color: "#1B6B47",fontWeight: 700,fontSize: ".9rem",padding: ".9rem 1.5rem",borderRadius: "12px",textDecoration: "none",border: "2px solid #D1FAE5",transition: "all .2s"}}>
              <Home size={18} />
              Retour à l'accueil
            </Link>
          </div>
        </div>

        <div style={{background: "rgba(255,255,255,.08)",border: "1px solid rgba(255,255,255,.15)",borderRadius: "16px",padding: "1.2rem",textAlign: "center"}}>
          <div style={{color: "rgba(255,255,255,.9)",fontSize: ".85rem",lineHeight: 1.7}}>
            {type === 'talent' && (<><strong style={{ color: "#F0C040" }}>Prochaine étape :</strong><br />Les recruteurs vont consulter ton profil. Garde ton téléphone à portée de main !</>)}
            {type === 'recruteur' && (<><strong style={{ color: "#F0C040" }}>Prochaine étape :</strong><br />Explorez notre annuaire et contactez les talents qui vous intéressent.</>)}
            {type === 'partenaire' && (<><strong style={{ color: "#F0C040" }}>Prochaine étape :</strong><br />Notre équipe va vous contacter sous 24h pour activer votre compte partenaire.</>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0B1628,#0F2744,#162F52)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"3rem",marginBottom:"1rem",color:"white"}}>⏳</div>
          <div style={{color:"rgba(255,255,255,.7)",fontSize:"1rem",fontWeight:600}}>Chargement...</div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
