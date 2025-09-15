import { useState } from 'react';
import { Eye, Menu, Check, ArrowLeft, Trophy, Star, Award, Medal } from './Icons';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Achievement } from '../types/achievements';

interface AchievementIconsProps {
  achievements?: Achievement[];
}

export function AchievementIcons({ achievements = [] }: AchievementIconsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  // Получаем только разблокированные достижения
  const unlockedAchievements = achievements.filter(achievement => achievement.isUnlocked);
  
  // Максимум 7 ячеек для отображения (как в оригинальном дизайне)
  const maxSlots = 7;
  
  const getAchievementIcon = (iconName: string, rarity: string) => {
    const iconClass = `w-6 h-6 ${rarity === 'legendary' ? 'text-yellow-500' : rarity === 'epic' ? 'text-purple-500' : rarity === 'rare' ? 'text-blue-500' : 'text-primary'}`;
    
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

  const handleSelectionModeToggle = () => {
    setIsSelectionMode(!isSelectionMode);
  };

  const handleConfirmSelection = () => {
    setIsSelectionMode(false);
    // Здесь будет логика сохранения выбранных достижений
  };

  return (
    <>
      <div className="mb-6">
        <div className="glass-card rounded-2xl p-4 apple-shadow">
          <div className="relative flex items-center justify-center mb-3">
            <span className="font-medium text-foreground">Ачивки</span>
            <button 
              onClick={() => setIsOpen(true)}
              className="absolute right-0 apple-button p-2 rounded-full hover:scale-105 transition-transform"
            >
              <Eye className="w-4 h-4 text-foreground/70" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3 min-h-[80px]">
            {Array.from({ length: maxSlots }, (_, index) => {
              const achievement = unlockedAchievements[index];
              return (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    achievement
                      ? `${achievement.rarity === 'legendary' ? 'bg-yellow-500/20 border border-yellow-500/30' : 
                          achievement.rarity === 'epic' ? 'bg-purple-500/20 border border-purple-500/30' : 
                          achievement.rarity === 'rare' ? 'bg-blue-500/20 border border-blue-500/30' : 
                          'bg-primary/20 border border-primary/30'} apple-shadow`
                      : 'bg-muted/30 border border-border'
                  }`}
                >
                  {achievement ? (
                    <div className="flex items-center justify-center">
                      {getAchievementIcon(achievement.icon, achievement.rarity)}
                    </div>
                  ) : (
                    <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
          
          {unlockedAchievements.length === 0 && (
            <div className="flex items-center justify-center mt-2">
              <p className="text-muted-foreground text-sm text-center opacity-70">
                Нет полученных ачивок
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-6 [&>button]:hidden">
          <div className="relative">
            {/* Кнопка назад (стрелка влево) */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute left-0 top-0 apple-button p-2 rounded-full hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-4 h-4 text-foreground/70" />
            </button>
            
            <DialogTitle className="text-lg font-medium text-foreground text-center mb-6">
              Ачивки
            </DialogTitle>
            
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
          
          <DialogDescription className="sr-only">
            Просмотр ваших полученных ачивок
          </DialogDescription>

          {/* Контент */}
          <div className="min-h-[120px]">
            {isSelectionMode ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center">
                  Режим выбора достижений для главной страницы
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {unlockedAchievements.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {unlockedAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-2xl glass-card apple-shadow flex flex-col items-center gap-2 ${
                          achievement.rarity === 'legendary' ? 'border border-yellow-500/30' : 
                          achievement.rarity === 'epic' ? 'border border-purple-500/30' : 
                          achievement.rarity === 'rare' ? 'border border-blue-500/30' : 
                          'border border-primary/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          achievement.rarity === 'legendary' ? 'bg-yellow-500/20' : 
                          achievement.rarity === 'epic' ? 'bg-purple-500/20' : 
                          achievement.rarity === 'rare' ? 'bg-blue-500/20' : 
                          'bg-primary/20'
                        }`}>
                          {getAchievementIcon(achievement.icon, achievement.rarity)}
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-medium text-foreground">
                            {achievement.title}
                          </div>
                          {achievement.unlockedAt && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {achievement.unlockedAt.toLocaleDateString('ru-RU')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-center">
                      Нет полученных ачивок
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}