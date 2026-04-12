"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { uploadFichier } from "@/services/api";
import { Save, Upload, X } from "lucide-react";

const WA_NUM = "2250705503089";

const inputSt = {
  width:"100%", padding:".65rem .9rem", borderRadius:"8px",
  border:"1.5px solid #E5E7EB", fontSize:".9rem", fontFamily:"inherit",
  outline:"none", boxSizing:"border-box",
};

const DISPO_OPTIONS = [
  { value:"immediate", label:"Disponible immédiatement" },
  { value:"1_month",   label:"Dans 1 mois" },
  { value:"negotiable",label:"À négocier" },
];
const DISPO_COLOR = { immediate:"#16A34A", "1_month":"#D97706", negotiable:"#6B7280" };
const DISPO_LABEL = { immediate:"Disponible", "1_month":"Dans 1 mois", negotiable:"À négocier" };

const NIVEAU_OPTIONS = [
  "Sans niveau d'étude","Niveau CM2","Niveau 3ème","Brevet","Bac","Bac+2","Bac+3","Bac+5 et plus",
];

const METIERS = [
  "Chauffeur VTC","Chauffeur camion","Chauffeur particulier",
  "Mécanicien","Électricien","Plombier","Maçon","Peintre en bâtiment","Carreleur",
  "Couturier / Tailleur","Coiffeur / Coiffeuse","Esthéticienne",
  "Cuisinier / Chef","Aide ménagère","Gardien / Vigile",
  "Informaticien","Comptable","Secrétaire","Commercial","Autre métier",
];

const TYPE_STYLE = {
  expert:   { label:"Expert",   bg:"#1D4ED8" },
  pratique: { label:"Pratique", bg:"#D97706" },
  simple:   { label:"Simple",   bg:"#6B7280" },
};

