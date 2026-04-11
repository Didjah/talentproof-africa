"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getAll } from "@/services/api";

const WA_NUM1  = "2250705503089";
const WA_NUM2  = "2250507939706";
const EMAIL    = "contact@talentproof.africa";
const VID_DEMO = "https://www.w3schools.com/html/mov_bbb.mp4";

/* ── Profils mockés (fallback) ── */
const PROFILS_MOCK = [
  {
    id:1, prenom:"Moussa", nom:"Diallo", metier:"Chauffeur VTC", ville:"Dakar", pays:"Sénégal",
    age:34, exp:"7 ans", avatar:"🚗", dispo:"immediate", typeProfile:"expert", niveau:null,
    bio:"Chauffeur professionnel, habitué des trajets aéroport et longue distance. Véhicule climatisé, ponctuel.",
    tags:["VTC","Aéroport","Longue distance"],
    verified:true, hasVideo:true, hasPhoto:true, hasDoc:true,
    grad:"linear-gradient(135deg,#0B1628,#1A3560)", accent:"#4A9EFF", phone:"221770000001",
    videoUrl: VID_DEMO,
    photoUrl:"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=700&q=80",
  },
  {
    id:2, prenom:"Fatou", nom:"Ndiaye", metier:"Couturière", ville:"Abidjan", pays:"Côte d'Ivoire",
    age:38, exp:"12 ans", avatar:"✂️", dispo:"1_month", typeProfile:"expert", niveau:null,
    bio:"Spécialisée en tenues de cérémonie, wax et bazin. Créations uniques alliant tradition et modernité.",
    tags:["Wax","Cérémonie","Sur-mesure"],
    verified:true, hasVideo:true, hasPhoto:true, hasDoc:true,
    grad:"linear-gradient(135deg,#1A0018,#3D0038)", accent:"#D06EFF", phone:"2250700000002",
    videoUrl: VID_DEMO,
    photoUrl:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80",
  },
  {
    id:3, prenom:"Kwame", nom:"Asante", metier:"Gardien", ville:"Accra", pays:"Ghana",
    age:42, exp:"5 ans", avatar:"🛡️", dispo:"immediate", typeProfile:"simple",
    niveau:"Niveau 3ème",
    bio:"Agent de sécurité expérimenté, réactif et discret. Disponible nuit et week-end. Références sur demande.",
    tags:["Sécurité","Résidentiel","Nuit"],
    verified:false, hasVideo:false, hasPhoto:false, hasDoc:false,
    grad:"linear-gradient(135deg,#071F15,#1B6B47)", accent:"#F0C040", phone:"233200000003",
    videoUrl:null, photoUrl:null,
  },
  {
    id:4, prenom:"Aïssatou", nom:"Ba", metier:"Aide ménagère", ville:"Dakar", pays:"Sénégal",
    age:29, exp:"8 ans", avatar:"🏠", dispo:"immediate", typeProfile:"simple",
    niveau:"Sans niveau d'étude",
    bio:"Entretien complet de maison, repassage, cuisine africaine et européenne. Sérieuse et honnête.",
    tags:["Ménage","Cuisine","Repassage"],
    verified:true, hasVideo:false, hasPhoto:true, hasDoc:false,
    grad:"linear-gradient(135deg,#1A1000,#3D2800)", accent:"#F0C040", phone:"221770000004",
    videoUrl:null,
    photoUrl:"https://images.unsplash.com/photo-1563453392212-326f5e854473?w=700&q=80",
  },
  {
    id:5, prenom:"Kofi", nom:"Mensah", metier:"Électricien", ville:"Lagos", pays:"Nigeria",
    age:36, exp:"9 ans", avatar:"⚡", dispo:"negotiable", typeProfile:"pratique", niveau:null,
    bio:"Installation et dépannage électrique toutes marques. Certifié, travail soigné.",
    tags:["Installation","Dépannage","Certifié"],
    verified:true, hasVideo:false, hasPhoto:true, hasDoc:true,
    grad:"linear-gradient(135deg,#1A1000,#3D2800)", accent:"#EAB308", phone:"2348000000005",
    videoUrl:null,
    photoUrl:"https://images.unsplash.com/photo-1621905251189-08b45249be0b?w=700&q=80",
  },
  {
    id:6, prenom:"Marie-Claire", nom:"Koffi", metier:"Cuisinière", ville:"Abidjan", pays:"Côte d'Ivoire",
    age:45, exp:"15 ans", avatar:"👩‍🍳", dispo:"immediate", typeProfile:"pratique", niveau:null,
    bio:"Cuisine africaine et internationale. Traiteur pour événements et mariages jusqu'à 200 couverts.",
    tags:["Traiteur","Événements","Africaine"],
    verified:false, hasVideo:true, hasPhoto:true, hasDoc:false,
    grad:"linear-gradient(135deg,#3D0018,#1A000B)", accent:"#F97316", phone:"2250700000006",
    videoUrl: VID_DEMO,
    photoUrl:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80",
  },
];

