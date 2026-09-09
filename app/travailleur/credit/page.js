'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';

export default function CreditDetailPage() {
  const [credit, setCredit] = useState(null);
  const [abonnement, setAbonnement] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/travailleur/login');
      const uid = s.session.user.id;
      const [{ data: c }, { data: a }] = await Promise.all([
        supabase.from('credits').select('*').eq('travailleur_id', uid).maybeSingle(),
        supabase.from('abonnements').select('*').eq('travailleur_id', uid).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ]);
      setCredit(c);
      setAbonnement(a);
      setLoading(false);
    })();
  }, [router]);

  if (loading) return null;

  const disponible = credit ? credit.plafond - credit.montant_utilise : 0;

  const lignes = [
    ['Plafond mensuel', `${credit?.plafond ?? 0} FCFA`],
    ['Montant utilisé', `${credit?.montant_utilise ?? 0} FCFA`],
    ['Crédit disponible', `${disponible} FCFA`],
    ['Dette en cours', `${credit?.montant_du ?? 0} FCFA`],
    ['Déjà remboursé', `${credit?.montant_rembourse ?? 0} FCFA`],
    ['Statut abonnement', abonnement?.statut || 'non activé'],
    ['Expire le', abonnement?.date_expiration ? new Date(abonnement.date_expiration).toLocaleDateString('fr-FR') : '—'],
  ];

  return (
    <div className="screen">
      <a href="/travailleur" className="retour"><ArrowLeft size={18} /> Retour</a>
      <h1 className="titre">Mon crédit médicament</h1>

      <div className="carte">
        {lignes.map(([label, val]) => (
          <div key={label} className="ligne">
            <span>{label}</span>
            <strong>{val}</strong>
          </div>
        ))}
      </div>

      <style jsx>{`
        .screen { background: #EEF2F6; min-height: 100vh; padding: 20px; max-width: 480px; margin: 0 auto; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 16px; }
        .titre { font-size: 20px; margin: 0 0 16px; color: #12294D; }
        .carte { background: white; border-radius: 14px; padding: 8px 18px; }
        .ligne { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #F0F2F5; font-size: 14px; color: #12294D; }
        .ligne:last-child { border-bottom: none; }
        .ligne span { color: #5B6B82; }
      `}</style>
    </div>
  );
}
