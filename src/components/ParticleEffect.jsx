import React, { useEffect, useState } from 'react';

const ParticleEffect = ({ type = 'confetti', trigger }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;

    const particleCount = type === 'confetti' ? 50 : 30;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        color: ['#3daee9', '#6366f1', '#ec4899', '#fbbf24', '#10b981'][Math.floor(Math.random() * 5)],
        size: Math.random() * 10 + 5,
        velocity: { x: (Math.random() - 0.5) * 4, y: Math.random() * 3 + 2 },
        spin: (Math.random() - 0.5) * 10
      });
    }

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [trigger, type]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: type === 'confetti' ? '2px' : '50%',
            transform: `rotate(${particle.rotation}deg)`,
            animation: `particleFall 3s ease-out forwards`,
            opacity: 0.9
          }}
        />
      ))}
      <style>{`
        @keyframes particleFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(${window.innerHeight + 50}px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ParticleEffect;
