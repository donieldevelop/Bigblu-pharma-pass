'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function RecherchePharmaciesPage() {
  const [position, setPosition] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [statut, setStatut] = useState('idle'); // idle | localisation | recherche | ok | erreur
  const [erreur, setErreur] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/travailleur/login');
    });
  }, [router]);

  function localiser() {
    setStatut('localisation');
    setErreur('');
    if (!navigator.geolocation) {
      setErreur('La géolocalisation n\'est pas disponible sur cet appareil.');
      setStatut('erreur');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });
        setStatut('recherche');
        const { data, error } = await supabase.rpc('rechercher_pharmacies_proches', {
          p_latitude: latitude,
          p_longitude: longitude,
          p_rayon_km: 15,
        });
        if (error) {
          setErreur(error.message);
          setStatut('erreur');
          return;
        }
        setPharmacies(data || []);
        setStatut('ok');
      },
      (err) => {
        setErreur("Localisation refusée ou indisponible : " + err.message);
        setStatut('erreur');
      }
    );
  }

  function itineraire(p) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`;
    window.open(url, '_blank');
  }

  return (
    <div style={{ background: '#EEF2F6', minHeight: '100vh' }}>
      <div style={{ maxWidth: 440, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 18, color: '#12294D' }}>Pharmacies proches</h1>
          <a href="/travailleur" style={{ fontSize: 13, color: '#5B6B82' }}>← Retour</a>
        </div>

        {statut === 'idle' && (
          <button onClick={localiser} style={btn}>
            Utiliser ma position
          </button>
        )}

        {(statut === 'localisation' || statut === 'recherche') && <p>Recherche en cours...</p>}

        {statut === 'erreur' && <p style={{ color: '#c0392b' }}>{erreur}</p>}

        {statut === 'ok' && (
          <>
            {pharmacies.length === 0 ? (
              <p style={{ color: '#8393A8' }}>Aucune pharmacie partenaire trouvée à moins de 15 km.</p>
            ) : (
              pharmacies.map((p) => (
                <div key={p.id} style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: 15 }}>{p.nom}</strong>
                    <span style={{ fontSize: 13, color: '#5B6B82' }}>{p.distance_km} km</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#5B6B82', margin: '4px 0 12px' }}>{p.adresse}</p>
                  <button onClick={() => itineraire(p)} style={{ ...btn, padding: '8px 14px', fontSize: 13 }}>
                    S&apos;y rendre
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

const btn = { padding: '12px 20px', borderRadius: 6, border: 'none', background: '#12294D', color: 'white', fontWeight: 600, cursor: 'pointer' };
