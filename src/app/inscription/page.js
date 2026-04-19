"use client";
import { useState, useRef } from "react";
import Link from "next/link";

const WA_NUM1 = "2250507939706";

const METIERS = [
  "Chauffeur","Couturière/Couturier","Aide ménagère","Gardien/Vigile",
  "Électricien","Mécanicien","Maçon","Plombier","Cuisinier/Cuisinière",
  "Jardinier","Nounou","Vendeur/Vendeuse","Développeur/Développeuse",
  "Graphiste","Soudeur","Pâtissier","Autre"
];

const NIVEAUX = [
  "Sans niveau d'étude","Primaire","Collège/Lycée","BAC","BTS/DUT",
  "Licence","Master/Ingénieur","Autre formation"
];

const TYPE_PROFIL = [
  { id:"expert",   label:"Profil Expert",   icon:"🏆", desc:"Vidéo ou photo + diplômes ou certificats",        color:"#4A9EFF", bg:"linear-gradient(135deg,#0B1628,#1A3560)" },
  { id:"pratique", label:"Profil Pratique", icon:"💪", desc:"Photo de ton travail + description de ton talent", color:"#F0C040", bg:"linear-gradient(135deg,#1A1200,#3D2800)" },
  { id:"simple",   label:"Profil Simple",   icon:"🤝", desc:"Description uniquement — gardiens, aides ménagères…",color:"#25D366",bg:"linear-gradient(135deg,#071F15,#1B6B47)" },
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

function PreviewMedia({ file, type }) {
  if(!file) return null;
  const url=URL.createObjectURL(file);
  const mo=(file.size/1024/1024).toFixed(2);
  return (
    <div style={{marginTop:".75rem",borderRadius:"12px",overflow:"hidden",border:"1.5px solid #D1FAE5",background:"#F9FDFB"}}>
      {type==="video"
        ?<video controls src={url} style={{width:"100%",maxHeight:220,background:"#000",display:"block"}}/>
        :<img src={url} alt="Prévisualisation" style={{width:"100%",maxHeight:220,objectFit:"cover",display:"block"}}/>
      }
      <div style={{padding:".55rem .8rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:".75rem",color:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"65%"}}>{file.name}</span>
        <span style={{fontSize:".73rem",color:"#9CA3AF"}}>{mo} Mo</span>
      </div>
    </div>
  );
}

function PreviewDoc({ file }) {
  if(!file) return null;
  const mo=(file.size/1024/1024).toFixed(2);
  return (
    <div style={{marginTop:".65rem",display:"flex",alignItems:"center",gap:".65rem",background:"#FFFBEB",border:"1.5px solid #FCD34D",borderRadius:"10px",padding:".65rem .85rem"}}>
      <span style={{fontSize:"1.6rem",flexShrink:0}}>{file.type==="application/pdf"?"📄":"🖼️"}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:".78rem",fontWeight:700,color:"#92400E",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{file.name}</div>
        <div style={{fontSize:".71rem",color:"#B45309",marginTop:1}}>{mo} Mo</div>
      </div>
      <span style={{fontSize:".7rem",fontWeight:700,color:"#16A34A",flexShrink:0}}>✅ Prêt</span>
    </div>
  );
}

export default function InscriptionPage() {
  const [etape,setEtape]       = useState(1);
  const [errors,setErrors]     = useState({});
  const [submitted,setSubmit]  = useState(false);
  const [prog,setProg]         = useState(null);
  const [form,setForm]         = useState({
    prenom:"",nom:"",age:"",ville:"",pays:"",metier:"",niveau:"",
    typeProfile:"",bio:"",phone:"",disponible:"immediate",
    fichierMedia:null,fichierDoc:null,mediaType:null,
  });

  const mediaRef=useRef(), docRef=useRef();
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const clean=s=>s.replace(/[<>"'&]/g,"").trim();

  const v1=()=>{
    const e={};
    if(!form.prenom.trim()) e.prenom="Prénom requis";
    if(!form.nom.trim()) e.nom="Nom requis";
    if(!form.age||isNaN(form.age)||+form.age<16||+form.age>80) e.age="Âge invalide (16–80)";
    if(!form.ville.trim()) e.ville="Ville requise";
    if(!form.metier) e.metier="Métier requis";
    setErrors(e); return Object.keys(e).length===0;
  };
  const v2=()=>{ const e={}; if(!form.typeProfile) e.typeProfile="Choisis un type de profil"; setErrors(e); return Object.keys(e).length===0; };

  const next=()=>{ if(etape===1&&!v1()) return; if(etape===2&&!v2()) return; setEtape(e=>e+1); setErrors({}); window.scrollTo({top:0,behavior:"smooth"}); };

  const simTraitement=(type)=>{
    setProg({label:type==="video"?"Traitement de la vidéo en cours…":"Analyse de l'image…",pct:0});
    let p=0;
    const iv=setInterval(()=>{
      p+=Math.floor(Math.random()*18)+8;
      if(p>=100){p=100;clearInterval(iv);setTimeout(()=>setProg(null),800);}
      setProg({label:p<100?(type==="video"?"Traitement de la vidéo en cours…":"Analyse de l'image…"):"✅ Fichier prêt !",pct:p});
    },260);
  };

  const choisirMedia=e=>{ const f=e.target.files[0]; if(!f) return; const t=f.type.startsWith("video")?"video":"image"; setForm(x=>({...x,fichierMedia:f,mediaType:t})); simTraitement(t); };

  const soumettre=async()=>{
    setProg({label:"Envoi de ton profil en cours…",pct:10});
    try {
      let avatarUrl = null;
      let preuveUrl = null;

      // Upload photo/vidéo dans bucket "preuves"
      if(form.fichierMedia) {
        setProg({label:"Upload de ta preuve visuelle…",pct:30});
        const ext = form.fichierMedia.name.split('.').pop();
        const chemin = `${Date.now()}_${form.prenom}_${form.nom}.${ext}`;
        preuveUrl = await uploadFichier("preuves", form.fichierMedia, chemin);
      }

      setProg({label:"Sauvegarde de ton profil…",pct:70});

      // Sauvegarde dans la table "talents"
      const { error } = await supabase.from('talents').insert([{
        prenom: form.prenom,
        nom: form.nom,
        age: parseInt(form.age),
        ville: form.ville,
        pays: form.pays,
        metier: form.metier,
        niveau: form.niveau,
        type_profil: form.typeProfile,
        bio: form.bio,
        phone: form.phone,
        disponible: form.disponible,
        avatar_url: avatarUrl,
        preuve_url: preuveUrl,
        statut: 'actif',
      }]);

      if(error) throw error;

      setProg({label:"✅ Profil envoyé !",pct:100});
      setTimeout(()=>setSubmit(true),700);
    } catch(err) {
      console.error(err);
      setProg(null);
      alert("Erreur lors de l'envoi : " + err.message);
    }
  };

  if(submitted) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#071F15,#0D3B2E)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",fontFamily:"system-ui,sans-serif"}}>
      <div style={{maxWidth:440,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:"4rem",marginBottom:"1rem"}}>🎉</div>
        <h1 style={{fontFamily:"'Sora',sans-serif",color:"white",fontWeight:900,fontSize:"1.4rem",marginBottom:".5rem"}}>Profil soumis avec succès !</h1>
        <p style={{color:"rgba(255,255,255,.68)",fontSize:".88rem",lineHeight:1.7,marginBottom:"1.4rem"}}>Notre équipe crée ton profil sous <strong style={{color:"#F0C040"}}>24h</strong>. Tu recevras une confirmation sur WhatsApp.</p>
        <div style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",borderRadius:"16px",padding:"1.1rem",marginBottom:"1.25rem",textAlign:"left"}}>
          <div style={{color:"rgba(255,255,255,.45)",fontSize:".7rem",fontWeight:700,letterSpacing:".6px",textTransform:"uppercase",marginBottom:".6rem"}}>Récapitulatif</div>
          {[["Nom",`${form.prenom} ${form.nom}`],["Métier",form.metier],["Ville",form.ville],["Type",TYPE_PROFIL.find(t=>t.id===form.typeProfile)?.label||"—"],["Fichier",form.fichierMedia?form.fichierMedia.name:"Aucun"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:".28rem 0",borderBottom:"1px solid rgba(255,255,255,.06)",fontSize:".81rem"}}>
              <span style={{color:"rgba(255,255,255,.48)"}}>{k}</span>
              <span style={{color:"white",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"60%"}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:".6rem",justifyContent:"center",flexWrap:"wrap"}}>
          <Link href="/annuaire" style={{display:"inline-flex",alignItems:"center",gap:".5rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",fontWeight:800,fontSize:".9rem",padding:".75rem 1.5rem",borderRadius:"99px",textDecoration:"none",boxShadow:"0 4px 18px rgba(201,150,15,.42)"}}>Voir l'annuaire →</Link>
          <a href={`https://wa.me/${WA_NUM1}?text=${encodeURIComponent("Bonjour, je viens de créer mon profil TalentProof.")}`} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:".45rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".88rem",padding:".75rem 1.4rem",borderRadius:"99px",textDecoration:"none"}}><WaLogo size={17}/> WhatsApp</a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#F0F4F0",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:"1.1rem 1rem"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <Link href="/" style={{color:"rgba(255,255,255,.55)",fontSize:".8rem",textDecoration:"none"}}>← Retour</Link>
          <h1 style={{fontFamily:"'Sora',sans-serif",color:"#F5F0E8",fontWeight:900,fontSize:"1.12rem",margin:".32rem 0 .8rem"}}>🎙️ Créer mon profil TalentProof</h1>
          <div style={{display:"flex",gap:".85rem",alignItems:"center",flexWrap:"wrap"}}>
            <Etape num="1" label="Identité"       active={etape===1} done={etape>1}/>
            <div style={{flex:1,height:1,background:"rgba(255,255,255,.14)",minWidth:12}}/>
            <Etape num="2" label="Type de profil" active={etape===2} done={etape>2}/>
            <div style={{flex:1,height:1,background:"rgba(255,255,255,.14)",minWidth:12}}/>
            <Etape num="3" label="Preuves & Bio"  active={etape===3} done={etape>3}/>
          </div>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"1.2rem 1rem"}}>

        {/* ÉTAPE 1 */}
        {etape===1&&(
          <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".98rem",color:"#111",marginBottom:"1rem"}}>Tes informations personnelles</h2>
            <div style={{display:"flex",flexDirection:"column",gap:".82rem"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".65rem"}}>
                <Champ label="Prénom" required error={errors.prenom}><input value={form.prenom} onChange={e=>set("prenom",clean(e.target.value))} placeholder="Moussa" style={{...inputSt,borderColor:errors.prenom?"#EF4444":"#D1FAE5"}} onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=errors.prenom?"#EF4444":"#D1FAE5"}/></Champ>
                <Champ label="Nom" required error={errors.nom}><input value={form.nom} onChange={e=>set("nom",clean(e.target.value))} placeholder="Diallo" style={{...inputSt,borderColor:errors.nom?"#EF4444":"#D1FAE5"}} onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=errors.nom?"#EF4444":"#D1FAE5"}/></Champ>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".65rem"}}>
                <Champ label="Âge" required error={errors.age}><input type="number" value={form.age} onChange={e=>set("age",e.target.value)} placeholder="28" min="16" max="80" style={{...inputSt,borderColor:errors.age?"#EF4444":"#D1FAE5"}} onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=errors.age?"#EF4444":"#D1FAE5"}/></Champ>
                <Champ label="WhatsApp (avec indicatif pays)"><input type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="Ex: 2250798470653" style={inputSt} onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor="#D1FAE5"}/><span style={{color:"#6B7280",fontSize:".72rem",marginTop:".25rem",lineHeight:1.5}}>💡 Commence par l&apos;indicatif de ton pays (sans le +) : 225 = Côte d&apos;Ivoire, 226 = Burkina Faso, 221 = Sénégal, 237 = Cameroun, etc.</span></Champ>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".65rem"}}>
                <Champ label="Ville" required error={errors.ville}><input value={form.ville} onChange={e=>set("ville",clean(e.target.value))} placeholder="Dakar" style={{...inputSt,borderColor:errors.ville?"#EF4444":"#D1FAE5"}} onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=errors.ville?"#EF4444":"#D1FAE5"}/></Champ>
                <Champ label="Pays"><input value={form.pays} onChange={e=>set("pays",clean(e.target.value))} placeholder="Sénégal" style={inputSt} onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor="#D1FAE5"}/></Champ>
              </div>
              <Champ label="Métier" required error={errors.metier}><select value={form.metier} onChange={e=>set("metier",e.target.value)} style={{...inputSt,borderColor:errors.metier?"#EF4444":"#D1FAE5",cursor:"pointer"}}><option value="">-- Choisis ton métier --</option>{METIERS.map(m=><option key={m} value={m}>{m}</option>)}</select></Champ>
              <Champ label="Niveau d'étude"><select value={form.niveau} onChange={e=>set("niveau",e.target.value)} style={{...inputSt,cursor:"pointer"}}><option value="">-- Sélectionner --</option>{NIVEAUX.map(n=><option key={n} value={n}>{n}</option>)}</select></Champ>
              <Champ label="Disponibilité">
                <div style={{display:"flex",gap:".45rem",flexWrap:"wrap"}}>
                  {[["immediate","Disponible","#16A34A"],["1_month","Dans 1 mois","#D97706"],["negotiable","À négocier","#6B7280"]].map(([v,l,c])=>(
                    <button key={v} onClick={()=>set("disponible",v)} style={{padding:".35rem .82rem",borderRadius:"99px",border:`1.5px solid ${form.disponible===v?c:"#E5E7EB"}`,background:form.disponible===v?`${c}18`:"white",color:form.disponible===v?c:"#888",fontWeight:600,fontSize:".77rem",cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",gap:4}}>
                      <span style={{width:7,height:7,borderRadius:"50%",background:c,display:"inline-block"}}/>{l}
                    </button>
                  ))}
                </div>
              </Champ>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 */}
        {etape===2&&(
          <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".98rem",color:"#111",marginBottom:".35rem"}}>Quel type de profil te correspond ?</h2>
            <p style={{color:"#666",fontSize:".8rem",marginBottom:"1rem",lineHeight:1.6}}>Pas besoin de diplôme. Choisis selon ce que tu peux partager.</p>
            {errors.typeProfile&&<div style={{color:"#EF4444",fontSize:".77rem",marginBottom:".65rem",background:"#FEF2F2",padding:".42rem .8rem",borderRadius:"8px",border:"1px solid #FCA5A5"}}>{errors.typeProfile}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:".7rem"}}>
              {TYPE_PROFIL.map(t=>(
                <button key={t.id} onClick={()=>set("typeProfile",t.id)} style={{display:"flex",alignItems:"center",gap:".9rem",border:`2px solid ${form.typeProfile===t.id?t.color:"#E5E7EB"}`,borderRadius:"14px",padding:"1rem",cursor:"pointer",textAlign:"left",transition:"all .2s",background:"white",boxShadow:form.typeProfile===t.id?`0 0 0 3px ${t.color}22`:"none"}}>
                  <div style={{width:50,height:50,borderRadius:"12px",background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.45rem",flexShrink:0}}>{t.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".88rem",color:"#111",marginBottom:".14rem"}}>{t.label}</div>
                    <div style={{color:"#666",fontSize:".77rem",lineHeight:1.5}}>{t.desc}</div>
                  </div>
                  <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${form.typeProfile===t.id?t.color:"#D1D5DB"}`,background:form.typeProfile===t.id?t.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {form.typeProfile===t.id&&<div style={{width:8,height:8,borderRadius:"50%",background:"white"}}/>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 3 */}
        {etape===3&&(
          <div style={{display:"flex",flexDirection:"column",gap:".9rem"}}>
            <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".98rem",color:"#111",marginBottom:".82rem"}}>Parle de toi</h2>
              <Champ label="Description de ton talent">
                <textarea value={form.bio} onChange={e=>set("bio",clean(e.target.value))} placeholder="Ex : Chauffeur VTC depuis 7 ans à Dakar. Véhicule climatisé, ponctuel…" rows={4} maxLength={300} style={{...inputSt,resize:"vertical",lineHeight:1.65}} onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor="#D1FAE5"}/>
                <span style={{color:"#9CA3AF",fontSize:".71rem",textAlign:"right"}}>{form.bio.length}/300</span>
              </Champ>
            </div>

            {(form.typeProfile==="expert"||form.typeProfile==="pratique")&&(
              <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".98rem",color:"#111",marginBottom:".3rem"}}>📸 Ta preuve visuelle</h2>
                <p style={{color:"#666",fontSize:".79rem",marginBottom:".82rem"}}>Photo ou vidéo de ton travail (max 50 Mo)</p>
                <input type="file" accept="image/*,video/*" ref={mediaRef} style={{display:"none"}} onChange={choisirMedia}/>
                <button onClick={()=>mediaRef.current.click()} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:".45rem",border:"2px dashed #D1FAE5",borderRadius:"12px",padding:"1.35rem",cursor:"pointer",background:"#F9FDFB",width:"100%",transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="#1B6B47"} onMouseLeave={e=>e.currentTarget.style.borderColor="#D1FAE5"}>
                  <span style={{fontSize:"1.8rem"}}>{form.fichierMedia?(form.mediaType==="video"?"🎥":"📸"):"📂"}</span>
                  <span style={{color:form.fichierMedia?"#16A34A":"#666",fontSize:".82rem",fontWeight:600}}>{form.fichierMedia?"Changer le fichier":"Clique pour ajouter une photo ou vidéo"}</span>
                </button>
                {prog&&<Barre label={prog.label} pct={prog.pct}/>}
                {form.fichierMedia&&!prog&&<PreviewMedia file={form.fichierMedia} type={form.mediaType}/>}
              </div>
            )}

            {form.typeProfile==="expert"&&(
              <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".98rem",color:"#111",marginBottom:".3rem"}}>🔒 Tes documents (optionnel)</h2>
                <p style={{color:"#666",fontSize:".79rem",marginBottom:".82rem",lineHeight:1.6}}>Diplôme, certificat, attestation. <strong>Verrouillés</strong> — les recruteurs demandent l'accès.</p>
                <input type="file" accept=".pdf,.doc,.docx,image/*" ref={docRef} style={{display:"none"}} onChange={e=>set("fichierDoc",e.target.files[0])}/>
                <button onClick={()=>docRef.current.click()} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:".45rem",border:"2px dashed #FCD34D",borderRadius:"12px",padding:"1.35rem",cursor:"pointer",background:"#FFFBEB",width:"100%",transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="#D97706"} onMouseLeave={e=>e.currentTarget.style.borderColor="#FCD34D"}>
                  <span style={{fontSize:"1.8rem"}}>{form.fichierDoc?"✅":"🔒"}</span>
                  <span style={{color:form.fichierDoc?"#D97706":"#666",fontSize:".82rem",fontWeight:600}}>{form.fichierDoc?"Changer le document":"Clique pour ajouter un document"}</span>
                </button>
                <PreviewDoc file={form.fichierDoc}/>
              </div>
            )}

            {form.typeProfile==="simple"&&(
              <div style={{background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",border:"1.5px solid #86EFAC",borderRadius:"14px",padding:"1rem 1.1rem"}}>
                <div style={{display:"flex",gap:".6rem",alignItems:"flex-start"}}>
                  <span style={{fontSize:"1.3rem",flexShrink:0}}>✅</span>
                  <div>
                    <div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:".87rem",color:"#065F46",marginBottom:".15rem"}}>Ta description suffit !</div>
                    <div style={{color:"#047857",fontSize:".78rem",lineHeight:1.6}}>Notre équipe valide ton profil sous 24h. Aucune preuve visuelle n'est obligatoire.</div>
                  </div>
                </div>
              </div>
            )}

            {prog&&etape===3&&<Barre label={prog.label} pct={prog.pct} color="#C9960F"/>}
          </div>
        )}

        {/* Navigation */}
        <div style={{display:"flex",gap:".62rem",marginTop:"1.05rem"}}>
          {etape>1&&<button onClick={()=>{setEtape(e=>e-1);window.scrollTo({top:0,behavior:"smooth"});}} style={{flex:1,padding:".66rem",borderRadius:"99px",border:"1.5px solid #D1FAE5",background:"white",color:"#1B6B47",fontWeight:700,fontSize:".85rem",cursor:"pointer"}}>← Retour</button>}
          {etape<3
            ?<button onClick={next} style={{flex:2,padding:".66rem",borderRadius:"99px",border:"none",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",color:"white",fontWeight:800,fontSize:".85rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(27,107,71,.32)"}}>Continuer →</button>
            :<button onClick={soumettre} disabled={!!prog} style={{flex:2,padding:".66rem",borderRadius:"99px",border:"none",background:prog?"#E5E7EB":"linear-gradient(135deg,#C9960F,#F0C040)",color:prog?"#9CA3AF":"#0D3B2E",fontWeight:800,fontSize:".85rem",cursor:prog?"not-allowed":"pointer",boxShadow:prog?"none":"0 4px 16px rgba(201,150,15,.4)",transition:"all .2s"}}>{prog?"⏳ Envoi en cours…":"🚀 Envoyer mon profil"}</button>
          }
        </div>

        {/* Option WhatsApp alternative */}
        <div style={{marginTop:"1rem",background:"#F0FDF4",border:"1px solid #D1FAE5",borderRadius:"12px",padding:".85rem",textAlign:"center"}}>
          <div style={{color:"#166534",fontSize:".78rem",fontWeight:600,marginBottom:".5rem"}}>Tu préfères t'inscrire par WhatsApp ?</div>
          <a href={`https://wa.me/${WA_NUM1}?text=${encodeURIComponent("Bonjour, je veux créer mon profil TalentProof. Je suis : [ton prénom, ton métier, ta ville]")}`} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:".45rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".82rem",padding:".52rem 1.2rem",borderRadius:"99px",textDecoration:"none",boxShadow:"0 2px 10px rgba(37,211,102,.3)"}}>
            <WaLogo size={16}/> Envoyer un message vocal sur WhatsApp
          </a>
        </div>

        <p style={{textAlign:"center",color:"#9CA3AF",fontSize:".72rem",marginTop:".72rem",lineHeight:1.6}}>
          En soumettant, tu acceptes nos{" "}
          <Link href="/mentions-legales" style={{color:"#1B6B47",textDecoration:"none"}}>mentions légales</Link>{" "}
          et notre{" "}
          <Link href="/confidentialite" style={{color:"#1B6B47",textDecoration:"none"}}>politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}