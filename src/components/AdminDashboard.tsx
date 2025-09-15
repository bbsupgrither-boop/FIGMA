import { useState } from 'react';
import { CheckCircle, Info, CheckSquare, Trophy, Shield, X, ArrowLeft, Clock, Bell } from './Icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { NotificationsModal } from './NotificationsModal';

interface AdminDashboardProps {
  onClose?: () => void;
  onToggleDarkMode?: () => void;
  onNavigateToWorkers?: () => void;
  onNavigateToAchievementsModeration?: () => void;
  onNavigateToGames?: () => void;
  onNavigateToCases?: () => void;
  onNavigateToBattles?: () => void;
}

interface Complaint {
  id: string;
  user: string;
  description: string;
  file?: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

export function AdminDashboard({ onClose, onToggleDarkMode, onNavigateToWorkers, onNavigateToAchievementsModeration, onNavigateToGames, onNavigateToCases, onNavigateToBattles }: AdminDashboardProps) {
  const [showComplaints, setShowComplaints] = useState(false);
  const [complaintsTab, setComplaintsTab] = useState<'active' | 'resolved'>('active');
  const [showHistory, setShowHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Моковые данные жалоб
  const complaints: Complaint[] = [];

  const activeComplaints = complaints.filter(c => c.status === 'active');
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved');

  const stats = [
    {
      title: 'Уведомления',
      value: '0',
      icon: Bell,
      hasAction: true,
      action: () => setShowNotifications(true)
    },
    {
      title: 'Сообщения о проблемах',
      value: '0',
      icon: Info,
      hasAction: true,
      action: () => setShowComplaints(true)
    },
    {
      title: 'Кол-во выполненных задач',
      value: '0',
      icon: CheckSquare
    },
    {
      title: 'Достижений получено',
      value: '0',
      icon: Trophy
    }
  ];

  const recentActivity: any[] = [];



  return (
    <div className="min-h-screen bg-background">

      {/* Содержимое */}
      <div className="p-6 space-y-6">
        
        {/* Статистика - Auto Layout контейнер */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px', // Равномерный gap
            overflow: 'hidden', // Clip content
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="glass-card apple-shadow unified-button"
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  cursor: stat.hasAction ? 'pointer' : 'default',
                  display: 'flex',
                  flexDirection: 'column', // Auto layout вертикальный
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: '8px', // Равномерный gap между элементами
                  overflow: 'hidden', // Clip content
                  flexShrink: 0, // Hug contents
                  boxSizing: 'border-box'
                }}
                onClick={stat.hasAction ? stat.action : undefined}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px', // Auto layout горизонтальный
                    overflow: 'hidden', // Clip content
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  <Icon 
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      color: 'var(--primary)', 
                      flexShrink: 0 // Hug contents - иконка не сжимается
                    }} 
                  />
                  <div 
                    className="unified-text"
                    style={{ 
                      color: 'var(--muted-foreground)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100px' // Ограничиваем ширину текста
                    }}
                  >
                    {stat.title}
                  </div>
                </div>
                <div 
                  className="unified-heading"
                  style={{ 
                    color: 'var(--foreground)',
                    overflow: 'hidden' // Clip content
                  }}
                >
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Быстрые действия - Auto Layout контейнер */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column', // Auto layout вертикальный
            gap: '16px', // Равномерный gap
            overflow: 'hidden', // Clip content
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h3 className="unified-heading" style={{ color: 'var(--foreground)' }}>
              Быстрые действия
            </h3>
          </div>
          <div 
            className="glass-card apple-shadow"
            style={{
              borderRadius: '16px',
              overflow: 'hidden', // Clip content
              padding: '16px',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
          >
            <div 
              className="unified-text"
              style={{ 
                color: 'var(--muted-foreground)',
                overflow: 'hidden' // Clip content для текста
              }}
            >
              Нет уведомлений для проверки
            </div>
          </div>
        </div>

        {/* Последняя активность - Auto Layout контейнер */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column', // Auto layout вертикальный
            gap: '16px', // Равномерный gap
            overflow: 'hidden', // Clip content
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h3 className="unified-heading" style={{ color: 'var(--foreground)' }}>
              Последняя активность
            </h3>
          </div>
          <div 
            className="glass-card apple-shadow"
            style={{
              borderRadius: '16px',
              overflow: 'hidden', // Clip content
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            {recentActivity.length === 0 ? (
              <div 
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden', // Clip content
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div 
                  className="unified-text"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Активных пользователей нет
                </div>
                <button 
                  onClick={() => setShowHistory(true)}
                  className="unified-button"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0, // Hug contents
                    overflow: 'hidden' // Clip content
                  }}
                  title="История активности"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Clock 
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      color: 'var(--muted-foreground)',
                      flexShrink: 0
                    }} 
                  />
                </button>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px', // Auto layout горизонтальный
                    borderBottom: index !== recentActivity.length - 1 ? '1px solid rgba(var(--border), 0.2)' : 'none',
                    overflow: 'hidden', // Clip content
                    boxSizing: 'border-box'
                  }}
                >
                  <div 
                    style={{
                      flex: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      overflow: 'hidden' // Clip content
                    }}
                  >
                    <div className="unified-text" style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                      {activity.user}
                    </div>
                    <div className="unified-text" style={{ color: 'var(--muted-foreground)' }}>
                      {activity.action}
                    </div>
                  </div>
                  <div 
                    className="unified-text"
                    style={{ 
                      color: 'var(--muted-foreground)',
                      flexShrink: 0, // Hug contents - время не сжимается
                      overflow: 'hidden'
                    }}
                  >
                    {activity.time}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>



      {/* Модальное окно жалоб */}
      {showComplaints && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-3xl w-full max-w-sm max-h-[80vh] overflow-hidden apple-shadow border border-border/20">
            {/* Заголовок модального окна */}
            <div className="flex items-center justify-between p-6 border-b border-border/20">
              <h2 className="text-lg font-medium text-foreground text-center flex-1">Сообщения о проблемах</h2>
              <button
                onClick={() => setShowComplaints(false)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>

            {/* Вкладки */}
            <div className="flex border-b border-border/20">
              <button
                onClick={() => setComplaintsTab('active')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors text-center ${
                  complaintsTab === 'active'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Активные ({activeComplaints.length})
              </button>
              <button
                onClick={() => setComplaintsTab('resolved')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors text-center ${
                  complaintsTab === 'resolved'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Решены ({resolvedComplaints.length})
              </button>
            </div>

            {/* Список жалоб */}
            <div className="overflow-y-auto max-h-96 p-6">
              {(complaintsTab === 'active' ? activeComplaints : resolvedComplaints).map((complaint) => (
                <div key={complaint.id} className="mb-4 p-4 bg-secondary rounded-2xl apple-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{complaint.user}</span>
                    <span className="text-xs text-muted-foreground">{complaint.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                  {complaint.file && (
                    <div className="text-xs text-primary">📎 {complaint.file}</div>
                  )}
                  {complaintsTab === 'active' && (
                    <button className="mt-3 px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary/90 transition-colors">
                      Решить
                    </button>
                  )}
                </div>
              ))}
              {(complaintsTab === 'active' ? activeComplaints : resolvedComplaints).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  {complaintsTab === 'active' ? 'Активных обращений нет' : 'Решенных обращений нет'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно истории активности */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="glass-card border-none max-w-sm p-0 [&>button]:hidden">
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground/70" />
                </button>
                <DialogTitle className="text-lg font-medium text-foreground text-center flex-1">История действий</DialogTitle>
              </div>
              <DialogDescription className="sr-only">
                История действий пользователей
              </DialogDescription>
            </DialogHeader>

            <div className="text-center text-muted-foreground py-8">
              История активности отсутствует
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно уведомлений */}
      <NotificationsModal 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}