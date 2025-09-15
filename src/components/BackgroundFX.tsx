import { useState, useEffect } from 'react';

interface BackgroundFXProps {
  variant?: 'clean' | 'spotlight' | 'spotlight+grain' | 'spotlight+grain+vignette';
  theme?: 'light' | 'dark';
  className?: string;
}

export function BackgroundFX({ variant = 'spotlight+grain+vignette', theme = 'light', className = '' }: BackgroundFXProps) {
  const [noisePattern, setNoisePattern] = useState<string>('');

  // Генерируем noise pattern для зернистости только один раз
  useEffect(() => {
    // Не генерируем паттерн для темной темы или если grain не нужен
    if (theme === 'dark' || !variant.includes('grain')) {
      setNoisePattern('');
      return;
    }

    const generateNoisePattern = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return '';
      
      const imageData = ctx.createImageData(512, 512);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise;     // R
        data[i + 1] = noise; // G
        data[i + 2] = noise; // B
        data[i + 3] = 255;   // A
      }
      
      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    };

    setNoisePattern(generateNoisePattern());
  }, [variant, theme]);

  // Не рендерим в темной теме
  if (theme === 'dark') {
    return null;
  }

  return (
    <div
      className={`background-fx ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      {/* БАЗОВЫЙ СВЕТЛЫЙ ФОН - МНОГОСЛОЙНЫЙ ГРАДИЕНТ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 40%, #F8FAFC 100%)' // Более сложный градиент
        }}
      />

      {/* ВЕРХНИЙ ГРАДИЕНТНЫЙ СЛОЙ - ПЛАВНЫЙ ПЕРЕХОД ОТ СИНЕГО */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50vh', // Половина экрана
          background: 'linear-gradient(180deg, rgba(43, 130, 255, 0.03) 0%, rgba(43, 130, 255, 0.015) 40%, rgba(43, 130, 255, 0.005) 70%, transparent 100%)', // Очень плавный переход
          opacity: 0.8
        }}
      />

      {/* Spotlight Layer - только ниже Hero зоны */}
      {(variant === 'spotlight' || variant.includes('spotlight')) && (
        <>
          {/* ОСНОВНОЙ SPOTLIGHT */}
          <div
            style={{
              position: 'absolute',
              top: '30vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(43, 130, 255, 0.08) 0%, rgba(43, 130, 255, 0.04) 30%, rgba(43, 130, 255, 0.015) 60%, transparent 100%)',
              opacity: 0.6,
              borderRadius: '50%'
            }}
          />
          
          {/* ДОПОЛНИТЕЛЬНЫЙ МЯГКИЙ SPOTLIGHT */}
          <div
            style={{
              position: 'absolute',
              top: '20vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '800px',
              height: '400px',
              background: 'radial-gradient(ellipse 100% 50%, rgba(43, 130, 255, 0.04) 0%, rgba(43, 130, 255, 0.02) 50%, transparent 100%)',
              opacity: 0.4
            }}
          />
        </>
      )}

      {/* Grain Layer - шум */}
      {variant.includes('grain') && noisePattern && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${noisePattern})`,
            backgroundSize: '512px 512px',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay',
            opacity: 0.025 // Снижаем интенсивность зерна
          }}
        />
      )}

      {/* Vignette Layer - УЛУЧШЕННАЯ ВИНЬЕТКА */}
      {variant.includes('vignette') && (
        <>
          {/* ОСНОВНАЯ ВИНЬЕТКА */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(15, 23, 42, 0.01) 60%, rgba(15, 23, 42, 0.025) 80%, rgba(15, 23, 42, 0.04) 100%)', // Более плавная виньетка
              mixBlendMode: 'multiply',
              opacity: 0.3
            }}
          />
          
          {/* УГЛОВАЯ ВИНЬЕТКА ДЛЯ ГЛУБИНЫ */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(circle at 0% 0%, rgba(15, 23, 42, 0.02) 0%, transparent 50%),
                radial-gradient(circle at 100% 0%, rgba(15, 23, 42, 0.02) 0%, transparent 50%),
                radial-gradient(circle at 0% 100%, rgba(15, 23, 42, 0.015) 0%, transparent 50%),
                radial-gradient(circle at 100% 100%, rgba(15, 23, 42, 0.015) 0%, transparent 50%)
              `, // Угловые виньетки
              mixBlendMode: 'multiply',
              opacity: 0.4
            }}
          />
        </>
      )}

    </div>
  );
}