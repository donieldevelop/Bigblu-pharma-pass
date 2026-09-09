export const metadata = {
  title: 'BIG BLU PHARMA PASS — Administration',
  description: 'Back-office BIG BLU PHARMA PASS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, background: '#f5f6f8' }}>
        {children}
      </body>
    </html>
  );
}
