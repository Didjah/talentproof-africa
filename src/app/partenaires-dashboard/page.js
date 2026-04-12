"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const OFFRES = [
  { nom:"Starter",    prix:"Gratuit",    couleur:"#6B7280", bg:"linear-gradient(135deg,#1F2937,#374151)", features:["Badge Partenaire sur votre profil","Apparition dans le fil des talents","Bouton de contact intégré","Jusqu'à 5 demandes d'accès/mois"], cta:"Commencer gratuitement", ctaHref:"/partenaire" },
  { nom:"Pro",        prix:"Sur devis",  couleur:"#F0C040", bg:"linear-gradient(135deg,#1A1200,#3D2800)", highlight:true, features:["Tout Starter inclus","Statistiques en temps réel","Accès illimité aux documents","Mise en avant dans l'annuaire","Support dédié WhatsApp"], cta:"Demander un devis", ctaHref:"https://wa.me/2250705503089?text=Bonjour%20TalentProof%2C%20je%20souhaite%20devenir%20partenaire%20Pro." },
  { nom:"Entreprise", prix:"Sur mesure", couleur:"#4A9EFF", bg:"linear-gradient(135deg,#0B1628,#1A3560)", features:["Tout Pro inclus","Intégration API","Tableau de bord personnalisé","Accès multi-utilisateurs","SLA et contrat dédié"], cta:"Nous contacter", ctaHref:"https://wa.me/2250705503089?text=Bonjour%20TalentProof%2C%20je%20souhaite%20devenir%20partenaire%20Entreprise." }
];

