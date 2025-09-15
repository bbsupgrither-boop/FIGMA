import { useState } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { Achievement } from '../types/achievements';
import { mockAppState } from '../data/mockData';
import { Trophy, Zap, Users, Clock, Target, Star, ChevronRight, Play, Award, TrendingUp } from './Icons';

interface HomePageStyledProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings?: () => void;
  achievements: Achievement[];
  profilePhoto?: string | null;
}

export function HomePageStyled({ onNavigate, currentPage, onOpenSettings, achievements, profilePhoto }: HomePageStyledProps) {
  const { currentUser, leaderboard, battles } = mockAppState;
  const [activeTab, setActiveTab] = useState<'overview' | 'battles' | 'achievements'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: Target },
    { id: 'battles' as const, label: 'Битвы', icon: Zap },
    { id: 'achievements' as const, label: 'Достижения', icon: Trophy }
  ];

  const completedAchievements = achievements.filter(a => a.isCompleted);
  const activeAchievements = achievements.filter(a => !a.isCompleted && a.progress > 0);
  const activeBattles = battles.filter(b => b.status === 'active');

  const renderOverviewTab = () => (
    <div className="space-y-4">
      {/* Прогресс пользователя */}
      <div className="glass-card rounded-2xl p-4 apple-shadow">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl text-white">🚀</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-foreground">Уровень {currentUser.level}</h3>
              <span className="text-sm text-muted-foreground">{currentUser.experience}/{currentUser.maxExperience} XP</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentUser.experience / currentUser.maxExperience) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              До следующего уровня: {currentUser.maxExperience - currentUser.experience} XP
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('tasks')}
          className="glass-card rounded-2xl p-4 apple-shadow hover:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-foreground">Задачи</div>
              <div className="text-sm text-muted-foreground">3 активных</div>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => onNavigate('shop')}
          className="glass-card rounded-2xl p-4 apple-shadow hover:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-foreground">Магазин</div>
              <div className="text-sm text-muted-foreground">Новинки</div>
            </div>
          </div>
        </button>
      </div>

      {/* Активные достижения */}
      {activeAchievements.length > 0 && (
        <div className="glass-card rounded-2xl p-4 apple-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">В процессе</h3>
            <button
              onClick={() => onNavigate('achievements')}
              className="text-primary text-sm hover:scale-[0.98] transition-transform"
            >
              Все
            </button>
          </div>
          <div className="space-y-3">
            {activeAchievements.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <span className="text-xl">{achievement.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">{achievement.title}</div>
                  <div className="w-full bg-secondary rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {achievement.progress}/{achievement.maxProgress}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Последние достижения */}
      {completedAchievements.length > 0 && (
        <div className="glass-card rounded-2xl p-4 apple-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Недавние достижения</h3>
            <button
              onClick={() => onNavigate('achievements')}
              className="text-primary text-sm hover:scale-[0.98] transition-transform"
            >
              Все
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {completedAchievements.slice(-4).map((achievement) => (
              <div key={achievement.id} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-2 mx-auto">
                  <span className="text-xl">{achievement.icon}</span>
                </div>
                <div className="text-xs text-foreground font-medium truncate">{achievement.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderBattlesTab = () => (
    <div className="space-y-4">
      {activeBattles.length > 0 ? (
        activeBattles.map((battle) => (
          <div key={battle.id} className="glass-card rounded-2xl p-4 apple-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{battle.title}</div>
                <div className="text-sm text-muted-foreground">{battle.description}</div>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{battle.participants} участников</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{battle.timeLeft}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('battles')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:scale-[0.98] transition-transform"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center apple-shadow">
          <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Нет активных битв</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Битвы скоро начнутся. Следите за обновлениями!
          </p>
        </div>
      )}

      {/* Лидерборд */}
      <div className="glass-card rounded-2xl p-4 apple-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">Топ игроков</h3>
          <button
            onClick={() => onNavigate('battles')}
            className="text-primary text-sm hover:scale-[0.98] transition-transform"
          >
            Полный рейтинг
          </button>
        </div>
        <div className="space-y-3">
          {leaderboard.slice(0, 5).map((user, index) => (
            <div key={user.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index === 0 ? 'bg-yellow-500 text-white' :
                index === 1 ? 'bg-gray-400 text-white' :
                index === 2 ? 'bg-orange-600 text-white' :
                'bg-secondary text-foreground'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground text-sm">{user.name}</div>
                <div className="text-xs text-muted-foreground">Уровень {user.level}</div>
              </div>
              <div className="text-sm font-medium text-foreground">
                {user.points.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-4">
      {achievements.length > 0 ? (
        achievements.slice(0, 6).map((achievement) => (
          <div key={achievement.id} className="glass-card rounded-2xl p-4 apple-shadow">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                achievement.isCompleted 
                  ? 'bg-gradient-to-br from-green-400 to-green-600' 
                  : 'bg-secondary'
              }`}>
                <span className="text-xl">{achievement.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-foreground">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </div>
                  {achievement.isCompleted && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                      <Award className="w-3 h-3" />
                      Выполнено
                    </div>
                  )}
                </div>
                
                {!achievement.isCompleted && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Прогресс</span>
                      <span className="text-foreground">{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    Награда: {achievement.reward.coins} монет
                  </div>
                  {achievement.isCompleted && (
                    <div className="text-green-600 font-medium">
                      +{achievement.reward.coins} 💰
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center apple-shadow">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Нет достижений</h3>
          <p className="text-sm text-muted-foreground">
            Начните выполнять задачи, чтобы получить первые достижения!
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="GRITHER" 
        onOpenSettings={onOpenSettings} 
        profilePhoto={profilePhoto}
        user={currentUser}
      />
      
      <div className="pt-20 pb-20 p-6">
        {/* Статистика пользователя */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 rounded-2xl apple-shadow text-center">
            <div className="text-2xl font-medium text-foreground mb-1">
              {currentUser.level}
            </div>
            <div className="text-sm text-muted-foreground">
              Уровень
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl apple-shadow text-center">
            <div className="text-2xl font-medium text-primary mb-1">
              {completedAchievements.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Достижений
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl apple-shadow text-center">
            <div className="text-2xl font-medium text-green-600 mb-1">
              {leaderboard.findIndex(u => u.id === currentUser.id) + 1 || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">
              Место
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'glass-card text-foreground hover:scale-[0.98]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Контент табов */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'battles' && renderBattlesTab()}
        {activeTab === 'achievements' && renderAchievementsTab()}
      </div>

      <BottomNavigation onNavigate={onNavigate} currentPage={currentPage} />
    </div>
  );
}