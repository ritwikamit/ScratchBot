import { useRef, useEffect } from 'react';

const STAR_COUNT = 180;
const MAX_SIZE = 2.5;

export default function Starfield() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const rafRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      const stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * MAX_SIZE + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.8,
          baseOpacity: 0.3 + Math.random() * 0.6,
        });
      }
      starsRef.current = stars;
    }

    function draw(timestamp) {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      timeRef.current = timestamp * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of starsRef.current) {
        const alpha = star.baseOpacity * (0.5 + 0.5 * Math.sin(timeRef.current * star.speed + star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
