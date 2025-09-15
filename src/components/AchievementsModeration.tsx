import { useState } from 'react';
import { Menu, X } from './Icons';
import { AchievementModerationModal } from './AchievementModerationModal';

interface AchievementSubtask {
  id: string;
  description: string;
  requiresAttachment: boolean;
  completed: boolean;
  hasAttachment: boolean;
  attachments?: string[];
  submissionDate?: string;
}

interface AchievementModeration {
  id: string;
  title: string;
  description: string;
  subtasks: AchievementSubtask[];
  assignedTo: string;
  submittedDate: string;
  reward: {
    type: 'XP' | 'G-coin';
    amount: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  completionPercentage: number;
  rejectionReason?: string;
}

interface Props {
  currentAdminPage?: string;
  setCurrentAdminPage?: (page: string) => void;
}

export function AchievementsModeration({ currentAdminPage, setCurrentAdminPage }: Props) {
  // Пустые данные достижений - пользователи будут подавать их самостоятельно
  const [pendingAchievements, setPendingAchievements] = useState<AchievementModeration[]>([]);

  const [selectedAchievement, setSelectedAchievement] = useState<AchievementModeration | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'progress' | 'employee'>('date');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleAchievementClick = (achievement: AchievementModeration) => {
    setSelectedAchievement(achievement);
    setModalOpen(true);
  };

  const handleSubtaskApprove = (achievementId: string, subtaskId: string) => {
    setPendingAchievements(prev => prev.map(achievement => {
      if (achievement.id === achievementId) {
        const updatedSubtasks = achievement.subtasks.map(subtask => 
          subtask.id === subtaskId 
            ? { ...subtask, completed: true }
            : subtask
        );
        const completedCount = updatedSubtasks.filter(st => st.completed).length;
        const percentage = Math.round((completedCount / updatedSubtasks.length) * 100);
        
        return {
          ...achievement,
          subtasks: updatedSubtasks,
          completionPercentage: percentage,
          status: percentage === 100 ? 'approved' as const : achievement.status
        };
      }
      return achievement;
    }));
  };

  const handleAchievementReject = (achievementId: string, reason: string) => {
    setPendingAchievements(prev => prev.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, status: 'rejected' as const, rejectionReason: reason }
        : achievement
    ));
  };

  const getStatusBadge = (status: string, progress: number) => {
    if (status === 'approved') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded text-xs">одобрено</span>;
    }
    if (status === 'rejected') {
      return <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded text-xs">отклонено</span>;
    }
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded text-xs">на проверке</span>;
  };

  // Фильтруем только на проверке
  const filteredAchievements = pendingAchievements.filter(a => a.status === 'pending');

  // Сортировка
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
      case 'progress':
        return b.completionPercentage - a.completionPercentage;
      case 'employee':
        return a.assignedTo.localeCompare(b.assignedTo);
      default:
        return 0;
    }
  });

  return (
    <>
      <div className="min-h-screen bg-background pb-40">
        <div className="p-6">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-foreground">Модерация достижений</h2>
          </div>

          {/* Card с достижениями на проверке */}
          <div className="px-6">
            <div className="glass-card rounded-2xl apple-shadow p-4">
              {/* Заголовок с сортировкой */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Достижения на проверке ({filteredAchievements.length})</h3>
                <div className="relative">
                  <button 
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="glass-card p-3 rounded-xl transition-colors hover:bg-accent/50" 
                    title="Сортировка"
                  >
                    <Menu size={16} className="text-foreground/70" />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 glass-card rounded-xl apple-shadow z-10">
                      {[
                        { key: 'date', label: 'По дате подачи' },
                        { key: 'progress', label: 'По прогрессу' },
                        { key: 'employee', label: 'По сотруднику' }
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => {
                            setSortBy(option.key as any);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                            sortBy === option.key ? 'bg-primary text-primary-foreground' : 'hover:bg-black/5 text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Список достижений */}
              <div className="space-y-3">
                {sortedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 border border-border/20 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => handleAchievementClick(achievement)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">{achievement.title}</h4>
                      {getStatusBadge(achievement.status, achievement.completionPercentage)}
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      Сотрудник: {achievement.assignedTo}
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-3">
                      Прогресс: {achievement.completionPercentage}% • {new Date(achievement.submittedDate).toLocaleDateString('ru-RU')}
                    </div>

                    {/* Прогресс бар */}
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${achievement.completionPercentage}%` }}
                      />
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAchievementClick(achievement);
                        }}
                        className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg text-sm font-medium transition-colors hover:bg-green-600"
                      >
                        Одобрить
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAchievementClick(achievement);
                        }}
                        className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg text-sm font-medium transition-colors hover:bg-red-600"
                      >
                        Отклонить
                      </button>
                    </div>
                  </div>
                ))}

                {sortedAchievements.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Нет достижений на проверке
                  </div>
                )}
              </div>

              <button
                onClick={() => setCurrentAdminPage?.('dashboard')}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors hover:bg-primary/90 mt-6"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>

      <AchievementModerationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        achievement={selectedAchievement}
        onApprove={handleSubtaskApprove}
        onReject={handleAchievementReject}
      />
    </>
  );
}