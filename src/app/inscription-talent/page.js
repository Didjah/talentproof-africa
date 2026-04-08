"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, Mic, Play, Square, RotateCcw, X } from "lucide-react";
import { saveInscription } from "@/utils/storage";

const WA_NUM1 = "2250705503089";

const METIERS = [
  "Chauffeur", "Livreur", "Coursier",
  "Couturière", "Couturier", "Tailleur",
  "Mécanicien", "Électricien", "Plombier", "Soudeur", "Maçon",
  "Aide ménagère", "Personnel de maison", "Nounou", "Garde d'enfants",
  "Gardien", "Vigile", "Agent de sécurité",
  "Jardinier", "Paysagiste",
  "Cuisinier", "Cuisinière", "Pâtissier",
  "Vendeur", "Vendeuse", "Commerçant",
  "Coiffeur", "Coiffeuse", "Esthéticienne",
  "Développeur", "Graphiste", "Community Manager",
  "Autre métier"
];

const NIVEAUX = [
  "Débutant (moins de 1 an)",
  "Intermédiaire (1-3 ans)",
  "Confirmé (3-5 ans)",
  "Expert (5-10 ans)",
  "Maître (plus de 10 ans)"
];

const DISPONIBILITES = [
  { id:"immediate", label:"Disponible immédiatement", color:"#16A34A" },
  { id:"1_month", label:"Disponible dans 1 mois", color:"#D97706" },
  { id:"negotiable", label:"À négocier", color:"#6B7280" }
];

const NIVEAUX_ETUDE = [
  "Aucun",
  "Primaire",
  "Collège",
  "Lycée",
  "Université"
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

function Champ({ label, required, error, children, hint }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:".28rem"}}>
      <label style={{fontSize:".82rem",fontWeight:700,color:"#374151"}}>
        {label}{required&&<span style={{color:"#EF4444",marginLeft:2}}>*</span>}
      </label>
      {children}
      {hint&&<span style={{color:"#9CA3AF",fontSize:".72rem"}}>{hint}</span>}
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