const DISPO_COLOR = { immediate:"#16A34A", "1_month":"#D97706", negotiable:"#6B7280" };
const DISPO_LABEL = { immediate:"Disponible", "1_month":"Dans 1 mois", negotiable:"À négocier" };

/* Badge type — couleurs distinctes */
const TYPE_STYLE = {
  expert:   { label:"Expert",   bg:"#1D4ED8", color:"white" },
  pratique: { label:"Pratique", bg:"#D97706", color:"white" },
  simple:   { label:"Simple",   bg:"#6B7280", color:"white" },
};

function WaLogo({size=18}){
  return(
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.527 5.852L.057 23.5l5.797-1.497A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.162-1.416l-.37-.218-3.441.889.917-3.346-.24-.387A9.944 9.944 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
    </svg>
  );
}

/* ── Modals ── */
function Modal({onClose,children}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div onClick={e=>e.stopPropagation()} style={{position:"relative",maxWidth:700,width:"100%",borderRadius:"18px",overflow:"hidden",background:"#111"}}>
        <button onClick={onClose} style={{position:"absolute",top:10,right:12,background:"rgba(255,255,255,.12)",border:"none",borderRadius:"50%",width:34,height:34,color:"white",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>✕</button>
        {children}
      </div>
    </div>
  );
}

function ModalVideo({p,onClose}){
  const waUrl=`https://wa.me/${p.phone}?text=${encodeURIComponent(`Bonjour ${p.prenom}, j'ai vu ta vidéo sur TalentProof.`)}`;
  return(
    <Modal onClose={onClose}>
      <div style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:".9rem 1.1rem .7rem"}}>
        <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,color:"white",fontSize:".9rem"}}>🎥 {p.prenom} {p.nom} — {p.metier}</div>
        <div style={{color:"rgba(255,255,255,.5)",fontSize:".74rem"}}>📍 {p.ville}, {p.pays}</div>
      </div>
      {p.videoUrl
        ?<video controls autoPlay style={{width:"100%",maxHeight:420,background:"#000",display:"block"}} src={p.videoUrl}/>
        :<div style={{background:"linear-gradient(135deg,#071F15,#1B6B47)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"3.5rem 1rem",textAlign:"center"}}>
          <span style={{fontSize:"4rem",marginBottom:".6rem"}}>{p.avatar}</span>
          <div style={{color:"white",fontWeight:700,fontSize:".9rem"}}>Vidéo en cours de validation</div>
        </div>
      }
      <div style={{padding:".8rem 1.1rem",background:"#1a1a1a",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:".5rem"}}>
        <span style={{color:"rgba(255,255,255,.45)",fontSize:".74rem"}}>Preuve vidéo · TalentProof</span>
        <a href={waUrl} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".79rem",padding:".5rem 1rem",borderRadius:"99px",textDecoration:"none"}}><WaLogo size={15}/> Contacter {p.prenom}</a>
      </div>
    </Modal>
  );
}

