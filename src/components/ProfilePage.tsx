import { useState } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { ProgressBar } from './ProgressBar';
import { Edit, User, Eye, X, Trophy, Zap, Calendar } from './Icons';
import { ModalOpaque } from './ModalOpaque';
import { IconButton } from './IconButton';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Battle, BattleInvitation } from '../types/battles';
import coinIcon from 'figma:asset/29d513144bb95c08c031f3604ac2dd2e7bee6450.png';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings?: () => void;
  profilePhoto?: string | null;
  setProfilePhoto?: (photo: string | null) => void;
  theme?: 'light' | 'dark';
  battles?: Battle[];
  battleInvitations?: BattleInvitation[];
  personalBattles?: any[];
  users?: import('../types/battles').User[];
  currentUser?: import('../types/battles').User;
}

interface UserProfile {
  id: string;
  name: string;
  birthDate: string;
  position: string;
  team: string;
  experience: string;
  teamLead: string;
  registrationDate: string;
  level: number;
  experience_points: number;
  max_experience: number;
  avatar?: string;
  wins: number;
  balance: string;
  achievements: number;
}

interface UserBattle {
  id: string;
  opponent: {
    name: string;
    team: string;
    avatar?: string;
  };
  reward: number;
  status: 'active' | 'waiting' | 'completed';
  dateCreated: string;
  result?: 'won' | 'lost';
}

