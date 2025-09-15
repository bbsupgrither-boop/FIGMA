import { useState } from 'react';
import { Eye, ArrowLeft, X, Trophy, Star, Award, Medal } from './Icons';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Achievement } from '../types/achievements';

interface AchievementBlockProps {
  achievements?: Achievement[];
  theme?: 'light' | 'dark';
}

export function AchievementBlock({ achievements = [], theme = 'light' }: AchievementBlockProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Получаем достижения с прогрессом менее 100%, отсортированные по проценту выполнения (убывание)
  const achievementsInProgress = achievements
    .filter(achievement => {
      const percentage = (achievement.requirements.current / achievement.requirements.target) * 100;
      return percentage > 0 && percentage < 100;
    })
    .sort((a, b) => {
      const percentA = (a.requirements.current / a.requirements.target) * 100;
      const percentB = (b.requirements.current / b.requirements.target) * 100;
      return percentB - percentA;
    });

  // Топ достижения для отображения на главной странице
  const topAchievements = achievementsInProgress.slice(0, 3);
  
  // Все достижения в прогрессе для модального окна
  const allProgressAchievements = achievementsInProgress;

  const getProgressPercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  const getAchievementIcon = (iconName: string, rarity: string) => {
    const iconClass = `w-4 h-4 ${rarity === 'legendary' ? 'text-yellow-500' : rarity === 'epic' ? 'text-purple-500' : rarity === 'rare' ? 'text-blue-500' : 'text-primary'}`;
    
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
            className="unified-heading flex-1 text-center"
            style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
          >
            Ваши достижения
          </h3>
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-full transition-all hover:scale-105"
            style={{
              backgroundColor: theme === 'dark' ? '#0F1116' : '#FFFFFF',
              border: theme === 'dark' ? '1px solid #2A2F36' : '1px solid #E6E9EF',
              color: theme === 'dark' ? '#FFFFFF' : '#0F172A'
            }}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 pt-3">
          <div className="space-y-3">
            {topAchievements.length > 0 ? (
              topAchievements.map((achievement) => {
                const percentage = getProgressPercentage(achievement.requirements.current, achievement.requirements.target);
                return (
                  <div
                    key={achievement.id}
                    className="relative overflow-hidden"
                    style={{
                      backgroundColor: theme === 'dark' ? '#1C2029' : '#FFFFFF',
                      borderRadius: '16px',
                      padding: '16px',
                      border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
                      boxShadow: theme === 'dark' ? '0 8px 24px rgba(0, 0, 0, 0.6)' : '0 8px 24px rgba(0, 0, 0, 0.10)'
                    }}
                  >
                    {/* Фоновая заливка прогресса */}
                    <div 
                      className="absolute inset-0 transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: theme === 'dark' ? 'rgba(43, 130, 255, 0.12)' : 'rgba(43, 130, 255, 0.10)',
                        borderRadius: '16px'
                      }}
                    />
                    
                    {/* Контент */}
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{
                            backgroundColor: achievement.rarity === 'legendary' 
                              ? 'rgba(255, 193, 7, 0.20)' 
                              : achievement.rarity === 'epic' 
                                ? 'rgba(156, 39, 176, 0.20)' 
                                : achievement.rarity === 'rare' 
                                  ? 'rgba(33, 150, 243, 0.20)' 
                                  : 'rgba(43, 130, 255, 0.20)'
                          }}
                        >
                          {getAchievementIcon(achievement.icon, achievement.rarity)}
                        </div>
                        <div className="flex-1">
                          <div 
                            className="unified-text mb-1"
                            style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A', fontWeight: 'var(--font-weight-medium)' }}
                          >
                            {achievement.title}
                          </div>
                          <div 
                            className="unified-text"
                            style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                          >
                            {achievement.description}
                          </div>
                        </div>
                      </div>
                      <div 
                        className="unified-text ml-2"
                        style={{ color: '#2B82FF', fontWeight: 'var(--font-weight-medium)' }}
                      >
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center min-h-[60px]">
                <p 
                  className="unified-text text-center opacity-70"
                  style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                >
                  Нет достижений в процессе выполнения
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className={`${theme === 'dark' ? 'dark' : ''} glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-0 max-h-[80vh] flex flex-col [&>button]:hidden`}
        >
          <div className="p-6 flex-1 flex flex-col">
            <div className="relative mb-6">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute right-0 top-0 apple-button p-2 rounded-full hover:scale-105 transition-transform"
              >
                <X className="w-4 h-4" style={{ color: theme === 'dark' ? '#1A1A1A' : '#6B7280' }} />
              </button>
              
              <DialogTitle className="unified-heading text-foreground text-center">
                Ваши достижения
              </DialogTitle>
            </div>
            
            <DialogDescription className="sr-only">
              Просмотр ваших текущих достижений и прогресса
            </DialogDescription>

            {/* Список достижений */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {allProgressAchievements.length > 0 ? (
                allProgressAchievements.map((achievement) => {
                  const percentage = getProgressPercentage(achievement.requirements.current, achievement.requirements.target);
                  return (
                    <div
                      key={achievement.id}
                      className="relative glass-card rounded-2xl p-4 apple-shadow overflow-hidden"
                    >
                      {/* Фоновая заливка прогресса */}
                      <div 
                        className="absolute inset-0 opacity-20 rounded-2xl transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, rgba(0, 122, 255, 0.2) 0%, rgba(0, 122, 255, 0.1) 100%)`
                        }}
                      />
                      
                      {/* Контент */}
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${achievement.rarity === 'legendary' ? 'bg-yellow-500/20' : achievement.rarity === 'epic' ? 'bg-purple-500/20' : achievement.rarity === 'rare' ? 'bg-blue-500/20' : 'bg-primary/20'} rounded-xl flex items-center justify-center`}>
                            {getAchievementIcon(achievement.icon, achievement.rarity)}
                          </div>
                          <div className="flex-1">
                            <div className="unified-text mb-1 text-foreground" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                              {achievement.title}
                            </div>
                            <div className="unified-text text-muted-foreground">
                              {achievement.description}
                            </div>
                            <div className="unified-text text-muted-foreground mt-1">
                              {achievement.requirements.current}/{achievement.requirements.target}
                            </div>
                          </div>
                        </div>
                        <div className="unified-text text-primary ml-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                          {percentage}%
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center min-h-[120px]">
                  <p className="unified-text text-muted-foreground text-center">
                    Нет достижений в процессе выполнения
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}