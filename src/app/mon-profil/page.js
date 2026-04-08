"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getTalentByToken, updateInscription } from "@/utils/storage";
import { Upload, Save } from "lucide-react";

function MonProfilContent() {
  const WA_NUM = "2250705503089";
  const EMAIL = "contact@talentproof.africa";
  const searchParams = useSearchParams();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const token = searchParams.get('token');
    const id = searchParams.get('id');
    
    if (token && id) {
      const talentData = getTalentByToken(token, id);
      if (talentData) {
        setTalent(talentData);
        setFormData(talentData);
      }
    }
    setLoading(false);
  }, [searchParams]);

  const handleSave = () => {
    const result = updateInscription('talents', talent.id, formData);
    if (result.success) {
      setTalent(formData);
      setEditing(false);
      alert("✅ Profil mis à jour avec succès !");
    } else {
      alert("❌ Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <div style={{minHeight:"100vh",background:"#F0F4F0",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"3rem",marginBottom:"1rem"}}>⏳</div>
          <div style={{color:"#666",fontSize:"1rem",fontWeight:600}}>Chargement...</div>
        </div>
      </div>
    );
  }

  // Si accès par token valide
  if (talent) {
    return (
      <div style={{minHeight:"100vh",background:"#F0F4F0"}}>
        <header style={{background:"linear-gradient(135deg,#0B1628 0%,#0F2744 60%,#162F52 100%)",borderBottom:"1px solid rgba(240,192,64,.18)",boxShadow:"0 4px 24px rgba(0,0,0,.4)",padding:"1rem"}}>
          <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:".8rem"}}>
            <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.2rem",color:"#ECC94B"}}>TalentProof</div>
            <div style={{display:"flex",gap:".6rem",alignItems:"center"}}>
              <span style={{color:"rgba(255,255,255,.7)",fontSize:".85rem"}}>👤 {talent.prenom} {talent.nom}</span>
              <a href="/" style={{color:"rgba(255,255,255,.7)",fontSize:".85rem",textDecoration:"none",fontWeight:600}}>← Accueil</a>
            </div>
          </div>
        </header>

        <div style={{background:"linear-gradient(135deg,#1B6B47,#2D9A68)",padding:"2rem 1.5rem",textAlign:"center"}}>
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <div style={{fontSize:"3rem",marginBottom:"1rem"}}>
              {talent.photoProfilUrl ? <img src={talent.photoProfilUrl} alt="Profil" style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",border:"3px solid white"}} /> : "👤"}
            </div>
            <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.8rem",fontWeight:800,color:"white",marginBottom:".5rem"}}>{talent.prenom} {talent.nom}</h1>
            <p style={{color:"rgba(255,255,255,.85)",fontSize:"1rem"}}>{talent.metier === "Autre métier" ? talent.autreMetier : talent.metier}</p>
          </div>
        </div>

        <div style={{maxWidth:900,margin:"-2rem auto 4rem",padding:"0 1.5rem"}}>
          <div style={{background:"white",borderRadius:"20px",padding:"2.5rem",boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}>
            {!editing ? (
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2rem"}}>
                  <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#1B6B47",margin:0}}>Mon Profil</h2>
                  <button onClick={() => setEditing(true)} style={{display:"inline-flex",alignItems:"center",gap:".5rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",border:"none",borderRadius:"10px",padding:".7rem 1.3rem",fontSize:".85rem",fontWeight:700,cursor:"pointer"}}>✏️ Modifier</button>
                </div>
                <div style={{fontSize:".9rem",color:"#111",lineHeight:1.8}}>
                  <div><strong>Téléphone:</strong> {talent.telephone}</div>
                  <div><strong>Email:</strong> {talent.email || "Non renseigné"}</div>
                  <div><strong>Ville:</strong> {talent.ville}, {talent.pays}</div>
                  {talent.bio && <div style={{marginTop:"1rem"}}><strong>Bio:</strong> {talent.bio}</div>}
                </div>
              </>
            ) : (
              <>
                <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#1B6B47",marginBottom:"1rem"}}>✏️ Modifier mon profil</h2>
                <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                  <textarea value={formData.bio || ""} onChange={e => setFormData({...formData, bio: e.target.value})} rows={4} placeholder="Présentation" style={{width:"100%",padding:".7rem .9rem",borderRadius:"8px",border:"1.5px solid #E5E7EB",fontSize:".9rem",outline:"none",resize:"vertical",fontFamily:"inherit"}} />
                  <input value={formData.competences || ""} onChange={e => setFormData({...formData, competences: e.target.value})} placeholder="Compétences (séparées par des virgules)" style={{width:"100%",padding:".7rem .9rem",borderRadius:"8px",border:"1.5px solid #E5E7EB",fontSize:".9rem",outline:"none"}} />
                  <div style={{display:"flex",gap:".6rem"}}>
                    <button onClick={() => {setEditing(false); setFormData(talent);}} style={{flex:1,padding:".8rem",borderRadius:"10px",border:"1.5px solid #E5E7EB",background:"white",color:"#666",fontWeight:700,fontSize:".9rem",cursor:"pointer"}}>Annuler</button>
                    <button onClick={handleSave} style={{flex:2,display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem",padding:".8rem",borderRadius:"10px",border:"none",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",color:"white",fontWeight:800,fontSize:".9rem",cursor:"pointer"}}><Save size={18} />Enregistrer</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Page d'accès standard
  return (
    <div style={{minHeight:"100vh",background:"#F0F4F0"}}>
      <header style={{background:"linear-gradient(135deg,#0B1628 0%,#0F2744 60%,#162F52 100%)",borderBottom:"1px solid rgba(240,192,64,.18)",boxShadow:"0 4px 24px rgba(0,0,0,.4)",padding:"1rem"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <a href="/" style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"1.2rem",color:"#ECC94B",textDecoration:"none"}}>TalentProof</a>
          <a href="/" style={{color:"rgba(255,255,255,.7)",fontSize:".85rem",textDecoration:"none",fontWeight:600}}>← Accueil</a>
        </div>
      </header>

      <div style={{background:"linear-gradient(135deg,#1B6B47,#2D9A68)",padding:"3rem 1.5rem 2.5rem",textAlign:"center"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{fontSize:"3rem",marginBottom:"1rem"}}>👤</div>
          <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"2.2rem",fontWeight:800,color:"white",marginBottom:"1rem"}}>Mon Profil TalentProof</h1>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"-2rem auto 4rem",padding:"0 1.5rem"}}>
        <div style={{background:"white",borderRadius:"20px",padding:"2.5rem",boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}>
          <div style={{textAlign:"center",marginBottom:"2rem"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.6rem",fontWeight:800,color:"#1B6B47",marginBottom:".8rem"}}>Accédez à votre profil</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem"}}>
            <a href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent("Bonjour, je souhaite accéder à mon profil TalentProof.")}`} target="_blank" rel="noreferrer" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",background:"linear-gradient(135deg,#25D366,#20BA5A)",color:"white",padding:"2rem 1.5rem",borderRadius:"20px",textDecoration:"none",boxShadow:"0 4px 20px rgba(37,211,102,.3)"}}>
              <div style={{fontSize:"3rem"}}>💬</div>
              <div style={{textAlign:"center"}}>
                <div style={{fontWeight:800,fontSize:"1.2rem",marginBottom:".5rem"}}>Via WhatsApp</div>
                <div style={{fontSize:".9rem",opacity:.9}}>Contactez-nous pour accéder à votre profil</div>
              </div>
            </a>
            <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Accès à mon profil TalentProof")}`} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",color:"white",padding:"2rem 1.5rem",borderRadius:"20px",textDecoration:"none",boxShadow:"0 4px 20px rgba(27,107,71,.3)"}}>
              <div style={{fontSize:"3rem"}}>📧</div>
              <div style={{textAlign:"center"}}>
                <div style={{fontWeight:800,fontSize:"1.2rem",marginBottom:".5rem"}}>Via Email</div>
                <div style={{fontSize:".9rem",opacity:.9}}>Envoyez-nous un email</div>
              </div>
            </a>
          </div>
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
          <div style={{color:"#666",fontSize:"1rem",fontWeight:600}}>Chargement...</div>
        </div>
      </div>
    }>
      <MonProfilContent />
    </Suspense>
  );
}
