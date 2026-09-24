import RegisterSW from './components/RegisterSW';
import { Space_Grotesk, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

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
    <html lang="fr" className={spaceGrotesk.variable + ' ' + ibmPlexSans.variable}>
      <body style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', margin: 0, background: '#f5f6f8' }}>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
