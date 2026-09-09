'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function QrCodeCanvas({ value, size = 160 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, { width: size, margin: 1 });
    }
  }, [value, size]);

  if (!value) return null;
  return <canvas ref={canvasRef} />;
}
