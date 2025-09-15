import React from 'react';
import { Clock, User, FileText } from './Icons';
import { ModalOpaque } from './ModalOpaque';

interface Notification {
  id: string;
  type: 'battle_evidence' | 'task_submission' | 'user_report';
  title: string;
  message: string;
  time: string;
  from: string;
  isNew: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export function NotificationsModal({ isOpen, onClose, theme = 'light' }: NotificationsModalProps) {
  // Пустые уведомления по умолчанию, как в макете
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const handleMarkAllAsRead = () => {
    setNotifications([]);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'battle_evidence':
        return <FileText style={{ width: '16px', height: '16px', color: '#2B82FF' }} />;
      case 'task_submission':
        return <Clock style={{ width: '16px', height: '16px', color: '#34c759' }} />;
      case 'user_report':
        return <User style={{ width: '16px', height: '16px', color: '#ff9500' }} />;
      default:
        return <Clock style={{ width: '16px', height: '16px', color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} />;
    }
  };

  return (
    <ModalOpaque
      isOpen={isOpen}
      onClose={onClose}
      title="Уведомления"
      theme={theme}
      actions={
        notifications.length > 0 ? (
          <button 
            onClick={handleMarkAllAsRead}
            className="w-full transition-colors text-center"
            style={{
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              color: '#2B82FF',
              border: 'none',
              fontSize: '14px'
            }}
          >
            Отметить все как прочитанные
          </button>
        ) : undefined
      }
    >
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 rounded-xl transition-colors cursor-pointer"
                style={{
                  backgroundColor: notification.isNew 
                    ? theme === 'dark' ? 'rgba(43, 130, 255, 0.12)' : 'rgba(43, 130, 255, 0.10)'
                    : theme === 'dark' ? '#202734' : '#F3F5F8',
                  border: notification.isNew 
                    ? '1px solid rgba(43, 130, 255, 0.20)' 
                    : theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
                }}
              >
                <div className="flex items-start gap-3">
                  <div style={{ marginTop: '4px' }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 
                        className="font-medium"
                        style={{ 
                          fontSize: '14px',
                          color: notification.isNew 
                            ? theme === 'dark' ? '#E8ECF2' : '#0F172A'
                            : theme === 'dark' ? '#A7B0BD' : '#6B7280'
                        }}
                      >
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {notification.isNew && (
                          <div 
                            className="rounded-full flex-shrink-0"
                            style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#2B82FF'
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <p 
                      className="mb-2"
                      style={{ 
                        fontSize: '12px',
                        color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                      }}
                    >
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span 
                        style={{ 
                          fontSize: '12px',
                          color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                        }}
                      >
                        От: {notification.from}
                      </span>
                      <span 
                        style={{ 
                          fontSize: '12px',
                          color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                        }}
                      >
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center" style={{ minHeight: '120px' }}>
            <div className="text-center">
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: theme === 'dark' ? 'rgba(167, 176, 189, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <Clock style={{ 
                  width: '32px', 
                  height: '32px', 
                  color: theme === 'dark' ? 'rgba(167, 176, 189, 0.5)' : 'rgba(107, 114, 128, 0.5)'
                }} />
              </div>
              <p style={{ 
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280',
                fontSize: '14px'
              }}>
                Уведомлений нет
              </p>
            </div>
          </div>
        )}
      </div>
    </ModalOpaque>
  );
}