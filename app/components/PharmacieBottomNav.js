'use client';

import { Home, ScanLine, Receipt, User } from 'lucide-react';

const onglets = [
  { key: 'accueil', href: '/pharmacie', icon: Home, label: 'Accueil' },
  { key: 'scanner', href: '/pharmacie/scanner', icon: ScanLine, label: 'Scanner' },
  { key: 'transactions', href: '/pharmacie/transactions', icon: Receipt, label: 'Transactions' },
  { key: 'profil', href: '/pharmacie/qrcode', icon: User, label: 'Mon QR' },
];

export default function PharmacieBottomNav({ actif }) {
  return (
    <nav className="nav">
      {onglets.map((o) => {
        const Icon = o.icon;
        const estActif = o.key === actif;
        return (
          <a key={o.key} href={o.href} className={'item' + (estActif ? ' actif' : '')}>
            <Icon size={20} />
            <span>{o.label}</span>
          </a>
        );
      })}
      <style jsx>{`
        .nav { position: fixed; bottom: 0; left: 0; right: 0; background: white; display: flex; justify-content: space-around; padding: 10px 0 18px; box-shadow: 0 -2px 10px rgba(0,0,0,0.04); }
        .item { display: flex; flex-direction: column; align-items: center; gap: 3px; text-decoration: none; color: #8393A8; font-size: 10.5px; }
        .item.actif { color: #12294D; }
      `}</style>
    </nav>
  );
}
