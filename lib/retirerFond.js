'use client';

// Suppression du fond d'une photo portrait, directement sur l'appareil.
// Outil : MediaPipe Image Segmenter (Google), modele "selfie multiclass"
// qui distingue fond / cheveux / visage / corps / vetements.
// Aucun envoi a un service externe, aucun cout par photo.
// Resultat : PNG avec fond TRANSPARENT.

const VERSION = '1.0.1';
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VERSION}/wasm`;
const MODELE_URL =
  'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite';

let segmenterPromise = null;

async function getSegmenter() {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const { FilesetResolver, ImageSegmenter } = await import('@mediapipe/tasks-vision');
      const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
      return ImageSegmenter.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODELE_URL, delegate: 'CPU' },
        runningMode: 'IMAGE',
        outputConfidenceMasks: true,
        outputCategoryMask: false,
      });
    })().catch((e) => {
      segmenterPromise = null; // permettre un nouvel essai
      throw e;
    });
  }
  return segmenterPromise;
}

// Charge une image depuis une URL (dataURL ou URL Supabase publique)
export function chargerImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Impossible de charger l'image"));
    img.src = src;
  });
}

// Prend une URL d'image, renvoie un dataURL PNG avec fond transparent
export async function retirerFond(src) {
  const img = await chargerImage(src);
  const W = img.naturalWidth || img.width;
  const H = img.naturalHeight || img.height;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, W, H);

  const segmenter = await getSegmenter();
  const result = segmenter.segment(canvas);
  try {
    const masks = result.confidenceMasks || [];
    if (!masks.length) throw new Error('Aucun masque renvoyé');
    const labels = segmenter.getLabels() || [];
    let idxFond = labels.findIndex((l) => String(l).toLowerCase() === 'background');
    if (idxFond < 0) idxFond = 0;

    const masque = masks[idxFond];
    const fond = masque.getAsFloat32Array();
    const mw = masque.width;
    const mh = masque.height;

    // Masque d'opacite : 1 = personne, 0 = fond, avec bords adoucis
    const mCanvas = document.createElement('canvas');
    mCanvas.width = mw;
    mCanvas.height = mh;
    const mCtx = mCanvas.getContext('2d');
    const data = mCtx.createImageData(mw, mh);
    for (let i = 0; i < fond.length; i++) {
      const personne = 1 - fond[i];
      const a = Math.max(0, Math.min(1, (personne - 0.2) / 0.6));
      data.data[i * 4 + 3] = Math.round(a * 255);
    }
    mCtx.putImageData(data, 0, 0);

    ctx.globalCompositeOperation = 'destination-in';
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(mCanvas, 0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  } finally {
    if (typeof result.close === 'function') result.close();
  }

  return canvas.toDataURL('image/png');
}
