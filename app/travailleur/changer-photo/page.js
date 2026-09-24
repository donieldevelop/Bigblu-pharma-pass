'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { retirerFond } from '../../../lib/retirerFond';
import { ArrowLeft, Camera, RotateCcw, Check, Loader2 } from 'lucide-react';

export default function ChangerPhotoPage() {
  const [session, setSession] = useState(null);
  const [carte, setCarte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [photoOriginale, setPhotoOriginale] = useState(null);
  const [camActive, setCamActive] = useState(false);
  const [traitement, setTraitement] = useState(false);
  const [echecFond, setEchecFond] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return router.push('/travailleur/login');
      setSession(data.session);
      const { data: c } = await supabase
        .from('cartes_travailleur')
        .select('id, photo_url')
        .eq('travailleur_id', data.session.user.id)
        .order('demandee_le', { ascending: false })
        .limit(1)
        .maybeSingle();
      setCarte(c);
      setLoading(false);
    })();
    return () => arreterCamera();
  }, [router]);

  async function demarrerCamera() {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCamActive(true);
    } catch (e) {
      setError("Impossible d'accéder à la caméra : " + e.message);
    }
  }

  function arreterCamera() {
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    setCamActive(false);
  }

  function capturer() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const size = 640;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const vw = video.videoWidth, vh = video.videoHeight;
    const side = Math.min(vw, vh);
    ctx.drawImage(video, (vw - side) / 2, (vh - side) / 2, side, side, 0, 0, size, size);
    const originale = canvas.toDataURL('image/jpeg', 0.92);
    arreterCamera();
    setPhotoOriginale(originale);
    traiterFond(originale);
  }

  async function traiterFond(originale) {
    setTraitement(true);
    setEchecFond(false);
    setPhotoDataUrl(null);
    try {
      setPhotoDataUrl(await retirerFond(originale));
    } catch (e) {
      setEchecFond(true);
      setPhotoDataUrl(originale);
    }
    setTraitement(false);
  }

  function reprendre() {
    setPhotoDataUrl(null);
    setPhotoOriginale(null);
    setEchecFond(false);
    demarrerCamera();
  }

  async function enregistrer() {
    if (!photoDataUrl || !carte) return;
    setEnvoi(true);
    setError('');
    try {
      const blob = await (await fetch(photoDataUrl)).blob();
      const estPng = photoDataUrl.startsWith('data:image/png');
      const path = `${session.user.id}/${Date.now()}.${estPng ? 'png' : 'jpg'}`;
      const { error: upErr } = await supabase.storage.from('photos-cartes').upload(path, blob, {
        contentType: estPng ? 'image/png' : 'image/jpeg',
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('photos-cartes').getPublicUrl(path);
      const { error: rpcErr } = await supabase.rpc('changer_photo_carte', {
        p_carte_id: carte.id,
        p_photo_url: pub.publicUrl,
      });
      if (rpcErr) throw rpcErr;
      setOk(true);
    } catch (e) {
      setError("La photo n'a pas pu être enregistrée : " + e.message);
    }
    setEnvoi(false);
  }

  if (loading) return null;

  if (!carte) {
    return (
      <div className="ecran">
        <div className="contenu">
          <a href="/travailleur/profil" className="retour"><ArrowLeft size={18} /> Retour</a>
          <p className="sous">Tu n&apos;as pas encore de carte.</p>
          <a href="/travailleur/demander-carte" className="btnEnvoyer lien">Demander ma carte</a>
        </div>
        <style jsx>{`
          .ecran { background: #EEF2F6; min-height: 100vh; }
          .contenu { max-width: 420px; margin: 0 auto; padding: 20px; text-align: center; }
          .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; }
          .sous { color: #5B6B82; margin: 30px 0 20px; }
          .lien { display: inline-block; background: #12294D; color: white; padding: 12px 22px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; }
        `}</style>
      </div>
    );
  }

  if (ok) {
    return (
      <div className="ecran">
        <div className="confirmation">
          <Check size={40} color="#0E7C3F" />
          <h2>Photo mise à jour</h2>
          <p>Ta carte affiche maintenant ta nouvelle photo. Ton matricule ne change pas.</p>
          <a href="/travailleur/carte" className="btn">Voir ma carte</a>
        </div>
        <style jsx>{`
          .ecran { background: #EEF2F6; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
          .confirmation { background: white; border-radius: 16px; padding: 32px; text-align: center; max-width: 340px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
          .confirmation h2 { color: #12294D; margin: 0; font-size: 18px; }
          .confirmation p { color: #5B6B82; font-size: 13.5px; line-height: 1.5; margin: 0; }
          .btn { margin-top: 10px; background: #12294D; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ecran">
      <div className="contenu">
        <a href="/travailleur/carte" className="retour"><ArrowLeft size={18} /> Retour</a>
        <h1 className="titre">Changer ma photo</h1>
        <p className="sous">Le fond est retiré automatiquement. Place-toi face à la lumière, de préférence devant un mur uni.</p>

        {!photoDataUrl && !camActive && !traitement && (
          <button type="button" onClick={demarrerCamera} className="btnPhoto">
            <Camera size={18} /> Prendre ma nouvelle photo
          </button>
        )}

        <div className="camWrap" style={{ display: camActive && !photoDataUrl && !traitement ? 'block' : 'none' }}>
          <video ref={videoRef} muted playsInline className="video" />
          <div className="cadreOvale" />
          <button type="button" onClick={capturer} className="btnCapturer">Capturer</button>
        </div>

        {traitement && (
          <div className="traitement">
            <Loader2 size={22} className="tourne" />
            <span>Suppression du fond en cours…</span>
          </div>
        )}

        {photoDataUrl && !traitement && (
          <div className="apercu">
            <div className="cadrePhoto">
              <img src={photoDataUrl} alt="Aperçu" className="photoApercu" />
            </div>
            {echecFond ? (
              <p className="avertissement">Le fond n&apos;a pas pu être retiré. Tu peux réessayer, ou reprendre la photo devant un mur uni.</p>
            ) : (
              <p className="aide">Vérifie que ton visage et tes cheveux sont bien détourés. Sinon, reprends la photo.</p>
            )}
            <div className="actionsApercu">
              {echecFond && photoOriginale && (
                <button type="button" onClick={() => traiterFond(photoOriginale)} className="btnReprendre">Réessayer</button>
              )}
              <button type="button" onClick={reprendre} className="btnReprendre">
                <RotateCcw size={14} /> Reprendre la photo
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {error && <p className="erreur">{error}</p>}

        {photoDataUrl && !traitement && (
          <button type="button" onClick={enregistrer} disabled={envoi} className="btnEnvoyer">
            {envoi ? 'Enregistrement...' : 'Utiliser cette photo'}
          </button>
        )}
      </div>

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; }
        .contenu { max-width: 420px; margin: 0 auto; padding: 20px; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 16px; }
        .titre { font-size: 20px; margin: 0 0 6px; color: #12294D; }
        .sous { font-size: 12.5px; color: #5B6B82; margin: 0 0 20px; line-height: 1.5; }
        .btnPhoto { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; border-radius: 10px; border: 1px dashed #9AAAC0; background: white; color: #12294D; font-weight: 600; cursor: pointer; }
        .camWrap { position: relative; border-radius: 14px; overflow: hidden; background: black; }
        .video { width: 100%; display: block; aspect-ratio: 1/1; object-fit: cover; }
        .cadreOvale { position: absolute; inset: 10% 20%; border: 3px solid white; border-radius: 50%; opacity: 0.85; pointer-events: none; box-shadow: 0 0 0 999px rgba(0,0,0,0.35); }
        .btnCapturer { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); background: white; color: #12294D; border: none; padding: 10px 22px; border-radius: 24px; font-weight: 700; font-size: 13px; cursor: pointer; }
        .traitement { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 30px 0; color: #12294D; font-size: 13px; }
        .traitement :global(.tourne) { animation: tourne 1s linear infinite; }
        @keyframes tourne { to { transform: rotate(360deg); } }
        .apercu { text-align: center; }
        .cadrePhoto { width: 150px; height: 197px; margin: 0 auto 10px; border-radius: 12px; background: #C8DBF4; overflow: hidden; }
        .photoApercu { width: 100%; height: 100%; object-fit: cover; display: block; }
        .aide, .avertissement { font-size: 12px; line-height: 1.45; margin: 0 0 6px; }
        .aide { color: #5B6B82; }
        .avertissement { color: #B45309; }
        .actionsApercu { display: flex; justify-content: center; gap: 16px; }
        .btnReprendre { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: #12294D; font-size: 13px; cursor: pointer; }
        .erreur { color: #c0392b; font-size: 13px; margin-top: 10px; }
        .btnEnvoyer { width: 100%; margin-top: 20px; padding: 14px; border-radius: 10px; border: none; background: #12294D; color: white; font-weight: 700; font-size: 14px; cursor: pointer; }
        .btnEnvoyer:disabled { opacity: 0.5; }
      `}</style>
    </div>
  );
}
