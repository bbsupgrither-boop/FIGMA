import { useState } from 'react';
import { Eye, ArrowLeft, Trophy, Star, Award, Medal, Menu, Check } from './Icons';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Achievement } from '../types/achievements';
import { Notification } from '../types/notifications';

interface AchievementRewardsProps {
  achievements?: Achievement[];
  theme?: 'light' | 'dark';
  notifications?: Notification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  onRemoveNotification?: (id: string) => void;
  onClearAllNotifications?: () => void;
  addNotification?: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

export function AchievementRewards({ 
  achievements = [], 
  theme = 'light',
  notifications = [],
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onRemoveNotification,
  onClearAllNotifications,
  addNotification
}: AchievementRewardsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  console.log('AchievementRewards isOpen state:', isOpen);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>([]);

  // Получаем только полученные достижения (100% выполненные)
  const completedAchievements = achievements.filter(achievement => {
    const percentage = (achievement.requirements.current / achievement.requirements.target) * 100;
    return percentage >= 100;
  });

  const getAchievementIcon = (iconName: string, rarity: string) => {
    const iconClass = "w-6 h-6 text-white";
    
    switch (iconName) {
      case 'trophy':
        return <Trophy className={iconClass} />;
      case 'star':
        return <Star className={iconClass} />;
      case 'award':
        return <Award className={iconClass} />;
      case 'medal':
        return <Medal className={iconClass} />;
      default:
        return <Trophy className={iconClass} />;
    }
  };

  // Создаем массив из 5 слотов для отображения на главной
  const achievementSlots = Array(5).fill(null).map((_, index) => 
    completedAchievements[index] || null
  );

  const handleSelectionModeToggle = () => {
    setIsSelectionMode(!isSelectionMode);
    if (!isSelectionMode) {
      // При входе в режим выбора, выбираем первые 5 достижений по умолчанию
      setSelectedAchievements(completedAchievements.slice(0, 5).map(a => a.id));
    }
  };

  const handleConfirmSelection = () => {
    setIsSelectionMode(false);
    // Здесь будет логика сохранения выбранных достижений для отображения на главной
    console.log('Выбранные достижения:', selectedAchievements);
  };

  const handleAchievementToggle = (achievementId: string) => {
    if (!isSelectionMode) return;
    
    setSelectedAchievements(prev => {
      if (prev.includes(achievementId)) {
        return prev.filter(id => id !== achievementId);
      } else if (prev.length < 5) {
        return [...prev, achievementId];
      }
      return prev;
    });
  };

  return (
    <>
      <div 
        className={theme === 'dark' ? 'dark' : ''}
        style={{
          backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
          borderRadius: '20px',
          border: theme === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.06)' 
            : '1px solid #E6E9EF',
          boxShadow: theme === 'dark' 
            ? '0 8px 24px rgba(0, 0, 0, 0.6)' 
            : '0 8px 24px rgba(0, 0, 0, 0.10)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-0">
          <div className="w-8 h-8"></div>
          <h3 
            className="font-medium flex-1 text-center"
            style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
          >
            Ачивки
          </h3>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('EYE BUTTON CLICKED! Opening modal...');
              setIsOpen(true);
              
              // Добавляем уведомление об открытии модала для отладки
              if (addNotification) {
                addNotification({
                  type: 'system',
                  title: '👁️ Модал достижений открыт',
                  message: 'Проверка работы кнопки-глазика',
                  priority: 'low'
                });
              }
            }}
            className="p-2 rounded-full transition-all hover:scale-105"
            style={{
              backgroundColor: theme === 'dark' ? '#0F1116' : '#FFFFFF',
              border: theme === 'dark' ? '1px solid #2A2F36' : '1px solid #E6E9EF',
              color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
              cursor: 'pointer',
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 50
            }}
            title="Открыть полученные достижения"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 pt-3">
          <div className="flex justify-center gap-3">
            {achievementSlots.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center justify-center"
              >
                {achievement ? (
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: achievement.rarity === 'legendary' 
                        ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' 
                        : achievement.rarity === 'epic' 
                          ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' 
                          : achievement.rarity === 'rare' 
                            ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                            : 'linear-gradient(135deg, #2B82FF 0%, #1E40AF 100%)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.10)',
                      border: '2px solid rgba(255, 255, 255, 0.20)'
                    }}
                  >
                    {getAchievementIcon(achievement.icon, achievement.rarity)}
                  </div>
                ) : (
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed"
                    style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(167, 176, 189, 0.10)' 
                        : 'rgba(107, 114, 128, 0.10)',
                      borderColor: theme === 'dark' 
                        ? 'rgba(167, 176, 189, 0.30)' 
                        : 'rgba(107, 114, 128, 0.30)'
                    }}
                  >
                    <Trophy 
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        color: theme === 'dark' 
                          ? 'rgba(167, 176, 189, 0.40)' 
                          : 'rgba(107, 114, 128, 0.40)' 
                      }} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => {
        console.log('Dialog onOpenChange called with:', open);
        setIsOpen(open);
        if (!open) {
          setIsSelectionMode(false);
          setSelectedAchievements([]);
        }
      }}>
        <DialogContent 
          className={`${theme === 'dark' ? 'dark' : ''} glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-0 max-h-[80vh] flex flex-col [&>button]:hidden`}
        >
          <DialogTitle className="sr-only">
            Полученные ачивки
          </DialogTitle>
          
          <DialogDescription className="sr-only">
            Просмотр всех полученных достижений
          </DialogDescription>
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="relative mb-6">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsSelectionMode(false);
                  setSelectedAchievements([]);
                }}
                className="absolute left-0 top-0 apple-button p-2 rounded-full hover:scale-105 transition-transform"
              >
                <ArrowLeft className="w-4 h-4 text-foreground/70" />
              </button>
              
              <h2 className="text-lg font-medium text-foreground text-center">
                Полученные ачивки
              </h2>

              {/* Кнопка выбора (три линии) */}
              {!isSelectionMode && (
                <button 
                  onClick={handleSelectionModeToggle}
                  className="absolute top-0 right-0 apple-button p-2 rounded-full hover:scale-105 transition-transform"
                >
                  <Menu className="w-4 h-4 text-foreground/70" />
                </button>
              )}

              {/* Кнопка подтверждения (галочка) */}
              {isSelectionMode && (
                <button 
                  onClick={handleConfirmSelection}
                  className="absolute top-0 right-0 apple-button p-2 rounded-full hover:scale-105 transition-transform"
                >
                  <Check className="w-4 h-4 text-foreground/70" />
                </button>
              )}
            </div>

            {/* Подсказка в режиме выбора */}
            {isSelectionMode && (
              <div className="mb-4 p-3 glass-card rounded-xl border border-primary/30">
                <p className="text-xs text-center text-muted-foreground">
                  Выберите до 5 достижений для отображения на главной странице
                </p>
                <p className="text-xs text-center text-primary mt-1">
                  Выбрано: {selectedAchievements.length}/5
                </p>
              </div>
            )}

            {/* Сетка полученных достижений */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-4 gap-4">
                {completedAchievements.length > 0 ? (
                  completedAchievements.map((achievement) => {
                    const isSelected = selectedAchievements.includes(achievement.id);
                    const canSelect = selectedAchievements.length < 5 || isSelected;
                    
                    return (
                      <div
                        key={achievement.id}
                        className={`flex flex-col items-center gap-2 transition-all duration-200 ${
                          isSelectionMode 
                            ? canSelect 
                              ? 'hover:scale-[0.98] cursor-pointer' 
                              : 'opacity-50 cursor-not-allowed'
                            : 'hover:scale-[0.98]'
                        }`}
                        onClick={() => isSelectionMode && canSelect && handleAchievementToggle(achievement.id)}
                      >
                        <div className={`relative w-16 h-16 ${achievement.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : achievement.rarity === 'epic' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : achievement.rarity === 'rare' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-primary to-blue-600'} rounded-full flex items-center justify-center apple-shadow border-2 ${isSelected ? 'border-primary' : 'border-white/20'}`}>
                          {getAchievementIcon(achievement.icon, achievement.rarity)}
                          
                          {/* Индикатор выбора */}
                          {isSelectionMode && isSelected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-medium text-foreground text-center line-clamp-2">
                          {achievement.title}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-4 flex items-center justify-center min-h-[120px]">
                    <p className="text-muted-foreground text-center">
                      Нет полученных достижений
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}