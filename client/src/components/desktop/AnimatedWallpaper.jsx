import { useEffect, useRef } from 'react';

export default function AnimatedWallpaper({ type, accentColor }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    if (type === 'matrix') {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
      const fontSize = 16;
      let columns = canvas.width / fontSize;
      let drops = [];
      for (let x = 0; x < columns; x++) drops[x] = 1;

      const drawMatrix = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = accentColor || '#0F0'; // Default hacker green
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };

      const loop = () => {
        drawMatrix();
        animationFrameId = requestAnimationFrame(loop);
      };
      loop();
    } else if (type === 'particles') {
      const particles = [];
      const particleCount = 100;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          radius: Math.random() * 2 + 1,
        });
      }

      const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = accentColor || '#fff';
        
        for (let i = 0; i < particleCount; i++) {
          let p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
          if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Draw lines
          for (let j = i + 1; j < particleCount; j++) {
            let p2 = particles[j];
            let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 100})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      };

      const loop = () => {
        drawParticles();
        animationFrameId = requestAnimationFrame(loop);
      };
      loop();
    } else if (type === 'bubbles') {
      const bubbles = [];
      const bubbleCount = 50;

      for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height + canvas.height,
          radius: Math.random() * 20 + 5,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }

      const drawBubbles = () => {
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < bubbleCount; i++) {
          let b = bubbles[i];
          b.y -= b.speed;
          if (b.y + b.radius < 0) {
            b.y = canvas.height + b.radius;
            b.x = Math.random() * canvas.width;
          }

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity})`;
          ctx.fill();
        }
      };

      const loop = () => {
        drawBubbles();
        animationFrameId = requestAnimationFrame(loop);
      };
      loop();
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        background: type === 'matrix' ? '#000' : type === 'particles' ? '#111' : 'transparent'
      }}
    />
  );
}
