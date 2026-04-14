"use client";
import { useState, useMemo, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Truck, Scissors, Wrench, Hammer, ChefHat, Laptop, Zap, Package,
  Home, Shield, Leaf, Pen, Users, ShoppingCart,
  Lock, CheckCircle, Mic, Play, Square, RotateCcw, Upload, Menu, X, Search,
  User, Briefcase, Handshake, HelpCircle,
} from "lucide-react";
import { trackWhatsAppClick, initAnalytics } from "@/utils/analytics";
import { supabase } from "@/lib/supabaseClient";

/* ── Cache module-level : survit aux démontages/remontages de PageContent ── */
let CACHED_PROFILS = [];
let _fetchStarted  = false;
const _listeners   = new Set();

function fetchTalentsOnce(onDone) {
  _listeners.add(onDone);
  if (_fetchStarted) {
    if (CACHED_PROFILS.length > 0) onDone();
    return;
  }
  _fetchStarted = true;
  supabase
    .from("talents")
    .select("id,nom,prenom,metier,experience,ville,pays,avatar_url,video_url,bio,telephone,disponibilite,verified,likes,has_video,has_photo,preuve_url")
    .order("created_at", { ascending: false })
    .limit(20)
    .then(({ data, error }) => {
      console.log("[PageContent] Supabase talents →", data, error);
      CACHED_PROFILS = (data || [])
        .filter(t => t.has_video || t.has_photo || t.video_url || t.avatar_url || t.preuve_url)
        .map(t => ({
        id:          t.id,
        nom:         [t.prenom, t.nom].filter(Boolean).join(" "),
        metier:      t.metier      || "",
        experience:  t.experience  || null,
        ville:       t.ville       || "",
        pays:        t.pays        || "",
        avatar:      (((t.prenom||"")[0]||"") + ((t.nom||"")[0]||"")).toUpperCase() || "👤",
        disponible:  t.disponibilite || "negotiable",
        bio:         t.bio         || "",
        mediaType:   t.has_video && t.video_url ? "video" : "image",
        likes:       t.likes       || 0,
        verified:    t.verified    || false,
        fromWhatsApp: false,
        photoUrl:    t.avatar_url  || null,
        video_url:   t.video_url   || null,
        telephone:   t.telephone   || null,
      }));
      _listeners.forEach(fn => fn());
    });
}

const DISPO_COLOR = { immediate:"#16A34A", "1_month":"#D97706", negotiable:"#6B7280" };
const DISPO_LABEL = { immediate:"Disponible", "1_month":"Dispo dans 1 mois", negotiable:"À négocier" };
const MAX_SEC  = 60;
const WA_NUM1  = "2250705503089";
const WA_NUM2  = "2250507939706";
const EMAIL    = "contact@talentproof.africa";

