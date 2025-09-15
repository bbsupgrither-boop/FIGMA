import logoDark from 'figma:asset/282ed224b8d6681278187a87d172cc01e9522cbc.png';
import logoLight from 'figma:asset/8913ba3c8424dada0cd9697071e01ea367a29a23.png';

interface LogoProps {
  theme?: 'light' | 'dark';
}

export function Logo({ theme = 'light' }: LogoProps) {
  const logoSrc = theme === 'dark' ? logoDark : logoLight;
  
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center"
      style={{ 
        zIndex: 1 // Снижаем приоритет слоя логотипа
      }}
    >
      {/* Glow effect - только для темной темы */}
      {theme === 'dark' && (
        <div 
          className="absolute"
          style={{
            width: 'calc(100vw - 32px)',
            maxWidth: '680px',
            height: 'clamp(204px, 238px, 272px)',
            background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 70%)',
            borderRadius: '50%',
            zIndex: -1,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
      
      {/* Logo */}
      <img 
        src={logoSrc} 
        alt="GRITHER" 
        className="w-auto h-auto"
        style={{
          width: 'clamp(340px, 95vw, 510px)',
          height: 'auto',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}