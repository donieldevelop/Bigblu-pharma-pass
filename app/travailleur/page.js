'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import BottomNav from '../components/BottomNav';

export default function TravailleurDashboard() {
  const [profil, setProfil] = useState(null);
  const [credit, setCredit] = useState(null);
  const [abonnement, setAbonnement] = useState(null);
  const [notifNonLues, setNotifNonLues] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/travailleur/login');
      const uid = s.session.user.id;

      const [{ data: u }, { data: c }, { data: a }, { count: n }] = await Promise.all([
        supabase.from('utilisateurs').select('*').eq('id', uid).single(),
        supabase.from('credits').select('*').eq('travailleur_id', uid).maybeSingle(),
        supabase.from('abonnements').select('*').eq('travailleur_id', uid).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('destinataire_id', uid).eq('lu', false),
      ]);

      setProfil(u);
      setCredit(c);
      setAbonnement(a);
      setNotifNonLues(n || 0);
      setLoading(false);
    })();
  }, [router]);

  if (loading) return null;

  const disponible = credit ? credit.plafond - credit.montant_utilise : 0;
  const initiale = (profil?.prenom || profil?.email || '?').charAt(0).toUpperCase();

  const actions = [
    { icone: '📱', label: 'Mon QR Code', href: '/travailleur/qrcode' },
    { icone: '💊', label: 'Pharmacies partenaires', href: '/travailleur/pharmacies' },
    { icone: '🧾', label: 'Mes achats', href: '/travailleur/historique' },
    { icone: '📋', label: 'Historique médicaments', href: '/travailleur/historique' },
  ];

  return (
    <div className="screen">
      <div className="content">
        <header className="topBar">
          <img src="/logo.png" alt="BIG BLU" className="logo" />
          <div className="topBarRight">
            <a href="/travailleur/notifications" className="bellWrap">
              🔔
              {notifNonLues > 0 && <span className="dot" />}
            </a>
            <div className="avatar">{initiale}</div>
          </div>
        </header>

        <p className="greeting">Bonjour {profil?.prenom || ''},</p>
        <h1 className="titre">Prenez soin de votre santé en toute sérénité</h1>
        <div className="barre" />
        <p className="sous">Votre crédit médicament, réglé en pharmacie.</p>

        <div className="features">
          <span>✅ Simple et sécurisé</span>
          <span>🤝 Réseau de pharmacies partenaires</span>
          <span>👥 Pour tous les travailleurs</span>
        </div>

        <div className="passCard">
          <div className="passCardTop">
            <span className="passCardLabel">BIGBLU PHARMA PASS</span>
            <div className="passCardChip" />
          </div>
          <div className="passCardCaption">Crédit disponible</div>
          <div className="passCardAmount">{credit ? `${disponible} FCFA` : '—'}</div>
          <div className="passCardFooter">
            <span>Plafond {credit?.plafond ?? 0} FCFA</span>
            <span>Abonnement : {abonnement?.statut || 'non activé'}</span>
          </div>
          <img src="/logo.png" alt="" className="passCardWatermark" />
        </div>

        <div className="actionsGrid">
          {actions.map((a) => (
            <a key={a.label} href={a.href} className="actionCard">
              <span className="actionIcon">{a.icone}</span>
              <span className="actionLabel">{a.label}</span>
            </a>
          ))}
        </div>

        <a href="/travailleur/pharmacies" className="bandeau">
          <span className="bandeauIcon">🏥</span>
          <span className="bandeauTexte">
            <strong>Réseau de pharmacies partenaires en expansion.</strong>
            <span>Trouvez une pharmacie près de vous.</span>
          </span>
          <span className="bandeauFleche">›</span>
        </a>

        <a href="/travailleur/qrcode" className="bandeau">
          <span className="bandeauIcon">📷</span>
          <span className="bandeauTexte">
            <strong>Utilisez votre QR Code</strong>
            <span>Présentez votre QR Code en pharmacie pour régler avec votre crédit.</span>
          </span>
          <span className="bandeauFleche">›</span>
        </a>
      </div>

      <BottomNav actif="accueil" />

      <style jsx>{`
        .screen {
          background: #eef2f6;
          min-height: 100vh;
          color: #12294d;
        }
        .content {
          max-width: 480px;
          margin: 0 auto;
          padding: 20px 20px 100px;
        }
        .topBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .logo {
          height: 40px;
          width: auto;
        }
        .topBarRight {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .bellWrap {
          position: relative;
          font-size: 20px;
          text-decoration: none;
        }
        .dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: #d63b3b;
          border-radius: 50%;
        }
        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #12294d;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        .greeting {
          font-size: 15px;
          color: #5b6b82;
          margin: 0 0 4px;
        }
        .titre {
          font-size: 26px;
          font-weight: 800;
          line-height: 1.2;
          margin: 0 0 10px;
        }
        .barre {
          width: 40px;
          height: 3px;
          background: #12294d;
          margin-bottom: 16px;
        }
        .sous {
          font-size: 14px;
          color: #5b6b82;
          margin: 0 0 20px;
        }
        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 12px;
          color: #3e4c63;
          margin-bottom: 24px;
        }
        .passCard {
          position: relative;
          background: linear-gradient(135deg, #12294d 0%, #1f4478 100%);
          border-radius: 16px;
          padding: 22px;
          color: white;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .passCardWatermark {
          position: absolute;
          right: -20px;
          bottom: -20px;
          width: 120px;
          opacity: 0.15;
        }
        .passCardTop {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        .passCardLabel {
          font-size: 11px;
          letter-spacing: 0.6px;
          opacity: 0.85;
        }
        .passCardChip {
          width: 28px;
          height: 21px;
          border-radius: 4px;
          background: #d98e3b;
        }
        .passCardCaption {
          font-size: 12px;
          opacity: 0.75;
          margin-bottom: 4px;
        }
        .passCardAmount {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .passCardFooter {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          opacity: 0.8;
          position: relative;
          z-index: 1;
        }
        .actionsGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .actionCard {
          background: white;
          border-radius: 14px;
          padding: 18px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #12294d;
          text-align: center;
        }
        .actionIcon {
          font-size: 22px;
        }
        .actionLabel {
          font-size: 12.5px;
          font-weight: 600;
        }
        .bandeau {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #dce7f7;
          border-radius: 14px;
          padding: 16px;
          text-decoration: none;
          color: #12294d;
          margin-bottom: 12px;
        }
        .bandeauIcon {
          font-size: 26px;
        }
        .bandeauTexte {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 13px;
        }
        .bandeauFleche {
          font-size: 22px;
          color: #12294d;
        }
      `}</style>
    </div>
  );
}
