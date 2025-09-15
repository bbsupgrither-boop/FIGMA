import { memo } from 'react';
import { HomePage } from './HomePage';
import { AchievementsPage } from './AchievementsPage';
import { TasksPage } from './TasksPage';
import CasesShopPageFixed from './CasesShopPageFixed';
import { ProfilePage } from './ProfilePage';
import { BattlesPageFixed } from './BattlesPageFixed';
import { AdminPanel } from './AdminPanel';
import { Achievement } from '../types/achievements';
import { ShopItem, Order } from '../types/shop';
import { Task } from '../types/tasks';
import { CaseType, UserCase } from '../types/cases';
import { Battle, BattleInvitation } from '../types/battles';
import { User as BattleUser } from '../types/battles';
import { LeaderboardEntry } from '../types/global';

interface PageRendererProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenSettings: () => void;
  profilePhoto: string | null;
  theme: 'light' | 'dark';
  
  // Data
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  cases: CaseType[];
  setCases: (cases: CaseType[]) => void;
  userCases: UserCase[];
  setUserCases: (userCases: UserCase[]) => void;
  shopItems: ShopItem[];
  setShopItems: (items: ShopItem[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  battles: Battle[];
  setBattles: (battles: Battle[]) => void;
  battleInvitations: BattleInvitation[];
  setBattleInvitations: (invitations: BattleInvitation[]) => void;
  personalBattles: any[];
  setPersonalBattles: (battles: any[]) => void;
  leaderboard: LeaderboardEntry[];
  users: BattleUser[];
  currentUser: BattleUser;
  
  // Profile
  setProfilePhoto: (photo: string | null) => void;
  
  // Functions
  onUpdateUserBalance: (userId: string, amount: number) => void;
  onUpdateUserExperience: (userId: string, amount: number) => void;
  onCreateBattleInvitation: (invitation: any) => void;
  onAcceptBattleInvitation: (id: string) => void;
  onDeclineBattleInvitation: (id: string) => void;
  onCompleteBattle: (battleId: string, winnerId: string) => void;
  addNotification: (notification: any) => void;
  handleToggleDarkMode: () => void;
}

export const PageRenderer = memo(function PageRenderer({
  currentPage,
  onNavigate,
  onOpenSettings,
  profilePhoto,
  theme,
  achievements,
  setAchievements,
  tasks,
  setTasks,
  cases,
  setCases,
  userCases,
  setUserCases,
  shopItems,
  setShopItems,
  orders,
  setOrders,
  battles,
  setBattles,
  battleInvitations,
  setBattleInvitations,
  personalBattles,
  setPersonalBattles,
  leaderboard,
  users,
  currentUser,
  setProfilePhoto,
  onUpdateUserBalance,
  onUpdateUserExperience,
  onCreateBattleInvitation,
  onAcceptBattleInvitation,
  onDeclineBattleInvitation,
  onCompleteBattle,
  addNotification,
  handleToggleDarkMode
}: PageRendererProps) {
  
  switch (currentPage) {
    case 'achievements':
      return (
        <AchievementsPage 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
          onOpenSettings={onOpenSettings}
          achievements={achievements}
          setAchievements={setAchievements}
          profilePhoto={profilePhoto}
          theme={theme}
        />
      );
      
    case 'tasks':
      return (
        <TasksPage 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
          onOpenSettings={onOpenSettings}
          profilePhoto={profilePhoto}
          tasks={tasks}
          setTasks={setTasks}
          theme={theme}
        />
      );
      
    case 'cases':
      return (
        <CasesShopPageFixed 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
          onOpenSettings={onOpenSettings}
          profilePhoto={profilePhoto}
          theme={theme}
          cases={cases}
          userCases={userCases}
          setUserCases={setUserCases}
          currentUser={currentUser}
          onUpdateUserBalance={onUpdateUserBalance}
          onUpdateUserExperience={onUpdateUserExperience}
        />
      );
      
    case 'profile':
      return (
        <ProfilePage 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
          onOpenSettings={onOpenSettings}
          profilePhoto={profilePhoto}
          setProfilePhoto={setProfilePhoto}
          theme={theme}
          battles={battles}
          battleInvitations={battleInvitations}
          personalBattles={personalBattles}
          users={users}
          currentUser={currentUser}
        />
      );
      
    case 'battles':
      return (
        <BattlesPageFixed 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
          onOpenSettings={onOpenSettings}
          profilePhoto={profilePhoto}
          personalBattles={personalBattles}
          setPersonalBattles={setPersonalBattles}
          theme={theme}
          battles={battles}
          battleInvitations={battleInvitations}
          users={users}
          currentUser={currentUser}
          onCreateBattleInvitation={onCreateBattleInvitation}
          onAcceptBattleInvitation={onAcceptBattleInvitation}
          onDeclineBattleInvitation={onDeclineBattleInvitation}
          onCompleteBattle={onCompleteBattle}
        />
      );

    case 'admin':
      return (
        <AdminPanel 
          onNavigate={onNavigate}
          achievements={achievements}
          setAchievements={setAchievements}
          shopItems={shopItems}
          setShopItems={setShopItems}
          orders={orders}
          setOrders={setOrders}
          tasks={tasks}
          setTasks={setTasks}
          cases={cases}
          setCases={setCases}
          userCases={userCases}
          setUserCases={setUserCases}
          onToggleDarkMode={handleToggleDarkMode}
          battles={battles}
          setBattles={setBattles}
          battleInvitations={battleInvitations}
          setBattleInvitations={setBattleInvitations}
          onCompleteBattle={onCompleteBattle}
          users={users}
          onUpdateUserBalance={onUpdateUserBalance}
          addNotification={addNotification}
        />
      );
      
    case 'home':
    default:
      return (
        <HomePage 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
          onOpenSettings={onOpenSettings}
          achievements={achievements}
          profilePhoto={profilePhoto}
          personalBattles={personalBattles}
          setPersonalBattles={setPersonalBattles}
          theme={theme}
          battles={battles}
          battleInvitations={battleInvitations}
          users={users}
          leaderboard={leaderboard}
          onCreateBattleInvitation={onCreateBattleInvitation}
          onAcceptBattleInvitation={onAcceptBattleInvitation}
          onDeclineBattleInvitation={onDeclineBattleInvitation}
          onCompleteBattle={onCompleteBattle}
          currentUser={currentUser}
        />
      );
  }
});