'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { ArrowLeft, Printer, Phone } from 'lucide-react';

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
        <a href="/dashboard/cartes" className="retour"><ArrowLeft size={18} /> Retour</a>
        <div className="actionsBarre">
          <a href="/dashboard/parametres" className="lienParametres">Modifier les coordonnées</a>
          <button onClick={() => window.print()} className="btnImprimer"><Printer size={15} /> Imprimer</button>
        </div>
      </div>

      <div className="carteVerso">
        <div className="versoForme" />
        <div className="versoPlus">+</div>

        <div className="versoHaut">
          <img src="/logo.png" alt="BIGBLU" className="logoCarte" />
          <div className="slogan">Votre santé,<br />notre priorité</div>
        </div>

        <div className="versoMain">
          <div className="notice">Carte personnelle et non transférable</div>
          <ul className="regles">
            <li>Cette carte est strictement personnelle.</li>
            <li>Elle doit être présentée lors de l&apos;utilisation du BIGBLU PHARMA PASS.</li>
            <li>En cas de perte ou de problème, veuillez contacter le service client.</li>
            <li>L&apos;utilisation du Pass est soumise aux conditions du service BIGBLU PHARMA PASS.</li>
          </ul>
        </div>

        <div className="tagline">Des travailleurs en bonne santé,<br />des entreprises plus fortes.</div>

        <div className="versoFooter">
          <div className="contact">
            <div className="icone"><Phone size={18} /></div>
            <div>
              <strong>Service client</strong>
              <span>{parametres?.telephone_service_client || '—'}</span>
            </div>
          </div>
          <div className="siteWeb">
            <strong>BIGBLU PHARMA PASS</strong>
            <span>{parametres?.site_web || '—'}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; padding: 20px; }
        .barreOutils { max-width: 500px; margin: 0 auto 20px; display: flex; justify-content: space-between; align-items: center; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; }
        .actionsBarre { display: flex; align-items: center; gap: 14px; }
        .lienParametres { font-size: 12.5px; color: #12294D; text-decoration: underline; }
        .btnImprimer { display: flex; align-items: center; gap: 6px; background: #12294D; color: white; border: none; padding: 8px 14px; border-radius: 8px; font-size: 12.5px; cursor: pointer; }

        .carteVerso { position: relative; max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #eef9ff 0%, #ffffff 43%, #0875ee 44%, #052d79 100%); border-radius: 22px; padding: 22px; overflow: hidden; min-height: 340px; box-shadow: 0 14px 34px -12px rgba(5,45,121,0.4); color: #082c72; }
        .versoForme { position: absolute; width: 340px; height: 130px; right: -80px; top: -30px; background: linear-gradient(145deg, #36b7ff, #0757c8, #052c72); border-radius: 50%; opacity: 0.95; }
        .versoPlus { position: absolute; right: 24px; top: 30px; font-size: 90px; font-weight: 300; color: rgba(80,190,255,0.28); line-height: 1; }
        .versoHaut { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; }
        .logoCarte { height: 28px; }
        .slogan { font-size: 11px; line-height: 1.3; font-style: italic; border-left: 2px solid #0875ee; padding-left: 8px; }
        .versoMain { position: relative; z-index: 2; margin-bottom: 20px; }
        .notice { font-size: 14px; font-weight: 800; margin-bottom: 10px; }
        .regles { margin: 0; padding-left: 16px; font-size: 11px; line-height: 1.7; color: #173d7b; }
        .tagline { position: relative; z-index: 2; text-align: right; font-size: 11px; font-weight: 700; color: #052d79; margin-bottom: 16px; line-height: 1.3; }
        .versoFooter { position: relative; z-index: 2; display: flex; align-items: center; gap: 18px; background: linear-gradient(160deg, #073e9a, #05266b); color: white; border-radius: 14px; padding: 14px 18px; margin: 0 -22px -22px; }
        .contact { display: flex; align-items: center; gap: 10px; }
        .icone { width: 34px; height: 34px; border-radius: 50%; background: white; color: #0868ee; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .contact strong { display: block; font-size: 10px; opacity: 0.85; }
        .contact span { font-size: 12.5px; font-weight: 800; }
        .siteWeb { padding-left: 16px; border-left: 1px solid rgba(255,255,255,0.4); font-size: 11px; }
        .siteWeb strong { display: block; margin-bottom: 2px; }

        @media print {
          .barreOutils { display: none; }
          .ecran { background: white; padding: 0; }
        }
      `}</style>
    </div>
  );
}
