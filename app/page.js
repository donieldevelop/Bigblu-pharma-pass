'use client';

const FEATURES = [
  { icone: '/icons/plafond-mensuel.svg', titre: 'Un crédit mensuel', suite: 'dédié' },
  { icone: '/icons/utilisation-qr.svg', titre: 'Utilisation simple', suite: 'avec QR Code' },
  { icone: '/icons/pharmacies-partenaires.svg', titre: 'Réseau de pharmacies', suite: 'partenaires' },
  { icone: '/icons/travailleurs.svg', titre: 'Pour tous les', suite: 'travailleurs' },
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
          <div className="hero-media media-fade">
            <img src="/v3-hero.jpg" alt="Pharmacienne présentant l'application BIGBLU PHARMA PASS" />
          </div>
        </section>

        <section id="fonctionnalites" className="features section">
          {FEATURES.map((f) => (
            <article key={f.titre}>
              <div className="feature-icon"><img src={f.icone} alt="" /></div>
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
          <div className="pass-media media-fade">
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
          <div className="media-fade pharmacyImg">
            <img src="/v3-pharmacie.jpg" alt="Pharmacie partenaire BIGBLU" />
          </div>
        </section>

        <section id="apropos" className="join-section section">
          <div className="join-copy">
            <p className="eyebrow">BIGBLU PHARMA PASS</p>
            <h2>Rejoignez BIGBLU PHARMA PASS</h2>
            <p>Une solution santé simple, sécurisée et dédiée aux travailleurs.</p>
            <a className="btn btn-primary" href="/travailleur/inscription">S&apos;inscrire maintenant</a>
          </div>
          <div className="media-fade joinImg">
            <img src="/v3-equipe.jpg" alt="Travailleurs et professionnels" />
          </div>
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
        .btn { display: inline-flex; align-items: center; justify-content: center; padding: 9px 12px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 10.5px; text-align: center; }
        .btn-primary { background: #0868ee; color: #fff; }
        .btn-outline { border: 2px solid #0868ee; color: #0868ee; background: #fff; }
        .btn-light { background: #fff; color: #073575; }
        .header-btn { padding: 11px 18px; font-size: 13px; }

        .hero { min-height: auto; display: grid; grid-template-columns: 1.1fr 0.9fr; align-items: stretch; background: #f3f8ff; overflow: hidden; border-radius: 0 0 28px 28px; }
        .hero-copy { padding: 24px 8px 24px 16px; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
        .eyebrow { font-size: 10px; letter-spacing: .5px; font-weight: 800; color: #0871ed; margin: 0 0 6px; }
        .hero h1 { font-size: 20px; line-height: 1.15; margin: 0 0 8px; color: #082c72; }
        .hero h1 span { color: #0868ee; }
        .hero-copy > p:not(.eyebrow) { font-size: 11.5px; line-height: 1.4; max-width: 500px; color: #35527d; margin: 0; }
        .actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
        .hero-media { min-height: 100%; }
        .hero-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .features { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding: 30px 0; }
        .features article { padding: 10px 4px; text-align: center; border-radius: 14px; background: #f7faff; }
        .feature-icon { width: 38px; height: 38px; border-radius: 50%; margin: 0 auto 6px; background: #e7f1ff; display: grid; place-items: center; }
        .feature-icon img { width: 18px; height: 18px; }
        .features h3 { font-size: 8.5px; line-height: 1.2; margin: 0; color: #082c72; }

        .section-heading { margin: 20px 0; }
        .section-heading h2 { font-size: 26px; margin: 0; color: #082c72; }

        .steps { padding: 20px 0 40px; }
        .steps-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .step { position: relative; text-align: left; display: flex; flex-direction: row; align-items: center; gap: 12px; background: #f7faff; border-radius: 14px; padding: 8px; }
        .step img { width: 90px; height: 90px; object-fit: cover; border-radius: 12px; display: block; }
        .step span { position: absolute; z-index: 2; left: -6px; top: -6px; width: 26px; height: 26px; border-radius: 50%; background: #0868ee; color: #fff; display: grid; place-items: center; font-weight: 800; border: 2px solid #fff; font-size: 11px; }
        .step h3 { font-size: 12.5px; line-height: 1.25; margin: 0; color: #082c72; flex: 1; }

        .pass-section { display: grid; grid-template-columns: 1.1fr 0.9fr; background: #062e78; border-radius: 20px; overflow: hidden; color: #fff; min-height: auto; align-items: stretch; }
        .pass-copy { padding: 18px 14px; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
        .pass-copy .eyebrow { color: #4eb7ff; font-size: 9px; margin: 0 0 4px; }
        .pass-copy h2 { font-size: 26px; color: #ffc52d; margin: 8px 0 0; line-height: 1; }
        .pass-copy h2 small { font-size: 13px; }
        .pass-copy p { font-size: 11px; margin: 2px 0 0; }
        .pass-copy strong { display: block; margin: 8px 0 12px; font-size: 11px; }
        .pass-media { min-height: 100%; }
        .pass-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .pharmacy-section, .join-section { display: grid; grid-template-columns: 1.1fr 0.9fr; align-items: stretch; margin-top: 16px; overflow: hidden; border-radius: 20px; background: #f4f9ff; }
        .pharmacy-copy, .join-copy { padding: 16px 12px; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
        .pharmacy-section h2, .join-copy h2 { font-size: 15px; margin: 0; color: #082c72; line-height: 1.2; }
        .media-fade { position: relative; }
        .media-fade::before { content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .hero-media::before { background: linear-gradient(to right, #f3f8ff 0%, rgba(243,248,255,0) 22%); }
        .pass-media::before { background: linear-gradient(to right, #062e78 0%, rgba(6,46,120,0) 22%); }
        .pharmacyImg::before { background: linear-gradient(to right, #f4f9ff 0%, rgba(244,249,255,0) 22%); }
        .joinImg::before { background: linear-gradient(to right, #f4f9ff 0%, rgba(244,249,255,0) 22%); }
        .pharmacyImg, .joinImg { position: relative; }
        .pharmacyImg img, .joinImg img { width: 100%; height: 100%; min-height: 150px; object-fit: cover; display: block; }
        .pharmacy-copy p:not(.eyebrow), .join-copy p:not(.eyebrow) { font-size: 10.5px; line-height: 1.35; color: #486283; margin: 6px 0 10px; }

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
          .eyebrow { font-size: 14px; letter-spacing: .8px; margin: 0 0 10px; }
          .hero h1 { font-size: 52px; line-height: 1.02; margin: 0 0 18px; }
          .hero-copy > p:not(.eyebrow) { font-size: 18px; }
          .actions { gap: 14px; margin-top: 18px; }
          .btn { padding: 14px 24px; border-radius: 10px; font-size: 14px; }
          .hero-media { height: auto; }

          .features { grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 36px 0; }
          .features article { padding: 25px 15px; }
          .feature-icon { width: 64px; height: 64px; }
          .feature-icon img { width: 30px; height: 30px; }
          .features h3 { font-size: 16px; }

          .section-heading h2 { font-size: 34px; }
          .steps-grid { grid-template-columns: repeat(5, 1fr); gap: 15px; }
          .step { flex-direction: column; align-items: stretch; text-align: center; background: none; padding: 0; }
          .step img { width: 100%; height: 180px; border-radius: 16px; }
          .step span { left: 10px; top: 10px; width: 38px; height: 38px; font-size: 15px; border-width: 3px; }
          .step h3 { font-size: 15px; margin: 12px 5px; }

          .pass-section { grid-template-columns: 45% 55%; min-height: 300px; }
          .pass-copy { padding: 42px; }
          .pass-copy .eyebrow { font-size: 14px; margin: 0 0 10px; }
          .pass-copy h2 { font-size: 58px; margin: 18px 0 0; }
          .pass-copy h2 small { font-size: 25px; }
          .pass-copy p { font-size: 17px; }
          .pass-copy strong { font-size: 15px; margin: 16px 0 25px; }
          .pass-media { height: auto; }

          .pharmacy-section, .join-section { grid-template-columns: 45% 55%; }
          .pharmacy-copy, .join-copy { padding: 48px; }
          .pharmacy-section h2, .join-copy h2 { font-size: 34px; }
          .pharmacyImg img, .joinImg img { height: 100%; min-height: 300px; }
          .pharmacy-copy p:not(.eyebrow), .join-copy p:not(.eyebrow) { font-size: 17px; }

          .footer { flex-direction: row; text-align: left; }
          .footer :global(img) { width: 130px; }
        }

        @media (max-width: 560px) {
          .hero h1 { font-size: 30px; }
          .features { gap: 4px; }
          .features article { padding: 8px 3px; }
          .features h3 { font-size: 7.5px; }
          .pass-copy h2 { font-size: 34px; }
          .section-heading h2 { font-size: 22px; }
        }
      `}</style>
    </div>
  );
}
