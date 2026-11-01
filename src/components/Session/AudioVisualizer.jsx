import React, { useEffect, useRef } from 'react';

export default function AudioVisualizer({ audioState }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth || 800;
        canvas.height = parent.clientHeight || 80;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      const centerY = height / 2;

      let color = 'rgba(0, 242, 254, ';
      let waveCount = 3;
      let amplitude = 15;
      let frequency = 0.04;

      if (audioState === 'listening') {
        color = 'rgba(244, 63, 94, ';
        amplitude = 35 + Math.random() * 15;
      } else if (audioState === 'speaking') {
        color = 'rgba(124, 58, 237, ';
        amplitude = 25 + Math.sin(Date.now() * 0.01) * 15;
      } else if (audioState === 'thinking') {
        color = 'rgba(245, 158, 11, ';
        amplitude = 12;
        frequency = 0.08;
      }

      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        ctx.lineWidth = 2.5 - w * 0.6;
        ctx.strokeStyle = color + (0.9 - w * 0.25) + ')';

        for (let x = 0; x < width; x++) {
          const distance = Math.abs(x - width / 2) / (width / 2);
          const envelope = Math.cos(distance * Math.PI * 0.5); // Smooth fade at edges
          const y = centerY + Math.sin(x * frequency + Date.now() * 0.005 * (w + 1)) * amplitude * envelope;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [audioState]);

  return (
    <div style={{
      width: '100%',
      height: '80px',
      background: 'rgba(7, 9, 14, 0.75)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-glass)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
