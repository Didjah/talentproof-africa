"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTalent } from "@/services/api";
import { CheckCircle, MapPin, Calendar, Briefcase, Phone, Mail, ArrowLeft } from "lucide-react";

const WA_NUM1 = "2250705503089";
const EMAIL = "contact@talentproof.africa";
const VID_DEMO = "https://www.w3schools.com/html/mov_bbb.mp4";

/* ── Profils mockés (fallback) ── */
const PROFILS_MOCK = [
  {
    id:"1", prenom:"Moussa", nom:"Diallo", metier:"Chauffeur VTC", ville:"Dakar", pays:"Sénégal",
    dateNaissance:"1990-01-01", experience:"7 ans", telephone:"221770000001",
    disponibilite:"immediate", status:"active",
    bio:"Chauffeur professionnel, habitué des trajets aéroport et longue distance. Véhicule climatisé, ponctuel.",
    competences:"VTC, Aéroport, Longue distance",
    videoUrl: VID_DEMO,
    photoRealisationUrl:"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=700&q=80",
    photoProfilUrl:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    cvUrl:"doc.pdf", diplomeUrl:"diplome.pdf"
  },
  {
    id:"2", prenom:"Fatou", nom:"Ndiaye", metier:"Couturière", ville:"Abidjan", pays:"Côte d'Ivoire",
    dateNaissance:"1986-05-15", experience:"12 ans", telephone:"2250700000002",
    disponibilite:"1_month", status:"active",
    bio:"Spécialisée en tenues de cérémonie, wax et bazin. Créations uniques alliant tradition et modernité.",
    competences:"Wax, Cérémonie, Sur-mesure",
    videoUrl: VID_DEMO,
    photoRealisationUrl:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80",
    photoProfilUrl:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    cvUrl:"doc.pdf", diplomeUrl:"diplome.pdf"
  },
  {
    id:"3", prenom:"Kwame", nom:"Asante", metier:"Gardien", ville:"Accra", pays:"Ghana",
    dateNaissance:"1982-08-20", experience:"5 ans", telephone:"233200000003",
    disponibilite:"immediate", status:"pending", niveauEtude:"Niveau 3ème",
    bio:"Agent de sécurité expérimenté, réactif et discret. Disponible nuit et week-end. Références sur demande.",
    competences:"Sécurité, Résidentiel, Nuit",
    videoUrl:null, photoRealisationUrl:null, photoProfilUrl:null
  },
];

function WaLogo({size=18}){
  return(
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.527 5.852L.057 23.5l5.797-1.497A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.162-1.416l-.37-.218-3.441.889.917-3.346-.24-.387A9.944 9.944 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
    </svg>
  );
}

function LightboxPhoto({src,alt,onClose}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.95)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",cursor:"zoom-out"}}>
      <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"rgba(255,255,255,.2)",border:"none",borderRadius:"50%",width:44,height:44,color:"white",cursor:"pointer",fontSize:"1.4rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,transition:"background .2s",fontWeight:700}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.3)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.2)"}>✕</button>
      <img src={src} alt={alt} onClick={e=>e.stopPropagation()} style={{maxWidth:"92%",maxHeight:"92vh",borderRadius:"16px",boxShadow:"0 25px 80px rgba(0,0,0,.7)",cursor:"default"}}/>
    </div>
  );
}

