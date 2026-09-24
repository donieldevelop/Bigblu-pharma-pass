import RegisterSW from './components/RegisterSW';
import './globals.css';
export const metadata = { title: 'BIGBLU PHARMA PASS', manifest: '/manifest.json', icons: { apple: '/icon-192.png', icon: '/favicon.png' } };
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#12294D' };
export default function RootLayout({ children }) {
  return (<html lang="fr"><body style={{ margin: 0, background: '#f5f6f8' }}><RegisterSW />{children}</body></html>);
}
