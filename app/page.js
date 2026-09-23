'use client';

import { useEffect, useState, useRef, Fragment } from 'react';
import { Inter } from 'next/font/google';
import { Heart, ShieldCheck, TrendingUp, Users, Menu, X } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

const NAV = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#pharmacies', label: 'Pharmacies' },
  { href: '#apropos', label: 'À propos' },
  { href: '#contact', label: 'Contact' },
];

const FEATURES = [
  { icone: '/icons/plafond-mensuel.svg', titre: 'Une plateforme santé dédiée aux travailleurs' },
  { icone: '/icons/utilisation-qr.svg', titre: 'Utilisation simple avec QR Code' },
  { icone: '/icons/pharmacies-partenaires.svg', titre: 'Réseau de pharmacies partenaires' },
  { icone: '/icons/travailleurs.svg', titre: 'Pour tous les travailleurs' },
];

const STEPS = [
  { image: '/how-it-works-photo/01.jpg', titre: 'Créez votre compte' },
  { image: '/how-it-works-photo/02.jpg', titre: 'Recevez votre Pass' },
  { image: '/how-it-works-photo/03.jpg', titre: 'Rendez-vous dans une pharmacie partenaire' },
  { image: '/how-it-works-photo/04.jpg', titre: 'Présentez votre QR Code' },
  { image: '/how-it-works-photo/05.jpg', titre: 'Bénéficiez de vos médicaments' },
];

const BENEFITS = [
  { icone: Heart, texte: 'Accès facilité aux médicaments' },
  { icone: ShieldCheck, texte: 'Une meilleure protection santé' },
  { icone: TrendingUp, texte: 'Plus de sérénité dans votre quotidien' },
  { icone: Users, texte: 'Un service pensé pour les travailleurs' },
];

