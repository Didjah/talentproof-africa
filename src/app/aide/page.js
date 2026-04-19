"use client";

export default function AidePage() {
  const WA_NUM = "2250507939706";
  const EMAIL = "contact@talentproof.africa";

  const faqs = [
    {
      q: "Comment créer mon profil TalentProof ?",
      r: "C'est simple et gratuit ! Vous pouvez soit remplir notre formulaire d'inscription en ligne, soit nous contacter directement via WhatsApp. Aucun diplôme n'est requis - une photo ou une vidéo de votre travail suffit."
    },
    {
      q: "Ai-je besoin d'un diplôme pour m'inscrire ?",
      r: "Non ! TalentProof valorise tous les talents, qu'ils soient diplômés, certifiés ou autodidactes. Ce qui compte, c'est ce que vous savez faire. Une preuve visuelle (photo ou vidéo) de votre travail est suffisante."
    },
    {
      q: "L'inscription est-elle vraiment gratuite ?",
      r: "Oui, 100% gratuite ! Créer votre profil, apparaître dans l'annuaire et être contacté par des recruteurs ne coûte rien. Notre mission est de rendre le talent africain visible et accessible."
    },
    {
      q: "Comment les recruteurs me trouvent-ils ?",
      r: "Votre profil apparaît dans notre annuaire public consultable par métier, ville et compétences. Les recruteurs peuvent vous contacter directement via WhatsApp ou email depuis votre profil."
    },
    {
      q: "Puis-je modifier mon profil après inscription ?",
      r: "Absolument ! Contactez-nous via WhatsApp ou email avec vos modifications. Nous mettons à jour votre profil sous 24h."
    },
    {
      q: "Quels métiers sont acceptés sur TalentProof ?",
      r: "Tous les métiers ! Chauffeur, couturière, électricien, aide ménagère, développeur, cuisinier, mécanicien... Si vous avez un talent, vous avez votre place sur TalentProof."
    },
    {
      q: "Comment devenir partenaire (école ou entreprise) ?",
      r: "Contactez-nous via WhatsApp ou email. Nous proposons des solutions sur mesure pour les écoles de formation et les entreprises qui recrutent régulièrement."
    },
    {
      q: "Mes données personnelles sont-elles protégées ?",
      r: "Oui ! Nous respectons strictement les réglementations sur la protection des données. Vos informations ne sont jamais vendues à des tiers et sont utilisées uniquement pour la mise en relation professionnelle."
    }
  ];

  return (
    <div style={{minHeight:"100vh",background:"#F0F4F0"}}>
      {/* Header */}
      <header style={{
        background:"linear-gradient(135deg,#0B1628 0%,#0F2744 60%,#162F52 100%)",
        borderBottom:"1px solid rgba(240,192,64,.18)",
        boxShadow:"0 4px 24px rgba(0,0,0,.4)",
        padding:"1rem"
      }}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:".8rem"}}>
          <a href="/" style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.2rem",color:"#ECC94B",textDecoration:"none"}}>
            TalentProof
          </a>
          <a href="/" style={{color:"rgba(255,255,255,.7)",fontSize:".85rem",textDecoration:"none",fontWeight:600}}>
            ← Retour à l'accueil
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{background:"linear-gradient(135deg,#1B6B47,#2D9A68)",padding:"3rem 1.5rem 2.5rem",textAlign:"center"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{fontSize:"3rem",marginBottom:"1rem"}}>❓</div>
          <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"2.2rem",fontWeight:800,color:"white",marginBottom:"1rem"}}>
            Aide & Support
          </h1>
          <p style={{color:"rgba(255,255,255,.85)",fontSize:"1.05rem",lineHeight:1.7}}>
            Trouvez rapidement des réponses à vos questions ou contactez notre équipe. <strong>Nous répondons sous 24h.</strong>
          </p>
        </div>
      </div>

      {/* Contact rapide */}
      <div style={{maxWidth:900,margin:"-2rem auto 3rem",padding:"0 1.5rem"}}>
        <div style={{background:"white",borderRadius:"20px",padding:"2rem",boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}>
          <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#1B6B47",marginBottom:".5rem"}}>
              Besoin d'aide immédiate ?
            </h2>
            <p style={{color:"#666",fontSize:".95rem"}}>Notre équipe est disponible pour vous accompagner</p>
          </div>
          
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:"1rem"}}>
            <a href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent("Bonjour TalentProof, j'ai besoin d'aide.")}`} 
              target="_blank" rel="noreferrer"
              style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:".8rem",
                background:"linear-gradient(135deg,#25D366,#20BA5A)",
                color:"white",padding:"1.5rem",borderRadius:"16px",textDecoration:"none",
                boxShadow:"0 4px 16px rgba(37,211,102,.3)",transition:"transform .2s"
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <div style={{fontSize:"2.5rem"}}>💬</div>
              <div style={{textAlign:"center"}}>
                <div style={{fontWeight:800,fontSize:"1.1rem",marginBottom:".3rem"}}>WhatsApp Business</div>
                <div style={{fontSize:".85rem",opacity:.9}}>Réponse rapide garantie</div>
                <div style={{fontSize:".9rem",fontWeight:700,marginTop:".5rem"}}>+225 05 07 93 97 06</div>
              </div>
            </a>

            <a href={`mailto:${EMAIL}`}
              style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:".8rem",
                background:"linear-gradient(135deg,#1B6B47,#2D9A68)",
                color:"white",padding:"1.5rem",borderRadius:"16px",textDecoration:"none",
                boxShadow:"0 4px 16px rgba(27,107,71,.3)",transition:"transform .2s"
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <div style={{fontSize:"2.5rem"}}>📧</div>
              <div style={{textAlign:"center"}}>
                <div style={{fontWeight:800,fontSize:"1.1rem",marginBottom:".3rem"}}>Email</div>
                <div style={{fontSize:".85rem",opacity:.9}}>Support par email</div>
                <div style={{fontSize:".85rem",fontWeight:600,marginTop:".5rem",wordBreak:"break-word"}}>{EMAIL}</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 1.5rem 4rem"}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.8rem",fontWeight:800,color:"#1B6B47",marginBottom:".5rem"}}>
            Questions Fréquentes
          </h2>
          <p style={{color:"#666",fontSize:".95rem"}}>Les réponses aux questions les plus posées</p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          {faqs.map((faq, idx) => (
            <details key={idx} style={{
              background:"white",
              borderRadius:"16px",
              padding:"1.5rem",
              boxShadow:"0 2px 8px rgba(0,0,0,.06)",
              cursor:"pointer"
            }}>
              <summary style={{
                fontFamily:"'Sora',sans-serif",
                fontWeight:700,
                fontSize:"1.05rem",
                color:"#1B6B47",
                listStyle:"none",
                display:"flex",
                alignItems:"center",
                gap:".8rem"
              }}>
                <span style={{fontSize:"1.5rem",flexShrink:0}}>❓</span>
                <span style={{flex:1}}>{faq.q}</span>
                <span style={{fontSize:".8rem",color:"#9CA3AF"}}>▼</span>
              </summary>
              <div style={{
                marginTop:"1rem",
                paddingTop:"1rem",
                borderTop:"1px solid #F0F0F0",
                color:"#555",
                fontSize:".95rem",
                lineHeight:1.7
              }}>
                {faq.r}
              </div>
            </details>
          ))}
        </div>

        {/* CTA final */}
        <div style={{
          background:"linear-gradient(135deg,#FEF9EE,#FFF7E0)",
          border:"2px solid #F0C040",
          borderRadius:"20px",
          padding:"2rem",
          textAlign:"center",
          marginTop:"3rem"
        }}>
          <div style={{fontSize:"2rem",marginBottom:".8rem"}}>🤝</div>
          <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#92400E",marginBottom:".8rem"}}>
            Vous n'avez pas trouvé votre réponse ?
          </h3>
          <p style={{color:"#B45309",fontSize:".95rem",marginBottom:"1.5rem",lineHeight:1.6}}>
            Notre équipe est là pour vous aider. Contactez-nous et nous vous répondrons sous 24h.
          </p>
          <div style={{display:"flex",gap:".8rem",justifyContent:"center",flexWrap:"wrap"}}>
            <a href={`https://wa.me/${WA_NUM}`} target="_blank" rel="noreferrer"
              style={{
                display:"inline-flex",alignItems:"center",gap:".5rem",
                background:"#25D366",color:"white",fontWeight:800,fontSize:".9rem",
                padding:".8rem 1.5rem",borderRadius:"99px",textDecoration:"none",
                boxShadow:"0 4px 16px rgba(37,211,102,.3)"
              }}>
              💬 WhatsApp
            </a>
            <a href={`mailto:${EMAIL}`}
              style={{
                display:"inline-flex",alignItems:"center",gap:".5rem",
                background:"white",color:"#1B6B47",fontWeight:800,fontSize:".9rem",
                padding:".8rem 1.5rem",borderRadius:"99px",textDecoration:"none",
                border:"2px solid #1B6B47"
              }}>
              📧 Email
            </a>
          </div>
        </div>
      </div>

      {/* Footer simple */}
      <div style={{background:"#0B1628",padding:"2rem 1rem",textAlign:"center"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{fontFamily:"'Sora',sans-serif",color:"#F0C040",fontWeight:800,fontSize:"1rem",marginBottom:".8rem"}}>
            TalentProof Afrique
          </div>
          <div style={{display:"flex",gap:".8rem",justifyContent:"center",flexWrap:"wrap",fontSize:".85rem",marginBottom:"1rem"}}>
            <a href="/" style={{color:"rgba(210,225,245,.6)",textDecoration:"none"}}>Accueil</a>
            <span style={{color:"rgba(255,255,255,.3)"}}>·</span>
            <a href="/annuaire" style={{color:"rgba(210,225,245,.6)",textDecoration:"none"}}>Annuaire</a>
            <span style={{color:"rgba(255,255,255,.3)"}}>·</span>
            <a href="/mentions-legales" style={{color:"rgba(210,225,245,.6)",textDecoration:"none"}}>Mentions légales</a>
          </div>
          <div style={{color:"rgba(255,255,255,.3)",fontSize:".75rem"}}>
            © {new Date().getFullYear()} TalentProof Afrique — Tous droits réservés
          </div>
        </div>
      </div>
    </div>
  );
}
