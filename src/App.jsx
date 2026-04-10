import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xupwyckrdonuyxkjswfh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cHd5Y2tyZG9udXl4a2pzd2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0Mjk0NTEsImV4cCI6MjA5MTAwNTQ1MX0.cgjCs7rlxeoudKimVHj6KOyr1VyznbVtJ3Dj5ekrcHc'
)

export default function App() {
  const [talents, setTalents] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nom, setNom] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { chargerTalents() }, [])

  async function chargerTalents() {
    setLoading(true)
    const { data, error } = await supabase
      .from('talents')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    if (error) setMessage('Erreur: ' + error.message)
    else setTalents(data || [])
    setLoading(false)
  }

  async function inscrire() {
    setMessage('')
    if (!email || !password || !nom) { setMessage('Remplis tous les champs'); return }
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: nom } }
    })
    if (error) setMessage('Erreur: ' + error.message)
    else {
      setMessage('Inscription reussie ! Bienvenue ' + nom)
      setEmail(''); setPassword(''); setNom('')
      setTimeout(() => chargerTalents(), 2000)
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: 20, background: '#0f2544', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ color: '#c8a84b', textAlign: 'center' }}>🌍 TalentProof Africa</h1>

      <div style={{ background: '#1a3a6b', borderRadius: 12, padding: 20, marginBottom: 30 }}>
        <h2 style={{ color: '#c8a84b' }}>📝 Inscription</h2>
        <input placeholder="Ton nom complet" value={nom} onChange={e => setNom(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: 'none', boxSizing: 'border-box' }} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: 'none', boxSizing: 'border-box' }} />
        <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: 'none', boxSizing: 'border-box' }} />
        <button onClick={inscrire}
          style={{ background: '#c8a84b', color: '#0f2544', padding: '12px 30px', borderRadius: 8, border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
          S'inscrire sur TalentProof
        </button>
        {message && <p style={{ marginTop: 10, color: message.includes('Erreur') ? '#ff6b6b' : '#51cf66' }}>{message}</p>}
      </div>

      <h2 style={{ color: '#c8a84b' }}>👥 Talents inscrits ({talents.length})</h2>
      <button onClick={chargerTalents}
        style={{ background: '#c8a84b', color: '#0f2544', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: 20 }}>
        🔄 Rafraîchir
      </button>

      {loading ? <p style={{ textAlign: 'center' }}>Chargement...</p>
        : talents.length === 0 ? <p style={{ textAlign: 'center', color: '#aaa' }}>Aucun talent encore. Sois la première !</p>
        : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {talents.map(t => (
              <div key={t.id} style={{ background: '#1a3a6b', borderRadius: 12, padding: 16, border: '1px solid #c8a84b33' }}>
                <div style={{ fontSize: 32, textAlign: 'center' }}>{t.avatar_emoji || '👤'}</div>
                <h3 style={{ color: '#c8a84b', textAlign: 'center', margin: '8px 0 4px' }}>{t.name}</h3>
                <p style={{ textAlign: 'center', color: '#aaa', fontSize: 13, margin: 0 }}>{t.role || 'Talent'}</p>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#888', margin: '4px 0 0' }}>{t.country} {t.flag}</p>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}