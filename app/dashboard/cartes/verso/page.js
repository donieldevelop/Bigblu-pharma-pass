'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { ArrowLeft, Printer } from 'lucide-react';
import CarteVerso from '../../../components/CarteVerso';

export default function VersoCartePage() {
  const [parametres, setParametres] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/login');
      const { data } = await supabase.from('parametres_carte').select('*').eq('id', 1).maybeSingle();
      setParametres(data);
      setLoading(false);
    })();
  }, [router]);

  if (loading) return null;

  return (
    <div className="ecran">
      <div className="barreOutils">
        <a href="/dashboard/cartes" className="retour"><ArrowLeft size={16} /> Retour aux cartes</a>
        <div className="actionsBarre">
          <a href="/dashboard/parametres" className="lienParametres">Modifier les coordonnées</a>
          <button onClick={() => window.print()} className="btnImprimer"><Printer size={15} /> Imprimer</button>
        </div>
      </div>

      <div className="apercu">
        <CarteVerso telephone={parametres?.telephone_service_client} siteWeb={parametres?.site_web} />
      </div>
      <p className="note">Verso universel, identique pour toutes les cartes. Format d&apos;impression : 85,6 × 54 mm.</p>

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; padding: 20px; }
        .barreOutils { max-width: 500px; margin: 0 auto 20px; display: flex; justify-content: space-between; align-items: center; }
        .retour { display: inline-flex; align-items: center; gap: 6px; background: white; color: #12294D; border: 1px solid #12294D; padding: 8px 14px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; }
        .actionsBarre { display: flex; align-items: center; gap: 14px; }
        .lienParametres { font-size: 12.5px; color: #12294D; text-decoration: underline; }
        .btnImprimer { display: flex; align-items: center; gap: 6px; background: #12294D; color: white; border: none; padding: 8px 14px; border-radius: 8px; font-size: 12.5px; cursor: pointer; }

        .apercu { max-width: 500px; margin: 0 auto; filter: drop-shadow(0 14px 22px rgba(5,45,121,0.25)); }
        .note { text-align: center; font-size: 12px; color: #5B6B82; margin-top: 14px; }

        @media print {
          @page { size: 85.6mm 54mm; margin: 0; }
          .barreOutils, .note { display: none; }
          .ecran { background: white; padding: 0; min-height: 0; }
          .apercu { max-width: none; width: 85.6mm; margin: 0; filter: none; }
        }
      `}</style>
    </div>
  );
}
