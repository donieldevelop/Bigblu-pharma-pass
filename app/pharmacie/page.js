'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import QrCodeCanvas from '../components/QrCodeCanvas';
import PharmacieBottomNav from '../components/PharmacieBottomNav';
import { ScanLine, QrCode, Receipt, Wallet, LogOut } from 'lucide-react';

export default function PharmacieAccueilPage() {
  const [session, setSession] = useState(null);
  const [pharmacie, setPharmacie] = useState(null);
  const [chargementPharmacie, setChargementPharmacie] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentes, setRecentes] = useState([]);
  const [formNom, setFormNom] = useState('');
  const [formAdresse, setFormAdresse] = useState('');
  const [formLat, setFormLat] = useState('');
  const [formLng, setFormLng] = useState('');
  const [inscriptionEnCours, setInscriptionEnCours] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return router.push('/pharmacie/login');
      setSession(data.session);
      const { data: p } = await supabase.from('pharmacies').select('*').eq('user_id', data.session.user.id).maybeSingle();
      setPharmacie(p);
      setChargementPharmacie(false);
      if (p && p.statut === 'active') await chargerStats(p.id);
    });
  }, [router]);

  async function chargerStats(pharmacieId) {
    const debutJour = new Date();
    debutJour.setHours(0, 0, 0, 0);

    const [{ data: transactionsJour }, { data: dernieres }, { data: reglement }] = await Promise.all([
      supabase
        .from('transactions')
        .select('id, montant_total, statut, travailleur_id')
        .eq('pharmacie_id', pharmacieId)
        .gte('created_at', debutJour.toISOString()),
      supabase
        .from('transactions')
        .select('id, reference, montant_total, statut, created_at, utilisateurs(nom, prenom)')
        .eq('pharmacie_id', pharmacieId)
        .order('created_at', { ascending: false })
        .limit(4),
      supabase.from('vue_reglements_pharmacies').select('*').eq('pharmacie_id', pharmacieId).maybeSingle(),
    ]);

    const validees = (transactionsJour || []).filter((t) => t.statut === 'validee');
    const travailleursUniques = new Set(validees.map((t) => t.travailleur_id));
    const montantJour = validees.reduce((s, t) => s + Number(t.montant_total || 0), 0);

    setStats({
      travailleursServis: travailleursUniques.size,
      montantJour,
      transactionsValidees: validees.length,
      montantEnAttente: reglement?.montant_en_attente || 0,
      transactionsEnAttente: reglement?.transactions_en_attente || 0,
    });
    setRecentes(dernieres || []);
  }

  function utiliserPosition() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormLat(pos.coords.latitude.toString());
        setFormLng(pos.coords.longitude.toString());
      },
      () => setError('Impossible de récupérer ta position, saisis-la manuellement.')
    );
  }

  async function inscrirePharmacie(e) {
    e.preventDefault();
    setInscriptionEnCours(true);
    setError('');
    const { error } = await supabase.rpc('pharmacie_inscrire', {
      p_nom: formNom,
      p_adresse: formAdresse,
      p_latitude: parseFloat(formLat),
      p_longitude: parseFloat(formLng),
    });
    setInscriptionEnCours(false);
    if (error) return setError(error.message);
    const { data: p } = await supabase.from('pharmacies').select('*').eq('user_id', session.user.id).maybeSingle();
    setPharmacie(p);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push('/pharmacie/login');
  }

  if (!session || chargementPharmacie) return null;

  if (!pharmacie) {
    return (
      <div className="ecranSeul">
        <h1>Inscrire ma pharmacie</h1>
        <p className="aide">
          Renseigne les informations de ta pharmacie. Un administrateur devra valider ta fiche
          avant que tu puisses effectuer des transactions.
        </p>
        <form onSubmit={inscrirePharmacie} className="formSeul">
          <input placeholder="Nom de la pharmacie" value={formNom} onChange={(e) => setFormNom(e.target.value)} required className="input" />
          <input placeholder="Adresse" value={formAdresse} onChange={(e) => setFormAdresse(e.target.value)} required className="input" />
          <button type="button" onClick={utiliserPosition} className="btnPosition">📍 Utiliser ma position actuelle</button>
          <div className="ligneLatLng">
            <input placeholder="Latitude" value={formLat} onChange={(e) => setFormLat(e.target.value)} required className="input" />
            <input placeholder="Longitude" value={formLng} onChange={(e) => setFormLng(e.target.value)} required className="input" />
          </div>
          {error && <p className="erreur">{error}</p>}
          <button type="submit" disabled={inscriptionEnCours} className="btnPrincipal">
            {inscriptionEnCours ? 'Envoi...' : 'Soumettre pour validation'}
          </button>
        </form>
        <style jsx>{`
          .ecranSeul { padding: 32px 20px; max-width: 420px; margin: 0 auto; font-family: var(--font-body), sans-serif; }
          h1 { font-family: var(--font-display), sans-serif; font-size: 20px; color: #12294D; }
          .aide { font-size: 13px; color: #8393A8; }
          .formSeul { display: grid; gap: 10px; margin-top: 16px; }
          .input { padding: 10px; border-radius: 8px; border: 1px solid #E4E9F0; font-size: 13px; }
          .btnPosition { padding: 10px; border-radius: 8px; border: 1px dashed #8393A8; background: white; cursor: pointer; font-size: 13px; }
          .ligneLatLng { display: flex; gap: 8px; }
          .ligneLatLng .input { flex: 1; }
          .erreur { color: #B8324D; font-size: 13px; }
          .btnPrincipal { padding: 12px; border-radius: 8px; border: none; background: #12294D; color: white; font-weight: 600; cursor: pointer; }
        `}</style>
      </div>
    );
  }

  if (pharmacie.statut !== 'active') {
    return (
      <div className="ecranSeul centre">
        <h2>Fiche en attente de validation</h2>
        <p className="aide">
          La fiche de <strong>{pharmacie.nom}</strong> a été soumise et attend la validation de
          l&apos;administration. Reviens un peu plus tard.
        </p>
        <style jsx>{`
          .ecranSeul { padding: 32px 20px; max-width: 420px; margin: 80px auto 0; font-family: var(--font-body), sans-serif; }
          .centre { text-align: center; }
          h2 { font-family: var(--font-display), sans-serif; color: #12294D; }
          .aide { color: #8393A8; font-size: 13.5px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ecran">
      <div className="entete">
        <div className="marque">
          <img src="/logo.png" alt="BIGBLU" className="logo" />
          <div>
            <strong>{pharmacie.nom}</strong>
            <span>{pharmacie.adresse}</span>
          </div>
        </div>
        <button onClick={logout} className="deconnexion"><LogOut size={16} /></button>
      </div>

      {stats && (
        <div className="hero">
          <span className="dateHero">Aujourd&apos;hui, {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
          <div className="statsHero">
            <div>
              <strong>{stats.travailleursServis}</strong>
              <span>Travailleurs servis</span>
            </div>
            <div>
              <strong>{stats.montantJour.toLocaleString('fr-FR')} F</strong>
              <span>Montant total</span>
            </div>
            <div>
              <strong>{stats.transactionsValidees}</strong>
              <span>Validées</span>
            </div>
          </div>
        </div>
      )}

      <div className="actions">
        <a href="/pharmacie/scanner" className="actionCard">
          <ScanLine size={22} color="#12294D" />
          <span>Scanner un travailleur</span>
        </a>
        <a href="/pharmacie/qrcode" className="actionCard">
          <QrCode size={22} color="#6C4FB3" />
          <span>Mon QR Code</span>
        </a>
        <a href="/pharmacie/transactions" className="actionCard">
          <Receipt size={22} color="#2E7BC4" />
          <span>Transactions</span>
        </a>
        <div className="actionCard reglement">
          <Wallet size={22} color="#D98E3B" />
          <span>{(stats?.montantEnAttente || 0).toLocaleString('fr-FR')} F en attente</span>
        </div>
      </div>

      <div className="section">
        <h2>Dernières transactions</h2>
        {recentes.length === 0 ? (
          <p className="vide">Aucune transaction pour le moment.</p>
        ) : (
          <div className="liste">
            {recentes.map((t) => (
              <div key={t.id} className="ligne">
                <div>
                  <strong>{t.utilisateurs?.prenom} {t.utilisateurs?.nom}</strong>
                  <span>{new Date(t.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="droite">
                  <span className="montant">{Number(t.montant_total).toLocaleString('fr-FR')} F</span>
                  <span className={'badge badge-' + t.statut}>{t.statut}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PharmacieBottomNav actif="accueil" />

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; font-family: var(--font-body), sans-serif; padding-bottom: 100px; }
        .entete { max-width: 480px; margin: 0 auto; padding: 20px 20px 0; display: flex; justify-content: space-between; align-items: center; }
        .marque { display: flex; align-items: center; gap: 10px; }
        .logo { width: 34px; height: 34px; object-fit: contain; }
        .marque strong { display: block; color: #12294D; font-family: var(--font-display), sans-serif; font-size: 15px; }
        .marque span { display: block; color: #8393A8; font-size: 11.5px; }
        .deconnexion { background: none; border: none; color: #B8324D; cursor: pointer; }

        .hero { max-width: 480px; margin: 16px auto 0; background: #0B1B33; border-radius: 16px; padding: 20px; color: white; }
        .dateHero { font-size: 12px; color: rgba(255,255,255,0.6); }
        .statsHero { display: flex; justify-content: space-between; margin-top: 12px; }
        .statsHero strong { display: block; font-family: var(--font-display), sans-serif; font-size: 19px; color: #F0C48A; }
        .statsHero span { display: block; font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 2px; }

        .actions { max-width: 480px; margin: 16px auto 0; padding: 0 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .actionCard { background: white; border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 8px; text-decoration: none; font-size: 12.5px; color: #12294D; font-weight: 600; }
        .actionCard.reglement { background: #FBEBD3; }

        .section { max-width: 480px; margin: 22px auto 0; padding: 0 20px; }
        .section h2 { font-family: var(--font-display), sans-serif; font-size: 15px; color: #12294D; margin: 0 0 10px; }
        .vide { color: #8393A8; font-size: 13px; }
        .liste { display: flex; flex-direction: column; gap: 8px; }
        .ligne { background: white; border-radius: 12px; padding: 14px; display: flex; justify-content: space-between; align-items: center; }
        .ligne strong { display: block; color: #12294D; font-size: 13.5px; }
        .ligne span { font-size: 11.5px; color: #8393A8; }
        .droite { text-align: right; }
        .montant { display: block; font-size: 13px; color: #12294D; font-weight: 600; }
        .badge { display: inline-block; margin-top: 3px; font-size: 10px; padding: 2px 7px; border-radius: 5px; background: #F0F2F5; color: #5B6B82; text-transform: capitalize; }
        .badge-validee { background: #E4F5EA; color: #0E7C3F; }
        .badge-refusee { background: #FBE7E9; color: #B8324D; }
      `}</style>
    </div>
  );
}
