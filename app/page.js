'use client';

import { useEffect, useState } from 'react';
import { Heart, ShieldCheck, TrendingUp, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const avantages = [
    { icone: '/icons/plafond-mensuel.svg', titre: 'Un crédit mensuel dédié' },
    { icone: '/icons/utilisation-qr.svg', titre: 'Utilisation simple avec QR Code' },
    { icone: '/icons/pharmacies-partenaires.svg', titre: 'Réseau de pharmacies partenaires' },
    { icone: '/icons/travailleurs.svg', titre: 'Pour tous les travailleurs' },
  ];

  const etapes = [
    { image: '/how-it-works/01-creez-votre-compte.svg', titre: 'Créez votre compte' },
    { image: '/how-it-works/02-recevez-votre-pass.svg', titre: 'Recevez votre Pass' },
    { image: '/how-it-works/03-pharmacie-partenaire.svg', titre: 'Rendez-vous en pharmacie partenaire' },
    { image: '/how-it-works/04-presentez-votre-qr-code.svg', titre: 'Présentez votre QR Code' },
    { image: '/how-it-works/05-beneficiez-de-vos-medicaments.svg', titre: 'Bénéficiez de vos médicaments' },
  ];

  const beneficesTravailleur = [
    { icone: Heart, texte: 'Accès facilité aux médicaments' },
    { icone: ShieldCheck, texte: 'Une meilleure protection santé' },
    { icone: TrendingUp, texte: 'Plus de sérénité dans votre quotidien' },
    { icone: Users, texte: 'Un service pensé pour les travailleurs' },
  ];

  return (
    <div className="page">
      <header className="header" id="hero">
        <img src="/logo.png" alt="BIGBLU HOLDING AFRICA" className="logo" />
        <nav className="headerNavCentre">
          <a href="#hero">Accueil</a>
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#pharmacies">Pharmacies</a>
          <a href="#a-propos">À propos</a>
          <a href="#contact">Contact</a>
        </nav>
        <nav className="headerNav">
          <a href="/travailleur/login" className="headerLien">Se connecter</a>
          <a href="/travailleur/inscription" className="headerLienPrimaire">S&apos;inscrire</a>
        </nav>
      </header>

      <section className={'hero ' + (visible ? 'heroVisible' : '')}>
        <div className="heroText">
          <p className="eyebrow">BIGBLU PHARMA PASS</p>
          <h1 className="titre">
            Une plateforme santé <span className="accentBlue">dédiée aux travailleurs</span>.
          </h1>
          <p className="paragraphe">
            BIGBLU PHARMA PASS facilite votre accès aux médicaments grâce à une solution simple,
            pratique et dédiée aux travailleurs.
          </p>
          <div className="heroBoutons">
            <a href="/travailleur/inscription" className="btnPrimaire">Créer mon compte</a>
            <a href="#fonctionnalites" className="btnSecondaire">Découvrir</a>
          </div>
        </div>

        <div className="heroVisuel">
          <img src="/hero-pharmacienne.jpg" alt="Pharmacienne partenaire BIGBLU PHARMA PASS" className="heroPhoto" />
          <div className="bulle">
            <strong>Votre santé, notre priorité</strong>
            <span>Des pharmacies partenaires près de vous.</span>
          </div>
        </div>
      </section>

      <section className="avantages" id="fonctionnalites">
        {avantages.map((a, i) => (
          <div key={a.titre} className="avantage">
            <div className={'avantageIcone ' + (i % 2 === 0 ? 'iconeBleue' : 'iconeViolette')}>
              <img src={a.icone} alt="" width={26} height={26} />
            </div>
            <span>{a.titre}</span>
          </div>
        ))}
      </section>

      <section className="commentCaMarche">
        <h2 className="titreSection">Comment ça fonctionne ?</h2>
        <div className="etapes">
          {etapes.map((e, i) => (
            <img key={e.titre} src={e.image} alt={e.titre} className="etapeImage" />
          ))}
        </div>
      </section>

      <section className="santeTravail" id="a-propos">
        <img src="/hero-travailleur.jpg" alt="Travailleur bénéficiaire BIGBLU PHARMA PASS" className="santeTravailPhoto" />
        <div className="santeTravailTexte">
          <h2 className="titreSection gauche">Votre santé, un atout pour votre travail.</h2>
          <div className="beneficesGrille">
            {beneficesTravailleur.map((b) => {
              const Icone = b.icone;
              return (
                <div key={b.texte} className="beneficeItem">
                  <Icone size={20} color="#2E7BC4" />
                  <span>{b.texte}</span>
                </div>
              );
            })}
          </div>
        </div>
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
              <span>Abonnement : 2 000 F/mois</span>
              <span>BIG HOLDING SA</span>
            </div>
          </div>
          <p className="tagline">Des travailleurs en bonne santé, des entreprises plus fortes.</p>
        </div>
      </section>

      <section className="pharmaciesSection" id="pharmacies">
        <div className="pharmaciesTexte">
          <h2 className="titreSection gauche blanc">Un large réseau de pharmacies partenaires</h2>
          <p className="pharmaciesParagraphe">
            Retrouvez nos pharmacies partenaires proches de vous et bénéficiez de vos services
            santé en toute simplicité.
          </p>
          <a href="/travailleur/login" className="btnClair">Voir les pharmacies <ArrowRight size={16} /></a>
        </div>
        <div className="pharmaciesVisuel" aria-hidden="true" />
      </section>

      <section className="espacePersonnel">
        <div className="espaceVisuel" aria-hidden="true" />
        <div className="espaceTexte">
          <h2 className="titreSection gauche">Votre espace personnel</h2>
          <p className="paragraphe">
            Gérez votre Pass, consultez votre solde, vos transactions et localisez les pharmacies
            partenaires depuis votre espace.
          </p>
          <a href="/travailleur/login" className="btnPrimaire">Découvrir l&apos;application <ArrowRight size={16} /></a>
        </div>
      </section>

      <section className="ctaFinal">
        <div className="ctaTexte">
          <h2 className="titreSection gauche blanc">
            Rejoignez <span className="accentClair">BIGBLU PHARMA PASS</span>
          </h2>
          <p className="ctaParagraphe">Une solution santé simple, sécurisée et dédiée aux travailleurs.</p>
          <a href="/travailleur/inscription" className="btnBlanc">S&apos;inscrire maintenant <ArrowRight size={16} /></a>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footerHaut">
          <img src="/logo.png" alt="BIGBLU AFRICA" className="footerLogo" />
          <div className="footerColonnes">
            <div>
              <strong>Liens utiles</strong>
              <a href="#hero">Accueil</a>
              <a href="#fonctionnalites">Fonctionnalités</a>
              <a href="#pharmacies">Pharmacies</a>
              <a href="#a-propos">À propos</a>
            </div>
            <div>
              <strong>Assistance</strong>
              <a href="mailto:contact@bigblupharmapass.com">Nous contacter</a>
              <a href="/pharmacie/login">Espace partenaire (pharmacie)</a>
            </div>
          </div>
        </div>
        <p className="footerCopyright">© {new Date().getFullYear()} BIGBLU AFRICA. Tous droits réservés.</p>
      </footer>

      <style jsx>{`
        .page { background: #EEF2F6; min-height: 100vh; color: #12294D; overflow-x: hidden; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 16px; gap: 12px; flex-wrap: wrap; }
        .logo { height: 44px; width: auto; }
        .headerNavCentre { display: none; }
        .headerNav { display: flex; align-items: center; gap: 10px; margin-left: auto; }
        .headerLien { font-size: 12.5px; font-weight: 600; color: #12294D; text-decoration: none; }
        .headerLienPrimaire { font-size: 12.5px; font-weight: 700; color: white; background: #12294D; padding: 8px 14px; border-radius: 8px; text-decoration: none; }

        .hero { position: relative; padding: 10px 16px 24px; display: flex; flex-direction: column; gap: 20px;
          opacity: 0; transform: translateY(14px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .heroVisible { opacity: 1; transform: translateY(0); }
        .heroText { min-width: 0; }
        .eyebrow { font-size: 10.5px; letter-spacing: 0.6px; color: #8393A8; margin: 0 0 8px; text-transform: uppercase; }
        .titre { font-family: var(--font-display), sans-serif; font-size: 26px; line-height: 1.2; font-weight: 700; margin: 0 0 10px; }
        .accentBlue { color: #2E7BC4; }
        .accentPurple { color: #6C4FB3; }
        .paragraphe { font-size: 13px; color: #3E4C63; line-height: 1.55; margin: 0; }
        .heroBoutons { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; }

        .heroVisuel { position: relative; width: 180px; margin: 0 auto; }
        .heroPhoto { width: 100%; border-radius: 20px; display: block; box-shadow: 0 16px 32px -12px rgba(18,41,77,0.35); }
        .bulle { position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%); width: 88%; background: white; border-radius: 12px; padding: 10px 12px;
          box-shadow: 0 8px 20px -6px rgba(18,41,77,0.25); display: flex; flex-direction: column; gap: 2px; }
        .bulle strong { font-size: 11.5px; color: #12294D; }
        .bulle span { font-size: 9.5px; color: #5B6B82; }

        .avantages { padding: 34px 12px 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px 8px; }
        .avantage { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; }
        .avantageIcone { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .iconeBleue { background: #DCE7F7; }
        .iconeViolette { background: #EDE7F9; }
        .avantage span { font-size: 11px; color: #3E4C63; font-weight: 600; line-height: 1.25; }

        .btnPrimaire, .btnSecondaire, .btnClair, .btnBlanc { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 13px 20px; border-radius: 10px; font-weight: 700; font-size: 13.5px; text-decoration: none; }
        .btnPrimaire { background: #12294D; color: white; }
        .btnSecondaire { background: white; color: #12294D; border: 1px solid #C9D3E0; }
        .btnClair { background: white; color: #12294D; }
        .btnBlanc { background: white; color: #0B1B33; }

        .titreSection { font-family: var(--font-display), sans-serif; font-size: 21px; font-weight: 700; text-align: center; margin: 0 0 26px; color: #12294D; }
        .titreSection.gauche { text-align: left; }
        .titreSection.blanc { color: white; }

        .commentCaMarche { padding: 46px 16px 10px; }
        .etapes { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; max-width: 480px; margin: 0 auto; }
        .etapeImage { width: 100%; height: auto; border-radius: 18px; }

        .santeTravail { padding: 46px 16px; display: flex; flex-direction: column; gap: 24px; }
        .santeTravailPhoto { width: 140px; border-radius: 18px; margin: 0 auto; display: block; box-shadow: 0 14px 28px -10px rgba(18,41,77,0.3); }
        .beneficesGrille { display: grid; grid-template-columns: 1fr; gap: 14px; margin-top: 18px; }
        .beneficeItem { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #3E4C63; font-weight: 600; }

        .bas { margin-top: 10px; background: linear-gradient(180deg, #12294D 0%, #1A3A6B 100%); padding: 34px 20px; }
        .basContenu { display: flex; flex-direction: column; gap: 24px; }
        .passCard { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 20px; color: white; max-width: 380px; margin: 0 auto; width: 100%; }
        .passCardTop { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 26px; }
        .passCardLabel { font-size: 11px; letter-spacing: 0.5px; opacity: 0.8; }
        .passCardChip { width: 26px; height: 20px; border-radius: 4px; background: #D98E3B; }
        .passCardCaption { font-size: 12px; opacity: 0.7; margin-bottom: 2px; }
        .passCardAmount { font-family: var(--font-display), sans-serif; font-size: 26px; font-weight: 700; margin-bottom: 16px; }
        .passCardFooter { display: flex; justify-content: space-between; font-size: 11px; opacity: 0.75; gap: 8px; }
        .tagline { color: white; font-size: 16px; font-weight: 600; text-align: center; margin: 0; }

        .pharmaciesSection { background: linear-gradient(135deg, #12294D, #0878D1); padding: 40px 16px; position: relative; overflow: hidden; }
        .pharmaciesTexte { position: relative; z-index: 1; max-width: 420px; }
        .pharmaciesParagraphe { color: rgba(255,255,255,0.85); font-size: 13px; line-height: 1.55; margin: 12px 0 20px; }
        .pharmaciesVisuel { display: none; }

        .espacePersonnel { padding: 40px 16px; background: white; }
        .espaceVisuel { display: none; }

        .ctaFinal { background: linear-gradient(135deg, #0B1B33, #123563); padding: 44px 16px; text-align: center; }
        .ctaTexte { max-width: 480px; margin: 0 auto; }
        .accentClair { color: #6FA9E8; }
        .ctaParagraphe { color: rgba(255,255,255,0.8); font-size: 13.5px; margin: 10px 0 22px; }

        .footer { background: #0B1B33; padding: 36px 20px 20px; color: white; }
        .footerHaut { display: flex; flex-direction: column; gap: 24px; max-width: 1100px; margin: 0 auto 20px; }
        .footerLogo { height: 32px; width: auto; }
        .footerColonnes { display: flex; gap: 40px; flex-wrap: wrap; }
        .footerColonnes strong { display: block; font-size: 13px; margin-bottom: 10px; color: white; }
        .footerColonnes a { display: block; font-size: 12.5px; color: rgba(255,255,255,0.6); text-decoration: none; margin-bottom: 6px; }
        .footerCopyright { font-size: 11px; color: rgba(255,255,255,0.4); text-align: center; max-width: 1100px; margin: 0 auto; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }

        @media (min-width: 860px) {
          .header { padding: 24px 40px; }
          .headerNavCentre { display: flex; gap: 26px; }
          .headerNavCentre a { font-size: 13px; font-weight: 600; color: #12294D; text-decoration: none; }
          .hero { flex-direction: row; align-items: center; padding: 30px 40px 60px; gap: 40px; }
          .heroText { flex: 1.1; }
          .titre { font-size: 42px; }
          .paragraphe { font-size: 15px; max-width: 460px; }
          .heroVisuel { flex: 0.9; width: 280px; }
          .avantages { grid-template-columns: repeat(4, 1fr); padding: 40px 40px 0; max-width: 1100px; margin: 0 auto; }
          .commentCaMarche { padding: 70px 40px 20px; }
          .etapes { grid-template-columns: repeat(5, 1fr); max-width: 1100px; }
          .santeTravail { flex-direction: row; align-items: center; padding: 70px 40px; max-width: 1100px; margin: 0 auto; gap: 60px; }
          .santeTravailPhoto { width: 240px; margin: 0; }
          .beneficesGrille { grid-template-columns: 1fr 1fr; }
          .bas { padding: 60px 40px; }
          .basContenu { flex-direction: row; align-items: center; justify-content: center; gap: 56px; max-width: 1100px; margin: 0 auto; }
          .tagline { text-align: left; max-width: 280px; font-size: 20px; }
          .pharmaciesSection { padding: 60px 40px; }
          .pharmaciesTexte { max-width: 1100px; margin: 0 auto; }
          .espacePersonnel { padding: 60px 40px; }
          .espaceTexte { max-width: 1100px; margin: 0 auto; }
          .ctaFinal { padding: 64px 40px; }
          .footerHaut { flex-direction: row; justify-content: space-between; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
