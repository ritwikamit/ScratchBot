import { useRef, useEffect } from 'react';

const PARTICLE_COUNT = 50;
const ARMS = 2;
const MAX_RADIUS = 120;

export default function SpiralAccent() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = 280;
      canvas.height = 280;
    }

    function draw(timestamp) {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      angleRef.current = timestamp * 0.0003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const t = i / PARTICLE_COUNT;
        const angle = t * Math.PI * 4 + angleRef.current;
        const radius = t * MAX_RADIUS;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        const alpha = 0.15 * (1 - t) * (0.5 + 0.5 * Math.sin(timestamp * 0.001 + i));
        const size = 1.5 * (1 - t * 0.5);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed bottom-0 right-0 pointer-events-none opacity-40"
      style={{ zIndex: 1, width: 280, height: 280 }}
      aria-hidden="true"
    />
  );
}
