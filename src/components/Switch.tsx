import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  theme?: 'light' | 'dark';
}

export function Switch({ checked, onChange, disabled = false, theme = 'light' }: SwitchProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className="relative transition-all duration-200 focus:outline-none"
      style={{
        width: '44px',
        height: '28px',
        borderRadius: '14px',
        backgroundColor: checked 
          ? '#2B82FF' 
          : theme === 'dark' ? '#2A2F36' : '#E6E9EF',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        border: 'none',
        padding: 0
      }}
    >
      <div
        className="absolute transition-all duration-200"
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          top: '3px',
          left: checked ? '19px' : '3px',
          boxShadow: checked 
            ? '0 2px 6px rgba(0, 0, 0, 0.08)' 
            : '0 1px 3px rgba(0, 0, 0, 0.12)'
        }}
      />
    </button>
  );
}