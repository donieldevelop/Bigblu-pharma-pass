'use client';

import { useEffect, useState } from 'react';
import { Pill, ShieldCheck, Building2, Users, ChevronRight } from 'lucide-react';

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const badges = [
    { Icon: Pill, texte: 'Un crédit mensuel dédié' },
    { Icon: ShieldCheck, texte: 'Utilisation simple avec QR Code' },
    { Icon: Building2, texte: 'Réseau de pharmacies partenaires' },
    { Icon: Users, texte: 'Pour tous les travailleurs' },
  ];

  return (
    <div className="page">
      <header className="header">
        <img src="/logo.png" alt="BIG BLU HOLDING AFRICA" className="logo" />
        <span className="lang">FR</span>
      </header>

      <section className={`hero ${visible ? 'heroVisible' : ''}`}>
        <div className="heroText">
          <p className="eyebrow">BIG BLU PHARMA PASS</p>
          <h1 className="titre">
            Le <span className="accentBlue">crédit médicament</span> de vos travailleurs,
            réglé en <span className="accentPurple">pharmacie</span>.
          </h1>
          <p className="paragraphe">
            Une solution simple, sécurisée et accessible pour prendre soin de la santé de ceux
            qui font avancer votre entreprise.
          </p>
        </div>

        <div className="heroVisuelWrap">
          <div className="heroVisuel">
            <Pill size={64} strokeWidth={1.2} />
          </div>
          <div className="bulle">
            <strong>Votre santé, notre priorité</strong>
            <span>Des pharmacies partenaires près de vous.</span>
          </div>
        </div>
      </section>

      <section className="badges">
        {badges.map((b) => (
          <div key={b.texte} className="badge">
            <div className="badgeIcone"><b.Icon size={22} /></div>
            <span>{b.texte}</span>
          </div>
        ))}
      </section>

      <section className="boutons">
        <a href="/travailleur/login" className="boutonPrimaire">
          Se connecter <ChevronRight size={18} />
        </a>
        <a href="/travailleur/inscription" className="boutonSecondaire">
          Créer un compte <ChevronRight size={18} />
        </a>
      </section>

      <section className="bas">
        <div className="basContenu">
          <div className="passCard">
            <div className="passCardTop">
              <span className="passCardLabel">BIGBLU PHARMA PASS</span>
              <div className="passCardChip" />
            </div>
            <div className="passCardCaption">Plafond mensuel</div>
            <div className="passCardAmount">30 000 FCFA</div>
            <div className="passCardFooter">
              <span>Abonnement : 1 500 F/mois</span>
              <span>BIG HOLDING SA</span>
            </div>
          </div>
          <p className="tagline">Des travailleurs en bonne santé, des entreprises plus fortes.</p>
        </div>
        <p className="proEspace">
          Vous êtes une pharmacie partenaire ? <a href="/pharmacie/login">Accéder à votre espace</a>
        </p>
      </section>

      <style jsx>{`
        .page { background: #EEF2F6; min-height: 100vh; color: #12294D; overflow-x: hidden; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px; max-width: 1100px; margin: 0 auto; }
        .logo { height: 44px; width: auto; }
        .lang { font-size: 13px; font-weight: 600; color: #5B6B82; }

        .hero { max-width: 1100px; margin: 0 auto; padding: 12px 20px 32px; display: flex; flex-direction: column; gap: 24px;
          opacity: 0; transform: translateY(14px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .heroVisible { opacity: 1; transform: translateY(0); }
        .eyebrow { font-size: 12px; letter-spacing: 0.6px; color: #8393A8; margin: 0 0 8px; text-transform: uppercase; }
        .titre { font-size: 28px; line-height: 1.25; font-weight: 800; margin: 0 0 14px; }
        .accentBlue { color: #2E7BC4; }
        .accentPurple { color: #6C4FB3; }
        .paragraphe { font-size: 14.5px; color: #3E4C63; line-height: 1.6; margin: 0; }

        .heroVisuelWrap { position: relative; }
        .heroVisuel { background: linear-gradient(135deg, #DCE7F7 0%, #C9D9EF 100%); border-radius: 18px; height: 200px;
          display: flex; align-items: center; justify-content: center; color: #6C88B0; }
        .bulle { position: absolute; bottom: -16px; right: 16px; background: white; border-radius: 12px; padding: 12px 16px;
          box-shadow: 0 8px 20px -6px rgba(18,41,77,0.2); display: flex; flex-direction: column; gap: 2px; max-width: 210px; }
        .bulle strong { font-size: 13px; color: #12294D; }
        .bulle span { font-size: 11px; color: #5B6B82; }

        .badges { max-width: 1100px; margin: 32px auto 0; padding: 0 20px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; }
        .badgeIcone { width: 52px; height: 52px; border-radius: 50%; background: #DCE7F7; color: #12294D; display: flex; align-items: center; justify-content: center; }
        .badge span { font-size: 12.5px; color: #3E4C63; font-weight: 600; }

        .boutons { max-width: 1100px; margin: 28px auto 0; padding: 0 20px; display: flex; flex-direction: column; gap: 10px; }
        .boutonPrimaire, .boutonSecondaire { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 15px; border-radius: 10px; font-weight: 700; font-size: 14.5px; text-decoration: none; }
        .boutonPrimaire { background: #12294D; color: white; }
        .boutonSecondaire { background: white; color: #12294D; border: 1px solid #C9D3E0; }

        .bas { margin-top: 44px; background: linear-gradient(180deg, #12294D 0%, #1A3A6B 100%); border-radius: 32px 32px 0 0; padding: 40px 20px 28px; }
        .basContenu { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .passCard { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 20px; color: white; }
        .passCardTop { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 26px; }
        .passCardLabel { font-size: 11px; letter-spacing: 0.5px; opacity: 0.8; }
        .passCardChip { width: 26px; height: 20px; border-radius: 4px; background: #D98E3B; }
        .passCardCaption { font-size: 12px; opacity: 0.7; margin-bottom: 2px; }
        .passCardAmount { font-size: 24px; font-weight: 700; margin-bottom: 16px; }
        .passCardFooter { display: flex; justify-content: space-between; font-size: 11px; opacity: 0.75; gap: 8px; }
        .tagline { color: white; font-size: 16px; font-weight: 600; text-align: center; margin: 0; }
        .proEspace { text-align: center; font-size: 12px; color: rgba(255,255,255,0.6); margin: 24px 0 0; }
        .proEspace a { color: white; font-weight: 600; text-decoration: underline; }

        @media (min-width: 720px) {
          .header { padding: 24px 40px; }
          .hero { flex-direction: row; align-items: center; padding: 24px 40px 48px; gap: 48px; }
          .heroText { flex: 1.1; }
          .titre { font-size: 40px; }
          .heroVisuelWrap { flex: 0.9; }
          .heroVisuel { height: 320px; }
          .badges { grid-template-columns: repeat(4, 1fr); padding: 0 40px; }
          .boutons { flex-direction: row; padding: 0 40px; max-width: 480px; }
          .bas { padding: 56px 40px 36px; }
          .basContenu { flex-direction: row; align-items: center; justify-content: center; gap: 48px; }
          .passCard { width: 320px; flex-shrink: 0; }
          .tagline { text-align: left; max-width: 280px; font-size: 20px; }
        }
      `}</style>
    </div>
  );
}
