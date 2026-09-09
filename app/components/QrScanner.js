'use client';

import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

export default function QrScanner({ onResult }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [actif, setActif] = useState(false);
  const [erreur, setErreur] = useState('');
  const streamRef = useRef(null);
  const frameRef = useRef(null);

  async function demarrer() {
    setErreur('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setActif(true);
      scanner();
    } catch (e) {
      setErreur("Impossible d'accéder à la caméra : " + e.message);
    }
  }

  function arreter() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setActif(false);
  }

  function scanner() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');

    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          arreter();
          onResult(code.data);
          return;
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => () => arreter(), []);

  return (
    <div>
      {!actif ? (
        <button onClick={demarrer} style={{ padding: '10px 16px', borderRadius: 6, border: 'none', background: '#1a3a6b', color: 'white', cursor: 'pointer' }}>
          Scanner un QR Code
        </button>
      ) : (
        <div>
          <video ref={videoRef} style={{ width: '100%', borderRadius: 8 }} muted playsInline />
          <button onClick={arreter} style={{ marginTop: 8, padding: '6px 12px', borderRadius: 6, border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}>
            Annuler
          </button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {erreur && <p style={{ color: '#c0392b', fontSize: 13 }}>{erreur}</p>}
    </div>
  );
}