const ETAPES = [
  { num:"01", icon:"📝", titre:"Inscris ton organisation",    desc:"Remplis le formulaire partenaire avec les informations de ton école ou entreprise." },
  { num:"02", icon:"✅", titre:"Validation sous 24h",         desc:"Notre équipe vérifie ton dossier et active ton badge Partenaire TalentProof." },
  { num:"03", icon:"🚀", titre:"Apparais dans le fil",         desc:"Ton organisation est visible par les 14 000+ talents. Tu reçois des contacts directs." },
  { num:"04", icon:"📊", titre:"Suis tes résultats",           desc:"Accède à tes statistiques : vues, contacts, demandes d'accès aux documents." },
];

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
  const [mode, setMode]         = useState("landing");
  const [partenaire, setPartn]  = useState(null);

  useEffect(()=>{
    try {
      const saved = localStorage.getItem("tp_partenaire");
      if(saved) { setPartn(JSON.parse(saved)); setMode("dashboard"); }
    } catch {}
  },[]);

  const handleLogin  = (data)=>{ setPartn(data); localStorage.setItem("tp_partenaire",JSON.stringify(data)); setMode("dashboard"); };
  const handleLogout = ()=>{ setPartn(null); localStorage.removeItem("tp_partenaire"); setMode("landing"); };

  if(mode==="login")                  return <LoginForm onLogin={handleLogin}/>;
  if(mode==="dashboard" && partenaire) return <Dashboard partenaire={partenaire} onLogout={handleLogout}/>;

  /* ── LANDING ── */
  return (
    <div style={{ minHeight:"100vh", background:"#F0F4F0", fontFamily:"system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#071F15,#0D3B2E,#1B4332)", padding:"2.5rem 1rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-70, right:-70, width:260, height:260, borderRadius:"50%", background:"rgba(240,192,64,.06)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-55, left:-55, width:190, height:190, borderRadius:"50%", background:"rgba(240,192,64,.04)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:640, margin:"0 auto", position:"relative" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.2rem" }}>
            <Link href="/" style={{ color:"rgba(255,255,255,0.5)", fontSize:".79rem", textDecoration:"none" }}>← Retour</Link>
            <button onClick={()=>setMode("login")} style={{ background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.25)", color:"white", fontWeight:700, fontSize:".8rem", padding:".45rem 1rem", borderRadius:"99px", cursor:"pointer" }}>
              🔑 Connexion partenaire
            </button>
          </div>
          <div style={{ display:"inline-block", background:"linear-gradient(135deg,#C9960F,#F0C040)", color:"#3D1C00", fontSize:".66rem", fontWeight:900, letterSpacing:".9px", textTransform:"uppercase", padding:"4px 13px", borderRadius:"99px", marginBottom:".9rem", boxShadow:"0 2px 12px rgba(201,150,15,.45)" }}>
            ✦ PROGRAMME PARTENAIRES
          </div>
          <h1 style={{ fontFamily:"'Sora',sans-serif", color:"white", fontWeight:900, fontSize:"clamp(1.3rem,4vw,1.85rem)", lineHeight:1.25, margin:"0 0 .65rem" }}>
            Rejoignez TalentProof<br/>
            <span style={{ color:"#F0C040" }}>en tant que Partenaire Officiel.</span>
          </h1>
          <p style={{ color:"rgba(210,225,245,.68)", fontSize:".88rem", lineHeight:1.7, marginBottom:"1.5rem" }}>
            Votre école ou entreprise apparaît directement dans le fil de 14 000+ talents africains.
            Badge officiel, statistiques en direct, bouton de contact intégré.
          </p>
          <div style={{ display:"flex", gap:".65rem", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/partenaire" style={{ display:"inline-flex", alignItems:"center", gap:".45rem", background:"linear-gradient(135deg,#C9960F,#F0C040)", color:"#0D3B2E", fontWeight:800, fontSize:".9rem", padding:".78rem 1.75rem", borderRadius:"99px", textDecoration:"none", boxShadow:"0 4px 18px rgba(201,150,15,.42)" }}>
              ✦ Devenir Partenaire
            </Link>
            <button onClick={()=>setMode("login")} style={{ display:"inline-flex", alignItems:"center", gap:".45rem", color:"rgba(255,255,255,.75)", fontWeight:600, fontSize:".88rem", padding:".78rem 1.4rem", borderRadius:"99px", background:"transparent", border:"1.5px solid rgba(255,255,255,.22)", cursor:"pointer" }}>
              🔑 Se connecter
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:840, margin:"0 auto", padding:"1.5rem 1rem" }}>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:".75rem", marginBottom:"1.5rem" }}>
          {[["3","partenaires actifs"],["14 000+","talents dans le fil"],["9 pays","couverts"]].map(([v,l]) => (
            <div key={l} style={{ background:"white", borderRadius:"14px", padding:"1rem .75rem", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:"clamp(1.1rem,3vw,1.4rem)", color:"#1B6B47" }}>{v}</div>
              <div style={{ color:"#888", fontSize:".7rem", marginTop:"3px" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Comment ça marche */}
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.05rem", color:"#111", marginBottom:".85rem" }}>Comment devenir Partenaire ?</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))", gap:".7rem", marginBottom:"1.5rem" }}>
          {ETAPES.map((e,i) => (
            <div key={i} style={{ background:"white", borderRadius:"14px", padding:"1rem", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:".5rem" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#071F15,#1B6B47)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 }}>{e.icon}</div>
                <span style={{ color:"#1B6B47", fontSize:".65rem", fontWeight:800, letterSpacing:".5px" }}>ÉTAPE {e.num}</span>
              </div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:".83rem", color:"#111", marginBottom:".22rem" }}>{e.titre}</div>
              <div style={{ color:"#666", fontSize:".76rem", lineHeight:1.55 }}>{e.desc}</div>
            </div>
          ))}
        </div>

        {/* Offres */}
        <h2 id="offres" style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:"1.05rem", color:"#111", marginBottom:".85rem" }}>Nos offres</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:".85rem", marginBottom:"1.5rem" }}>
          {OFFRES.map((o,i) => (
            <div key={i} style={{ borderRadius:"18px", overflow:"hidden", boxShadow:o.highlight?"0 6px 28px rgba(201,150,15,.3)":"0 2px 8px rgba(0,0,0,.06)", border:o.highlight?`2px solid ${o.couleur}`:"2px solid transparent", display:"flex", flexDirection:"column" }}>
              <div style={{ background:o.bg, padding:"1.1rem 1rem .9rem" }}>
                {o.highlight&&<div style={{ display:"inline-block", background:`${o.couleur}25`, color:o.couleur, border:`1px solid ${o.couleur}55`, fontSize:".6rem", fontWeight:700, padding:"2px 8px", borderRadius:"99px", marginBottom:".4rem" }}>⭐ RECOMMANDÉ</div>}
                <div style={{ fontFamily:"'Sora',sans-serif", color:"white", fontWeight:900, fontSize:".95rem" }}>{o.nom}</div>
                <div style={{ color:o.couleur, fontWeight:800, fontSize:"1.15rem", marginTop:"2px" }}>{o.prix}</div>
              </div>
              <div style={{ background:"white", padding:"1rem", flex:1, display:"flex", flexDirection:"column" }}>
                <ul style={{ paddingLeft:"1rem", margin:"0 0 1rem", display:"flex", flexDirection:"column", gap:".35rem" }}>
                  {o.features.map((f,j)=><li key={j} style={{ color:"#444", fontSize:".78rem", lineHeight:1.5 }}>{f}</li>)}
                </ul>
                <a href={o.ctaHref} target={o.ctaHref.startsWith("http")?"_blank":undefined} rel="noreferrer"
                  style={{ display:"block", textAlign:"center", background:o.highlight?`linear-gradient(135deg,#C9960F,#F0C040)`:`${o.couleur}18`, color:o.highlight?"#0D3B2E":o.couleur, border:o.highlight?"none":`1.5px solid ${o.couleur}55`, fontWeight:700, fontSize:".8rem", padding:".6rem", borderRadius:"99px", textDecoration:"none", marginTop:"auto" }}>
                  {o.cta}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ background:"linear-gradient(135deg,#0B1628,#162F52)", borderRadius:"18px", padding:"1.5rem 1rem", textAlign:"center", marginBottom:"1.5rem" }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, color:"white", fontSize:"1rem", marginBottom:".35rem" }}>Des questions sur le programme ?</div>
          <p style={{ color:"rgba(210,225,245,.65)", fontSize:".82rem", marginBottom:"1rem" }}>Notre équipe te répond directement sur WhatsApp.</p>
          <a href="https://wa.me/2250705503089?text=Bonjour%20TalentProof%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20le%20programme%20partenaires." target="_blank" rel="noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"#25D366", color:"white", fontWeight:800, fontSize:".88rem", padding:".72rem 1.65rem", borderRadius:"99px", textDecoration:"none", boxShadow:"0 4px 18px rgba(37,211,102,.35)" }}>
            <span style={{ fontSize:"1.15rem" }}>💬</span> Nous écrire sur WhatsApp
          </a>
        </div>

        <div style={{ textAlign:"center", color:"#AAA", fontSize:".73rem", paddingBottom:"1.5rem" }}>
          <Link href="/" style={{ color:"#1B6B47", textDecoration:"none", fontWeight:600 }}>← TalentProof</Link>
          {" · "}
          <Link href="/recruteur" style={{ color:"#888", textDecoration:"none" }}>Espace Recruteur</Link>
          {" · "}
          <Link href="/mentions-legales" style={{ color:"#888", textDecoration:"none" }}>Mentions légales</Link>
          {" · "}
          <Link href="/confidentialite" style={{ color:"#888", textDecoration:"none" }}>Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}
