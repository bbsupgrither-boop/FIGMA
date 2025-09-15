import { Settings, ShoppingCart } from './Icons';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from '../types/global';
import coinIcon from 'figma:asset/29d513144bb95c08c031f3604ac2dd2e7bee6450.png';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
  hideUserIcon?: boolean;
  onOpenSettings?: () => void;
  user?: User;
  profilePhoto?: string | null;
  title?: string;
  theme?: 'light' | 'dark';
  showBalance?: boolean;
  balance?: number;
  showCartButton?: boolean;
  cartCount?: number;
  onCartClick?: () => void;
  extraButtons?: React.ReactNode;
}

export function Header({ 
  onNavigate, 
  currentPage, 
  hideUserIcon = false, 
  onOpenSettings, 
  user, 
  profilePhoto, 
  title, 
  theme = 'light',
  showBalance = false,
  balance = 0,
  showCartButton = false,
  cartCount = 0,
  onCartClick,
  extraButtons
}: HeaderProps) {
  const handleUserClick = () => {
    if (onNavigate && currentPage !== 'profile') {
      onNavigate('profile');
    }
  };

  const userInitials = user ? user.name.split(' ').map(n => n[0]).join('') : 'U';

  return (
    <div className="relative" style={{ zIndex: 1 }}>
      <div className="max-w-md mx-auto px-4 pt-4 pb-4 space-y-3">
        {!hideUserIcon && !title && (
          <>
            {/* Первая строка: аватар + имя слева, настройки справа */}
            <div className="flex items-center justify-between">
              <button 
                onClick={handleUserClick}
                className="flex items-center gap-3 hover:scale-105 transition-transform"
              >
                <div className="relative">
                  <Avatar 
                    className="w-10 h-10"
                    style={{
                      boxShadow: theme === 'dark' 
                        ? '0 2px 8px rgba(0, 0, 0, 0.6)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.06)',
                      border: theme === 'dark' 
                        ? '1px solid rgba(255, 255, 255, 0.06)' 
                        : '1px solid #E6E9EF'
                    }}
                  >
                    {(profilePhoto || user?.avatar) && <AvatarImage src={profilePhoto || user?.avatar} alt={user?.name || 'Профиль'} />}
                    <AvatarFallback 
                      style={{
                        background: 'linear-gradient(135deg, #2B82FF 0%, #1E40AF 100%)',
                        color: '#FFFFFF'
                      }}
                    >
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  {user?.isOnline && (
                    <div 
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                      style={{ 
                        border: theme === 'dark' 
                          ? '2px solid #0B0D10' 
                          : '2px solid #FFFFFF' 
                      }}
                    ></div>
                  )}
                </div>
                <span 
                  className="unified-text"
                  style={{ 
                    color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  Вы {(() => {
                    // Определяем роль на основе ID пользователя или уровня
                    if (user?.id === 'current-user') return 'GRITHER';
                    if (user && user.level >= 20) return 'GLEB';
                    if (user && user.level >= 15) return 'SUPPORT';
                    if (user && user.level >= 12) return 'TEAMLEAD';
                    return 'GRITHER';
                  })()}
                </span>
              </button>
              
              {/* Кнопка настроек */}
              <button 
                onClick={onOpenSettings}
                className="apple-button transition-all hover:scale-105"
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
                <Settings 
                  style={{
                    width: '16px',
                    height: '16px',
                    color: theme === 'dark' ? '#1A1A1A' : '#6B7280'
                  }}
                />
              </button>
            </div>
            
            {/* Вторая строка: баланс слева, корзина справа */}
            {showBalance && (
              <div className="flex items-center justify-between" style={{ marginTop: '20px' }}>
                <div className="flex items-center gap-1">
                  <span 
                    className="unified-text"
                    style={{ 
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                    }}
                  >
                    Баланс
                  </span>
                  <span 
                    className="unified-text"
                    style={{ 
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                      fontWeight: 'var(--font-weight-medium)'
                    }}
                  >
                    {balance}
                  </span>
                  <img src={coinIcon} alt="G-coin" style={{ width: '14px', height: '14px' }} />
                </div>
                
                {/* Кнопка корзины */}
                {showCartButton && onCartClick && (
                  <button
                    onClick={onCartClick}
                    className="relative apple-button transition-all hover:scale-105"
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
                    <ShoppingCart 
                      style={{
                        width: '16px',
                        height: '16px',
                        color: theme === 'dark' ? '#1A1A1A' : '#6B7280'
                      }}
                    />
                    {cartCount > 0 && (
                      <div
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center unified-text"
                        style={{
                          background: '#2B82FF',
                          color: '#FFFFFF',
                          fontSize: '9px',
                          minWidth: '16px'
                        }}
                      >
                        {cartCount > 99 ? '99+' : cartCount}
                      </div>
                    )}
                  </button>
                )}
              </div>
            )}
          </>
        )}
        
        {title && (
          <div className="flex items-center justify-between pb-2">
            <h1 
              className="unified-heading flex-1 text-center"
              style={{ 
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A' 
              }}
            >
              {title}
            </h1>
          </div>
        )}
        
        {/* Дополнительные кнопки (если есть) */}
        <div 
          className="flex flex-col"
          style={{
            gap: '8px',
            overflow: 'visible',
            padding: '0',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Дополнительные кнопки (если есть) */}
          {extraButtons}
        </div>
      </div>
    </div>
  );
}