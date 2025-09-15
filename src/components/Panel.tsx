import React from 'react';

interface PanelProps {
  leftIcon?: React.ReactNode;
  title: string;
  rightButton?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark';
}

export function Panel({ leftIcon, title, rightButton, children, className = '', theme = 'light' }: PanelProps) {
  return (
    <div 
      className={`${className}`}
      style={{
        backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
        borderRadius: '16px',
        padding: '16px',
        border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
        boxShadow: theme === 'dark' ? '0 8px 24px rgba(0, 0, 0, 0.6)' : '0 8px 24px rgba(0, 0, 0, 0.10)'
      }}
    >
      {/* Шапка панели */}
      <div className="flex items-center justify-between mb-4">
        {/* Левая иконка или пустое место */}
        <div className="w-8 h-8 flex items-center justify-center">
          {leftIcon || <div />}
        </div>
        
        {/* Заголовок по центру */}
        <h2 
          className="unified-heading flex-1 text-center"
          style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
        >
          {title}
        </h2>
        
        {/* Правая кнопка или пустое место */}
        <div className="w-8 h-8 flex items-center justify-center">
          {rightButton || <div />}
        </div>
      </div>
      
      {/* Содержимое панели */}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}