export function ProfilePage({ onNavigate, currentPage, onOpenSettings, profilePhoto, setProfilePhoto, theme = 'light', battles = [], battleInvitations = [], personalBattles = [], users = [], currentUser }: ProfilePageProps) {
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [isBattleHistoryOpen, setIsBattleHistoryOpen] = useState(false);

  // Объединяем данные из разных источников для отображения баттлов пользователя
  const currentUserId = 'current-user'; // ID текущего пользователя
  
  const userBattles: UserBattle[] = [
    // Добавляем завершенные баттлы из глобальной системы
    ...battles.filter(battle => 
      battle.challengerId === currentUserId || battle.opponentId === currentUserId
    ).map(battle => ({
      id: battle.id,
      opponent: {
        name: battle.challengerId === currentUserId ? battle.opponentName : battle.challengerName,
        team: 'Team 1', // placeholder
        avatar: undefined
      },
      reward: battle.stake,
      status: battle.status === 'completed' ? 'completed' as const : 
              battle.status === 'active' ? 'active' as const : 'waiting' as const,
      dateCreated: battle.startedAt?.toISOString() || new Date().toISOString(),
      result: battle.status === 'completed' ? 
        (battle.winnerId === currentUserId ? 'won' as const : 'lost' as const) : 
        undefined
    })),
    
    // Добавляем персональные баттлы
    ...personalBattles.map(battle => ({
      id: battle.id || `personal_${Math.random()}`,
      opponent: {
        name: battle.opponent?.name || 'Соперник',
        team: `Team ${battle.opponent?.team || 1}`,
        avatar: battle.opponent?.avatar
      },
      reward: battle.prize || 0,
      status: battle.status || 'waiting' as const,
      dateCreated: battle.created?.toISOString() || new Date().toISOString(),
      result: battle.winner ? 
        (battle.winner === 'challenger' ? 'won' as const : 'lost' as const) : 
        undefined
    })),
    
    // Добавляем приглашения на баттлы как ожидающие
    ...battleInvitations.filter(inv => 
      inv.challengerId === currentUserId || inv.opponentId === currentUserId
    ).map(inv => ({
      id: `invite_${inv.id}`,
      opponent: {
        name: inv.challengerId === currentUserId ? inv.opponentName : inv.challengerName,
        team: 'Team 1', // placeholder
        avatar: undefined
      },
      reward: inv.stake,
      status: 'waiting' as const,
      dateCreated: inv.createdAt.toISOString(),
      result: undefined
    }))
  ];

  // Подсчитываем реальную статистику пользователя
  const userWins = userBattles.filter(battle => battle.result === 'won').length;
  const userBalance = currentUser?.balance || 0;
  const userAchievements = 0; // Пока статичная цифра
  
  // Placeholder данные для демонстрации структуры с реальными данными там где возможно
  const userProfile: UserProfile = {
    id: currentUser?.id || '—',
    name: currentUser?.name || '—',
    birthDate: '—',
    position: '—',
    team: '—',
    experience: '—',
    teamLead: '—',
    registrationDate: '—',
    level: currentUser?.level || 0,
    experience_points: 0,
    max_experience: 100,
    wins: userWins,
    balance: userBalance.toString(),
    achievements: userAchievements,
    avatar: currentUser?.avatar
  };
  const recentBattles = userBattles.slice(0, 3); // Показываем только 3 последних
  const allBattles = userBattles;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && setProfilePhoto) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string);
        setIsPhotoUploadOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status: string, result?: string) => {
    switch (status) {
      case 'active':
        return 'text-blue-500';
      case 'waiting':
        return 'text-orange-500';
      case 'completed':
        return result === 'won' ? 'text-green-500' : 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: string, result?: string) => {
    switch (status) {
      case 'active':
        return 'В процессе';
      case 'waiting':
        return 'Ожидание';
      case 'completed':
        return result === 'won' ? 'Победа' : 'Поражение';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string, result?: string) => {
    switch (status) {
      case 'active':
        return <Zap size={16} className="text-blue-500" />;
      case 'waiting':
        return <Calendar size={16} className="text-orange-500" />;
      case 'completed':
        return <Trophy size={16} className={result === 'won' ? 'text-green-500' : 'text-red-500'} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        background: theme === 'dark' 
          ? 'radial-gradient(circle at center, #12151B 0%, #0B0D10 100%)' 
          : 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)',
        color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
      }}
    >
      {/* Хедер без иконки пользователя */}
      <Header 
        onNavigate={onNavigate} 
        currentPage={currentPage}
        hideUserIcon={true}
        onOpenSettings={onOpenSettings}
        theme={theme}
      />
      
      <div className="max-w-md mx-auto px-4 pb-24">
        {/* Основной контент профиля */}
        <div className="space-y-6">
          {/* Блок с фото и информацией */}
          <div className="flex gap-4 items-center">
            {/* Левая колонка с фото */}
            <div className="flex flex-col items-center gap-2">
              {/* Фото пользователя */}
              <div className="glass-card rounded-3xl p-3 w-32 h-32 flex items-center justify-center relative">
                {/* Кнопка редактирования */}
                <button
                  onClick={() => setIsPhotoUploadOpen(true)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
                >
                  <Edit className="w-3 h-3 text-white" />
                </button>

                {profilePhoto ? (
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profilePhoto} alt="Профиль" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-lg">
                      П
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {/* Ник пользователя */}
              <div className="text-sm text-muted-foreground text-center opacity-50">
                @user
              </div>
            </div>

            {/* Информация о пользователе */}
            <div className="flex-1 glass-card rounded-3xl p-4">
              <div className="space-y-3 text-xs">
                <div className="flex items-center">
                  <span className="text-muted-foreground w-20">Id:</span>
                  <span className="text-muted-foreground/50 flex-1 border-b border-border pb-1">{userProfile.id || '—'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground w-20">Имя:</span>
                  <span className="text-muted-foreground/50 flex-1 border-b border-border pb-1">{userProfile.name || '—'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground w-20">ДР:</span>
                  <span className="text-muted-foreground/50 flex-1 border-b border-border pb-1">{userProfile.birthDate || '—'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground w-20">Должность:</span>
                  <span className="text-muted-foreground/50 flex-1 border-b border-border pb-1">{userProfile.position || '—'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground w-20">Команда:</span>
                  <span className="text-muted-foreground/50 flex-1 border-b border-border pb-1">{userProfile.team || '—'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground w-20">Стаж:</span>
                  <span className="text-muted-foreground/50 flex-1 border-b border-border pb-1">{userProfile.experience || '—'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground w-20">Тимлид:</span>
                  <span className="text-muted-foreground/50 flex-1 border-b border-border pb-1">{userProfile.teamLead || '—'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground w-20">Регистрация:</span>
                  <span className="text-muted-foreground/50 flex-1 border-b border-border pb-1">{userProfile.registrationDate || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Мои баттлы */}
          <div className="glass-card rounded-3xl p-4">
            <div 
              className="flex items-center mb-3" 
              style={{ position: 'relative' }}
            >
              <div className="flex-1"></div>
              <h3 className="font-medium text-foreground">Мои баттлы</h3>
              <div className="flex-1 flex justify-end">
                <IconButton
                  icon={<Eye style={{ width: '16px', height: '16px' }} />}
                  onClick={() => setIsBattleHistoryOpen(true)}
                  theme={theme}
                  size="sm"
                  title="Все баттлы"
                />
              </div>
            </div>
            
            {recentBattles.length > 0 ? (
              <div className="space-y-2">
                {recentBattles.map((battle) => (
                  <div
                    key={battle.id}
                    className="flex items-center justify-between p-3 bg-card rounded-xl border border-border hover:bg-accent/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <User size={16} className="text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{battle.opponent.name}</div>
                        <div className="text-xs text-muted-foreground">{battle.opponent.team}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {getStatusIcon(battle.status, battle.result)}
                        <span className={`text-xs font-medium ${getStatusColor(battle.status, battle.result)}`}>
                          {getStatusText(battle.status, battle.result)}
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-xs text-muted-foreground">{battle.reward}</span>
                        <img 
                          src={coinIcon} 
                          alt="coins" 
                          className="w-3 h-3"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[60px]">
                <p className="text-muted-foreground text-sm text-center opacity-70">
                  История баттлов отсутствует
                </p>
              </div>
            )}
          </div>

          {/* Строка уровня */}
          <ProgressBar 
            level={userProfile.level}
            experience={userProfile.experience_points}
            maxExperience={userProfile.max_experience}
            theme={theme}
          />

          {/* Статистика */}
          <div className="glass-card rounded-3xl p-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card rounded-2xl p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">Побед</div>
                <div className="font-medium text-foreground">{userWins}</div>
              </div>
              <div className="glass-card rounded-2xl p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">Баланс</div>
                <div className="flex items-center justify-center gap-1">
                  <span className="font-medium text-foreground">{userBalance}</span>
                  <img 
                    src={coinIcon} 
                    alt="coins" 
                    className="w-4 h-4"
                  />
                </div>
              </div>
              <div className="glass-card rounded-2xl p-3 text-center">      
                <div className="text-xs text-muted-foreground mb-1">Ачивки</div>
                <div className="font-medium text-muted-foreground opacity-50">—</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Диалог загрузки фото */}
      <ModalOpaque
        isOpen={isPhotoUploadOpen}
        onClose={() => setIsPhotoUploadOpen(false)}
        title="Фото профиля"
        theme={theme}
      >
        <div className="space-y-4">
          <p 
            className="text-sm text-center"
            style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
          >
            Выберите фото для профиля
          </p>

          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px', // Auto layout gap
              padding: '0',
              overflow: 'hidden', // Clip content
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <label 
              className="cursor-pointer"
              style={{
                flexShrink: 0, // Hug contents
                overflow: 'hidden' // Clip content
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div 
                className="text-center rounded-xl hover:scale-[0.98] transition-transform unified-button"
                style={{
                  padding: '16px',
                  backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                  border: theme === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.06)' 
                    : '1px solid #E6E9EF',
                  width: '100%',
                  overflow: 'hidden' // Clip content внутри кнопки
                }}
              >
                <div 
                  style={{ 
                    color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Загрузить фото
                </div>
              </div>
            </label>
            
            <button
              onClick={() => setIsPhotoUploadOpen(false)}
              className="rounded-xl hover:scale-[0.98] transition-transform unified-button"
              style={{
                padding: '16px',
                backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                flexShrink: 0, // Hug contents
                overflow: 'hidden', // Clip content внутри кнопки
                width: '100%'
              }}
            >
              Отменить
            </button>
          </div>
        </div>
      </ModalOpaque>

      {/* Диалог всех баттлов */}
      <ModalOpaque
        isOpen={isBattleHistoryOpen}
        onClose={() => setIsBattleHistoryOpen(false)}
        title="Все мои баттлы"
        theme={theme}
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <div className="space-y-3">
            {allBattles.length > 0 ? (
              allBattles.map((battle) => (
                <div 
                  key={battle.id} 
                  className="p-3 rounded-xl"
                  style={{
                    backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                    border: theme === 'dark' 
                      ? '1px solid rgba(255, 255, 255, 0.06)' 
                      : '1px solid #E6E9EF'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: theme === 'dark' ? '#1C2029' : '#E6E9EF'
                        }}
                      >
                        <User 
                          size={18} 
                          style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                        />
                      </div>
                      <div>
                        <div 
                          className="text-sm font-medium"
                          style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                        >
                          {battle.opponent.name}
                        </div>
                        <div 
                          className="text-xs"
                          style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                        >
                          {battle.opponent.team}
                        </div>
                        <div 
                          className="text-xs mt-1"
                          style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                        >
                          {new Date(battle.dateCreated).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {getStatusIcon(battle.status, battle.result)}
                        <span className={`text-sm font-medium ${getStatusColor(battle.status, battle.result)}`}>
                          {getStatusText(battle.status, battle.result)}
                        </span>
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>{battle.reward}</span>
                          <img 
                            src={coinIcon} 
                            alt="coins" 
                            className="w-4 h-4"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center min-h-[120px]">
                <p 
                  className="text-sm text-center opacity-70"
                  style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                >
                  История баттлов отсутствует
                </p>
              </div>
            )}
          </div>
        </div>
      </ModalOpaque>

      <BottomNavigation onNavigate={onNavigate} currentPage={currentPage} theme={theme} />
    </div>
  );
}