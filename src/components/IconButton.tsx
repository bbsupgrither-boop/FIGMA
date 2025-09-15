import { ReactNode, ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: ReactNode;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md';
  state?: 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';
}

export function IconButton({ 
  icon, 
  theme = 'light', 
  size = 'sm', 
  state = 'default',
  className = '',
  disabled,
  ...props 
}: IconButtonProps) {
  // Размеры согласно спецификации
  const sizes = {
    sm: { circle: 28, icon: 16 },
    md: { circle: 32, icon: 18 }
  };

  const currentSize = sizes[size];
  const actualState = disabled ? 'disabled' : state;

  // Стили для светлой темы
  const lightStyles = {
    default: {
      backgroundColor: 'var(--surface)',
      borderColor: 'var(--border)',
      color: 'var(--text)'
    },
    hover: {
      backgroundColor: 'var(--surface-2)',
      borderColor: 'var(--border)',
      color: 'var(--text)'
    },
    pressed: {
      backgroundColor: 'var(--surface-3)',
      borderColor: 'var(--border)',
      color: 'var(--text)'
    },
    focus: {
      backgroundColor: 'var(--surface)',
      borderColor: 'var(--border)',
      color: 'var(--text)',
      boxShadow: '0 0 0 2px var(--ring)'
    },
    disabled: {
      backgroundColor: 'var(--surface-2)',
      borderColor: 'var(--border)',
      color: 'var(--text-muted)',
      cursor: 'default'
    }
  };

  // Стили для темной темы
  const darkStyles = {
    default: {
      backgroundColor: '#0F1116',
      borderColor: '#2A2F36',
      color: '#FFF'
    },
    hover: {
      backgroundColor: '#151923',
      borderColor: '#2A2F36',
      color: '#FFF'
    },
    pressed: {
      backgroundColor: '#11151D',
      borderColor: '#2A2F36',
      color: '#FFF'
    },
    focus: {
      backgroundColor: '#0F1116',
      borderColor: '#2A2F36',
      color: '#FFF',
      boxShadow: '0 0 0 2px #2A3340'
    },
    disabled: {
      backgroundColor: '#0F1116',
      borderColor: '#2A2F36',
      color: 'rgba(255, 255, 255, 0.4)',
      cursor: 'default'
    }
  };

  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const currentStyle = styles[actualState];

  return (
    <div
      style={{
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent'
      }}
    >
      <button
        className={`transition-all duration-200 ${className}`}
        style={{
          width: `${currentSize.circle}px`,
          height: `${currentSize.circle}px`,
          borderRadius: '50%',
          border: '1px solid',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
          opacity: 1,
          mixBlendMode: 'normal',
          ...currentStyle
        }}
        disabled={disabled}
        {...props}
      >
        <div
          style={{
            width: `${currentSize.icon}px`,
            height: `${currentSize.icon}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      </button>
    </div>
  );
}