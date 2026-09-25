'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import CarteRecto from '../../../components/CarteRecto';
import { ArrowLeft, Printer } from 'lucide-react';

function RectoImprimable() {
  const [carte, setCarte] = useState(null);
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id');

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/login');
      if (!id) { setErreur('Aucune carte sélectionnée.'); setLoading(false); return; }
      const { data, error } = await supabase
        .from('cartes_travailleur')
        .select('id, travailleur_id, photo_url, matricule, utilisateurs!travailleur_id(nom, prenom)')
        .eq('id', id)
        .maybeSingle();
      if (error) setErreur(error.message);
      else if (!data) setErreur('Carte introuvable.');
      setCarte(data);
      setLoading(false);
    })();
  }, [id, router]);

  if (loading) return null;

  return (
    <div className="ecran">
      <div className="barreOutils">
        <a href="/dashboard/cartes" className="retour"><ArrowLeft size={18} /> Retour</a>
        {carte && (
          <button onClick={() => window.print()} className="btnImprimer"><Printer size={15} /> Imprimer</button>
        )}
      </div>

      {erreur && <p className="erreur">{erreur}</p>}

      {carte && (
        <>
          <div className="apercu">
            <CarteRecto
              photoUrl={carte.photo_url}
              nomComplet={`${carte.utilisateurs?.prenom || ''} ${carte.utilisateurs?.nom || ''}`}
              matricule={carte.matricule}
              qrValue={carte.travailleur_id}
            />
          </div>
          <p className="note">Format d&apos;impression : 85,6 × 54 mm (carte bancaire standard).</p>
        </>
      )}

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; padding: 20px; }
        .barreOutils { max-width: 500px; margin: 0 auto 20px; display: flex; justify-content: space-between; align-items: center; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; }
        .btnImprimer { display: flex; align-items: center; gap: 6px; background: #12294D; color: white; border: none; padding: 8px 14px; border-radius: 8px; font-size: 12.5px; cursor: pointer; }
        .apercu { max-width: 500px; margin: 0 auto; }
        .note { text-align: center; font-size: 12px; color: #5B6B82; margin-top: 14px; }
        .erreur { text-align: center; color: #c0392b; }
        @media print {
          @page { size: 85.6mm 54mm; margin: 0; }
          .barreOutils, .note { display: none; }
          .ecran { background: white; padding: 0; min-height: 0; }
          .apercu { max-width: none; width: 85.6mm; margin: 0; }
        }
      `}</style>
    </div>
  );
}

export default function RectoImprimablePage() {
  return (
    <Suspense fallback={null}>
      <RectoImprimable />
    </Suspense>
  );
}
