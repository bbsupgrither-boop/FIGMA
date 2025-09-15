import { useState, useEffect } from 'react';
import { ArrowLeft, Shield, X, Home, Users, Zap, Trophy, CheckSquare, ShoppingBag, Gamepad2, Box } from './Icons';
import { Button } from './ui/button';
import { AdminNavigation } from './AdminNavigation';
import { AdminDashboard } from './AdminDashboard';
import { AdminAchievements } from './AdminAchievements_fixed_full';
import { AdminTasksFixed } from './AdminTasksFixed';
import { AdminShop } from './AdminShop';
import { AdminShopCasesPage } from './AdminShopCasesPage';
import { ShopModerationPage } from './ShopModerationPage';
import { WorkersManagement } from './WorkersManagement';
import { BattlesManagement } from './BattlesManagement';
import { AchievementsModeration } from './AchievementsModeration';
import { Achievement } from '../types/achievements';
import { ShopItem, Order } from '../types/shop';
import { Task } from '../types/tasks';
import { CaseType, UserCase } from '../types/cases';
import { Battle, BattleInvitation } from '../types/battles';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  shopItems: ShopItem[];
  setShopItems: (items: ShopItem[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  cases: CaseType[];
  setCases: (cases: CaseType[]) => void;
  userCases: UserCase[];
  setUserCases: (userCases: UserCase[]) => void;
  battles: Battle[];
  setBattles: (battles: Battle[]) => void;
  battleInvitations: BattleInvitation[];
  setBattleInvitations: (invitations: BattleInvitation[]) => void;
  onCompleteBattle: (battleId: string, winnerId: string) => void;
  onToggleDarkMode?: () => void;
  users?: import('../types/battles').User[];
  onUpdateUserBalance?: (userId: string, amount: number) => void;
  addNotification?: (notification: { type: string; title: string; message: string; priority: string; data?: any }) => void;
}

// Система ролей и пользователей (такая же как в SettingsModal)
const ADMIN_USERS = [
  // Главные админы
  { telegramId: '123456789', username: 'ivan_petrov', role: 'главный_админ' },
  { telegramId: '987654321', username: 'maria_sidorova', role: 'главный_админ' },
  
  // Старшие админы
  { telegramId: '111222333', username: 'alexey_kozlov', role: 'старший_админ' },
  { telegramId: '444555666', username: 'elena_morozova', role: 'старший_админ' },
  { telegramId: '1609556178', username: 'admin_senior', role: 'старший_админ' },
  
  // Младшие админы
  { telegramId: '777888999', username: 'dmitry_volkov', role: 'младший_админ' },
  { telegramId: '000111222', username: 'anna_lebedeva', role: 'младший_админ' },
  
  // Тимлиды
  { telegramId: '333444555', username: 'sergey_orlov', role: 'тимлид', teamNumber: 1 },
  { telegramId: '666777888', username: 'olga_sokolova', role: 'тимлид', teamNumber: 2 },
  { telegramId: '999000111', username: 'mikhail_rybakov', role: 'тимлид', teamNumber: 3 },
];

// Секретные коды для ролей
const SECRET_CODES = {
  'df1GE%LwVAAC': 'главный_админ',
  '0caFyNh}w%': 'старший_админ',
  '~3SogEhz': 'младший_админ',
  'SToU{~': 'тимлид'
};

export function AdminPanel({ 
  onNavigate, 
  achievements, 
  setAchievements, 
  shopItems, 
  setShopItems, 
  orders, 
  setOrders, 
  tasks, 
  setTasks, 
  cases, 
  setCases, 
  userCases, 
  setUserCases, 
  battles,
  setBattles,
  battleInvitations,
  setBattleInvitations,
  onCompleteBattle,
  onToggleDarkMode,
  users = [],
  onUpdateUserBalance,
  addNotification
}: AdminPanelProps) {
  const [currentAdminPage, setCurrentAdminPage] = useState('dashboard');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем данные для входа в админ панель
    try {
      const adminLoginData = localStorage.getItem('adminLoginData');
      if (adminLoginData) {
        const { telegramId, accessCode } = JSON.parse(adminLoginData);
        const role = SECRET_CODES[accessCode];
        if (role) {
          const user = ADMIN_USERS.find(u => 
            u.telegramId === telegramId && u.role === role
          );
          if (user) {
            setUserRole(user.role);
            setUserName(user.username);
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных админ панели:', error);
    }
  }, []);

  const handleAdminNavigate = (page: string) => {
    // Перенаправляем cases на shop (объединенную страницу)
    if (page === 'cases') {
      setCurrentAdminPage('shop');
    } else {
      setCurrentAdminPage(page);
    }
  };

  const handleBackToMain = () => {
    onNavigate('home');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'главный_админ': return 'Главный админ';
      case 'старший_админ': return 'Старший админ';
      case 'младший_админ': return 'Младший админ';
      case 'тимлид': return 'Тимлид';
      default: return role;
    }
  };

  const renderCurrentAdminPage = () => {
    switch (currentAdminPage) {
      case 'achievements':
        return <AdminAchievements 
          achievements={achievements} 
          setAchievements={setAchievements}
        />;
      case 'achievements-moderation':
        return <AchievementsModeration 
        />;
      case 'tasks':
        return <AdminTasksFixed 
          currentAdminPage={currentAdminPage}
          tasks={tasks}
          setTasks={setTasks}
        />;
      case 'shop':
        return <AdminShopCasesPage 
          onBack={() => setCurrentAdminPage('dashboard')}
          shopItems={shopItems}
          setShopItems={setShopItems}
          orders={orders}
          setOrders={setOrders}
          cases={cases}
          setCases={setCases}
          userCases={userCases}
          setUserCases={setUserCases}
          onUpdateUserBalance={onUpdateUserBalance}
        />;
      case 'workers':
        return <WorkersManagement 
          onBack={() => setCurrentAdminPage('dashboard')} 
          onNavigateToSection={(section) => setCurrentAdminPage(section)}
        />;
      case 'battles':
        return <BattlesManagement 
          battles={battles}
          setBattles={setBattles}
          battleInvitations={battleInvitations}
          setBattleInvitations={setBattleInvitations}
          onCompleteBattle={onCompleteBattle}
          currentUserBalance={users.find(u => u.id === 'current-user')?.balance || 0}
          addNotification={addNotification}
          users={users}
        />;

      case 'dashboard':
      default:
        return <AdminDashboard 
          onClose={handleBackToMain} 
          onToggleDarkMode={onToggleDarkMode}
          onNavigateToWorkers={() => setCurrentAdminPage('workers')}
          onNavigateToAchievementsModeration={() => setCurrentAdminPage('achievements-moderation')}
          onNavigateToGames={() => setCurrentAdminPage('games')}
          onNavigateToCases={() => setCurrentAdminPage('cases')}
          onNavigateToBattles={() => setCurrentAdminPage('battles')}
        />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header админ панели - не fixed, остается вверху контейнера */}
        <div className="relative z-50">
          <div className="flex items-center justify-between p-4 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield 
                  className="w-6 h-6 text-primary cursor-pointer transition-transform hover:scale-110" 
                  onDoubleClick={onToggleDarkMode}
                  title="Двойной клик для смены темы"
                />
              </div>
              <div>
                <h1 className="text-lg font-medium text-foreground">Панель управления</h1>
                <p className="text-sm text-muted-foreground">{getRoleDisplayName(userRole || '')}</p>
              </div>
            </div>
            <button
              onClick={handleBackToMain}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground/70" />
            </button>
          </div>
        </div>
        
        {/* Основной контент */}
        <div className="pb-72">
          {renderCurrentAdminPage()}
        </div>
        
        {/* Постоянная навигационная панель внизу */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <AdminNavigation 
            currentAdminPage={currentAdminPage}
            onNavigate={handleAdminNavigate}
          />
        </div>
      </div>
    </>
  );
}