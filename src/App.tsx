import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { SettingsModal } from './components/SettingsModalFixed';
import { BottomNavigation } from './components/BottomNavigation';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { TimeoutErrorBoundary } from './components/TimeoutErrorBoundary';
import { PageRenderer } from './components/PageRenderer';
import { useAppState } from './hooks/useAppState';
import { useBattleActions } from './hooks/useBattleActions';


// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="glass-card max-w-md w-full text-center p-6">
      <div className="animate-pulse unified-text">Загрузка данных...</div>
    </div>
  </div>
);

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Используем custom hooks для управления состоянием
  const appState = useAppState();
  
  // Извлекаем нужные значения из состояния с мемоизацией
  const {
    currentPage,
    setCurrentPage,
    settingsOpen,
    setSettingsOpen,
    isDarkMode,
    setIsDarkMode,
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
    profilePhoto,
    setProfilePhoto,
    personalBattles,
    setPersonalBattles,
    leaderboard,
    battles,
    setBattles,
    battleInvitations,
    setBattleInvitations,
    users,
    updateUserBalance,
    updateUserExperience,
    getUserBalance,
    addNotification,
    telegram
  } = appState;

  // Мемоизированный currentUser
  const currentUser = useMemo(() => {
    return users?.find(u => u.id === 'current-user');
  }, [users]);

  // Используем battle actions hook с мемоизацией параметров
  const battleActionsParams = useMemo(() => ({
    battles,
    setBattles,
    battleInvitations,
    setBattleInvitations,
    getUserBalance,
    updateUserBalance
  }), [battles, setBattles, battleInvitations, setBattleInvitations, getUserBalance, updateUserBalance]);

  const battleActionsHook = useBattleActions(battleActionsParams);

  // Обработчики навигации
  const handleNavigate = useCallback((page: string) => {
    try {
      if (page !== 'admin') {
        if (page === 'shop') {
          setCurrentPage('cases');
        } else {
          setCurrentPage(page);
        }
      }
    } catch (error) {
      console.error('Error navigating to page:', page, error);
    }
  }, [setCurrentPage]);

  const handleOpenSettings = useCallback(() => {
    setSettingsOpen(true);
  }, [setSettingsOpen]);

  const handleOpenAdminPanel = useCallback(() => {
    setCurrentPage('admin');
  }, [setCurrentPage]);

  const handleToggleDarkMode = useCallback(() => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error toggling dark mode:', error);
    }
  }, [isDarkMode, setIsDarkMode]);

  // Применяем темную тему к документу
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Добавляем viewport meta tag
    let viewport = document.querySelector("meta[name=viewport]");
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }, [isDarkMode]);

  // Инициализация приложения
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Инициализация с Telegram данными
        if (telegram?.isAvailable && telegram?.user) {
          console.log('📱 Telegram Web App инициализирован');
          if (telegram.impactFeedback) {
            telegram.impactFeedback('light');
          }
        }
        
        // Задержка для предотвращения слишком быстрой загрузки
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
        setIsInitialized(true); // Все равно показываем приложение
      }
    };

    // Добавляем проверку наличия telegram объекта
    if (telegram) {
      initializeApp();
    } else {
      // Если telegram недоступен, инициализируем через короткое время
      setTimeout(() => setIsInitialized(true), 200);
    }
  }, [telegram?.isAvailable, telegram?.user]);

  // Секретная комбинация для админ панели
  useEffect(() => {
    let sequence = '';
    const secretCode = 'admin';
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.length > 1 && e.key !== 'Enter') return;
      
      sequence += e.key.toLowerCase();
      if (sequence.length > secretCode.length) {
        sequence = sequence.slice(-secretCode.length);
      }
      
      if (sequence === secretCode) {
        setCurrentPage('admin');
        sequence = '';
      }
    };

    document.addEventListener('keypress', handleKeyPress, { passive: true });
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [setCurrentPage]);

  // Проверяем загрузку данных
  if (!isInitialized || !users || users.length === 0) {
    return <LoadingScreen />;
  }

  // Дополнительная проверка для предотвращения ошибок
  if (!currentUser) {
    console.warn('Current user not found, reinitializing...');
    return <LoadingScreen />;
  }

  return (
    <TimeoutErrorBoundary>
      <AppErrorBoundary>
        {/* Простой однотонный фон для всех страниц */}
      <div 
        className="background-fx"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: isDarkMode ? '#0B0D10' : '#FFFFFF',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      
      {/* Основное содержимое страниц */}
      <div 
        className="page-content"
        style={{ 
          position: 'relative', 
          zIndex: 10,
          minHeight: '100vh'
        }}
      >
        <Suspense fallback={<LoadingScreen />}>
          <PageRenderer
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onOpenSettings={handleOpenSettings}
            profilePhoto={profilePhoto}
            theme={isDarkMode ? 'dark' : 'light'}
            achievements={achievements}
            setAchievements={setAchievements}
            tasks={tasks}
            setTasks={setTasks}
            cases={cases}
            setCases={setCases}
            userCases={userCases}
            setUserCases={setUserCases}
            shopItems={shopItems}
            setShopItems={setShopItems}
            orders={orders}
            setOrders={setOrders}
            battles={battles}
            setBattles={setBattles}
            battleInvitations={battleInvitations}
            setBattleInvitations={setBattleInvitations}
            personalBattles={personalBattles}
            setPersonalBattles={setPersonalBattles}
            leaderboard={leaderboard}
            users={users}
            currentUser={currentUser}
            setProfilePhoto={setProfilePhoto}
            onUpdateUserBalance={updateUserBalance}
            onUpdateUserExperience={updateUserExperience}
            onCreateBattleInvitation={battleActionsHook.createBattleInvitation}
            onAcceptBattleInvitation={battleActionsHook.acceptBattleInvitation}
            onDeclineBattleInvitation={battleActionsHook.declineBattleInvitation}
            onCompleteBattle={battleActionsHook.completeBattle}
            addNotification={addNotification}
            handleToggleDarkMode={handleToggleDarkMode}
          />
        </Suspense>
      </div>
      
      {/* Настройки */}
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenAdminPanel={handleOpenAdminPanel}
        theme={isDarkMode ? 'dark' : 'light'}
      />
      
      {/* Нижняя навигация */}
      {currentPage !== 'admin' && (
        <BottomNavigation 
          onNavigate={handleNavigate}
          currentPage={currentPage}
          theme={isDarkMode ? 'dark' : 'light'}
        />
      )}
      </AppErrorBoundary>
    </TimeoutErrorBoundary>
  );
}