export default function Home() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>BIG BLU PHARMA PASS</h1>
      <p style={{ color: '#666', maxWidth: 420, marginBottom: 32 }}>
        Plateforme d&apos;accès des travailleurs aux médicaments via un réseau de pharmacies partenaires.
      </p>
      <a
        href="/login"
        style={{
          padding: '12px 28px',
          borderRadius: 8,
          background: '#1a3a6b',
          color: 'white',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Accès Administration
      </a>
    </div>
  );
}
