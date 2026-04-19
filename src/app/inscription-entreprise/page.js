"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const WA_NUM1 = "2250507939706";

const SECTEURS = [
  "BTP & Construction", "Hôtellerie & Restauration",
  "Commerce & Distribution", "Services aux particuliers",
  "Industrie & Manufacturing", "Transport & Logistique",
  "Santé & Social", "Éducation & Formation",
  "Tech & Digital", "Agriculture & Agro-alimentaire", "Autre"
];

const TAILLES = [
  "TPE (1-9 employés)", "PME (10-249 employés)",
  "Grande entreprise (250+ employés)", "ONG/Association"
];

const PROFILS_RECHERCHES = [
  "Chauffeurs", "Aides ménagères", "Gardiens/Vigiles",
  "Électriciens", "Mécaniciens", "Maçons", "Plombiers",
  "Cuisiniers", "Jardiniers", "Nounous", "Vendeurs",
  "Développeurs", "Graphistes", "Autres"
];

const VOLUMES = [
  "1-5 recrutements/an", "6-20 recrutements/an",
  "21-50 recrutements/an", "50+ recrutements/an"
];

const BUDGETS = [
  "< 500€/mois", "500€ - 2000€/mois",
  "2000€ - 5000€/mois", "> 5000€/mois", "À définir"
];

const ABONNEMENTS = [
  { id:"basique", label:"Basique", prix:"Gratuit",    desc:"Accès limité à 5 profils/mois",      color:"#6B7280", bg:"linear-gradient(135deg,#1F2937,#374151)" },
  { id:"pro",     label:"Pro",     prix:"49€/mois",   desc:"Accès illimité + filtres avancés",   color:"#F0C040", bg:"linear-gradient(135deg,#1A1200,#3D2800)" },
  { id:"entreprise",label:"Entreprise",prix:"Sur devis",desc:"Solution sur-mesure + API",         color:"#4A9EFF", bg:"linear-gradient(135deg,#0B1628,#1A3560)" }
];

const inputSt = {
  width:"100%", padding:".6rem .85rem", borderRadius:".7rem",
  border:"1.5px solid #D1FAE5", fontSize:".9rem", fontFamily:"inherit",
  outline:"none", background:"#F9FAFB", color:"#111", transition:"border-color .2s",
};

function WaLogo({ size=20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.527 5.852L.057 23.5l5.797-1.497A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.162-1.416l-.37-.218-3.441.889.917-3.346-.24-.387A9.944 9.944 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
    </svg>
  );
}

function Etape({ num, label, active, done }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:".4rem"}}>
      <div style={{width:28,height:28,borderRadius:"50%",background:done?"#16A34A":active?"#F0C040":"rgba(255,255,255,.15)",color:done||active?"#0D3B2E":"rgba(255,255,255,.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".72rem",fontWeight:800,flexShrink:0,transition:"all .3s"}}>
        {done?"✓":num}
      </div>
      <span style={{fontSize:".72rem",fontWeight:600,color:active?"white":done?"#86EFAC":"rgba(255,255,255,.4)",whiteSpace:"nowrap"}}>{label}</span>
    </div>
  );
}

function Champ({ label, required, error, children }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:".28rem"}}>
      <label style={{fontSize:".82rem",fontWeight:700,color:"#374151"}}>{label}{required&&<span style={{color:"#EF4444",marginLeft:2}}>*</span>}</label>
      {children}
      {error&&<span style={{color:"#EF4444",fontSize:".72rem"}}>{error}</span>}
    </div>
  );
}

