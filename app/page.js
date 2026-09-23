'use client';

const FEATURES = [
  { icone: '●', titre: 'Accès facilité', suite: 'aux médicaments' },
  { icone: '✓', titre: 'Utilisation simple', suite: 'avec QR Code' },
  { icone: '+', titre: 'Réseau de pharmacies', suite: 'partenaires' },
  { icone: '●', titre: 'Pour tous les', suite: 'travailleurs' },
];

const STEPS = [
  { n: 1, image: '/v3-step1.jpg', titre: 'Créez votre compte' },
  { n: 2, image: '/v3-step2.jpg', titre: 'Recevez votre Pass' },
  { n: 3, image: '/v3-step3.jpg', titre: 'Rendez-vous dans une pharmacie partenaire' },
  { n: 4, image: '/v3-step4.jpg', titre: 'Présentez votre QR Code' },
  { n: 5, image: '/v3-step5.jpg', titre: 'Bénéficiez de vos médicaments' },
];

export default function Home() {
  return (
    <div className="page">
      <header className="site-header">
        <a className="brand" href="#accueil">
          <img src="/logo-complet.png" alt="BIGBLU AFRICA" />
        </a>
        <nav className="nav">
          <a className="active" href="#accueil">Accueil</a>
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#pharmacies">Pharmacies</a>
          <a href="#apropos">À propos</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="btn btn-primary header-btn" href="/travailleur/inscription">S&apos;inscrire</a>
      </header>

      <main>
        <section id="accueil" className="hero section">
          <div className="hero-copy">
            <p className="eyebrow">BIGBLU PHARMA PASS</p>
            <h1>Votre santé,<br /><span>au service de votre travail.</span></h1>
            <p>Accédez facilement à vos médicaments dans un réseau de pharmacies partenaires.</p>
            <div className="actions">
              <a className="btn btn-primary" href="/travailleur/inscription">S&apos;inscrire maintenant</a>
              <a className="btn btn-outline" href="#fonctionnement">Découvrir</a>
            </div>
          </div>
          <div className="hero-media">
            <img src="/v3-hero.jpg" alt="Pharmacienne présentant l'application BIGBLU PHARMA PASS" />
          </div>
        </section>

        <section id="fonctionnalites" className="features section">
          {FEATURES.map((f) => (
            <article key={f.titre}>
              <div className="feature-icon">{f.icone}</div>
              <h3>{f.titre}<br />{f.suite}</h3>
            </article>
          ))}
        </section>

        <section id="fonctionnement" className="steps section">
          <div className="section-heading">
            <p className="eyebrow">PARCOURS</p>
            <h2>Comment ça fonctionne ?</h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <article key={s.n} className="step">
                <span>{s.n}</span>
                <img src={s.image} alt={s.titre} />
                <h3>{s.titre}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="pass-section section">
          <div className="pass-copy">
            <p className="eyebrow">VOTRE PASS BIGBLU</p>
            <h2>30 000 <small>FCFA</small></h2>
            <p>Plafond disponible</p>
            <strong>Abonnement : 2 000 F/mois</strong>
            <a className="btn btn-light" href="/travailleur/inscription">Obtenir mon Pass</a>
          </div>
          <div className="pass-media">
            <img src="/v3-pass.jpg" alt="Pass BIGBLU" />
          </div>
        </section>

        <section id="pharmacies" className="pharmacy-section section">
          <div className="pharmacy-copy">
            <p className="eyebrow">RÉSEAU PARTENAIRE</p>
            <h2>Un large réseau de pharmacies partenaires</h2>
            <p>Trouvez la pharmacie la plus proche de vous et profitez de vos services santé.</p>
            <a className="btn btn-primary" href="/travailleur/login">Voir les pharmacies</a>
          </div>
          <img src="/v3-pharmacie.jpg" alt="Pharmacie partenaire BIGBLU" />
        </section>

        <section id="apropos" className="join-section section">
          <div className="join-copy">
            <p className="eyebrow">BIGBLU PHARMA PASS</p>
            <h2>Rejoignez BIGBLU PHARMA PASS</h2>
            <p>Une solution santé simple, sécurisée et dédiée aux travailleurs.</p>
            <a className="btn btn-primary" href="/travailleur/inscription">S&apos;inscrire maintenant</a>
          </div>
          <img src="/v3-equipe.jpg" alt="Travailleurs et professionnels" />
        </section>
      </main>

      <footer id="contact" className="footer">
        <img src="/logo-complet.png" alt="BIGBLU AFRICA" />
        <p>© {new Date().getFullYear()} BIGBLU PHARMA PASS. Tous droits réservés.</p>
      </footer>

      <style jsx>{`
        .page { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #092b70; background: #fff; }
        .page :global(*) { box-sizing: border-box; }
        .page :global(img) { max-width: 100%; }
        .page :global(a) { text-decoration: none; }
        .section { width: min(1180px, 92%); margin: auto; }

        .site-header { height: 78px; display: flex; align-items: center; gap: 32px; padding: 10px 5%; position: sticky; top: 0; background: rgba(255,255,255,.96); z-index: 20; border-bottom: 1px solid #eef3fa; justify-content: space-between; }
        .brand img { width: 90px; display: block; }
        .nav { display: none; }
        .btn { display: inline-flex; align-items: center; justify-content: center; padding: 14px 24px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; }
        .btn-primary { background: #0868ee; color: #fff; }
        .btn-outline { border: 2px solid #0868ee; color: #0868ee; background: #fff; }
        .btn-light { background: #fff; color: #073575; }
        .header-btn { padding: 11px 18px; font-size: 13px; }

        .hero { min-height: auto; display: grid; grid-template-columns: 1fr; align-items: stretch; background: #f3f8ff; overflow: hidden; border-radius: 0 0 28px 28px; }
        .hero-copy { padding: 48px 25px 30px; display: flex; flex-direction: column; justify-content: center; }
        .eyebrow { font-size: 14px; font-weight: 800; letter-spacing: .8px; color: #0871ed; margin: 0 0 10px; }
        .hero h1 { font-size: 36px; line-height: 1.1; margin: 0 0 18px; color: #082c72; }
        .hero h1 span { color: #0868ee; }
        .hero-copy > p:not(.eyebrow) { font-size: 15px; line-height: 1.55; max-width: 500px; color: #35527d; margin: 0; }
        .actions { display: flex; gap: 14px; margin-top: 18px; flex-wrap: wrap; }
        .hero-media { height: 280px; }
        .hero-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .features { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 30px 0; }
        .features article { padding: 18px 8px; text-align: center; border-radius: 20px; background: #f7faff; }
        .feature-icon { width: 52px; height: 52px; border-radius: 16px; margin: 0 auto 12px; background: #e7f1ff; color: #0868ee; display: grid; place-items: center; font-size: 22px; font-weight: 800; }
        .features h3 { font-size: 12.5px; line-height: 1.3; margin: 0; color: #082c72; }

        .section-heading { margin: 20px 0; }
        .section-heading h2 { font-size: 26px; margin: 0; color: #082c72; }

        .steps { padding: 20px 0 40px; }
        .steps-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
        .step { position: relative; text-align: center; }
        .step img { width: 100%; height: 190px; object-fit: cover; border-radius: 16px; display: block; }
        .step span { position: absolute; z-index: 2; left: 10px; top: 10px; width: 32px; height: 32px; border-radius: 50%; background: #0868ee; color: #fff; display: grid; place-items: center; font-weight: 800; border: 3px solid #fff; font-size: 13px; }
        .step h3 { font-size: 13.5px; line-height: 1.25; margin: 12px 5px; color: #082c72; }

        .pass-section { display: grid; grid-template-columns: 1fr; background: #062e78; border-radius: 28px; overflow: hidden; color: #fff; min-height: auto; }
        .pass-copy { padding: 32px; }
        .pass-copy .eyebrow { color: #4eb7ff; }
        .pass-copy h2 { font-size: 42px; color: #ffc52d; margin: 18px 0 0; }
        .pass-copy h2 small { font-size: 20px; }
        .pass-copy p { font-size: 15px; margin: 0; }
        .pass-copy strong { display: block; margin: 14px 0 22px; font-size: 15px; }
        .pass-media { height: 220px; }
        .pass-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .pharmacy-section, .join-section { display: grid; grid-template-columns: 1fr; align-items: stretch; margin-top: 28px; overflow: hidden; border-radius: 28px; background: #f4f9ff; }
        .pharmacy-copy, .join-copy { padding: 32px; }
        .pharmacy-section h2, .join-copy h2 { font-size: 24px; margin: 0; color: #082c72; }
        .pharmacy-section img, .join-section img { width: 100%; height: 250px; object-fit: cover; display: block; }
        .pharmacy-copy p:not(.eyebrow), .join-copy p:not(.eyebrow) { font-size: 15px; line-height: 1.5; color: #486283; margin: 8px 0 20px; }

        .footer { margin-top: 50px; padding: 35px 5%; display: flex; flex-direction: column; gap: 15px; align-items: center; justify-content: space-between; background: #062e78; color: #fff; text-align: center; }
        .footer :global(img) { width: 100px; filter: brightness(0) invert(1); }
        .footer p { margin: 0; font-size: 13px; }

        @media (min-width: 901px) {
          .nav { display: flex; gap: 28px; margin-left: auto; }
          .nav :global(a) { color: #153879; text-decoration: none; font-size: 14px; }
          .nav :global(a.active) { color: #075fe9; font-weight: 700; }
          .site-header { justify-content: flex-start; }
          .header-btn { padding: 14px 24px; font-size: 14px; margin-left: 10px; }

          .hero { grid-template-columns: 43% 57%; min-height: 540px; }
          .hero-copy { padding: 75px 20px 55px 55px; }
          .hero h1 { font-size: 52px; line-height: 1.02; }
          .hero-copy > p:not(.eyebrow) { font-size: 18px; }
          .hero-media { height: auto; }

          .features { grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 36px 0; }
          .features article { padding: 25px 15px; }
          .feature-icon { width: 64px; height: 64px; border-radius: 20px; font-size: 28px; }
          .features h3 { font-size: 16px; }

          .section-heading h2 { font-size: 34px; }
          .steps-grid { grid-template-columns: repeat(5, 1fr); gap: 15px; }
          .step img { height: 180px; }
          .step span { width: 38px; height: 38px; font-size: 15px; }
          .step h3 { font-size: 15px; }

          .pass-section { grid-template-columns: 45% 55%; min-height: 300px; }
          .pass-copy { padding: 42px; }
          .pass-copy h2 { font-size: 58px; }
          .pass-copy h2 small { font-size: 25px; }
          .pass-copy p { font-size: 17px; }
          .pass-media { height: auto; }

          .pharmacy-section, .join-section { grid-template-columns: 45% 55%; }
          .pharmacy-copy, .join-copy { padding: 48px; }
          .pharmacy-section h2, .join-copy h2 { font-size: 34px; }
          .pharmacy-section img, .join-section img { height: 100%; min-height: 300px; }
          .pharmacy-copy p:not(.eyebrow), .join-copy p:not(.eyebrow) { font-size: 17px; }

          .footer { flex-direction: row; text-align: left; }
          .footer :global(img) { width: 130px; }
        }

        @media (max-width: 560px) {
          .hero h1 { font-size: 30px; }
          .features { gap: 8px; }
          .features article { padding: 14px 6px; }
          .features h3 { font-size: 11.5px; }
          .pass-copy h2 { font-size: 34px; }
          .section-heading h2 { font-size: 22px; }
        }
      `}</style>
    </div>
  );
}