function ModalDoc({talent,onClose}){
  const [st,setSt]=useState("idle");
  const demander=()=>{setSt("sending");setTimeout(()=>setSt("ok"),1500);};
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div onClick={e=>e.stopPropagation()} style={{position:"relative",maxWidth:500,width:"100%",borderRadius:"20px",overflow:"hidden",background:"#111"}}>
        <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"rgba(255,255,255,.12)",border:"none",borderRadius:"50%",width:36,height:36,color:"white",cursor:"pointer",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>✕</button>
        <div style={{padding:"2rem 1.5rem",textAlign:"center"}}>
          {st==="ok"?(
            <>
              <div style={{fontSize:"3rem",marginBottom:".8rem"}}>✅</div>
              <div style={{fontFamily:"'Sora',sans-serif",color:"white",fontWeight:800,fontSize:"1.1rem",marginBottom:".5rem"}}>Demande envoyée !</div>
              <p style={{color:"rgba(255,255,255,.65)",fontSize:".9rem",lineHeight:1.7,marginBottom:"1.2rem"}}>{talent.prenom} recevra votre demande. Réponse sous 24h.</p>
              <button onClick={onClose} style={{background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",border:"none",borderRadius:"99px",padding:".7rem 1.8rem",fontWeight:800,fontSize:".9rem",cursor:"pointer"}}>Fermer</button>
            </>
          ):(
            <>
              <div style={{fontSize:"3rem",marginBottom:".8rem"}}>🔒</div>
              <div style={{fontFamily:"'Sora',sans-serif",color:"white",fontWeight:800,fontSize:"1.1rem",marginBottom:".5rem"}}>Documents protégés</div>
              <p style={{color:"rgba(255,255,255,.65)",fontSize:".9rem",lineHeight:1.7,marginBottom:"1.5rem"}}>
                Les documents de <strong style={{color:"white"}}>{talent.prenom} {talent.nom}</strong> sont protégés.<br/>Envoyez une demande d'accès.
              </p>
              <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"14px",padding:"1rem",marginBottom:"1.2rem",textAlign:"left"}}>
                {["📄 CV / Curriculum Vitae","🎓 Diplômes / Certificats","📋 Attestations de travail"].map((d,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:".6rem",padding:".35rem 0",borderBottom:i<2?"1px solid rgba(255,255,255,.06)":"none",fontSize:".85rem",color:"rgba(255,255,255,.6)"}}>
                    {d}
                  </div>
                ))}
              </div>
              <button onClick={demander} disabled={st==="sending"} style={{width:"100%",background:st==="sending"?"#374151":"linear-gradient(135deg,#C9960F,#F0C040)",color:st==="sending"?"#9CA3AF":"#0D3B2E",border:"none",borderRadius:"99px",padding:".75rem",fontWeight:800,fontSize:".95rem",cursor:st==="sending"?"wait":"pointer",transition:"all .2s"}}>
                {st==="sending"?"⏳ Envoi en cours...":"📩 Demander l'accès aux documents"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilDetailPage() {
  const params = useParams();
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Lire la session talent depuis localStorage (stockée par /mon-profil)
    try {
      const saved = localStorage.getItem("tp_talent");
      if (saved) setSession(JSON.parse(saved));
    } catch {}

    async function load() {
      try {
        const data = await getTalent(params.id);
        setTalent(data);
      } catch {
        const found = PROFILS_MOCK.find(p => String(p.id) === String(params.id));
        setTalent(found || null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div style={{minHeight:"100vh",background:"#F0F4F0",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"3rem",marginBottom:"1rem"}}>⏳</div>
          <div style={{color:"#666",fontSize:"1rem",fontWeight:600}}>Chargement du profil...</div>
        </div>
      </div>
    );
  }

  if (!talent) {
    return (
      <div style={{minHeight:"100vh",background:"#F0F4F0",display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
        <div style={{textAlign:"center",maxWidth:500}}>
          <div style={{fontSize:"4rem",marginBottom:"1rem"}}>🔍</div>
          <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.8rem",fontWeight:800,color:"#111",marginBottom:".8rem"}}>Profil introuvable</h1>
          <p style={{color:"#666",fontSize:"1rem",lineHeight:1.7,marginBottom:"1.5rem"}}>Ce profil n'existe pas ou a été supprimé.</p>
          <Link href="/annuaire" style={{display:"inline-flex",alignItems:"center",gap:".5rem",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",color:"white",fontWeight:800,fontSize:".95rem",padding:".8rem 1.5rem",borderRadius:"12px",textDecoration:"none"}}>
            <ArrowLeft size={18} />
            Retour à l'annuaire
          </Link>
        </div>
      </div>
    );
  }

  const waUrl = `https://wa.me/${talent.telephone || WA_NUM1}?text=${encodeURIComponent(`Bonjour ${talent.prenom}, j'ai vu votre profil sur TalentProof et je souhaite vous contacter.`)}`;
  const age = talent.dateNaissance ? new Date().getFullYear() - new Date(talent.dateNaissance).getFullYear() : null;
  const metier = talent.metier === "Autre métier" ? talent.autreMetier : talent.metier;

  return (
    <>
      {lightbox && <LightboxPhoto src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
      {showDocModal && <ModalDoc talent={talent} onClose={() => setShowDocModal(false)} />}

      <div style={{minHeight:"100vh",background:"#F0F4F0"}}>
        {/* Header */}
        <header style={{background:"linear-gradient(135deg,#0B1628 0%,#0F2744 60%,#162F52 100%)",borderBottom:"1px solid rgba(240,192,64,.18)",boxShadow:"0 4px 24px rgba(0,0,0,.4)",padding:"1rem"}}>
          <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:".8rem"}}>
            <Link href="/" style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.2rem",color:"#ECC94B",textDecoration:"none"}}>TalentProof</Link>
            <div style={{display:"flex",alignItems:"center",gap:".75rem",flexWrap:"wrap"}}>
              {session && session.id === talent?.id && (
                <Link href="/mon-profil"
                  style={{display:"inline-flex",alignItems:"center",gap:".35rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",fontWeight:800,fontSize:".8rem",padding:".4rem .95rem",borderRadius:"99px",textDecoration:"none"}}>
                  ✏️ Modifier mon profil
                </Link>
              )}
              <Link href="/annuaire" style={{display:"flex",alignItems:"center",gap:".4rem",color:"rgba(255,255,255,.7)",fontSize:".85rem",textDecoration:"none",fontWeight:600}}>
                <ArrowLeft size={16} />
                Retour à l'annuaire
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section avec photo de profil */}
        <div style={{background:"linear-gradient(135deg,#1B6B47,#2D9A68)",padding:"3rem 1.5rem 2rem",textAlign:"center",position:"relative"}}>
          <div style={{maxWidth:900,margin:"0 auto"}}>
            {/* Photo de profil grande */}
            {talent.avatar_url ? (
              <img
                src={talent.avatar_url}
                alt={`${talent.prenom} ${talent.nom}`}
                onClick={() => setLightbox({src: talent.avatar_url, alt: `${talent.prenom} ${talent.nom}`})}
                style={{width:120,height:120,borderRadius:"50%",objectFit:"cover",border:"4px solid white",boxShadow:"0 8px 32px rgba(0,0,0,.3)",marginBottom:"1rem",cursor:"zoom-in",transition:"transform .2s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
              />
            ) : (
              <div style={{width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"3.5rem",marginBottom:"1rem",border:"4px solid white",boxShadow:"0 8px 32px rgba(0,0,0,.3)"}}>👤</div>
            )}

            <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"2.2rem",fontWeight:900,color:"white",marginBottom:".5rem"}}>
              {talent.prenom} {talent.nom}
              {talent.status === "active" && <CheckCircle size={28} color="#F0C040" style={{display:"inline",marginLeft:".5rem",verticalAlign:"middle"}} />}
            </h1>
            <p style={{color:"rgba(255,255,255,.9)",fontSize:"1.2rem",fontWeight:600,marginBottom:".8rem"}}>{metier}</p>
            <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap",fontSize:".95rem",color:"rgba(255,255,255,.8)"}}>
              <span style={{display:"flex",alignItems:"center",gap:".3rem"}}><MapPin size={16} />{talent.ville}, {talent.pays}</span>
              {age && <span style={{display:"flex",alignItems:"center",gap:".3rem"}}><Calendar size={16} />{age} ans</span>}
              <span style={{display:"flex",alignItems:"center",gap:".3rem"}}><Briefcase size={16} />{talent.experience}</span>
            </div>

            {/* Badges de disponibilité */}
            <div style={{marginTop:"1.2rem"}}>
              <span style={{background:"rgba(255,255,255,.2)",color:"white",padding:".5rem 1.2rem",borderRadius:"99px",fontSize:".9rem",fontWeight:700,display:"inline-block"}}>
                {talent.disponibilite === "immediate" ? "✓ Disponible immédiatement" : talent.disponibilite === "1_month" ? "📅 Disponible dans 1 mois" : "💬 Disponibilité à négocier"}
              </span>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{maxWidth:900,margin:"-2rem auto 4rem",padding:"0 1.5rem"}}>
          <div style={{background:"white",borderRadius:"20px",padding:"2.5rem",boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}>
            
            {/* Présentation */}
            {talent.bio && (
              <div style={{marginBottom:"2.5rem"}}>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#1B6B47",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
                  📝 Présentation
                </h2>
                <p style={{color:"#555",fontSize:"1rem",lineHeight:1.8}}>{talent.bio}</p>
              </div>
            )}

            {/* Compétences */}
            {talent.competences && (
              <div style={{marginBottom:"2.5rem"}}>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#1B6B47",marginBottom:"1rem"}}>
                  💪 Compétences
                </h2>
                <div style={{display:"flex",gap:".5rem",flexWrap:"wrap"}}>
                  {talent.competences.split(',').map((comp, i) => (
                    <span key={i} style={{background:"#F0FDF4",color:"#166534",padding:".5rem 1rem",borderRadius:"99px",fontSize:".9rem",fontWeight:600,border:"1.5px solid #D1FAE5"}}>
                      {comp.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Niveau d'étude */}
            {talent.niveauEtude && (
              <div style={{marginBottom:"2.5rem"}}>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#1B6B47",marginBottom:"1rem"}}>
                  🎓 Formation
                </h2>
                <div style={{background:"#F9FAFB",border:"1.5px solid #E5E7EB",borderRadius:"12px",padding:"1rem"}}>
                  <div style={{fontSize:".95rem",color:"#374151",fontWeight:600}}>{talent.niveauEtude}</div>
                </div>
              </div>
            )}

            {/* Preuve vidéo */}
            {talent.video_url && (
              <div style={{marginBottom:"2.5rem"}}>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#1B6B47",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
                  🎥 Preuve vidéo
                </h2>
                <div style={{background:"#F9FAFB",border:"2px solid #E5E7EB",borderRadius:"16px",overflow:"hidden"}}>
                  <video
                    controls
                    src={talent.video_url}
                    style={{width:"100%",maxHeight:400,background:"#000",display:"block"}}
                  />
                  <div style={{padding:".75rem 1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
                    <span style={{fontSize:".85rem",fontWeight:700,color:"#5B21B6"}}>Vidéo de présentation</span>
                    <span style={{fontSize:".75rem",color:"#16A34A",marginLeft:"auto"}}>✓ Accès public</span>
                  </div>
                </div>
              </div>
            )}

            {/* Médias (Accès libre) */}
            <div style={{marginBottom:"2.5rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#1B6B47",marginBottom:"1rem"}}>
                🎬 Preuves visuelles (Accès libre)
              </h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:"1rem"}}>
                {/* Vidéo */}
                {talent.video_url && (
                  <div style={{background:"#F9FAFB",border:"2px solid #E5E7EB",borderRadius:"16px",overflow:"hidden",transition:"transform .2s",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                    <video controls style={{width:"100%",height:200,objectFit:"cover",background:"#000"}} src={talent.video_url} />
                    <div style={{padding:"1rem",textAlign:"center"}}>
                      <div style={{fontSize:".9rem",fontWeight:700,color:"#5B21B6",marginBottom:".3rem"}}>🎥 Vidéo de présentation</div>
                      <div style={{fontSize:".75rem",color:"#16A34A"}}>✓ Accès public</div>
                    </div>
                  </div>
                )}

                {/* Photo de réalisation */}
                {talent.preuve_url && (
                  <div style={{background:"#F9FAFB",border:"2px solid #E5E7EB",borderRadius:"16px",overflow:"hidden",transition:"transform .2s",cursor:"pointer"}} onClick={() => setLightbox({src: talent.preuve_url, alt: "Photo de réalisation"})} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                    <img src={talent.preuve_url} alt="Réalisation" style={{width:"100%",height:200,objectFit:"cover"}} />
                    <div style={{padding:"1rem",textAlign:"center"}}>
                      <div style={{fontSize:".9rem",fontWeight:700,color:"#0F766E",marginBottom:".3rem"}}>📸 Photo de réalisation</div>
                      <div style={{fontSize:".75rem",color:"#16A34A"}}>✓ Accès public</div>
                    </div>
                  </div>
                )}

                {!talent.video_url && !talent.preuve_url && (
                  <div style={{gridColumn:"1/-1",textAlign:"center",padding:"2rem",color:"#9CA3AF"}}>
                    <div style={{fontSize:"2rem",marginBottom:".5rem"}}>📷</div>
                    <div style={{fontSize:".9rem"}}>Aucune preuve visuelle ajoutée pour le moment</div>
                  </div>
                )}
              </div>
            </div>

            {/* Documents (Accès protégé) */}
            {(talent.cvUrl || talent.diplomeUrl) && (
              <div style={{marginBottom:"2.5rem"}}>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#1B6B47",marginBottom:"1rem"}}>
                  🔒 Documents administratifs (Accès protégé)
                </h2>
                <div style={{background:"#FFF7ED",border:"2px solid #FCD34D",borderRadius:"16px",padding:"1.5rem",textAlign:"center"}}>
                  <div style={{fontSize:"2.5rem",marginBottom:".8rem"}}>🔐</div>
                  <div style={{fontSize:"1rem",fontWeight:700,color:"#92400E",marginBottom:".5rem"}}>Documents confidentiels</div>
                  <p style={{color:"#B45309",fontSize:".9rem",lineHeight:1.6,marginBottom:"1.2rem"}}>
                    CV, diplômes et attestations sont protégés. Demandez l'accès pour les consulter.
                  </p>
                  <button onClick={() => setShowDocModal(true)} style={{background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",border:"none",borderRadius:"99px",padding:".7rem 1.5rem",fontWeight:800,fontSize:".9rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(201,150,15,.3)"}}>
                    📩 Demander l'accès aux documents
                  </button>
                </div>
              </div>
            )}

            {/* Informations de contact */}
            <div style={{background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",border:"2px solid #86EFAC",borderRadius:"16px",padding:"2rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#065F46",marginBottom:"1.5rem",textAlign:"center"}}>
                📞 Contacter {talent.prenom}
              </h2>
              
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1rem",marginBottom:"1.5rem"}}>
                <div style={{background:"white",borderRadius:"12px",padding:"1rem",textAlign:"center"}}>
                  <Phone size={24} color="#1B6B47" style={{margin:"0 auto .5rem"}} />
                  <div style={{fontSize:".8rem",color:"#9CA3AF",marginBottom:".3rem"}}>Téléphone</div>
                  <div style={{fontSize:".95rem",fontWeight:700,color:"#111"}}>{talent.telephone}</div>
                </div>
                {talent.email && (
                  <div style={{background:"white",borderRadius:"12px",padding:"1rem",textAlign:"center"}}>
                    <Mail size={24} color="#1B6B47" style={{margin:"0 auto .5rem"}} />
                    <div style={{fontSize:".8rem",color:"#9CA3AF",marginBottom:".3rem"}}>Email</div>
                    <div style={{fontSize:".95rem",fontWeight:700,color:"#111",wordBreak:"break-all"}}>{talent.email}</div>
                  </div>
                )}
              </div>

              <a href={waUrl} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".6rem",background:"#25D366",color:"white",fontWeight:800,fontSize:"1.05rem",padding:"1rem 2rem",borderRadius:"12px",textDecoration:"none",boxShadow:"0 4px 20px rgba(37,211,102,.4)",transition:"transform .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <WaLogo size={22} />
                Contacter sur WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{background:"#0B1628",padding:"2rem 1rem",textAlign:"center"}}>
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <div style={{fontFamily:"'Sora',sans-serif",color:"#F0C040",fontWeight:800,fontSize:"1rem",marginBottom:".8rem"}}>TalentProof Afrique</div>
            <div style={{display:"flex",gap:".8rem",justifyContent:"center",flexWrap:"wrap",fontSize:".85rem",marginBottom:"1rem"}}>
              <Link href="/" style={{color:"rgba(210,225,245,.6)",textDecoration:"none"}}>Accueil</Link>
              <span style={{color:"rgba(255,255,255,.3)"}}>·</span>
              <Link href="/annuaire" style={{color:"rgba(210,225,245,.6)",textDecoration:"none"}}>Annuaire</Link>
              <span style={{color:"rgba(255,255,255,.3)"}}>·</span>
              <Link href="/inscription-talent" style={{color:"rgba(210,225,245,.6)",textDecoration:"none"}}>Inscription</Link>
            </div>
            <div style={{color:"rgba(255,255,255,.3)",fontSize:".75rem"}}>
              © {new Date().getFullYear()} TalentProof Afrique — Tous droits réservés
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