function Barre({ label, pct, color="#1B6B47" }) {
  return (
    <div style={{marginTop:".6rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:".3rem"}}>
        <span style={{fontSize:".76rem",color:"#555",fontWeight:600}}>{label}</span>
        <span style={{fontSize:".76rem",color,fontWeight:700}}>{pct}%</span>
      </div>
      <div style={{background:"#E5E7EB",borderRadius:"99px",height:6,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${color},${color}99)`,borderRadius:"99px",transition:"width .4s ease"}}/>
      </div>
    </div>
  );
}

export default function InscriptionEntreprisePage() {
  const [etape,setEtape]      = useState(1);
  const [errors,setErrors]    = useState({});
  const [prog,setProg]        = useState(null);
  const [form,setForm]        = useState({
    nomEntreprise:"", secteur:"", taille:"", pays:"", ville:"", siteWeb:"",
    nomResponsable:"", poste:"", email:"", telephone:"",
    profilsRecherches:[], volumeRecrutement:"", budget:"", abonnement:"", message:"",
    pinCode:"", pinConfirm:"", recoveryEmail:"", recoveryWhatsapp:"",
  });
  const router = useRouter();

  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const clean=s=>s.replace(/[<>]/g,"");

  const toggleProfil=(p)=>setForm(f=>({
    ...f,
    profilsRecherches: f.profilsRecherches.includes(p)
      ? f.profilsRecherches.filter(x=>x!==p)
      : [...f.profilsRecherches,p]
  }));

  const v1=()=>{
    const e={};
    if(!form.nomEntreprise.trim()) e.nomEntreprise="Nom de l'entreprise requis";
    if(!form.secteur) e.secteur="Secteur requis";
    if(!form.taille) e.taille="Taille requise";
    if(!form.pays.trim()) e.pays="Pays requis";
    if(!form.ville.trim()) e.ville="Ville requise";
    setErrors(e); return Object.keys(e).length===0;
  };
  const v2=()=>{
    const e={};
    if(!form.nomResponsable.trim()) e.nomResponsable="Nom requis";
    if(!form.poste.trim()) e.poste="Poste requis";
    if(!form.email.trim()) e.email="Email requis";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email="Email invalide";
    if(!form.telephone.trim()) e.telephone="Téléphone requis";
    setErrors(e); return Object.keys(e).length===0;
  };
  const v3=()=>{
    const e={};
    if(form.profilsRecherches.length===0) e.profilsRecherches="Sélectionnez au moins un type";
    if(!form.volumeRecrutement) e.volumeRecrutement="Volume requis";
    if(!form.budget) e.budget="Budget requis";
    if(!form.abonnement) e.abonnement="Abonnement requis";
    if(form.pinCode && !/^\d{4}$/.test(form.pinCode)) e.pinCode="PIN = 4 chiffres";
    if(form.pinCode && form.pinCode!==form.pinConfirm) e.pinConfirm="Les PIN ne correspondent pas";
    setErrors(e); return Object.keys(e).length===0;
  };

  const next=()=>{
    if(etape===1&&!v1()) return;
    if(etape===2&&!v2()) return;
    setEtape(e=>e+1); setErrors({});
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const soumettre=async()=>{
    if(!v3()) return;
    setProg({label:"Enregistrement en cours…",pct:10});
    try {
      const { error } = await supabase.from("recruteurs").insert([{
        nom_entreprise:    form.nomEntreprise,
        secteur:           form.secteur,
        taille:            form.taille,
        pays:              form.pays,
        ville:             form.ville,
        site_web:          form.siteWeb || null,
        contact_nom:       form.nomResponsable,
        contact_poste:     form.poste,
        contact_email:     form.email,
        contact_telephone: form.telephone,
        types_profils:     form.profilsRecherches.join(", "),
        volume_recrutement:form.volumeRecrutement,
        budget:            form.budget,
        abonnement:        form.abonnement,
        message:           form.message || null,
        pin_code:          (form.pinCode && form.pinCode===form.pinConfirm) ? form.pinCode : null,
        statut:            "pending",
      }]);
      if (error) throw error;
      setProg({label:"✅ Inscription enregistrée !",pct:100});
      setTimeout(()=>router.push(`/recruteur?tel=${encodeURIComponent(form.telephone)}&auto=1`), 700);
    } catch(err) {
      console.error(err);
      setProg(null);
      alert("Erreur lors de l'enregistrement : " + (err.message||"Veuillez réessayer."));
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"#F0F4F0",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:"1.1rem 1rem"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <Link href="/recruteur" style={{color:"rgba(255,255,255,.55)",fontSize:".8rem",textDecoration:"none"}}>← Retour</Link>
          <h1 style={{fontFamily:"'Sora',sans-serif",color:"#F5F0E8",fontWeight:900,fontSize:"1.12rem",margin:".32rem 0 .8rem"}}>🏢 Inscription Entreprise/Recruteur</h1>
          <div style={{display:"flex",gap:".85rem",alignItems:"center",flexWrap:"wrap"}}>
            <Etape num="1" label="Entreprise"  active={etape===1} done={etape>1}/>
            <div style={{flex:1,height:1,background:"rgba(255,255,255,.14)",minWidth:12}}/>
            <Etape num="2" label="Contact"     active={etape===2} done={etape>2}/>
            <div style={{flex:1,height:1,background:"rgba(255,255,255,.14)",minWidth:12}}/>
            <Etape num="3" label="Besoins"     active={etape===3} done={etape>3}/>
          </div>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"1.2rem 1rem"}}>

        {/* ── ÉTAPE 1 ── */}
        {etape===1&&(
          <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".98rem",color:"#111",marginBottom:"1rem"}}>Informations sur votre entreprise</h2>
            <div style={{display:"flex",flexDirection:"column",gap:".82rem"}}>
              <Champ label="Nom de l'entreprise" required error={errors.nomEntreprise}>
                <input value={form.nomEntreprise} onChange={e=>set("nomEntreprise",clean(e.target.value))} placeholder="Ex: TechCorp Afrique"
                  style={{...inputSt,borderColor:errors.nomEntreprise?"#EF4444":"#D1FAE5"}}
                  onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=errors.nomEntreprise?"#EF4444":"#D1FAE5"}/>
              </Champ>
              <Champ label="Secteur d'activité" required error={errors.secteur}>
                <select value={form.secteur} onChange={e=>set("secteur",e.target.value)} style={{...inputSt,borderColor:errors.secteur?"#EF4444":"#D1FAE5",cursor:"pointer"}}>
                  <option value="">-- Sélectionnez --</option>
                  {SECTEURS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </Champ>
              <Champ label="Taille de l'entreprise" required error={errors.taille}>
                <select value={form.taille} onChange={e=>set("taille",e.target.value)} style={{...inputSt,borderColor:errors.taille?"#EF4444":"#D1FAE5",cursor:"pointer"}}>
                  <option value="">-- Sélectionnez --</option>
                  {TAILLES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </Champ>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".65rem"}}>
                <Champ label="Pays" required error={errors.pays}>
                  <input value={form.pays} onChange={e=>set("pays",clean(e.target.value))} placeholder="Côte d'Ivoire"
                    style={{...inputSt,borderColor:errors.pays?"#EF4444":"#D1FAE5"}}
                    onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=errors.pays?"#EF4444":"#D1FAE5"}/>
                </Champ>
                <Champ label="Ville" required error={errors.ville}>
                  <input value={form.ville} onChange={e=>set("ville",clean(e.target.value))} placeholder="Abidjan"
                    style={{...inputSt,borderColor:errors.ville?"#EF4444":"#D1FAE5"}}
                    onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=errors.ville?"#EF4444":"#D1FAE5"}/>
                </Champ>
              </div>
              <Champ label="Site web (optionnel)">
                <input value={form.siteWeb} onChange={e=>set("siteWeb",e.target.value.trim())} placeholder="https://exemple.com"
                  style={inputSt} onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor="#D1FAE5"}/>
              </Champ>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 2 ── */}
        {etape===2&&(
          <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".98rem",color:"#111",marginBottom:".35rem"}}>Contact principal</h2>
            <p style={{color:"#666",fontSize:".8rem",marginBottom:"1rem",lineHeight:1.6}}>Personne responsable du recrutement.</p>
            <div style={{display:"flex",flexDirection:"column",gap:".82rem"}}>
              <Champ label="Nom complet" required error={errors.nomResponsable}>
                <input value={form.nomResponsable} onChange={e=>set("nomResponsable",clean(e.target.value))} placeholder="Ex: Marie Kouassi"
                  style={{...inputSt,borderColor:errors.nomResponsable?"#EF4444":"#D1FAE5"}}
                  onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=errors.nomResponsable?"#EF4444":"#D1FAE5"}/>
              </Champ>
              <Champ label="Poste/Fonction" required error={errors.poste}>
                <input value={form.poste} onChange={e=>set("poste",clean(e.target.value))} placeholder="Ex: Responsable RH"
                  style={{...inputSt,borderColor:errors.poste?"#EF4444":"#D1FAE5"}}
                  onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=errors.poste?"#EF4444":"#D1FAE5"}/>
              </Champ>
              <Champ label="Email professionnel" required error={errors.email}>
                <input type="email" value={form.email} onChange={e=>set("email",e.target.value.trim())} placeholder="marie@entreprise.com"
                  style={{...inputSt,borderColor:errors.email?"#EF4444":"#D1FAE5"}}
                  onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=errors.email?"#EF4444":"#D1FAE5"}/>
              </Champ>
              <Champ label="Téléphone/WhatsApp" required error={errors.telephone}>
                <input type="tel" value={form.telephone} onChange={e=>set("telephone",e.target.value)} placeholder="+225 05 07 93 97 06"
                  style={{...inputSt,borderColor:errors.telephone?"#EF4444":"#D1FAE5"}}
                  onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=errors.telephone?"#EF4444":"#D1FAE5"}/>
              </Champ>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 3 ── */}
        {etape===3&&(
          <div style={{display:"flex",flexDirection:"column",gap:".9rem"}}>

            {/* Profils recherchés */}
            <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".98rem",color:"#111",marginBottom:".35rem"}}>Vos besoins de recrutement</h2>
              <p style={{color:"#666",fontSize:".8rem",marginBottom:"1rem",lineHeight:1.6}}>Aidez-nous à vous proposer les meilleurs profils.</p>
              <Champ label="Types de profils recherchés" required error={errors.profilsRecherches}>
                <div style={{display:"flex",flexWrap:"wrap",gap:".45rem",marginTop:".4rem"}}>
                  {PROFILS_RECHERCHES.map(p=>(
                    <button key={p} onClick={()=>toggleProfil(p)} style={{padding:".4rem .85rem",borderRadius:"99px",border:`1.5px solid ${form.profilsRecherches.includes(p)?"#1B6B47":"#E5E7EB"}`,background:form.profilsRecherches.includes(p)?"#1B6B4718":"white",color:form.profilsRecherches.includes(p)?"#1B6B47":"#666",fontWeight:600,fontSize:".77rem",cursor:"pointer",transition:"all .15s"}}>
                      {form.profilsRecherches.includes(p)?"✓ ":""}{p}
                    </button>
                  ))}
                </div>
                {form.profilsRecherches.length>0&&<div style={{marginTop:".5rem",fontSize:".75rem",color:"#16A34A",fontWeight:600}}>✓ {form.profilsRecherches.length} sélectionné{form.profilsRecherches.length>1?"s":""}</div>}
              </Champ>
            </div>

            {/* Volume & budget */}
            <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
              <div style={{display:"flex",flexDirection:"column",gap:".82rem"}}>
                <Champ label="Volume de recrutement annuel" required error={errors.volumeRecrutement}>
                  <select value={form.volumeRecrutement} onChange={e=>set("volumeRecrutement",e.target.value)} style={{...inputSt,borderColor:errors.volumeRecrutement?"#EF4444":"#D1FAE5",cursor:"pointer"}}>
                    <option value="">-- Sélectionnez --</option>
                    {VOLUMES.map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </Champ>
                <Champ label="Budget mensuel estimé" required error={errors.budget}>
                  <select value={form.budget} onChange={e=>set("budget",e.target.value)} style={{...inputSt,borderColor:errors.budget?"#EF4444":"#D1FAE5",cursor:"pointer"}}>
                    <option value="">-- Sélectionnez --</option>
                    {BUDGETS.map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                </Champ>
              </div>
            </div>

            {/* Abonnement */}
            <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".98rem",color:"#111",marginBottom:".35rem"}}>Type d'abonnement souhaité</h2>
              {errors.abonnement&&<div style={{color:"#EF4444",fontSize:".77rem",marginBottom:".65rem",background:"#FEF2F2",padding:".42rem .8rem",borderRadius:"8px"}}>{errors.abonnement}</div>}
              <div style={{display:"flex",flexDirection:"column",gap:".7rem"}}>
                {ABONNEMENTS.map(abo=>(
                  <button key={abo.id} onClick={()=>set("abonnement",abo.id)} style={{display:"flex",alignItems:"center",gap:".9rem",border:`2px solid ${form.abonnement===abo.id?abo.color:"#E5E7EB"}`,borderRadius:"14px",padding:"1rem",cursor:"pointer",textAlign:"left",transition:"all .2s",background:"white",boxShadow:form.abonnement===abo.id?`0 0 0 3px ${abo.color}22`:"none"}}>
                    <div style={{width:50,height:50,borderRadius:"12px",background:abo.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0,color:"white"}}>
                      {abo.id==="basique"?"🆓":abo.id==="pro"?"⭐":"🏆"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".88rem",color:"#111",marginBottom:".14rem"}}>
                        {abo.label} <span style={{color:abo.color,fontSize:".82rem"}}>— {abo.prix}</span>
                      </div>
                      <div style={{color:"#666",fontSize:".77rem",lineHeight:1.5}}>{abo.desc}</div>
                    </div>
                    <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${form.abonnement===abo.id?abo.color:"#D1D5DB"}`,background:form.abonnement===abo.id?abo.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {form.abonnement===abo.id&&<div style={{width:8,height:8,borderRadius:"50%",background:"white"}}/>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
              <Champ label="Message ou besoins spécifiques (optionnel)">
                <textarea value={form.message} onChange={e=>set("message",clean(e.target.value))} placeholder="Ex: Nous recherchons des chauffeurs avec permis B…" rows={4} maxLength={500}
                  style={{...inputSt,resize:"vertical",lineHeight:1.65}} onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor="#D1FAE5"}/>
                <span style={{color:"#9CA3AF",fontSize:".71rem",textAlign:"right"}}>{form.message.length}/500</span>
              </Champ>
            </div>

            {/* ── Section sécurité optionnelle ── */}
            <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".95rem",color:"#111",marginBottom:".25rem"}}>
                🔐 Sécuriser mon compte <span style={{fontWeight:400,color:"#9CA3AF",fontSize:".8rem"}}>(optionnel)</span>
              </h2>
              <p style={{color:"#666",fontSize:".78rem",marginBottom:"1.1rem",lineHeight:1.6}}>
                Définissez un code PIN pour accéder à votre espace recruteur et modifier votre profil.
              </p>

              {/* PIN */}
              <div style={{marginBottom:"1rem",padding:".9rem",background:"#F9FAFB",borderRadius:"12px",border:"1px solid #E5E7EB"}}>
                <div style={{fontSize:".82rem",fontWeight:700,color:"#374151",marginBottom:".6rem"}}>🔑 Code PIN (4 chiffres)</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".6rem"}}>
                  <div>
                    <input type="password" inputMode="numeric" maxLength={4} value={form.pinCode}
                      onChange={e=>set("pinCode",e.target.value.replace(/\D/g,"").slice(0,4))}
                      placeholder="●●●●" style={{...inputSt,letterSpacing:".25em",textAlign:"center"}}
                      onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor="#D1FAE5"}/>
                    {errors.pinCode&&<p style={{color:"#EF4444",fontSize:".72rem",margin:".3rem 0 0"}}>{errors.pinCode}</p>}
                  </div>
                  <div>
                    <input type="password" inputMode="numeric" maxLength={4} value={form.pinConfirm}
                      onChange={e=>set("pinConfirm",e.target.value.replace(/\D/g,"").slice(0,4))}
                      placeholder="Confirmer" style={{...inputSt,letterSpacing:".25em",textAlign:"center"}}
                      onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor="#D1FAE5"}/>
                    {errors.pinConfirm&&<p style={{color:"#EF4444",fontSize:".72rem",margin:".3rem 0 0"}}>{errors.pinConfirm}</p>}
                  </div>
                </div>
              </div>

              {/* Email de récupération */}
              <div style={{marginBottom:"1rem",padding:".9rem",background:"#F9FAFB",borderRadius:"12px",border:"1px solid #E5E7EB"}}>
                <div style={{fontSize:".82rem",fontWeight:700,color:"#374151",marginBottom:".6rem"}}>📧 Email de récupération</div>
                <input type="email" value={form.recoveryEmail||form.email}
                  onChange={e=>set("recoveryEmail",e.target.value)} placeholder="contact@entreprise.com"
                  style={inputSt} onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor="#D1FAE5"}/>
              </div>

              {/* WhatsApp de récupération */}
              <div style={{padding:".9rem",background:"#F9FAFB",borderRadius:"12px",border:"1px solid #E5E7EB"}}>
                <div style={{fontSize:".82rem",fontWeight:700,color:"#374151",marginBottom:".6rem"}}>📱 WhatsApp de récupération</div>
                <input type="tel" value={form.recoveryWhatsapp||form.telephone}
                  onChange={e=>set("recoveryWhatsapp",e.target.value)} placeholder="+225 05 07 93 97 06"
                  style={inputSt} onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor="#D1FAE5"}/>
              </div>
            </div>

            {prog&&<Barre label={prog.label} pct={prog.pct} color="#C9960F"/>}
          </div>
        )}

        {/* Navigation */}
        <div style={{display:"flex",gap:".62rem",marginTop:"1.05rem"}}>
          {etape>1&&<button onClick={()=>{setEtape(e=>e-1);window.scrollTo({top:0,behavior:"smooth"});}} style={{flex:1,padding:".66rem",borderRadius:"99px",border:"1.5px solid #D1FAE5",background:"white",color:"#1B6B47",fontWeight:700,fontSize:".85rem",cursor:"pointer"}}>← Retour</button>}
          {etape<3
            ?<button onClick={next} style={{flex:2,padding:".66rem",borderRadius:"99px",border:"none",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",color:"white",fontWeight:800,fontSize:".85rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(27,107,71,.32)"}}>Continuer →</button>
            :<button onClick={soumettre} disabled={!!prog} style={{flex:2,padding:".66rem",borderRadius:"99px",border:"none",background:prog?"#E5E7EB":"linear-gradient(135deg,#C9960F,#F0C040)",color:prog?"#9CA3AF":"#0D3B2E",fontWeight:800,fontSize:".85rem",cursor:prog?"not-allowed":"pointer",boxShadow:prog?"none":"0 4px 16px rgba(201,150,15,.4)",transition:"all .2s"}}>{prog?"⏳ Envoi en cours…":"🚀 Envoyer la demande"}</button>
          }
        </div>

        <div style={{marginTop:"1rem",background:"#F0FDF4",border:"1px solid #D1FAE5",borderRadius:"12px",padding:".85rem",textAlign:"center"}}>
          <div style={{color:"#166534",fontSize:".78rem",fontWeight:600,marginBottom:".5rem"}}>Vous préférez nous contacter directement ?</div>
          <a href={`https://wa.me/${WA_NUM1}?text=${encodeURIComponent("Bonjour, je souhaite inscrire mon entreprise sur TalentProof.")}`} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:".45rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".82rem",padding:".52rem 1.2rem",borderRadius:"99px",textDecoration:"none"}}>
            <WaLogo size={16}/> Contact WhatsApp
          </a>
        </div>

        <p style={{textAlign:"center",color:"#9CA3AF",fontSize:".72rem",marginTop:".72rem",lineHeight:1.6}}>
          En soumettant, vous acceptez nos{" "}
          <Link href="/mentions-legales" style={{color:"#1B6B47",textDecoration:"none"}}>mentions légales</Link>{" "}
          et notre{" "}
          <Link href="/confidentialite" style={{color:"#1B6B47",textDecoration:"none"}}>politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}
