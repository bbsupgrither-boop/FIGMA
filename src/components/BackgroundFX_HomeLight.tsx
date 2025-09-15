interface BackgroundFX_HomeLightProps {
  mode?: 'subtle' | 'debug';
}

export function BackgroundFX_HomeLight({ mode = 'subtle' }: BackgroundFX_HomeLightProps) {
  // Режим debug для проверки эффектов - более высокая видимость
  const spotlightOpacity = mode === 'debug' ? 0.55 : 0.20;
  const vignetteOpacity = mode === 'debug' ? 0.18 : 0.05;

  return (
    <div
      className="background-fx"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      {/* BaseBG - Базовый фон */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#F7F9FC',
          zIndex: 1
        }}
      />

      {/* Spotlight - Радиальный градиент под логотипом */}
      <div
        style={{
          position: 'absolute',
          top: '80px', // Позиция под логотипом
          left: '50%',
          transform: 'translateX(-50%)',
          width: '520px',
          height: '520px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 70%)',
          opacity: spotlightOpacity,
          zIndex: 2
        }}
      />

      {/* Vignette - Виньетка по краям */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.06) 100%)',
          opacity: vignetteOpacity,
          mixBlendMode: 'multiply',
          zIndex: 3
        }}
      />
    </div>
  );
}