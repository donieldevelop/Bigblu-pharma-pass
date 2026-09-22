'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import BottomNav from '../../components/BottomNav';
import { User, Mail, Phone, LogOut, KeyRound } from 'lucide-react';

export default function ProfilPage() {
  const [profil, setProfil] = useState(null);
  const [afficherMdp, setAfficherMdp] = useState(false);
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmationMdp, setConfirmationMdp] = useState('');
  const [mdpError, setMdpError] = useState('');
  const [mdpOk, setMdpOk] = useState(false);
  const [envoiMdp, setEnvoiMdp] = useState(false);
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

  async function changerMotDePasse(e) {
    e.preventDefault();
    setMdpError('');
    setMdpOk(false);
    if (nouveauMdp.length < 6) {
      return setMdpError('6 caractères minimum.');
    }
    if (nouveauMdp !== confirmationMdp) {
      return setMdpError('Les deux mots de passe ne correspondent pas.');
    }
    setEnvoiMdp(true);
    const { error } = await supabase.auth.updateUser({ password: nouveauMdp });
    setEnvoiMdp(false);
    if (error) return setMdpError(error.message);
    setMdpOk(true);
    setNouveauMdp('');
    setConfirmationMdp('');
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

        <a href="/travailleur/carte" className="lienCarte">Ma carte BIGBLU PHARMA PASS</a>

        <button onClick={() => setAfficherMdp(!afficherMdp)} className="lienMdp">
          <KeyRound size={16} /> Changer mon mot de passe
        </button>

        {afficherMdp && (
          <form onSubmit={changerMotDePasse} className="formMdp">
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={nouveauMdp}
              onChange={(e) => setNouveauMdp(e.target.value)}
              required
              className="inputMdp"
            />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmationMdp}
              onChange={(e) => setConfirmationMdp(e.target.value)}
              required
              className="inputMdp"
            />
            {mdpError && <p className="mdpMsgErreur">{mdpError}</p>}
            {mdpOk && <p className="mdpMsgOk">Mot de passe mis à jour ✓</p>}
            <button type="submit" disabled={envoiMdp} className="btnMdp">
              {envoiMdp ? '...' : 'Valider'}
            </button>
          </form>
        )}

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
        .lienCarte { display: block; text-align: center; background: #12294D; color: white; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; margin-bottom: 12px; }
        .lienMdp { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: white; color: #12294D; border: 1px solid #D7DFE8; padding: 14px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; margin-bottom: 12px; }
        .formMdp { background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
        .inputMdp { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #D7DFE8; font-size: 13px; margin-bottom: 10px; }
        .mdpMsgErreur { color: #c0392b; font-size: 12.5px; margin: 0 0 10px; }
        .mdpMsgOk { color: #0E7C3F; font-size: 12.5px; margin: 0 0 10px; }
        .btnMdp { width: 100%; background: #12294D; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; }
      `}</style>
    </div>
  );
}
