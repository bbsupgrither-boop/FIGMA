import { useState } from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { AchievementBlock } from './AchievementBlock';
import { AchievementRewards } from './AchievementRewards';
import { ProgressBar } from './ProgressBar';
import { BattleCard } from './BattleCard';
import { BattleLeaderboard } from './BattleLeaderboard';
import { AchievementIcons } from './AchievementIcons';

import { Achievement } from '../types/achievements';

import { Battle, BattleInvitation, User } from '../types/battles';
import { LeaderboardEntry } from '../types/global';
import { AllBattlesModal } from './AllBattlesModal';
import { CreateBattleModal } from './CreateBattleModal';

interface HomePageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings?: () => void;
  achievements: Achievement[];
  profilePhoto?: string | null;
  personalBattles: any[];
  setPersonalBattles: (battles: any[]) => void;
  theme?: 'light' | 'dark';
  battles?: Battle[];
  battleInvitations?: BattleInvitation[];
  users?: User[];
  leaderboard?: LeaderboardEntry[];
  onCreateBattleInvitation?: (invitation: Omit<BattleInvitation, 'id' | 'createdAt' | 'expiresAt' | 'status'>) => void;
  onAcceptBattleInvitation?: (invitationId: string) => void;
  onDeclineBattleInvitation?: (invitationId: string) => void;
  onCompleteBattle?: (battleId: string, winnerId: string) => void;
  currentUser?: User;
}

export function HomePage({ 
  onNavigate, 
  currentPage, 
  onOpenSettings, 
  achievements, 
  profilePhoto, 
  personalBattles, 
  setPersonalBattles, 
  theme = 'light',

  battles = [],
  battleInvitations = [],
  users = [],
  leaderboard = [],
  onCreateBattleInvitation,
  onAcceptBattleInvitation,
  onDeclineBattleInvitation,
  onCompleteBattle,
  currentUser
}: HomePageProps) {
  // Используем реальные или placeholder данные для текущего пользователя
  const userDisplayData = {
    id: currentUser?.id || 'placeholder',
    name: currentUser?.name || 'Пользователь',
    username: '@user',
    level: currentUser?.level || 1,
    experience: currentUser?.experience || 0,
    maxExperience: currentUser?.maxExperience || 100,
    balance: currentUser?.balance || 1000
  };

  // Состояния для модалок баттлов
  const [isAllBattlesModalOpen, setIsAllBattlesModalOpen] = useState(false);
  const [isCreateBattleModalOpen, setIsCreateBattleModalOpen] = useState(false);




  
  return (
    <div 
      className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}
      style={{
        background: theme === 'dark' ? '#0B0D10' : '#FFFFFF',
        color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Header 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
          onOpenSettings={onOpenSettings}
          user={userDisplayData}
          profilePhoto={profilePhoto}
          theme={theme}
        />
      </div>
      
      {/* Hero Zone with Logo */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Hero theme={theme} />
      </div>
      
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 pb-32" style={{ marginTop: '0px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Achievement Block - Достижения в процессе */}
          <AchievementBlock achievements={achievements} theme={theme} />
          
          {/* Progress Bar */}
          <ProgressBar 
            level={currentUser?.level || 1}
            experience={currentUser?.experience || 0}
            maxExperience={currentUser?.maxExperience || 100}
            theme={theme}
          />
          
          {/* Battle Card и Leaderboard - рядом по горизонтали */}
          <div className="grid grid-cols-2 gap-3">
            {/* Battle Card */}
            <BattleCard
              battles={battles}
              invitations={battleInvitations}
              onShowAllBattles={() => setIsAllBattlesModalOpen(true)}
              onCreateBattle={() => setIsCreateBattleModalOpen(true)}
              theme={theme}
            />
            
            {/* Battle Leaderboard */}
            <BattleLeaderboard
              leaderboard={leaderboard}
              onNavigate={onNavigate}
              theme={theme}
            />
          </div>
          
          {/* Achievement Rewards - Полученные ачивки */}
          <AchievementRewards 
            achievements={achievements} 
            theme={theme}
          />
        </div>
      </div>
      


      {/* Модалки баттлов */}
      <AllBattlesModal
        isOpen={isAllBattlesModalOpen}
        onClose={() => setIsAllBattlesModalOpen(false)}
        battles={battles}
        invitations={battleInvitations}
        onAcceptInvitation={onAcceptBattleInvitation}
        onDeclineInvitation={onDeclineBattleInvitation}
        onSubmitBattleEvidence={(battleId, comment, files) => {
          console.log('📝 Доказательства баттла отправлены:', { battleId, comment, files });
          // Здесь можно добавить логику отправки доказательств администратору
        }}
        theme={theme}
      />

      <CreateBattleModal
        isOpen={isCreateBattleModalOpen}
        onClose={() => setIsCreateBattleModalOpen(false)}
        users={users}
        currentUserId={currentUser?.id || 'current-user'}
        onCreateInvitation={(invitation) => {
          console.log('📨 Создание приглашения на баттл:', invitation);
          if (onCreateBattleInvitation) {
            onCreateBattleInvitation(invitation);
          }
        }}
        theme={theme}
      />
    </div>
  );
}