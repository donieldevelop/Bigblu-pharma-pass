'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import BottomNav from '../../components/BottomNav';
import { User, Mail, Phone, LogOut } from 'lucide-react';

export default function ProfilPage() {
  const [profil, setProfil] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/travailleur/login');
      const { data: u } = await supabase.from('utilisateurs').select('*').eq('id', s.session.user.id).single();
      setProfil(u);
    })();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push('/travailleur/login');
  }

  const initiale = (profil?.prenom || profil?.email || '?').charAt(0).toUpperCase();

  return (
    <div className="screen">
      <div className="content">
        <h1 className="titre">Mon profil</h1>

        <div className="avatarBlock">
          <div className="avatar">{initiale}</div>
          <strong>{profil?.prenom} {profil?.nom}</strong>
          <span className="statut">{profil?.statut}</span>
        </div>

        <div className="carte">
          <div className="ligne"><Mail size={18} /><span>{profil?.email}</span></div>
          <div className="ligne"><Phone size={18} /><span>{profil?.telephone || '—'}</span></div>
        </div>

        <button onClick={logout} className="deconnexion">
          <LogOut size={18} /> Se déconnecter
        </button>
      </div>
      <BottomNav actif="profil" />

      <style jsx>{`
        .screen { background: #EEF2F6; min-height: 100vh; }
        .content { max-width: 480px; margin: 0 auto; padding: 20px 20px 100px; }
        .titre { font-size: 20px; margin: 0 0 20px; color: #12294D; }
        .avatarBlock { display: flex; flex-direction: column; align-items: center; gap: 6px; margin-bottom: 20px; }
        .avatar { width: 64px; height: 64px; border-radius: 50%; background: #12294D; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px; }
        .avatarBlock strong { color: #12294D; font-size: 16px; }
        .statut { font-size: 12px; color: #8393A8; }
        .carte { background: white; border-radius: 14px; padding: 6px 16px; margin-bottom: 20px; }
        .ligne { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid #F0F2F5; color: #12294D; font-size: 14px; }
        .ligne:last-child { border-bottom: none; }
        .deconnexion { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: white; color: #B8324D; border: none; padding: 14px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; }
      `}</style>
    </div>
  );
}
