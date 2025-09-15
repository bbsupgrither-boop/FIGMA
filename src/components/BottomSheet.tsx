import React, { useEffect } from 'react';
import { X } from './Icons';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}

export function BottomSheet({ isOpen, onClose, title, children, theme = 'light' }: BottomSheetProps) {
  // Обработка Escape
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Предотвращаем скролл фона
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 z-40"
        style={{
          background: theme === 'light' ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
        onClick={onClose}
      />
      
      {/* Sheet Content */}
      <div 
        className="relative w-full max-w-md mx-4 mb-4 z-50"
        style={{
          backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
          opacity: '1', // 100% непрозрачность
          borderRadius: '16px',
          border: theme === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.06)' 
            : '1px solid #E6E9EF',
          boxShadow: theme === 'dark' 
            ? '0 16px 48px rgba(0, 0, 0, 0.6)' 
            : '0 16px 48px rgba(0, 0, 0, 0.25)',
          padding: '16px',
          gap: '12px',
          minHeight: '40vh',
          maxHeight: '90vh',
          overflow: 'hidden',
          // Убираем все эффекты размытия и прозрачности
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none'
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-2">
          <div 
            style={{
              width: '36px',
              height: '4px',
              backgroundColor: theme === 'dark' ? '#2A3340' : '#E6E9EF',
              borderRadius: '2px'
            }}
          />
        </div>
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 pb-3">
            <h3 
              className="text-lg font-medium"
              style={{ 
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A' 
              }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="flex items-center justify-center transition-colors"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: theme === 'dark' ? '#0F1116' : '#F3F5F8',
                border: theme === 'dark' 
                  ? '1px solid #2A2F36' 
                  : '1px solid #E6E9EF'
              }}
            >
              <X 
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  color: theme === 'dark' ? '#E8ECF2' : '#6B7280' 
                }} 
              />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div style={{ 
          padding: '0 16px 16px',
          maxHeight: title ? 'calc(90vh - 120px)' : 'calc(90vh - 80px)',
          overflow: 'auto'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}