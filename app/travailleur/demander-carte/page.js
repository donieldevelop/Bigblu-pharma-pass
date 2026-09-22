'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { ArrowLeft, Camera, RotateCcw, Check } from 'lucide-react';

export default function DemanderCartePage() {
  const [session, setSession] = useState(null);
  const [entreprise, setEntreprise] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [camActive, setCamActive] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return router.push('/travailleur/login');
      setSession(data.session);
    });
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
    const size = 320;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const vw = video.videoWidth, vh = video.videoHeight;
    const side = Math.min(vw, vh);
    ctx.drawImage(video, (vw - side) / 2, (vh - side) / 2, side, side, 0, 0, size, size);
    setPhotoDataUrl(canvas.toDataURL('image/jpeg', 0.9));
    arreterCamera();
  }

  function reprendre() {
    setPhotoDataUrl(null);
    demarrerCamera();
  }

  async function soumettre(e) {
    e.preventDefault();
    if (!photoDataUrl || !entreprise) return;
    setEnvoi(true);
    setError('');

    try {
      const blob = await (await fetch(photoDataUrl)).blob();
      const path = `${session.user.id}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage.from('photos-cartes').upload(path, blob, {
        contentType: 'image/jpeg',
      });
      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage.from('photos-cartes').getPublicUrl(path);

      const { error: insertError } = await supabase.from('cartes_travailleur').insert({
        travailleur_id: session.user.id,
        entreprise,
        photo_url: pub.publicUrl,
      });
      if (insertError) throw insertError;

      setOk(true);
    } catch (err) {
      setError(err.message);
    }
    setEnvoi(false);
  }

  if (ok) {
    return (
      <div className="ecran">
        <div className="confirmation">
          <Check size={40} color="#0E7C3F" />
          <h2>Ta carte est prête</h2>
          <p>Ta carte BIGBLU PHARMA PASS est disponible dès maintenant dans l&apos;app. La version physique est en cours d&apos;impression — tu seras notifié dès qu&apos;elle sera prête à récupérer au bureau.</p>
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
        <a href="/travailleur/profil" className="retour"><ArrowLeft size={18} /> Retour</a>
        <h1 className="titre">Demander ma carte</h1>
        <p className="sous">Dès l&apos;envoi, ta carte numérique est utilisable immédiatement dans l&apos;app. La carte physique, elle, te sera remise en main propre au bureau une fois imprimée.</p>

        <form onSubmit={soumettre}>
          <label className="label">Nom de ton entreprise</label>
          <input
            value={entreprise}
            onChange={(e) => setEntreprise(e.target.value)}
            placeholder="Ex : Ets Kouassi Transport"
            required
            className="input"
          />

          <label className="label">Photo</label>

          {!photoDataUrl && !camActive && (
            <button type="button" onClick={demarrerCamera} className="btnPhoto">
              <Camera size={18} /> Prendre ma photo
            </button>
          )}

          {camActive && (
            <div className="camWrap">
              <video ref={videoRef} muted playsInline className="video" />
              <div className="cadreOvale" />
              <button type="button" onClick={capturer} className="btnCapturer">Capturer</button>
            </div>
          )}

          {photoDataUrl && (
            <div className="apercu">
              <img src={photoDataUrl} alt="Aperçu" className="photoApercu" />
              <button type="button" onClick={reprendre} className="btnReprendre">
                <RotateCcw size={14} /> Reprendre
              </button>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {error && <p className="erreur">{error}</p>}

          <button type="submit" disabled={!photoDataUrl || !entreprise || envoi} className="btnEnvoyer">
            {envoi ? 'Envoi...' : 'Envoyer ma demande'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .ecran { background: #EEF2F6; min-height: 100vh; }
        .contenu { max-width: 420px; margin: 0 auto; padding: 20px; }
        .retour { display: inline-flex; align-items: center; gap: 6px; color: #5B6B82; text-decoration: none; font-size: 13px; margin-bottom: 16px; }
        .titre { font-size: 20px; margin: 0 0 6px; color: #12294D; }
        .sous { font-size: 12.5px; color: #5B6B82; margin: 0 0 20px; line-height: 1.5; }
        .label { display: block; font-size: 13px; font-weight: 600; color: #12294D; margin: 16px 0 8px; }
        .input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #D7DFE8; font-size: 14px; }
        .btnPhoto { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; border-radius: 10px; border: 1px dashed #9AAAC0; background: white; color: #12294D; font-weight: 600; cursor: pointer; }
        .camWrap { position: relative; border-radius: 14px; overflow: hidden; background: black; }
        .video { width: 100%; display: block; aspect-ratio: 1/1; object-fit: cover; }
        .cadreOvale { position: absolute; inset: 10% 20%; border: 3px solid white; border-radius: 50%; opacity: 0.85; pointer-events: none; box-shadow: 0 0 0 999px rgba(0,0,0,0.35); }
        .btnCapturer { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); background: white; color: #12294D; border: none; padding: 10px 22px; border-radius: 24px; font-weight: 700; font-size: 13px; cursor: pointer; }
        .apercu { text-align: center; }
        .photoApercu { width: 160px; height: 160px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; }
        .btnReprendre { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: #12294D; font-size: 13px; cursor: pointer; }
        .erreur { color: #c0392b; font-size: 13px; margin-top: 10px; }
        .btnEnvoyer { width: 100%; margin-top: 20px; padding: 14px; border-radius: 10px; border: none; background: #12294D; color: white; font-weight: 700; font-size: 14px; cursor: pointer; }
        .btnEnvoyer:disabled { opacity: 0.5; }
      `}</style>
    </div>
  );
}
