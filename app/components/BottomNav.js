'use client';

export default function BottomNav({ actif }) {
  const items = [
    { id: 'accueil', label: 'Accueil', href: '/travailleur', icon: '🏠' },
    { id: 'pharmacies', label: 'Pharmacies', href: '/travailleur/pharmacies', icon: '💊' },
    { id: 'historique', label: 'Historique', href: '/travailleur/historique', icon: '📄' },
    { id: 'profil', label: 'Profil', href: '/travailleur/profil', icon: '👤' },
  ];

  return (
    <nav className="bottomNav">
      {items.map((it) => (
        <a key={it.id} href={it.href} className={`navItem ${actif === it.id ? 'navItemActif' : ''}`}>
          <span className="navIcon">{it.icon}</span>
          <span>{it.label}</span>
        </a>
      ))}
      <style jsx>{`
        .bottomNav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          display: flex;
          justify-content: space-around;
          padding: 10px 0 calc(10px + env(safe-area-inset-bottom));
          border-top: 1px solid #e4e8ee;
          z-index: 10;
        }
        .navItem {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 11px;
          color: #8393a8;
          text-decoration: none;
        }
        .navItemActif {
          color: #12294d;
          font-weight: 600;
        }
        .navIcon {
          font-size: 18px;
        }
      `}</style>
    </nav>
  );
}
