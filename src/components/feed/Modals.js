"use client";
import { useState, useRef } from "react";
import { waLink, waTalentProof } from "../../utils/whatsapp";

/* ══════════════════════════════════════════════════
   MODAL LECTEUR VIDÉO
══════════════════════════════════════════════════ */
export function VideoPlayerModal({ profil, onClose }) {
  if (!profil) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2000, padding: "1rem", backdropFilter: "blur(8px)",
    }}>
      <div style={{
        background: "#0D3B2E", borderRadius: "1.5rem", width: "100%",
        maxWidth: "600px", overflow: "hidden",
        boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        animation: "fadeUp 0.25s ease both",
      }}>
        {/* Lecteur simulé */}
        <div style={{
          background: "#000", aspectRatio: "16/9", position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: "7rem", opacity: 0.22 }}>{profil.avatar}</span>

          {/* Contrôles vidéo */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
            padding: "2rem 1rem 0.75rem",
          }}>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "99px", height: "3px", marginBottom: "0.6rem", overflow: "hidden" }}>
              <div style={{ width: "35%", height: "100%", background: "#F0C040", borderRadius: "99px" }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span style={{ color: "white", fontSize: "1.4rem", cursor: "pointer" }}>⏸</span>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem" }}>0:21 / 1:00</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.2rem", cursor: "pointer" }}>⛶</span>
            </div>
          </div>

          {/* Bouton fermer */}
          <button onClick={onClose} style={{
            position: "absolute", top: "0.75rem", right: "0.75rem",
            background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%",
            width: "2.2rem", height: "2.2rem", color: "white",
            cursor: "pointer", fontSize: "0.95rem",
          }}>✕</button>
        </div>

        {/* Infos */}
        <div style={{ padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: "1.1rem" }}>{profil.nom}</div>
              <div style={{ color: "#F0C040", fontWeight: 600, fontSize: "0.9rem" }}>
                {profil.metier} · {profil.experience} ans · {profil.ville} {profil.pays}
              </div>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem", lineHeight: 1.65, marginTop: "0.75rem" }}>
            {profil.bio}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
            <a href={waLink(profil.nom, `${profil.metier} à ${profil.ville}`)}
              target="_blank" rel="noreferrer" style={{
                flex: 1, background: "#25D366", color: "white", border: "none",
                borderRadius: "99px", padding: "0.7rem 1rem", fontWeight: 700,
                fontSize: "0.9rem", textAlign: "center", textDecoration: "none",
                cursor: "pointer",
              }}>
              💬 Contacter sur WhatsApp
            </a>
            <button onClick={onClose} className="btn-ghost" style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.2)" }}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MODAL INSCRIPTION TALENT
══════════════════════════════════════════════════ */
export function InscriptionModal({ onClose }) {
  const [step, setStep]       = useState(1); // 1 = form, 2 = success
  const [videoFile, setVideo] = useState(null);
  const [drag, setDrag]       = useState(false);
  const [form, setForm]       = useState({ nom: "", metier: "", ville: "" });
  const fileRef               = useRef();

  const handleSubmit = e => { e.preventDefault(); if (form.nom && form.metier && form.ville) setStep(2); };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2000, padding: "1rem", backdropFilter: "blur(6px)",
    }}>
      <div style={{
        background: "white", borderRadius: "1.5rem", width: "100%",
        maxWidth: "460px", maxHeight: "92vh", overflowY: "auto",
        padding: "2rem", position: "relative",
        boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        animation: "fadeUp 0.25s ease both",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "1rem", right: "1rem",
          background: "#F3F4F6", border: "none", borderRadius: "50%",
          width: "2rem", height: "2rem", cursor: "pointer", fontSize: "0.95rem", color: "#6B7280",
        }}>✕</button>

        {step === 2 ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "0.75rem" }}>🎉</div>
            <h2 style={{ color: "var(--g800)", fontWeight: 900, fontSize: "1.35rem", marginBottom: "0.5rem" }}>
              Profil créé !
            </h2>
            <p style={{ color: "var(--t3)", lineHeight: 1.7, marginBottom: "0.5rem" }}>
              Bienvenue <strong>{form.nom}</strong> !<br/>
              Ton profil <em>{form.metier}</em> à <em>{form.ville}</em> est maintenant visible.
            </p>
            {videoFile && (
              <p style={{ color: "var(--g700)", fontWeight: 600, fontSize: "0.9rem" }}>
                🎥 &quot;{videoFile.name}&quot; uploadée avec succès
              </p>
            )}
            <a
              href={waTalentProof(`je viens de créer mon profil ${form.metier} à ${form.ville} sur TalentProof !`)}
              target="_blank" rel="noreferrer"
              style={{
                display: "block", marginTop: "1.25rem", width: "100%",
                background: "#25D366", color: "white", borderRadius: "99px",
                padding: "0.75rem", fontWeight: 800, fontSize: "0.95rem",
                textAlign: "center", textDecoration: "none",
              }}>
              💬 Finaliser par WhatsApp
            </a>
            <button className="btn-ghost" style={{ marginTop: "0.65rem", width: "100%" }}
              onClick={onClose}>
              Voir le feed ✨
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "12px", marginBottom: "0.9rem",
                background: "linear-gradient(135deg, var(--g700), var(--g500))",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
              }}>🎬</div>
              <h2 style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--g800)" }}>
                Crée ton profil gratuit
              </h2>
              <p style={{ color: "var(--t3)", fontSize: "0.88rem", marginTop: "0.25rem" }}>
                2 minutes · Sans diplôme requis · Depuis ton téléphone
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { key: "nom",    label: "Nom complet *",   ph: "Ex: Amadou Diallo"        },
                { key: "metier", label: "Ton métier *",    ph: "Ex: Maçon, Soudeur…"     },
                { key: "ville",  label: "Ta ville *",      ph: "Ex: Dakar, Abidjan…"     },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--g800)", marginBottom: "0.35rem" }}>
                    {label}
                  </label>
                  <input className="input" placeholder={ph}
                    value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
                </div>
              ))}

              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--g800)", marginBottom: "0.35rem" }}>
                  Vidéo de démonstration <span style={{ color: "var(--t3)", fontWeight: 400 }}>(optionnel)</span>
                </label>
                <div className={`upload-zone${drag ? " drag" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("video/")) setVideo(f); }}
                  onClick={() => fileRef.current.click()}
                >
                  <input type="file" accept="video/*" ref={fileRef} style={{ display: "none" }} onChange={e => setVideo(e.target.files[0])} />
                  {videoFile ? (
                    <div>
                      <div style={{ fontSize: "1.75rem", marginBottom: "0.3rem" }}>✅</div>
                      <div style={{ fontWeight: 600, color: "var(--g700)", fontSize: "0.88rem" }}>{videoFile.name}</div>
                      <div style={{ color: "var(--t3)", fontSize: "0.78rem" }}>{(videoFile.size/1024/1024).toFixed(1)} Mo</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>🎥</div>
                      <div style={{ fontWeight: 600, color: "var(--t2)", fontSize: "0.9rem" }}>Glisse ta vidéo ici</div>
                      <div style={{ color: "var(--t3)", fontSize: "0.8rem", marginTop: "0.2rem" }}>ou clique · MP4, MOV · max 200 Mo</div>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-gold" style={{ width: "100%", marginTop: "0.25rem" }}>
                🚀 Créer mon profil gratuit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
