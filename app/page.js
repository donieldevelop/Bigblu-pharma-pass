'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, Pill } from 'lucide-react';

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const avantages = [
    { icone: '/icons/icon-credit.png', titre: 'Simple et sécurisé', texte: "Un système conçu pour faciliter l'accès aux médicaments." },
    { icone: '/icons/icon-securite.png', titre: 'Utilisation par QR Code', texte: 'Identifiez rapidement le travailleur et la pharmacie.' },
    { icone: '/icons/icon-pharmacie.png', titre: 'Pharmacies partenaires', texte: 'Un réseau de pharmacies partenaires en développement.' },
    { icone: '/icons/icon-travailleurs.png', titre: 'Pour les travailleurs', texte: 'Une solution pensée pour les salariés et leurs entreprises.' },
  ];

  const etapes = [
    { n: 1, titre: "Le travailleur s'abonne", texte: 'Il crée son compte et bénéficie de son plafond mensuel.' },
    { n: 2, titre: 'Il utilise son crédit', texte: 'Il se rend dans une pharmacie partenaire et utilise son QR Code.' },
    { n: 3, titre: 'La transaction est enregistrée', texte: 'BIG HOLDING SA gère la transaction et le règlement de la pharmacie.' },
  ];

  return (
    <div className="page">
      <header className="header">
        <img src="/logo.png" alt="BIG BLU HOLDING AFRICA" className="logo" />
        <span className="lang">FR ▾</span>
      </header>

      <section className={`hero ${visible ? 'heroVisible' : ''}`}>
        <div className="heroText">
          <p className="eyebrow">BIG BLU PHARMA PASS</p>
          <h1 className="titre">
            Le crédit médicament <span className="accent">de vos travailleurs,</span> réglé en pharmacie.
          </h1>
          <p className="paragraphe">
            Une solution simple, sécurisée et accessible pour permettre aux travailleurs de prendre
            soin de leur santé auprès de pharmacies partenaires.
          </p>
          <div className="boutons">
            <a href="/travailleur/login" className="btnPrimaire">Se connecter <ChevronRight size={18} /></a>
            <a href="/travailleur/inscription" className="btnSecondaire">Créer un compte</a>
          </div>
        </div>

        <div className="heroVisuel">
          <Pill size={72} strokeWidth={1.1} />
        </div>
      </section>

      <section className="avantages">
        {avantages.map((a) => (
          <div key={a.titre} className="avantage">
            <div className="avantageIcone"><img src={a.icone} alt="" width={32} height={32} /></div>
            <h3>{a.titre}</h3>
            <p>{a.texte}</p>
          </div>
        ))}
      </section>

      <section className="passSection">
        <div className="passCard">
          <div className="passName">BIG BLU PHARMA PASS</div>
          <div className="passLabel">Plafond mensuel</div>
          <div className="passAmount">30 000 FCFA</div>
          <div className="passSub">Abonnement : 1 500 F/mois</div>
        </div>
        <div className="passDescription">
          <h2>Votre santé, notre priorité.</h2>
          <p>Chaque travailleur abonné dispose d&apos;un plafond mensuel utilisable directement auprès des pharmacies partenaires.</p>
        </div>
      </section>

      <section className="how">
        <h2 className="sectionTitre">Comment ça marche ?</h2>
        <p className="sectionSous">BIG BLU PHARMA PASS simplifie le parcours entre le travailleur, la pharmacie et BIG HOLDING SA.</p>
        <div className="steps">
          {etapes.map((e) => (
            <div key={e.n} className="step">
              <div className="stepNumero">{e.n}</div>
              <h3>{e.titre}</h3>
              <p>{e.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pharmacies">
        <div className="pharmacyBox">
          <div>
            <h2>Un réseau de pharmacies partenaires</h2>
            <p>Les pharmacies partenaires permettent aux travailleurs d&apos;utiliser leur crédit médicament en toute simplicité.</p>
          </div>
          <a href="/travailleur/pharmacies" className="btnPrimaire">Voir les pharmacies</a>
        </div>
      </section>

      <section className="cta">
        <h2>Prêt à rejoindre BIG BLU PHARMA PASS ?</h2>
        <p>Accédez à votre espace ou créez votre compte.</p>
        <div className="ctaBoutons">
          <a href="/travailleur/login" className="btnCtaPrimaire">Se connecter</a>
          <a href="/travailleur/inscription" className="btnCtaSecondaire">Créer un compte</a>
        </div>
        <p className="proEspace">
          Vous êtes une pharmacie partenaire ? <a href="/pharmacie/login">Accéder à votre espace</a>
        </p>
      </section>

      <footer className="footer">© 2026 BIG HOLDING SA — BIG BLU HOLDING AFRICA</footer>

      <style jsx>{`
        :root {}
        .page { background: #F5F9FD; color: #172F55; overflow-x: hidden; }
        .header { display: flex; align-items: center; justify-content: space-between; padding: 20px; background: white; }
        .logo { height: 40px; width: auto; }
        .lang { font-weight: 700; color: #123D78; font-size: 14px; }

        .hero { position: relative; padding: 20px 16px 28px; background: linear-gradient(135deg, #ffffff 0%, #f3f8ff 55%, #edf5ff 100%);
          display: flex; flex-direction: row; align-items: center; gap: 16px;
          opacity: 0; transform: translateY(14px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .heroVisible { opacity: 1; transform: translateY(0); }
        .heroText { flex: 1.15; min-width: 0; }
        .eyebrow { color: #1668C7; font-size: 10.5px; font-weight: 700; letter-spacing: 0.6px; margin-bottom: 8px; }
        .titre { font-size: 22px; line-height: 1.15; font-weight: 800; color: #123D78; margin: 0 0 10px; }
        .accent { color: #4D197E; }
        .paragraphe { font-size: 12.5px; line-height: 1.5; color: #5F6F85; margin: 0 0 14px; }
        .boutons { display: flex; flex-direction: column; gap: 8px; }
        .btnPrimaire, .btnSecondaire { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 42px; padding: 0 14px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 12px; }
        .btnPrimaire { background: #1668C7; color: white; }
        .btnSecondaire { background: white; color: #123D78; border: 2px solid #1668C7; }

        .heroVisuel { flex: 0.85; min-height: 260px; align-self: stretch; border-radius: 18px; background: linear-gradient(135deg, rgba(17,65,120,0.06), rgba(77,25,126,0.09));
          display: flex; align-items: center; justify-content: center; color: #6C88B0; }

        .avantages { background: white; padding: 32px 20px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .avantage { text-align: center; }
        .avantageIcone { width: 56px; height: 56px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; background: #E9F3FF; color: #1668C7; }
        .avantage h3 { font-size: 14px; margin-bottom: 4px; }
        .avantage p { color: #5F6F85; font-size: 12px; line-height: 1.4; }

        .passSection { padding: 36px 20px; background: #F5F9FD; display: flex; flex-direction: column; gap: 24px; }
        .passCard { min-height: 220px; padding: 26px; border-radius: 22px; color: white; background: linear-gradient(135deg, #103665, #125fbd);
          box-shadow: 0 20px 40px rgba(18,61,120,0.18); }
        .passName { font-size: 13px; letter-spacing: 0.8px; margin-bottom: 36px; opacity: 0.9; }
        .passLabel { font-size: 13px; opacity: 0.85; margin-bottom: 4px; }
        .passAmount { font-size: 32px; font-weight: 800; margin-bottom: 14px; }
        .passSub { font-size: 13px; opacity: 0.9; }
        .passDescription h2 { font-size: 24px; line-height: 1.2; margin: 0 0 12px; color: #123D78; }
        .passDescription p { color: #5F6F85; font-size: 14.5px; line-height: 1.6; margin: 0; }

        .how { background: white; padding: 40px 20px; text-align: center; }
        .sectionTitre { font-size: 24px; color: #123D78; margin: 0 0 8px; }
        .sectionSous { color: #5F6F85; line-height: 1.6; font-size: 14px; max-width: 500px; margin: 0 auto 28px; }
        .steps { display: flex; flex-direction: column; gap: 16px; text-align: left; }
        .step { padding: 22px; border-radius: 16px; background: #F7FAFF; }
        .stepNumero { width: 40px; height: 40px; margin-bottom: 12px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #123D78; color: white; font-weight: 800; }
        .step h3 { font-size: 15px; margin: 0 0 6px; }
        .step p { color: #5F6F85; font-size: 13px; line-height: 1.5; margin: 0; }

        .pharmacies { padding: 40px 20px; background: #EEF6FF; }
        .pharmacyBox { background: white; border-radius: 20px; padding: 26px; display: flex; flex-direction: column; gap: 18px; }
        .pharmacyBox h2 { font-size: 20px; color: #123D78; margin: 0 0 10px; }
        .pharmacyBox p { color: #5F6F85; line-height: 1.6; font-size: 14px; margin: 0; }
        .pharmacyBox .btnPrimaire { align-self: flex-start; }

        .cta { padding: 44px 20px; text-align: center; background: linear-gradient(135deg, #123D78, #4D197E); color: white; }
        .cta h2 { font-size: 24px; margin: 0 0 10px; }
        .cta p { font-size: 14.5px; opacity: 0.9; margin: 0 0 22px; }
        .ctaBoutons { display: flex; flex-direction: column; gap: 10px; max-width: 340px; margin: 0 auto; }
        .btnCtaPrimaire, .btnCtaSecondaire { display: inline-flex; align-items: center; justify-content: center; min-height: 50px; padding: 0 24px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14.5px; }
        .btnCtaPrimaire { background: white; color: #123D78; }
        .btnCtaSecondaire { background: transparent; color: white; border: 2px solid white; }
        .proEspace { margin-top: 22px; font-size: 12px; opacity: 0.75; }
        .proEspace a { color: white; font-weight: 600; text-decoration: underline; }

        .footer { background: #0D2850; color: white; text-align: center; padding: 20px; font-size: 12.5px; }

        @media (min-width: 800px) {
          .header { padding: 22px 6%; }
          .logo { height: 44px; }
          .hero { padding: 35px 6% 45px; gap: 30px; }
          .titre { font-size: 56px; }
          .paragraphe { font-size: 18px; max-width: 600px; }
          .boutons { flex-direction: row; }
          .btnPrimaire, .btnSecondaire { min-height: 54px; padding: 0 30px; font-size: 17px; }
          .heroVisuel { min-height: 400px; border-radius: 35px; }
          .avantages { grid-template-columns: repeat(4, 1fr); padding: 45px 6%; max-width: 1100px; margin: 0 auto; }
          .passSection { flex-direction: row; padding: 55px 6%; max-width: 1100px; margin: 0 auto; align-items: center; }
          .passCard, .passDescription { flex: 1; }
          .passDescription h2 { font-size: 34px; }
          .how { padding: 60px 6%; }
          .steps { flex-direction: row; max-width: 1050px; margin: 0 auto; text-align: center; }
          .step { flex: 1; }
          .stepNumero { margin-left: auto; margin-right: auto; }
          .pharmacies { padding: 60px 6%; }
          .pharmacyBox { max-width: 1050px; margin: 0 auto; flex-direction: row; justify-content: space-between; align-items: center; padding: 40px; }
          .pharmacyBox .btnPrimaire { align-self: auto; flex-shrink: 0; }
          .cta { padding: 64px 6%; }
          .ctaBoutons { flex-direction: row; justify-content: center; max-width: none; }
        }
      `}</style>
    </div>
  );
}
