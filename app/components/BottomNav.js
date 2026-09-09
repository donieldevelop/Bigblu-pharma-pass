'use client';

import { Home, ScanLine, Receipt, User } from 'lucide-react';

export default function BottomNav({ actif }) {
  const items = [
    { id: 'accueil', label: 'Accueil', href: '/travailleur', Icon: Home },
    { id: 'scanner', label: 'Scanner', href: '/travailleur/scanner', Icon: ScanLine },
    { id: 'achats', label: 'Mes achats', href: '/travailleur/historique', Icon: Receipt },
    { id: 'profil', label: 'Mon profil', href: '/travailleur/profil', Icon: User },
  ];

  return (
    <nav className="bottomNav">
      {items.map(({ id, label, href, Icon }) => (
        <a key={id} href={href} className={`navItem ${actif === id ? 'navItemActif' : ''}`}>
          <Icon size={20} strokeWidth={actif === id ? 2.4 : 1.8} />
          <span>{label}</span>
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
          gap: 3px;
          font-size: 11px;
          color: #8393a8;
          text-decoration: none;
        }
        .navItemActif {
          color: #12294d;
          font-weight: 600;
        }
      `}</style>
    </nav>
  );
}
