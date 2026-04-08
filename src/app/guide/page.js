"use client";
import Link from "next/link";

const WA_NUM1 = "2250705503089";
const EMAIL = "contact@talentproof.africa";

function WaLogo({size=18}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.527 5.852L.057 23.5l5.797-1.497A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.162-1.416l-.37-.218-3.441.889.917-3.346-.24-.387A9.944 9.944 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
    </svg>
  );
}

export default function GuidePage() {
  return (
    <div style={{minHeight:"100vh",background:"#F0F4F0",fontFamily:"system-ui,sans-serif"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:"1.4rem 1rem"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <Link href="/" style={{color:"rgba(255,255,255,.55)",fontSize:".8rem",textDecoration:"none"}}>← Retour à l'accueil</Link>
          <h1 style={{fontFamily:"'Sora',sans-serif",color:"#F0C040",fontWeight:900,fontSize:"clamp(1.3rem,4vw,1.8rem)",margin:".4rem 0 .3rem",textShadow:"0 2px 16px rgba(240,192,64,.35)"}}>
            📖 Guide TalentProof
          </h1>
          <p style={{color:"rgba(210,225,245,.62)",fontSize:".82rem",margin:0}}>
            Tout ce que tu dois savoir pour créer ton profil et trouver des opportunités
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div style={{maxWidth:800,margin:"0 auto",padding:"2rem 1rem"}}>
        <div style={{background:"white",borderRadius:"20px",padding:"2rem 1.5rem",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          
          {/* Section 1 */}
          <section style={{marginBottom:"2.5rem"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",color:"#1B6B47",fontWeight:800,fontSize:"1.3rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
              🎯 Qu'est-ce que TalentProof ?
            </h2>
            <p style={{color:"#555",fontSize:".95rem",lineHeight:1.75,marginBottom:"1rem"}}>
              TalentProof est la première plateforme africaine qui valorise <strong>tous les talents</strong>, qu'ils soient diplômés ou autodidactes. Notre mission : rendre visible ce que tu sais faire, pas seulement ce qui est écrit sur un papier.
            </p>
            <p style={{color:"#555",fontSize:".95rem",lineHeight:1.75}}>
              Chauffeur, couturière, gardien, aide ménagère, électricien, cuisinière... <strong>Tout le monde a sa place</strong> sur TalentProof. Une vidéo de 60 secondes ou une photo de ton travail suffit pour créer ton profil professionnel.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{marginBottom:"2.5rem"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",color:"#1B6B47",fontWeight:800,fontSize:"1.3rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
              ✨ Comment créer mon profil ?
            </h2>
            <div style={{background:"#F0FDF4",border:"1.5px solid #D1FAE5",borderRadius:"14px",padding:"1.2rem",marginBottom:"1.5rem"}}>
              <h3 style={{color:"#166534",fontWeight:700,fontSize:"1rem",marginBottom:".8rem"}}>🎙️ Option 1 : Inscription vocale (60 secondes)</h3>
              <ol style={{color:"#555",fontSize:".9rem",lineHeight:1.75,paddingLeft:"1.2rem",margin:0}}>
                <li>Clique sur le micro doré sur la page d'accueil</li>
                <li>Parle pendant 60 secondes maximum : ton nom, ton métier, ton expérience, ta ville</li>
                <li>Réécoute ton message et envoie</li>
                <li>Notre équipe crée ton profil sous 24h et te contacte</li>
              </ol>
            </div>
            <div style={{background:"#FFF7ED",border:"1.5px solid #FCD34D",borderRadius:"14px",padding:"1.2rem",marginBottom:"1.5rem"}}>
              <h3 style={{color:"#92400E",fontWeight:700,fontSize:"1rem",marginBottom:".8rem"}}>📱 Option 2 : Via WhatsApp</h3>
              <ol style={{color:"#555",fontSize:".9rem",lineHeight:1.75,paddingLeft:"1.2rem",margin:0}}>
                <li>Envoie un message WhatsApp au <strong>+225 07 05 50 30 89</strong></li>
                <li>Présente-toi : nom, métier, expérience, ville</li>
                <li>Envoie une photo de ton travail ou un vocal</li>
                <li>On crée ton profil et tu es visible en 24h</li>
              </ol>
            </div>
            <div style={{background:"#EFF6FF",border:"1.5px solid #BFDBFE",borderRadius:"14px",padding:"1.2rem"}}>
              <h3 style={{color:"#1E40AF",fontWeight:700,fontSize:"1rem",marginBottom:".8rem"}}>📝 Option 3 : Formulaire en ligne</h3>
              <p style={{color:"#555",fontSize:".9rem",lineHeight:1.75,margin:0}}>
                Remplis le <Link href="/inscription-talent" style={{color:"#1B6B47",fontWeight:700}}>formulaire d'inscription</Link> avec tes informations, ajoute une photo ou une vidéo, et valide. Ton profil sera en ligne sous 24h après vérification.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section style={{marginBottom:"2.5rem"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",color:"#1B6B47",fontWeight:800,fontSize:"1.3rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
              🔍 Comment les recruteurs me trouvent ?
            </h2>
            <p style={{color:"#555",fontSize:".95rem",lineHeight:1.75,marginBottom:"1rem"}}>
              Ton profil apparaît dans <strong>l'Annuaire TalentProof</strong>, accessible à tous les recruteurs et particuliers d'Afrique et d'ailleurs. Ils peuvent :
            </p>
            <ul style={{color:"#555",fontSize:".9rem",lineHeight:1.75,paddingLeft:"1.2rem",marginBottom:"1rem"}}>
              <li>Chercher par métier, ville ou nom</li>
              <li>Filtrer par type de profil (Expert, Pratique, Simple)</li>
              <li>Voir ta vidéo ou tes photos de réalisations</li>
              <li>Te contacter directement via WhatsApp</li>
            </ul>
            <p style={{color:"#555",fontSize:".95rem",lineHeight:1.75}}>
              Plus ton profil est complet (vidéo + photo + documents), plus tu as de chances d'être contacté rapidement.
            </p>
          </section>

          {/* Section 4 */}
          <section style={{marginBottom:"2.5rem"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",color:"#1B6B47",fontWeight:800,fontSize:"1.3rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
              💼 Les 3 types de profils
            </h2>
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              <div style={{background:"#EFF6FF",border:"1.5px solid #BFDBFE",borderRadius:"12px",padding:"1rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:".5rem",marginBottom:".5rem"}}>
                  <span style={{background:"#1D4ED8",color:"white",fontSize:".7rem",fontWeight:700,padding:"4px 10px",borderRadius:"99px"}}>🏆 Expert</span>
                </div>
                <p style={{color:"#555",fontSize:".88rem",lineHeight:1.65,margin:0}}>
                  Diplômé ou certifié avec plusieurs années d'expérience. Documents vérifiés, portfolio complet.
                </p>
              </div>
              <div style={{background:"#FFF7ED",border:"1.5px solid #FED7AA",borderRadius:"12px",padding:"1rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:".5rem",marginBottom:".5rem"}}>
                  <span style={{background:"#D97706",color:"white",fontSize:".7rem",fontWeight:700,padding:"4px 10px",borderRadius:"99px"}}>💪 Pratique</span>
                </div>
                <p style={{color:"#555",fontSize:".88rem",lineHeight:1.65,margin:0}}>
                  Expérience pratique solide, formé sur le terrain. Peut avoir des attestations ou références.
                </p>
              </div>
              <div style={{background:"#F3F4F6",border:"1.5px solid #E5E7EB",borderRadius:"12px",padding:"1rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:".5rem",marginBottom:".5rem"}}>
                  <span style={{background:"#6B7280",color:"white",fontSize:".7rem",fontWeight:700,padding:"4px 10px",borderRadius:"99px"}}>🤝 Simple</span>
                </div>
                <p style={{color:"#555",fontSize:".88rem",lineHeight:1.65,margin:0}}>
                  Débutant ou sans diplôme, mais motivé et prêt à apprendre. Tout le monde commence quelque part !
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section style={{marginBottom:"2.5rem"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",color:"#1B6B47",fontWeight:800,fontSize:"1.3rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
              🔒 Mes documents sont-ils protégés ?
            </h2>
            <p style={{color:"#555",fontSize:".95rem",lineHeight:1.75,marginBottom:"1rem"}}>
              <strong>Oui, absolument.</strong> Tes diplômes, certificats et attestations sont <strong>verrouillés par défaut</strong>. Seuls les recruteurs vérifiés peuvent demander l'accès, et <strong>c'est toi qui décides</strong> de partager ou non.
            </p>
            <div style={{background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:"12px",padding:"1rem"}}>
              <p style={{color:"#991B1B",fontSize:".88rem",lineHeight:1.65,margin:0,fontWeight:600}}>
                ⚠️ Important : Nous ne partageons jamais tes documents sans ton autorisation explicite.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section style={{marginBottom:"2.5rem"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",color:"#1B6B47",fontWeight:800,fontSize:"1.3rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
              💰 C'est gratuit ?
            </h2>
            <p style={{color:"#555",fontSize:".95rem",lineHeight:1.75,marginBottom:"1rem"}}>
              <strong>Oui, 100% gratuit pour les talents.</strong> Créer ton profil, être visible dans l'annuaire, recevoir des contacts de recruteurs — tout est gratuit et le restera toujours.
            </p>
            <p style={{color:"#555",fontSize:".95rem",lineHeight:1.75}}>
              TalentProof se finance via les partenaires (entreprises, écoles, organisations) qui souhaitent accéder à notre base de talents vérifiés.
            </p>
          </section>

          {/* Section 7 */}
          <section style={{marginBottom:"2.5rem"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",color:"#1B6B47",fontWeight:800,fontSize:"1.3rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
              📞 Besoin d'aide ?
            </h2>
            <p style={{color:"#555",fontSize:".95rem",lineHeight:1.75,marginBottom:"1.2rem"}}>
              Notre équipe est là pour t'accompagner à chaque étape. Contacte-nous :
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:".8rem"}}>
              <a href={`https://wa.me/${WA_NUM1}?text=${encodeURIComponent("Bonjour, j'ai besoin d'aide pour créer mon profil TalentProof.")}`} target="_blank" rel="noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:".5rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".9rem",padding:".7rem 1.2rem",borderRadius:"99px",textDecoration:"none",justifyContent:"center",boxShadow:"0 2px 12px rgba(37,211,102,.3)"}}>
                <WaLogo size={18}/> WhatsApp : +225 07 05 50 30 89
              </a>
              <a href={`mailto:${EMAIL}`}
                style={{display:"inline-flex",alignItems:"center",gap:".5rem",background:"#F0FDF4",color:"#1B6B47",fontWeight:700,fontSize:".9rem",padding:".7rem 1.2rem",borderRadius:"99px",textDecoration:"none",justifyContent:"center",border:"1.5px solid #D1FAE5"}}>
                ✉️ Email : {EMAIL}
              </a>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 style={{fontFamily:"'Sora',sans-serif",color:"#1B6B47",fontWeight:800,fontSize:"1.3rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
              🚀 Prêt à commencer ?
            </h2>
            <p style={{color:"#555",fontSize:".95rem",lineHeight:1.75,marginBottom:"1.2rem"}}>
              Rejoins les milliers de talents africains déjà inscrits sur TalentProof. Crée ton profil maintenant et commence à recevoir des opportunités dès demain.
            </p>
            <div style={{display:"flex",gap:".6rem",flexWrap:"wrap"}}>
              <Link href="/inscription-talent" style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",fontWeight:800,fontSize:".9rem",padding:".7rem 1.4rem",borderRadius:"99px",textDecoration:"none",boxShadow:"0 4px 16px rgba(201,150,15,.4)"}}>
                + Créer mon profil gratuitement
              </Link>
              <Link href="/annuaire" style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"transparent",color:"#1B6B47",fontWeight:700,fontSize:".9rem",padding:".7rem 1.4rem",borderRadius:"99px",textDecoration:"none",border:"1.5px solid #D1FAE5"}}>
                📋 Voir l'annuaire
              </Link>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div style={{textAlign:"center",marginTop:"2rem",paddingTop:"1.5rem",borderTop:"1px solid #E5E7EB"}}>
          <div style={{color:"#888",fontSize:".75rem",display:"flex",gap:".5rem",justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/" style={{color:"#1B6B47",textDecoration:"none",fontWeight:600}}>← Accueil</Link>
            <span>·</span><Link href="/annuaire" style={{color:"#888",textDecoration:"none"}}>Annuaire</Link>
            <span>·</span><Link href="/mentions-legales" style={{color:"#888",textDecoration:"none"}}>Mentions légales</Link>
            <span>·</span><Link href="/confidentialite" style={{color:"#888",textDecoration:"none"}}>Confidentialité</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
