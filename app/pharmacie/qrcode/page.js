'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import QrCodeCanvas from '../../components/QrCodeCanvas';
import PharmacieBottomNav from '../../components/PharmacieBottomNav';
import { ArrowLeft, LogOut } from 'lucide-react';

export default function QrCodePharmaciePage() {
  const [pharmacie, setPharmacie] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/pharmacie/login');
      const { data: p } = await supabase.from('pharmacies').select('*').eq('user_id', s.session.user.id).maybeSingle();
      setPharmacie(p);
    })();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push('/pharmacie/login');
  }

  if (!pharmacie) return null;

  return (
    <div className="ecran">
      <div className="contenu">
        <div className="entete">
          <a href="/pharmacie" className="retour"><ArrowLeft size={18} /> Accueil</a>
          <button onClick={logout} className="deconnexion"><LogOut size={15} /></button>
        </div>

        <div className="carteQr">
          <h1>{pharmacie.nom}</h1>
          <p>{pharmacie.adresse}</p>
          <div className="qrBox"><QrCodeCanvas value={pharmacie.qr_code_id} size={220} /></div>
          <p className="aide">À faire scanner par le travailleur pour confirmer qu&apos;il se trouve bien dans cette pharmacie.</p>
        </div>
      </div>

      <PharmacieBottomNav actif="profil" />

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; font-family: var(--font-body), sans-serif; }
        .contenu { max-width: 480px; margin: 0 auto; padding: 20px 20px 100px; }
        .entete { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; }
        .deconnexion { background: none; border: none; color: #B8324D; cursor: pointer; }
        .carteQr { background: white; border-radius: 16px; padding: 28px 20px; text-align: center; }
        .carteQr h1 { font-family: var(--font-display), sans-serif; font-size: 18px; color: #12294D; margin: 0 0 2px; }
        .carteQr p { color: #8393A8; font-size: 12.5px; margin: 0 0 20px; }
        .qrBox { display: flex; justify-content: center; margin-bottom: 20px; }
        .aide { font-size: 12px; color: #5B6B82; max-width: 300px; margin: 0 auto; }
      `}</style>
    </div>
  );
}
