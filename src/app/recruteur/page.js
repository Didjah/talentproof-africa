"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const WA_NUM1 = "2250705503089";

const METIERS_ANNONCE = [
  "Chauffeur VTC", "Chauffeur camion", "Livreur", "Mécanicien",
  "Électricien", "Plombier", "Maçon", "Peintre",
  "Aide ménagère", "Nounou", "Gardien", "Jardinier",
  "Cuisinier", "Vendeur", "Informaticien", "Comptable",
  "Agent de sécurité", "Autre"
];

const inputSt = {
  width:"100%", padding:".65rem .9rem", borderRadius:"8px",
  border:"1.5px solid #E5E7EB", fontSize:".9rem", fontFamily:"inherit",
  outline:"none", background:"white", color:"#111", transition:"border-color .2s", boxSizing:"border-box",
};

function WaLogo({ size=20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.527 5.852L.057 23.5l5.797-1.497A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.162-1.416l-.37-.218-3.441.889.917-3.346-.24-.387A9.944 9.944 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
    </svg>
  );
}

const AVANTAGES = [
  { icon:"🔍", titre:"Recherche ciblée",       desc:"Filtre par métier, ville, disponibilité et type de profil." },
  { icon:"✅", titre:"Profils vérifiés",        desc:"Chaque talent est contrôlé par notre équipe avant publication." },
  { icon:"🔒", titre:"Documents sécurisés",     desc:"Accède aux diplômes et certificats sur demande approuvée." },
  { icon:"💬", titre:"Contact direct WhatsApp", desc:"Contacte le talent directement, sans intermédiaire." },
  { icon:"📊", titre:"Statistiques",           desc:"Suis tes contacts et recrutements depuis ton tableau de bord." },
  { icon:"🌍", titre:"9 pays couverts",         desc:"Dakar, Abidjan, Accra, Lagos, Bamako, Lomé et plus encore." },
];

const TEMOIGNAGES = [
  { nom:"Aminata Traoré",    role:"DRH, PME Abidjan",     txt:"En 48h j'ai trouvé un électricien certifié. La qualité des profils est impressionnante.", avatar:"👩‍💼" },
  { nom:"Jean-Baptiste Koné",role:"Propriétaire, Villa Dakar",txt:"J'ai recruté une aide ménagère de confiance. Le système de vérification me rassure.", avatar:"👨‍💼" },
];

