'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import QrCodeCanvas from '../../components/QrCodeCanvas';
import { ArrowLeft, Share2 } from 'lucide-react';

export default function QrCodePage() {
  const [session, setSession] = useState(null);
  const [profil, setProfil] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return router.push('/travailleur/login');
      setSession(data.session);
      const { data: u } = await supabase.from('utilisateurs').select('nom, prenom').eq('id', data.session.user.id).single();
      setProfil(u);
    });
  }, [router]);

  async function partager() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mon QR Code BIGBLU PHARMA PASS', text: session?.user?.id });
      } catch {}
    }
  }

  if (!session) return null;

  return (
    <div className="screen">
      <a href="/travailleur" className="retour"><ArrowLeft size={18} /> Retour</a>
      <div className="carte">
        <p className="nom">{profil?.prenom} {profil?.nom}</p>
        <p className="souscription">Mon QR Code — à présenter en pharmacie</p>
        <div className="qrWrap">
          <QrCodeCanvas value={session.user.id} size={220} />
        </div>
        <button onClick={partager} className="partager"><Share2 size={16} /> Partager mon QR Code</button>
      </div>

      <style jsx>{`
        .screen { background: #EEF2F6; min-height: 100vh; padding: 20px; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 20px; }
        .carte { max-width: 380px; margin: 40px auto 0; background: white; border-radius: 16px; padding: 32px 24px; text-align: center; }
        .nom { font-weight: 700; color: #12294D; margin: 0; }
        .souscription { font-size: 12.5px; color: #8393A8; margin: 4px 0 20px; }
        .qrWrap { display: inline-block; padding: 16px; border: 1px solid #EEF2F6; border-radius: 12px; margin-bottom: 20px; }
        .partager { display: inline-flex; align-items: center; gap: 8px; background: #12294D; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-size: 13px; cursor: pointer; }
      `}</style>
    </div>
  );
}
