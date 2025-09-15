import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Achievement } from '../types/achievements';
import { ShopItem, Order } from '../types/shop';
import { Task } from '../types/tasks';
import { CaseType, UserCase } from '../types/cases';
import { Notification } from '../types/notifications';
import { Battle, BattleInvitation } from '../types/battles';
import { User as BattleUser } from '../types/battles';
import { LeaderboardEntry } from '../types/global';
import { useTelegram } from '../src/utils/telegram';
import { mockShopItems, mockOrders, mockAchievements, mockTasks, mockCaseTypes, mockUserCases, mockLeaderboard } from '../data/mockData';
import { mockBattleUsers } from '../data/mockBattleUsers';

// Безопасная функция для работы с localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Ошибка при чтении localStorage[${key}]:`, error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Ошибка при записи localStorage[${key}]:`, error);
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Ошибка при удалении localStorage[${key}]:`, error);
      return false;
    }
  }
};

export function useAppState() {
  const telegram = useTelegram();
  
  // Состояния приложения
  const [currentPage, setCurrentPage] = useState('home');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Данные приложения
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [shopItems, setShopItems] = useState<ShopItem[]>(mockShopItems);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [cases, setCases] = useState<CaseType[]>([]);
  const [userCases, setUserCases] = useState<UserCase[]>(mockUserCases);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [personalBattles, setPersonalBattles] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  
  // Уведомления
  const [notifications, setNotifications] = useState<Notification[]>(() => [
    {
      id: 'notif1',
      type: 'achievement',
      title: 'Новое достижение!',
      message: 'Вы получили достижение "Первые шаги" за выполнение первой задачи. Награда: 100 монет',
      read: false,
      timestamp: new Date(Date.now() - 1800000),
      actionUrl: '/achievements'
    },
    {
      id: 'notif2',
      type: 'battle',
      title: 'Приглашение на баттл',
      message: 'Сергей Волков вызывает вас на баттл! Ставка: 600 монет',
      read: false,
      timestamp: new Date(Date.now() - 300000),
      actionUrl: '/battles'
    },
    {
      id: 'notif3',
      type: 'task',
      title: 'Новая задача назначена',
      message: 'Вам назначена новая задача "Оптимизация производительности" с высоким приоритетом',
      read: false,
      timestamp: new Date(Date.now() - 3600000),
      actionUrl: '/tasks'
    }
  ]);
  
  // Баттлы
  const [battles, setBattles] = useState<Battle[]>(() => [
    {
      id: 'battle1',
      challengerId: '1',
      challengerName: 'Анна Иванова',
      opponentId: 'current-user',
      opponentName: 'Вы',
      stake: 150,
      status: 'completed',
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      winnerId: '1',
      winnerName: 'Анна Иванова',
      loserId: 'current-user',
      loserName: 'Вы'
    },
    {
      id: 'battle2',
      challengerId: 'current-user',
      challengerName: 'Вы',
      opponentId: '3',
      opponentName: 'Мария Сидорова',
      stake: 200,
      status: 'completed',
      startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
      winnerId: 'current-user',
      winnerName: 'Вы',
      loserId: '3',
      loserName: 'Мария Сидорова'
    },
    {
      id: 'battle3',
      challengerId: '2',
      challengerName: 'Петр Петров',
      opponentId: '4',
      opponentName: 'Алексей Козлов',
      stake: 300,
      status: 'active',
      startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'battle4',
      challengerId: '5',
      challengerName: 'Елена Морозова',
      opponentId: '6',
      opponentName: 'Дмитрий Волков',
      stake: 500,
      status: 'completed',
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      winnerId: '6',
      winnerName: 'Дмитрий Волков',
      loserId: '5',
      loserName: 'Елена Морозова'
    },
    {
      id: 'battle5',
      challengerId: '3',
      challengerName: 'Мария Сидорова',
      opponentId: '2',
      opponentName: 'Петр Петров',
      stake: 250,
      status: 'completed',
      startedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
      winnerId: '2',
      winnerName: 'Петр Петров',
      loserId: '3',
      loserName: 'Мария Сидорова'
    }
  ]);
  
  const [battleInvitations, setBattleInvitations] = useState<BattleInvitation[]>(() => [
    {
      id: 'invitation1',
      challengerId: '3',
      challengerName: 'Мария Сидорова',
      opponentId: 'current-user',
      opponentName: 'Вы',
      stake: 120,
      message: 'Вызываю на реванш!',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000),
      status: 'pending'
    }
  ]);

  // Пользователи
  const initializeUsers = useMemo(() => {
    const currentUserData: BattleUser = {
      id: 'current-user',
      name: telegram.user ? 
        `${telegram.user.first_name}${telegram.user.last_name ? ' ' + telegram.user.last_name : ''}` : 
        'Вы',
      level: 1,
      experience: 0,
      maxExperience: 100,
      rating: 0,
      balance: 1000,
      isOnline: true,
      telegramId: telegram.user?.id || null,
      username: telegram.user?.username || null,
      avatar: telegram.user?.photo_url || null
    };

    return [currentUserData, ...mockBattleUsers] as BattleUser[];
  }, [telegram.user]);

  const [users, setUsers] = useState<BattleUser[]>(() => initializeUsers);
  
  // Флаг для отслеживания инициализации
  const casesInitialized = useRef(false);

  // Функции уведомлений
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);
  
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);
  
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);
  
  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Функции работы с пользователями
  const updateUserBalance = useCallback((userId: string, amount: number) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, balance: Math.max(0, user.balance + amount) }
          : user
      )
    );
  }, []);

  const updateUserExperience = useCallback((userId: string, amount: number) => {
    setUsers(prev => 
      prev.map(user => {
        if (user.id !== userId) return user;
        
        const oldLevel = user.level;
        const currentExp = user.experience || 0;
        const newExperience = Math.max(0, currentExp + amount);
        
        // Оптимизированный расчет уровня
        let calculatedLevel = 1;
        let totalExpNeeded = 0;
        
        // Ограничиваем количество итераций
        const maxIterations = 100;
        let iterations = 0;
        
        while (totalExpNeeded <= newExperience && iterations < maxIterations) {
          totalExpNeeded += calculatedLevel * 100;
          if (totalExpNeeded <= newExperience) {
            calculatedLevel++;
          }
          iterations++;
        }
        
        let expForCurrentLevel = 0;
        for (let i = 1; i < calculatedLevel; i++) {
          expForCurrentLevel += i * 100;
        }
        
        const experienceInCurrentLevel = newExperience - expForCurrentLevel;
        const maxExperienceForNextLevel = calculatedLevel * 100;
        
        // Асинхронная награда за уровень
        if (calculatedLevel > oldLevel && userId === 'current-user') {
          const levelDiff = calculatedLevel - oldLevel;
          const bonusCoins = levelDiff * 100;
          
          // Используем requestAnimationFrame вместо setTimeout
          requestAnimationFrame(() => {
            setUsers(prevUsers => 
              prevUsers.map(u => 
                u.id === userId 
                  ? { ...u, balance: Math.max(0, u.balance + bonusCoins) }
                  : u
              )
            );
          });
        }
        
        return { 
          ...user, 
          level: calculatedLevel,
          experience: experienceInCurrentLevel,
          maxExperience: maxExperienceForNextLevel
        };
      })
    );
  }, []);

  const getUserBalance = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.balance : 0;
  }, [users]);

  // Инициализация темы
  useEffect(() => {
    if (telegram.isAvailable && telegram.colorScheme) {
      const telegramTheme = telegram.colorScheme === 'dark';
      setIsDarkMode(telegramTheme);
      safeLocalStorage.setItem('theme', telegramTheme ? 'dark' : 'light');
    } else {
      const savedTheme = safeLocalStorage.getItem('theme');
      if (savedTheme === 'light') {
        setIsDarkMode(false);
      } else {
        setIsDarkMode(true);
      }
    }
  }, [telegram.isAvailable, telegram.colorScheme]);

  // Инициализация кейсов с оптимизацией
  useEffect(() => {
    if (casesInitialized.current) return;
    
    const initializeCases = async () => {
      try {
        const savedCases = safeLocalStorage.getItem('cases');
        if (savedCases) {
          const parsedCases = JSON.parse(savedCases);
          const mergedCases = parsedCases.map((savedCase: any) => {
            const mockCase = mockCaseTypes.find(mock => mock.id === savedCase.id);
            if (mockCase) {
              return {
                ...savedCase,
                image: savedCase.image || mockCase.image,
                prizes: savedCase.prizes.map((savedPrize: any) => {
                  const mockPrize = mockCase.prizes.find(mp => mp.id === savedPrize.id);
                  return {
                    ...savedPrize,
                    image: savedPrize.image || (mockPrize ? mockPrize.image : savedPrize.image)
                  };
                })
              };
            }
            return savedCase;
          });
          
          setCases(mergedCases);
        } else {
          setCases(mockCaseTypes);
        }
      } catch (error) {
        console.error('Ошибка при загрузке кейсов:', error);
        setCases(mockCaseTypes);
      } finally {
        casesInitialized.current = true;
      }
    };

    // Добавляем небольшую задержку для предотвращения блокировки
    setTimeout(initializeCases, 0);
  }, []);

  return {
    // Состояния
    currentPage,
    setCurrentPage,
    settingsOpen,
    setSettingsOpen,
    isDarkMode,
    setIsDarkMode,
    
    // Данные
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
    setLeaderboard,
    notifications,
    setNotifications,
    battles,
    setBattles,
    battleInvitations,
    setBattleInvitations,
    users,
    setUsers,
    
    // Вычисляемые значения
    unreadNotificationsCount,
    
    // Функции
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    updateUserBalance,
    updateUserExperience,
    getUserBalance,
    
    // Telegram
    telegram
  };
}