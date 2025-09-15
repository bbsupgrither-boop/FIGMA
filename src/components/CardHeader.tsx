import { ReactNode } from 'react';

interface CardHeaderProps {
  title: string;
  actions?: ReactNode;
  theme?: 'light' | 'dark';
  actionsPosition?: 'left' | 'right';
}

export function CardHeader({ 
  title, 
  actions, 
  theme = 'light', 
  actionsPosition = 'right' 
}: CardHeaderProps) {
  return (
    <div
      style={{
        height: '44px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}
    >
      {actionsPosition === 'left' && actions && (
        <div style={{ display: 'flex', gap: '8px' }}>
          {actions}
        </div>
      )}
      
      <div
        style={{
          flex: actionsPosition === 'left' ? '1' : 'none',
          textAlign: actionsPosition === 'left' ? 'right' : 'left',
          color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
        }}
        className="font-medium"
      >
        {title}
      </div>
      
      {actionsPosition === 'right' && actions && (
        <div style={{ display: 'flex', gap: '8px' }}>
          {actions}
        </div>
      )}
    </div>
  );
}