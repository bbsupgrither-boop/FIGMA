import { Home, Trophy, CheckSquare, ShoppingBag, Users, Zap } from './Icons';

interface AdminNavigationProps {
  currentAdminPage: string;
  onNavigate: (page: string) => void;
}

export function AdminNavigation({ currentAdminPage, onNavigate }: AdminNavigationProps) {
  
  const adminPages = [
    {
      id: 'dashboard',
      label: 'Главная',
      icon: Home
    },
    {
      id: 'workers',
      label: 'Сотрудники',
      icon: Users
    },
    {
      id: 'battles',
      label: 'Баттлы',
      icon: Zap
    },
    {
      id: 'achievements',
      label: 'Достижения', 
      icon: Trophy
    },
    {
      id: 'tasks',
      label: 'Задачи',
      icon: CheckSquare
    },
    {
      id: 'shop',
      label: 'Магазин',
      icon: ShoppingBag
    }
  ];

  const handlePageClick = (pageId: string) => {
    onNavigate(pageId);
  };

  return (
    <div 
      style={{
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden' // Clip content
      }}
    >
      {/* Навигационная плашка - Auto Layout вертикальный */}
      <div 
        className="glass-card apple-shadow"
        style={{
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column', // Auto layout вертикальный
          gap: '24px', // Равномерный gap
          overflow: 'hidden', // Clip content
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Контейнер с кнопками - Auto Layout горизонтальный */}
        <div 
          style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px', // Равномерный gap между кнопками
            width: '100%',
            height: '56px',
            overflow: 'hidden', // Clip content - кнопки не выходят за пределы
            boxSizing: 'border-box'
          }}
        >
          {adminPages.map((page) => {
            const Icon = page.icon;
            const isActive = page.id === currentAdminPage;
            
            return (
              <button
                key={page.id}
                onClick={() => handlePageClick(page.id)}
                className="unified-button"
                style={{ 
                  width: 'calc((100% - 40px) / 6)', // Равномерное распределение
                  height: '48px',
                  minWidth: '40px', // Hug contents - минимальная ширина
                  maxWidth: '56px', // Fixed size - максимальная ширина
                  aspectRatio: '1',
                  borderRadius: '16px',
                  backgroundColor: isActive ? '#2B82FF' : 'var(--surface-2)',
                  border: isActive ? 'none' : '1px solid var(--border)',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive 
                    ? '0 8px 24px rgba(43, 130, 255, 0.25)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.06)',
                  flex: '1 1 0', // Равномерное распределение
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0, // Hug contents - кнопки не сжимаются
                  overflow: 'hidden' // Clip content внутри кнопки
                }}
              >
                <Icon 
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    color: isActive ? '#FFFFFF' : 'var(--foreground)',
                    flexShrink: 0 // Иконка не сжимается
                  }} 
                />
              </button>
            );
          })}
        </div>
        
        {/* Индикатор снизу - Auto Layout горизонтальный по центру */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            overflow: 'hidden' // Clip content
          }}
        >
          <div 
            style={{
              width: '48px',
              height: '4px',
              backgroundColor: 'var(--muted-foreground)',
              opacity: 0.3,
              borderRadius: '2px',
              flexShrink: 0 // Hug contents
            }}
          />
        </div>
      </div>
    </div>
  );
}