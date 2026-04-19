"use client";

export default function MentionsLegalesPage() {
  return (
    <div style={{minHeight:"100vh",background:"#F0F4F0"}}>
      {/* Header simple */}
      <header style={{
        background:"linear-gradient(135deg,#0B1628 0%,#0F2744 60%,#162F52 100%)",
        borderBottom:"1px solid rgba(240,192,64,.18)",
        boxShadow:"0 4px 24px rgba(0,0,0,.4)",
        padding:"1rem"
      }}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <a href="/" style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.2rem",color:"#ECC94B",textDecoration:"none"}}>
            TalentProof
          </a>
          <a href="/" style={{color:"rgba(255,255,255,.7)",fontSize:".85rem",textDecoration:"none",fontWeight:600}}>
            ← Retour à l'accueil
          </a>
        </div>
      </header>

      {/* Contenu */}
      <div style={{maxWidth:800,margin:"0 auto",padding:"3rem 1.5rem"}}>
        <div style={{background:"white",borderRadius:"20px",padding:"2.5rem",boxShadow:"0 4px 20px rgba(0,0,0,.08)"}}>
          <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"2rem",fontWeight:800,color:"#1B6B47",marginBottom:"1.5rem"}}>
            Mentions Légales
          </h1>

          <div style={{color:"#444",fontSize:".95rem",lineHeight:1.8}}>
            
            {/* Section 1 */}
            <section style={{marginBottom:"2rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:700,color:"#0B1628",marginBottom:".8rem"}}>
                1. Éditeur de la plateforme
              </h2>
              <p style={{marginBottom:".5rem"}}>
                La plateforme <strong>TalentProof Afrique</strong> est éditée par TalentProof Afrique.
              </p>
              <p style={{marginBottom:".3rem"}}><strong>Adresse email :</strong> contact@talentproof.africa</p>
              <p style={{marginBottom:".3rem"}}><strong>Téléphone :</strong> +225 05 07 93 97 06</p>
              <p style={{marginBottom:".3rem"}}><strong>WhatsApp Business :</strong> +225 05 07 93 97 06</p>
            </section>

            {/* Section 2 */}
            <section style={{marginBottom:"2rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:700,color:"#0B1628",marginBottom:".8rem"}}>
                2. Hébergement
              </h2>
              <p style={{marginBottom:".5rem"}}>
                La plateforme TalentProof est hébergée par :
              </p>
              <p style={{marginBottom:".3rem"}}><strong>Vercel Inc.</strong></p>
              <p style={{marginBottom:".3rem"}}>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
              <p style={{marginBottom:".3rem"}}>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{color:"#1B6B47",textDecoration:"underline"}}>vercel.com</a></p>
            </section>

            {/* Section 3 */}
            <section style={{marginBottom:"2rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:700,color:"#0B1628",marginBottom:".8rem"}}>
                3. Objet de la plateforme
              </h2>
              <p style={{marginBottom:".5rem"}}>
                TalentProof Afrique est une <strong>plateforme de mise en relation</strong> entre talents professionnels et recruteurs en Afrique.
              </p>
              <p style={{marginBottom:".5rem"}}>
                Notre mission est de valoriser les compétences professionnelles, qu'elles soient acquises par diplôme, certification ou expérience pratique, en offrant une vitrine digitale accessible à tous.
              </p>
            </section>

            {/* Section 4 */}
            <section style={{marginBottom:"2rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:700,color:"#0B1628",marginBottom:".8rem"}}>
                4. Propriété intellectuelle
              </h2>
              <p style={{marginBottom:".5rem"}}>
                L'ensemble des contenus présents sur la plateforme TalentProof (textes, images, logos, graphismes, vidéos, etc.) est protégé par les lois relatives à la propriété intellectuelle.
              </p>
              <p style={{marginBottom:".5rem"}}>
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments de la plateforme, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de TalentProof Afrique.
              </p>
            </section>

            {/* Section 5 */}
            <section style={{marginBottom:"2rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:700,color:"#0B1628",marginBottom:".8rem"}}>
                5. Responsabilité
              </h2>
              <p style={{marginBottom:".5rem"}}>
                TalentProof Afrique agit en tant qu'<strong>intermédiaire technique</strong> facilitant la mise en relation entre talents et recruteurs.
              </p>
              <p style={{marginBottom:".5rem"}}>
                Nous ne sommes pas responsables :
              </p>
              <ul style={{marginLeft:"1.5rem",marginBottom:".5rem"}}>
                <li>Des informations publiées par les utilisateurs sur leurs profils</li>
                <li>De la véracité des compétences déclarées</li>
                <li>Des relations contractuelles établies entre talents et recruteurs</li>
                <li>Des litiges pouvant survenir entre utilisateurs</li>
              </ul>
              <p style={{marginBottom:".5rem"}}>
                Nous encourageons tous les utilisateurs à faire preuve de diligence raisonnable dans leurs interactions.
              </p>
            </section>

            {/* Section 6 */}
            <section style={{marginBottom:"2rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:700,color:"#0B1628",marginBottom:".8rem"}}>
                6. Protection des données personnelles
              </h2>
              <p style={{marginBottom:".5rem"}}>
                Conformément aux réglementations en vigueur sur la protection des données personnelles, TalentProof Afrique s'engage à protéger la vie privée de ses utilisateurs.
              </p>
              <p style={{marginBottom:".5rem"}}>
                Les données collectées sont utilisées uniquement dans le cadre de la mise en relation professionnelle et ne sont jamais vendues à des tiers.
              </p>
              <p style={{marginBottom:".5rem"}}>
                Pour plus d'informations, consultez notre <a href="/confidentialite" style={{color:"#1B6B47",textDecoration:"underline"}}>Politique de Confidentialité</a>.
              </p>
            </section>

            {/* Section 7 */}
            <section style={{marginBottom:"2rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:700,color:"#0B1628",marginBottom:".8rem"}}>
                7. Cookies
              </h2>
              <p style={{marginBottom:".5rem"}}>
                La plateforme TalentProof utilise des cookies techniques nécessaires au bon fonctionnement du site (session utilisateur, préférences d'affichage).
              </p>
              <p style={{marginBottom:".5rem"}}>
                Aucun cookie publicitaire ou de tracking tiers n'est utilisé sans votre consentement explicite.
              </p>
            </section>

            {/* Section 8 */}
            <section style={{marginBottom:"2rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:700,color:"#0B1628",marginBottom:".8rem"}}>
                8. Droit applicable et juridiction
              </h2>
              <p style={{marginBottom:".5rem"}}>
                Les présentes mentions légales sont régies par le droit ivoirien.
              </p>
              <p style={{marginBottom:".5rem"}}>
                En cas de litige, et à défaut de résolution amiable, les tribunaux compétents de Côte d'Ivoire seront seuls compétents.
              </p>
            </section>

            {/* Section 9 */}
            <section style={{marginBottom:"2rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:700,color:"#0B1628",marginBottom:".8rem"}}>
                9. Contact
              </h2>
              <p style={{marginBottom:".5rem"}}>
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
              </p>
              <p style={{marginBottom:".3rem"}}>📧 Email : <a href="mailto:contact@talentproof.africa" style={{color:"#1B6B47",textDecoration:"underline"}}>contact@talentproof.africa</a></p>
              <p style={{marginBottom:".3rem"}}>📱 WhatsApp : <a href="https://wa.me/2250507939706" target="_blank" rel="noopener noreferrer" style={{color:"#1B6B47",textDecoration:"underline"}}>+225 05 07 93 97 06</a></p>
            </section>

            {/* Date de mise à jour */}
            <div style={{marginTop:"3rem",paddingTop:"1.5rem",borderTop:"1px solid #E5E7EB",fontSize:".85rem",color:"#9CA3AF"}}>
              <p><strong>Dernière mise à jour :</strong> Mars 2026</p>
            </div>

          </div>
        </div>

        {/* Bouton retour */}
        <div style={{textAlign:"center",marginTop:"2rem"}}>
          <a href="/" style={{
            display:"inline-flex",
            alignItems:"center",
            gap:".5rem",
            background:"linear-gradient(135deg,#C9960F,#F0C040)",
            color:"#0D3B2E",
            fontWeight:800,
            fontSize:".9rem",
            padding:".7rem 1.5rem",
            borderRadius:"99px",
            textDecoration:"none",
            boxShadow:"0 4px 16px rgba(201,150,15,.4)"
          }}>
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
