"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";


const METIERS_ANNONCE = [
  "Formateur / Enseignant", "Chauffeur VTC", "Livreur", "Mécanicien",
  "Électricien", "Plombier", "Maçon", "Aide ménagère", "Nounou",
  "Gardien", "Cuisinier", "Vendeur", "Informaticien", "Comptable",
  "Agent de sécurité", "Développeur", "Community Manager", "Autre"
];

const inputSt = {
  width:"100%", padding:".65rem .9rem", borderRadius:"8px",
  border:"1.5px solid #E5E7EB", fontSize:".9rem", fontFamily:"inherit",
  outline:"none", background:"white", color:"#111", transition:"border-color .2s", boxSizing:"border-box",
};

/* ─────────────────────────────────────────────────────────
   LOGIN PARTENAIRE
───────────────────────────────────────────────────────── */
function LoginForm({ onLogin }) {
  const [identifiant, setIdentifiant] = useState("");
  const [pin, setPin]                 = useState("");
  const [loading, setLoading]         = useState(false);
  const [err, setErr]                 = useState("");

  const connexion = async () => {
    if (!identifiant.trim() || pin.length < 4) { setErr("Email/téléphone et code PIN requis."); return; }
    setLoading(true); setErr("");
    try {
      const isEmail = identifiant.includes("@");
      const { data, error } = await supabase
        .from("partenaires")
        .select("*")
        .eq(isEmail ? "contact_email" : "contact_telephone", identifiant.trim())
        .eq("pin_code", pin)
        .single();
      if (error || !data) setErr("Identifiants incorrects. Vérifiez votre email/téléphone et PIN.");
      else onLogin(data);
    } catch { setErr("Erreur de connexion. Réessayez."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#071F15,#0D3B2E,#1B4332)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",fontFamily:"system-ui,sans-serif"}}>
      <div style={{maxWidth:400,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <Link href="/" style={{fontFamily:"'Sora',sans-serif",color:"#F0C040",fontWeight:900,fontSize:"1.3rem",textDecoration:"none"}}>TalentProof</Link>
          <p style={{color:"rgba(255,255,255,.6)",fontSize:".82rem",marginTop:".5rem"}}>Espace Partenaires</p>
        </div>
        <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",borderRadius:"20px",padding:"2rem"}}>
          <h2 style={{fontFamily:"'Sora',sans-serif",color:"white",fontWeight:800,fontSize:"1.1rem",marginBottom:"1.5rem",textAlign:"center"}}>🤝 Connexion Partenaire</h2>
          <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div>
              <label style={{color:"rgba(255,255,255,.7)",fontSize:".82rem",fontWeight:600,display:"block",marginBottom:".4rem"}}>Email ou téléphone</label>
              <input value={identifiant} onChange={e=>setIdentifiant(e.target.value)}
                placeholder="contact@organisation.com ou +225..."
                style={{...inputSt,background:"rgba(255,255,255,.08)",border:"1.5px solid rgba(255,255,255,.18)",color:"white"}}
                onFocus={e=>e.target.style.borderColor="#F0C040"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.18)"}/>
            </div>
            <div>
              <label style={{color:"rgba(255,255,255,.7)",fontSize:".82rem",fontWeight:600,display:"block",marginBottom:".4rem"}}>Code PIN (4 chiffres)</label>
              <input type="password" inputMode="numeric" maxLength={4} value={pin}
                onChange={e=>setPin(e.target.value.replace(/\D/g,"").slice(0,4))}
                placeholder="●●●●"
                style={{...inputSt,background:"rgba(255,255,255,.08)",border:"1.5px solid rgba(255,255,255,.18)",color:"white",letterSpacing:".3em",textAlign:"center"}}
                onFocus={e=>e.target.style.borderColor="#F0C040"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.18)"}
                onKeyDown={e=>e.key==="Enter"&&connexion()}/>
            </div>
            {err&&<div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:"8px",padding:".7rem",color:"#991B1B",fontSize:".82rem"}}>{err}</div>}
            <button onClick={connexion} disabled={loading}
              style={{padding:".8rem",borderRadius:"99px",border:"none",background:loading?"#374151":"linear-gradient(135deg,#C9960F,#F0C040)",color:loading?"#9CA3AF":"#0D3B2E",fontWeight:800,fontSize:".9rem",cursor:loading?"wait":"pointer"}}>
              {loading?"⏳ Connexion…":"🔑 Se connecter"}
            </button>
          </div>
          <div style={{textAlign:"center",marginTop:"1.5rem",paddingTop:"1.5rem",borderTop:"1px solid rgba(255,255,255,.1)"}}>
            <p style={{color:"rgba(255,255,255,.45)",fontSize:".78rem",marginBottom:".6rem"}}>Pas encore de compte ?</p>
            <Link href="/partenaire" style={{display:"inline-block",background:"rgba(255,255,255,.1)",color:"white",fontWeight:700,fontSize:".82rem",padding:".55rem 1.2rem",borderRadius:"99px",textDecoration:"none",border:"1px solid rgba(255,255,255,.2)"}}>
              🤝 Devenir Partenaire
            </Link>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:"1rem"}}>
          <Link href="/partenaires-dashboard" style={{color:"rgba(255,255,255,.4)",fontSize:".75rem",textDecoration:"none"}}>← Retour au programme partenaires</Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DASHBOARD PARTENAIRE
───────────────────────────────────────────────────────── */
function Dashboard({ partenaire, onLogout }) {
  const [onglet, setOnglet]         = useState("profil");
  const [annonces, setAnnonces]     = useState([]);
  const [loadAnn, setLoadAnn]       = useState(true);
  const [editMode, setEditMode]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [profil, setProfil]         = useState({...partenaire});
  const [annonce, setAnnonce]       = useState({ titre:"", metier:"", ville:"", description:"", urgent:false });
  const [annErr, setAnnErr]         = useState({});
  const [annLoading, setAnnLoading] = useState(false);
  const [annOk, setAnnOk]           = useState(false);

  useEffect(()=>{
    if(onglet==="annonces"||onglet==="nouvelle") chargerAnnonces();
  },[onglet]);

  const chargerAnnonces = async()=>{
    setLoadAnn(true);
    const { data } = await supabase.from("annonces").select("*").eq("auteur_id",partenaire.id).eq("auteur_type","partenaire").order("created_at",{ascending:false});
    setAnnonces(data||[]);
    setLoadAnn(false);
  };

  const sauvegarderProfil = async()=>{
    setSaving(true);
    await supabase.from("partenaires").update({
      nom_organisation:  profil.nom_organisation,
      secteur:           profil.secteur,
      pays:              profil.pays,
      ville:             profil.ville,
      site_web:          profil.site_web,
      contact_nom:       profil.contact_nom,
      contact_poste:     profil.contact_poste,
      contact_email:     profil.contact_email,
      contact_telephone: profil.contact_telephone,
    }).eq("id",partenaire.id);
    setSaving(false); setEditMode(false);
  };

  const posterAnnonce = async()=>{
    const e={};
    if(!annonce.titre.trim()) e.titre="Titre requis";
    if(!annonce.metier) e.metier="Métier requis";
    if(!annonce.ville.trim()) e.ville="Ville requise";
    if(!annonce.description.trim()) e.description="Description requise";
    setAnnErr(e);
    if(Object.keys(e).length>0) return;
    setAnnLoading(true);
    await supabase.from("annonces").insert([{
      auteur_id:   partenaire.id,
      auteur_type: "partenaire",
      titre:       annonce.titre,
      metier:      annonce.metier,
      ville:       annonce.ville,
      description: annonce.description,
      urgent:      annonce.urgent,
      statut:      "active",
    }]);
    setAnnLoading(false); setAnnOk(true);
    setAnnonce({titre:"",metier:"",ville:"",description:"",urgent:false});
    setTimeout(()=>{ setAnnOk(false); setOnglet("annonces"); chargerAnnonces(); },1500);
  };

  const supprimerAnnonce = async(id)=>{
    if(!confirm("Supprimer cette annonce ?")) return;
    await supabase.from("annonces").delete().eq("id",id);
    chargerAnnonces();
  };

  const sp=(k,v)=>setProfil(p=>({...p,[k]:v}));

  return (
    <div style={{minHeight:"100vh",background:"#F0F4F0",fontFamily:"system-ui,sans-serif"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#071F15,#0D3B2E,#1B4332)",padding:"1rem 1.2rem"}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:".6rem"}}>
          <div>
            <Link href="/" style={{fontFamily:"'Sora',sans-serif",color:"#F0C040",fontWeight:900,fontSize:"1rem",textDecoration:"none"}}>TalentProof</Link>
            <div style={{color:"rgba(255,255,255,.55)",fontSize:".75rem",marginTop:"2px"}}>🤝 {partenaire.nom_organisation}</div>
          </div>
          <div style={{display:"flex",gap:".5rem",alignItems:"center"}}>
            <Link href="/annuaire" style={{color:"rgba(255,255,255,.6)",fontSize:".78rem",textDecoration:"none",border:"1px solid rgba(255,255,255,.2)",padding:".35rem .8rem",borderRadius:"99px"}}>Annuaire</Link>
            <button onClick={onLogout} style={{background:"rgba(239,68,68,.15)",border:"1px solid rgba(239,68,68,.3)",color:"#FCA5A5",fontSize:".78rem",fontWeight:600,padding:".35rem .8rem",borderRadius:"99px",cursor:"pointer"}}>Déconnexion</button>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div style={{background:"white",borderBottom:"1px solid #E5E7EB"}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",gap:0}}>
          {[["profil","🤝 Mon profil"],["annonces","📋 Mes annonces"],["nouvelle","➕ Nouvelle annonce"]].map(([k,l])=>(
            <button key={k} onClick={()=>setOnglet(k)}
              style={{padding:".85rem 1.1rem",border:"none",borderBottom:`2px solid ${onglet===k?"#1B6B47":"transparent"}`,background:"transparent",color:onglet===k?"#1B6B47":"#6B7280",fontWeight:onglet===k?800:500,fontSize:".82rem",cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:860,margin:"0 auto",padding:"1.5rem 1rem"}}>

        {/* ── PROFIL ── */}
        {onglet==="profil"&&(
          <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div style={{background:"white",borderRadius:"16px",padding:"1.5rem",boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.2rem",flexWrap:"wrap",gap:".5rem"}}>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1rem",color:"#111"}}>Informations de l'organisation</h2>
                {!editMode
                  ? <button onClick={()=>setEditMode(true)} style={{background:"#F0FDF4",border:"1px solid #D1FAE5",color:"#1B6B47",fontWeight:700,fontSize:".8rem",padding:".45rem 1rem",borderRadius:"99px",cursor:"pointer"}}>✏️ Modifier</button>
                  : <div style={{display:"flex",gap:".5rem"}}>
                      <button onClick={()=>setEditMode(false)} style={{background:"#F3F4F6",border:"1px solid #E5E7EB",color:"#6B7280",fontWeight:700,fontSize:".8rem",padding:".45rem .9rem",borderRadius:"99px",cursor:"pointer"}}>Annuler</button>
                      <button onClick={sauvegarderProfil} disabled={saving} style={{background:"linear-gradient(135deg,#1B6B47,#2D9A68)",border:"none",color:"white",fontWeight:700,fontSize:".8rem",padding:".45rem 1rem",borderRadius:"99px",cursor:saving?"wait":"pointer"}}>
                        {saving?"⏳ Sauvegarde…":"✅ Sauvegarder"}
                      </button>
                    </div>
                }
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"1rem"}}>
                {[
                  ["nom_organisation","🏢 Nom de l'organisation"],
                  ["type_partenariat","🤝 Type de partenariat"],
                  ["secteur","🏭 Secteur"],
                  ["pays","🌍 Pays"],
                  ["ville","📍 Ville"],
                  ["site_web","🌐 Site web"],
                  ["contact_nom","👤 Responsable"],
                  ["contact_poste","💼 Poste"],
                  ["contact_email","📧 Email"],
                  ["contact_telephone","📱 Téléphone"],
                ].map(([k,label])=>(
                  <div key={k}>
                    <div style={{fontSize:".74rem",fontWeight:700,color:"#9CA3AF",marginBottom:".25rem"}}>{label}</div>
                    {editMode && k!=="type_partenariat"
                      ? <input value={profil[k]||""} onChange={e=>sp(k,e.target.value)}
                          style={{...inputSt,borderColor:"#D1FAE5"}}
                          onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor="#D1FAE5"}/>
                      : <div style={{fontSize:".88rem",fontWeight:600,color:"#111"}}>{profil[k]||"—"}</div>
                    }
                  </div>
                ))}
              </div>

              <div style={{marginTop:"1rem",paddingTop:"1rem",borderTop:"1px solid #F3F4F6"}}>
                <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
                  <div>
                    <div style={{fontSize:".74rem",fontWeight:700,color:"#9CA3AF",marginBottom:".25rem"}}>⚡ Statut</div>
                    <div style={{display:"inline-block",background:profil.statut==="active"?"#F0FDF4":"#FFF7ED",color:profil.statut==="active"?"#16A34A":"#D97706",fontWeight:700,fontSize:".8rem",padding:".3rem .75rem",borderRadius:"99px"}}>{profil.statut==="active"?"✅ Actif":"⏳ En attente de validation"}</div>
                  </div>
                  <div>
                    <div style={{fontSize:".74rem",fontWeight:700,color:"#9CA3AF",marginBottom:".25rem"}}>🎯 Objectifs</div>
                    <div style={{fontSize:".85rem",color:"#374151"}}>{profil.objectifs||"—"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge partenaire */}
            <div style={{background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",border:"2px solid #86EFAC",borderRadius:"16px",padding:"1.3rem",display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",flexShrink:0}}>✨</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,color:"#065F46",fontSize:".95rem",marginBottom:".25rem"}}>Badge Partenaire TalentProof</div>
                <div style={{color:"#047857",fontSize:".8rem"}}>Votre organisation est visible auprès des 14 000+ talents inscrits sur la plateforme.</div>
              </div>
            </div>
          </div>
        )}

        {/* ── MES ANNONCES ── */}
        {onglet==="annonces"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",flexWrap:"wrap",gap:".5rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1rem",color:"#111"}}>Mes annonces</h2>
              <button onClick={()=>setOnglet("nouvelle")} style={{background:"linear-gradient(135deg,#1B6B47,#2D9A68)",border:"none",color:"white",fontWeight:700,fontSize:".82rem",padding:".5rem 1rem",borderRadius:"99px",cursor:"pointer"}}>+ Nouvelle annonce</button>
            </div>
            {loadAnn
              ? <div style={{textAlign:"center",padding:"3rem",color:"#9CA3AF"}}>⏳ Chargement…</div>
              : annonces.length===0
                ? <div style={{background:"white",borderRadius:"16px",padding:"3rem",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
                    <div style={{fontSize:"3rem",marginBottom:"1rem"}}>📋</div>
                    <div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,color:"#111",marginBottom:".5rem"}}>Aucune annonce pour l'instant</div>
                    <p style={{color:"#9CA3AF",fontSize:".85rem",marginBottom:"1.2rem"}}>Postez votre première annonce.</p>
                    <button onClick={()=>setOnglet("nouvelle")} style={{background:"linear-gradient(135deg,#C9960F,#F0C040)",border:"none",color:"#0D3B2E",fontWeight:800,fontSize:".88rem",padding:".65rem 1.5rem",borderRadius:"99px",cursor:"pointer"}}>➕ Créer une annonce</button>
                  </div>
                : <div style={{display:"flex",flexDirection:"column",gap:".75rem"}}>
                    {annonces.map(a=>(
                      <div key={a.id} style={{background:"white",borderRadius:"14px",padding:"1.1rem 1.2rem",boxShadow:"0 2px 8px rgba(0,0,0,.06)",display:"flex",gap:"1rem",alignItems:"flex-start",flexWrap:"wrap"}}>
                        <div style={{flex:1,minWidth:200}}>
                          <div style={{display:"flex",alignItems:"center",gap:".5rem",marginBottom:".3rem",flexWrap:"wrap"}}>
                            <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".9rem",color:"#111"}}>{a.titre}</span>
                            {a.urgent&&<span style={{background:"#FEF2F2",color:"#DC2626",fontSize:".65rem",fontWeight:700,padding:"2px 8px",borderRadius:"99px"}}>🔴 URGENT</span>}
                            <span style={{background:"#F0FDF4",color:"#16A34A",fontSize:".65rem",fontWeight:700,padding:"2px 8px",borderRadius:"99px"}}>{a.statut==="active"?"✓ Active":"Inactive"}</span>
                          </div>
                          <div style={{color:"#6B7280",fontSize:".8rem",marginBottom:".4rem"}}>💼 {a.metier} · 📍 {a.ville}</div>
                          <div style={{color:"#555",fontSize:".8rem",lineHeight:1.6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{a.description}</div>
                          <div style={{color:"#9CA3AF",fontSize:".72rem",marginTop:".4rem"}}>Publiée le {new Date(a.created_at).toLocaleDateString("fr-FR")}</div>
                        </div>
                        <button onClick={()=>supprimerAnnonce(a.id)} style={{background:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626",fontWeight:600,fontSize:".75rem",padding:".4rem .8rem",borderRadius:"8px",cursor:"pointer",flexShrink:0}}>🗑 Supprimer</button>
                      </div>
                    ))}
                  </div>
            }
          </div>
        )}

        {/* ── NOUVELLE ANNONCE ── */}
        {onglet==="nouvelle"&&(
          <div style={{background:"white",borderRadius:"16px",padding:"1.5rem",boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1rem",color:"#111",marginBottom:"1.2rem"}}>➕ Publier une annonce</h2>
            {annOk&&(
              <div style={{background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:"12px",padding:"1rem",textAlign:"center",marginBottom:"1rem"}}>
                <div style={{fontSize:"1.8rem",marginBottom:".3rem"}}>✅</div>
                <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,color:"#16A34A"}}>Annonce publiée !</div>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              <div>
                <label style={{fontSize:".82rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".35rem"}}>Titre de l'annonce *</label>
                <input value={annonce.titre} onChange={e=>setAnnonce(a=>({...a,titre:e.target.value}))} placeholder="Ex: Formation gratuite en électricité disponible"
                  style={{...inputSt,borderColor:annErr.titre?"#EF4444":"#E5E7EB"}}
                  onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=annErr.titre?"#EF4444":"#E5E7EB"}/>
                {annErr.titre&&<p style={{color:"#EF4444",fontSize:".72rem",margin:".3rem 0 0"}}>{annErr.titre}</p>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".75rem"}}>
                <div>
                  <label style={{fontSize:".82rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".35rem"}}>Métier concerné *</label>
                  <select value={annonce.metier} onChange={e=>setAnnonce(a=>({...a,metier:e.target.value}))}
                    style={{...inputSt,borderColor:annErr.metier?"#EF4444":"#E5E7EB",cursor:"pointer"}}
                    onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=annErr.metier?"#EF4444":"#E5E7EB"}>
                    <option value="">-- Métier --</option>
                    {METIERS_ANNONCE.map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                  {annErr.metier&&<p style={{color:"#EF4444",fontSize:".72rem",margin:".3rem 0 0"}}>{annErr.metier}</p>}
                </div>
                <div>
                  <label style={{fontSize:".82rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".35rem"}}>Ville *</label>
                  <input value={annonce.ville} onChange={e=>setAnnonce(a=>({...a,ville:e.target.value}))} placeholder="Abidjan"
                    style={{...inputSt,borderColor:annErr.ville?"#EF4444":"#E5E7EB"}}
                    onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=annErr.ville?"#EF4444":"#E5E7EB"}/>
                  {annErr.ville&&<p style={{color:"#EF4444",fontSize:".72rem",margin:".3rem 0 0"}}>{annErr.ville}</p>}
                </div>
              </div>
              <div>
                <label style={{fontSize:".82rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".35rem"}}>Description *</label>
                <textarea value={annonce.description} onChange={e=>setAnnonce(a=>({...a,description:e.target.value}))}
                  placeholder="Décrivez votre annonce, les conditions, les profils recherchés…" rows={5} maxLength={800}
                  style={{...inputSt,resize:"vertical",lineHeight:1.65,borderColor:annErr.description?"#EF4444":"#E5E7EB"}}
                  onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=annErr.description?"#EF4444":"#E5E7EB"}/>
                {annErr.description&&<p style={{color:"#EF4444",fontSize:".72rem",margin:".3rem 0 0"}}>{annErr.description}</p>}
                <div style={{textAlign:"right",color:"#9CA3AF",fontSize:".71rem",marginTop:".2rem"}}>{annonce.description.length}/800</div>
              </div>
              <div>
                <label style={{display:"flex",alignItems:"center",gap:".6rem",cursor:"pointer",userSelect:"none"}}>
                  <div onClick={()=>setAnnonce(a=>({...a,urgent:!a.urgent}))}
                    style={{width:44,height:24,borderRadius:"99px",background:annonce.urgent?"#DC2626":"#E5E7EB",position:"relative",transition:"background .2s",cursor:"pointer",flexShrink:0}}>
                    <div style={{position:"absolute",top:2,left:annonce.urgent?20:2,width:20,height:20,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
                  </div>
                  <span style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:".85rem",color:"#374151"}}>
                    {annonce.urgent ? "🔴 Annonce URGENTE" : "Annonce urgente ?"}
                  </span>
                </label>
              </div>
              <button onClick={posterAnnonce} disabled={annLoading||annOk}
                style={{padding:".75rem",borderRadius:"99px",border:"none",background:annLoading||annOk?"#E5E7EB":"linear-gradient(135deg,#C9960F,#F0C040)",color:annLoading||annOk?"#9CA3AF":"#0D3B2E",fontWeight:800,fontSize:".9rem",cursor:annLoading||annOk?"not-allowed":"pointer",transition:"all .2s"}}>
                {annLoading?"⏳ Publication…":"🚀 Publier l'annonce"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE PRINCIPALE
───────────────────────────────────────────────────────── */
export default function PartenairesDashboardPage() {
  const [mode, setMode]        = useState("login"); // login | dashboard
  const [partenaire, setPartn] = useState(null);

  // Restaurer session depuis localStorage
  useEffect(()=>{
    try {
      const saved = localStorage.getItem("tp_partenaire");
      if(saved) { setPartn(JSON.parse(saved)); setMode("dashboard"); }
    } catch {}
  },[]);

  const handleLogin  = (data)=>{ setPartn(data); localStorage.setItem("tp_partenaire",JSON.stringify(data)); setMode("dashboard"); };
  const handleLogout = ()=>{ setPartn(null); localStorage.removeItem("tp_partenaire"); setMode("login"); };

  if(mode==="dashboard" && partenaire) return <Dashboard partenaire={partenaire} onLogout={handleLogout}/>;
  return <LoginForm onLogin={handleLogin}/>;
}