// Enregistreur vocal simplifié
function VoiceRecorder({ onRecorded }) {
  const [phase, setPhase] = useState("idle"); // idle, recording, preview
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const MAX_SEC = 60;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      
      const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg"].find(t => 
        MediaRecorder.isTypeSupported(t)
      ) || "";
      
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      recorderRef.current = recorder;
      
      recorder.ondataavailable = (e) => {
        if (e.data?.size > 0) chunksRef.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setPhase("preview");
        streamRef.current?.getTracks().forEach(t => t.stop());
      };
      
      recorder.start(100);
      setPhase("recording");
      setElapsed(0);
      
      timerRef.current = setInterval(() => {
        setElapsed(n => {
          if (n + 1 >= MAX_SEC) {
            stopRecording();
            return MAX_SEC;
          }
          return n + 1;
        });
      }, 1000);
    } catch (err) {
      alert("Impossible d'accéder au microphone. Vérifiez les autorisations.");
      setPhase("idle");
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  };

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setElapsed(0);
    setPhase("idle");
  };

  const confirm = () => {
    onRecorded(audioUrl);
  };

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{background:"rgba(240,192,64,.08)",border:"1.5px solid rgba(240,192,64,.25)",borderRadius:"14px",padding:"1.2rem",textAlign:"center"}}>
      {phase === "idle" && (
        <>
          <p style={{color:"#666",fontSize:".82rem",marginBottom:"1rem",lineHeight:1.6}}>
            Présentez-vous en 60 secondes : votre métier, votre expérience, vos compétences.
          </p>
          <button onClick={startRecording} style={{width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,#C9960F,#F0C040)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",boxShadow:"0 4px 18px rgba(201,150,15,.42)",transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <Mic size={32} color="#0D3B2E" strokeWidth={2.5}/>
          </button>
          <p style={{color:"#9CA3AF",fontSize:".72rem",marginTop:".6rem"}}>Appuyez pour commencer</p>
        </>
      )}
      
      {phase === "recording" && (
        <>
          <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,color:"#111",fontSize:"1.8rem",marginBottom:".5rem"}}>{formatTime(elapsed)}</div>
          <div style={{background:"#E5E7EB",borderRadius:"99px",height:6,marginBottom:"1rem",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(elapsed/MAX_SEC)*100}%`,background:"linear-gradient(90deg,#F0C040,#C9960F)",borderRadius:"99px",transition:"width .9s linear"}}/>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",marginBottom:"1rem"}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:"#EF4444",animation:"blink 1s infinite"}}/>
            <span style={{color:"#EF4444",fontSize:".82rem",fontWeight:700}}>Enregistrement en cours</span>
          </div>
          <button onClick={stopRecording} style={{width:60,height:60,borderRadius:"50%",background:"#EF4444",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",boxShadow:"0 4px 18px rgba(239,68,68,.4)"}}>
            <Square size={22} color="white" fill="white"/>
          </button>
          <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
        </>
      )}
      
      {phase === "preview" && audioUrl && (
        <>
          <div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,color:"#111",fontSize:".92rem",marginBottom:".8rem"}}>
            ✅ {formatTime(elapsed)} enregistrées
          </div>
          <audio controls src={audioUrl} style={{width:"100%",marginBottom:"1rem",borderRadius:"8px"}}/>
          <div style={{display:"flex",gap:".5rem"}}>
            <button onClick={reset} style={{flex:1,padding:".6rem",borderRadius:"99px",border:"1.5px solid #D1FAE5",background:"white",color:"#666",fontWeight:700,fontSize:".82rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:".3rem"}}>
              <RotateCcw size={14}/> Refaire
            </button>
            <button onClick={confirm} style={{flex:2,padding:".6rem",borderRadius:"99px",border:"none",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",color:"white",fontWeight:800,fontSize:".82rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:".3rem"}}>
              <CheckCircle size={14}/> Valider
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function InscriptionTalentPage() {
  const [etape, setEtape] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(null);
  const [form, setForm] = useState({
    // Étape 1 : Infos personnelles
    nom: "",
    prenom: "",
    dateNaissance: "",
    genre: "",
    telephone: "",
    email: "",
    pays: "",
    ville: "",
    
    // Étape 2 : Métier & Compétences
    metier: "",
    autreMetier: "",
    experience: "",
    competences: "",
    disponibilite: "",
    pretentionSalariale: "",
    
    // Étape 3 : Documents & Médias
    videoUrl: null,
    photoUrl: null,
    photoProfilUrl: null, // Photo de profil séparée
    cvUrl: null,
    diplomeUrl: null,
    niveauEtude: "",
    bio: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  // Fonction de nettoyage qui autorise espaces, virgules et caractères normaux
  const clean = s => s.replace(/[<>]/g, "");

  // Validation étape 1
  const v1 = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = "Nom requis";
    if (!form.prenom.trim()) e.prenom = "Prénom requis";
    if (!form.telephone.trim()) e.telephone = "Téléphone requis";
    if (!form.pays.trim()) e.pays = "Pays requis";
    if (!form.ville.trim()) e.ville = "Ville requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Validation étape 2
  const v2 = () => {
    const e = {};
    if (!form.metier) e.metier = "Métier requis";
    if (form.metier === "Autre métier" && !form.autreMetier.trim()) e.autreMetier = "Précisez votre métier";
    if (!form.experience) e.experience = "Niveau d'expérience requis";
    if (!form.disponibilite) e.disponibilite = "Disponibilité requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Validation étape 3 - Documents optionnels, seule la bio est requise
  const v3 = () => {
    const e = {};
    if (!form.videoUrl && !form.photoUrl) {
      e.media = "Ajoutez au moins une vidéo ou une photo";
    }
    if (!form.bio.trim()) e.bio = "Présentez-vous brièvement";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (etape === 1 && !v1()) return;
    if (etape === 2 && !v2()) return;
    setEtape(e => e + 1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const router = useRouter();

  const soumettre = () => {
    if (!v3()) return;
    setProgress({ label: "Création de votre profil en cours…", pct: 0 });
    
    // Sauvegarder dans localStorage
    const result = saveInscription('talents', form);
    
    if (!result.success) {
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
      setProgress(null);
      return;
    }
    
    let p = 0;
    const iv = setInterval(() => {
      p += Math.floor(Math.random() * 12) + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setProgress({ label: "✅ Profil créé !", pct: 100 });
        setTimeout(() => {
          // Rediriger vers la page de succès
          router.push(`/success?type=talent&nom=${encodeURIComponent(form.prenom)}`);
        }, 700);
      } else {
        setProgress({ label: "Création de votre profil en cours…", pct: p });
      }
    }, 180);
  };

  if (submitted) {
    return (
      <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0B1628,#162F52)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",fontFamily:"system-ui,sans-serif"}}>
        <div style={{maxWidth:500,width:"100%",textAlign:"center"}}>
          <div style={{fontSize:"4.5rem",marginBottom:"1rem"}}>🎉</div>
          <h1 style={{fontFamily:"'Sora',sans-serif",color:"white",fontWeight:900,fontSize:"1.5rem",marginBottom:".6rem"}}>
            Bienvenue sur TalentProof, {form.prenom} !
          </h1>
          <p style={{color:"rgba(255,255,255,.68)",fontSize:".9rem",lineHeight:1.7,marginBottom:"1.5rem"}}>
            Ton profil est en cours de validation. Notre équipe le vérifiera sous <strong style={{color:"#F0C040"}}>24h</strong>.
            Tu recevras une notification par WhatsApp dès qu'il sera en ligne.
          </p>
          
          <div style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",borderRadius:"16px",padding:"1.2rem",marginBottom:"1.5rem",textAlign:"left"}}>
            <div style={{color:"rgba(255,255,255,.45)",fontSize:".7rem",fontWeight:700,letterSpacing:".6px",textTransform:"uppercase",marginBottom:".7rem"}}>Ton profil</div>
            {[
              ["Nom", `${form.prenom} ${form.nom}`],
              ["Métier", form.metier === "Autre métier" ? form.autreMetier : form.metier],
              ["Ville", `${form.ville}, ${form.pays}`],
              ["Expérience", form.experience],
              ["Disponibilité", DISPONIBILITES.find(d => d.id === form.disponibilite)?.label || "—"]
            ].map(([k, v]) => (
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:".3rem 0",borderBottom:"1px solid rgba(255,255,255,.06)",fontSize:".82rem"}}>
                <span style={{color:"rgba(255,255,255,.48)"}}>{k}</span>
                <span style={{color:"white",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"60%"}}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:".6rem",justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/" style={{display:"inline-flex",alignItems:"center",gap:".5rem",background:"linear-gradient(135deg,#C9960F,#F0C040)",color:"#0D3B2E",fontWeight:800,fontSize:".9rem",padding:".75rem 1.5rem",borderRadius:"99px",textDecoration:"none",boxShadow:"0 4px 18px rgba(201,150,15,.42)"}}>
              Retour à l'accueil
            </Link>
            <a href={`https://wa.me/${WA_NUM1}?text=${encodeURIComponent(`Bonjour TalentProof, je viens de créer mon profil (${form.prenom} ${form.nom}).`)}`} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:".45rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".88rem",padding:".75rem 1.4rem",borderRadius:"99px",textDecoration:"none"}}>
              <WaLogo size={17}/> WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"#F0F4F0",fontFamily:"system-ui,sans-serif"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0B1628,#162F52)",padding:"1.1rem 1rem"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <Link href="/" style={{color:"rgba(255,255,255,.55)",fontSize:".8rem",textDecoration:"none"}}>← Retour</Link>
          <h1 style={{fontFamily:"'Sora',sans-serif",color:"#F5F0E8",fontWeight:900,fontSize:"1.12rem",margin:".32rem 0 .8rem"}}>
            🎙️ Créer mon profil TalentProof
          </h1>
          <div style={{display:"flex",gap:".85rem",alignItems:"center",flexWrap:"wrap"}}>
            <Etape num="1" label="Infos personnelles" active={etape===1} done={etape>1}/>
            <div style={{flex:1,height:1,background:"rgba(255,255,255,.14)",minWidth:12}}/>
            <Etape num="2" label="Métier" active={etape===2} done={etape>2}/>
            <div style={{flex:1,height:1,background:"rgba(255,255,255,.14)",minWidth:12}}/>
            <Etape num="3" label="Preuves" active={etape===3} done={etape>3}/>
          </div>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"1.2rem 1rem"}}>

        {/* ÉTAPE 1 : Informations personnelles */}
        {etape === 1 && (
          <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
            <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".98rem",color:"#111",marginBottom:".35rem"}}>
              Qui es-tu ?
            </h2>
            <p style={{color:"#666",fontSize:".8rem",marginBottom:"1rem",lineHeight:1.6}}>
              Tes informations de base pour te contacter.
            </p>
            
            <div style={{display:"flex",flexDirection:"column",gap:".82rem"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".65rem"}}>
                <Champ label="Prénom" required error={errors.prenom}>
                  <input 
                    value={form.prenom} 
                    onChange={e => set("prenom", clean(e.target.value))} 
                    placeholder="Ex: Moussa" 
                    style={{...inputSt, borderColor: errors.prenom ? "#EF4444" : "#D1FAE5"}} 
                    onFocus={e => e.target.style.borderColor = "#1B6B47"} 
                    onBlur={e => e.target.style.borderColor = errors.prenom ? "#EF4444" : "#D1FAE5"}
                  />
                </Champ>
                
                <Champ label="Nom" required error={errors.nom}>
                  <input 
                    value={form.nom} 
                    onChange={e => set("nom", clean(e.target.value))} 
                    placeholder="Ex: Diallo" 
                    style={{...inputSt, borderColor: errors.nom ? "#EF4444" : "#D1FAE5"}} 
                    onFocus={e => e.target.style.borderColor = "#1B6B47"} 
                    onBlur={e => e.target.style.borderColor = errors.nom ? "#EF4444" : "#D1FAE5"}
                  />
                </Champ>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".65rem"}}>
                <Champ label="Date de naissance">
                  <input 
                    type="date"
                    value={form.dateNaissance} 
                    onChange={e => set("dateNaissance", e.target.value)} 
                    style={inputSt} 
                    onFocus={e => e.target.style.borderColor = "#1B6B47"} 
                    onBlur={e => e.target.style.borderColor = "#D1FAE5"}
                  />
                </Champ>
                
                <Champ label="Genre">
                  <select 
                    value={form.genre} 
                    onChange={e => set("genre", e.target.value)} 
                    style={{...inputSt, cursor:"pointer"}}
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Autre">Autre</option>
                  </select>
                </Champ>
              </div>

              <Champ label="Téléphone / WhatsApp" required error={errors.telephone} hint="Format: +225 07 05 50 30 89">
                <input 
                  type="tel"
                  value={form.telephone} 
                  onChange={e => set("telephone", e.target.value)} 
                  placeholder="+225 07 05 50 30 89" 
                  style={{...inputSt, borderColor: errors.telephone ? "#EF4444" : "#D1FAE5"}} 
                  onFocus={e => e.target.style.borderColor = "#1B6B47"} 
                  onBlur={e => e.target.style.borderColor = errors.telephone ? "#EF4444" : "#D1FAE5"}
                />
              </Champ>

              <Champ label="Email (optionnel)" hint="Pour recevoir des notifications">
                <input 
                  type="email"
                  value={form.email} 
                  onChange={e => set("email", e.target.value.trim())} 
                  placeholder="exemple@email.com" 
                  style={inputSt} 
                  onFocus={e => e.target.style.borderColor = "#1B6B47"} 
                  onBlur={e => e.target.style.borderColor = "#D1FAE5"}
                />
              </Champ>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".65rem"}}>
                <Champ label="Pays" required error={errors.pays}>
                  <input 
                    value={form.pays} 
                    onChange={e => set("pays", clean(e.target.value))} 
                    placeholder="Côte d'Ivoire" 
                    style={{...inputSt, borderColor: errors.pays ? "#EF4444" : "#D1FAE5"}} 
                    onFocus={e => e.target.style.borderColor = "#1B6B47"} 
                    onBlur={e => e.target.style.borderColor = errors.pays ? "#EF4444" : "#D1FAE5"}
                  />
                </Champ>
                
                <Champ label="Ville" required error={errors.ville}>
                  <input 
                    value={form.ville} 
                    onChange={e => set("ville", clean(e.target.value))} 
                    placeholder="Abidjan" 
                    style={{...inputSt, borderColor: errors.ville ? "#EF4444" : "#D1FAE5"}} 
                    onFocus={e => e.target.style.borderColor = "#1B6B47"} 
                    onBlur={e => e.target.style.borderColor = errors.ville ? "#EF4444" : "#D1FAE5"}
                  />
                </Champ>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Métier & Compétences */}
        {etape === 2 && (
          <div style={{display:"flex",flexDirection:"column",gap:".9rem"}}>
            <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".98rem",color:"#111",marginBottom:".35rem"}}>
                Ton métier
              </h2>
              <p style={{color:"#666",fontSize:".8rem",marginBottom:"1rem",lineHeight:1.6}}>
                Dis-nous ce que tu sais faire.
              </p>
              
              <div style={{display:"flex",flexDirection:"column",gap:".82rem"}}>
                <Champ label="Métier principal" required error={errors.metier}>
                  <select 
                    value={form.metier} 
                    onChange={e => set("metier", e.target.value)} 
                    style={{...inputSt, borderColor: errors.metier ? "#EF4444" : "#D1FAE5", cursor:"pointer"}}
                  >
                    <option value="">-- Sélectionne ton métier --</option>
                    {METIERS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Champ>

                {form.metier === "Autre métier" && (
                  <Champ label="Précise ton métier" required error={errors.autreMetier}>
                    <input 
                      value={form.autreMetier} 
                      onChange={e => set("autreMetier", clean(e.target.value))} 
                      placeholder="Ex: Photographe événementiel" 
                      style={{...inputSt, borderColor: errors.autreMetier ? "#EF4444" : "#D1FAE5"}} 
                      onFocus={e => e.target.style.borderColor = "#1B6B47"} 
                      onBlur={e => e.target.style.borderColor = errors.autreMetier ? "#EF4444" : "#D1FAE5"}
                    />
                  </Champ>
                )}

                <Champ label="Niveau d'expérience" required error={errors.experience}>
                  <select 
                    value={form.experience} 
                    onChange={e => set("experience", e.target.value)} 
                    style={{...inputSt, borderColor: errors.experience ? "#EF4444" : "#D1FAE5", cursor:"pointer"}}
                  >
                    <option value="">-- Sélectionne ton niveau --</option>
                    {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </Champ>

                <Champ label="Compétences clés" hint="Sépare par des virgules (ex: Ponctuel, Discret, Permis B)">
                  <textarea 
                    value={form.competences} 
                    onChange={e => set("competences", clean(e.target.value))} 
                    placeholder="Ex: Ponctuel, Discret, Permis B, Connaissance des routes d'Abidjan" 
                    rows={3} 
                    maxLength={200} 
                    style={{...inputSt, resize:"vertical", lineHeight:1.6}} 
                    onFocus={e => e.target.style.borderColor = "#1B6B47"} 
                    onBlur={e => e.target.style.borderColor = "#D1FAE5"}
                  />
                  <span style={{color:"#9CA3AF",fontSize:".71rem",textAlign:"right"}}>{form.competences.length}/200</span>
                </Champ>

                <Champ label="Disponibilité" required error={errors.disponibilite}>
                  <div style={{display:"flex",flexDirection:"column",gap:".5rem",marginTop:".3rem"}}>
                    {DISPONIBILITES.map(dispo => (
                      <button 
                        key={dispo.id}
                        onClick={() => set("disponibilite", dispo.id)}
                        style={{
                          display:"flex",
                          alignItems:"center",
                          gap:".7rem",
                          padding:".75rem .9rem",
                          borderRadius:"10px",
                          border:`2px solid ${form.disponibilite === dispo.id ? dispo.color : "#E5E7EB"}`,
                          background: form.disponibilite === dispo.id ? `${dispo.color}12` : "white",
                          cursor:"pointer",
                          textAlign:"left",
                          transition:"all .2s"
                        }}
                      >
                        <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${form.disponibilite === dispo.id ? dispo.color : "#D1D5DB"}`,background: form.disponibilite === dispo.id ? dispo.color : "transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {form.disponibilite === dispo.id && <div style={{width:8,height:8,borderRadius:"50%",background:"white"}}/>}
                        </div>
                        <span style={{fontSize:".85rem",fontWeight:600,color: form.disponibilite === dispo.id ? dispo.color : "#666"}}>{dispo.label}</span>
                      </button>
                    ))}
                  </div>
                </Champ>

                <Champ label="Prétention salariale (optionnel)" hint="Salaire souhaité ou tarif journalier">
                  <input 
                    value={form.pretentionSalariale} 
                    onChange={e => set("pretentionSalariale", e.target.value)} 
                    placeholder="Ex: 150 000 FCFA/mois ou 15 000 FCFA/jour" 
                    style={inputSt} 
                    onFocus={e => e.target.style.borderColor = "#1B6B47"} 
                    onBlur={e => e.target.style.borderColor = "#D1FAE5"}
                  />
                </Champ>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Documents & Médias */}
        {etape === 3 && (
          <div style={{display:"flex",flexDirection:"column",gap:".9rem"}}>
            <div style={{background:"white",borderRadius:"18px",padding:"1.35rem",boxShadow:"0 2px 8px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.07)"}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:".98rem",color:"#111",marginBottom:".35rem"}}>
                Prouve ton talent
              </h2>
              <p style={{color:"#666",fontSize:".8rem",marginBottom:"1rem",lineHeight:1.6}}>
                <strong>Vidéo ou photo</strong> — c'est ta preuve. Pas besoin de diplôme.
              </p>

              {errors.media && (
                <div style={{color:"#EF4444",fontSize:".77rem",marginBottom:".8rem",background:"#FEF2F2",padding:".5rem .8rem",borderRadius:"8px",border:"1px solid #FCA5A5"}}>
                  {errors.media}
                </div>
              )}

              {/* Vidéo de présentation */}
              <div style={{marginBottom:"1.2rem"}}>
                <div style={{fontSize:".82rem",fontWeight:700,color:"#374151",marginBottom:".5rem"}}>
                  🎥 Vidéo de présentation (recommandé)
                </div>
                {!form.videoUrl ? (
                  <VoiceRecorder onRecorded={(url) => set("videoUrl", url)} />
                ) : (
                  <div style={{background:"#F0FDF4",border:"1.5px solid #86EFAC",borderRadius:"12px",padding:"1rem",display:"flex",alignItems:"center",gap:".7rem"}}>
                    <CheckCircle size={24} color="#16A34A" style={{flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:".85rem",color:"#065F46"}}>Vidéo enregistrée ✓</div>
                      <div style={{fontSize:".75rem",color:"#047857"}}>Prête à être envoyée</div>
                    </div>
                    <button onClick={() => set("videoUrl", null)} style={{background:"transparent",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:"1.2rem"}}>
                      <X size={20}/>
                    </button>
                  </div>
                )}
              </div>

              {/* Photo de profil */}
              <div style={{marginBottom:"1.2rem"}}>
                <div style={{fontSize:".82rem",fontWeight:700,color:"#374151",marginBottom:".5rem"}}>
                  👤 Photo de profil (optionnel)
                </div>
                <div style={{color:"#9CA3AF",fontSize:".75rem",marginBottom:".6rem"}}>
                  Tu pourras l'ajouter plus tard via ton lien d'accès personnel
                </div>
                {!form.photoProfilUrl ? (
                  <div style={{position:"relative",border:"2px dashed #D1FAE5",borderRadius:"12px",padding:"1.5rem 1rem",textAlign:"center",cursor:"pointer",transition:"all .2s"}} onMouseEnter={e => e.currentTarget.style.borderColor = "#1B6B47"} onMouseLeave={e => e.currentTarget.style.borderColor = "#D1FAE5"}>
                    <Upload size={32} color="#9CA3AF" style={{margin:"0 auto .5rem"}}/>
                    <div style={{color:"#666",fontSize:".82rem",fontWeight:600,marginBottom:".2rem"}}>Ajoute ta photo de profil</div>
                    <div style={{color:"#9CA3AF",fontSize:".72rem"}}>JPG, PNG — Max 5 Mo</div>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) set("photoProfilUrl", URL.createObjectURL(file));
                    }} style={{display:"none"}} id="photo-profil-upload"/>
                    <label htmlFor="photo-profil-upload" style={{position:"absolute",inset:0,cursor:"pointer"}}/>
                  </div>
                ) : (
                  <div style={{background:"#F0FDF4",border:"1.5px solid #86EFAC",borderRadius:"12px",padding:"1rem",display:"flex",alignItems:"center",gap:".7rem"}}>
                    <CheckCircle size={24} color="#16A34A" style={{flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:".85rem",color:"#065F46"}}>Photo de profil ajoutée ✓</div>
                      <div style={{fontSize:".75rem",color:"#047857"}}>Prête à être envoyée</div>
                    </div>
                    <button onClick={() => set("photoProfilUrl", null)} style={{background:"transparent",border:"none",color:"#9CA3AF",cursor:"pointer"}}>
                      <X size={20}/>
                    </button>
                  </div>
                )}
              </div>

              {/* Photos de réalisations (preuves visuelles publiques) */}
              <div style={{marginBottom:"1.2rem"}}>
                <div style={{fontSize:".82rem",fontWeight:700,color:"#374151",marginBottom:".5rem"}}>
                  📸 Photos de tes réalisations (vitrine publique)
                </div>
                <div style={{color:"#9CA3AF",fontSize:".75rem",marginBottom:".6rem"}}>
                  Ces photos seront visibles par tous pour montrer ton savoir-faire
                </div>
                {!form.photoUrl ? (
                  <div style={{position:"relative",border:"2px dashed #D1FAE5",borderRadius:"12px",padding:"1.5rem 1rem",textAlign:"center",cursor:"pointer",transition:"all .2s"}} onMouseEnter={e => e.currentTarget.style.borderColor = "#1B6B47"} onMouseLeave={e => e.currentTarget.style.borderColor = "#D1FAE5"}>
                    <Upload size={32} color="#9CA3AF" style={{margin:"0 auto .5rem"}}/>
                    <div style={{color:"#666",fontSize:".82rem",fontWeight:600,marginBottom:".2rem"}}>Ajoute une photo de ton travail</div>
                    <div style={{color:"#9CA3AF",fontSize:".72rem"}}>JPG, PNG — Max 5 Mo</div>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) set("photoUrl", URL.createObjectURL(file));
                    }} style={{display:"none"}} id="photo-upload"/>
                    <label htmlFor="photo-upload" style={{position:"absolute",inset:0,cursor:"pointer"}}/>
                  </div>
                ) : (
                  <div style={{background:"#F0FDF4",border:"1.5px solid #86EFAC",borderRadius:"12px",padding:"1rem",display:"flex",alignItems:"center",gap:".7rem"}}>
                    <CheckCircle size={24} color="#16A34A" style={{flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:".85rem",color:"#065F46"}}>Photo ajoutée ✓</div>
                      <div style={{fontSize:".75rem",color:"#047857"}}>Visible publiquement</div>
                    </div>
                    <button onClick={() => set("photoUrl", null)} style={{background:"transparent",border:"none",color:"#9CA3AF",cursor:"pointer"}}>
                      <X size={20}/>
                    </button>
                  </div>
                )}
              </div>

              {/* Bio */}
              <Champ label="Présente-toi en quelques mots" required error={errors.bio} hint="Parle de ton expérience, tes points forts">
                <textarea 
                  value={form.bio} 
                  onChange={e => set("bio", clean(e.target.value))} 
                  placeholder="Ex: Chauffeur VTC professionnel depuis 7 ans. Ponctuel, discret, connaissance parfaite d'Abidjan. Habitué des trajets aéroport et événements." 
                  rows={4} 
                  maxLength={300} 
                  style={{...inputSt, resize:"vertical", lineHeight:1.65, borderColor: errors.bio ? "#EF4444" : "#D1FAE5"}} 
                  onFocus={e => e.target.style.borderColor = "#1B6B47"} 
                  onBlur={e => e.target.style.borderColor = errors.bio ? "#EF4444" : "#D1FAE5"}
                />
                <span style={{color:"#9CA3AF",fontSize:".71rem",textAlign:"right"}}>{form.bio.length}/300</span>
              </Champ>

              {/* Documents optionnels */}
              <div style={{background:"#F9FAFB",border:"1px solid #E5E7EB",borderRadius:"12px",padding:"1rem"}}>
                <div style={{fontSize:".82rem",fontWeight:700,color:"#374151",marginBottom:".6rem"}}>
                  📄 Documents (optionnels)
                </div>
                
                {/* Niveau d'étude */}
                <Champ label="Niveau d'étude" hint="Sélectionne ton niveau de scolarité">
                  <select 
                    value={form.niveauEtude} 
                    onChange={e => set("niveauEtude", e.target.value)} 
                    style={{...inputSt, cursor:"pointer"}}
                  >
                    <option value="">-- Sélectionne ton niveau --</option>
                    {NIVEAUX_ETUDE.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </Champ>

                <div style={{height:".8rem"}}/>

                <div style={{display:"flex",flexDirection:"column",gap:".5rem",fontSize:".78rem"}}>
                  <label style={{display:"flex",alignItems:"center",gap:".5rem",cursor:"pointer",padding:".4rem",borderRadius:"8px",transition:"background .15s"}} onMouseEnter={e => e.currentTarget.style.background = "#F0FDF4"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) set("cvUrl", file.name);
                    }} style={{display:"none"}} id="cv-upload"/>
                    <div style={{width:16,height:16,borderRadius:"4px",border:"2px solid #D1D5DB",background:form.cvUrl?"#1B6B47":"white",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {form.cvUrl && <CheckCircle size={12} color="white"/>}
                    </div>
                    <span style={{color:"#666"}}>CV / Curriculum Vitae</span>
                    {form.cvUrl && <span style={{color:"#16A34A",fontSize:".7rem",marginLeft:"auto"}}>✓ Ajouté</span>}
                  </label>
                  
                  <label style={{display:"flex",alignItems:"center",gap:".5rem",cursor:"pointer",padding:".4rem",borderRadius:"8px",transition:"background .15s"}} onMouseEnter={e => e.currentTarget.style.background = "#F0FDF4"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) set("diplomeUrl", file.name);
                    }} style={{display:"none"}} id="diplome-upload"/>
                    <div style={{width:16,height:16,borderRadius:"4px",border:"2px solid #D1D5DB",background:form.diplomeUrl?"#1B6B47":"white",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {form.diplomeUrl && <CheckCircle size={12} color="white"/>}
                    </div>
                    <span style={{color:"#666"}}>Diplôme / Certificat / Attestation</span>
                    {form.diplomeUrl && <span style={{color:"#16A34A",fontSize:".7rem",marginLeft:"auto"}}>✓ Ajouté</span>}
                  </label>
                </div>
              </div>
            </div>

            {/* Info importante */}
            <div style={{background:"linear-gradient(135deg,#FEF9EE,#FFF7E0)",border:"1.5px solid #FCD34D",borderRadius:"14px",padding:"1rem 1.1rem"}}>
              <div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:".87rem",color:"#92400E",marginBottom:".4rem"}}>
                💡 Pas de diplôme ? Aucun problème !
              </div>
              <p style={{color:"#B45309",fontSize:".78rem",lineHeight:1.65,margin:0}}>
                Sur TalentProof, <strong>ta preuve c'est ce que tu sais faire</strong>. Une vidéo ou une photo de ton travail suffit.
              </p>
            </div>
          </div>
        )}

        {/* Barre de progression */}
        {progress && <Barre label={progress.label} pct={progress.pct} color="#C9960F"/>}

        {/* Navigation */}
        <div style={{display:"flex",gap:".62rem",marginTop:"1.05rem"}}>
          {etape > 1 && (
            <button 
              onClick={() => {
                setEtape(e => e - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }} 
              style={{flex:1,padding:".66rem",borderRadius:"99px",border:"1.5px solid #D1FAE5",background:"white",color:"#1B6B47",fontWeight:700,fontSize:".85rem",cursor:"pointer"}}
            >
              ← Retour
            </button>
          )}
          {etape < 3 ? (
            <button 
              onClick={next} 
              style={{flex:2,padding:".66rem",borderRadius:"99px",border:"none",background:"linear-gradient(135deg,#1B6B47,#2D9A68)",color:"white",fontWeight:800,fontSize:".85rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(27,107,71,.32)"}}
            >
              Continuer →
            </button>
          ) : (
            <button 
              onClick={soumettre} 
              disabled={!!progress} 
              style={{flex:2,padding:".66rem",borderRadius:"99px",border:"none",background:progress?"#E5E7EB":"linear-gradient(135deg,#C9960F,#F0C040)",color:progress?"#9CA3AF":"#0D3B2E",fontWeight:800,fontSize:".85rem",cursor:progress?"not-allowed":"pointer",boxShadow:progress?"none":"0 4px 16px rgba(201,150,15,.4)",transition:"all .2s"}}
            >
              {progress ? "⏳ Création en cours…" : "🚀 Créer mon profil"}
            </button>
          )}
        </div>

        {/* Option WhatsApp alternative */}
        <div style={{marginTop:"1rem",background:"#F0FDF4",border:"1px solid #D1FAE5",borderRadius:"12px",padding:".85rem",textAlign:"center"}}>
          <div style={{color:"#166534",fontSize:".78rem",fontWeight:600,marginBottom:".5rem"}}>
            Préfères-tu t'inscrire via WhatsApp ?
          </div>
            <a 
            href={`https://wa.me/${WA_NUM1}?text=${encodeURIComponent("Bonjour TalentProof, je souhaite créer mon profil talent.")}`} 
            target="_blank" 
            rel="noreferrer" 
            style={{display:"inline-flex",alignItems:"center",gap:".45rem",background:"#25D366",color:"white",fontWeight:700,fontSize:".82rem",padding:".52rem 1.2rem",borderRadius:"99px",textDecoration:"none",boxShadow:"0 2px 10px rgba(37,211,102,.3)"}}
          >
            <WaLogo size={16}/> Contact
          </a>
        </div>

        <p style={{textAlign:"center",color:"#9CA3AF",fontSize:".72rem",marginTop:".72rem",lineHeight:1.6}}>
          En créant ton profil, tu acceptes nos{" "}
          <Link href="/mentions-legales" style={{color:"#1B6B47",textDecoration:"none"}}>mentions légales</Link>{" "}
          et notre{" "}
          <Link href="/confidentialite" style={{color:"#1B6B47",textDecoration:"none"}}>politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}
