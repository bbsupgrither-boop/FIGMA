import React from 'react';

interface EmptyCardProps {
  variant: 'shop_empty' | 'tasks_empty' | 'achievements_empty';
  icon?: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark';
}

const EMPTY_CARD_VARIANTS = {
  shop_empty: {
    text: 'Товары скоро появятся'
  },
  tasks_empty: {
    text: 'Нет активных задач'
  },
  achievements_empty: {
    text: 'Нет доступных достижений'
  }
} as const;

export function EmptyCard({ variant, icon, className = '', theme = 'light' }: EmptyCardProps) {
  const config = EMPTY_CARD_VARIANTS[variant];
  
  return (
    <div 
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
      style={{
        backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
        borderRadius: '16px',
        minHeight: '96px', 
        padding: '16px',
        border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
        boxShadow: theme === 'dark' ? '0 8px 24px rgba(0, 0, 0, 0.6)' : '0 8px 24px rgba(0, 0, 0, 0.10)'
      }}
    >
      {icon && (
        <div className="w-5 h-5 flex items-center justify-center">
          {icon}
        </div>
      )}
      <p 
        className="text-center leading-tight"
        style={{
          fontSize: '14px',
          color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
        }}
      >
        {config.text}
      </p>
    </div>
  );
}