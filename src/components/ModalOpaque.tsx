import React, { useEffect } from 'react';
import { X } from './Icons';

interface BackdropProps {
  isVisible: boolean;
  onClick?: () => void;
  theme?: 'light' | 'dark';
}

// Отдельный компонент Backdrop
function Backdrop({ isVisible, onClick, theme = 'light' }: BackdropProps) {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0"
      style={{
        background: theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.7)', // Обычное затемнение без размытия
        backdropFilter: 'none', // Убираем размытие
        WebkitBackdropFilter: 'none',
        zIndex: 9998
      }}
      onClick={onClick || (() => {})}
    />
  );
}

interface ModalOpaqueProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  theme?: 'light' | 'dark';
  size?: 'auto';
}

export function ModalOpaque({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions, 
  theme = 'light',
  size = 'auto'
}: ModalOpaqueProps) {
  // Обработка Escape и блокировка скролла
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - размывает фон */}
      <Backdrop 
        isVisible={isOpen} 
        onClick={onClose} 
        theme={theme}
      />
      
      {/* Modal Container */}
      <div 
        className="responsive-dialog-container"
        style={{ 
          zIndex: 9999,
          backdropFilter: 'blur(40px) saturate(150%)', // Очень сильное размытие как на фото + насыщенность
          WebkitBackdropFilter: 'blur(40px) saturate(150%)', // Поддержка Safari
          background: theme === 'light' 
            ? 'rgba(255, 255, 255, 0.1)' // Светлый полупрозрачный белый вместо черного
            : 'rgba(255, 255, 255, 0.05)' // Очень светлый белый для темной темы
        }}
        onClick={(e) => {
          // Закрываем модал только при клике на backdrop, не на содержимое
          if (e.target === e.currentTarget && onClose) {
            onClose();
          }
        }}
      >
        <div 
          className="responsive-dialog-content responsive-modal force-viewport-contained"
          onClick={(e) => e.stopPropagation()}
          style={{
            // Полупрозрачный фон с очень сильным размытием
            backgroundColor: theme === 'light' 
              ? 'rgba(255, 255, 255, 0.85)' // 85% прозрачности для лучшего эффекта размытия
              : 'rgba(22, 26, 34, 0.85)', // 85% прозрачности для темной темы
            backdropFilter: 'blur(60px) saturate(200%)', // Очень сильное размытие 60px + высокая насыщенность
            WebkitBackdropFilter: 'blur(60px) saturate(200%)', // Поддержка Safari
            border: `1px solid ${theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.15)'}`,
            boxShadow: theme === 'light' 
              ? '0 30px 100px rgba(0, 0, 0, 0.15), 0 15px 50px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95)' 
              : '0 30px 100px rgba(0, 0, 0, 0.8), 0 15px 50px rgba(0, 0, 0, 0.6)',
            // Дополнительный z-index для контента
            zIndex: 10000,
            // Убеждаемся что все элементы кликабельны
            pointerEvents: 'auto'
          }}
        >
          {/* Header */}
          {title && (
            <div 
              className="flex items-center justify-between"
              style={{ marginBottom: '12px' }}
            >
              <h3 
                className="unified-heading flex-1 text-center"
                style={{ 
                  color: theme === 'light' ? '#0F172A' : '#E8ECF2'
                }}
              >
                {title}
              </h3>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105 ml-2"
                  style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                      : '#FFFFFF',
                    border: theme === 'dark' 
                      ? '1px solid rgba(255, 255, 255, 0.2)' 
                      : '1px solid #E6E9EF',
                    boxShadow: theme === 'dark' 
                      ? '0 4px 15px rgba(255, 255, 255, 0.2)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <X 
                    style={{
                      width: '16px',
                      height: '16px',
                      color: theme === 'dark' ? '#1A1A1A' : '#6B7280'
                    }}
                  />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div 
            className="responsive-dialog-body text-responsive"
            style={{ 
              marginBottom: actions ? '12px' : '0',
              flex: '1',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            {children}
          </div>
          
          {/* Actions */}
          {actions && (
            <div 
              className="responsive-dialog-actions"
              style={{
                pointerEvents: 'auto',
                position: 'relative',
                zIndex: 10001
              }}
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Экспортируем также Backdrop для использования в других компонентах если нужно
export { Backdrop };