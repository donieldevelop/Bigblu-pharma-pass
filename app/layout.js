import RegisterSW from './components/RegisterSW';

export const metadata = {
  title: 'BIG BLU PHARMA PASS',
  description: 'Plateforme d\'accès des travailleurs aux médicaments via un réseau de pharmacies partenaires',
  manifest: '/manifest.json',
  themeColor: '#12294D',
  icons: { apple: '/icon-192.png' },
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
