import { Logo } from './Logo';

interface HeroProps {
  theme?: 'light' | 'dark';
}

export function Hero({ theme = 'light' }: HeroProps) {
  return (
    <div 
      className="hero-zone relative w-full"
      style={{ 
        height: 'clamp(160px, 180px, 200px)',
        marginTop: '0px',
        marginBottom: '8px',
        overflow: 'visible',
        background: 'transparent', // Убираем фон из Hero, он теперь в HomePage
        zIndex: 10,
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Logo theme={theme} />
    </div>
  );
}