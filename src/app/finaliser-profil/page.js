"use client";
import { useState } from "react";
import Link from "next/link";
import { Upload, X, CheckCircle, Save } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { uploadFichier } from "@/services/api";

/* ── Constantes ── */
const METIERS = [
  "Chauffeur VTC", "Chauffeur camion", "Chauffeur particulier",
  "Mécanicien", "Soudeur", "Électricien", "Plombier", "Maçon", "Peintre en bâtiment", "Carreleur",
  "Couturier / Tailleur", "Coiffeur / Coiffeuse", "Esthéticienne",
  "Cuisinier / Chef", "Aide ménagère", "Gardien / Vigile",
  "Informaticien", "Comptable", "Secrétaire", "Commercial",
  "Livreur", "Agent de sécurité", "Développeur", "Graphiste", "Community Manager",
  "Autre métier",
];

const NIVEAUX_EXPERIENCE = [
  "Débutant (moins de 1 an)",
  "Intermédiaire (1-3 ans)",
  "Confirmé (3-5 ans)",
  "Expert (5-10 ans)",
  "Maître (plus de 10 ans)",
];

const NIVEAUX_ETUDE = [
  "Sans niveau d'étude", "Niveau CM2", "Niveau 3ème",
  "Brevet", "Bac", "Bac+2", "Bac+3", "Bac+5 et plus",
];

const DISPO_OPTIONS = [
  { value: "immediate", label: "Disponible immédiatement", color: "#16A34A" },
  { value: "1_month",   label: "Disponible dans 1 mois",   color: "#D97706" },
  { value: "negotiable",label: "À négocier",               color: "#6B7280" },
];

/* ── Styles partagés ── */
const inputSt = {
  width: "100%", padding: ".65rem .9rem", borderRadius: "8px",
  border: "1.5px solid #D1FAE5", fontSize: ".9rem", fontFamily: "inherit",
  outline: "none", background: "#F9FAFB", color: "#111",
  transition: "border-color .2s", boxSizing: "border-box",
};

const focusGreen  = (e) => { e.target.style.borderColor = "#1B6B47"; };
const blurGreen   = (e) => { e.target.style.borderColor = "#D1FAE5"; };
const focusRed    = (e) => { e.target.style.borderColor = "#EF4444"; };

/* ── Zone d'upload réutilisable ── */
function ZoneUpload({ label, accept, preview, onFile, onRemove, hint }) {
  return (
    <div>
      <div style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", marginBottom: ".4rem" }}>
        {label}
      </div>
      {hint && (
        <div style={{ fontSize: ".72rem", color: "#9CA3AF", marginBottom: ".45rem" }}>{hint}</div>
      )}
      {preview ? (
        <div style={{
          background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: "12px",
          padding: ".8rem 1rem", display: "flex", alignItems: "center", gap: ".7rem",
        }}>
          <CheckCircle size={20} color="#16A34A" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            {typeof preview === "string" && preview.startsWith("blob:") ? (
              accept.startsWith("video") ? (
                <video src={preview} controls style={{ width: "100%", maxHeight: 160, borderRadius: 8, display: "block" }} />
              ) : (
                <img src={preview} alt="aperçu" style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, display: "block" }} />
              )
            ) : (
              <div style={{ fontSize: ".82rem", fontWeight: 600, color: "#065F46", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {preview}
              </div>
            )}
          </div>
          <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>
      ) : (
        <label style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: ".4rem", border: "2px dashed #D1FAE5", borderRadius: "12px", padding: "1.3rem",
          cursor: "pointer", transition: "border-color .2s", textAlign: "center",
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#1B6B47"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#D1FAE5"}
        >
          <Upload size={28} color="#9CA3AF" />
          <span style={{ fontSize: ".8rem", color: "#6B7280", fontWeight: 600 }}>
            Cliquer pour sélectionner
          </span>
          <input type="file" accept={accept} style={{ display: "none" }} onChange={onFile} />
        </label>
      )}
    </div>
  );
}

