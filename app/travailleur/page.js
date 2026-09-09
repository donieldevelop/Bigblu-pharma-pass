'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import BottomNav from '../components/BottomNav';
import { Bell, QrCode, ScanLine, Pill, Receipt, Clock, HeartPulse, Building2, ChevronRight, Eye, Plus, Minus, Wallet } from 'lucide-react';

export default function TravailleurDashboard() {
  const [profil, setProfil] = useState(null);
  const [credit, setCredit] = useState(null);
  const [abonnement, setAbonnement] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [notifNonLues, setNotifNonLues] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return router.push('/travailleur/login');
      const uid = s.session.user.id;

      const [{ data: u }, { data: c }, { data: a }, { data: t }, { count: n }] = await Promise.all([
        supabase.from('utilisateurs').select('*').eq('id', uid).single(),
        supabase.from('credits').select('*').eq('travailleur_id', uid).maybeSingle(),
        supabase.from('abonnements').select('*').eq('travailleur_id', uid).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('transactions').select('id, montant_total, statut, created_at, pharmacies(nom)').eq('travailleur_id', uid).order('created_at', { ascending: false }).limit(3),
        supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('destinataire_id', uid).eq('lu', false),
      ]);

      setProfil(u);
      setCredit(c);
      setAbonnement(a);
      setTransactions(t || []);
      setNotifNonLues(n || 0);
      setLoading(false);
    })();
  }, [router]);

  if (loading) return null;

  const disponible = credit ? credit.plafond - credit.montant_utilise : 0;
  const initiale = (profil?.prenom || profil?.email || '?').charAt(0).toUpperCase();

  const actions = [
    { Icon: Pill, label: 'Pharmacies partenaires', href: '/travailleur/pharmacies', color: '#12294D' },
    { Icon: Receipt, label: 'Mes achats', href: '/travailleur/historique', color: '#0E7C3F' },
    { Icon: Clock, label: 'Historique médicaments', href: '/travailleur/historique', color: '#C0562A' },
    { Icon: HeartPulse, label: 'Conseils santé', href: '/travailleur/conseils', color: '#B8324D' },
  ];

  return (
    <div className="screen">
      <div className="content">
        <header className="topBar">
          <div className="brand">
            <img src="/logo.png" alt="BIG BLU" className="logo" />
            <div>
              <div className="brandTitle">BIG BLU PHARMA PASS</div>
              <div className="brandSub">Votre santé, notre priorité</div>
            </div>
          </div>
          <div className="topBarRight">
            <a href="/travailleur/notifications" className="bellWrap">
              <Bell size={20} />
              {notifNonLues > 0 && <span className="dot" />}
            </a>
            <div className="avatarBlock">
              <div className="avatar">{initiale}</div>
            </div>
          </div>
        </header>

        <p className="greeting">Bonjour, <strong>{profil?.prenom} {profil?.nom}</strong></p>
        <p className="role">Travailleur</p>

        <div className="passCard">
          <div className="passCardTop">
            <span className="passCardLabel">Mon crédit médicament</span>
            <img src="/logo.png" alt="" className="passCardWatermark" />
          </div>
          <div className="passCardAmount">{credit ? `${disponible} FCFA` : '—'}</div>
          <div className="passCardValidite">
            {abonnement?.date_expiration
              ? `Valide jusqu'au ${new Date(abonnement.date_expiration).toLocaleDateString('fr-FR')}`
              : 'Abonnement non activé'}
          </div>
          <a href="/travailleur/credit" className="passCardBtn">
            <Eye size={15} /> Voir les détails
          </a>
        </div>

        <div className="qrActions">
          <a href="/travailleur/qrcode" className="qrAction qrActionBlue">
            <QrCode size={22} />
            <div>
              <strong>Afficher mon QR Code</strong>
              <span>Présentez ce code en pharmacie</span>
            </div>
            <ChevronRight size={18} className="qrChevron" />
          </a>
          <a href="/travailleur/scanner" className="qrAction qrActionPurple">
            <ScanLine size={22} />
            <div>
              <strong>Scanner un QR Code</strong>
              <span>Scannez le QR d&apos;une pharmacie</span>
            </div>
            <ChevronRight size={18} className="qrChevron" />
          </a>
        </div>

        <div className="actionsGrid">
          {actions.map((a) => (
            <a key={a.label} href={a.href} className="actionCard">
              <div className="actionIconWrap" style={{ background: `${a.color}18`, color: a.color }}>
                <a.Icon size={22} />
              </div>
              <span className="actionLabel">{a.label}</span>
            </a>
          ))}
        </div>

        <a href="/travailleur/pharmacies" className="bandeau">
          <div className="bandeauIcon">
            <Building2 size={28} />
          </div>
          <span className="bandeauTexte">
            <strong>Trouvez une pharmacie partenaire près de vous</strong>
            <span>Accédez à la carte et aux horaires de nos pharmacies partenaires.</span>
          </span>
          <ChevronRight size={20} />
        </a>

        <div className="transHeader">
          <h3>Dernières transactions</h3>
          <a href="/travailleur/historique">Voir tout <ChevronRight size={14} /></a>
        </div>

        {transactions.length === 0 ? (
          <p className="vide">Aucune transaction pour le moment.</p>
        ) : (
          <div className="transList">
            {transactions.map((t) => (
              <a key={t.id} href={`/travailleur/transactions/${t.id}`} className="transItem">
                <div className={`transIcon ${t.statut === 'validee' ? 'transIconOk' : 'transIconAttente'}`}>
                  <Plus size={16} />
                </div>
                <div className="transInfo">
                  <strong>Achat médicaments</strong>
                  <span>{t.pharmacies?.nom || '—'} · {new Date(t.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <span className="transMontant">- {t.montant_total} FCFA</span>
                <ChevronRight size={16} color="#B9C4D3" />
              </a>
            ))}
          </div>
        )}
      </div>

      <BottomNav actif="accueil" />

      <style jsx>{`
        .screen { background: #EEF2F6; min-height: 100vh; color: #12294D; }
        .content { max-width: 480px; margin: 0 auto; padding: 20px 20px 100px; }
        .topBar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .brand { display: flex; align-items: center; gap: 10px; }
        .logo { height: 38px; width: auto; }
        .brandTitle { font-size: 13px; font-weight: 800; letter-spacing: 0.2px; }
        .brandSub { font-size: 11px; color: #5B6B82; }
        .topBarRight { display: flex; align-items: center; gap: 14px; }
        .bellWrap { position: relative; color: #12294D; }
        .dot { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: #D63B3B; border-radius: 50%; }
        .avatar { width: 38px; height: 38px; border-radius: 50%; background: #12294D; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
        .greeting { font-size: 15px; margin: 0; }
        .role { font-size: 12px; color: #8393A8; margin: 0 0 18px; }

        .passCard { position: relative; background: linear-gradient(135deg, #12294D 0%, #1F4478 100%); border-radius: 16px; padding: 22px; color: white; overflow: hidden; margin-bottom: 16px; }
        .passCardWatermark { position: absolute; right: -10px; top: -10px; width: 90px; opacity: 0.15; }
        .passCardLabel { font-size: 12px; opacity: 0.85; }
        .passCardAmount { font-size: 30px; font-weight: 800; margin: 6px 0 4px; }
        .passCardValidite { font-size: 12px; opacity: 0.75; margin-bottom: 16px; }
        .passCardBtn { display: inline-flex; align-items: center; gap: 6px; background: white; color: #12294D; font-size: 12.5px; font-weight: 700; padding: 8px 14px; border-radius: 8px; text-decoration: none; }

        .qrActions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
        .qrAction { display: flex; flex-direction: column; gap: 8px; padding: 14px; border-radius: 14px; text-decoration: none; position: relative; }
        .qrAction strong { display: block; font-size: 13px; color: #12294D; }
        .qrAction span { display: block; font-size: 11px; color: #5B6B82; margin-top: 2px; }
        .qrActionBlue { background: #DCE7F7; color: #12294D; }
        .qrActionPurple { background: #EDE7F9; color: #5B3FA0; }
        .qrChevron { position: absolute; top: 14px; right: 12px; color: inherit; opacity: 0.6; }

        .actionsGrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 18px; }
        .actionCard { display: flex; flex-direction: column; align-items: center; gap: 8px; text-decoration: none; text-align: center; }
        .actionIconWrap { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .actionLabel { font-size: 11px; color: #12294D; font-weight: 600; line-height: 1.2; }

        .bandeau { display: flex; align-items: center; gap: 14px; background: #DCE7F7; border-radius: 14px; padding: 16px; text-decoration: none; color: #12294D; margin-bottom: 20px; }
        .bandeauIcon { color: #12294D; flex-shrink: 0; }
        .bandeauTexte { flex: 1; display: flex; flex-direction: column; gap: 2px; font-size: 12.5px; }
        .bandeauTexte span { color: #3E4C63; font-weight: 400; }

        .transHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .transHeader h3 { font-size: 15px; margin: 0; }
        .transHeader a { font-size: 12.5px; color: #12294D; text-decoration: none; display: flex; align-items: center; gap: 2px; }
        .vide { color: #8393A8; font-size: 13px; }
        .transList { background: white; border-radius: 14px; overflow: hidden; }
        .transItem { display: flex; align-items: center; gap: 10px; padding: 12px 14px; text-decoration: none; color: #12294D; border-bottom: 1px solid #F0F2F5; }
        .transItem:last-child { border-bottom: none; }
        .transIcon { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
        .transIconOk { background: #0E7C3F; }
        .transIconAttente { background: #8393A8; }
        .transInfo { flex: 1; display: flex; flex-direction: column; font-size: 13px; }
        .transInfo span { font-size: 11px; color: #8393A8; }
        .transMontant { font-size: 13px; font-weight: 700; color: #B8324D; }
      `}</style>
    </div>
  );
}