function ModalPhoto({p,onClose}){
  const waUrl=`https://wa.me/${p.phone}?text=${encodeURIComponent(`Bonjour ${p.prenom}, j'ai vu ta photo sur TalentProof.`)}`;
  return(
    <Modal onClose={onClose}>
      <div style={{background:"linear-gradient(135deg,#071F15,#1B6B47)",padding:".9rem 1.1rem .7rem"}}>
        <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,color:"white",fontSize:".9rem"}}>📸 {p.prenom} {p.nom} — Réalisation</div>
      </div>
      {p.photoUrl
        ?<img src={p.photoUrl} alt={`Photo de ${p.prenom}`} style={{width:"100%",maxHeight:480,objectFit:"cover",display:"block"}}/>
        :<div style={{background:"linear-gradient(135deg,#1A0018,#3D0038)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"3.5rem 1rem",textAlign:"center"}}>
          <span style={{fontSize:"4rem",marginBottom:".6rem"}}>{p.avatar}</span>
          <div style={{color:"white",fontWeight:700,fontSize:".9rem"}}>Photo en cours de validation</div>
        </div>
      }
      <div style={{padding:".8rem 1.1rem",background:"#1a1a1a",display:"flex",justifyContent:"flex-end"}}>
        <a href={waUrl} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".79rem",padding:".5rem 1rem",borderRadius:"99px",textDecoration:"none"}}><WaLogo size={15}/> Contacter {p.prenom}</a>
      </div>
    </Modal>
  );
}

function ModalDoc({p,onClose}){
  const [st,setSt]=useState("idle");
  const demander=()=>{setSt("sending");setTimeout(()=>setSt("ok"),1500);};
  return(
    <Modal onClose={onClose}>
      <div style={{padding:"1.75rem 1.25rem",textAlign:"center"}}>
        {st==="ok"?(
          <>
            <div style={{fontSize:"2.8rem",marginBottom:".6rem"}}>✅</div>
            <div style={{fontFamily:"'Sora',sans-serif",color:"white",fontWeight:800,fontSize:"1rem",marginBottom:".4rem"}}>Demande envoyée !</div>
            <p style={{color:"rgba(255,255,255,.62)",fontSize:".83rem",lineHeight:1.65,marginBottom:"1rem"}}>{p.prenom} recevra ta demande. Réponse sous 24h.</p>
            <button onClick={onClose} style={{background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",border:"none",borderRadius:"99px",padding:".6rem 1.5rem",fontWeight:700,fontSize:".85rem",cursor:"pointer"}}>Fermer</button>
          </>
        ):(
          <>
            <div style={{fontSize:"2.8rem",marginBottom:".6rem"}}>🔒</div>
            <div style={{fontFamily:"'Sora',sans-serif",color:"white",fontWeight:800,fontSize:"1rem",marginBottom:".4rem"}}>Accès réservé aux recruteurs vérifiés</div>
            <p style={{color:"rgba(255,255,255,.62)",fontSize:".83rem",lineHeight:1.65,marginBottom:"1.25rem"}}>
              Le document de <strong style={{color:"white"}}>{p.prenom} {p.nom}</strong> est protégé.<br/>Envoie une demande — le talent décide.
            </p>
            <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"12px",padding:".9rem",marginBottom:"1.1rem",textAlign:"left"}}>
              {["Diplôme / Certificat","Attestation de travail"].map((d,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:".5rem",padding:".28rem 0",borderBottom:i===0?"1px solid rgba(255,255,255,.06)":"none",fontSize:".8rem",color:"rgba(255,255,255,.55)"}}>
                  <span>🔒</span>{d}
                </div>
              ))}
            </div>
            <button onClick={demander} disabled={st==="sending"} style={{width:"100%",background:st==="sending"?"#374151":"linear-gradient(135deg,#C9960F,#F0C040)",color:st==="sending"?"#9CA3AF":"#0D3B2E",border:"none",borderRadius:"99px",padding:".68rem",fontWeight:800,fontSize:".88rem",cursor:st==="sending"?"wait":"pointer",transition:"all .2s"}}>
              {st==="sending"?"⏳ Envoi…":"📩 Demander l'accès"}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ── Lightbox Photo ── */
function LightboxPhoto({src,alt,onClose}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",cursor:"zoom-out"}}>
      <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"rgba(255,255,255,.15)",border:"none",borderRadius:"50%",width:40,height:40,color:"white",cursor:"pointer",fontSize:"1.2rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.15)"}>✕</button>
      <img src={src} alt={alt} onClick={e=>e.stopPropagation()} style={{maxWidth:"90%",maxHeight:"90vh",borderRadius:"12px",boxShadow:"0 20px 60px rgba(0,0,0,.5)",cursor:"default"}}/>
    </div>
  );
}