/* ─────────────────────────────────────────────────────────
   SECTION LOGIN
───────────────────────────────────────────────────────── */
function LoginForm({ onLogin, onShowLanding }) {
  const [identifiant, setIdentifiant] = useState("");
  const [pin, setPin]                 = useState("");
  const [loading, setLoading]         = useState(false);
  const [err, setErr]                 = useState("");

  const connexion = async () => {
    if (!identifiant.trim() || pin.length < 4) {
      setErr("Email/téléphone et code PIN requis."); return;
    }
    setLoading(true); setErr("");
    try {
      const isEmail = identifiant.includes("@");
      const { data, error } = await supabase
        .from("recruteurs")
        .select("*")
        .eq(isEmail ? "contact_email" : "contact_telephone", identifiant.trim())
        .eq("pin_code", pin)
        .single();
      if (error || !data) { setErr("Identifiants incorrects. Vérifiez votre email/téléphone et PIN."); }
      else { onLogin(data); }
    } catch { setErr("Erreur de connexion. Réessayez."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0B1628,#162F52)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",fontFamily:"system-ui,sans-serif"}}>
      <div style={{maxWidth:400,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <Link href="/" style={{fontFamily:"'Sora',sans-serif",color:"#F0C040",fontWeight:900,fontSize:"1.3rem",textDecoration:"none"}}>TalentProof</Link>
          <p style={{color:"rgba(255,255,255,.6)",fontSize:".82rem",marginTop:".5rem"}}>Espace Recruteur</p>
        </div>
        <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",borderRadius:"20px",padding:"2rem"}}>
          <h2 style={{fontFamily:"'Sora',sans-serif",color:"white",fontWeight:800,fontSize:"1.1rem",marginBottom:"1.5rem",textAlign:"center"}}>🏢 Connexion Recruteur</h2>
          <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div>
              <label style={{color:"rgba(255,255,255,.7)",fontSize:".82rem",fontWeight:600,display:"block",marginBottom:".4rem"}}>Email ou téléphone</label>
              <input value={identifiant} onChange={e=>setIdentifiant(e.target.value)}
                placeholder="marie@entreprise.com ou +225..."
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
              style={{padding:".8rem",borderRadius:"99px",border:"none",background:loading?"#374151":"linear-gradient(135deg,#C9960F,#F0C040)",color:loading?"#9CA3AF":"#0D3B2E",fontWeight:800,fontSize:".9rem",cursor:loading?"wait":"pointer",transition:"all .2s"}}>
              {loading?"⏳ Connexion…":"🔑 Se connecter"}
            </button>
          </div>
          <div style={{textAlign:"center",marginTop:"1.5rem",paddingTop:"1.5rem",borderTop:"1px solid rgba(255,255,255,.1)"}}>
            <p style={{color:"rgba(255,255,255,.45)",fontSize:".78rem",marginBottom:".6rem"}}>Pas encore de compte ?</p>
            <button onClick={onShowLanding}
              style={{display:"inline-block",background:"rgba(255,255,255,.1)",color:"white",fontWeight:700,fontSize:".82rem",padding:".55rem 1.2rem",borderRadius:"99px",border:"1px solid rgba(255,255,255,.2)",cursor:"pointer"}}>
              🏢 S'inscrire
            </button>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:"1rem"}}>
          <Link href="/recruteur" style={{color:"rgba(255,255,255,.4)",fontSize:".75rem",textDecoration:"none"}}>← Retour à l'espace recruteur</Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DASHBOARD RECRUTEUR
───────────────────────────────────────────────────────── */
function Dashboard({ recruteur, onLogout }) {
  const [onglet, setOnglet]         = useState("profil");
  const [annonces, setAnnonces]     = useState([]);
  const [loadAnnonces, setLoadAnn]  = useState(true);
  const [editMode, setEditMode]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [profil, setProfil]         = useState({...recruteur});
  const [annonce, setAnnonce]       = useState({ titre:"", metier:"", ville:"", description:"", urgent:false });
  const [annErr, setAnnErr]         = useState({});
  const [annLoading, setAnnLoading] = useState(false);
  const [annOk, setAnnOk]           = useState(false);

  useEffect(()=>{
    if(onglet==="annonces" || onglet==="nouvelle") chargerAnnonces();
  },[onglet]);

  const chargerAnnonces = async()=>{
    setLoadAnn(true);
    const { data } = await supabase.from("annonces").select("*").eq("auteur_id",recruteur.id).eq("auteur_type","recruteur").order("created_at",{ascending:false});
    setAnnonces(data||[]);
    setLoadAnn(false);
  };

  const sauvegarderProfil = async()=>{
    setSaving(true);
    await supabase.from("recruteurs").update({
      nom_entreprise:    profil.nom_entreprise,
      secteur:           profil.secteur,
      pays:              profil.pays,
      ville:             profil.ville,
      site_web:          profil.site_web,
      contact_nom:       profil.contact_nom,
      contact_poste:     profil.contact_poste,
      contact_email:     profil.contact_email,
      contact_telephone: profil.contact_telephone,
    }).eq("id",recruteur.id);
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
      auteur_id:   recruteur.id,
      auteur_type: "recruteur",
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
      <div style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:"1rem 1.2rem"}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:".6rem"}}>
          <div>
            <Link href="/" style={{fontFamily:"'Sora',sans-serif",color:"#F0C040",fontWeight:900,fontSize:"1rem",textDecoration:"none"}}>TalentProof</Link>
            <div style={{color:"rgba(255,255,255,.55)",fontSize:".75rem",marginTop:"2px"}}>🏢 {recruteur.nom_entreprise}</div>
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
          {[["profil","👤 Mon profil"],["annonces","📋 Mes annonces"],["nouvelle","➕ Nouvelle annonce"]].map(([k,l])=>(
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
                <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1rem",color:"#111"}}>Informations de l'entreprise</h2>
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
                  ["nom_entreprise","🏢 Nom de l'entreprise"],
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
                    {editMode
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
                    <div style={{fontSize:".74rem",fontWeight:700,color:"#9CA3AF",marginBottom:".25rem"}}>📋 Abonnement</div>
                    <div style={{display:"inline-block",background:"#EFF6FF",color:"#1D4ED8",fontWeight:700,fontSize:".8rem",padding:".3rem .75rem",borderRadius:"99px"}}>{profil.abonnement||"basique"}</div>
                  </div>
                  <div>
                    <div style={{fontSize:".74rem",fontWeight:700,color:"#9CA3AF",marginBottom:".25rem"}}>⚡ Statut</div>
                    <div style={{display:"inline-block",background:profil.statut==="active"?"#F0FDF4":"#FFF7ED",color:profil.statut==="active"?"#16A34A":"#D97706",fontWeight:700,fontSize:".8rem",padding:".3rem .75rem",borderRadius:"99px"}}>{profil.statut==="active"?"✅ Actif":"⏳ En attente"}</div>
                  </div>
                  <div>
                    <div style={{fontSize:".74rem",fontWeight:700,color:"#9CA3AF",marginBottom:".25rem"}}>🎯 Profils recherchés</div>
                    <div style={{fontSize:".85rem",color:"#374151"}}>{profil.types_profils||"—"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA annuaire */}
            <div style={{background:"linear-gradient(135deg,#071F15,#1B6B47)",borderRadius:"16px",padding:"1.3rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
              <div>
                <div style={{fontFamily:"'Sora',sans-serif",color:"white",fontWeight:800,fontSize:".95rem",marginBottom:".25rem"}}>Parcourir l'annuaire des talents</div>
                <div style={{color:"rgba(255,255,255,.6)",fontSize:".78rem"}}>Trouvez le profil qu'il vous faut parmi nos talents vérifiés.</div>
              </div>
              <Link href="/annuaire" style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",fontWeight:800,fontSize:".85rem",padding:".65rem 1.4rem",borderRadius:"99px",textDecoration:"none",whiteSpace:"nowrap"}}>
                🔍 Voir l'annuaire
              </Link>
            </div>
          </div>
        )}

        {/* ── MES ANNONCES ── */}
        {onglet==="annonces"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",flexWrap:"wrap",gap:".5rem"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1rem",color:"#111"}}>Mes annonces de recrutement</h2>
              <button onClick={()=>setOnglet("nouvelle")} style={{background:"linear-gradient(135deg,#1B6B47,#2D9A68)",border:"none",color:"white",fontWeight:700,fontSize:".82rem",padding:".5rem 1rem",borderRadius:"99px",cursor:"pointer"}}>+ Nouvelle annonce</button>
            </div>
            {loadAnnonces
              ? <div style={{textAlign:"center",padding:"3rem",color:"#9CA3AF"}}>⏳ Chargement…</div>
              : annonces.length===0
                ? <div style={{background:"white",borderRadius:"16px",padding:"3rem",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
                    <div style={{fontSize:"3rem",marginBottom:"1rem"}}>📋</div>
                    <div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,color:"#111",marginBottom:".5rem"}}>Aucune annonce pour l'instant</div>
                    <p style={{color:"#9CA3AF",fontSize:".85rem",marginBottom:"1.2rem"}}>Postez votre première annonce de recrutement.</p>
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
            <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1rem",color:"#111",marginBottom:"1.2rem"}}>➕ Publier une annonce de recrutement</h2>
            {annOk&&(
              <div style={{background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:"12px",padding:"1rem",textAlign:"center",marginBottom:"1rem"}}>
                <div style={{fontSize:"1.8rem",marginBottom:".3rem"}}>✅</div>
                <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,color:"#16A34A"}}>Annonce publiée avec succès !</div>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              <div>
                <label style={{fontSize:".82rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".35rem"}}>Titre de l'annonce *</label>
                <input value={annonce.titre} onChange={e=>setAnnonce(a=>({...a,titre:e.target.value}))} placeholder="Ex: Recherche chauffeur VTC expérimenté"
                  style={{...inputSt,borderColor:annErr.titre?"#EF4444":"#E5E7EB"}}
                  onFocus={e=>e.target.style.borderColor="#1B6B47"} onBlur={e=>e.target.style.borderColor=annErr.titre?"#EF4444":"#E5E7EB"}/>
                {annErr.titre&&<p style={{color:"#EF4444",fontSize:".72rem",margin:".3rem 0 0"}}>{annErr.titre}</p>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".75rem"}}>
                <div>
                  <label style={{fontSize:".82rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".35rem"}}>Métier recherché *</label>
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
                <label style={{fontSize:".82rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".35rem"}}>Description du poste *</label>
                <textarea value={annonce.description} onChange={e=>setAnnonce(a=>({...a,description:e.target.value}))}
                  placeholder="Décrivez le poste, les exigences, les conditions de travail…" rows={5} maxLength={800}
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
                    {annonce.urgent ? "🔴 Recrutement URGENT" : "Recrutement urgent ?"}
                  </span>
                </label>
              </div>
              <button onClick={posterAnnonce} disabled={annLoading||annOk}
                style={{padding:".75rem",borderRadius:"99px",border:"none",background:annLoading||annOk?"#E5E7EB":"linear-gradient(135deg,#C9960F,#F0C040)",color:annLoading||annOk?"#9CA3AF":"#0D3B2E",fontWeight:800,fontSize:".9rem",cursor:annLoading||annOk?"not-allowed":"pointer",boxShadow:"0 4px 16px rgba(201,150,15,.3)",transition:"all .2s"}}>
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
   PAGE PRINCIPALE (landing + connexion)
───────────────────────────────────────────────────────── */
export default function RecruteurPage() {
  const [mode, setMode]       = useState("login"); // login | landing | dashboard
  const [recruteur, setRecr]  = useState(null);

  // Restaurer session localStorage ou auto-login depuis URL (?tel=...&auto=1)
  useEffect(()=>{
    // 1. Session existante
    try {
      const saved = localStorage.getItem("tp_recruteur");
      if(saved) { setRecr(JSON.parse(saved)); setMode("dashboard"); return; }
    } catch {}

    // 2. Auto-login après inscription (tel + auto=1 dans l'URL)
    const params = new URLSearchParams(window.location.search);
    const tel  = params.get("tel");
    const auto = params.get("auto");
    if(tel && auto==="1"){
      supabase
        .from("recruteurs")
        .select("*")
        .eq("contact_telephone", decodeURIComponent(tel))
        .order("created_at",{ascending:false})
        .limit(1)
        .then(({ data })=>{
          if(data && data.length>0){
            const r = data[0];
            setRecr(r);
            localStorage.setItem("tp_recruteur", JSON.stringify(r));
            setMode("dashboard");
          }
        })
        .catch(()=>{});
    }
  },[]);

  const handleLogin = (data)=>{ setRecr(data); localStorage.setItem("tp_recruteur",JSON.stringify(data)); setMode("dashboard"); };
  const handleLogout= ()=>{ setRecr(null); localStorage.removeItem("tp_recruteur"); setMode("login"); };

  if(mode==="login") return <LoginForm onLogin={handleLogin} onShowLanding={()=>setMode("landing")}/>;
  if(mode==="dashboard" && recruteur) return <Dashboard recruteur={recruteur} onLogout={handleLogout}/>;

  /* ── LANDING ── */
  return (
    <div style={{ minHeight:"100vh", background:"#F0F4F0", fontFamily:"system-ui,sans-serif" }}>

      {/* Header hero */}
      <div style={{ background:"linear-gradient(135deg,#0B1628,#0F2744,#162F52)", padding:"2.5rem 1rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"rgba(240,192,64,.07)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:640, margin:"0 auto", position:"relative" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.2rem" }}>
            <Link href="/" style={{ color:"rgba(255,255,255,0.5)", fontSize:".79rem", textDecoration:"none" }}>← Retour</Link>
            <button onClick={()=>setMode("login")} style={{ background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.25)", color:"white", fontWeight:700, fontSize:".8rem", padding:".45rem 1rem", borderRadius:"99px", cursor:"pointer" }}>
              🔑 Connexion espace recruteur
            </button>
          </div>
          <div style={{ display:"inline-block", background:"rgba(240,192,64,.14)", color:"#F0C040", fontSize:".66rem", fontWeight:800, letterSpacing:".9px", textTransform:"uppercase", padding:"4px 12px", borderRadius:"99px", marginBottom:".85rem", border:"1px solid rgba(240,192,64,.3)" }}>
            🏢 ESPACE RECRUTEUR
          </div>
          <h1 style={{ fontFamily:"'Sora',sans-serif", color:"#F5F0E8", fontWeight:900, fontSize:"clamp(1.3rem,4vw,1.85rem)", lineHeight:1.25, margin:"0 0 .65rem" }}>
            Recrutez les meilleurs talents<br/>
            <span style={{ color:"#F0C040" }}>d'Afrique en 48 heures.</span>
          </h1>
          <p style={{ color:"rgba(210,225,245,.72)", fontSize:".88rem", lineHeight:1.7, marginBottom:"1.5rem" }}>
            14 000+ profils vérifiés — chauffeurs, artisans, personnels de maison, techniciens.
            Tous disponibles, joignables directement sur WhatsApp.
          </p>
          <div style={{ display:"flex", gap:".65rem", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/inscription-entreprise" style={{ display:"inline-flex", alignItems:"center", gap:".45rem", background:"linear-gradient(135deg,#C9960F,#F0C040)", color:"#0D3B2E", fontWeight:800, fontSize:".9rem", padding:".78rem 1.75rem", borderRadius:"99px", textDecoration:"none", boxShadow:"0 4px 18px rgba(201,150,15,.42)" }}>
              🏢 S'inscrire maintenant
            </Link>
            <Link href="/annuaire" style={{ display:"inline-flex", alignItems:"center", gap:".45rem", color:"rgba(255,255,255,.78)", fontWeight:600, fontSize:".88rem", padding:".78rem 1.4rem", borderRadius:"99px", textDecoration:"none", border:"1.5px solid rgba(255,255,255,.22)" }}>
              🔍 Parcourir l'annuaire
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:820, margin:"0 auto", padding:"1.5rem 1rem" }}>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:".75rem", marginBottom:"1.5rem" }}>
          {[["14 000+","talents inscrits"],["9 pays","couverts"],["48h","délai moyen"]].map(([v,l]) => (
            <div key={l} style={{ background:"white", borderRadius:"14px", padding:"1rem .75rem", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:"clamp(1rem,3vw,1.3rem)", color:"#1B6B47" }}>{v}</div>
              <div style={{ color:"#888", fontSize:".72rem", marginTop:"3px" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Avantages */}
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.05rem", color:"#111", marginBottom:".85rem" }}>Pourquoi choisir TalentProof ?</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:".75rem", marginBottom:"1.5rem" }}>
          {AVANTAGES.map((a,i) => (
            <div key={i} style={{ background:"white", borderRadius:"14px", padding:"1rem", boxShadow:"0 2px 8px rgba(0,0,0,.05)", display:"flex", gap:".7rem", alignItems:"flex-start" }}>
              <span style={{ fontSize:"1.4rem", flexShrink:0 }}>{a.icon}</span>
              <div>
                <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:".85rem", color:"#111", marginBottom:".18rem" }}>{a.titre}</div>
                <div style={{ color:"#666", fontSize:".78rem", lineHeight:1.55 }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Témoignages */}
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.05rem", color:"#111", marginBottom:".85rem" }}>Ils ont recruté via TalentProof</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:".75rem", marginBottom:"1.5rem" }}>
          {TEMOIGNAGES.map((t,i) => (
            <div key={i} style={{ background:"white", borderRadius:"14px", padding:"1.1rem", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
              <div style={{ color:"#F0C040", fontSize:"1.2rem", marginBottom:".5rem" }}>★★★★★</div>
              <p style={{ color:"#444", fontSize:".82rem", lineHeight:1.68, fontStyle:"italic", marginBottom:".65rem" }}>« {t.txt} »</p>
              <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#0B1628,#162F52)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:".8rem", color:"#111" }}>{t.nom}</div>
                  <div style={{ color:"#888", fontSize:".72rem" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background:"linear-gradient(135deg,#071F15,#1B6B47)", borderRadius:"18px", padding:"1.6rem 1rem", textAlign:"center" }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, color:"white", fontSize:"1.05rem", marginBottom:".4rem" }}>Prêt à recruter ?</div>
          <p style={{ color:"rgba(255,255,255,.65)", fontSize:".82rem", marginBottom:"1.1rem" }}>Inscrivez votre entreprise pour accéder aux meilleurs talents d'Afrique.</p>
          <div style={{ display:"flex", gap:".65rem", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/inscription-entreprise" style={{ display:"inline-flex", alignItems:"center", gap:".4rem", background:"linear-gradient(135deg,#C9960F,#F0C040)", color:"#0D3B2E", fontWeight:800, fontSize:".88rem", padding:".72rem 1.7rem", borderRadius:"99px", textDecoration:"none", boxShadow:"0 4px 18px rgba(201,150,15,.42)" }}>
              🏢 S'inscrire maintenant
            </Link>
            <button onClick={()=>setMode("login")} style={{ display:"inline-flex", alignItems:"center", gap:".4rem", color:"white", fontWeight:600, fontSize:".88rem", padding:".72rem 1.5rem", borderRadius:"99px", textDecoration:"none", border:"1.5px solid rgba(255,255,255,.3)", background:"transparent", cursor:"pointer" }}>
              🔑 Se connecter
            </button>
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:"1.5rem", color:"#AAA", fontSize:".73rem", paddingBottom:"1.5rem" }}>
          <Link href="/" style={{ color:"#1B6B47", textDecoration:"none", fontWeight:600 }}>← TalentProof</Link>
          {" · "}
          <Link href="/mentions-legales" style={{ color:"#888", textDecoration:"none" }}>Mentions légales</Link>
          {" · "}
          <Link href="/confidentialite" style={{ color:"#888", textDecoration:"none" }}>Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}
