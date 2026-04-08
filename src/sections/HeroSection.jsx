// ═══════════════════════════════════════════════════════
// TALENTPROOF - HERO SECTION
// Section d'accueil impactante avec CTA
// ═══════════════════════════════════════════════════════

'use client';

export default function HeroSection() {
  const ARTISANS = [
    { emoji: '🚗', job: 'Chauffeur VTC', name: 'Moussa D.', city: 'Dakar', exp: '7 ans' },
    { emoji: '⚡', job: 'Électricien', name: 'Kofi A.', city: 'Accra', exp: '9 ans' },
    { emoji: '✂️', job: 'Couturière', name: 'Fatou N.', city: 'Abidjan', exp: '12 ans' },
  ];

  return (
    <section 
      style={{
        background: 'linear-gradient(135deg, #0B1628 0%, #0F2744 60%, #162F52 100%)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'clamp(3rem, 8vw, 5rem)',
        paddingBottom: 'clamp(3rem, 8vw, 5rem)',
      }}
    >
      {/* Effet de lumière dorée */}
      <div 
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,192,64,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div 
          className="animate-fade-in-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'rgba(240,192,64,0.14)',
            color: 'var(--gold-600)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-extrabold)',
            letterSpacing: '0.9px',
            textTransform: 'uppercase',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--space-6)',
            border: '1px solid rgba(240,192,64,0.3)',
          }}
        >
          🤝 Pour tous les talents d&apos;Afrique
        </div>

        {/* Titre principal */}
        <h1 
          className="animate-fade-in-up delay-100"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--font-black)',
            fontSize: 'clamp(1.75rem, 5vw, 3rem)',
            lineHeight: 1.2,
            marginBottom: 'var(--space-4)',
            color: 'var(--gold-600)',
            textShadow: '0 2px 16px rgba(240,192,64,0.4)',
          }}
        >
          Diplômé, certifié, autodidacte —<br />
          <span style={{ color: '#F5F0E8', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            ta preuve, c&apos;est ce que tu sais faire.
          </span>
        </h1>

        {/* Sous-titre */}
        <p 
          className="animate-fade-in-up delay-200"
          style={{
            color: 'rgba(210,225,245,0.74)',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            lineHeight: 1.65,
            marginBottom: 'var(--space-8)',
            maxWidth: '650px',
          }}
        >
          Chauffeur, aide ménagère, couturière, gardien…{' '}
          <strong style={{ color: '#F5F0E8' }}>Tout le monde a sa place</strong> —{' '}
          14 000+ talents, 9 pays.
        </p>

        {/* Boutons CTA */}
        <div 
          className="animate-fade-in-up delay-300"
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-12)',
          }}
        >
          <a 
            href="/inscription" 
            className="btn-primary"
            style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}
          >
            + Créer mon profil
          </a>
          <a 
            href="/annuaire"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              padding: '0.65rem 1.2rem',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid rgba(210,225,245,0.2)',
              color: 'rgba(210,225,245,0.78)',
              textDecoration: 'none',
              fontWeight: 'var(--font-semibold)',
              transition: 'all var(--transition-base)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(210,225,245,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(210,225,245,0.2)';
            }}
          >
            📋 Annuaire →
          </a>
        </div>

        {/* Grille de talents */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--space-4)',
            maxWidth: '700px',
          }}
        >
          {ARTISANS.map((artisan, index) => (
            <div
              key={index}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${0.4 + index * 0.1}s`,
                background: 'linear-gradient(155deg, rgba(11,22,40,0.8), rgba(26,53,96,0.6))',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-5)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'transform var(--transition-base)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Effet de lumière */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at 30% 20%, rgba(74,158,255,0.15) 0%, transparent 65%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Contenu */}
              <div style={{ position: 'relative' }}>
                {/* Emoji */}
                <div 
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                    lineHeight: 1,
                    marginBottom: 'var(--space-4)',
                    filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.4))',
                  }}
                >
                  {artisan.emoji}
                </div>

                {/* Badge expérience */}
                <div 
                  style={{
                    display: 'inline-block',
                    background: 'rgba(74,158,255,0.2)',
                    color: '#4A9EFF',
                    border: '1px solid rgba(74,158,255,0.4)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-bold)',
                    padding: '0.15rem 0.5rem',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  {artisan.exp}
                </div>

                {/* Nom */}
                <div 
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 'var(--font-extrabold)',
                    color: 'white',
                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                    lineHeight: 1.2,
                    marginBottom: '0.15rem',
                  }}
                >
                  {artisan.name}
                </div>

                {/* Job */}
                <div 
                  style={{
                    color: '#4A9EFF',
                    fontWeight: 'var(--font-bold)',
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                    marginBottom: '0.15rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {artisan.job}
                </div>

                {/* Ville */}
                <div 
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  📍 {artisan.city}
                </div>
              </div>

              {/* Ligne décorative */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #4A9EFF, transparent)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
