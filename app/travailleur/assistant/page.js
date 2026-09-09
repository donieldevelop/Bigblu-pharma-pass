'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function AssistantPage() {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'assistant', texte: 'Bonjour ! Je peux t\'aider avec ton crédit, ton abonnement, tes transactions ou la recherche de pharmacies. Que veux-tu savoir ?' },
  ]);
  const [input, setInput] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const finRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return router.push('/travailleur/login');
      setSession(data.session);
    });
  }, [router]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function envoyer(e) {
    e.preventDefault();
    if (!input.trim() || !session) return;
    const question = input.trim();
    setMessages((m) => [...m, { role: 'user', texte: question }]);
    setInput('');
    setEnvoi(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, access_token: session.access_token }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', texte: data.reponse || data.erreur || 'Erreur.' }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', texte: 'Erreur de connexion, réessaie.' }]);
    }
    setEnvoi(false);
  }

  return (
    <div style={{ background: '#EEF2F6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 440, margin: '0 auto', width: '100%', padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 18, color: '#12294D' }}>Assistant</h1>
          <a href="/travailleur" style={{ fontSize: 13, color: '#5B6B82' }}>← Retour</a>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
              <div
                style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: 14,
                  fontSize: 14,
                  background: m.role === 'user' ? '#12294D' : 'white',
                  color: m.role === 'user' ? 'white' : '#12294D',
                }}
              >
                {m.texte}
              </div>
            </div>
          ))}
          <div ref={finRef} />
        </div>

        <form onSubmit={envoyer} style={{ display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pose ta question..."
            style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <button
            type="submit"
            disabled={envoi}
            style={{ padding: '0 20px', borderRadius: 8, border: 'none', background: '#12294D', color: 'white', fontWeight: 600 }}
          >
            {envoi ? '...' : 'Envoyer'}
          </button>
        </form>
      </div>
    </div>
  );
}
