import { useEffect, useRef } from 'react';
import { X, CheckCheck, Trash2, Trophy, Target, ShoppingBag, Swords, AlertCircle, Gift, Bell } from 'lucide-react';
import { Notification } from '../types/notifications';

interface NotificationsPanelProps {
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

export function NotificationsPanel({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemoveNotification,
  onClearAll,
  theme = 'light'
}: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Отладочная информация
  console.log('NotificationsPanel render:', {
    notificationsLength: notifications.length,
    unreadCount: notifications.filter(n => !n.read).length
  });

  // Закрытие при клике вне панели
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <div
      ref={panelRef}
      className="notifications-panel rounded-2xl overflow-hidden"
      style={{
        background: theme === 'dark' 
          ? 'linear-gradient(145deg, rgba(8, 10, 14, 0.98) 0%, rgba(16, 20, 28, 0.98) 100%)'
          : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
        border: theme === 'dark' 
          ? '1px solid rgba(255, 255, 255, 0.06)' 
          : '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: theme === 'dark' 
          ? '0 16px 48px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          : '0 16px 48px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        width: '320px',
        maxWidth: '320px',
        minWidth: '320px',
        maxHeight: '400px',
        zIndex: 1000
      }}
    >
      {/* Заголовок */}
      <div 
        className="flex items-center justify-between p-4 border-b"
        style={{
          borderColor: theme === 'dark' 
            ? 'rgba(255, 255, 255, 0.06)' 
            : 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <div>
          <h3 
            className="font-medium"
            style={{
              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
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
              className="p-1 rounded-lg hover:bg-surface-2 transition-colors"
              title="Отметить все как прочитанные"
            >
              <CheckCheck 
                style={{
                  width: '16px',
                  height: '16px',
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                }}
              />
            </button>
          )}
          
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-2 transition-colors"
          >
            <X 
              style={{
                width: '16px',
                height: '16px',
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
              }}
            />
          </button>
        </div>
      </div>

      {/* Список уведомлений */}
      <div className="max-h-80 overflow-y-auto">
        {sortedNotifications.length === 0 ? (
          <div 
            className="p-8 text-center"
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
          <div className="space-y-1 p-2">
            {sortedNotifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type);
              
              return (
                <div
                  key={notification.id}
                  className={`p-3 rounded-xl transition-all cursor-pointer group ${
                    !notification.read ? 'hover:bg-primary-muted' : 'hover:bg-surface-2'
                  }`}
                  style={{
                    background: !notification.read 
                      ? (theme === 'dark' 
                          ? 'rgba(43, 130, 255, 0.08)' 
                          : 'rgba(43, 130, 255, 0.05)')
                      : 'transparent',
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

      {/* Футер с кнопкой очистки */}
      {notifications.length > 0 && (
        <div 
          className="p-3 border-t"
          style={{
            borderColor: theme === 'dark' 
              ? 'rgba(255, 255, 255, 0.06)' 
              : 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <button
            onClick={onClearAll}
            className="w-full py-2 px-3 rounded-lg text-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
            style={{
              color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
            }}
          >
            Очистить все
          </button>
        </div>
      )}
    </div>
  );
}

