// ═══════════════════════════════════════════════════════
// TALENTPROOF - PAGE D'ACCUEIL (VERSION 2.0)
// Page principale refactorisée et optimisée
// ═══════════════════════════════════════════════════════

'use client';

import { Suspense } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../sections/HeroSection';
import SearchSection from '../sections/SearchSection';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Navigation */}
      <Navbar onInscription={() => window.location.href = '/inscription'} />
      
      {/* Contenu principal */}
      <main>
        {/* Section Hero */}
        <HeroSection />
        
        {/* Section Recherche */}
        <Suspense fallback={<LoadingSearch />}>
          <SearchSection />
        </Suspense>
        
        {/* Message temporaire */}
        <div className="container section">
          <div 
            style={{
              background: 'white',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-12)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>
              🎉
            </div>
            <h2 
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 'var(--font-extrabold)',
                fontSize: 'var(--text-3xl)',
                color: 'var(--gray-900)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Nouvelle page d&apos;accueil en cours !
            </h2>
            <p 
              style={{
                color: 'var(--gray-600)',
                fontSize: 'var(--text-lg)',
                lineHeight: 1.6,
                maxWidth: '600px',
                margin: '0 auto var(--space-6)',
              }}
            >
              Les sections <strong>Hero</strong> et <strong>Search</strong> sont prêtes ! 
              <br />
              Les autres sections (Feed, Vocal, Partenaires) arrivent bientôt.
            </p>
            
            <div 
              style={{
                display: 'flex',
                gap: 'var(--space-3)',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <a href="/annuaire" className="btn-primary">
                📋 Voir l&apos;annuaire
              </a>
              <a href="/inscription" className="btn-secondary">
                + Créer mon profil
              </a>
            </div>

            {/* Checklist de progression */}
            <div 
              style={{
                marginTop: 'var(--space-12)',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                textAlign: 'left',
                maxWidth: '500px',
                margin: 'var(--space-12) auto 0',
              }}
            >
              <h3 
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-lg)',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                📋 Progression de la refonte
              </h3>
              
              <ChecklistItem done label="Design Tokens (variables CSS)" />
              <ChecklistItem done label="Service API" />
              <ChecklistItem done label="Store Zustand" />
              <ChecklistItem done label="Section Hero" />
              <ChecklistItem done label="Section Search" />
              <ChecklistItem label="Section Feed (Talents)" />
              <ChecklistItem label="Section Vocal" />
              <ChecklistItem label="Section Partenaires" />
              <ChecklistItem label="Footer" />
              <ChecklistItem label="Composants de cartes" />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer temporaire */}
      <footer 
        style={{
          background: 'var(--primary-900)',
          color: 'white',
          padding: 'var(--space-8) 0',
          marginTop: 'var(--space-16)',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <div 
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 'var(--font-extrabold)',
              fontSize: 'var(--text-xl)',
              marginBottom: 'var(--space-2)',
              color: 'var(--gold-600)',
            }}
          >
            TalentProof Afrique
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-sm)' }}>
            © 2026 TalentProof — Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COMPOSANTS UTILITAIRES
// ═══════════════════════════════════════════════════════

function LoadingSearch() {
  return (
    <div 
      style={{
        background: 'white',
        borderBottom: '1px solid var(--gray-200)',
        padding: 'var(--space-6) 0',
      }}
    >
      <div className="container">
        <div 
          style={{
            background: 'var(--gray-100)',
            borderRadius: 'var(--radius-xl)',
            height: '56px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );
}

function ChecklistItem({ done, label }) {
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-2) 0',
      }}
    >
      <div 
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '4px',
          background: done ? 'var(--success)' : 'var(--gray-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        {done && '✓'}
      </div>
      <span 
        style={{
          color: done ? 'var(--gray-700)' : 'var(--gray-500)',
          fontSize: 'var(--text-sm)',
          textDecoration: done ? 'line-through' : 'none',
        }}
      >
        {label}
      </span>
    </div>
  );
}
