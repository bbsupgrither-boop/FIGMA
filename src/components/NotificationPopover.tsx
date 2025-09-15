// ФАЙЛ УДАЛЕН - система уведомлений полностью убрана из приложения

interface NotificationPopoverProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemoveNotification: (id: string) => void;
  onClearAll: () => void;
  theme?: 'light' | 'dark';
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'achievement':
      return Trophy;
    case 'task':
      return Target;
    case 'shop':
      return ShoppingBag;
    case 'battle':
      return Swords;
    case 'challenge':
      return Gift;
    case 'system':
    default:
      return AlertCircle;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'achievement':
      return '#FFD700';
    case 'task':
      return '#2B82FF';
    case 'shop':
      return '#34C759';
    case 'battle':
      return '#FF9500';
    case 'challenge':
      return '#AF52DE';
    case 'system':
    default:
      return '#6B7280';
  }
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  if (hours < 24) return `${hours} ч назад`;
  if (days < 7) return `${days} д назад`;
  return timestamp.toLocaleDateString('ru-RU');
};

export function NotificationPopover({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemoveNotification,
  onClearAll,
  theme = 'light'
}: NotificationPopoverProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Блокируем прокрутку страницы при открытом модальном окне
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Закрытие по клику на оверлей
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const unreadNotifications = notifications.filter(n => !n.read);
  const sortedNotifications = [...notifications].sort((a, b) => {
    // Сначала непрочитанные, затем по времени
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <>
      {/* Overlay - полупрозрачный слой под модальным окном */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        style={{
          position: 'fixed',
          inset: '0',
          background: 'rgba(0,0,0,0.2)',
          zIndex: 2147483646
        }}
      />

      {/* NotificationModal - модальное окно поверх оверлея */}
      <div
        ref={modalRef}
        className="notification-modal"
        style={{
          // NotificationModal - точные параметры из технического задания
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 2147483647,
          background: theme === 'dark' ? '#161A22' : '#FFFFFF',
          border: theme === 'dark' 
            ? '1px solid rgba(255,255,255,0.12)' 
            : '1px solid rgba(0,0,0,0.12)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px',
          width: '360px',
          minWidth: '296px',
          maxWidth: '360px',
          overflow: 'hidden'
        }}
      >
        {/* Заголовок - фиксированный */}
        <div 
          className="flex items-center justify-between"
          style={{
            flexShrink: 0
          }}
        >
          <div>
            <h3 
              className="font-medium"
              style={{
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                fontSize: '16px',
                lineHeight: '20px'
              }}
            >
              Уведомления
            </h3>
            {unreadNotifications.length > 0 && (
              <span 
                className="text-xs"
                style={{
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                }}
              >
                {unreadNotifications.length} новых
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {unreadNotifications.length > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors"
                title="Отметить все как прочитанные"
                style={{
                  background: theme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.03)'
                }}
              >
                <CheckCheck 
                  style={{
                    width: '14px',
                    height: '14px',
                    color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                  }}
                />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.03)'
              }}
            >
              <X 
                style={{
                  width: '14px',
                  height: '14px',
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                }}
              />
            </button>
          </div>
        </div>

        {/* Frame List для уведомлений - скроллируемый */}
        <div 
          className="notification-list"
          style={{
            // Список уведомлений скроллится сам - точные параметры из техзадания
            flex: '1',
            overflowY: 'auto',
            minHeight: '0',
            
            // Кастомный скроллбар
            scrollbarWidth: 'thin',
            scrollbarColor: theme === 'dark' 
              ? 'rgba(255, 255, 255, 0.2) transparent'
              : 'rgba(0, 0, 0, 0.2) transparent'
          }}
        >
          {sortedNotifications.length === 0 ? (
            // Пустое состояние
            <div 
              className="text-center py-8"
              style={{
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
              }}
            >
              <Bell 
                style={{
                  width: '32px',
                  height: '32px',
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280',
                  margin: '0 auto 8px'
                }}
              />
              <p className="text-sm">Уведомлений нет</p>
            </div>
          ) : (
            // Список уведомлений с Auto layout вертикальный, gap 8
            <div 
              className="space-y-2"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {sortedNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className="notification-item p-3 rounded-xl transition-all cursor-pointer group"
                    style={{
                      background: !notification.read 
                        ? (theme === 'dark' 
                            ? 'rgba(43, 130, 255, 0.08)' 
                            : 'rgba(43, 130, 255, 0.05)')
                        : (theme === 'dark' 
                            ? 'rgba(255, 255, 255, 0.03)' 
                            : 'rgba(0, 0, 0, 0.02)'),
                      border: !notification.read 
                        ? (theme === 'dark' 
                            ? '1px solid rgba(43, 130, 255, 0.15)' 
                            : '1px solid rgba(43, 130, 255, 0.1)')
                        : '1px solid transparent'
                    }}
                    onClick={() => !notification.read && onMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Иконка типа уведомления */}
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${iconColor}20`,
                          border: `1px solid ${iconColor}40`
                        }}
                      >
                        <IconComponent 
                          style={{
                            width: '14px',
                            height: '14px',
                            color: iconColor
                          }}
                        />
                      </div>

                      {/* Контент уведомления */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 
                            className="text-sm font-medium truncate"
                            style={{
                              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                            }}
                          >
                            {notification.title}
                          </h4>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.read && (
                              <div 
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: '#2B82FF' }}
                              />
                            )}
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive hover:text-destructive-foreground rounded transition-all"
                            >
                              <Trash2 
                                style={{
                                  width: '12px',
                                  height: '12px'
                                }}
                              />
                            </button>
                          </div>
                        </div>
                        
                        <p 
                          className="text-xs mt-1 leading-relaxed"
                          style={{
                            color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                          }}
                        >
                          {notification.message}
                        </p>
                        
                        <span 
                          className="text-xs mt-1 block"
                          style={{
                            color: theme === 'dark' ? '#6B7280' : '#9CA3AF'
                          }}
                        >
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Футер с кнопкой очистки - фиксированный */}
        {notifications.length > 0 && (
          <div 
            className="border-t pt-3"
            style={{
              borderColor: theme === 'dark' 
                ? 'rgba(255, 255, 255, 0.06)' 
                : 'rgba(0, 0, 0, 0.1)',
              flexShrink: 0
            }}
          >
            <button
              onClick={onClearAll}
              className="w-full py-2 px-3 rounded-lg text-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
              style={{
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280',
                background: theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.03)' 
                  : 'rgba(0, 0, 0, 0.02)'
              }}
            >
              Очистить все
            </button>
          </div>
        )}
      </div>
    </>
  );
}