/* ── Carte profil ── */
function CarteProfilCard({p}){
  const [modal,setModal]=useState(null);
  const [lightbox,setLightbox]=useState(false);
  const waUrl=`https://wa.me/${p.phone}?text=${encodeURIComponent(`Bonjour ${p.prenom}, j'ai vu ton profil sur TalentProof et je souhaite te contacter.`)}`;
  const ts=TYPE_STYLE[p.typeProfile]||TYPE_STYLE.simple;

  return(
    <>
      {modal==="video"&&<ModalVideo p={p} onClose={()=>setModal(null)}/>}
      {modal==="photo"&&<ModalPhoto p={p} onClose={()=>setModal(null)}/>}
      {modal==="doc"  &&<ModalDoc   p={p} onClose={()=>setModal(null)}/>}
      {lightbox&&p.photoUrl&&<LightboxPhoto src={p.photoUrl} alt={`${p.prenom} ${p.nom}`} onClose={()=>setLightbox(false)}/>}

      <Link href={`/annuaire/${p.id}`} style={{textDecoration:"none",display:"block"}}>
        <div style={{background:"white",borderRadius:"18px",overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.08)",transition:"transform .2s,box-shadow .2s",display:"flex",flexDirection:"column",cursor:"pointer"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.1),0 12px 32px rgba(0,0,0,.12)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.08)";}}>

        {/* Bannière avec badges */}
        <div style={{height:90,background:p.grad,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 30% 30%,${p.accent}22 0%,transparent 65%)`}}/>
          <span style={{fontSize:"2.6rem",filter:"drop-shadow(0 3px 8px rgba(0,0,0,.3))",position:"relative"}}>{p.avatar}</span>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${p.accent},transparent)`}}/>

          {/* Badge type — haut à gauche */}
          <div style={{position:"absolute",top:".5rem",left:".55rem"}}>
            <span style={{background:ts.bg,color:ts.color,fontSize:".58rem",fontWeight:700,padding:"3px 9px",borderRadius:"99px",whiteSpace:"nowrap",boxShadow:"0 2px 8px rgba(0,0,0,.3)"}}>
              {ts.label}
            </span>
          </div>

          {/* Badges Vidéo / Photo — haut à droite, cliquables */}
          <div style={{position:"absolute",top:".5rem",right:".55rem",display:"flex",flexDirection:"column",gap:".25rem",alignItems:"flex-end"}}>
            {p.hasVideo&&(
              <button onClick={(e)=>{e.preventDefault();e.stopPropagation();setModal("video");}}
                style={{background:"rgba(93,33,211,.9)",color:"white",fontSize:".58rem",fontWeight:700,padding:"3px 9px",borderRadius:"99px",border:"none",cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 2px 8px rgba(0,0,0,.3)",transition:"transform .15s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                ▶ Vidéo
              </button>
            )}
            {p.hasPhoto&&(
              <button onClick={(e)=>{e.preventDefault();e.stopPropagation();setModal("photo");}}
                style={{background:"rgba(15,118,110,.9)",color:"white",fontSize:".58rem",fontWeight:700,padding:"3px 9px",borderRadius:"99px",border:"none",cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 2px 8px rgba(0,0,0,.3)",transition:"transform .15s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                📸 Photo
              </button>
            )}
          </div>
        </div>

        {/* Corps */}
        <div style={{padding:".9rem .95rem 1rem",flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",gap:".58rem",alignItems:"flex-start",marginBottom:".32rem"}}>
            {/* Photo de profil */}
            {p.photoProfilUrl ? (
              <img src={p.photoProfilUrl} alt={`${p.prenom} ${p.nom}`} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"2px solid #E5E7EB",cursor:"default",transition:"transform .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
            ) : (
              <div style={{width:48,height:48,borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg,#E5E7EB,#CBD5E1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",border:"2px solid #E5E7EB"}}>{p.avatar}</div>
            )}
            <div style={{minWidth:0,flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:".28rem",flexWrap:"wrap"}}>
                <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".92rem",color:"#111"}}>{p.prenom} {p.nom}</span>
                {p.verified&&<span style={{background:"#EFF6FF",color:"#1D4ED8",fontSize:".6rem",fontWeight:700,padding:"1px 6px",borderRadius:"99px",whiteSpace:"nowrap"}}>✔ Vérifié</span>}
              </div>
              <div style={{color:"#1B6B47",fontWeight:700,fontSize:".78rem",marginTop:"2px"}}>{p.metier} · {p.exp}</div>
              <div style={{color:"#9CA3AF",fontSize:".72rem"}}>📍 {p.ville}, {p.pays} · {p.age} ans</div>
              {/* Niveau d'étude pour profils simples */}
              {p.niveau&&(
                <div style={{display:"inline-flex",alignItems:"center",gap:".28rem",background:"#F3F4F6",color:"#6B7280",fontSize:".67rem",fontWeight:600,padding:"2px 8px",borderRadius:"99px",marginTop:"3px"}}>
                  🎓 {p.niveau}
                </div>
              )}
            </div>
            <span style={{fontSize:".65rem",fontWeight:700,color:DISPO_COLOR[p.dispo],display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:DISPO_COLOR[p.dispo],display:"inline-block"}}/>
              {DISPO_LABEL[p.dispo]}
            </span>
          </div>

          <p style={{color:"#555",fontSize:".79rem",lineHeight:1.6,margin:".38rem 0 .52rem",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",flex:1}}>
            {p.bio}
          </p>

          {/* Tags */}
          <div style={{display:"flex",gap:".27rem",flexWrap:"wrap",marginBottom:".52rem"}}>
            {p.tags.map(t=>(<span key={t} style={{background:"#F0FDF4",color:"#166534",fontSize:".66rem",fontWeight:600,padding:"2px 7px",borderRadius:"99px",border:"1px solid #D1FAE5"}}>{t}</span>))}
          </div>

          {/* Document verrouillé */}
          {p.hasDoc&&(
            <div style={{marginBottom:".52rem"}}>
              <button onClick={(e)=>{e.preventDefault();e.stopPropagation();setModal("doc");}} style={{display:"inline-flex",alignItems:"center",gap:".32rem",background:"#FFF7ED",color:"#92400E",border:"1px solid #FCD34D",borderRadius:"99px",padding:".3rem .72rem",fontSize:".7rem",fontWeight:700,cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.background="#FEF3C7"} onMouseLeave={e=>e.currentTarget.style.background="#FFF7ED"}>
                🔒 Diplôme/Certificat — Accès
              </button>
            </div>
          )}

          {/* Boutons contact : grand bouton gris subtil + petit carré WA */}
          <div style={{display:"flex",gap:".45rem",alignItems:"center",marginTop:"auto"}}>
            <a href={waUrl} target="_blank" rel="noreferrer" onClick={(e)=>e.stopPropagation()}
              style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",background:"linear-gradient(135deg,#F1F5F9,#E2E8F0)",color:"#475569",fontWeight:700,fontSize:".82rem",padding:".6rem",borderRadius:"99px",textDecoration:"none",boxShadow:"0 2px 8px rgba(148,163,184,.15)",transition:"transform .15s,box-shadow .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(148,163,184,.22)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 8px rgba(148,163,184,.15)";}}>
              Contacter
            </a>
            {/* Petit bouton carré WhatsApp */}
            <a href={waUrl} target="_blank" rel="noreferrer" onClick={(e)=>e.stopPropagation()}
              style={{width:40,height:40,borderRadius:"10px",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",flexShrink:0,boxShadow:"0 2px 10px rgba(37,211,102,.38)",transition:"transform .15s"}}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              <WaLogo size={19}/>
            </a>
          </div>
        </div>
        </div>
      </Link>
    </>
  );
}

/* ── Page ── */
export default function AnnuairePage(){
  const [filtre,setFiltre]=useState("Tous");
  const [search,setSearch]=useState("");
  const [typeF, setTypeF] =useState("tous");
  const [profils, setProfils] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les profils depuis localStorage au montage
  useEffect(() => {
    async function chargerTalents() {
      try {
        const talents = await getAll();
        const profilsFormatés = (talents || []).map((t, index) => ({
      id: t.id || index + 1,
      prenom: t.prenom || "Talent",
      nom: t.nom || "",
      metier: t.metier === "Autre métier" ? t.autreMetier : t.metier,
      ville: t.ville || "Non spécifié",
      pays: t.pays || "Afrique",
      age: t.dateNaissance ? new Date().getFullYear() - new Date(t.dateNaissance).getFullYear() : null,
      exp: t.experience || "Non spécifié",
      avatar: "👤",
      dispo: t.disponibilite || "negotiable",
      typeProfile: "simple", // Par défaut
      niveau: t.niveauEtude || null,
      bio: t.bio || "Profil en cours de validation",
      tags: t.competences ? t.competences.split(',').map(c => c.trim()).slice(0, 3) : [],
      verified: t.status === "active",
      hasVideo: !!t.videoUrl,
      hasPhoto: !!t.photoRealisationUrl, // Photo de réalisation (publique)
      hasDoc: !!(t.cvUrl || t.diplomeUrl), // Documents protégés
      grad: "linear-gradient(135deg,#0B1628,#1A3560)",
      accent: "#4A9EFF",
      phone: t.telephone || WA_NUM1,
      videoUrl: t.videoUrl || null,
      photoUrl: t.photoRealisationUrl || null, // Photo de réalisation pour le modal
      photoProfilUrl: t.photoProfilUrl || null, // Photo de profil (avatar)
    }));

    // Si pas de données, utiliser les profils mockés
    const profilsFinaux = profilsFormatés.length > 0 ? profilsFormatés : PROFILS_MOCK;
          setProfils(profilsFinaux);
        } catch (err) {
          console.error("Erreur chargement talents:", err);
          setProfils(PROFILS_MOCK);
        } finally {
          setLoading(false);
        }
      }
      chargerTalents();
  }, []);

  const METIERS = ["Tous", ...new Set(profils.map(p => p.metier))];

  const affichés=profils.filter(p=>{
    if(filtre!=="Tous"&&p.metier!==filtre)return false;
    if(typeF!=="tous"&&p.typeProfile!==typeF)return false;
    const q=search.toLowerCase();
    if(q&&!`${p.prenom} ${p.nom} ${p.metier} ${p.ville}`.toLowerCase().includes(q))return false;
    return true;
  });

  return(
    <div style={{minHeight:"100vh",background:"#F0F4F0",fontFamily:"system-ui,sans-serif"}}>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:"1.4rem 1rem"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".6rem"}}>
            <Link href="/" style={{display:"flex",alignItems:"center",gap:".4rem",textDecoration:"none"}}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{flexShrink:0}}>
                <circle cx="16" cy="16" r="15" fill="url(#grad1)" stroke="#F0C040" strokeWidth="1.5"/>
                <path d="M16 8L19.5 14H12.5L16 8Z" fill="#F0C040"/>
                <circle cx="16" cy="19" r="3.5" fill="#F0C040"/>
                <path d="M10 22L16 19L22 22" stroke="#F0C040" strokeWidth="2" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#0B1628"/>
                    <stop offset="100%" stopColor="#162F52"/>
                  </linearGradient>
                </defs>
              </svg>
              <span style={{color:"rgba(255,255,255,.55)",fontSize:".8rem"}}>← Retour</span>
            </Link>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginTop:".4rem",flexWrap:"wrap",gap:".5rem"}}>
            <div>
              <h1 style={{fontFamily:"'Sora',sans-serif",color:"#F0C040",fontWeight:900,fontSize:"clamp(1.1rem,4vw,1.5rem)",margin:"0 0 .2rem",textShadow:"0 2px 16px rgba(240,192,64,.35)"}}>
                📋 Annuaire des Talents
              </h1>
              <p style={{color:"rgba(210,225,245,.62)",fontSize:".79rem",margin:0}}>
                {profils.length} profils — chauffeurs, artisans, gardiens, personnels de maison
              </p>
            </div>
            <div style={{display:"flex",gap:".45rem",alignItems:"center",flexWrap:"wrap"}}>
              <a href={`mailto:${EMAIL}`} style={{display:"inline-flex",alignItems:"center",gap:".32rem",color:"rgba(210,225,245,.7)",fontSize:".74rem",textDecoration:"none",border:"1px solid rgba(255,255,255,.16)",borderRadius:"99px",padding:".36rem .82rem"}}>
                ✉️ {EMAIL}
              </a>
              <Link href="/inscription-talent" style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",fontWeight:800,fontSize:".79rem",padding:".52rem 1.05rem",borderRadius:"99px",textDecoration:"none",whiteSpace:"nowrap",boxShadow:"0 2px 10px rgba(201,150,15,.35)"}}>
                + Créer mon profil
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div style={{background:"white",borderBottom:"1px solid #E5E7EB",padding:".72rem 1rem"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",flexDirection:"column",gap:".5rem"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Chercher par nom, métier ou ville…"
            style={{width:"100%",padding:".52rem .82rem",borderRadius:".75rem",border:"1.5px solid #D1FAE5",fontSize:".9rem",outline:"none",fontFamily:"inherit"}}/>
          <div style={{display:"flex",gap:".32rem",overflowX:"auto",scrollbarWidth:"none"}}>
            {loading ? (
              <div style={{color:"#9CA3AF",fontSize:".8rem",padding:".5rem"}}>Chargement...</div>
            ) : METIERS.map(m=>(
              <button key={m} onClick={()=>setFiltre(m)} style={{padding:".2rem .78rem",borderRadius:"99px",border:`1.5px solid ${filtre===m?"#1B6B47":"#E5E7EB"}`,background:filtre===m?"#1B6B47":"white",color:filtre===m?"white":"#666",fontWeight:600,fontSize:".74rem",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
                {m}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:".32rem",flexWrap:"wrap"}}>
            {[["tous","Tous"],["expert","🏆 Expert"],["pratique","💪 Pratique"],["simple","🤝 Simple"]].map(([v,l])=>(
              <button key={v} onClick={()=>setTypeF(v)} style={{padding:".2rem .78rem",borderRadius:"99px",border:`1.5px solid ${typeF===v?"#F0C040":"#E5E7EB"}`,background:typeF===v?"#FEF9E7":"white",color:typeF===v?"#92400E":"#666",fontWeight:600,fontSize:".74rem",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grille */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"1.1rem 1rem"}}>
        {loading ? (
          <div style={{textAlign:"center",padding:"3rem 1rem",color:"#9CA3AF"}}>
            <div style={{fontSize:"2rem",marginBottom:".4rem"}}>⏳</div>
            <div style={{fontWeight:700,color:"#444"}}>Chargement des profils...</div>
          </div>
        ) : affichés.length===0 ? (
          <div style={{textAlign:"center",padding:"3rem 1rem",color:"#9CA3AF"}}>
            <div style={{fontSize:"2rem",marginBottom:".4rem"}}>🔍</div>
            <div style={{fontWeight:700,color:"#444"}}>
              {profils.length === 0 ? "Aucun talent inscrit pour le moment. Soyez le premier !" : "Aucun profil trouvé"}
            </div>
            {profils.length > 0 && (
              <button onClick={()=>{setSearch("");setFiltre("Tous");setTypeF("tous");}} style={{marginTop:".75rem",background:"none",border:"1px solid #D1FAE5",borderRadius:"99px",padding:".38rem 1rem",color:"#1B6B47",fontWeight:600,cursor:"pointer"}}>
                Effacer les filtres
              </button>
            )}
            {profils.length === 0 && (
              <Link href="/inscription-talent" style={{display:"inline-block",marginTop:".75rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",fontWeight:700,padding:".5rem 1.2rem",borderRadius:"99px",textDecoration:"none"}}>
                + Créer mon profil
              </Link>
            )}
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:"1rem"}}>
            {affichés.map(p=><CarteProfilCard key={p.id} p={p}/>)}
          </div>
        )}

        {/* Footer */}
        <div style={{textAlign:"center",marginTop:"1.75rem",paddingBottom:"1.5rem",borderTop:"1px solid #E5E7EB",paddingTop:"1.25rem"}}>
          <div style={{marginBottom:".5rem"}}>
            <a href={`mailto:${EMAIL}`} style={{color:"#1B6B47",textDecoration:"none",fontWeight:700,fontSize:".8rem"}}>✉️ {EMAIL}</a>
          </div>
          <div style={{display:"flex",gap:".4rem",justifyContent:"center",alignItems:"center",flexWrap:"wrap",marginBottom:".65rem"}}>
            <span style={{color:"#888",fontSize:".72rem",fontWeight:600}}>+225 07 05 50 30 89</span>
            <span style={{color:"#CCC",fontSize:".72rem"}}>·</span>
            <span style={{color:"#888",fontSize:".72rem",fontWeight:600}}>+225 05 07 93 97 06</span>
            <a href={`https://wa.me/${WA_NUM1}`} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:28,height:28,background:"#25D366",borderRadius:"7px",textDecoration:"none",marginLeft:".2rem",transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><WaLogo size={14}/></a>
          </div>
          <div style={{color:"#AAA",fontSize:".71rem",display:"flex",gap:".45rem",justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/" style={{color:"#1B6B47",textDecoration:"none",fontWeight:600}}>← TalentProof</Link>
            <span>·</span><Link href="/recruteur" style={{color:"#888",textDecoration:"none"}}>Recruteur</Link>
            <span>·</span><Link href="/partenaires-dashboard" style={{color:"#888",textDecoration:"none"}}>Partenaires</Link>
            <span>·</span><Link href="/inscription-talent" style={{color:"#888",textDecoration:"none"}}>Inscription</Link>
            <span>·</span><Link href="/mentions-legales" style={{color:"#888",textDecoration:"none"}}>Mentions légales</Link>
            <span>·</span><Link href="/confidentialite" style={{color:"#888",textDecoration:"none"}}>Confidentialité</Link>
          </div>
        </div>
      </div>
    </div>
  );
}