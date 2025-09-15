import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Home, Trophy, CheckSquare, ShoppingCart, Gift } from './Icons';

interface BottomNavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  theme?: 'light' | 'dark';
}

export function BottomNavigation({ onNavigate, currentPage, theme = 'light' }: BottomNavigationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const navItems = [
    { icon: Home, page: 'home' },
    { icon: Trophy, page: 'achievements' },
    { icon: CheckSquare, page: 'tasks' },
    { icon: ShoppingCart, page: 'cases' },
  ];

  const navigationContent = (
    <div 
      style={{ 
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        marginLeft: '-160px', // Заменяем transform на margin для центрирования
        zIndex: 1000, // Высокий приоритет для навигации
        width: 'calc(100vw - 48px)', // Ограничиваем ширину экрана с отступами
        maxWidth: '320px' // Максимальная ширина навигации
      }}
    >
      <div 
        className="flex items-center justify-center"
        style={{
          backgroundColor: theme === 'dark' ? '#12151B' : '#F3F5F8',
          borderRadius: '24px',
          padding: '8px',
          gap: '12px', // Равномерные отступы между кнопками
          overflow: 'hidden', // Clip content - кнопки не выходят за пределы
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          return (
            <button 
              key={index}
              onClick={() => onNavigate(item.page)}
              className="relative flex items-center justify-center transition-all duration-200"
              style={{ 
                width: '44px', // Фиксированная ширина
                height: '44px', // Фиксированная высота
                minWidth: '44px', 
                minHeight: '44px',
                maxWidth: '44px', // Предотвращаем растягивание
                maxHeight: '44px',
                borderRadius: '50%',
                flexShrink: 0, // Hug contents - кнопки не сжимаются
                flexGrow: 0 // Кнопки не растягиваются
              }}
            >
              {isActive && (
                <div 
                  className="absolute rounded-full"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: theme === 'dark' 
                      ? 'rgba(43, 130, 255, 0.12)' 
                      : 'rgba(43, 130, 255, 0.10)'
                  }}
                />
              )}
              <Icon 
                className="relative z-10 transition-colors duration-200"
                style={{
                  width: '24px', // Немного уменьшены для лучшего помещения
                  height: '24px',
                  color: isActive 
                    ? '#2B82FF' 
                    : theme === 'dark' ? '#A7B0BD' : '#6B7280'
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );

  // Рендерим через портал для избежания влияния родительских контекстов
  return mounted ? createPortal(navigationContent, document.body) : null;
}