/* ── Aperçu carte annuaire ── */
function ApercuCarte({ t }) {
  const metier = t.metier || "Non spécifié";
  const tags = (t.competences || "").split(",").map(c => c.trim()).filter(Boolean).slice(0, 3);
  const ts = TYPE_STYLE[t.typeProfile] || TYPE_STYLE.simple;
  const dispo = t.disponibilite || "negotiable";
  const GRAD = {
    expert:   "linear-gradient(135deg,#0B1628,#1A3560)",
    pratique: "linear-gradient(135deg,#1A1000,#3D2800)",
    simple:   "linear-gradient(135deg,#071F15,#1B6B47)",
  }[t.typeProfile] || "linear-gradient(135deg,#071F15,#1B6B47)";

  return (
    <div style={{background:"white",borderRadius:"18px",overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,.08)",maxWidth:340,margin:"0 auto"}}>
      {/* Bannière */}
      <div style={{height:80,background:GRAD,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:"2.2rem"}}>👤</span>
        <div style={{position:"absolute",top:".45rem",left:".5rem"}}>
          <span style={{background:ts.bg,color:"white",fontSize:".56rem",fontWeight:700,padding:"2px 8px",borderRadius:"99px"}}>{ts.label}</span>
        </div>
        {t.has_video && (
          <div style={{position:"absolute",top:".45rem",right:".5rem"}}>
            <span style={{background:"rgba(93,33,211,.9)",color:"white",fontSize:".56rem",fontWeight:700,padding:"2px 8px",borderRadius:"99px"}}>▶ Vidéo</span>
          </div>
        )}
        {t.has_photo && (
          <div style={{position:"absolute",top: t.has_video ? "1.7rem" : ".45rem",right:".5rem"}}>
            <span style={{background:"rgba(15,118,110,.9)",color:"white",fontSize:".56rem",fontWeight:700,padding:"2px 8px",borderRadius:"99px"}}>📸 Photo</span>
          </div>
        )}
      </div>
      {/* Corps */}
      <div style={{padding:".85rem .9rem .95rem"}}>
        <div style={{display:"flex",gap:".5rem",alignItems:"flex-start",marginBottom:".3rem"}}>
          {t.avatar_url
            ? <img src={t.avatar_url} alt="profil" style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",border:"2px solid #E5E7EB",flexShrink:0}}/>
            : <div style={{width:44,height:44,borderRadius:"50%",background:"#E5E7EB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>👤</div>
          }
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:".25rem",flexWrap:"wrap"}}>
              <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".88rem",color:"#111"}}>{t.prenom} {t.nom}</span>
              {t.verified && <span style={{background:"#EFF6FF",color:"#1D4ED8",fontSize:".58rem",fontWeight:700,padding:"1px 5px",borderRadius:"99px"}}>✔ Vérifié</span>}
            </div>
            <div style={{color:"#1B6B47",fontWeight:700,fontSize:".75rem",marginTop:"1px"}}>{metier} · {t.experience || "—"}</div>
            <div style={{color:"#9CA3AF",fontSize:".7rem"}}>📍 {t.ville || "—"}, {t.pays || "—"}</div>
          </div>
          <span style={{fontSize:".62rem",fontWeight:700,color:DISPO_COLOR[dispo],flexShrink:0,display:"flex",alignItems:"center",gap:2}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:DISPO_COLOR[dispo],display:"inline-block"}}/>
            {DISPO_LABEL[dispo]}
          </span>
        </div>
        {t.bio && (
          <p style={{color:"#555",fontSize:".76rem",lineHeight:1.55,margin:".3rem 0 .45rem",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
            {t.bio}
          </p>
        )}
        {tags.length > 0 && (
          <div style={{display:"flex",gap:".22rem",flexWrap:"wrap"}}>
            {tags.map(tag => (
              <span key={tag} style={{background:"#F0FDF4",color:"#166534",fontSize:".63rem",fontWeight:600,padding:"1px 6px",borderRadius:"99px",border:"1px solid #D1FAE5"}}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MonProfilContent() {
  const [phone, setPhone]                   = useState("");
  const [talent, setTalent]                 = useState(null);
  const [loading, setLoading]               = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [editing, setEditing]               = useState(false);
  const [searchError, setSearchError]       = useState("");
  const [form, setForm]                     = useState({});
  const [saveOk, setSaveOk]                 = useState(false);

  // Photo profil
  const [newAvatar, setNewAvatar]           = useState(null);
  const [newAvatarPreview, setNewAvatarPreview] = useState(null);

  // Photo preuve
  const [newPreuve, setNewPreuve]           = useState(null);
  const [newPreuvePreview, setNewPreuvePreview] = useState(null);
  const [deletePreuve, setDeletePreuve]     = useState(false);

  // PIN
  const [pendingProfil, setPendingProfil]   = useState(null);
  const [pinStep, setPinStep]               = useState(false);
  const [pinInput, setPinInput]             = useState("");
  const [pinError, setPinError]             = useState("");

  /* ── Recherche par téléphone ── */
  /* ── Génère les variantes d'un numéro (+225, 225, 0…) ── */
  const variantesTel = (input) => {
    const t = input.replace(/[\s\-\.]/g, "");
    let local;
    if (t.startsWith("+225")) local = t.slice(4);
    else if (t.startsWith("225") && t.length >= 12) local = t.slice(3);
    else local = t;
    const avecZero = local.startsWith("0") ? local : "0" + local;
    const sansZero = local.startsWith("0") ? local.slice(1) : local;
    return [...new Set([
      "+225" + avecZero,
      "225"  + avecZero,
      avecZero,
      "+225" + sansZero,
      "225"  + sansZero,
      sansZero,
    ])];
  };

  const rechercher = async () => {
    if (!phone.trim()) { setSearchError("Entrez votre numéro de téléphone"); return; }
    setLoading(true);
    setSearchError("");
    try {
      const variantes = variantesTel(phone.trim());
      const orClause = variantes.map(v => `telephone.eq.${v}`).join(",");
      const { data, error } = await supabase
        .from("talents")
        .select("*")
        .or(orClause)
        .limit(1);
      if (error) throw error;
      const profil = data?.[0] || null;
      if (!profil) {
        setSearchError("Aucun profil trouvé avec ce numéro. Vérifiez le numéro utilisé lors de votre inscription.");
      } else if (profil.pin_code) {
        setPendingProfil(profil);
        setPinStep(true);
        setPinInput("");
        setPinError("");
      } else {
        setTalent(profil);
        setForm(profil);
        try { localStorage.setItem("tp_talent", JSON.stringify({ id: profil.id, telephone: profil.telephone })); } catch {}
      }
    } catch {
      setSearchError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const validerPin = () => {
    if (pinInput === pendingProfil.pin_code) {
      setTalent(pendingProfil);
      setForm(pendingProfil);
      try { localStorage.setItem("tp_talent", JSON.stringify({ id: pendingProfil.id, telephone: pendingProfil.telephone })); } catch {}
      setPinStep(false);
      setPendingProfil(null);
      setPinInput("");
    } else {
      setPinError("Code PIN incorrect. Réessayez.");
      setPinInput("");
    }
  };

  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  /* ── Gestion photo profil ── */
  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewAvatar(file);
    setNewAvatarPreview(URL.createObjectURL(file));
  };
  const retirerAvatar = () => {
    setNewAvatar(null);
    if (newAvatarPreview) URL.revokeObjectURL(newAvatarPreview);
    setNewAvatarPreview(null);
  };

  /* ── Gestion photo preuve ── */
  const handlePreuve = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPreuve(file);
    setNewPreuvePreview(URL.createObjectURL(file));
    setDeletePreuve(false);
  };
  const retirerPreuve = () => {
    setNewPreuve(null);
    if (newPreuvePreview) URL.revokeObjectURL(newPreuvePreview);
    setNewPreuvePreview(null);
  };
  const supprimerPreuve = () => {
    retirerPreuve();
    setDeletePreuve(true);
  };

  /* ── Sauvegarde ── */
  const handleSave = async () => {
    // Garde de sécurité : l'utilisateur doit être authentifié
    if (!talent || !phone.trim()) {
      setTalent(null);
      setSaving(false);
      return;
    }
    setSaving(true);
    setSaveOk(false);
    try {
      // Validation PIN si modifié
      if (form._newPin && !/^\d{4}$/.test(form._newPin)) {
        alert("Le PIN doit contenir exactement 4 chiffres.");
        setSaving(false);
        return;
      }
      if (form._newPin && form._newPin !== form._newPinConfirm) {
        alert("Les PIN ne correspondent pas.");
        setSaving(false);
        return;
      }

      const updates = {
        prenom:       form.prenom       || "",
        nom:          form.nom          || "",
        metier:       form.metier       || "",
        ville:        form.ville        || "",
        pays:         form.pays         || "",
        bio:          form.bio          || "",
        competences:  form.competences  || "",
        disponibilite:form.disponibilite|| "negotiable",
        experience:   form.experience   || "",
        niveau_etude: form.niveau_etude || null,
      };
      if (form._newPin && form._newPin === form._newPinConfirm) {
        updates.pin_code = form._newPin;
      }

      // Upload avatar si changé
      if (newAvatar) {
        const chemin = `${Date.now()}-avatar.jpg`;
        updates.avatar_url = await uploadFichier("avatars", newAvatar, chemin);
      }

      // Photo preuve
      if (deletePreuve) {
        updates.preuve_url = null;
        updates.has_photo  = false;
      } else if (newPreuve) {
        const chemin = `${Date.now()}-preuve.jpg`;
        updates.preuve_url = await uploadFichier("preuves", newPreuve, chemin);
        updates.has_photo  = true;
      }

      const { data, error } = await supabase
        .from("talents")
        .update(updates)
        .eq("telephone", phone.trim())
        .select()
        .single();
      if (error) throw error;

      setTalent(data);
      setForm(data);
      try { localStorage.setItem("tp_talent", JSON.stringify({ id: data.id, telephone: data.telephone })); } catch {}
      setEditing(false);
      retirerAvatar();
      retirerPreuve();
      setDeletePreuve(false);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (e) {
      alert("Erreur : " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const annuler = () => {
    setEditing(false);
    const { _newPin: _, _newPinConfirm: __, ...clean } = form;
    setForm({ ...talent, ...clean, _newPin: "", _newPinConfirm: "" });
    retirerAvatar();
    retirerPreuve();
    setDeletePreuve(false);
  };

  /* ── Header ── */
  const Header = () => (
    <header style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:"1rem",borderBottom:"1px solid rgba(240,192,64,.18)"}}>
      <div style={{maxWidth:800,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Link href="/" style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.2rem",color:"#ECC94B",textDecoration:"none"}}>TalentProof</Link>
        {talent
          ? <button onClick={() => { setTalent(null); setPhone(""); setEditing(false); setSaveOk(false); try { localStorage.removeItem("tp_talent"); } catch {} }} style={{color:"rgba(255,255,255,.7)",background:"none",border:"none",fontSize:".85rem",cursor:"pointer",fontWeight:600}}>← Changer de compte</button>
          : <Link href="/" style={{color:"rgba(255,255,255,.7)",fontSize:".85rem",textDecoration:"none",fontWeight:600}}>← Accueil</Link>
        }
      </div>
    </header>
  );

  /* ── Chargement ── */
  if (loading) return (
    <div style={{minHeight:"100vh",background:"#F0F4F0",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:"1rem"}}>⏳</div>
        <div style={{color:"#666",fontWeight:600}}>Chargement...</div>
      </div>
    </div>
  );

  /* ── Écran PIN ── */
  if (pinStep && pendingProfil) return (
    <div style={{minHeight:"100vh",background:"#F0F4F0"}}>
      <Header/>
      <div style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:"3rem 1.5rem 2.5rem",textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:"1rem"}}>🔐</div>
        <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.8rem",fontWeight:800,color:"white",marginBottom:".5rem"}}>Code PIN requis</h1>
        <p style={{color:"rgba(255,255,255,.7)",fontSize:".9rem",margin:0}}>Ce profil est protégé par un code PIN</p>
      </div>
      <div style={{maxWidth:400,margin:"-2rem auto 4rem",padding:"0 1.5rem"}}>
        <div style={{background:"white",borderRadius:"20px",padding:"2rem",boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}>
          <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
            <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".95rem",color:"#111",marginBottom:".3rem"}}>
              {pendingProfil.prenom} {pendingProfil.nom}
            </div>
            <div style={{color:"#9CA3AF",fontSize:".8rem"}}>{pendingProfil.metier || ""}</div>
          </div>
          <div style={{marginBottom:"1.2rem"}}>
            <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".5rem"}}>Entrez votre code PIN (4 chiffres)</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinInput}
              onChange={e => { setPinInput(e.target.value.replace(/\D/g,"").slice(0,4)); setPinError(""); }}
              onKeyDown={e => e.key === "Enter" && validerPin()}
              placeholder="●●●●"
              autoFocus
              style={{...inputSt, textAlign:"center", fontSize:"1.5rem", letterSpacing:".4em", borderColor: pinError ? "#EF4444" : "#E5E7EB"}}
            />
            {pinError && <p style={{color:"#EF4444",fontSize:".78rem",margin:".4rem 0 0"}}>{pinError}</p>}
          </div>
          <button
            onClick={validerPin}
            style={{width:"100%",padding:".85rem",borderRadius:"10px",border:"none",background:"linear-gradient(135deg,#0B1628,#162F52)",color:"white",fontWeight:800,fontSize:".95rem",cursor:"pointer"}}
          >
            Accéder à mon profil →
          </button>
          <button
            onClick={() => { setPinStep(false); setPendingProfil(null); setPinInput(""); setPinError(""); }}
            style={{width:"100%",padding:".6rem",marginTop:".7rem",background:"none",border:"none",color:"#9CA3AF",fontSize:".82rem",cursor:"pointer",fontWeight:600}}
          >
            ← Retour
          </button>
        </div>
      </div>
    </div>
  );

  /* ── Écran login ── */
  if (!talent) return (
    <div style={{minHeight:"100vh",background:"#F0F4F0"}}>
      <Header/>
      <div style={{background:"linear-gradient(135deg,#1B6B47,#2D9A68)",padding:"3rem 1.5rem 2.5rem",textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:"1rem"}}>👤</div>
        <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"2rem",fontWeight:800,color:"white",marginBottom:".5rem"}}>Mon Profil TalentProof</h1>
        <p style={{color:"rgba(255,255,255,.8)",fontSize:"1rem",margin:0}}>Accédez à votre profil avec votre numéro de téléphone</p>
      </div>
      <div style={{maxWidth:480,margin:"-2rem auto 4rem",padding:"0 1.5rem"}}>
        <div style={{background:"white",borderRadius:"20px",padding:"2.5rem",boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}>
          <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#111",marginBottom:"1.5rem",textAlign:"center"}}>
            Retrouvez votre profil
          </h2>
          <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div>
              <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>
                Numéro de téléphone / WhatsApp
              </label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === "Enter" && rechercher()}
                placeholder="+225 07 05 50 30 89"
                type="tel"
                style={{...inputSt, borderColor: searchError ? "#EF4444" : "#E5E7EB"}}
              />
              {searchError && (
                <p style={{color:"#EF4444",fontSize:".78rem",margin:".4rem 0 0"}}>{searchError}</p>
              )}
            </div>
            <button
              onClick={rechercher}
              style={{width:"100%",padding:".85rem",borderRadius:"10px",border:"none",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",color:"white",fontWeight:800,fontSize:".95rem",cursor:"pointer"}}
            >
              Accéder à mon profil →
            </button>
            <p style={{textAlign:"center",color:"#9CA3AF",fontSize:".78rem",margin:0}}>
              Utilisez le numéro renseigné lors de votre inscription
            </p>
          </div>
          <div style={{marginTop:"2rem",padding:"1.2rem",background:"#F0FDF4",borderRadius:"12px",border:"1px solid #D1FAE5",textAlign:"center"}}>
            <p style={{color:"#1B6B47",fontSize:".82rem",margin:0,lineHeight:1.6}}>
              Profil introuvable ?{" "}
              <a
                href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent("Bonjour, je n'arrive pas à accéder à mon profil TalentProof.")}`}
                target="_blank" rel="noreferrer"
                style={{color:"#1B6B47",fontWeight:700}}
              >
                Contactez-nous sur WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Profil chargé ── */
  const metier = talent.metier === "Autre métier" ? (talent.autreMetier || talent.metier) : talent.metier;
  const avatarSrc = newAvatarPreview || talent.avatar_url || null;
  const dispoLabel = {immediate:"✓ Disponible immédiatement","1_month":"📅 Dans 1 mois",negotiable:"💬 À négocier"}[talent.disponibilite] || talent.disponibilite;

  // Données aperçu carte (fusionnées avec les modifs en cours si édition)
  const aperçuData = editing
    ? { ...talent, ...form, avatar_url: newAvatarPreview || form.avatar_url || talent.avatar_url,
        preuve_url: deletePreuve ? null : (newPreuvePreview || form.preuve_url || talent.preuve_url),
        has_photo: deletePreuve ? false : !!(newPreuvePreview || form.preuve_url || talent.preuve_url) }
    : talent;

  return (
    <div style={{minHeight:"100vh",background:"#F0F4F0"}}>
      <Header/>

      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,#1B6B47,#2D9A68)",padding:"2rem 1.5rem",textAlign:"center"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{marginBottom:"1rem"}}>
            {avatarSrc
              ? <img src={avatarSrc} alt="Profil" style={{width:90,height:90,borderRadius:"50%",objectFit:"cover",border:"3px solid white",boxShadow:"0 4px 16px rgba(0,0,0,.2)"}}/>
              : <div style={{width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"2.8rem",border:"3px solid white"}}>👤</div>
            }
          </div>
          <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.8rem",fontWeight:800,color:"white",marginBottom:".3rem"}}>
            {talent.prenom} {talent.nom}
          </h1>
          <p style={{color:"rgba(255,255,255,.85)",fontSize:"1rem",margin:".2rem 0 0"}}>{metier}</p>
          {talent.ville && <p style={{color:"rgba(255,255,255,.7)",fontSize:".88rem",margin:".3rem 0 0"}}>📍 {talent.ville}, {talent.pays}</p>}
        </div>
      </div>

      <div style={{maxWidth:700,margin:"-2rem auto 4rem",padding:"0 1.5rem"}}>

        {/* Notification de succès */}
        {saveOk && (
          <div style={{background:"#F0FDF4",border:"1px solid #D1FAE5",borderRadius:"12px",padding:".9rem 1.2rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:".6rem",color:"#1B6B47",fontWeight:700,fontSize:".88rem"}}>
            ✅ Profil mis à jour avec succès !
          </div>
        )}

        <div style={{background:"white",borderRadius:"20px",padding:"2rem",boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}>

          {!editing ? (
            /* ── Vue consultation ── */
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#1B6B47",margin:0}}>Mon Profil</h2>
                <button onClick={() => setEditing(true)} style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",border:"none",borderRadius:"8px",padding:".6rem 1.1rem",fontSize:".85rem",fontWeight:700,cursor:"pointer"}}>
                  ✏️ Modifier
                </button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:".65rem",fontSize:".9rem",color:"#111",lineHeight:1.7}}>
                <div><strong>Téléphone :</strong> {talent.telephone}</div>
                {talent.email && <div><strong>Email :</strong> {talent.email}</div>}
                {talent.ville && <div><strong>Localisation :</strong> {talent.ville}, {talent.pays}</div>}
                <div><strong>Métier :</strong> {metier}</div>
                {talent.experience && <div><strong>Expérience :</strong> {talent.experience}</div>}
                {talent.niveau_etude && <div><strong>Niveau d'étude :</strong> {talent.niveau_etude}</div>}
                {talent.disponibilite && <div><strong>Disponibilité :</strong> {dispoLabel}</div>}
                {talent.competences && <div><strong>Compétences :</strong> {talent.competences}</div>}
                {talent.bio && (
                  <div style={{marginTop:".4rem",padding:"1rem",background:"#F9FAFB",borderRadius:"10px",border:"1px solid #E5E7EB"}}>
                    <strong>Bio :</strong><br/>{talent.bio}
                  </div>
                )}
              </div>
              {talent.preuve_url && (
                <div style={{marginTop:"1.5rem"}}>
                  <p style={{fontSize:".85rem",fontWeight:700,color:"#374151",margin:"0 0 .6rem"}}>📸 Photo de réalisation</p>
                  <img src={talent.preuve_url} alt="Réalisation" style={{width:"100%",maxHeight:220,objectFit:"cover",borderRadius:"12px",border:"1px solid #E5E7EB"}}/>
                </div>
              )}
            </>
          ) : (
            /* ── Vue édition ── */
            <>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#1B6B47",marginBottom:"1.2rem"}}>✏️ Modifier mon profil</h2>
              <div style={{display:"flex",flexDirection:"column",gap:"1.1rem"}}>

                {/* Identité */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".8rem"}}>
                  <div>
                    <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>Prénom</label>
                    <input value={form.prenom||""} onChange={e=>f("prenom",e.target.value)} style={inputSt}/>
                  </div>
                  <div>
                    <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>Nom</label>
                    <input value={form.nom||""} onChange={e=>f("nom",e.target.value)} style={inputSt}/>
                  </div>
                </div>

                {/* Métier */}
                <div>
                  <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>Métier</label>
                  <select value={form.metier||""} onChange={e=>f("metier",e.target.value)} style={{...inputSt,background:"white"}}>
                    <option value="">-- Choisir --</option>
                    {METIERS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {form.metier === "Autre métier" && (
                    <input
                      value={form.autreMetier||""}
                      onChange={e=>f("autreMetier",e.target.value)}
                      placeholder="Précisez votre métier"
                      style={{...inputSt,marginTop:".5rem"}}
                    />
                  )}
                </div>

                {/* Localisation */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".8rem"}}>
                  <div>
                    <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>Ville</label>
                    <input value={form.ville||""} onChange={e=>f("ville",e.target.value)} placeholder="Ex: Abidjan" style={inputSt}/>
                  </div>
                  <div>
                    <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>Pays</label>
                    <input value={form.pays||""} onChange={e=>f("pays",e.target.value)} placeholder="Ex: Côte d'Ivoire" style={inputSt}/>
                  </div>
                </div>

                {/* Expérience + Disponibilité */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".8rem"}}>
                  <div>
                    <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>Expérience</label>
                    <input value={form.experience||""} onChange={e=>f("experience",e.target.value)} placeholder="Ex: 5 ans" style={inputSt}/>
                  </div>
                  <div>
                    <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>Disponibilité</label>
                    <select value={form.disponibilite||"negotiable"} onChange={e=>f("disponibilite",e.target.value)} style={{...inputSt,background:"white"}}>
                      {DISPO_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Niveau d'étude */}
                <div>
                  <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>Niveau d'étude</label>
                  <select value={form.niveau_etude||""} onChange={e=>f("niveau_etude",e.target.value||null)} style={{...inputSt,background:"white"}}>
                    <option value="">-- Non renseigné --</option>
                    {NIVEAU_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {/* Bio */}
                <div>
                  <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>Présentation / Bio</label>
                  <textarea
                    value={form.bio||""}
                    onChange={e=>f("bio",e.target.value)}
                    rows={4}
                    maxLength={300}
                    placeholder="Décrivez votre expérience et vos points forts..."
                    style={{...inputSt,resize:"vertical",lineHeight:1.6}}
                  />
                  <span style={{fontSize:".72rem",color:"#9CA3AF"}}>{(form.bio||"").length}/300</span>
                </div>

                {/* Compétences */}
                <div>
                  <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>Compétences</label>
                  <input
                    value={form.competences||""}
                    onChange={e=>f("competences",e.target.value)}
                    placeholder="Ex: Ponctuel, Permis B, Connaissance Abidjan"
                    style={inputSt}
                  />
                  <span style={{fontSize:".72rem",color:"#9CA3AF"}}>Séparées par des virgules</span>
                </div>

                {/* Photo de profil */}
                <div>
                  <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".5rem"}}>Photo de profil</label>
                  <div style={{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
                    {(newAvatarPreview || talent.avatar_url) && (
                      <img src={newAvatarPreview||talent.avatar_url} alt="Profil" style={{width:56,height:56,borderRadius:"50%",objectFit:"cover",border:"2px solid #D1FAE5"}}/>
                    )}
                    <label style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"#F0FDF4",border:"1.5px dashed #1B6B47",borderRadius:"8px",padding:".5rem .9rem",fontSize:".82rem",fontWeight:600,color:"#1B6B47",cursor:"pointer"}}>
                      <Upload size={15}/>
                      {newAvatar ? newAvatar.name : "Changer la photo"}
                      <input type="file" accept="image/*" onChange={handleAvatar} style={{display:"none"}}/>
                    </label>
                    {newAvatar && (
                      <button onClick={retirerAvatar} style={{background:"none",border:"none",cursor:"pointer",color:"#9CA3AF",display:"flex",alignItems:"center"}}><X size={17}/></button>
                    )}
                  </div>
                </div>

                {/* Photo de réalisation (preuve) */}
                <div>
                  <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".5rem"}}>📸 Photo de réalisation</label>

                  {/* Aperçu actuel ou nouveau */}
                  {!deletePreuve && (newPreuvePreview || talent.preuve_url) && (
                    <div style={{position:"relative",marginBottom:".6rem",display:"inline-block"}}>
                      <img
                        src={newPreuvePreview||talent.preuve_url}
                        alt="Réalisation"
                        style={{width:"100%",maxHeight:180,objectFit:"cover",borderRadius:"10px",border:"1px solid #E5E7EB",display:"block"}}
                      />
                      <button
                        onClick={supprimerPreuve}
                        style={{position:"absolute",top:6,right:6,background:"rgba(239,68,68,.9)",border:"none",borderRadius:"50%",width:28,height:28,color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
                      ><X size={14}/></button>
                    </div>
                  )}

                  {deletePreuve && (
                    <p style={{color:"#EF4444",fontSize:".78rem",margin:"0 0 .5rem",fontWeight:600}}>⚠️ Photo supprimée (sera retirée à l'enregistrement)</p>
                  )}

                  <div style={{display:"flex",gap:".6rem",flexWrap:"wrap"}}>
                    <label style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"#F0FDF4",border:"1.5px dashed #1B6B47",borderRadius:"8px",padding:".5rem .9rem",fontSize:".82rem",fontWeight:600,color:"#1B6B47",cursor:"pointer"}}>
                      <Upload size={15}/>
                      {newPreuve ? newPreuve.name : (deletePreuve ? "Ajouter une photo" : "Changer la photo")}
                      <input type="file" accept="image/*" onChange={handlePreuve} style={{display:"none"}}/>
                    </label>
                    {newPreuve && (
                      <button onClick={retirerPreuve} style={{background:"none",border:"none",cursor:"pointer",color:"#9CA3AF",display:"flex",alignItems:"center"}}><X size={17}/></button>
                    )}
                  </div>
                  <span style={{fontSize:".72rem",color:"#9CA3AF",display:"block",marginTop:".3rem"}}>Photo d'un de vos travaux ou réalisations</span>
                </div>

                {/* ── Section Sécurité ── */}
                <div style={{padding:"1rem",background:"#F9FAFB",borderRadius:"12px",border:"1px solid #E5E7EB"}}>
                  <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".88rem",color:"#374151",marginBottom:"1rem"}}>🔐 Sécurité</div>

                  {/* PIN */}
                  <div style={{marginBottom:".9rem"}}>
                    <label style={{fontSize:".82rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>
                      {talent.pin_code ? "Modifier le code PIN" : "Définir un code PIN (4 chiffres)"}
                    </label>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".5rem"}}>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={form._newPin || ""}
                        onChange={e => f("_newPin", e.target.value.replace(/\D/g,"").slice(0,4))}
                        placeholder="Nouveau PIN"
                        style={{...inputSt,textAlign:"center",letterSpacing:".25em"}}
                      />
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={form._newPinConfirm || ""}
                        onChange={e => f("_newPinConfirm", e.target.value.replace(/\D/g,"").slice(0,4))}
                        placeholder="Confirmer"
                        style={{...inputSt,textAlign:"center",letterSpacing:".25em"}}
                      />
                    </div>
                    {talent.pin_code && <p style={{color:"#9CA3AF",fontSize:".72rem",margin:".3rem 0 0"}}>Laissez vide pour conserver le PIN actuel</p>}
                  </div>

                  {/* Email récupération */}
                  {talent.email && (
                    <div style={{marginBottom:".7rem",fontSize:".82rem",color:"#6B7280"}}>
                      <span style={{fontWeight:700}}>📧 Email :</span> {talent.email}
                    </div>
                  )}

                  {/* WhatsApp récupération */}
                  {talent.telephone && (
                    <div style={{fontSize:".82rem",color:"#6B7280"}}>
                      <span style={{fontWeight:700}}>📱 WhatsApp :</span> {talent.telephone}
                    </div>
                  )}
                </div>

                {/* Boutons */}
                <div style={{display:"flex",gap:".6rem",marginTop:".3rem"}}>
                  <button
                    onClick={annuler}
                    style={{flex:1,padding:".75rem",borderRadius:"10px",border:"1.5px solid #E5E7EB",background:"white",color:"#666",fontWeight:700,fontSize:".9rem",cursor:"pointer"}}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{flex:2,display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem",padding:".75rem",borderRadius:"10px",border:"none",background:saving?"#E5E7EB":"linear-gradient(135deg,#1B6B47,#2D9A68)",color:saving?"#9CA3AF":"white",fontWeight:800,fontSize:".9rem",cursor:saving?"not-allowed":"pointer"}}
                  >
                    <Save size={18}/>{saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Aperçu carte annuaire ── */}
        <div style={{background:"white",borderRadius:"20px",padding:"1.5rem 2rem",boxShadow:"0 8px 32px rgba(0,0,0,.12)",marginTop:"1.2rem"}}>
          <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:"1rem",fontWeight:800,color:"#374151",margin:"0 0 1rem",display:"flex",alignItems:"center",gap:".4rem"}}>
            👁️ Aperçu dans l'annuaire
          </h3>
          <ApercuCarte t={aperçuData}/>
        </div>

        <div style={{marginTop:"1rem",textAlign:"center"}}>
          <Link href={`/annuaire/${talent.id}`} style={{color:"#1B6B47",fontSize:".85rem",fontWeight:600,textDecoration:"none"}}>
            Voir mon profil public →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MonProfilPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:"100vh",background:"#F0F4F0",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"3rem",marginBottom:"1rem"}}>⏳</div>
          <div style={{color:"#666",fontWeight:600}}>Chargement...</div>
        </div>
      </div>
    }>
      <MonProfilContent/>
    </Suspense>
  );
}
