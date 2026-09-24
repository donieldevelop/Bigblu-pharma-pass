'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import CarteRecto from '../../components/CarteRecto';
import { ArrowLeft, Camera } from 'lucide-react';

export default function MaCartePage() {
  const [session, setSession] = useState(null);
  const [profil, setProfil] = useState(null);
  const [carte, setCarte] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/travailleur/login');
      setSession(s.session);
      const uid = s.session.user.id;
      const [{ data: u }, { data: c }] = await Promise.all([
        supabase.from('utilisateurs').select('nom, prenom').eq('id', uid).single(),
        supabase.from('cartes_travailleur').select('*').eq('travailleur_id', uid).order('demandee_le', { ascending: false }).limit(1).maybeSingle(),
      ]);
      setProfil(u);
      setCarte(c);
      setLoading(false);
    })();
  }, [router]);

  if (loading) return null;

  if (!carte) {
    return (
      <div className="ecran">
        <div className="vide">
          <a href="/travailleur/profil" className="retour"><ArrowLeft size={18} /> Retour</a>
          <p>Tu n&apos;as pas encore de carte.</p>
          <a href="/travailleur/demander-carte" className="btn">Demander ma carte</a>
        </div>
        <style jsx>{`
          .ecran { background: #EEF2F6; min-height: 100vh; padding: 20px; }
          .vide { max-width: 400px; margin: 60px auto 0; text-align: center; }
          .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; }
          .vide p { color: #5B6B82; margin: 20px 0; }
          .btn { background: #12294D; color: white; padding: 12px 22px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; }
        `}</style>
      </div>
    );
  }

  const expiree = carte.date_expiration && new Date(carte.date_expiration) < new Date();

  if (expiree) {
    return (
      <div className="ecran">
        <div className="vide">
          <a href="/travailleur/profil" className="retour"><ArrowLeft size={18} /> Retour</a>
          <p>Ta carte a expire (validite 2 ans). Refais ta demande pour obtenir une nouvelle carte.</p>
          <a href="/travailleur/demander-carte" className="btn">Renouveler ma carte</a>
        </div>
        <style jsx>{`
          .ecran { background: #EEF2F6; min-height: 100vh; padding: 20px; }
          .vide { max-width: 380px; margin: 60px auto 0; text-align: center; }
          .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; }
          .vide p { color: #5B6B82; margin: 20px 0; line-height: 1.6; }
          .btn { background: #12294D; color: white; padding: 12px 22px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; }
        `}</style>
      </div>
    );
  }

  const libelleStatutPhysique = {
    en_attente: 'Carte physique : en file d\'impression',
    disponible: 'Carte physique prete - a recuperer au bureau',
    recuperee: 'Carte physique recuperee',
    refusee: 'Carte physique refusee',
  }[carte.statut];

  return (
    <div className="ecran">
      <a href="/travailleur/profil" className="retour"><ArrowLeft size={18} /> Retour</a>

      <div className="zoneCarte">
        <CarteRecto
          photoUrl={carte.photo_url}
          nomComplet={`${profil?.prenom || ''} ${profil?.nom || ''}`}
          matricule={carte.matricule}
          qrValue={session.user.id}
        />
      </div>

      <div className="infosCarte">
        {carte.date_expiration && (
          <p>Valable jusqu&apos;au {new Date(carte.date_expiration).toLocaleDateString('fr-FR')}</p>
        )}
        {libelleStatutPhysique && <p>{libelleStatutPhysique}</p>}
        <a href="/travailleur/changer-photo" className="btnChangerPhoto"><Camera size={15} /> Changer ma photo</a>
      </div>


      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; padding: 20px; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 16px; }

        .zoneCarte { max-width: 430px; margin: 0 auto 16px; filter: drop-shadow(0 14px 22px rgba(5,45,121,0.28)); }

        .infosCarte { max-width: 400px; margin: 0 auto; text-align: center; }
        .infosCarte p { font-size: 11.5px; color: #5B6B82; margin: 4px 0; }
        .btnChangerPhoto { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; padding: 10px 18px; border-radius: 10px; border: 1px solid #12294D; color: #12294D; background: white; text-decoration: none; font-size: 13px; font-weight: 600; }
      `}</style>
    </div>
  );
}
