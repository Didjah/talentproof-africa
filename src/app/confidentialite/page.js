import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité — TalentProof Afrique",
};

function Section({ titre, children }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{
        fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1rem",
        color: "#111", marginBottom: ".5rem", paddingBottom: ".4rem",
        borderBottom: "1px solid #E5E7EB"
      }}>
        {titre}
      </h2>
      <div style={{ color: "#444", fontSize: ".85rem", lineHeight: 1.72 }}>
        {children}
      </div>
    </div>
  );
}

export default function ConfidentialitePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#0B1628,#162F52)", padding: "1.5rem 1rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: ".82rem", textDecoration: "none" }}>
            ← Retour
          </Link>
          <h1 style={{
            fontFamily: "'Sora', sans-serif", color: "#F5F0E8", fontWeight: 900,
            fontSize: "1.4rem", margin: ".5rem 0 0"
          }}>
            Politique de confidentialité
          </h1>
          <p style={{ color: "rgba(210,225,245,.65)", fontSize: ".78rem", marginTop: ".3rem" }}>
            Dernière mise à jour : mars 2026
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>

          <Section titre="1. Données collectées">
            <p>TalentProof collecte uniquement les données nécessaires à la création de ton profil :</p>
            <ul style={{ paddingLeft: "1.2rem", marginTop: ".4rem", display: "flex", flexDirection: "column", gap: ".25rem" }}>
              <li>Prénom et nom (optionnel)</li>
              <li>Métier et expérience</li>
              <li>Ville et pays</li>
              <li>Numéro WhatsApp (pour les contacts)</li>
              <li>Photo ou enregistrement vocal (preuve de compétence)</li>
            </ul>
          </Section>

          <Section titre="2. Données vocales — traitement spécifique">
            <p>Les enregistrements vocaux effectués sur la plateforme sont traités comme suit :</p>
            <ul style={{ paddingLeft: "1.2rem", marginTop: ".4rem", display: "flex", flexDirection: "column", gap: ".25rem" }}>
              <li>Utilisés <strong>uniquement</strong> pour créer ton profil TalentProof</li>
              <li>Non partagés avec des tiers à des fins commerciales</li>
              <li>Supprimés sur simple demande à contact@talentproof.africa</li>
              <li>Non utilisés pour entraîner des modèles d'intelligence artificielle</li>
            </ul>
          </Section>

          <Section titre="3. Finalités du traitement">
            <p>Tes données sont utilisées pour :</p>
            <ul style={{ paddingLeft: "1.2rem", marginTop: ".4rem", display: "flex", flexDirection: "column", gap: ".25rem" }}>
              <li>Créer et afficher ton profil public</li>
              <li>Permettre aux recruteurs de te contacter via WhatsApp</li>
              <li>Améliorer la pertinence des résultats de recherche</li>
            </ul>
          </Section>

          <Section titre="4. Tes droits">
            <p>Conformément aux lois applicables sur la protection des données, tu disposes des droits suivants :</p>
            <ul style={{ paddingLeft: "1.2rem", marginTop: ".4rem", display: "flex", flexDirection: "column", gap: ".25rem" }}>
              <li><strong>Droit d'accès</strong> : consulter tes données</li>
              <li><strong>Droit de rectification</strong> : corriger tes données</li>
              <li><strong>Droit à l'effacement</strong> : supprimer ton profil complet</li>
              <li><strong>Droit d'opposition</strong> : t'opposer au traitement</li>
            </ul>
            <p style={{ marginTop: ".6rem" }}>
              Pour exercer ces droits : <strong>contact@talentproof.africa</strong>
            </p>
          </Section>

          <Section titre="5. Sécurité des données">
            <p>
              TalentProof met en place des mesures techniques pour protéger tes données :
              connexion HTTPS, headers de sécurité (CSP, HSTS, X-Frame-Options),
              et accès restreint aux données personnelles.
            </p>
          </Section>

          <Section titre="6. Cookies">
            <p>
              TalentProof utilise uniquement des cookies fonctionnels essentiels
              (ex : mémoriser que tu as déjà vu le message de bienvenue).
              Aucun cookie publicitaire ni traceur tiers n'est utilisé.
            </p>
          </Section>

          <Section titre="7. Contact">
            <p>
              Pour toute question relative à tes données personnelles :<br />
              <strong>Email :</strong> contact@talentproof.africa<br />
              <strong>WhatsApp :</strong> disponible sur la page d'accueil
            </p>
          </Section>

        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem", color: "#AAA", fontSize: ".74rem" }}>
          <Link href="/" style={{ color: "#1B6B47", textDecoration: "none", fontWeight: 600 }}>
            ← TalentProof
          </Link>
          {" · "}
          <Link href="/mentions-legales" style={{ color: "#888", textDecoration: "none" }}>
            Mentions légales
          </Link>
        </div>
      </div>

    </div>
  );
}