/* ── Affichage média existant (URL Supabase) ── */
function MediaExistant({ url, type, label }) {
  if (!url) return null;
  return (
    <div style={{ marginBottom: ".5rem" }}>
      <div style={{ fontSize: ".72rem", fontWeight: 700, color: "#9CA3AF", marginBottom: ".3rem" }}>
        {label} actuel(le)
      </div>
      {type === "video" ? (
        <video src={url} controls style={{ width: "100%", maxHeight: 160, borderRadius: 8, border: "1px solid #E5E7EB" }} />
      ) : (
        <img src={url} alt={label} style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, border: "1px solid #E5E7EB" }} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════════════════════════════════════ */
export default function FinaliserProfilPage() {
  /* Étape 1 */
  const [phone, setPhone]         = useState("");
  const [searchErr, setSearchErr] = useState("");
  const [searching, setSearching] = useState(false);

  /* PIN auth */
  const [pin, setPin]           = useState("");
  const [pinErr, setPinErr]     = useState("");

  /* Étape 2 */
  const [talent, setTalent]   = useState(null);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [saveOk, setSaveOk]   = useState(false);
  const [saveErr, setSaveErr] = useState("");

  /* PIN modification */
  const [newPin, setNewPin]         = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  /* Fichiers nouveaux */
  const [newAvatar, setNewAvatar]       = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [newPreuve, setNewPreuve]       = useState(null);
  const [previewPreuve, setPreviewPreuve] = useState(null);
  const [newVideo, setNewVideo]         = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  /* ── Helpers ── */
  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const variantesTel = (input) => {
    const t = input.replace(/[\s\-.]/g, "");
    let local;
    if (t.startsWith("+225"))               local = t.slice(4);
    else if (t.startsWith("225") && t.length >= 12) local = t.slice(3);
    else                                    local = t;
    const avecZero = local.startsWith("0") ? local : "0" + local;
    const sansZero = local.startsWith("0") ? local.slice(1) : local;
    return [...new Set([
      "+225" + avecZero, "225" + avecZero, avecZero,
      "+225" + sansZero, "225" + sansZero, sansZero,
    ])];
  };

  /* ── ÉTAPE 1 : recherche ── */
  const rechercher = async () => {
    if (!phone.trim()) { setSearchErr("Entrez votre numéro de téléphone."); return; }
    if (!pin.trim())   { setPinErr("Entrez votre code PIN."); return; }
    setSearching(true);
    setSearchErr("");
    setPinErr("");
    try {
      const variantes = variantesTel(phone.trim());
      const orClause  = variantes.map(v => `telephone.eq.${v}`).join(",");
      const { data, error } = await supabase
        .from("talents")
        .select("*")
        .or(orClause)
        .limit(1);
      if (error) throw error;
      const profil = data?.[0] || null;
      if (!profil) {
        setSearchErr("Numéro non reconnu. Vérifiez le numéro utilisé lors de votre inscription.");
      } else {
        if (profil.pin_code === null) {
          if (pin !== "1234") { setPinErr("Code PIN incorrect"); setSearching(false); return; }
          await supabase.from("talents").update({ pin_code: "1234" }).eq("id", profil.id);
          profil.pin_code = "1234";
        } else if (profil.pin_code !== pin) {
          setPinErr("Code PIN incorrect"); setSearching(false); return;
        }
        setTalent(profil);
        setForm({ ...profil });
      }
    } catch {
      setSearchErr("Erreur de connexion. Réessayez.");
    } finally {
      setSearching(false);
    }
  };

  /* ── Gestion fichiers ── */
  const pickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewAvatar(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };
  const removeAvatar = () => {
    setNewAvatar(null);
    if (previewAvatar) URL.revokeObjectURL(previewAvatar);
    setPreviewAvatar(null);
  };

  const pickPreuve = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPreuve(file);
    setPreviewPreuve(URL.createObjectURL(file));
  };
  const removePreuve = () => {
    setNewPreuve(null);
    if (previewPreuve) URL.revokeObjectURL(previewPreuve);
    setPreviewPreuve(null);
  };

  const pickVideo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("La vidéo dépasse 50 Mo. Choisissez un fichier plus léger.");
      return;
    }
    setNewVideo(file);
    setPreviewVideo(URL.createObjectURL(file));
  };
  const removeVideo = () => {
    setNewVideo(null);
    if (previewVideo) URL.revokeObjectURL(previewVideo);
    setPreviewVideo(null);
  };

  /* ── SAUVEGARDE ── */
  const sauvegarder = async () => {
    setSaving(true);
    setSaveOk(false);
    setSaveErr("");
    try {
      const updates = {
        prenom:        form.prenom       || "",
        nom:           form.nom          || "",
        email:         form.email        || null,
        telephone:     form.telephone    || talent.telephone,
        ville:         form.ville        || "",
        pays:          form.pays         || "",
        metier:        form.metier       || "",
        experience:    form.experience   || "",
        niveau_etude:  form.niveau_etude || null,
        disponibilite: form.disponibilite|| "negotiable",
        competences:   form.competences  || "",
        bio:           form.bio          || "",
      };

      /* Mise à jour PIN */
      if (newPin) {
        if (newPin.length < 4) { setSaveErr("Le PIN doit contenir exactement 4 chiffres."); setSaving(false); return; }
        if (newPin !== confirmPin) { setSaveErr("Les deux PIN ne correspondent pas."); setSaving(false); return; }
        updates.pin_code = newPin;
      }

      /* Uploads */
      const uploadWarnings = [];

      if (newAvatar) {
        if (newAvatar.size > 5 * 1024 * 1024) {
          setSaveErr("Photo de profil trop lourde (max 5 Mo)"); setSaving(false); return;
        }
        const extAvatar = newAvatar.name.split(".").pop() || "jpg";
        try {
          updates.avatar_url = await uploadFichier("avatars", newAvatar, `${Date.now()}-avatar.${extAvatar}`);
        } catch (e) {
          uploadWarnings.push("Photo de profil non uploadée : " + e.message);
        }
      }
      if (newPreuve) {
        if (newPreuve.size > 5 * 1024 * 1024) {
          setSaveErr("Photo de réalisation trop lourde (max 5 Mo)"); setSaving(false); return;
        }
        const extPreuve = newPreuve.name.split(".").pop() || "jpg";
        try {
          updates.preuve_url = await uploadFichier("preuves", newPreuve, `${Date.now()}-preuve.${extPreuve}`);
          updates.has_photo  = true;
        } catch (e) {
          uploadWarnings.push("Photo de réalisation non uploadée : " + e.message);
        }
      }
      if (newVideo) {
        const ext = newVideo.name.split(".").pop() || "mp4";
        try {
          updates.video_url = await uploadFichier("preuves", newVideo, `${Date.now()}-video.${ext}`);
          updates.has_video  = true;
        } catch (e) {
          uploadWarnings.push("Vidéo non uploadée : " + e.message);
        }
      }

      /* has_photo / has_video cohérence */
      if (!updates.preuve_url && !newPreuve) {
        updates.has_photo = !!(form.preuve_url || talent.preuve_url);
      }
      if (!updates.video_url && !newVideo) {
        updates.has_video = !!(form.video_url || talent.video_url);
      }

      const { data, error } = await supabase
        .from("talents")
        .update(updates)
        .eq("id", talent.id)
        .select();
      if (error) throw error;

      setTalent(data[0]);
      setForm({ ...data[0] });
      removeAvatar();
      removePreuve();
      removeVideo();
      if (uploadWarnings.length > 0) {
        setSaveErr("Profil sauvegardé, mais : " + uploadWarnings.join(" | "));
      } else {
        setSaveOk(true);
        setTimeout(() => setSaveOk(false), 4000);
      }
    } catch (err) {
      setSaveErr("Erreur lors de la sauvegarde : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ══════════════ RENDU ══════════════ */

  /* ── Header commun ── */
  const Header = () => (
    <header style={{
      background: "linear-gradient(135deg,#0B1628,#162F52)",
      padding: "1rem 1.2rem",
      borderBottom: "1px solid rgba(240,192,64,.18)",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "#F0C040", textDecoration: "none" }}>
          TalentProof
        </Link>
        {talent && (
          <button
            onClick={() => { setTalent(null); setPhone(""); setSaveOk(false); setSaveErr(""); }}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,.65)", fontSize: ".85rem", cursor: "pointer", fontWeight: 600 }}
          >
            ← Changer de compte
          </button>
        )}
      </div>
    </header>
  );

  /* ── ÉCRAN 1 : saisie téléphone ── */
  if (!talent) return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "system-ui,sans-serif" }}>
      <Header />

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#1B6B47,#2D9A68)",
        padding: "3rem 1.5rem 4rem", textAlign: "center",
      }}>
        <div style={{ fontSize: "3.2rem", marginBottom: ".8rem" }}>✏️</div>
        <h1 style={{
          fontFamily: "'Sora',sans-serif", fontWeight: 900,
          fontSize: "clamp(1.4rem,4vw,2rem)", color: "white",
          marginBottom: ".5rem", lineHeight: 1.25,
        }}>
          Finaliser mon profil
        </h1>
        <p style={{ color: "rgba(255,255,255,.75)", fontSize: ".9rem", lineHeight: 1.7, margin: 0 }}>
          Mets à jour tes informations, tes médias et tes compétences.
        </p>
      </div>

      {/* Card login */}
      <div style={{ maxWidth: 480, margin: "-2.5rem auto 4rem", padding: "0 1.2rem" }}>
        <div style={{
          background: "white", borderRadius: "20px",
          padding: "2rem", boxShadow: "0 8px 32px rgba(0,0,0,.12)",
        }}>
          <h2 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 800,
            fontSize: "1.1rem", color: "#111", marginBottom: "1.3rem", textAlign: "center",
          }}>
            Retrouve ton profil
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
            <div>
              <label style={{ fontSize: ".85rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".4rem" }}>
                Numéro de téléphone / WhatsApp (avec indicatif pays)
              </label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === "Enter" && rechercher()}
                placeholder="Ex: 2250798470653"
                type="tel"
                style={{ ...inputSt, borderColor: searchErr ? "#EF4444" : "#D1FAE5" }}
                onFocus={focusGreen}
                onBlur={blurGreen}
              />
              <p style={{ color: "#6B7280", fontSize: ".75rem", margin: ".35rem 0 0", lineHeight: 1.5 }}>
                💡 Commence par l&apos;indicatif de ton pays (sans le +) : 225 = Côte d&apos;Ivoire, 226 = Burkina Faso, 221 = Sénégal, 237 = Cameroun, etc.
              </p>
              {searchErr && (
                <p style={{ color: "#EF4444", fontSize: ".78rem", margin: ".4rem 0 0", lineHeight: 1.5 }}>{searchErr}</p>
              )}
            </div>

            <div>
              <label style={{ fontSize: ".85rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".4rem" }}>
                Code PIN (4 chiffres)
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                onKeyDown={e => e.key === "Enter" && rechercher()}
                placeholder="••••"
                style={{ ...inputSt, borderColor: pinErr ? "#EF4444" : "#D1FAE5" }}
                onFocus={focusGreen}
                onBlur={blurGreen}
              />
              {pinErr && (
                <p style={{ color: "#EF4444", fontSize: ".78rem", margin: ".4rem 0 0" }}>{pinErr}</p>
              )}
              <p style={{ color: "#6B7280", fontSize: ".75rem", margin: ".35rem 0 0", lineHeight: 1.5 }}>
                💡 Première connexion ? Utilisez le PIN par défaut : <strong>1234</strong>
              </p>
            </div>

            <button
              onClick={rechercher}
              disabled={searching}
              style={{
                padding: ".85rem", borderRadius: "10px", border: "none",
                background: searching
                  ? "#E5E7EB"
                  : "linear-gradient(135deg,#1B6B47,#2D9A68)",
                color: searching ? "#9CA3AF" : "white",
                fontWeight: 800, fontSize: ".95rem",
                cursor: searching ? "not-allowed" : "pointer",
                transition: "all .2s",
              }}
            >
              {searching ? "⏳ Recherche…" : "Accéder à mon profil →"}
            </button>

            <p style={{ textAlign: "center", color: "#9CA3AF", fontSize: ".76rem", margin: 0, lineHeight: 1.6 }}>
              Utilisez le numéro renseigné lors de votre inscription
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── ÉCRAN 2 : formulaire de modification ── */
  const dispoActuelle = DISPO_OPTIONS.find(d => d.value === (form.disponibilite || talent.disponibilite));

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "system-ui,sans-serif" }}>
      <Header />

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#1B6B47,#2D9A68)",
        padding: "2rem 1.5rem", textAlign: "center",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {talent.avatar_url ? (
            <img src={talent.avatar_url} alt="profil" style={{
              width: 72, height: 72, borderRadius: "50%",
              objectFit: "cover", border: "3px solid white",
              boxShadow: "0 4px 16px rgba(0,0,0,.2)", marginBottom: ".8rem",
            }} />
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(255,255,255,.2)", display: "inline-flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "2.2rem", border: "3px solid white", marginBottom: ".8rem",
            }}>👤</div>
          )}
          <h1 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 900,
            fontSize: "1.5rem", color: "white", marginBottom: ".2rem",
          }}>
            {talent.prenom} {talent.nom}
          </h1>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: ".88rem", margin: 0 }}>
            {talent.metier} — {talent.ville}, {talent.pays}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>

        {/* Notification succès */}
        {saveOk && (
          <div style={{
            background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "12px",
            padding: ".9rem 1.2rem", marginBottom: "1rem",
            display: "flex", alignItems: "center", gap: ".6rem",
            color: "#1B6B47", fontWeight: 700, fontSize: ".9rem",
          }}>
            <CheckCircle size={20} color="#16A34A" />
            Profil mis à jour avec succès !
          </div>
        )}

        {saveErr && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "12px",
            padding: ".9rem 1.2rem", marginBottom: "1rem",
            color: "#991B1B", fontSize: ".85rem",
          }}>
            {saveErr}
          </div>
        )}

        {/* ── SECTION : Identité ── */}
        <div style={{ background: "white", borderRadius: "18px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,.07)", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: ".95rem", color: "#111", marginBottom: "1.1rem" }}>
            👤 Informations personnelles
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".7rem" }}>
              <div>
                <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>Prénom</label>
                <input value={form.prenom || ""} onChange={e => f("prenom", e.target.value)}
                  style={inputSt} onFocus={focusGreen} onBlur={blurGreen} />
              </div>
              <div>
                <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>Nom</label>
                <input value={form.nom || ""} onChange={e => f("nom", e.target.value)}
                  style={inputSt} onFocus={focusGreen} onBlur={blurGreen} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>Email (optionnel)</label>
              <input type="email" value={form.email || ""} onChange={e => f("email", e.target.value)}
                placeholder="exemple@email.com"
                style={inputSt} onFocus={focusGreen} onBlur={blurGreen} />
            </div>

            <div>
              <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>Téléphone / WhatsApp (avec indicatif pays)</label>
              <input type="tel" value={form.telephone || ""} onChange={e => f("telephone", e.target.value)}
                placeholder="Ex: 2250798470653"
                style={inputSt} onFocus={focusGreen} onBlur={blurGreen} />
              <p style={{ color: "#6B7280", fontSize: ".75rem", margin: ".35rem 0 0", lineHeight: 1.5 }}>
                💡 Commence par l&apos;indicatif de ton pays (sans le +) : 225 = Côte d&apos;Ivoire, 226 = Burkina Faso, 221 = Sénégal, 237 = Cameroun, etc.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".7rem" }}>
              <div>
                <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>Ville</label>
                <input value={form.ville || ""} onChange={e => f("ville", e.target.value)}
                  placeholder="Abidjan" style={inputSt} onFocus={focusGreen} onBlur={blurGreen} />
              </div>
              <div>
                <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>Pays</label>
                <input value={form.pays || ""} onChange={e => f("pays", e.target.value)}
                  placeholder="Côte d'Ivoire" style={inputSt} onFocus={focusGreen} onBlur={blurGreen} />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION : Métier ── */}
        <div style={{ background: "white", borderRadius: "18px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,.07)", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: ".95rem", color: "#111", marginBottom: "1.1rem" }}>
            💼 Métier & Compétences
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>

            <div>
              <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>Métier principal</label>
              <select value={form.metier || ""} onChange={e => f("metier", e.target.value)}
                style={{ ...inputSt, cursor: "pointer", background: "white" }}
                onFocus={focusGreen} onBlur={blurGreen}>
                <option value="">-- Sélectionner --</option>
                {form.metier && !METIERS.includes(form.metier) && (
                  <option key={form.metier} value={form.metier}>{form.metier}</option>
                )}
                {METIERS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>Niveau d'expérience</label>
              <select value={form.experience || ""} onChange={e => f("experience", e.target.value)}
                style={{ ...inputSt, cursor: "pointer", background: "white" }}
                onFocus={focusGreen} onBlur={blurGreen}>
                <option value="">-- Sélectionner --</option>
                {NIVEAUX_EXPERIENCE.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>Niveau d'étude</label>
              <select value={form.niveau_etude || ""} onChange={e => f("niveau_etude", e.target.value || null)}
                style={{ ...inputSt, cursor: "pointer", background: "white" }}
                onFocus={focusGreen} onBlur={blurGreen}>
                <option value="">-- Non renseigné --</option>
                {form.niveau_etude && !NIVEAUX_ETUDE.includes(form.niveau_etude) && (
                  <option value={form.niveau_etude}>{form.niveau_etude}</option>
                )}
                {NIVEAUX_ETUDE.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>Disponibilité</label>
              <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
                {DISPO_OPTIONS.map(d => (
                  <button key={d.value} onClick={() => f("disponibilite", d.value)}
                    style={{
                      display: "flex", alignItems: "center", gap: ".65rem",
                      padding: ".65rem .9rem", borderRadius: "10px", textAlign: "left",
                      border: `2px solid ${form.disponibilite === d.value ? d.color : "#E5E7EB"}`,
                      background: form.disponibilite === d.value ? `${d.color}12` : "white",
                      cursor: "pointer", transition: "all .2s",
                    }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${form.disponibilite === d.value ? d.color : "#D1D5DB"}`,
                      background: form.disponibilite === d.value ? d.color : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {form.disponibilite === d.value && (
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} />
                      )}
                    </div>
                    <span style={{ fontSize: ".85rem", fontWeight: 600, color: form.disponibilite === d.value ? d.color : "#555" }}>
                      {d.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>Compétences clés</label>
              <textarea
                value={form.competences || ""}
                onChange={e => f("competences", e.target.value)}
                placeholder="Ex: Ponctuel, Permis B, Connaissance Abidjan"
                rows={3} maxLength={300}
                style={{ ...inputSt, resize: "vertical", lineHeight: 1.6 }}
                onFocus={focusGreen} onBlur={blurGreen}
              />
              <div style={{ fontSize: ".71rem", color: "#9CA3AF", textAlign: "right" }}>
                {(form.competences || "").length}/300 — séparées par des virgules
              </div>
            </div>

            <div>
              <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>Présentation / Bio</label>
              <textarea
                value={form.bio || ""}
                onChange={e => f("bio", e.target.value)}
                placeholder="Décrivez votre expérience et vos points forts…"
                rows={4} maxLength={300}
                style={{ ...inputSt, resize: "vertical", lineHeight: 1.65 }}
                onFocus={focusGreen} onBlur={blurGreen}
              />
              <div style={{ fontSize: ".71rem", color: "#9CA3AF", textAlign: "right" }}>
                {(form.bio || "").length}/300
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION : Médias ── */}
        <div style={{ background: "white", borderRadius: "18px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,.07)", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: ".95rem", color: "#111", marginBottom: "1.1rem" }}>
            📸 Médias
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>

            {/* Avatar */}
            <div>
              <MediaExistant url={!previewAvatar && talent.avatar_url} type="image" label="Photo de profil" />
              <ZoneUpload
                label="👤 Nouvelle photo de profil"
                accept="image/*"
                hint="JPG, PNG — Max 5 Mo"
                preview={previewAvatar}
                onFile={pickAvatar}
                onRemove={removeAvatar}
              />
            </div>

            {/* Photo preuve */}
            <div>
              <MediaExistant url={!previewPreuve && talent.preuve_url} type="image" label="Photo de réalisation" />
              <ZoneUpload
                label="📸 Nouvelle photo de réalisation"
                accept="image/*"
                hint="Visible publiquement dans l'annuaire — JPG, PNG — Max 5 Mo"
                preview={previewPreuve}
                onFile={pickPreuve}
                onRemove={removePreuve}
              />
            </div>

            {/* Vidéo */}
            <div>
              <MediaExistant url={!previewVideo && talent.video_url} type="video" label="Vidéo de présentation" />
              <ZoneUpload
                label="🎥 Nouvelle vidéo de présentation"
                accept="video/mp4,video/quicktime,video/webm,video/*"
                hint="MP4, MOV, WEBM — Max 50 Mo"
                preview={previewVideo}
                onFile={pickVideo}
                onRemove={removeVideo}
              />
            </div>
          </div>
        </div>

        {/* ── SECTION : Sécurité ── */}
        <div style={{ background: "white", borderRadius: "18px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,.07)", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: ".95rem", color: "#111", marginBottom: ".6rem" }}>
            🔒 Sécurité
          </h2>
          <p style={{ fontSize: ".78rem", color: "#9CA3AF", margin: "0 0 .85rem", lineHeight: 1.5 }}>
            Laissez vide pour conserver votre PIN actuel.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
            <div>
              <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>
                Nouveau PIN (4 chiffres)
              </label>
              <input
                type="password" inputMode="numeric" maxLength={4}
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="••••"
                style={inputSt} onFocus={focusGreen} onBlur={blurGreen}
              />
            </div>
            <div>
              <label style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: ".35rem" }}>
                Confirmer PIN
              </label>
              <input
                type="password" inputMode="numeric" maxLength={4}
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="••••"
                style={{ ...inputSt, borderColor: confirmPin && newPin !== confirmPin ? "#EF4444" : "#D1FAE5" }}
                onFocus={confirmPin && newPin !== confirmPin ? focusRed : focusGreen}
                onBlur={blurGreen}
              />
              {confirmPin && newPin !== confirmPin && (
                <p style={{ color: "#EF4444", fontSize: ".75rem", margin: ".3rem 0 0" }}>
                  Les PIN ne correspondent pas
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── BOUTON SAUVEGARDE ── */}
        <button
          onClick={sauvegarder}
          disabled={saving}
          style={{
            width: "100%", padding: ".9rem", borderRadius: "12px", border: "none",
            background: saving
              ? "#E5E7EB"
              : "linear-gradient(135deg,#1B6B47,#2D9A68)",
            color: saving ? "#9CA3AF" : "white",
            fontWeight: 800, fontSize: "1rem",
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: saving ? "none" : "0 4px 18px rgba(27,107,71,.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem",
            transition: "all .2s",
          }}
        >
          <Save size={20} />
          {saving ? "⏳ Enregistrement en cours…" : "Enregistrer mes modifications"}
        </button>

        <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
          <Link href={`/annuaire/${talent.id}`}
            style={{ color: "#1B6B47", fontSize: ".82rem", fontWeight: 600, textDecoration: "none" }}>
            Voir mon profil public →
          </Link>
        </div>
      </div>
    </div>
  );
}
