import React, { useEffect, useRef } from 'react';
import { useOS } from '../context/OSContext';

const ParticleBackground = ({ absolute = false, diffused = false }) => {
  const { particlesEnabled } = useOS();
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!particlesEnabled) {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Get particle color from CSS variable
    const getParticleColor = () => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--os-theme-particle').trim() || '#3daee9';
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw(color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Initialize particles (adjust count based on size/density)
    const initParticles = () => {
      // Calculate density: 1 particle per ~20000px^2 (reduced density)
      // Base count for small windows, scale up for larger ones
      const area = canvas.width * canvas.height;
      const density = 20000;
      const calculatedCount = Math.floor(area / density);

      // Clamp count: min 20, max 150 to prevent performance issues
      const particleCount = Math.max(20, Math.min(150, calculatedCount));

      particlesRef.current = Array.from({ length: particleCount }, () => new Particle());
    };

    const updateCanvasSize = () => {
      // If absolute, use parent dimensions, otherwise window
      if (absolute && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      // Re-initialize particles to fill new size
      initParticles();
    };

    updateCanvasSize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particleColor = getParticleColor();

      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(particleColor);
      });

      // Draw connections
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = particleColor;
            ctx.globalAlpha = (1 - distance / 120) * 0.2;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      updateCanvasSize();
    };

    // Use ResizeObserver for absolute positioning (windows)
    let resizeObserver;
    if (absolute && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        // Request animation frame to ensure we update after layout changes
        requestAnimationFrame(updateCanvasSize);
      });
      resizeObserver.observe(canvas.parentElement);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', handleResize);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particlesEnabled, absolute]);

  if (!particlesEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: absolute ? 'absolute' : 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: absolute ? -1 : 0,
        filter: diffused ? 'blur(3px)' : 'none'
      }}
    />
  );
};

export default ParticleBackground;