export default function Home() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [sectionActive, setSectionActive] = useState('accueil');
  const sectionsRef = useRef([]);

  useEffect(() => {
    sectionsRef.current = NAV
      .map((n) => document.querySelector(n.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setSectionActive(entry.target.id);
        });
      },
      { threshold: 0.35 }
    );
    sectionsRef.current.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={'page ' + inter.className}>
      <header className="site-header">
        <a href="#accueil" className="brand">
          <img src="/logo-complet.png" alt="BIGBLU AFRICA" />
        </a>

        <nav className="desktop-nav">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={sectionActive === n.href.slice(1) ? 'active' : ''}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a href="/travailleur/login" className="btn btn-outline">Se connecter</a>
          <a href="/travailleur/inscription" className="btn btn-primary">S&apos;inscrire</a>
        </div>

        <button className="menu-toggle" type="button" aria-label="Ouvrir le menu" onClick={() => setMenuOuvert(!menuOuvert)}>
          {menuOuvert ? <X size={22} /> : <Menu size={22} />}
        </button>

        {menuOuvert && (
          <div className="mobileMenu">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setMenuOuvert(false)}>{n.label}</a>
            ))}
            <div className="mobileMenuActions">
              <a href="/travailleur/login" className="btn btn-outline">Se connecter</a>
              <a href="/travailleur/inscription" className="btn btn-primary">S&apos;inscrire</a>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="accueil" className="hero">
          <div className="hero-copy">
            <span className="eyebrow">BIGBLU PHARMA PASS</span>
            <h1>Une plateforme santé dédiée aux travailleurs.</h1>
            <p>
              Accédez facilement à vos médicaments grâce à un réseau de pharmacies partenaires et
              à des services pensés pour votre bien-être.
            </p>
            <div className="hero-actions">
              <a href="/travailleur/inscription" className="btn btn-primary">S&apos;inscrire</a>
              <a href="#fonctionnalites" className="btn btn-light">Découvrir</a>
            </div>
          </div>
          <div className="hero-visual">
            <img src="/hero-pharmacienne.jpg" alt="BIGBLU PHARMA PASS" />
          </div>
        </section>

        <section id="fonctionnalites" className="features section">
          {FEATURES.map((f) => (
            <article key={f.titre} className="feature">
              <div className="feature-icon"><img src={f.icone} alt="" /></div>
              <h3>{f.titre}</h3>
            </article>
          ))}
        </section>

        <section className="how section">
          <div className="section-title">
            <h2>Comment ça fonctionne ?</h2>
            <span></span>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <Fragment key={s.titre}>
                <article className="step">
                  <div className="step-image"><img src={s.image} alt={s.titre} /></div>
                  <h3>{s.titre}</h3>
                </article>
                {i < STEPS.length - 1 && <div className="arrow">→</div>}
              </Fragment>
            ))}
          </div>
        </section>

        <section id="apropos" className="benefits section">
          <div className="benefit-photo">
            <img src="/hero-travailleur.jpg" alt="Travailleur BIGBLU" />
          </div>
          <div className="benefit-copy">
            <span className="small-label">BIGBLU PHARMA PASS</span>
            <h2>Votre santé, un atout pour votre travail.</h2>
            <div className="benefit-grid">
              {BENEFITS.map((b) => {
                const Icone = b.icone;
                return (
                  <div key={b.texte}>
                    <b><Icone size={17} /></b>
                    <span>{b.texte}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="pass-offer">
          <div className="pass-copy">
            <h2><span>BIGBLU</span> PHARMA PASS</h2>
            <p>Plafond disponible</p>
            <strong>30 000 FCFA</strong>
            <div className="line" />
            <p>Abonnement : <b>2 000 F/mois</b></p>
          </div>
          <div className="pass-card">
            <div className="passCardVisuel">
              <div className="passCardTop">
                <span>BIGBLU PHARMA PASS</span>
                <div className="passCardChip" />
              </div>
              <div className="passCardQr">
                <svg viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" rx="8" fill="white" /><rect x="8" y="8" width="14" height="14" fill="#0b2f63" /><rect x="42" y="8" width="14" height="14" fill="#0b2f63" /><rect x="8" y="42" width="14" height="14" fill="#0b2f63" /><rect x="28" y="28" width="8" height="8" fill="#0b2f63" /></svg>
              </div>
              <div className="passCardFooter">Ma santé, ma sérénité</div>
            </div>
          </div>
        </section>

        <section id="pharmacies" className="split-section section">
          <div className="split-copy">
            <h2>Un large réseau<br />de pharmacies partenaires</h2>
            <p>Retrouvez nos pharmacies partenaires proches de vous et bénéficiez de vos services santé en toute simplicité.</p>
            <a href="/travailleur/login" className="btn btn-primary">Voir les pharmacies <span>→</span></a>
          </div>
          <div className="split-image">
            <img src="/pharmacie-devanture.jpg" alt="Réseau de pharmacies partenaires" />
          </div>
        </section>

        <section className="split-section reverse section">
          <div className="split-image espacePersonnelVisuel" aria-hidden="true" />
          <div className="split-copy">
            <h2>Votre espace personnel</h2>
            <p>Gérez votre Pass, consultez votre solde, vos transactions et localisez les pharmacies partenaires depuis votre espace.</p>
            <a href="/travailleur/login" className="btn btn-primary">Découvrir l&apos;application <span>→</span></a>
          </div>
        </section>

        <section id="contact" className="cta">
          <div className="cta-copy">
            <h2>Rejoignez BIGBLU PHARMA PASS</h2>
            <p>Une solution santé simple, sécurisée et dédiée aux travailleurs.</p>
            <a href="/travailleur/inscription" className="btn btn-white">S&apos;inscrire maintenant <span>→</span></a>
          </div>
          <img src="/cta-equipe.jpg" alt="Groupe de travailleurs" />
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <img src="/logo-complet.png" alt="BIGBLU AFRICA" />
        </div>
        <div>
          <h4>Liens utiles</h4>
          <a href="#accueil">Accueil</a>
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#pharmacies">Pharmacies</a>
          <a href="#apropos">À propos</a>
          <a href="#contact">Contact</a>
        </div>
        <div>
          <h4>Assistance</h4>
          <a href="mailto:contact@bigblupharmapass.com">Nous contacter</a>
          <a href="/pharmacie/login">Espace partenaire (pharmacie)</a>
        </div>
        <div>
          <h4>Suivez-nous</h4>
          <p className="footerMuted">Bientôt disponible</p>
        </div>
        <div>
          <h4>Application</h4>
          <p className="footerMuted">Bientôt sur Google Play et l&apos;App Store</p>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} BIGBLU AFRICA. Tous droits réservés.</span>
          <span>Conditions d&apos;utilisation | Confidentialité | Mentions légales</span>
        </div>
      </footer>

      <style jsx>{`
        :root {
          --blue: #12294D;
          --blue-2: #2E7BC4;
          --blue-dark: #0B1B33;
          --text: #17375e;
          --muted: #65758a;
          --light: #f5f9fd;
        }
        .page { color: var(--text); background: #fff; line-height: 1.5; overflow-x: hidden; }
        .page :global(img) { max-width: 100%; display: block; }
        .page :global(a) { text-decoration: none; color: inherit; }
        .section { max-width: 1180px; margin: auto; padding: 72px 28px; }

        .site-header { height: 78px; display: flex; align-items: center; gap: 28px; padding: 8px 32px; border-bottom: 1px solid #eef2f7; background: #fff; position: sticky; top: 0; z-index: 20; }
        .brand img { width: 95px; height: auto; }
        .desktop-nav { display: none; }
        .header-actions { display: none; }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; border-radius: 12px; padding: 12px 21px; font-size: 14px; font-weight: 700; transition: .2s; }
        .btn-primary { background: var(--blue-2); color: white; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(46,123,196,.22); }
        .btn-outline { border: 1px solid var(--blue); color: var(--blue); }
        .btn-light { background: white; color: var(--blue); box-shadow: 0 5px 15px rgba(0,0,0,.08); }
        .btn-white { background: white; color: var(--blue); padding: 13px 24px; }
        .menu-toggle { display: flex; margin-left: auto; border: 0; background: none; color: var(--blue); }

        .mobileMenu { position: absolute; top: 78px; left: 0; right: 0; background: white; border-bottom: 1px solid #eef2f7; display: flex; flex-direction: column; padding: 16px 24px 24px; gap: 4px; box-shadow: 0 12px 20px rgba(0,0,0,0.06); }
        .mobileMenu a { padding: 12px 0; font-size: 14px; color: #344a64; border-bottom: 1px solid #f2f5f9; }
        .mobileMenuActions { display: flex; gap: 10px; margin-top: 14px; }
        .mobileMenuActions .btn { flex: 1; }

        .hero { max-width: 1180px; margin: auto; min-height: auto; display: grid; grid-template-columns: 1fr; align-items: center; padding: 15px 18px 0; overflow: hidden; }
        .hero-copy { padding: 30px 0 25px; z-index: 2; }
        .eyebrow { display: block; font-size: 14px; letter-spacing: 1px; font-weight: 700; color: #8090a4; margin-bottom: 12px; }
        .hero h1 { font-size: 32px; line-height: 1.08; color: var(--blue-dark); max-width: 540px; margin-bottom: 18px; font-weight: 800; }
        .hero p { font-size: 15px; max-width: 520px; color: #586a7e; margin-bottom: 26px; }
        .hero-actions { display: flex; gap: 12px; }
        .hero-visual { min-height: 330px; align-self: stretch; display: flex; align-items: center; justify-content: center; }
        .hero-visual img { width: 100%; height: 100%; object-fit: cover; border-radius: 24px; object-position: top center; }

        .features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px 12px; text-align: center; padding-top: 45px; padding-bottom: 45px; padding-left: 12px; padding-right: 12px; }
        .feature { min-height: 145px; }
        .feature-icon { width: 72px; height: 72px; margin: 0 auto 13px; border-radius: 50%; background: #eef6ff; display: flex; align-items: center; justify-content: center; }
        .feature-icon img { width: 34px; height: 34px; object-fit: contain; }
        .feature h3 { font-size: 13px; line-height: 1.25; color: #334a67; font-weight: 600; }

        .how { padding-top: 30px; }
        .section-title { text-align: center; margin-bottom: 28px; }
        .section-title h2 { font-size: 24px; color: var(--blue-dark); font-weight: 800; }
        .section-title span { display: block; width: 45px; height: 3px; background: var(--blue-2); margin: 10px auto 0; }
        .steps { display: grid; grid-template-columns: 1fr 24px 1fr; gap: 8px; align-items: center; }
        .step:nth-of-type(3) { grid-column: 1; }
        .step:nth-of-type(4) { grid-column: 3; }
        .step:nth-of-type(5) { grid-column: 1; }
        .step { text-align: center; }
        .step-image { height: 120px; display: flex; align-items: center; justify-content: center; }
        .step-image img { width: 100%; height: 120px; object-fit: cover; border-radius: 18px; }
        .step h3 { font-size: 11.5px; line-height: 1.25; margin-top: 9px; color: #17375e; font-weight: 600; }
        .arrow { display: none; }

        .benefits { display: grid; grid-template-columns: 1fr; align-items: stretch; padding-top: 55px; }
        .benefit-photo img { width: 100%; height: 280px; object-fit: cover; border-radius: 25px 25px 0 0; }
        .benefit-copy { padding: 35px 28px; background: #f7fbff; border-radius: 0 0 25px 25px; }
        .small-label { font-size: 12px; color: #7c8ca0; font-weight: 700; }
        .benefit-copy h2 { font-size: 24px; line-height: 1.1; color: var(--blue-dark); margin: 10px 0 28px; font-weight: 800; }
        .benefit-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
        .benefit-grid div { display: flex; gap: 12px; align-items: center; font-size: 13px; color: #52677e; font-weight: 600; }
        .benefit-grid b { width: 38px; height: 38px; flex-shrink: 0; display: grid; place-items: center; background: #e9f3ff; border-radius: 50%; color: var(--blue-2); }

        .pass-offer { max-width: none; background: linear-gradient(110deg, var(--blue-dark), var(--blue-2)); color: #fff; display: grid; grid-template-columns: 1fr; align-items: center; gap: 30px; padding: 45px 28px; }
        .pass-copy h2 { font-size: 22px; margin-bottom: 22px; font-weight: 800; }
        .pass-copy h2 span { color: #6FA9E8; }
        .pass-copy p { font-size: 14px; color: #d8e8fb; margin-bottom: 3px; }
        .pass-copy strong { font-size: 36px; display: block; line-height: 1.15; }
        .pass-copy .line { width: 55px; height: 2px; background: #fff; margin: 16px 0; }
        .pass-card { display: flex; justify-content: center; }
        .passCardVisuel { width: 100%; max-width: 380px; aspect-ratio: 1.58/1; background: linear-gradient(135deg, #16407e, #0a57b7); border-radius: 20px; padding: 22px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 20px 40px -12px rgba(0,0,0,0.4); }
        .passCardTop { display: flex; justify-content: space-between; align-items: flex-start; color: white; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; }
        .passCardChip { width: 30px; height: 22px; border-radius: 5px; background: #D98E3B; }
        .passCardQr { align-self: flex-end; }
        .passCardFooter { color: rgba(255,255,255,0.75); font-size: 11px; font-style: italic; }

        .split-section { display: grid; grid-template-columns: 1fr; gap: 20px; align-items: center; }
        .split-section.reverse { background: #f7fbff; max-width: none; padding-left: 28px; padding-right: 28px; }
        .split-section.reverse .split-image { order: 1; }
        .split-section.reverse .split-copy { order: 2; }
        .split-copy h2 { font-size: 24px; line-height: 1.12; color: var(--blue-dark); margin-bottom: 16px; font-weight: 800; }
        .split-copy p { max-width: 480px; color: #60738a; font-size: 14px; margin-bottom: 22px; }
        .split-image img { width: 100%; height: 240px; object-fit: cover; border-radius: 25px; }
        .espacePersonnelVisuel { height: 240px; border-radius: 25px; background: linear-gradient(135deg, #DCE7F7, #EDE7F9); }

        .cta { max-width: 1180px; margin: 20px 18px 0; min-height: auto; border-radius: 30px; overflow: hidden; background: linear-gradient(100deg, var(--blue-dark), var(--blue-2)); color: #fff; display: grid; grid-template-columns: 1fr; padding: 35px 25px 0; }
        .cta h2 { font-size: 22px; margin-bottom: 7px; font-weight: 800; }
        .cta p { font-size: 13.5px; margin-bottom: 22px; color: #e5f0ff; }
        .cta img { height: 240px; width: 100%; object-fit: cover; object-position: top center; margin-top: 20px; }

        .footer { margin-top: 50px; background: #fff; border-top: 1px solid #e9eef4; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 38px 24px 20px; position: relative; }
        .footer-brand img { width: 90px; }
        .footer h4 { font-size: 13px; margin-bottom: 12px; color: var(--blue-dark); }
        .footer a { display: block; font-size: 12px; color: #68788b; margin: 7px 0; }
        .footerMuted { font-size: 12px; color: #a3b0c0; margin: 7px 0; }
        .footer-bottom { grid-column: 1/-1; border-top: 1px solid #edf1f5; padding-top: 17px; display: flex; flex-direction: column; gap: 8px; font-size: 10px; color: #8491a0; }

        @media (min-width: 901px) {
          .desktop-nav { display: flex; align-items: center; justify-content: center; gap: 26px; flex: 1; font-size: 13px; color: #344a64; }
          .desktop-nav :global(a) { padding: 26px 0; position: relative; }
          .desktop-nav :global(a.active) { color: var(--blue); font-weight: 700; }
          .desktop-nav :global(a.active):after { content: ""; position: absolute; left: 0; right: 0; bottom: 14px; height: 2px; background: var(--blue); }
          .header-actions { display: flex; gap: 10px; }
          .menu-toggle { display: none; }

          .hero { min-height: 475px; grid-template-columns: 43% 57%; padding: 30px 28px 0; }
          .hero-copy { padding: 30px 0 55px; }
          .hero h1 { font-size: 48px; }
          .hero p { font-size: 17px; }
          .hero-visual img { border-radius: 30px 0 0 30px; }

          .features { grid-template-columns: repeat(4, 1fr); padding-left: 28px; padding-right: 28px; }
          .feature-icon img { width: 39px; height: 39px; }
          .feature h3 { font-size: 15px; }

          .section-title h2 { font-size: 28px; }
          .steps { grid-template-columns: 1fr 24px 1fr 24px 1fr 24px 1fr 24px 1fr; }
          .step:nth-of-type(n) { grid-column: auto; }
          .step-image { height: 145px; }
          .step-image img { height: 145px; }
          .step h3 { font-size: 13px; }
          .arrow { display: block; font-size: 24px; color: var(--blue-2); text-align: center; }

          .benefits { grid-template-columns: 43% 57%; padding-top: 55px; }
          .benefit-photo img { height: 100%; border-radius: 28px 0 0 28px; }
          .benefit-copy { padding: 35px 38px; border-radius: 0 28px 28px 0; }
          .benefit-copy h2 { font-size: 32px; }
          .benefit-grid { grid-template-columns: 1fr 1fr; gap: 22px; }

          .pass-offer { grid-template-columns: 1fr 1fr; gap: 40px; padding: 48px max(28px, calc((100% - 1125px)/2)); }
          .pass-copy h2 { font-size: 26px; }
          .pass-copy strong { font-size: 45px; }
          .pass-card { justify-content: flex-end; }

          .split-section { grid-template-columns: 1fr 1fr; gap: 30px; }
          .split-section.reverse { padding-left: max(28px, calc((100% - 1180px)/2)); padding-right: max(28px, calc((100% - 1180px)/2)); }
          .split-section.reverse .split-image { order: 0; }
          .split-section.reverse .split-copy { order: 0; }
          .split-copy h2 { font-size: 30px; }
          .split-copy p { font-size: 15px; }
          .split-image img { height: 310px; }
          .espacePersonnelVisuel { height: 310px; }

          .cta { margin: 35px auto 0; min-height: 220px; grid-template-columns: 52% 48%; align-items: center; padding: 0 0 0 50px; }
          .cta h2 { font-size: 30px; }
          .cta p { font-size: 14px; }
          .cta img { height: 100%; margin-top: 0; }

          .footer { grid-template-columns: 1.2fr 1fr 1fr 1fr 1.3fr; padding: 45px max(28px, calc((100% - 1180px)/2)) 25px; }
          .footer-brand img { width: 100px; }
          .footer-bottom { flex-direction: row; justify-content: space-between; }
        }

        @media (max-width: 520px) {
          .section { padding-left: 18px; padding-right: 18px; }
          .hero h1 { font-size: 28px; }
          .step-image { height: 100px; }
          .step-image img { height: 100px; }
          .pass-copy strong { font-size: 32px; }
        }
      `}</style>
    </div>
  );
}
