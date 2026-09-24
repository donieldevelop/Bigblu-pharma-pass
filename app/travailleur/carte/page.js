'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import QrCodeCanvas from '../../components/QrCodeCanvas';
import { ArrowLeft } from 'lucide-react';

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

      <div className="carteRecto">
        <div className="rectoForme" />
        <div className="rectoPlus">+</div>

        <div className="rectoHaut">
          <img src="/logo.png" alt="BIGBLU" className="logoCarte" />
          <div className="slogan">Votre santé,<br />notre priorité</div>
        </div>

        <div className="rectoIdentite">
          <div className="photoBox">
            {carte.photo_url ? <img src={carte.photo_url} alt="" /> : <span>PHOTO</span>}
          </div>
          <div className="infoBox">
            <span className="label">NOM ET PRÉNOM</span>
            <div className="nomCarte">{profil?.prenom} {profil?.nom}</div>
            <div className="traitAccent" />
            <span className="label">MATRICULE</span>
            <div className="matriculeCarte">{carte.matricule}</div>
            <span className="label">STATUT</span>
            <div className="statutBadge">TRAVAILLEUR</div>
          </div>
        </div>

        <div className="qrZone">
          <QrCodeCanvas value={session.user.id} size={110} />
          <span>Présentez cette carte<br />en pharmacie</span>
        </div>

        <div className="rectoBas">
          <span>BIGBLU PHARMA PASS</span>
          <span className="rectoBasDroite">SANTÉ • CONFIANCE • BIEN-ÊTRE</span>
        </div>
      </div>

      <div className="infosCarte">
        {carte.date_expiration && (
          <p>Valable jusqu&apos;au {new Date(carte.date_expiration).toLocaleDateString('fr-FR')}</p>
        )}
        {libelleStatutPhysique && <p>{libelleStatutPhysique}</p>}
      </div>


      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; padding: 20px; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 16px; }

        .carteRecto { position: relative; max-width: 400px; margin: 0 auto 16px; background: linear-gradient(135deg, #ffffff 0%, #eef8ff 48%, #0875ee 49%, #052d79 100%); border-radius: 22px; padding: 20px; overflow: hidden; box-shadow: 0 14px 34px -12px rgba(5,45,121,0.4); min-height: 400px; }
        .rectoForme { position: absolute; width: 260px; height: 130px; right: -60px; bottom: 20px; background: linear-gradient(150deg, #0877f5, #003078); border-radius: 55% 0 0 0; transform: rotate(-8deg); }
        .rectoPlus { position: absolute; right: 16px; top: 20px; font-size: 70px; color: rgba(68,183,255,0.3); font-weight: 700; line-height: 1; }
        .rectoHaut { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
        .logoCarte { height: 30px; }
        .slogan { font-size: 11px; line-height: 1.3; font-style: italic; color: #082c72; border-left: 2px solid #0875ee; padding-left: 8px; text-align: left; }
        .rectoIdentite { position: relative; z-index: 2; display: flex; gap: 12px; margin-bottom: 16px; }
        .photoBox { width: 78px; height: 100px; border-radius: 10px; background: #d6e1f0; border: 2px solid #fff; flex-shrink: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .photoBox img { width: 100%; height: 100%; object-fit: cover; }
        .photoBox span { color: #7184a0; font-size: 9px; font-weight: 700; letter-spacing: 1px; }
        .infoBox { flex: 1; min-width: 0; }
        .label { display: block; font-size: 8.5px; letter-spacing: 1.5px; color: #153d82; margin-bottom: 2px; }
        .nomCarte { font-size: 15px; font-weight: 800; color: #082c72; margin-bottom: 8px; line-height: 1.15; }
        .traitAccent { width: 50px; height: 3px; border-radius: 4px; background: #0875ee; margin-bottom: 8px; }
        .matriculeCarte { font-size: 12px; font-weight: 800; color: #082c72; margin-bottom: 8px; }
        .statutBadge { display: inline-flex; align-items: center; padding: 5px 12px; border-radius: 7px; background: #0868ee; color: #fff; font-size: 10.5px; font-weight: 800; }
        .qrZone { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 6px; background: #fff; border-radius: 16px; padding: 12px; margin-bottom: 12px; max-width: 160px; box-shadow: 0 6px 16px -4px rgba(0,35,90,0.15); }
        .qrZone span { font-size: 9.5px; color: #082c72; font-weight: 700; text-align: center; line-height: 1.25; }
        .rectoBas { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center; font-size: 8px; letter-spacing: 1px; font-weight: 700; color: #082c72; }
        .rectoBasDroite { color: #fff; }

        .infosCarte { max-width: 400px; margin: 0 auto; text-align: center; }
        .infosCarte p { font-size: 11.5px; color: #5B6B82; margin: 4px 0; }
      `}</style>
    </div>
  );
}
