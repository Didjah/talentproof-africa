"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { updateTalent, uploadFichier } from "@/services/api";
import { Save, Upload, X } from "lucide-react";

const WA_NUM = "2250705503089";

const inputSt = {
  width:"100%", padding:".65rem .9rem", borderRadius:"8px",
  border:"1.5px solid #E5E7EB", fontSize:".9rem", fontFamily:"inherit",
  outline:"none", boxSizing:"border-box",
};

function MonProfilContent() {
  const [phone, setPhone]           = useState("");
  const [talent, setTalent]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [editing, setEditing]       = useState(false);
  const [searchError, setSearchError] = useState("");
  const [form, setForm]             = useState({});
  const [newPhoto, setNewPhoto]     = useState(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState(null);

  /* ── Recherche par téléphone ── */
  const rechercher = async () => {
    if (!phone.trim()) { setSearchError("Entrez votre numéro de téléphone"); return; }
    setLoading(true);
    setSearchError("");
    try {
      const { data, error } = await supabase
        .from("talents")
        .select("*")
        .eq("telephone", phone.trim())
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        setSearchError("Aucun profil trouvé avec ce numéro. Vérifiez le numéro utilisé lors de votre inscription.");
      } else {
        setTalent(data);
        setForm(data);
      }
    } catch {
      setSearchError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Gestion photo ── */
  const handlePhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setNewPhoto(f);
    setNewPhotoPreview(URL.createObjectURL(f));
  };

  const retirerPhoto = () => {
    setNewPhoto(null);
    if (newPhotoPreview) URL.revokeObjectURL(newPhotoPreview);
    setNewPhotoPreview(null);
  };

  /* ── Sauvegarde ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        bio: form.bio || "",
        competences: form.competences || "",
      };
      if (newPhoto) {
        const chemin = `${Date.now()}-avatar.jpg`;
        updates.avatar_url = await uploadFichier("avatars", newPhoto, chemin);
      }
      const updated = await updateTalent(talent.id, updates);
      setTalent(updated);
      setForm(updated);
      setEditing(false);
      retirerPhoto();
    } catch (e) {
      alert("Erreur : " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const annuler = () => {
    setEditing(false);
    setForm(talent);
    retirerPhoto();
  };

  /* ── Header ── */
  const Header = () => (
    <header style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:"1rem",borderBottom:"1px solid rgba(240,192,64,.18)"}}>
      <div style={{maxWidth:800,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Link href="/" style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.2rem",color:"#ECC94B",textDecoration:"none"}}>TalentProof</Link>
        {talent
          ? <button onClick={() => { setTalent(null); setPhone(""); setEditing(false); }} style={{color:"rgba(255,255,255,.7)",background:"none",border:"none",fontSize:".85rem",cursor:"pointer",fontWeight:600}}>← Changer de compte</button>
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

  /* ── Écran login (aucun talent chargé) ── */
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
                <p style={{color:"#EF4444",fontSize:".78rem",marginTop:".4rem",margin:".4rem 0 0"}}>
                  {searchError}
                </p>
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
  const metier = talent.metier === "Autre métier" ? talent.autreMetier : talent.metier;
  const avatarSrc = newPhotoPreview || talent.avatar_url || null;
  const dispoLabel = {immediate:"✓ Disponible immédiatement","1_month":"📅 Dans 1 mois",negotiable:"💬 À négocier"}[talent.disponibilite] || talent.disponibilite;

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
                  <p style={{fontSize:".85rem",fontWeight:700,color:"#374151",marginBottom:".6rem",margin:"0 0 .6rem"}}>📸 Photo de réalisation</p>
                  <img src={talent.preuve_url} alt="Réalisation" style={{width:"100%",maxHeight:220,objectFit:"cover",borderRadius:"12px",border:"1px solid #E5E7EB"}}/>
                </div>
              )}
            </>
          ) : (
            /* ── Vue édition ── */
            <>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#1B6B47",marginBottom:"1.2rem"}}>✏️ Modifier mon profil</h2>
              <div style={{display:"flex",flexDirection:"column",gap:"1.1rem"}}>

                {/* Photo de profil */}
                <div>
                  <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".5rem"}}>Photo de profil</label>
                  <div style={{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
                    {(newPhotoPreview || talent.avatar_url) && (
                      <img
                        src={newPhotoPreview || talent.avatar_url}
                        alt="Profil"
                        style={{width:60,height:60,borderRadius:"50%",objectFit:"cover",border:"2px solid #D1FAE5"}}
                      />
                    )}
                    <label style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"#F0FDF4",border:"1.5px dashed #1B6B47",borderRadius:"8px",padding:".55rem 1rem",fontSize:".82rem",fontWeight:600,color:"#1B6B47",cursor:"pointer"}}>
                      <Upload size={16}/>
                      {newPhoto ? newPhoto.name : "Changer la photo"}
                      <input type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
                    </label>
                    {newPhoto && (
                      <button onClick={retirerPhoto} style={{background:"none",border:"none",cursor:"pointer",color:"#9CA3AF",display:"flex",alignItems:"center"}}>
                        <X size={18}/>
                      </button>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>Présentation / Bio</label>
                  <textarea
                    value={form.bio || ""}
                    onChange={e => setForm(f => ({...f, bio: e.target.value}))}
                    rows={4}
                    maxLength={300}
                    placeholder="Décrivez votre expérience et vos points forts..."
                    style={{...inputSt, resize:"vertical", lineHeight:1.6}}
                  />
                  <span style={{fontSize:".72rem",color:"#9CA3AF"}}>{(form.bio||"").length}/300</span>
                </div>

                {/* Compétences */}
                <div>
                  <label style={{fontSize:".85rem",fontWeight:700,color:"#374151",display:"block",marginBottom:".4rem"}}>Compétences</label>
                  <input
                    value={form.competences || ""}
                    onChange={e => setForm(f => ({...f, competences: e.target.value}))}
                    placeholder="Ex: Ponctuel, Permis B, Connaissance Abidjan"
                    style={inputSt}
                  />
                  <span style={{fontSize:".72rem",color:"#9CA3AF"}}>Séparées par des virgules</span>
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
