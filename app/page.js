'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: '#EEF2F6', minHeight: '100vh', color: '#12294D', overflow: 'hidden' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 48px',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.2 }}>BIG BLU PHARMA PASS</span>
        <span style={{ fontSize: 13, color: '#5B6B82' }}>Un service BIG HOLDING SA</span>
      </header>

      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '40px 48px 72px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 56,
          alignItems: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <div>
          <h1 style={{ fontSize: 44, lineHeight: 1.12, fontWeight: 800, margin: '0 0 20px', maxWidth: 480 }}>
            Le crédit médicament de vos travailleurs, réglé en pharmacie.
          </h1>
          <p style={{ fontSize: 17, color: '#3E4C63', maxWidth: 460, lineHeight: 1.6, margin: '0 0 12px' }}>
            Chaque travailleur abonné dispose d&apos;un plafond mensuel qu&apos;il utilise directement
            chez une pharmacie partenaire, identifié par son QR Code personnel.
          </p>
          <p style={{ fontSize: 14, color: '#5B6B82' }}>Réseau de pharmacies partenaires en expansion.</p>
        </div>

        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            background: 'linear-gradient(135deg, #12294D 0%, #1F4478 100%)',
            borderRadius: 16,
            padding: 28,
            color: 'white',
            maxWidth: 360,
            marginLeft: 'auto',
            boxShadow: hover ? '0 28px 50px -14px rgba(18,41,77,0.45)' : '0 20px 40px -12px rgba(18,41,77,0.35)',
            transform: hover ? 'translateY(-4px) rotate(-0.5deg)' : 'translateY(0) rotate(0)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
            <span style={{ fontSize: 12, letterSpacing: 0.6, opacity: 0.75 }}>PHARMA PASS</span>
            <div style={{ width: 32, height: 24, borderRadius: 4, background: '#D98E3B' }} />
          </div>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>Plafond mensuel</div>
          <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 28 }}>30 000 FCFA</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.75 }}>
            <span>Abonnement 1 500 F/mois</span>
            <span>BIG HOLDING SA</span>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: '#D7DFE8' }}>
          <EspaceCard
            titre="Travailleur"
            texte="Ton crédit disponible, ton QR Code, tes reçus et l'historique de tes médicaments, directement depuis ton téléphone."
            accent="#12294D"
            badge="Bientôt sur mobile"
          />
          <EspaceCard
            titre="Pharmacie partenaire"
            texte="Identifie le travailleur, enregistre les médicaments délivrés et valide la transaction en quelques secondes."
            accent="#D98E3B"
            lien="/pharmacie/login"
            lienTexte="Se connecter"
          />
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #D7DFE8', padding: '24px 48px', textAlign: 'center', fontSize: 12, color: '#8393A8' }}>
        BIG BLU PHARMA PASS — BIG HOLDING SA
      </footer>
    </div>
  );
}

function EspaceCard({ titre, texte, accent, lien, lienTexte, badge }) {
  return (
    <div style={{ background: '#EEF2F6', padding: '28px 26px', borderLeft: `3px solid ${accent}` }}>
      <h3 style={{ fontSize: 16, margin: '0 0 10px' }}>{titre}</h3>
      <p style={{ fontSize: 13.5, color: '#3E4C63', lineHeight: 1.55, margin: '0 0 16px' }}>{texte}</p>
      {lien && (
        <a href={lien} style={{ fontSize: 13, fontWeight: 600, color: accent, textDecoration: 'none' }}>
          {lienTexte} →
        </a>
      )}
      {badge && (
        <span style={{ fontSize: 12, fontWeight: 600, color: accent, border: `1px solid ${accent}55`, padding: '4px 10px', borderRadius: 20 }}>
          {badge}
        </span>
      )}
    </div>
  );
}
