import Link from "next/link";

export const metadata = {
  title: "Mentions légales — TalentProof Afrique",
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

export default function MentionsLegalesPage() {
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
            Mentions légales
          </h1>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>

          <Section titre="Éditeur du site">
            <p>TalentProof Afrique est une plateforme de mise en relation de talents africains avec des recruteurs et particuliers.</p>
            <p style={{ marginTop: ".5rem" }}><strong>Contact :</strong> contact@talentproof.africa</p>
          </Section>

          <Section titre="Hébergement">
            <p>Ce site est hébergé sur Vercel Inc., 340 Pine Street, Suite 900, San Francisco, CA 94104, États-Unis.</p>
          </Section>

          <Section titre="Propriété intellectuelle">
            <p>
              L'ensemble du contenu présent sur TalentProof (textes, graphismes, logos, icônes)
              est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite.
            </p>
          </Section>

          <Section titre="Responsabilité">
            <p>
              TalentProof agit en qualité d'intermédiaire technique. La plateforme ne peut être tenue
              responsable des relations contractuelles établies entre les talents et les recruteurs.
            </p>
          </Section>

          <Section titre="Droit applicable">
            <p>
              Le présent site est soumis au droit applicable dans le pays d'établissement de l'éditeur.
              Tout litige sera soumis aux tribunaux compétents.
            </p>
          </Section>

        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem", color: "#AAA", fontSize: ".74rem" }}>
          <Link href="/" style={{ color: "#1B6B47", textDecoration: "none", fontWeight: 600 }}>
            ← TalentProof
          </Link>
          {" · "}
          <Link href="/confidentialite" style={{ color: "#888", textDecoration: "none" }}>
            Confidentialité
          </Link>
        </div>
      </div>

    </div>
  );
}