import { useEffect, useState } from 'react';

interface EnhancedEffectsProps {
  theme?: 'light' | 'dark';
}

export function EnhancedEffects({ theme = 'light' }: EnhancedEffectsProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  // Отслеживание движения мыши для интерактивных эффектов
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsInteracting(true);
    const handleMouseUp = () => setIsInteracting(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (theme === 'dark') {
    return null; // Не применяем дополнительные эффекты в темной теме
  }

  return (
    <>
      {/* Интерактивный cursor trail только для светлой темы */}
      <div
        className="cursor-trail"
        style={{
          position: 'fixed',
          left: mousePosition.x - 6,
          top: mousePosition.y - 6,
          width: '12px',
          height: '12px',
          background: `radial-gradient(circle, rgba(0, 122, 255, ${isInteracting ? 0.4 : 0.2}) 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'all 0.1s ease',
          transform: `scale(${isInteracting ? 1.5 : 1})`,
          filter: 'blur(1px)'
        }}
      />

      {/* Дополнительные световые эффекты */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 5,
          overflow: 'hidden'
        }}
      >
        {/* Динамические световые пятна */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '80%',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(52, 199, 89, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'enhanced-float-1 8s ease-in-out infinite'
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            left: '10%',
            width: '90px',
            height: '90px',
            background: 'radial-gradient(circle, rgba(255, 149, 0, 0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'enhanced-float-2 10s ease-in-out infinite reverse'
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, rgba(175, 82, 222, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'enhanced-float-3 7s ease-in-out infinite'
          }}
        />

        {/* Плавающие геометрические формы */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '20%',
            width: '3px',
            height: '40px',
            background: 'linear-gradient(to bottom, rgba(0, 122, 255, 0.3), transparent)',
            borderRadius: '2px',
            animation: 'line-drift-1 12s ease-in-out infinite',
            transform: 'rotate(15deg)'
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '70%',
            right: '30%',
            width: '2px',
            height: '25px',
            background: 'linear-gradient(to bottom, rgba(52, 199, 89, 0.25), transparent)',
            borderRadius: '1px',
            animation: 'line-drift-2 9s ease-in-out infinite reverse',
            transform: 'rotate(-20deg)'
          }}
        />

        {/* Микро-частицы */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`micro-particle-${i}`}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: `rgba(0, 122, 255, ${0.2 + Math.random() * 0.3})`,
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `micro-drift-${i} ${15 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* CSS анимации */}
      <style>{`
        @keyframes enhanced-float-1 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.8;
          }
          33% { 
            transform: translate(-20px, -30px) scale(1.1) rotate(5deg);
            opacity: 0.6;
          }
          66% { 
            transform: translate(30px, 20px) scale(0.9) rotate(-3deg);
            opacity: 1;
          }
        }

        @keyframes enhanced-float-2 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.7;
          }
          50% { 
            transform: translate(25px, -40px) scale(1.2) rotate(8deg);
            opacity: 0.9;
          }
        }

        @keyframes enhanced-float-3 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.6;
          }
          25% { 
            transform: translate(-15px, -20px) scale(1.15) rotate(-5deg);
            opacity: 0.8;
          }
          75% { 
            transform: translate(20px, 15px) scale(0.85) rotate(3deg);
            opacity: 0.9;
          }
        }

        @keyframes line-drift-1 {
          0%, 100% { 
            transform: translate(0, 0) rotate(15deg) scaleY(1);
            opacity: 0.3;
          }
          50% { 
            transform: translate(40px, -60px) rotate(25deg) scaleY(1.3);
            opacity: 0.6;
          }
        }

        @keyframes line-drift-2 {
          0%, 100% { 
            transform: translate(0, 0) rotate(-20deg) scaleY(1);
            opacity: 0.25;
          }
          50% { 
            transform: translate(-30px, 50px) rotate(-30deg) scaleY(1.5);
            opacity: 0.5;
          }
        }

        ${Array.from({ length: 12 }).map((_, i) => `
          @keyframes micro-drift-${i} {
            0% { 
              transform: translate(0, 0) scale(1);
              opacity: ${0.3 + Math.random() * 0.4};
            }
            25% { 
              transform: translate(${-20 + Math.random() * 40}px, ${-30 + Math.random() * 20}px) scale(${1.2 + Math.random() * 0.6});
              opacity: ${0.5 + Math.random() * 0.3};
            }
            50% { 
              transform: translate(${30 + Math.random() * 40}px, ${20 + Math.random() * 30}px) scale(${0.8 + Math.random() * 0.4});
              opacity: ${0.2 + Math.random() * 0.4};
            }
            75% { 
              transform: translate(${-10 + Math.random() * 30}px, ${-40 + Math.random() * 20}px) scale(${1.3 + Math.random() * 0.5});
              opacity: ${0.6 + Math.random() * 0.3};
            }
            100% { 
              transform: translate(0, 0) scale(1);
              opacity: ${0.3 + Math.random() * 0.4};
            }
          }
        `).join('')}

        /* Интерактивные hover эффекты для всех элементов */
        .surface-card, .glass-card, .enhanced-card {
          position: relative;
        }

        .surface-card::after, .glass-card::after, .enhanced-card::after {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          background: linear-gradient(45deg, 
            rgba(0, 122, 255, 0.1), 
            rgba(52, 199, 89, 0.08), 
            rgba(255, 149, 0, 0.06), 
            rgba(175, 82, 222, 0.08)
          );
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: -1;
          filter: blur(8px);
        }

        .surface-card:hover::after, .glass-card:hover::after, .enhanced-card:hover::after {
          opacity: 0.3;
        }

        /* Shimmer эффект для кнопок */
        .apple-button, .tab-button, .white-button, .gradient-button {
          position: relative;
          overflow: hidden;
        }

        .apple-button::before, .tab-button::before, .white-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.6s;
          pointer-events: none;
        }

        .apple-button:hover::before, .tab-button:hover::before, .white-button:hover::before {
          left: 100%;
        }
      `}</style>
    </>
  );
}