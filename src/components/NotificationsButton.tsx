import React, { useState } from 'react';
import { Bell } from './Icons';
import { NotificationsModal } from './NotificationsModal';

interface NotificationsButtonProps {
  theme?: 'light' | 'dark';
  notificationsCount?: number;
}

export function NotificationsButton({ theme = 'light', notificationsCount = 0 }: NotificationsButtonProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Используем переданное количество уведомлений или 0 по умолчанию
  const displayCount = notificationsCount || 0;

  return (
    <>
      <button 
        onClick={() => setIsNotificationsOpen(true)}
        className="apple-button transition-all hover:scale-105 relative"
        style={{
          width: '28px',
          height: '28px',
          minWidth: '28px',
          minHeight: '28px',
          maxWidth: '28px',
          maxHeight: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#FFFFFF',
          border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #E6E9EF',
          boxShadow: theme === 'dark' 
            ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
            : '0 2px 8px rgba(0, 0, 0, 0.06)',
          flexShrink: 0,
          flexGrow: 0,
          borderRadius: '8px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Bell 
          style={{
            width: '16px',
            height: '16px',
            color: theme === 'dark' ? '#1A1A1A' : '#6B7280'
          }}
        />
        
        {/* Красный индикатор с количеством уведомлений */}
        {displayCount > 0 && (
          <div
            className="absolute -top-1 -right-1 flex items-center justify-center text-white text-xs font-medium"
            style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#FF3B30',
              borderRadius: '50%',
              fontSize: '10px',
              lineHeight: '1',
              border: theme === 'dark' ? '2px solid #0B0D10' : '2px solid #FFFFFF',
              minWidth: '16px'
            }}
          >
            {displayCount > 9 ? '9+' : displayCount}
          </div>
        )}
      </button>

      <NotificationsModal 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        theme={theme}
      />
    </>
  );
}