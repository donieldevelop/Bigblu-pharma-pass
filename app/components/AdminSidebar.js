'use client';

import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import {
  LayoutDashboard, Users, Building2, Receipt, Wallet, CreditCard,
  ScrollText, Bell, IdCard, UserCog, LogOut,
} from 'lucide-react';

const liens = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/dashboard/travailleurs', label: 'Travailleurs', icon: Users },
  { href: '/dashboard/pharmacies', label: 'Pharmacies', icon: Building2 },
  { href: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
  { href: '/dashboard/recouvrement', label: 'Recouvrement', icon: Wallet },
  { href: '/dashboard/cartes', label: 'Cartes', icon: CreditCard },
  { href: '/dashboard/agents', label: 'Agents commerciaux', icon: UserCog },
  { href: '/dashboard/journaux', label: 'Journaux', icon: ScrollText },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <nav className="sidebar">
      <div className="marque">
        <img src="/logo.png" alt="BIGBLU" className="logo" />
        <div>
          <strong>BIGBLU</strong>
          <span>Espace Administrateur</span>
        </div>
      </div>

      <div className="liens">
        {liens.filter((l) => !l.hidden).map((l) => {
          const Icon = l.icon;
          const actif = pathname === l.href;
          return (
            <a key={l.href} href={l.href} className={'lien' + (actif ? ' actif' : '')}>
              <Icon size={17} />
              <span>{l.label}</span>
            </a>
          );
        })}
      </div>

      <button onClick={logout} className="deconnexion">
        <LogOut size={17} /> Déconnexion
      </button>

      <style jsx>{`
        .sidebar { width: 232px; background: #0B1B33; min-height: 100vh; padding: 22px 14px; display: flex; flex-direction: column; position: sticky; top: 0; }
        .marque { display: flex; align-items: center; gap: 10px; padding: 0 8px 22px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 16px; }
        .logo { width: 30px; height: 30px; object-fit: contain; }
        .marque strong { display: block; color: white; font-family: var(--font-display), sans-serif; font-size: 15px; letter-spacing: 0.02em; }
        .marque span { display: block; color: rgba(255,255,255,0.55); font-size: 11px; }
        .liens { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .lien { display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 9px; color: rgba(255,255,255,0.68); text-decoration: none; font-size: 13.5px; }
        .lien.actif { background: rgba(217,142,59,0.16); color: #F0C48A; }
        .deconnexion { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px; background: none; border: none; color: rgba(255,255,255,0.5); font-size: 13px; cursor: pointer; margin-top: 8px; }
      `}</style>
    </nav>
  );
}
