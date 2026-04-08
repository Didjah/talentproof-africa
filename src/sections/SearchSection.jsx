// ═══════════════════════════════════════════════════════
// TALENTPROOF - SEARCH SECTION
// Barre de recherche intelligente avec suggestions
// ═══════════════════════════════════════════════════════

'use client';

import { useState, useRef } from 'react';
import { useTalentsActions, useTalentsPagination } from '../store/useTalentStore';

export default function SearchSection() {
  const [searchValue, setSearchValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  
  const { searchTalents, setSearchQuery } = useTalentsActions();
  const { total } = useTalentsPagination();

  const SUGGESTIONS = [
    'Chauffeur',
    'Aide ménagère',
    'Gardien',
    'Couturière',
    'Mécanicien',
    'Électricien',
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      searchTalents(searchValue.trim());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion);
    searchTalents(suggestion);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSearchValue('');
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <section 
      style={{
        background: 'white',
        borderBottom: '1px solid var(--gray-200)',
        padding: 'var(--space-6) 0',
        position: 'sticky',
        top: '58px',
        zIndex: 'var(--z-sticky)',
      }}
    >
      <div className="container">
        {/* Barre de recherche principale */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            background: focused ? 'white' : 'var(--gray-50)',
            border: `2px solid ${focused ? 'var(--primary-700)' : 'var(--gray-200)'}`,
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-3) var(--space-4)',
            transition: 'all var(--transition-base)',
            boxShadow: focused ? '0 0 0 4px rgba(27,107,71,0.1)' : 'none',
          }}
        >
          {/* Icône de recherche */}
          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>🔍</span>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Métier, compétence, ville ou nom…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
              color: 'var(--gray-900)',
              fontFamily: 'var(--font-body)',
              minWidth: 0,
            }}
          />

          {/* Bouton clear */}
          {searchValue && (
            <button
              onClick={handleClear}
              style={{
                background: 'var(--gray-100)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                color: 'var(--gray-600)',
                fontSize: 'var(--text-sm)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--gray-200)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--gray-100)';
              }}
            >
              ✕
            </button>
          )}

          {/* Bouton recherche (mobile) */}
          <button
            onClick={() => searchValue.trim() && searchTalents(searchValue.trim())}
            className="btn-primary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: 'var(--text-sm)',
              display: 'none',
            }}
          >
            Rechercher
          </button>
        </div>

        {/* Suggestions */}
        {!searchValue && (
          <div 
            className="animate-fade-in"
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              flexWrap: 'wrap',
              marginTop: 'var(--space-3)',
              alignItems: 'center',
            }}
          >
            <span 
              style={{
                color: 'var(--gray-500)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
              }}
            >
              Essaie :
            </span>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  background: 'var(--success-light)',
                  color: 'var(--primary-700)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-700)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--success-light)';
                  e.currentTarget.style.color = 'var(--primary-700)';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Message d'encouragement */}
        {!searchValue && (
          <div 
            className="animate-fade-in delay-100"
            style={{
              background: 'linear-gradient(135deg, #FEF9EE, #FFF7E0)',
              border: '1.5px solid var(--gold-600)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              marginTop: 'var(--space-4)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
            }}
          >
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>💡</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div 
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--gold-900)',
                  marginBottom: '0.25rem',
                }}
              >
                Pas besoin de diplôme
              </div>
              <div 
                style={{
                  color: 'var(--gold-800)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.5,
                }}
              >
                Une photo ou un vocal de 60 sec suffit.{' '}
                <strong>Tu as ta place ici.</strong>
              </div>
            </div>
          </div>
        )}

        {/* Compteur de résultats */}
        {searchValue && total > 0 && (
          <div 
            className="animate-fade-in"
            style={{
              marginTop: 'var(--space-3)',
              fontSize: 'var(--text-sm)',
              color: 'var(--gray-600)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <span 
              style={{
                background: 'var(--success-light)',
                color: 'var(--primary-700)',
                fontWeight: 'var(--font-bold)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
              }}
            >
              {total}
            </span>
            résultat{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
          </div>
        )}

        {/* Message aucun résultat */}
        {searchValue && total === 0 && (
          <div 
            className="animate-fade-in"
            style={{
              marginTop: 'var(--space-3)',
              fontSize: 'var(--text-sm)',
              color: 'var(--gray-600)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <span 
              style={{
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                fontWeight: 'var(--font-bold)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
              }}
            >
              0
            </span>
            Aucun résultat — essaie « Gardien » ou « Chauffeur »
          </div>
        )}
      </div>

      {/* Styles responsive */}
      <style jsx>{`
        @media (max-width: 640px) {
          .btn-primary {
            display: inline-flex !important;
          }
        }
      `}</style>
    </section>
  );
}
