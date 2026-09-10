import RegisterSW from './components/RegisterSW';

export const metadata = {
  title: 'BIGBLU PHARMA PASS',
  description: 'Plateforme d\'accès des travailleurs aux médicaments via un réseau de pharmacies partenaires',
  manifest: '/manifest.json',
  icons: { apple: '/icon-192.png', icon: '/favicon.png' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#12294D',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, background: '#f5f6f8' }}>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