/* ──────────────────────────────────────────────────────────────
   CSS GLOBAL
────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

@keyframes tp-slide-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes tp-spin      { to{transform:rotate(360deg)} }
@keyframes tp-blink     { 0%,100%{opacity:1} 50%{opacity:.3} }
@keyframes tp-glow {
  0%,100%{box-shadow:0 0 0 8px rgba(240,192,64,.15),0 8px 28px rgba(201,150,15,.42)}
  50%    {box-shadow:0 0 0 18px rgba(240,192,64,.07),0 8px 28px rgba(201,150,15,.42)}
}
@keyframes wIn  { from{opacity:0;transform:translateX(-50%) translateY(-14px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
@keyframes wOut { from{opacity:1;transform:translateX(-50%) translateY(0)}     to{opacity:0;transform:translateX(-50%) translateY(-10px)} }
@keyframes wWord{ from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
@keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

.tp-card{width:100%;border-radius:20px;overflow:hidden;background:#fff;
  box-shadow:0 2px 8px rgba(0,0,0,.06),0 8px 28px rgba(0,0,0,.08);
  transition:transform .25s,box-shadow .25s;animation:tp-slide-up .42s cubic-bezier(.22,1,.36,1) both}
.tp-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,.1),0 20px 56px rgba(0,0,0,.13)}
@media(hover:none){.tp-card:hover{transform:none}}

.tp-chips{display:flex;gap:.42rem;overflow-x:auto;overflow-y:hidden;padding:.58rem 1rem;scrollbar-width:none;-webkit-overflow-scrolling:touch;width:100%}
.tp-chips::-webkit-scrollbar{display:none}
.tp-section{width:100%;overflow:hidden;position:relative}

.tp-artisan-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;margin-top:1.1rem;width:100%}
@media(max-width:360px){.tp-artisan-grid{grid-template-columns:repeat(2,1fr)}}
.tp-artisan-card{border-radius:16px;overflow:hidden;position:relative;min-height:158px;box-shadow:0 6px 24px rgba(0,0,0,.3);transition:transform .25s}
.tp-artisan-card:hover{transform:translateY(-3px)}

/* Boutons partenaires */
.btn-biz{background:linear-gradient(135deg,#7C3AED,#DB2777);color:white;border:none}
.btn-edu{background:linear-gradient(135deg,#2563EB,#7C3AED);color:white;border:none}
.btn-afr{background:linear-gradient(135deg,#0EA5E9,#2563EB);color:white;border:none}
.btn-ptab{padding:6px 16px;border-radius:99px;font-size:.78rem;font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap}
.btn-ptab.active{box-shadow:0 0 0 3px rgba(255,255,255,.35);transform:scale(1.04)}

/* Welcome */
.wl-in {animation:wIn  .4s cubic-bezier(.22,1,.36,1) both}
.wl-out{animation:wOut .38s ease-in both}
.wl-word{display:inline-block;animation:wWord .4s cubic-bezier(.22,1,.36,1) both}

/* Nav link hover */
.nav-link{color:rgba(255,255,255,.72);text-decoration:none;font-size:.82rem;font-weight:600;padding:.3rem .55rem;border-radius:8px;transition:color .15s,background .15s;white-space:nowrap}
.nav-link:hover{color:white;background:rgba(255,255,255,.1)}
@media(max-width:768px){.nav-link{display:none}}

/* Mobile menu */
.mob-menu{animation:slideDown .22s ease}
.mob-link{display:block;color:rgba(255,255,255,.8);text-decoration:none;font-size:.92rem;font-weight:600;padding:.75rem 1rem;border-radius:10px;transition:background .15s}
.mob-link:hover{background:rgba(255,255,255,.08);color:white}

/* Nav search */
.nav-search-wrap{display:flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:99px;padding:.3rem .7rem .3rem .5rem;transition:background .2s,border-color .2s;cursor:text}
.nav-search-wrap:focus-within{background:rgba(255,255,255,.16);border-color:rgba(240,192,64,.5)}
.nav-search-input{background:transparent;border:none;outline:none;color:white;font-size:.8rem;font-family:inherit;width:130px;transition:width .2s}
.nav-search-input::placeholder{color:rgba(255,255,255,.45)}
.nav-search-input:focus{width:170px}
@media(max-width:768px){.nav-search-input{width:80px}.nav-search-input:focus{width:100px}}
@media(max-width:900px) and (min-width:769px){.nav-search-input{width:100px}.nav-search-input:focus{width:130px}}

/* Mobile header adjustments */
@media(max-width:768px){
  .header-create-btn{display:none !important}
  .header-nav-links{display:none !important}
  .header-logo-img{height:38px !important}
  .header-logo-text{font-size:.95rem !important}
  .nav-search-wrap{padding:.25rem .55rem .25rem .45rem !important}
}
@media(max-width:400px){
  .header-logo-img{height:35px !important}
  .header-logo-text{font-size:.85rem !important}
  .nav-search-input{width:60px !important}
  .nav-search-input:focus{width:80px !important}
}
`;

function GlobalStyles() { return <style dangerouslySetInnerHTML={{__html:CSS}}/>; }

/* ──────────────────────────────────────────────────────────────
   HEADER / NAVIGATION
────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label:"Annuaire",           href:"/annuaire" },
  { label:"Espace Recruteur",   href:"/recruteur" },
  { label:"Devenir Partenaire", href:"/partenaires-dashboard" },
];

function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const close = (e) => { if (!e.target.closest("[data-mob-menu]")) setMenuOpen(false); };
    if (menuOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  return (
    <header style={{
      position:"sticky", top:0, zIndex:200,
      background:"linear-gradient(135deg,#0B1628 0%,#0F2744 60%,#162F52 100%)",
      borderBottom:"1px solid rgba(240,192,64,.18)",
      boxShadow:"0 4px 24px rgba(0,0,0,.4)",
    }}>
      <div style={{maxWidth:1100, margin:"0 auto", padding:"0 1rem", display:"flex", alignItems:"center", gap:"1rem", height:58}}>

        {/* Logo */}
        <a href="/" style={{display:"flex", alignItems:"center", gap:".45rem", textDecoration:"none", flexShrink:0}}>
          <span className="header-logo-text" style={{fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.1rem", color:"#f5c842", whiteSpace:"nowrap"}}>TalentProof</span>
        </a>

        {/* Liens desktop */}
        <nav className="header-nav-links" style={{display:"flex", alignItems:"center", gap:".1rem", flex:1, justifyContent:"center", flexWrap:"nowrap"}}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </nav>

        {/* Bouton créer profil - caché sur mobile */}
        <a href="/inscription-talent" className="header-create-btn" style={{
          display:"inline-flex", alignItems:"center", gap:".35rem",
          background:"linear-gradient(135deg,#C9960F,#F0C040)",
          color:"#0D3B2E", fontWeight:800, fontSize:".78rem",
          padding:".45rem 1rem", borderRadius:"99px", textDecoration:"none",
          boxShadow:"0 3px 14px rgba(201,150,15,.45)", whiteSpace:"nowrap", flexShrink:0,
          transition:"transform .15s, box-shadow .15s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(201,150,15,.55)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 3px 14px rgba(201,150,15,.45)";}}>
          + Créer mon profil
        </a>

        {/* Burger mobile */}
        <button data-mob-menu onClick={e=>{e.stopPropagation();setMenuOpen(o=>!o);}} style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.18)",
          borderRadius:"8px", width:36, height:36, cursor:"pointer", flexShrink:0,
          color:"white",
        }}>
          {menuOpen ? <X size={18}/> : <Menu size={18}/>}
        </button>
      </div>

      {/* Menu mobile déroulant - Thème Bleu Marine + Or */}
      {menuOpen && (
        <div data-mob-menu className="mob-menu" style={{
          background:"#1A365D",
          borderTop:"1px solid rgba(236,201,75,.2)",
          padding:"1.2rem",
        }}>
          {/* Titre du menu */}
          <div style={{marginBottom:"1rem",paddingBottom:".8rem",borderBottom:"1px solid rgba(236,201,75,.15)"}}>
            <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.1rem",color:"#ECC94B"}}>Menu</div>
            <div style={{color:"rgba(255,255,255,.6)",fontSize:".75rem",marginTop:".2rem"}}>Navigation TalentProof</div>
          </div>

          {/* 5 liens principaux avec icônes dorées */}
          <div style={{display:"flex",flexDirection:"column",gap:".5rem",marginBottom:"1rem"}}>
            <a href="/mon-profil" onClick={()=>setMenuOpen(false)} style={{
              display:"flex", alignItems:"center", gap:".7rem",
              background:"rgba(236,201,75,.08)", border:"1px solid rgba(236,201,75,.2)",
              borderRadius:"12px", padding:".85rem 1rem", textDecoration:"none",
              transition:"all .2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(236,201,75,.15)";e.currentTarget.style.borderColor="rgba(236,201,75,.4)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(236,201,75,.08)";e.currentTarget.style.borderColor="rgba(236,201,75,.2)";}}>
              <User size={20} color="#ECC94B" strokeWidth={2.5}/>
              <div style={{flex:1}}>
                <div style={{color:"white",fontWeight:700,fontSize:".92rem"}}>Mon Profil</div>
                <div style={{color:"rgba(255,255,255,.5)",fontSize:".72rem"}}>Gérer mon compte</div>
              </div>
            </a>

            <a href="/annuaire" onClick={()=>setMenuOpen(false)} style={{
              display:"flex", alignItems:"center", gap:".7rem",
              background:"rgba(236,201,75,.08)", border:"1px solid rgba(236,201,75,.2)",
              borderRadius:"12px", padding:".85rem 1rem", textDecoration:"none",
              transition:"all .2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(236,201,75,.15)";e.currentTarget.style.borderColor="rgba(236,201,75,.4)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(236,201,75,.08)";e.currentTarget.style.borderColor="rgba(236,201,75,.2)";}}>
              <Search size={20} color="#ECC94B" strokeWidth={2.5}/>
              <div style={{flex:1}}>
                <div style={{color:"white",fontWeight:700,fontSize:".92rem"}}>Rechercher un talent</div>
                <div style={{color:"rgba(255,255,255,.5)",fontSize:".72rem"}}>Annuaire complet</div>
              </div>
            </a>

            <a href="/recruteur" onClick={()=>setMenuOpen(false)} style={{
              display:"flex", alignItems:"center", gap:".7rem",
              background:"rgba(236,201,75,.08)", border:"1px solid rgba(236,201,75,.2)",
              borderRadius:"12px", padding:".85rem 1rem", textDecoration:"none",
              transition:"all .2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(236,201,75,.15)";e.currentTarget.style.borderColor="rgba(236,201,75,.4)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(236,201,75,.08)";e.currentTarget.style.borderColor="rgba(236,201,75,.2)";}}>
              <Briefcase size={20} color="#ECC94B" strokeWidth={2.5}/>
              <div style={{flex:1}}>
                <div style={{color:"white",fontWeight:700,fontSize:".92rem"}}>Espace Recruteur</div>
                <div style={{color:"rgba(255,255,255,.5)",fontSize:".72rem"}}>Trouvez vos talents</div>
              </div>
            </a>

            <a href="/partenaires-dashboard" onClick={()=>setMenuOpen(false)} style={{
              display:"flex", alignItems:"center", gap:".7rem",
              background:"rgba(236,201,75,.08)", border:"1px solid rgba(236,201,75,.2)",
              borderRadius:"12px", padding:".85rem 1rem", textDecoration:"none",
              transition:"all .2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(236,201,75,.15)";e.currentTarget.style.borderColor="rgba(236,201,75,.4)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(236,201,75,.08)";e.currentTarget.style.borderColor="rgba(236,201,75,.2)";}}>
              <Handshake size={20} color="#ECC94B" strokeWidth={2.5}/>
              <div style={{flex:1}}>
                <div style={{color:"white",fontWeight:700,fontSize:".92rem"}}>Devenir Partenaire</div>
                <div style={{color:"rgba(255,255,255,.5)",fontSize:".72rem"}}>Formulaire d'inscription</div>
              </div>
            </a>

            <a href="/aide" onClick={()=>setMenuOpen(false)} style={{
              display:"flex", alignItems:"center", gap:".7rem",
              background:"rgba(236,201,75,.08)", border:"1px solid rgba(236,201,75,.2)",
              borderRadius:"12px", padding:".85rem 1rem", textDecoration:"none",
              transition:"all .2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(236,201,75,.15)";e.currentTarget.style.borderColor="rgba(236,201,75,.4)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(236,201,75,.08)";e.currentTarget.style.borderColor="rgba(236,201,75,.2)";}}>
              <HelpCircle size={20} color="#ECC94B" strokeWidth={2.5}/>
              <div style={{flex:1}}>
                <div style={{color:"white",fontWeight:700,fontSize:".92rem"}}>Aide & Support</div>
                <div style={{color:"rgba(255,255,255,.5)",fontSize:".72rem"}}>FAQ et assistance</div>
              </div>
            </a>
          </div>

          {/* Bouton inscription doré */}
          <a href="/inscription-talent" onClick={()=>setMenuOpen(false)} style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:".4rem",
            background:"linear-gradient(135deg,#D69E2E,#ECC94B)", color:"#1A365D",
            fontWeight:800, fontSize:".9rem", padding:".8rem", borderRadius:"12px",
            textDecoration:"none", marginBottom:"1rem", boxShadow:"0 4px 16px rgba(236,201,75,.4)",
          }}>
            + Créer mon profil gratuitement
          </a>

          {/* Contact rapide */}
          <div style={{display:"flex", gap:".5rem", flexWrap:"wrap"}}>
            <a href={`https://wa.me/${WA_NUM1}`} target="_blank" rel="noreferrer"
              style={{display:"inline-flex", alignItems:"center", gap:".35rem", background:"#25D366", color:"white", fontWeight:700, fontSize:".78rem", padding:".5rem .9rem", borderRadius:"99px", textDecoration:"none", flex:1, justifyContent:"center"}}>
              <WaLogo size={14}/> WhatsApp
            </a>
            <a href={`mailto:${EMAIL}`}
              style={{display:"inline-flex", alignItems:"center", gap:".35rem", background:"rgba(255,255,255,.1)", color:"rgba(255,255,255,.8)", fontSize:".78rem", fontWeight:600, padding:".5rem .9rem", borderRadius:"99px", textDecoration:"none", border:"1px solid rgba(255,255,255,.2)", flex:1, justifyContent:"center"}}>
              ✉️ Email
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ──────────────────────────────────────────────────────────────
   UTILITAIRES
────────────────────────────────────────────────────────────── */
function WaLogo({size=18}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.527 5.852L.057 23.5l5.797-1.497A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.162-1.416l-.37-.218-3.441.889.917-3.346-.24-.387A9.944 9.944 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
    </svg>
  );
}

function MetierIcon({metier, color="#1B6B47"}) {
  const p={size:15,color,strokeWidth:2,style:{flexShrink:0}};
  const M={
    Chauffeur:<Truck {...p}/>, Livreur:<Package {...p}/>,
    Couturière:<Scissors {...p}/>, Couturier:<Scissors {...p}/>, Tailleur:<Scissors {...p}/>,
    Mécanicien:<Wrench {...p}/>, Mécanicienne:<Wrench {...p}/>,
    Électricien:<Zap {...p}/>, Plombier:<Wrench {...p}/>, Soudeur:<Wrench {...p}/>, Maçon:<Hammer {...p}/>,
    "Aide ménagère":<Home {...p}/>, "Personnel de maison":<Home {...p}/>,
    Gardien:<Shield {...p}/>, Vigile:<Shield {...p}/>,
    Jardinier:<Leaf {...p}/>, Jardinière:<Leaf {...p}/>,
    Nounou:<Users {...p}/>, "Garde d'enfants":<Users {...p}/>,
    Cuisinier:<ChefHat {...p}/>, Cuisinière:<ChefHat {...p}/>, Pâtissier:<ChefHat {...p}/>,
    Vendeur:<ShoppingCart {...p}/>, Vendeuse:<ShoppingCart {...p}/>, Commerçant:<ShoppingCart {...p}/>,
    Développeur:<Laptop {...p}/>, Développeuse:<Laptop {...p}/>, Graphiste:<Pen {...p}/>,
  };
  return M[metier]??<Wrench {...p}/>;
}

function DocButton({label,nom}) {
  const [st,setSt]=useState("idle");
  const go=()=>{if(st!=="idle")return;setSt("wait");setTimeout(()=>setSt("ok"),1400);};
  if(st==="ok") return (
    <span style={{display:"inline-flex",alignItems:"center",gap:".35rem",background:"#F0FDF4",color:"#15803D",border:"1.5px solid #86EFAC",borderRadius:"99px",padding:".42rem .85rem",fontSize:".77rem",fontWeight:700}}>
      <CheckCircle size={13} color="#16A34A" style={{flexShrink:0}}/> Envoyée à {nom}
    </span>
  );
  return (
    <button onClick={go} disabled={st==="wait"} style={{display:"inline-flex",alignItems:"center",gap:".35rem",background:st==="wait"?"#F3F4F6":"#FFF7ED",color:st==="wait"?"#9CA3AF":"#92400E",border:`1.5px solid ${st==="wait"?"#E5E7EB":"#FCD34D"}`,borderRadius:"99px",padding:".42rem .85rem",fontSize:".77rem",fontWeight:700,cursor:st==="wait"?"wait":"pointer",transition:"all .2s"}}
      onMouseEnter={e=>{if(st==="idle")e.currentTarget.style.background="#FEF3C7"}}
      onMouseLeave={e=>{if(st==="idle")e.currentTarget.style.background="#FFF7ED"}}>
      <Lock size={12} style={{flexShrink:0}}/>{st==="wait"?"Envoi…":`${label} — Accès`}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────
   ENREGISTREUR VOCAL
────────────────────────────────────────────────────────────── */
function VoiceRecorder() {
  const [phase,setPhase]=useState("idle");
  const [elapsed,setElap]=useState(0);
  const [url,setUrl]=useState(null);
  const [err,setErr]=useState("");
  const [bars,setBars]=useState(Array(18).fill(4));
  const recRef=useRef(null),chunks=useRef([]),timer=useRef(null),raf=useRef(null),actx=useRef(null),stream=useRef(null);

  const cleanup=useCallback(()=>{
    clearInterval(timer.current);cancelAnimationFrame(raf.current);
    stream.current?.getTracks().forEach(t=>t.stop());
    actx.current?.close().catch(()=>{});stream.current=null;actx.current=null;
  },[]);
  useEffect(()=>()=>cleanup(),[cleanup]);

  const animate=useCallback((s)=>{
    try{
      const ctx=new(window.AudioContext||window.webkitAudioContext)();actx.current=ctx;
      const an=ctx.createAnalyser();an.fftSize=64;ctx.createMediaStreamSource(s).connect(an);
      const d=new Uint8Array(an.frequencyBinCount);
      const tick=()=>{an.getByteFrequencyData(d);setBars(Array.from({length:18},(_,i)=>Math.max(4,Math.min(46,(d[Math.floor(i*d.length/18)]||0)*.36))));raf.current=requestAnimationFrame(tick);};
      raf.current=requestAnimationFrame(tick);
    }catch{
      const tick=()=>{setBars(Array.from({length:18},()=>Math.random()*42+4));raf.current=requestAnimationFrame(tick);};
      raf.current=requestAnimationFrame(tick);
    }
  },[]);

  const start=async()=>{
    setPhase("ask");setErr("");
    try{
      const s=await navigator.mediaDevices.getUserMedia({audio:true,video:false});
      stream.current=s;chunks.current=[];
      const mime=["audio/webm;codecs=opus","audio/webm","audio/ogg","audio/mp4"].find(t=>MediaRecorder.isTypeSupported(t))||"";
      const rec=new MediaRecorder(s,mime?{mimeType:mime}:{});recRef.current=rec;
      rec.ondataavailable=e=>{if(e.data?.size>0)chunks.current.push(e.data);};
      rec.onstop=()=>{setUrl(URL.createObjectURL(new Blob(chunks.current,{type:mime||"audio/webm"})));setPhase("preview");cleanup();setBars(Array(18).fill(4));};
      rec.start(100);setPhase("rec");setElap(0);animate(s);
      timer.current=setInterval(()=>setElap(n=>{if(n+1>=MAX_SEC){stopRec();return MAX_SEC;}return n+1;}),1000);
    }catch(e){
      setErr(e.name==="NotAllowedError"?"Micro refusé. Active-le dans les réglages.":"Micro non disponible.");
      setPhase("err");
    }
  };
  const stopRec=()=>{clearInterval(timer.current);cancelAnimationFrame(raf.current);if(recRef.current?.state==="recording")recRef.current.stop();};
  const reset=()=>{if(url)URL.revokeObjectURL(url);setUrl(null);setElap(0);setBars(Array(18).fill(4));setPhase("idle");setErr("");cleanup();};
  const send=()=>{setPhase("sending");setTimeout(()=>setPhase("done"),1800);};
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const base={display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",borderRadius:"99px",border:"none",cursor:"pointer",fontWeight:700,fontSize:".84rem",padding:".62rem 1.1rem",width:"100%"};

  return (
    <div style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.11)",borderRadius:"20px",padding:"1.4rem 1.15rem",width:"100%",marginTop:"1.15rem"}}>
      {phase==="done"&&<div style={{textAlign:"center"}}><div style={{fontSize:"2.5rem",marginBottom:".45rem"}}>🎉</div><div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,color:"white",fontSize:".97rem",marginBottom:".3rem"}}>Message vocal reçu !</div><p style={{color:"rgba(255,255,255,.58)",fontSize:".81rem",lineHeight:1.6}}>Notre équipe crée ton profil sous 24h.</p><button onClick={reset} style={{...base,width:"auto",marginTop:".95rem",background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.75)",border:"1px solid rgba(255,255,255,.18)"}}><RotateCcw size={14}/> Nouveau message</button></div>}
      {phase==="err"&&<div style={{textAlign:"center"}}><div style={{fontSize:"1.7rem",marginBottom:".42rem"}}>🚫</div><p style={{color:"#FCA5A5",fontWeight:600,fontSize:".84rem",marginBottom:".9rem"}}>{err}</p><button onClick={reset} style={{...base,width:"auto",background:"rgba(255,255,255,.1)",color:"white",border:"1px solid rgba(255,255,255,.18)"}}>Réessayer</button></div>}
      {phase==="idle"&&<div style={{textAlign:"center"}}><p style={{color:"rgba(255,255,255,.6)",fontSize:".82rem",lineHeight:1.65,marginBottom:"1.2rem"}}>Appuie sur le micro et parle de ton métier.<br/><strong style={{color:"white"}}>60 secondes maximum.</strong></p><button onClick={start} style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#C9960F,#F0C040)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",animation:"tp-glow 2s ease-in-out infinite",transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><Mic size={34} color="#0D3B2E" strokeWidth={2.2}/></button><p style={{color:"rgba(255,255,255,.32)",fontSize:".72rem",marginTop:".8rem"}}>iOS Safari · Android Chrome · Desktop</p></div>}
      {phase==="ask"&&<div style={{textAlign:"center",padding:".5rem 0"}}><div style={{width:44,height:44,borderRadius:"50%",border:"3px solid rgba(240,192,64,.35)",borderTopColor:"#F0C040",animation:"tp-spin .8s linear infinite",margin:"0 auto .8rem"}}/><p style={{color:"rgba(255,255,255,.62)",fontSize:".82rem"}}>Autorisation du micro…</p></div>}
      {phase==="rec"&&<div style={{textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"3px",height:50,marginBottom:".7rem"}}>{bars.map((h,i)=><div key={i} style={{width:4,height:`${h}px`,borderRadius:"99px",background:"linear-gradient(180deg,#F0C040,#C9960F)",transition:"height .07s ease",opacity:.6+(h/46)*.4}}/>)}</div>
        <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,color:"white",fontSize:"1.52rem",letterSpacing:".06em",marginBottom:".38rem"}}>{fmt(elapsed)}</div>
        <div style={{background:"rgba(255,255,255,.1)",borderRadius:"99px",height:5,marginBottom:".95rem",overflow:"hidden"}}><div style={{height:"100%",width:`${(elapsed/MAX_SEC)*100}%`,background:"linear-gradient(90deg,#F0C040,#C9960F)",borderRadius:"99px",transition:"width .9s linear"}}/></div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".42rem",marginBottom:"1rem"}}><span style={{width:9,height:9,borderRadius:"50%",background:"#EF4444",animation:"tp-blink 1s infinite",flexShrink:0}}/><span style={{color:"rgba(255,255,255,.75)",fontSize:".79rem",fontWeight:700}}>Enregistrement en cours</span></div>
        <button onClick={stopRec} style={{width:64,height:64,borderRadius:"50%",background:"#EF4444",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",boxShadow:"0 0 0 10px rgba(239,68,68,.18),0 6px 24px rgba(239,68,68,.5)",transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.07)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><Square size={24} color="white" fill="white"/></button>
        <p style={{color:"rgba(255,255,255,.36)",fontSize:".71rem",marginTop:".6rem"}}>Appuie pour arrêter · max {MAX_SEC} sec</p>
      </div>}
      {phase==="preview"&&url&&<div>
        <div style={{textAlign:"center",marginBottom:".85rem"}}><div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,color:"white",fontSize:".92rem"}}>✅ {fmt(elapsed)} enregistrées</div><div style={{color:"rgba(255,255,255,.48)",fontSize:".77rem",marginTop:"2px"}}>Réécoute avant d&apos;envoyer</div></div>
        <audio controls src={url} style={{width:"100%",borderRadius:"99px",outline:"none",filter:"invert(1) hue-rotate(180deg) brightness(1.1)"}}/>
        <div style={{display:"flex",gap:".55rem",marginTop:".85rem",flexWrap:"wrap"}}>
          <button onClick={reset} style={{...base,flex:"1 1 100px",background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.7)",border:"1px solid rgba(255,255,255,.15)"}}><RotateCcw size={14}/> Recommencer</button>
          <button onClick={send}  style={{...base,flex:"2 1 140px",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",boxShadow:"0 4px 18px rgba(201,150,15,.45)"}}><Upload size={15}/> Envoyer</button>
        </div>
      </div>}
      {phase==="sending"&&<div style={{textAlign:"center",padding:".5rem 0"}}><div style={{width:44,height:44,borderRadius:"50%",border:"3px solid rgba(240,192,64,.35)",borderTopColor:"#F0C040",animation:"tp-spin .8s linear infinite",margin:"0 auto .8rem"}}/><p style={{color:"rgba(255,255,255,.62)",fontSize:".82rem",fontWeight:600}}>Envoi en cours…</p></div>}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   GRILLE ARTISANS
────────────────────────────────────────────────────────────── */
const ARTISANS=[
  {e:"🚗",job:"Chauffeur VTC",name:"Moussa D.",city:"Dakar",  exp:"7 ans", g:"linear-gradient(155deg,#0B1628,#1A3560)",a:"#4A9EFF"},
  {e:"⚡",job:"Électricien",  name:"Kofi A.",  city:"Accra",  exp:"9 ans", g:"linear-gradient(155deg,#1A1000,#3D2800)",a:"#F0C040"},
  {e:"✂️",job:"Couturière",   name:"Fatou N.", city:"Abidjan",exp:"12 ans",g:"linear-gradient(155deg,#1A0018,#3D0038)",a:"#D06EFF"},
];
function ArtisanGrid(){
  return(
    <div className="tp-artisan-grid">
      {ARTISANS.map((a,i)=>(
        <div key={i} className="tp-artisan-card" style={{background:a.g}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 30% 20%,${a.a}20 0%,transparent 65%)`,pointerEvents:"none"}}/>
          <div style={{position:"relative",padding:"1rem .75rem .85rem",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            <div style={{fontSize:"2.35rem",lineHeight:1,filter:"drop-shadow(0 3px 8px rgba(0,0,0,.4))"}}>{a.e}</div>
            <div>
              <div style={{display:"inline-block",background:`${a.a}28`,color:a.a,border:`1px solid ${a.a}55`,borderRadius:"99px",fontSize:".6rem",fontWeight:700,padding:"2px 7px",marginBottom:".38rem",whiteSpace:"nowrap"}}>{a.exp}</div>
              <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,color:"white",fontSize:".8rem",lineHeight:1.2}}>{a.name}</div>
              <div style={{color:a.a,fontWeight:700,fontSize:".68rem",marginTop:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.job}</div>
              <div style={{color:"rgba(255,255,255,.4)",fontSize:".64rem",marginTop:"1px"}}>📍 {a.city}</div>
            </div>
          </div>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${a.a},transparent)`}}/>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   MÉDIAS
────────────────────────────────────────────────────────────── */
function MediaVideo({profil,onClick}){
  const [hov,setHov]=useState(false);
  const [playing,setPlaying]=useState(false);
  const videoRef=useRef(null);

  // Autoplay quand la vidéo entre dans le viewport
  useEffect(()=>{
    const vid=videoRef.current;
    if(!vid)return;
    
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          vid.play().catch(()=>{});
          setPlaying(true);
        }else{
          vid.pause();
          setPlaying(false);
        }
      });
    },{threshold:0.5});
    
    observer.observe(vid);
    return()=>observer.disconnect();
  },[]);

  return(
    <div style={{position:"relative",aspectRatio:"16/9",cursor:"pointer",overflow:"hidden",width:"100%",borderRadius:"12px"}} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick}>
      {profil?.video_url ? (
        <video
          ref={videoRef}
          src={profil.video_url}
          loop
          muted
          playsInline
          style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
        />
      ) : (
        <div style={{width:"100%",aspectRatio:"16/9",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.4)",fontSize:".85rem",borderRadius:"12px"}}>
          Vidéo non disponible
        </div>
      )}
      {/* Overlay avec bouton play */}
      {!playing && (
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:hov?"white":"rgba(255,255,255,.88)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 28px rgba(0,0,0,.32)",transform:hov?"scale(1.08)":"scale(1)",transition:"transform .2s"}}>
            <Play size={21} color="#1a1a1a" fill="#1a1a1a" style={{marginLeft:3}}/>
          </div>
        </div>
      )}
      <div style={{position:"absolute",bottom:".52rem",right:".62rem",background:"rgba(0,0,0,.75)",color:"white",fontSize:".7rem",fontWeight:700,padding:"2px 7px",borderRadius:"6px"}}>0:60</div>
      <div style={{position:"absolute",top:".6rem",left:".6rem"}}>
        <span style={{background:"rgba(93,33,211,.88)",color:"white",fontSize:".68rem",fontWeight:700,padding:"3px 9px",borderRadius:"99px",backdropFilter:"blur(6px)",whiteSpace:"nowrap"}}>🎥 Preuve vidéo</span>
      </div>
    </div>
  );
}
function MediaImage({profil}){
  return(
    <div style={{position:"relative",aspectRatio:"1/1",overflow:"hidden",width:"100%"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#1A0018,#3D0038)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:"clamp(4rem,13vw,8rem)",opacity:.18,userSelect:"none"}}>{profil.avatar}</span>
      </div>
      <div style={{position:"absolute",top:".6rem",left:".6rem"}}>
        <span style={{background:"rgba(15,118,110,.88)",color:"white",fontSize:".68rem",fontWeight:700,padding:"3px 9px",borderRadius:"99px",backdropFilter:"blur(6px)",whiteSpace:"nowrap"}}>📸 Réalisation</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   LIGHTBOX PHOTO
────────────────────────────────────────────────────────────── */
function LightboxPhoto({src,alt,onClose}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",cursor:"zoom-out"}}>
      <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"rgba(255,255,255,.15)",border:"none",borderRadius:"50%",width:40,height:40,color:"white",cursor:"pointer",fontSize:"1.2rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.25)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.15)"}>✕</button>
      <img src={src} alt={alt} onClick={e=>e.stopPropagation()} style={{maxWidth:"90%",maxHeight:"90vh",borderRadius:"12px",boxShadow:"0 20px 60px rgba(0,0,0,.5)",cursor:"default"}}/>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   CARTE TALENT
────────────────────────────────────────────────────────────── */
function TalentCard({profil,onWatch,idx}){
  const isVid=profil.mediaType==="video";
  const [liked,setLiked]=useState(false);
  const [likes,setLikes]=useState(profil.likes||0);
  const [lightbox,setLightbox]=useState(false);
  const like=()=>{setLiked(l=>!l);setLikes(n=>liked?n-1:n+1);};
  const waUrl=`https://wa.me/${WA_NUM1}?text=${encodeURIComponent(`Bonjour, je souhaite contacter ${profil.nom} via TalentProof.`)}`;
  return(
    <>
      {lightbox&&profil.photoUrl&&<LightboxPhoto src={profil.photoUrl} alt={profil.nom} onClose={()=>setLightbox(false)}/>}
      <article className="tp-card" style={{animationDelay:`${idx*.06}s`}}>
        {isVid?<MediaVideo profil={profil} onClick={onWatch}/>:<MediaImage profil={profil}/>}
        <div style={{padding:".88rem .92rem 1rem"}}>
          <div style={{display:"flex",gap:".58rem",alignItems:"flex-start"}}>
            {/* Photo de profil */}
            {profil.photoUrl ? (
              <img src={profil.photoUrl} alt={profil.nom} onClick={()=>setLightbox(true)} style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"2px solid #E5E7EB",cursor:"pointer",transition:"transform .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
            ) : (
            <div style={{width:40,height:40,borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg,#E5E7EB,#CBD5E1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.15rem",border:"2px solid #E5E7EB"}}>{profil.avatar}</div>
          )}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:".28rem",flexWrap:"wrap"}}>
              <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".92rem",color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"145px"}}>{profil.nom}</span>
              {profil.fromWhatsApp&&<span style={{background:"#DCFCE7",color:"#166534",fontSize:".68rem",fontWeight:700,padding:"2px 7px",borderRadius:"99px",whiteSpace:"nowrap"}}>📱 WA</span>}
              {profil.verified&&<span style={{background:"#EFF6FF",color:"#1D4ED8",fontSize:".68rem",fontWeight:700,padding:"2px 7px",borderRadius:"99px",whiteSpace:"nowrap"}}>✔ Vérifié</span>}
            </div>
            <div style={{color:"#1B6B47",fontWeight:700,fontSize:".79rem",marginTop:".1rem",display:"flex",alignItems:"center",gap:".26rem"}}>
              <MetierIcon metier={profil.metier}/>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profil.metier}{profil.experience&&<span style={{color:"#9CA3AF",fontWeight:500}}> · {profil.experience} ans</span>}</span>
            </div>
            <div style={{color:"#9CA3AF",fontSize:".74rem"}}>📍 {profil.ville} {profil.pays}</div>
          </div>
          <span style={{fontSize:".68rem",fontWeight:600,color:DISPO_COLOR[profil.disponible],display:"flex",alignItems:"center",gap:3,flexShrink:0,whiteSpace:"nowrap"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:DISPO_COLOR[profil.disponible],display:"inline-block",flexShrink:0}}/>{DISPO_LABEL[profil.disponible]}
          </span>
        </div>
        <p style={{color:"#555",fontSize:".81rem",lineHeight:1.62,margin:".55rem 0 0",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{profil.bio}</p>
        {profil.documents?.length>0&&<div style={{marginTop:".62rem",display:"flex",flexWrap:"wrap",gap:".38rem"}}>{profil.documents.map((d,i)=><DocButton key={i} label={d} nom={profil.nom}/>)}</div>}
        <div style={{display:"flex",gap:".36rem",marginTop:".75rem",paddingTop:".7rem",borderTop:"1px solid #F0F0F0",flexWrap:"wrap",alignItems:"center"}}>
          {isVid
            ?<button onClick={onWatch} style={{flex:"1 1 98px",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,background:"linear-gradient(135deg,#1B6B47,#2D9A68)",color:"white",border:"none",borderRadius:"99px",padding:".6rem 1rem",fontSize:".79rem",fontWeight:700,cursor:"pointer",boxShadow:"0 2px 10px rgba(27,107,71,.3)"}}><Play size={13}/> Voir la vidéo</button>
            :<button style={{flex:"1 1 98px",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,background:"linear-gradient(135deg,#0D9488,#14B8A6)",color:"white",border:"none",borderRadius:"99px",padding:".6rem 1rem",fontSize:".79rem",fontWeight:700,cursor:"pointer"}}>📸 Photos</button>
          }
          <a href={waUrl} target="_blank" rel="noreferrer" style={{flex:"1 1 82px",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,background:"transparent",color:"#1B6B47",border:"1.5px solid #D1FAE5",borderRadius:"99px",padding:".6rem .9rem",fontSize:".79rem",fontWeight:700,textDecoration:"none",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background="#F0FDF4"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>💬 Contact</a>
          <button onClick={like} style={{padding:".55rem .55rem",borderRadius:"99px",border:"1.5px solid",borderColor:liked?"#FDA4AF":"#E5E7EB",background:liked?"#FFF1F2":"transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:".22rem",fontSize:".76rem",fontWeight:700,color:liked?"#E11D48":"#9CA3AF",transition:"all .15s",flexShrink:0}}>
            {liked?"❤️":"🤍"} {likes}
          </button>
        </div>
      </div>
      </article>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   WELCOME BANNER
────────────────────────────────────────────────────────────── */
function WelcomeBanner(){
  const [vis,setVis]=useState(false);const [out,setOut]=useState(false);
  useEffect(()=>{
    if(sessionStorage.getItem("tp_w"))return;
    const t1=setTimeout(()=>setVis(true),300),t2=setTimeout(()=>setOut(true),4500),t3=setTimeout(()=>{setVis(false);sessionStorage.setItem("tp_w","1");},4900);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[]);
  const dismiss=()=>{setOut(true);setTimeout(()=>{setVis(false);sessionStorage.setItem("tp_w","1");},380);};
  if(!vis)return null;
  const words=["Ton","talent","compte,","diplôme","ou","pas","🤝"];
  return(
    <div className={out?"wl-out":"wl-in"} style={{position:"fixed",top:66,left:"50%",transform:"translateX(-50%)",zIndex:500,width:"calc(100vw - 2rem)",maxWidth:500}}>
      <div style={{background:"linear-gradient(135deg,#0B1628,#162F52)",borderRadius:"1.15rem",padding:".85rem 1.1rem",boxShadow:"0 16px 56px rgba(0,0,0,.5),0 0 0 1px rgba(240,192,64,.26)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:".58rem"}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{color:"#F0C040",fontSize:".65rem",fontWeight:800,letterSpacing:".9px",textTransform:"uppercase",marginBottom:".2rem"}}>✦ Bienvenue sur TalentProof</div>
          <div style={{color:"white",fontWeight:800,fontSize:"clamp(.85rem,2.5vw,.99rem)",lineHeight:1.4}}>{words.map((w,i)=><span key={i} className="wl-word" style={{animationDelay:`${i*.07}s`,marginRight:".26rem"}}>{w}</span>)}</div>
        </div>
        <button onClick={dismiss} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:"50%",width:27,height:27,color:"rgba(255,255,255,.6)",cursor:"pointer",fontSize:".8rem",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   HERO BANNER
────────────────────────────────────────────────────────────── */
function HeroBanner({videos,images}){
  return(
    <div style={{background:"linear-gradient(135deg,#0B1628,#0F2744,#162F52)",borderRadius:"20px",padding:"1.3rem 1.05rem",marginBottom:".88rem",position:"relative",overflow:"hidden",boxShadow:"0 8px 40px rgba(11,22,40,.5)",width:"100%"}}>
      <div style={{position:"absolute",top:-50,right:-50,width:190,height:190,borderRadius:"50%",background:"rgba(240,192,64,.07)",pointerEvents:"none"}}/>
      <div style={{position:"relative"}}>
        <div style={{display:"inline-block",background:"rgba(240,192,64,.14)",color:"#F0C040",fontSize:".65rem",fontWeight:800,letterSpacing:".9px",textTransform:"uppercase",padding:"4px 11px",borderRadius:"99px",marginBottom:".68rem",border:"1px solid rgba(240,192,64,.3)"}}>🤝 Pour tous les talents d&apos;Afrique</div>
        <h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:900,fontSize:"clamp(1rem,4vw,1.38rem)",lineHeight:1.3,margin:"0 0 .48rem",color:"#F0C040",textShadow:"0 2px 16px rgba(240,192,64,.4)"}}>
          Diplômé, certifié, autodidacte —<br/>
          <span style={{color:"#F5F0E8",textShadow:"0 2px 8px rgba(0,0,0,.4)"}}>ta preuve, c&apos;est ce que tu sais faire.</span>
        </h1>
        <p style={{color:"rgba(210,225,245,.74)",fontSize:".81rem",lineHeight:1.65,marginBottom:".95rem"}}>
          Chauffeur, aide ménagère, couturière, gardien…{" "}
          <strong style={{color:"#F5F0E8"}}>Tout le monde a sa place</strong> —{" "}
          {videos} vidéo{videos>1?"s":""} et {images} photo{images>1?"s":""}.
        </p>
        <div style={{display:"flex",gap:".48rem",flexWrap:"wrap"}}>
          <a href="/inscription-talent" style={{display:"inline-flex",alignItems:"center",gap:".35rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",fontWeight:800,fontSize:".84rem",padding:".62rem 1.2rem",borderRadius:"99px",textDecoration:"none",boxShadow:"0 4px 18px rgba(201,150,15,.42)",whiteSpace:"nowrap"}}>+ Créer mon profil</a>
          <a href="/annuaire" style={{fontSize:".79rem",padding:"12px 24px",borderRadius:"30px",border:"2px solid rgba(255,255,255,0.8)",color:"#ffffff",textDecoration:"none",fontWeight:600,whiteSpace:"nowrap",background:"transparent",transition:"background .18s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.15)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>📋 Annuaire →</a>
        </div>
        <ArtisanGrid/>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   SECTION VOCALE - INTERFACE LUXE
────────────────────────────────────────────────────────────── */
function VocalSection(){
  const [userMessage, setUserMessage] = useState("");
  
  const handleMicClick = () => {
    const message = userMessage.trim() || "Je souhaite créer mon profil TalentProof.";
    const waUrl = `https://wa.me/${WA_NUM1}?text=${encodeURIComponent(`Bonjour TalentProof ! Voici mon besoin/avis : ${message}`)}`;
    window.open(waUrl, "_blank");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userMessage.trim()) {
      const waUrl = `https://wa.me/${WA_NUM1}?text=${encodeURIComponent(`Bonjour TalentProof ! Voici mon besoin/avis : ${userMessage.trim()}`)}`;
      window.open(waUrl, "_blank");
    }
  };

  return(
    <div className="tp-section" style={{background:"linear-gradient(160deg,#0A0A0A,#111111,#1A1200)",padding:"2.65rem 1rem",textAlign:"center"}}>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:340,height:340,borderRadius:"50%",background:"radial-gradient(circle,rgba(236,201,75,.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{maxWidth:490,margin:"0 auto",position:"relative"}}>
        <span style={{display:"inline-flex",alignItems:"center",gap:".38rem",background:"rgba(236,201,75,.11)",color:"#ECC94B",fontSize:".67rem",fontWeight:900,letterSpacing:".8px",padding:"5px 13px",borderRadius:"99px",marginBottom:".95rem",border:"1px solid rgba(236,201,75,.26)"}}><Mic size={12}/> CONTACTEZ-NOUS</span>
        <h2 style={{fontFamily:"'Sora',sans-serif",color:"#F5F0E8",fontWeight:900,fontSize:"clamp(1.22rem,4vw,1.82rem)",lineHeight:1.22,marginBottom:".7rem"}}>
          Une question ? Un besoin ?<br/><span style={{color:"#ECC94B"}}>Votre avis compte.</span>
        </h2>
        <p style={{color:"rgba(200,200,200,.66)",fontSize:".84rem",lineHeight:1.68,marginBottom:"1.5rem",maxWidth:370,margin:"0 auto 1.5rem"}}>
          Cliquez sur le micro ou écrivez votre message. <strong style={{color:"#F5F0E8"}}>Nous vous répondons sous 24h.</strong>
        </p>

        {/* Gros bouton Micro doré */}
        <button onClick={handleMicClick} style={{width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,#D69E2E,#ECC94B,#F6E05E)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1.5rem",animation:"tp-glow 2s ease-in-out infinite",transition:"transform .15s",boxShadow:"0 0 0 8px rgba(236,201,75,.15),0 8px 28px rgba(214,158,46,.42)"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          <Mic size={40} color="#1A365D" strokeWidth={2.5}/>
        </button>

        {/* Champ de saisie élégant */}
        <form onSubmit={handleSubmit} style={{maxWidth:420,margin:"0 auto 1rem"}}>
          <div style={{position:"relative"}}>
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Décrivez vos besoins, votre avis compte..."
              style={{
                width:"100%",
                padding:"1rem 1.2rem",
                borderRadius:"16px",
                border:"2px solid rgba(236,201,75,.3)",
                background:"rgba(255,255,255,.08)",
                color:"white",
                fontSize:".9rem",
                fontFamily:"inherit",
                outline:"none",
                transition:"all .2s",
                boxShadow:"0 4px 16px rgba(0,0,0,.2)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#ECC94B";
                e.target.style.background = "rgba(255,255,255,.12)";
                e.target.style.boxShadow = "0 0 0 4px rgba(236,201,75,.15), 0 4px 16px rgba(0,0,0,.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(236,201,75,.3)";
                e.target.style.background = "rgba(255,255,255,.08)";
                e.target.style.boxShadow = "0 4px 16px rgba(0,0,0,.2)";
              }}
            />
            {userMessage.trim() && (
              <button
                type="submit"
                style={{
                  position:"absolute",
                  right:"8px",
                  top:"50%",
                  transform:"translateY(-50%)",
                  background:"linear-gradient(135deg,#D69E2E,#ECC94B)",
                  border:"none",
                  borderRadius:"12px",
                  padding:".6rem 1rem",
                  color:"#1A365D",
                  fontWeight:800,
                  fontSize:".82rem",
                  cursor:"pointer",
                  boxShadow:"0 2px 12px rgba(236,201,75,.4)",
                  transition:"transform .15s",
                }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-50%) scale(1.05)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(-50%) scale(1)"}
              >
                Envoyer →
              </button>
            )}
          </div>
        </form>

        <p style={{color:"rgba(255,255,255,.32)",fontSize:".72rem",marginTop:".8rem"}}>
          Optimisé pour iOS Safari, Android Chrome & Desktop
        </p>

        <div style={{display:"flex",alignItems:"center",gap:".65rem",margin:"1.8rem 0 1.3rem"}}><div style={{flex:1,height:1,background:"rgba(255,255,255,.08)"}}/><span style={{color:"rgba(255,255,255,.3)",fontSize:".71rem",fontWeight:600,whiteSpace:"nowrap"}}>ou via WhatsApp direct</span><div style={{flex:1,height:1,background:"rgba(255,255,255,.08)"}}/></div>
        
        <div style={{display:"flex",gap:".58rem",justifyContent:"center",flexWrap:"wrap"}}>
          <a href={`https://wa.me/${WA_NUM1}?text=${encodeURIComponent("Bonjour TalentProof ! Je souhaite créer mon profil.")}`} target="_blank" rel="noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:".52rem",background:"#25D366",color:"white",fontWeight:800,fontSize:".88rem",padding:".76rem 1.5rem",borderRadius:"99px",textDecoration:"none",boxShadow:"0 4px 20px rgba(37,211,102,.35)",whiteSpace:"nowrap"}}>
            <WaLogo size={20}/> WhatsApp Business
          </a>
        </div>
        
        <div style={{display:"flex",gap:"1.35rem",justifyContent:"center",flexWrap:"wrap",marginTop:"1.75rem"}}>
          {[["Réponse 24h","garantie"],["0 €","gratuit"],["Sans formulaire","simple & rapide"]].map(([v,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Sora',sans-serif",color:"#ECC94B",fontWeight:900,fontSize:".95rem"}}>{v}</div>
              <div style={{color:"rgba(255,255,255,.36)",fontSize:".68rem",marginTop:"2px"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PV=[
  {id:"biz",lab:"💼 Business",btnCls:"btn-biz",txt:"Votre marque employeur au cœur de 14 000+ talents africains. Recrutez plus vite, réduisez vos coûts : badge officiel, statistiques en direct, bouton de contact intégré."},
  {id:"edu",lab:"🎓 Écoles",  btnCls:"btn-edu",txt:"Vos apprenants méritent d'être vus — diplôme ou attestation. Vitrine directe dans le fil des recruteurs africains et internationaux."},
  {id:"afr",lab:"🌍 Afrique", btnCls:"btn-afr",txt:"L'Afrique regorge de talents invisibles. Construisons ensemble l'infrastructure de confiance qu'ils méritent. Impact durable garanti."},
];
/* ──────────────────────────────────────────────────────────────
   SECTION "ILS PROUVENT LEUR TALENT"
────────────────────────────────────────────────────────────── */
function ProuventTalent() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modVideo, setModVideo] = useState(null);

  useEffect(() => {
    supabase
      .from("talents")
      .select("id,nom,prenom,metier,ville,pays,avatar_url,video_url,bio,telephone,disponibilite")
      .not("video_url", "is", null)
      .neq("video_url", "")
      .neq("video_url", "https://www.w3schools.com/html/mov_bbb.mp4")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  if (loading) return null;

  /* Aucun résultat réel → message d'attente */
  if (items.length < 1) return (
    <div style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:"2.8rem 1rem",textAlign:"center"}}>
      <div style={{maxWidth:480,margin:"0 auto"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:".5rem",background:"rgba(240,192,64,.12)",border:"1px solid rgba(240,192,64,.25)",borderRadius:"99px",padding:".35rem .9rem",marginBottom:"1rem"}}>
          <span style={{fontSize:".72rem",color:"#F0C040",fontWeight:700,letterSpacing:".06em"}}>PREUVES RÉELLES</span>
        </div>
        <div style={{fontSize:"2rem",marginBottom:".75rem"}}>🎬</div>
        <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.2rem",color:"white",marginBottom:".5rem"}}>
          Ils prouvent leur talent
        </h2>
        <p style={{color:"rgba(255,255,255,.5)",fontSize:".87rem",lineHeight:1.6,margin:0}}>
          Les premiers talents arrivent bientôt…
        </p>
      </div>
    </div>
  );

  return (
    <div style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:"2.8rem 1rem"}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"1.8rem"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:".5rem",background:"rgba(240,192,64,.12)",border:"1px solid rgba(240,192,64,.25)",borderRadius:"99px",padding:".35rem .9rem",marginBottom:".8rem"}}>
            <span style={{fontSize:".72rem",color:"#F0C040",fontWeight:700,letterSpacing:".06em"}}>PREUVES RÉELLES</span>
          </div>
          <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.45rem",color:"white",marginBottom:".4rem"}}>
            Ils prouvent leur talent
          </h2>
          <p style={{color:"rgba(255,255,255,.55)",fontSize:".85rem",margin:0}}>
            Vidéos vérifiées par TalentProof
          </p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"1.4rem"}}>
          {items.map(t => {
            const prenom  = t.prenom || "Talent";
            const nom     = t.nom    || "";
            const initiales = ((prenom[0] || "") + (nom[0] || "")).toUpperCase();
            const lieu    = [t.ville, t.pays].filter(Boolean).join(" · ");
            const waUrl   = `https://wa.me/${t.telephone || WA_NUM1}?text=${encodeURIComponent(`Bonjour ${prenom}, j'ai vu votre profil sur TalentProof.`)}`;
            const dispoColor = DISPO_COLOR[t.disponibilite];
            const dispoLabel = DISPO_LABEL[t.disponibilite];

            return (
              <div key={t.id}
                onClick={() => router.push(`/annuaire/${t.id}`)}
                style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"18px",overflow:"hidden",cursor:"pointer",transition:"border-color .2s"}}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(240,192,64,.35)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,.08)"}
              >
                {/* Vidéo */}
                <div style={{position:"relative"}}>
                  <video
                    src={t.video_url}
                    controls
                    onClick={e => e.stopPropagation()}
                    style={{width:"100%",maxHeight:300,display:"block",background:"#000"}}
                  />
                  <div style={{position:"absolute",top:10,left:10}}>
                    <span style={{background:"rgba(93,33,211,.92)",color:"white",fontSize:".68rem",fontWeight:700,padding:"4px 10px",borderRadius:"99px",backdropFilter:"blur(4px)"}}>
                      ▶ Preuve vidéo
                    </span>
                  </div>
                </div>

                {/* Profil */}
                <div style={{padding:".9rem 1rem 1rem"}}>
                  <div style={{display:"flex",gap:".7rem",alignItems:"flex-start",marginBottom:".65rem"}}>
                    {/* Avatar ou initiales */}
                    {t.avatar_url
                      ? <img src={t.avatar_url} alt={prenom} style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(255,255,255,.15)",flexShrink:0}}/>
                      : <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".9rem",color:"white",flexShrink:0}}>
                          {initiales || "👤"}
                        </div>
                    }
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:".35rem",flexWrap:"wrap"}}>
                        <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".92rem",color:"white",textDecoration:"underline",textDecorationColor:"rgba(240,192,64,.4)",textUnderlineOffset:"3px"}}>{prenom} {nom}</span>
                        {dispoLabel && (
                          <span style={{background: dispoColor ? dispoColor + "22" : "rgba(255,255,255,.08)", color: dispoColor || "white", border:`1px solid ${dispoColor || "rgba(255,255,255,.2)"}`, fontSize:".6rem",fontWeight:700,padding:"1px 7px",borderRadius:"99px"}}>
                            {dispoLabel}
                          </span>
                        )}
                      </div>
                      <div style={{color:"#86EFAC",fontWeight:700,fontSize:".78rem",marginTop:"1px"}}>
                        {t.metier || "Talent"}
                      </div>
                      {lieu && <div style={{color:"rgba(255,255,255,.45)",fontSize:".72rem"}}>📍 {lieu}</div>}
                    </div>
                  </div>

                  {t.bio && (
                    <p style={{color:"rgba(255,255,255,.6)",fontSize:".79rem",lineHeight:1.55,margin:"0 0 .8rem",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                      {t.bio}
                    </p>
                  )}

                  <div style={{display:"flex",gap:".5rem"}}>
                    <button
                      onClick={e => { e.stopPropagation(); setModVideo(t); }}
                      style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",color:"white",fontWeight:700,fontSize:".8rem",padding:".55rem",borderRadius:"99px",border:"none",cursor:"pointer"}}
                    >
                      ▶ Voir la vidéo
                    </button>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".8rem",padding:".55rem",borderRadius:"99px",textDecoration:"none"}}
                    >
                      <WaLogo size={14}/> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{textAlign:"center",marginTop:"1.5rem"}}>
          <a href="/annuaire" style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",color:"white",fontWeight:700,fontSize:".85rem",padding:".65rem 1.5rem",borderRadius:"99px",textDecoration:"none"}}>
            Voir tous les talents →
          </a>
        </div>
      </div>

      {/* Modal vidéo */}
      {modVideo && (
        <div onClick={() => setModVideo(null)} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
          <div onClick={e => e.stopPropagation()} style={{position:"relative",maxWidth:680,width:"100%",borderRadius:"16px",overflow:"hidden",background:"#111"}}>
            <button onClick={() => setModVideo(null)} style={{position:"absolute",top:10,right:12,background:"rgba(255,255,255,.12)",border:"none",borderRadius:"50%",width:34,height:34,color:"white",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>✕</button>
            <div style={{padding:".8rem 1rem .6rem",background:"linear-gradient(135deg,#0B1628,#162F52)"}}>
              <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,color:"white",fontSize:".88rem"}}>▶ {modVideo.prenom} {modVideo.nom} — {modVideo.metier}</div>
            </div>
            <video controls autoPlay src={modVideo.video_url} style={{width:"100%",maxHeight:420,background:"#000",display:"block"}}/>
          </div>
        </div>
      )}
    </div>
  );
}

function PartnerSection(){
  const [act,setAct]=useState("biz");const [fade,setFade]=useState(false);
  const sw=id=>{if(id===act)return;setFade(true);setTimeout(()=>{setAct(id);setFade(false);},200);};
  const cur=PV.find(v=>v.id===act);
  return(
    <div className="tp-section" style={{background:"linear-gradient(135deg,#071F15,#0D3B2E,#1B4332)",padding:"2.65rem 1rem",textAlign:"center"}}>
      <div style={{position:"absolute",top:-65,right:-65,width:250,height:250,borderRadius:"50%",background:"rgba(240,192,64,.06)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-52,left:-52,width:185,height:185,borderRadius:"50%",background:"rgba(240,192,64,.04)",pointerEvents:"none"}}/>
      <div style={{maxWidth:520,margin:"0 auto",position:"relative"}}>
        <span style={{display:"inline-block",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#3D1C00",fontSize:".66rem",fontWeight:900,letterSpacing:".8px",padding:"4px 13px",borderRadius:"99px",marginBottom:".92rem",boxShadow:"0 2px 14px rgba(201,150,15,.45)"}}>✦ POUR LES ÉCOLES & ENTREPRISES</span>
        <h2 style={{fontFamily:"'Sora',sans-serif",color:"white",fontWeight:900,fontSize:"clamp(1.18rem,4vw,1.78rem)",marginBottom:".92rem",lineHeight:1.25}}>
          Vous recrutez ou formez ?<br/><span style={{color:"#F0C040"}}>Rejoignez TalentProof.</span>
        </h2>
        {/* Boutons colorés Business / Écoles / Afrique */}
        <div style={{display:"flex",gap:".5rem",justifyContent:"center",marginBottom:"1.1rem",flexWrap:"wrap"}}>
          {PV.map(v=>(
            <button key={v.id} onClick={()=>sw(v.id)} className={`btn-ptab ${v.btnCls}${act===v.id?" active":""}`}>
              {v.lab}
            </button>
          ))}
        </div>
        <p style={{color:"rgba(255,255,255,.63)",fontSize:".86rem",lineHeight:1.7,marginBottom:"1.5rem",minHeight:66,opacity:fade?0:1,transition:"opacity .2s"}}>{cur?.txt}</p>
        {/* Compteurs dorés */}
        <div style={{display:"flex",gap:"1.5rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"1.5rem"}}>
          {[["3 partenaires","actifs"],["14 000+","talents"],["9 pays","couverts"]].map(([v,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Sora',sans-serif",color:"#F0C040",fontWeight:900,fontSize:"1.2rem",textShadow:"0 0 20px rgba(240,192,64,.4)"}}>{v}</div>
              <div style={{color:"rgba(255,255,255,.45)",fontSize:".7rem",marginTop:"2px"}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:".65rem",justifyContent:"center",flexWrap:"wrap"}}>
          <a href="/partenaire"
            style={{display:"inline-flex",alignItems:"center",gap:".38rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",fontWeight:900,fontSize:".87rem",padding:".78rem 1.65rem",borderRadius:"99px",textDecoration:"none",boxShadow:"0 4px 20px rgba(201,150,15,.45)",whiteSpace:"nowrap"}}>
            ✦ Devenir Partenaire
          </a>
          <a href={`https://wa.me/${WA_NUM1}?text=${encodeURIComponent("Bonjour, je souhaite devenir partenaire de TalentProof.")}`} target="_blank" rel="noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:".38rem",background:"transparent",color:"white",fontWeight:700,fontSize:".87rem",padding:".78rem 1.5rem",borderRadius:"99px",textDecoration:"none",border:"1.5px solid rgba(255,255,255,.3)",whiteSpace:"nowrap"}}>
            <WaLogo size={16}/> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   OFFRES & ANNONCES
────────────────────────────────────────────────────────────── */
function AnnonceSection() {
  const [annonces, setAnnonces] = useState([]);
  const [ready, setReady]       = useState(false);

  useEffect(() => {
    const charger = async () => {
      const { data: anns } = await supabase
        .from("annonces")
        .select("*, auteur_id, auteur_type")
        .eq("statut", "active")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!anns || anns.length === 0) { setReady(true); return; }

      const recIds  = [...new Set(anns.filter(a => a.auteur_type === "recruteur").map(a => a.auteur_id))];
      const partIds = [...new Set(anns.filter(a => a.auteur_type === "partenaire").map(a => a.auteur_id))];

      const [{ data: recs }, { data: parts }] = await Promise.all([
        recIds.length  > 0 ? supabase.from("recruteurs").select("id,contact_telephone,nom_entreprise").in("id", recIds)  : Promise.resolve({ data: [] }),
        partIds.length > 0 ? supabase.from("partenaires").select("id,contact_telephone,nom_organisation").in("id", partIds) : Promise.resolve({ data: [] }),
      ]);

      const recMap  = Object.fromEntries((recs  || []).map(r => [r.id, r]));
      const partMap = Object.fromEntries((parts || []).map(p => [p.id, p]));

      setAnnonces(anns.map(a => ({
        ...a,
        _auteur: a.auteur_type === "recruteur" ? recMap[a.auteur_id] : partMap[a.auteur_id],
      })));
      setReady(true);
    };
    charger();
  }, []);

  if (!ready || annonces.length === 0) return null;

  return (
    <div style={{background:"linear-gradient(135deg,#0B1628,#0F2744,#162F52)",padding:"2.8rem 1rem"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        {/* Titre */}
        <div style={{textAlign:"center",marginBottom:"1.8rem"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:".5rem",background:"rgba(240,192,64,.12)",border:"1px solid rgba(240,192,64,.28)",borderRadius:"99px",padding:".35rem .95rem",marginBottom:".75rem"}}>
            <span style={{fontSize:".72rem",color:"#F0C040",fontWeight:700,letterSpacing:".06em"}}>📢 OFFRES EN DIRECT</span>
          </div>
          <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:900,fontSize:"clamp(1.2rem,3.5vw,1.6rem)",color:"white",marginBottom:".4rem"}}>
            Offres & Annonces
          </h2>
          <p style={{color:"rgba(255,255,255,.55)",fontSize:".85rem",margin:0}}>
            Publiées directement par nos recruteurs et partenaires vérifiés
          </p>
        </div>

        {/* Grille */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1rem"}}>
          {annonces.map(a => {
            const tel   = a._auteur?.contact_telephone;
            const waUrl = tel
              ? `https://wa.me/${tel.replace(/\D/g,"")}?text=${encodeURIComponent(`Bonjour, j'ai vu votre annonce "${a.titre}" sur TalentProof et je suis intéressé(e).`)}`
              : null;
            const isRec = a.auteur_type === "recruteur";
            const desc  = a.description || "";
            return (
              <div key={a.id}
                style={{background:"#fff",borderRadius:"18px",padding:"1.2rem 1.25rem",boxShadow:"0 2px 12px rgba(0,0,0,.08)",border:"1px solid #E5E7EB",display:"flex",flexDirection:"column",gap:".7rem",transition:"box-shadow .2s,transform .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,.18)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.08)";e.currentTarget.style.transform="none";}}>

                {/* Badges */}
                <div style={{display:"flex",gap:".4rem",flexWrap:"wrap"}}>
                  {a.urgent && (
                    <span style={{background:"#FEF2F2",color:"#DC2626",fontSize:".68rem",fontWeight:800,padding:"3px 9px",borderRadius:"99px",border:"1px solid #FECACA",display:"inline-flex",alignItems:"center",gap:"3px"}}>
                      🔴 URGENT
                    </span>
                  )}
                  <span style={{background:isRec?"#EFF6FF":"#F0FDF4",color:isRec?"#1D4ED8":"#15803D",fontSize:".68rem",fontWeight:700,padding:"3px 9px",borderRadius:"99px",border:`1px solid ${isRec?"#BFDBFE":"#86EFAC"}`}}>
                    {isRec ? "🏢 Recruteur" : "🤝 Partenaire"}
                  </span>
                </div>

                {/* Titre + métier + ville */}
                <div>
                  <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".95rem",color:"#111",marginBottom:".3rem",lineHeight:1.25}}>
                    {a.titre}
                  </div>
                  <div style={{color:"#6B7280",fontSize:".78rem"}}>
                    💼 {a.metier} &nbsp;·&nbsp; 📍 {a.ville}
                  </div>
                </div>

                {/* Description courte */}
                <p style={{color:"#374151",fontSize:".82rem",lineHeight:1.65,margin:0,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                  {desc}
                </p>

                {/* Footer carte */}
                <div style={{marginTop:"auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:".5rem",flexWrap:"wrap"}}>
                  <span style={{color:"#9CA3AF",fontSize:".72rem"}}>
                    {new Date(a.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})}
                  </span>
                  {waUrl ? (
                    <a href={waUrl} target="_blank" rel="noreferrer"
                      style={{display:"inline-flex",alignItems:"center",gap:".35rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".75rem",padding:".42rem .9rem",borderRadius:"99px",textDecoration:"none",whiteSpace:"nowrap",boxShadow:"0 2px 10px rgba(37,211,102,.3)"}}>
                      <WaLogo size={14}/> Contacter sur WhatsApp
                    </a>
                  ) : (
                    <a href={`https://wa.me/${WA_NUM1}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par l'annonce "${a.titre}" sur TalentProof.`)}`} target="_blank" rel="noreferrer"
                      style={{display:"inline-flex",alignItems:"center",gap:".35rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".75rem",padding:".42rem .9rem",borderRadius:"99px",textDecoration:"none",whiteSpace:"nowrap",boxShadow:"0 2px 10px rgba(37,211,102,.3)"}}>
                      <WaLogo size={14}/> Contacter sur WhatsApp
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lien voir toutes */}
        <div style={{textAlign:"center",marginTop:"1.8rem"}}>
          <a href="/annuaire"
            style={{color:"white",fontWeight:700,fontSize:".85rem",textDecoration:"none",border:"1.5px solid rgba(255,255,255,.28)",padding:".55rem 1.4rem",borderRadius:"99px",display:"inline-block",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";e.currentTarget.style.borderColor="rgba(255,255,255,.5)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="rgba(255,255,255,.28)";}}>
            Voir tous les talents disponibles →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   FOOTER
────────────────────────────────────────────────────────────── */
function Footer(){
  return(
    <div style={{background:"#0B1628",padding:"1.5rem 1rem",textAlign:"center"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{fontFamily:"'Sora',sans-serif",color:"#F0C040",fontWeight:800,fontSize:"1rem",marginBottom:".5rem",textShadow:"0 0 20px rgba(240,192,64,.3)"}}>TalentProof Afrique</div>
        <div style={{color:"rgba(255,255,255,.55)",fontSize:".75rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",marginBottom:".5rem"}}>Nous contacter</div>
        <a href={`mailto:${EMAIL}`} style={{display:"inline-block",color:"rgba(210,225,245,.7)",fontSize:".78rem",textDecoration:"none",marginBottom:".75rem"}}>✉️ {EMAIL}</a>
        <div style={{display:"flex",gap:".5rem",justifyContent:"center",alignItems:"center",flexWrap:"wrap",marginBottom:"1rem"}}>
          <span style={{color:"rgba(210,225,245,.7)",fontSize:".77rem",fontWeight:600}}>+225 07 05 50 30 89</span>
          <span style={{color:"rgba(255,255,255,.3)",fontSize:".77rem"}}>·</span>
          <span style={{color:"rgba(210,225,245,.7)",fontSize:".77rem",fontWeight:600}}>+225 05 07 93 97 06</span>
          <a href={`https://wa.me/${WA_NUM1}`} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:32,height:32,background:"#25D366",borderRadius:"8px",textDecoration:"none",marginLeft:".25rem",transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><WaLogo size={16}/></a>
        </div>
        {/* Liens d'inscription rapides */}
        <div style={{display:"flex",gap:".6rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"1.2rem"}}>
          <a href="/inscription-talent" style={{display:"inline-flex",alignItems:"center",gap:".35rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",fontWeight:800,fontSize:".8rem",padding:".55rem 1.1rem",borderRadius:"99px",textDecoration:"none",boxShadow:"0 3px 12px rgba(201,150,15,.35)",transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            🎙️ Créer mon profil
          </a>
          <a href="/inscription-entreprise" style={{display:"inline-flex",alignItems:"center",gap:".35rem",background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.85)",fontWeight:700,fontSize:".8rem",padding:".55rem 1.1rem",borderRadius:"99px",textDecoration:"none",border:"1px solid rgba(255,255,255,.15)",transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.12)";e.currentTarget.style.borderColor="rgba(240,192,64,.4)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.borderColor="rgba(255,255,255,.15)";}}>
            🏢 Inscription Recruteur
          </a>
          <a href="/partenaire" style={{display:"inline-flex",alignItems:"center",gap:".35rem",background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.85)",fontWeight:700,fontSize:".8rem",padding:".55rem 1.1rem",borderRadius:"99px",textDecoration:"none",border:"1px solid rgba(255,255,255,.15)",transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.12)";e.currentTarget.style.borderColor="rgba(240,192,64,.4)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.borderColor="rgba(255,255,255,.15)";}}>
            🤝 Devenir Partenaire
          </a>
        </div>

        {/* Liens de navigation */}
        <div style={{display:"flex",gap:".5rem",justifyContent:"center",flexWrap:"wrap",fontSize:".72rem",marginBottom:".8rem"}}>
          {[["Accueil","/"],["Annuaire","/annuaire"],["Guide","/guide"],["Espace Recruteur","/recruteur"],["Espace Partenaires","/partenaires-dashboard"],["Mentions légales","/mentions-legales"],["Confidentialité","/confidentialite"]].map(([l,h])=>(
            <a key={h} href={h} style={{color:"rgba(210,225,245,.45)",textDecoration:"none",transition:"color .15s"}} onMouseEnter={e=>(e.currentTarget.style.color="#F0C040")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(210,225,245,.45)")}>{l}</a>
          ))}
        </div>
        <div style={{color:"rgba(255,255,255,.2)",fontSize:".68rem",marginTop:"1rem"}}>© {new Date().getFullYear()} TalentProof Afrique — Tous droits réservés</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   BARRE DE RECHERCHE PRINCIPALE
────────────────────────────────────────────────────────────── */
function SearchBar({value,onChange,count,total}){
  const [focus,setFocus]=useState(false);const ref=useRef(null);
  const sugg=["Chauffeur","Aide ménagère","Gardien","Couturière","Mécanicien","Abidjan","Dakar"];
  return(
    <div style={{background:"white",borderBottom:"1px solid #E5E7EB",padding:".72rem 1rem",width:"100%"}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:".52rem",background:focus?"white":"#F7F9F7",border:`2px solid ${focus?"#1B6B47":"#E5E7EB"}`,borderRadius:".82rem",padding:".52rem .82rem",transition:"border-color .18s,box-shadow .18s",boxShadow:focus?"0 0 0 4px rgba(27,107,71,.1)":"none"}}>
          <span style={{fontSize:"1rem",flexShrink:0}}>🔍</span>
          <input ref={ref} value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setFocus(true)} onBlur={()=>setTimeout(()=>setFocus(false),150)}
            placeholder="Métier, compétence, ville ou nom…"
            style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:"1rem",color:"#111",fontFamily:"inherit",minWidth:0}}/>
          {value&&<button onClick={()=>{onChange("");ref.current?.focus();}} style={{background:"#F3F4F6",border:"none",borderRadius:"50%",width:23,height:23,cursor:"pointer",color:"#9CA3AF",fontSize:".76rem",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
        </div>
        {!value&&(
          <div style={{display:"flex",gap:".36rem",flexWrap:"nowrap",marginTop:".44rem",overflowX:"auto",paddingBottom:"2px",scrollbarWidth:"none"}}>
            <span style={{color:"#9CA3AF",fontSize:".73rem",display:"flex",alignItems:"center",flexShrink:0}}>Essaie :</span>
            {sugg.map(s=>(<button key={s} onClick={()=>{onChange(s);ref.current?.focus();}} style={{background:"#F0FDF4",color:"#1B6B47",border:"none",borderRadius:"99px",padding:".17rem .58rem",fontSize:".73rem",fontWeight:600,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>{s}</button>))}
          </div>
        )}
        {value&&(
          <div style={{marginTop:".36rem",fontSize:".74rem",color:"#9CA3AF",display:"flex",alignItems:"center",gap:".3rem"}}>
            <span style={{background:count>0?"#F0FDF4":"#FEF2F2",color:count>0?"#1B6B47":"#DC2626",fontWeight:700,padding:"1px 7px",borderRadius:"99px"}}>{count}</span>
            résultat{count>1?"s":""} sur {total}{count===0&&<span> — essaie « Gardien »</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   PAGE PRINCIPALE
────────────────────────────────────────────────────────────── */
function PageContent(){
  const sp=useSearchParams();
  const [search,setSearch]=useState(sp.get("q")||"");
  const [vidMod,setVidMod]=useState(null);
  const [insMod,setInsMod]=useState(false);
  const [metier,setMetier]=useState("Tous");
  const [tick,setTick]=useState(0);

  useEffect(()=>{const q=sp.get("q");if(q)setSearch(q);},[sp]);

  useEffect(()=>{
    fetchTalentsOnce(()=>setTick(t=>t+1));
    return ()=>{ _listeners.delete(()=>setTick(t=>t+1)); };
  },[]);

  const PROFILS=CACHED_PROFILS;
  const METIERS=["Tous",...new Set(PROFILS.map(p=>p.metier).filter(Boolean))];

  const filtered=useMemo(()=>{
    const q=search.toLowerCase().trim();
    return PROFILS.filter(p=>{
      if(metier!=="Tous"&&p.metier!==metier)return false;
      if(q&&!`${p.nom} ${p.metier} ${p.ville}`.toLowerCase().includes(q))return false;
      return true;
    });
  },[metier,search,tick]);

  const isF=metier!=="Tous"||search.trim()!=="";
  const vids=PROFILS.filter(p=>p.mediaType==="video").length;
  const imgs=PROFILS.filter(p=>p.mediaType==="image").length;
  let ti=-1;

  return(
    <div style={{minHeight:"100vh",background:"#F0F4F0",overflowX:"hidden",width:"100%",position:"relative"}}>
      <GlobalStyles/>
      <WelcomeBanner/>

      <SearchBar value={search} onChange={v=>{setSearch(v);setMetier("Tous");}} count={filtered.length} total={PROFILS.length}/>

      <div className="tp-chips" style={{background:"white",borderBottom:"1px solid #E5E7EB"}}>
        {METIERS.map(m=>(
          <button key={m} onClick={()=>{setMetier(m);setSearch("");}} style={{padding:".26rem .85rem",borderRadius:"99px",border:"1.5px solid",borderColor:metier===m&&!search?"#1B6B47":"#E5E7EB",background:metier===m&&!search?"#1B6B47":"white",color:metier===m&&!search?"white":"#666",fontWeight:600,fontSize:".79rem",cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s",flexShrink:0}}>
            {m}
          </button>
        ))}
      </div>

      <div style={{maxWidth:860,margin:"0 auto",padding:"1.05rem 1rem 1.3rem",width:"100%"}}>
        {!isF&&(
          <>
            <HeroBanner videos={vids} images={imgs}/>
            <div style={{background:"linear-gradient(135deg,#FEF9EE,#FFF7E0)",border:"1.5px solid #FCD34D",borderRadius:"14px",padding:".72rem .88rem",marginBottom:".88rem",display:"flex",alignItems:"flex-start",gap:".58rem"}}>
              <span style={{fontSize:"1.2rem",flexShrink:0}}>💡</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:".83rem",color:"#92400E",marginBottom:".12rem"}}>Pas besoin de diplôme</div>
                <div style={{color:"#B45309",fontSize:".76rem",lineHeight:1.55}}>Une photo ou un vocal de 60 sec suffit. <strong>Tu as ta place ici.</strong></div>
              </div>
            </div>
          </>
        )}

        {filtered.length===0?(
          <div style={{background:"white",borderRadius:"18px",padding:"3rem 1rem",textAlign:"center",color:"#9CA3AF",border:"1px solid #E5E7EB"}}>
            <div style={{fontSize:"2rem",marginBottom:".38rem"}}>🔍</div>
            <div style={{fontWeight:700,color:"#444",fontSize:".91rem"}}>Aucun résultat pour « {search||metier} »</div>
            <button onClick={()=>{setSearch("");setMetier("Tous");}} style={{marginTop:".88rem",background:"none",border:"1.5px solid #D1FAE5",borderRadius:"99px",padding:".42rem 1rem",color:"#1B6B47",fontWeight:600,cursor:"pointer",fontSize:".82rem"}}>✕ Effacer</button>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:".95rem"}}>
            {filtered.map(profil=>{ti++;return(<TalentCard key={profil.id} profil={profil} idx={ti} onWatch={()=>profil.mediaType==="video"&&setVidMod(profil)}/>);})}
            <div style={{background:"white",borderRadius:"20px",padding:"1.45rem 1rem",textAlign:"center",border:"1px solid #E5E7EB",boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
              <div style={{fontSize:"1.28rem",marginBottom:".3rem"}}>🤝</div>
              <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,color:"#111",fontSize:".9rem",marginBottom:".3rem"}}>Tout le monde peut rejoindre TalentProof</div>
              <div style={{color:"#9CA3AF",fontSize:".79rem",marginBottom:".88rem"}}>Diplômé ou pas — une vidéo ou une photo suffit.</div>
              <a href="/inscription-talent" style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",fontWeight:800,fontSize:".85rem",padding:".65rem 1.5rem",borderRadius:"99px",textDecoration:"none",boxShadow:"0 4px 16px rgba(201,150,15,.4)"}}>Créer mon profil gratuitement</a>
            </div>
          </div>
        )}
      </div>

      <ProuventTalent/>
      <VocalSection/>
      <PartnerSection/>
      <AnnonceSection/>

      {/* Section Nos Partenaires */}
      <div style={{background:"white",padding:"2.5rem 1rem",borderTop:"1px solid #E5E7EB"}}>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <h2 style={{fontFamily:"'Sora',sans-serif",color:"#1B6B47",fontWeight:800,fontSize:"1.3rem",marginBottom:".5rem"}}>
            🤝 Nos Partenaires
          </h2>
          <p style={{color:"#9CA3AF",fontSize:".85rem",marginBottom:"2rem"}}>
            Ils nous font confiance pour valoriser les talents africains
          </p>
          <div style={{display:"flex",gap:"2.5rem",justifyContent:"center",alignItems:"center",flexWrap:"wrap"}}>
            {/* Logo CFPT Abidjan */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:".6rem",padding:"1.2rem 1.8rem",background:"#F9FAFB",borderRadius:"16px",border:"1px solid #E5E7EB",minWidth:180,transition:"transform .2s,box-shadow .2s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.08)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="20" fill="url(#cfptGrad)"/>
                <path d="M30 35H70V40H30V35Z" fill="white"/>
                <path d="M35 45H65V50H35V45Z" fill="white" opacity="0.8"/>
                <path d="M40 55H60V60H40V55Z" fill="white" opacity="0.6"/>
                <circle cx="50" cy="70" r="8" fill="#F0C040"/>
                <path d="M46 70L49 73L54 68" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="cfptGrad" x1="0" y1="0" x2="100" y2="100">
                    <stop offset="0%" stopColor="#1B6B47"/>
                    <stop offset="100%" stopColor="#0D3B2E"/>
                  </linearGradient>
                </defs>
              </svg>
              <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".95rem",color:"#1B6B47"}}>CFPT Abidjan</div>
              <div style={{color:"#9CA3AF",fontSize:".72rem",textAlign:"center"}}>Centre de Formation<br/>Professionnelle</div>
            </div>

            {/* Logo Orange Afrique Emploi */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:".6rem",padding:"1.2rem 1.8rem",background:"#F9FAFB",borderRadius:"16px",border:"1px solid #E5E7EB",minWidth:180,transition:"transform .2s,box-shadow .2s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.08)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" fill="url(#orangeGrad)"/>
                <circle cx="50" cy="50" r="30" fill="white"/>
                <circle cx="50" cy="50" r="20" fill="#FF6B00"/>
                <path d="M42 42L58 50L42 58V42Z" fill="white"/>
                <defs>
                  <linearGradient id="orangeGrad" x1="0" y1="0" x2="100" y2="100">
                    <stop offset="0%" stopColor="#FF8C00"/>
                    <stop offset="100%" stopColor="#FF6B00"/>
                  </linearGradient>
                </defs>
              </svg>
              <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".95rem",color:"#FF6B00"}}>Orange Afrique</div>
              <div style={{color:"#9CA3AF",fontSize:".72rem",textAlign:"center"}}>Plateforme Emploi<br/>& Formation</div>
            </div>
          </div>
          <div style={{marginTop:"1.8rem",display:"flex",gap:".6rem",justifyContent:"center",flexWrap:"wrap"}}>
            <a href="/partenaire"
              style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",color:"white",fontWeight:800,fontSize:".85rem",padding:".65rem 1.4rem",borderRadius:"99px",textDecoration:"none",boxShadow:"0 4px 16px rgba(27,107,71,.32)",transition:"all .2s"}}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              ✦ Devenir partenaire
            </a>
            <a href={`https://wa.me/${WA_NUM1}?text=${encodeURIComponent("Bonjour, je souhaite devenir partenaire de TalentProof.")}`} target="_blank" rel="noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"transparent",color:"#1B6B47",fontWeight:700,fontSize:".85rem",padding:".6rem 1.3rem",borderRadius:"99px",textDecoration:"none",border:"1.5px solid #D1FAE5",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#F0FDF4";e.currentTarget.style.borderColor="#1B6B47";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="#D1FAE5";}}>
              💬 Contactez-nous
            </a>
          </div>
        </div>
      </div>

      <Footer/>

      {/* Modal vidéo */}
      {vidMod&&(
        <div onClick={()=>setVidMod(null)} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
          <div onClick={e=>e.stopPropagation()} style={{maxWidth:680,width:"100%",borderRadius:"18px",overflow:"hidden",background:"#111",position:"relative"}}>
            <button onClick={()=>setVidMod(null)} style={{position:"absolute",top:10,right:12,background:"rgba(255,255,255,.12)",border:"none",borderRadius:"50%",width:34,height:34,color:"white",cursor:"pointer",fontSize:"1rem",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            <div style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:"1rem 1.1rem .7rem"}}>
              <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,color:"white",fontSize:".9rem"}}>{vidMod.nom} — {vidMod.metier}</div>
              <div style={{color:"rgba(255,255,255,.5)",fontSize:".74rem"}}>📍 {vidMod.ville}</div>
            </div>
            {vidMod.video_url
              ? <video controls autoPlay style={{width:"100%",maxHeight:400,background:"#000",display:"block"}} src={vidMod.video_url}/>
              : <div style={{width:"100%",height:200,background:"#111",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.4)",fontSize:".85rem"}}>Vidéo non disponible</div>
            }
            <div style={{padding:".8rem 1.1rem",background:"#1a1a1a",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:".5rem"}}>
              <span style={{color:"rgba(255,255,255,.45)",fontSize:".74rem"}}>Preuve vidéo · TalentProof</span>
              <a href={`https://wa.me/${WA_NUM1}?text=${encodeURIComponent(`Bonjour, j'ai vu la vidéo de ${vidMod.nom} sur TalentProof.`)}`} target="_blank" rel="noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".79rem",padding:".5rem 1rem",borderRadius:"99px",textDecoration:"none"}}>
                <WaLogo size={15}/> Contacter {vidMod.nom.split(" ")[0]}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal inscription */}
      {insMod&&(
        <div onClick={()=>setInsMod(false)} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.75)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:"20px",padding:"1.75rem",maxWidth:400,width:"100%",textAlign:"center"}}>
            <div style={{fontSize:"2.5rem",marginBottom:".5rem"}}>🎙️</div>
            <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.1rem",color:"#111",marginBottom:".4rem"}}>Crée ton profil gratuitement</div>
            <p style={{color:"#666",fontSize:".85rem",lineHeight:1.6,marginBottom:"1.1rem"}}>Remplis le formulaire ou inscris-toi directement via WhatsApp.</p>
            <div style={{display:"flex",flexDirection:"column",gap:".55rem"}}>
              <a href="/inscription-talent" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",color:"white",fontWeight:700,fontSize:".88rem",padding:".7rem",borderRadius:"99px",textDecoration:"none"}}>📝 Formulaire d&apos;inscription</a>
              <a href={`https://wa.me/${WA_NUM1}?text=${encodeURIComponent("Bonjour, je veux créer mon profil TalentProof.")}`} target="_blank" rel="noreferrer"
                style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".88rem",padding:".7rem",borderRadius:"99px",textDecoration:"none"}}>
                <WaLogo size={18}/> Inscription via WhatsApp
              </a>
            </div>
            <button onClick={()=>setInsMod(false)} style={{marginTop:".85rem",background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:".8rem"}}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage(){
  return(
    <Suspense fallback={<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#1B6B47",fontWeight:700,fontFamily:"system-ui,sans-serif"}}>Chargement…</div>}>
      <PageContent/>
    </Suspense>
  );
}