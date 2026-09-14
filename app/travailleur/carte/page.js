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

  if (carte.statut === 'en_attente') {
    return (
      <div className="ecran">
        <div className="vide">
          <a href="/travailleur/profil" className="retour"><ArrowLeft size={18} /> Retour</a>
          <p>Ta demande de carte est en cours de traitement. Tu seras notifié dès qu&apos;elle sera prête.</p>
        </div>
        <style jsx>{`
          .ecran { background: #EEF2F6; min-height: 100vh; padding: 20px; }
          .vide { max-width: 380px; margin: 60px auto 0; text-align: center; }
          .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; }
          .vide p { color: #5B6B82; margin: 20px 0; line-height: 1.6; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ecran">
      <a href="/travailleur/profil" className="retour"><ArrowLeft size={18} /> Retour</a>

      <div className="carteRecto">
        <div className="rectoHaut">
          <img src="/logo.png" alt="BIGBLU" className="logoCarte" />
          <div>
            <div className="titreCarte">BIGBLU PHARMA PASS</div>
            <div className="sousTitreCarte">Votre santé, notre priorité</div>
          </div>
        </div>

        <div className="rectoMilieu">
          <img src={carte.photo_url} alt="" className="photoCarte" />
          <div>
            <div className="nomCarte">{profil?.prenom} {profil?.nom}</div>
            <div className="ligneInfo">Matricule : <strong>{carte.matricule}</strong></div>
            <div className="ligneInfo">Entreprise : <strong>{carte.entreprise}</strong></div>
            <div className="ligneInfo">Statut : <strong>Travailleur</strong></div>
          </div>
        </div>

        <div className="qrZone">
          <QrCodeCanvas value={session.user.id} size={90} />
          <span>Présentez cette carte en pharmacie</span>
        </div>

        <div className="rectoBas">
          BIGBLU PHARMA PASS — SANTÉ · CONFIANCE · BIEN-ÊTRE
        </div>
      </div>

      <div className="carteVerso">
        <img src="/logo.png" alt="BIGBLU" className="logoVerso" />
        <p className="verso1">Cette carte est personnelle et non transférable.</p>
        <ul className="versoListe">
          <li>À présenter à chaque achat en pharmacie partenaire.</li>
          <li>Elle donne accès à votre crédit médicament.</li>
          <li>En cas de perte, contactez le service client.</li>
        </ul>
      </div>

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; padding: 20px; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 16px; }

        .carteRecto { max-width: 400px; margin: 0 auto 20px; background: linear-gradient(135deg, #ffffff 0%, #eef4fc 100%); border-radius: 20px; padding: 20px; box-shadow: 0 10px 30px -10px rgba(18,41,77,0.25); }
        .rectoHaut { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .logoCarte { height: 34px; }
        .titreCarte { font-weight: 800; color: #12294D; font-size: 14px; }
        .sousTitreCarte { font-size: 10.5px; color: #5B6B82; }
        .rectoMilieu { display: flex; gap: 14px; align-items: center; margin-bottom: 16px; }
        .photoCarte { width: 70px; height: 70px; border-radius: 12px; object-fit: cover; }
        .nomCarte { font-weight: 800; color: #12294D; font-size: 15px; margin-bottom: 4px; }
        .ligneInfo { font-size: 11.5px; color: #5B6B82; }
        .qrZone { display: flex; flex-direction: column; align-items: center; gap: 4px; background: #F5F9FD; border-radius: 12px; padding: 12px; margin-bottom: 12px; }
        .qrZone span { font-size: 10.5px; color: #5B6B82; text-align: center; }
        .rectoBas { text-align: center; font-size: 9px; letter-spacing: 0.5px; color: #8393A8; border-top: 1px solid #E4E8EE; padding-top: 10px; }

        .carteVerso { max-width: 400px; margin: 0 auto; background: linear-gradient(135deg, #12294D 0%, #1A3A6B 100%); border-radius: 20px; padding: 24px; color: white; }
        .logoVerso { height: 32px; filter: brightness(0) invert(1); margin-bottom: 14px; }
        .verso1 { font-weight: 700; font-size: 13px; margin: 0 0 10px; }
        .versoListe { margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.7; opacity: 0.9; }
      `}</style>
    </div>
  );
}
