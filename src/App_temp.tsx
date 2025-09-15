import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { HomePage } from './components/HomePage';
import { useTelegram } from './src/utils/telegram';
import { AchievementsPage } from './components/AchievementsPageFixed';
import { TasksPage } from './components/TasksPage';
import { CasesShopPage } from './components/CasesShopPage';
import { ProfilePage } from './components/ProfilePage';
import { BattlesPageExtended } from './components/BattlesPageExtended';
import { BackgroundFX } from './components/BackgroundFX';
import { SettingsModal } from './components/SettingsModal';
import { AdminPanel } from './components/AdminPanel';
import { Achievement } from './types/achievements';
import { ShopItem, Order } from './types/shop';
import { Task } from './types/tasks';
import { CaseType, UserCase } from './types/cases';
import { Notification } from './types/notifications';
import { Battle, BattleInvitation, User } from './types/battles';
import { mockShopItems, mockOrders, mockAchievements, mockTasks, mockCaseTypes, mockUserCases, mockNotifications, mockLeaderboard } from './data/mockData';
import { LeaderboardEntry } from './types/global';

// Утилитарная функция для мониторинга localStorage
const getLocalStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

// Функция для очистки localStorage при переполнении
const cleanupLocalStorage = () => {
  const keysToRemove = [
    'oldCases', 'tempCases', 'backup_cases', 'cache_', 'temp_'
  ];
  
  keysToRemove.forEach(keyPattern => {
    Object.keys(localStorage).forEach(key => {
      if (key.includes(keyPattern)) {
        localStorage.removeItem(key);
        console.log(`Удален ключ: ${key}`);
      }
    });
  });
};

export default function App() {
  // Telegram Web App integration
  const telegram = useTelegram();
  
  const [currentPage, setCurrentPage] = useState('home');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // По умолчанию тёмная тема

  
  // Глобальное состояние достижений
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  
  // Глобальное состояние товаров
  const [shopItems, setShopItems] = useState<ShopItem[]>(mockShopItems);
  
  // Глобальное состояние заказов
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  
  // Глобальное состояние задач
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  // Глобальное состояние кейсов
  const [cases, setCases] = useState<CaseType[]>([]);
  
  // Глобальное состояние пользовательских кейсов
  const [userCases, setUserCases] = useState<UserCase[]>(mockUserCases);
  
  // Глобальное состояние фото профиля
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  // Глобальное состояние персональных баттлов
  const [personalBattles, setPersonalBattles] = useState<any[]>([]);
  
  // Глобальное состояние уведомлений
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  // Глобальное состояние лидерборда
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  
  // Глобальное состояние системы баттлов
  const [battles, setBattles] = useState<Battle[]>(() => [
    {
      id: 'battle1',
      challengerId: 'user1',
      challengerName: 'Анна Иванова',
      opponentId: 'current-user',
      opponentName: 'Вы',
      stake: 150,
      status: 'completed',
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 дня назад
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // +30 минут
      winnerId: 'user1',
      winnerName: 'Анна Иванова',
      loserId: 'current-user',
      loserName: 'Вы'
    },
    {
      id: 'battle2',
      challengerId: 'current-user',
      challengerName: 'Вы',
      opponentId: 'user3',
      opponentName: 'Мария Сидорова',
      stake: 200,
      status: 'completed',
      startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 дней назад
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000), // +45 минут
      winnerId: 'current-user',
      winnerName: 'Вы',
      loserId: 'user3',
      loserName: 'Мария Сидорова'
    },
    {
      id: 'battle3',
      challengerId: 'user4',
      challengerName: 'Алексей Козлов',
      opponentId: 'user2',
      opponentName: 'Петр Петров',
      stake: 100,
      status: 'completed',
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 дней назад
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000), // +20 минут
      winnerId: 'user4',
      winnerName: 'Алексей Козлов',
      loserId: 'user2',
      loserName: 'Петр Петров'
    },
    {
      id: 'battle4',
      challengerId: 'user5',
      challengerName: 'Елена Морозова',
      opponentId: 'current-user',
      opponentName: 'Вы',
      stake: 75,
      status: 'active',
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 часа назад
    },
    {
      id: 'battle5',
      challengerId: 'user4',
      challengerName: 'Алексей Козлов',
      opponentId: 'user1',
      opponentName: 'Анна Иванова',
      stake: 300,
      status: 'active',
      startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 час назад
    },
    {
      id: 'battle6',
      challengerId: 'user2',
      challengerName: 'Петр Петров',
      opponentId: 'user3',
      opponentName: 'Мария Сидорова',
      stake: 180,
      status: 'active',
      startedAt: new Date(Date.now() - 30 * 60 * 1000) // 30 минут назад
    }
  ]);
  const [battleInvitations, setBattleInvitations] = useState<BattleInvitation[]>(() => [
    {
      id: 'invitation1',
      challengerId: 'user3',
      challengerName: 'Мария Сидорова',
      opponentId: 'current-user',
      opponentName: 'Вы',
      stake: 120,
      message: 'Вызываю на реванш!',
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 минут назад
      expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000), // истекает через 23.5 часа
      status: 'pending'
    },
    {
      id: 'invitation2',
      challengerId: 'user1',
      challengerName: 'Анна Иванова',
      opponentId: 'current-user',
      opponentName: 'Вы',
      stake: 180,
      createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 минут назад
      expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000), // истекает через 23.8 часа  
      status: 'pending'
    }
  ]);
  // Инициализация пользователей с данными из Telegram
  const initializeUsers = useMemo(() => {
    const currentUserData = {
      id: 'current-user',
      name: telegram.user ? 
        `${telegram.user.first_name}${telegram.user.last_name ? ' ' + telegram.user.last_name : ''}` : 
        'Вы',
      level: 1, // Новичок начинает с 1 уровня
      experience: 0, // Опыт начинается с 0
      maxExperience: 100, // Для достижения 2 уровня нужно 100 опыта
      rating: 0, // Новичок начинает с 0 рейтинга
      balance: 1000, // Стартовый баланс 1000 коинов
      isOnline: true,
      telegramId: telegram.user?.id || null,
      username: telegram.user?.username || null,
      avatar: telegram.user?.photo_url || null
    };

    return [
      currentUserData,
      { id: 'user1', name: 'Анна Иванова', level: 15, experience: 4500, maxExperience: 1600, rating: 1250, balance: 2500, isOnline: true },
      { id: 'user2', name: 'Петр Петров', level: 12, experience: 2800, maxExperience: 1300, rating: 980, balance: 1800, isOnline: false },
      { id: 'user3', name: 'Мария Сидорова', level: 18, experience: 6200, maxExperience: 1900, rating: 1450, balance: 3200, isOnline: true },
      { id: 'user4', name: 'Алексей Козлов', level: 14, experience: 3800, maxExperience: 1500, rating: 1120, balance: 2100, isOnline: true },
      { id: 'user5', name: 'Елена Морозова', level: 16, experience: 5100, maxExperience: 1700, rating: 1380, balance: 2800, isOnline: false }
    ];
  }, [telegram.user]);

  const [users, setUsers] = useState<User[]>(() => initializeUsers);
  
  // Флаг для отслеживания первой загрузки
  const casesInitialized = useRef(false);

  const handleNavigate = useCallback((page: string) => {
    // Предотвращаем случайные переходы при обработке секретного кода
    if (page !== 'admin') {
      // Перенаправляем старую страницу shop на cases
      if (page === 'shop') {
        setCurrentPage('cases');
      } else {
        setCurrentPage(page);
      }
    }
  }, []);

  const handleOpenSettings = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  const handleOpenAdminPanel = useCallback(() => {
    setCurrentPage('admin');
  }, []);

  const handleAdminNavigate = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  // Функции для управления уведомлениями (должны быть определены первыми)
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Функции для работы с балансом и опытом
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
        if (user.id === userId) {
          const oldLevel = user.level;
          const currentExp = user.experience || 0;
          const newExperience = Math.max(0, currentExp + amount);
          
          // Вычисляем новый уровень на основе опыта
          let calculatedLevel = 1;
          let totalExpNeeded = 0;
          
          while (totalExpNeeded <= newExperience) {
            totalExpNeeded += calculatedLevel * 100;
            if (totalExpNeeded <= newExperience) {
              calculatedLevel++;
            }
          }
          
          // Вычисляем опыт для текущего уровня и максимум для следующего
          let expForCurrentLevel = 0;
          for (let i = 1; i < calculatedLevel; i++) {
            expForCurrentLevel += i * 100;
          }
          
          const experienceInCurrentLevel = newExperience - expForCurrentLevel;
          const maxExperienceForNextLevel = calculatedLevel * 100;
          
          // Уведомление о повышении уровня
          if (calculatedLevel > oldLevel && userId === 'current-user') {
            setTimeout(() => {
              addNotification({
                type: 'achievement',
                title: '🎉 Новый уровень!',
                message: `Поздравляем! Вы достигли ${calculatedLevel} уровня. Получено: ${(calculatedLevel - oldLevel) * 100} коинов бонуса!`,
                priority: 'high',
                data: { oldLevel, newLevel: calculatedLevel, bonusCoins: (calculatedLevel - oldLevel) * 100 }
              });
            }, 100);
            
            // Начисляем бонус за новый уровень
            setTimeout(() => {
              updateUserBalance(userId, (calculatedLevel - oldLevel) * 100);
            }, 200);
          }
          
          return { 
            ...user, 
            level: calculatedLevel,
            experience: experienceInCurrentLevel,
            maxExperience: maxExperienceForNextLevel
          };
        }
        return user;
      })
    );
  }, [addNotification, updateUserBalance]);

  const getUserBalance = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.balance : 0;
  }, [users]);

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

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // АВТОМАТИЧЕСКИЕ УВЕДОМЛЕНИЯ ДЛЯ ВСЕХ СОБЫТИЙ

  // Функции отслеживания изменений для автоматических уведомлений
  const handleAchievementUnlock = useCallback((achievement: Achievement) => {
    if (achievement.unlocked) {
      addNotification({
        type: 'achievement',
        title: '🏆 Достижение разблокировано!',
        message: `Поздравляем! Вы получили достижение "${achievement.title}". ${achievement.reward ? `Награда: ${achievement.reward} коинов.` : ''}`,
        priority: 'high',
        data: { 
          achievementId: achievement.id, 
          achievementTitle: achievement.title,
          reward: achievement.reward 
        }
      });
      
      // Начисляем награду
      if (achievement.reward) {
        updateUserBalance('current-user', achievement.reward);
      }
    }
  }, [addNotification, updateUserBalance]);

  const handleNewTask = useCallback((task: Task) => {
    addNotification({
      type: 'task',
      title: '📋 Новая задача назначена!',
      message: `Вам назначена задача: "${task.title}". ${task.deadline ? `Крайний срок: ${new Date(task.deadline).toLocaleDateString()}` : 'Выполните в удобное время.'}`,
      priority: task.priority === 'high' ? 'high' : 'medium',
      data: { 
        taskId: task.id, 
        taskTitle: task.title,
        deadline: task.deadline,
        reward: task.reward
      }
    });
  }, [addNotification]);

  const handleTaskCompletion = useCallback((task: Task) => {
    if (task.completed) {
      addNotification({
        type: 'task',
        title: '✅ Задача выполнена!',
        message: `Задача "${task.title}" успешно выполнена! ${task.reward ? `Получено: ${task.reward} коинов и ${task.experience || 50} опыта.` : 'Отличная работа!'}`,
        priority: 'medium',
        data: { 
          taskId: task.id, 
          taskTitle: task.title,
          reward: task.reward,
          experience: task.experience
        }
      });
      
      // Начисляем награду
      if (task.reward) {
        updateUserBalance('current-user', task.reward);
      }
      if (task.experience) {
        updateUserExperience('current-user', task.experience);
      }
    }
  }, [addNotification, updateUserBalance, updateUserExperience]);

  const handleNewShopItem = useCallback((item: ShopItem) => {
    addNotification({
      type: 'shop',
      title: '🛍️ Новый товар в магазине!',
      message: `Добавлен новый товар: "${item.title}". ${item.sale ? `🔥 Скидка ${item.sale}%!` : `Цена: ${item.price} коинов.`}`,
      priority: item.sale ? 'high' : 'medium',
      data: { 
        itemId: item.id, 
        itemTitle: item.title,
        price: item.price,
        sale: item.sale
      }
    });
  }, [addNotification]);

  const handleShopItemSale = useCallback((item: ShopItem, oldPrice: number) => {
    if (item.sale && item.sale > 0) {
      const salePrice = item.price * (1 - item.sale / 100);
      addNotification({
        type: 'shop',
        title: '🔥 Скидка на товар!',
        message: `Скидка ${item.sale}% на "${item.title}"! Цена: ${Math.round(salePrice)} коинов (было ${oldPrice}).`,
        priority: 'high',
        data: { 
          itemId: item.id, 
          itemTitle: item.title,
          oldPrice,
          newPrice: salePrice,
          salePercent: item.sale
        }
      });
    }
  }, [addNotification]);

  const handleOrderApproval = useCallback((order: Order) => {
    if (order.status === 'approved') {
      addNotification({
        type: 'shop',
        title: '✅ Покупка одобрена!',
        message: `Ваш заказ "${order.itemTitle}" одобрен администратором. Ожидайте выполнения заказа.`,
        priority: 'medium',
        data: { 
          orderId: order.id, 
          itemTitle: order.itemTitle,
          totalPrice: order.totalPrice
        }
      });
    } else if (order.status === 'rejected') {
      addNotification({
        type: 'shop',
        title: '❌ Покупка отклонена',
        message: `Ваш заказ "${order.itemTitle}" отклонен. Средства возвращены на баланс.`,
        priority: 'medium',
        data: { 
          orderId: order.id, 
          itemTitle: order.itemTitle,
          refundAmount: order.totalPrice
        }
      });
      
      // Возвращаем деньги
      updateUserBalance('current-user', order.totalPrice);
    }
  }, [addNotification, updateUserBalance]);

  const handleNewCase = useCallback((caseItem: CaseType) => {
    addNotification({
      type: 'case',
      title: '📦 Новый кейс добавлен!',
      message: `Добавлен новый кейс: "${caseItem.name}". Цена: ${caseItem.price} коинов. Попробуйте свою удачу!`,
      priority: 'medium',
      data: { 
        caseId: caseItem.id, 
        caseName: caseItem.name,
        price: caseItem.price
      }
    });
  }, [addNotification]);

  const handleCaseOpening = useCallback((caseItem: CaseType, prize: any) => {
    addNotification({
      type: 'case',
      title: '🎁 Кейс открыт!',
      message: `Из кейса "${caseItem.name}" выпал приз: "${prize.name}"! ${prize.type === 'coins' ? `Получено: ${prize.value} коинов.` : `Редкость: ${prize.rarity}.`}`,
      priority: prize.rarity === 'legendary' ? 'high' : 'medium',
      data: { 
        caseId: caseItem.id, 
        caseName: caseItem.name,
        prizeName: prize.name,
        prizeType: prize.type,
        prizeValue: prize.value,
        rarity: prize.rarity
      }
    });
  }, [addNotification]);

  const handleAdminResponse = useCallback((message: string, type: 'approval' | 'rejection' | 'info' = 'info') => {
    addNotification({
      type: 'admin',
      title: type === 'approval' ? '✅ Ответ администратора' : type === 'rejection' ? '❌ Ответ администратора' : '💬 Сообщение от администратора',
      message: message,
      priority: type === 'approval' || type === 'rejection' ? 'high' : 'medium',
      data: { 
        responseType: type,
        timestamp: new Date()
      }
    });
  }, [addNotification]);



  // Функции для управления баттлами
  const createBattleInvitation = useCallback((invitation: Omit<BattleInvitation, 'id' | 'createdAt' | 'expiresAt' | 'status'>) => {
    // Проверяем баланс инициатора
    const challengerBalance = getUserBalance(invitation.challengerId);
    if (challengerBalance < invitation.stake) {
      addNotification({
        type: 'error',
        title: 'Недостаточно средств!',
        message: `У вас недостаточно коинов для создания баттла. Требуется: ${invitation.stake}, у вас: ${challengerBalance}`,
        priority: 'high'
      });
      return;
    }

    // Проверяем баланс оппонента  
    const opponentBalance = getUserBalance(invitation.opponentId);
    if (opponentBalance < invitation.stake) {
      addNotification({
        type: 'error',
        title: 'Невозможно создать баттл!',
        message: `У ${invitation.opponentName} недостаточно коинов для участия в баттле.`,
        priority: 'medium'
      });
      return;
    }
    
    const newInvitation: BattleInvitation = {
      ...invitation,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 часа
      status: 'pending'
    };
    
    setBattleInvitations(prev => [newInvitation, ...prev]);
    
    // Отправляем уведомление получателю
    addNotification({
      type: 'battle',
      title: 'Новый вызов на баттл!',
      message: `${invitation.challengerName} вызывает вас на баттл. Ставка: ${invitation.stake} коинов.`,
      priority: 'high',
      data: { invitationId: newInvitation.id, stake: invitation.stake }
    });

    console.log('Создано приглашение на баттл:', newInvitation);
  }, [getUserBalance, addNotification]);

  const acceptBattleInvitation = useCallback((invitationId: string) => {
    const invitation = battleInvitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    // Проверяем баланс принимающего
    const opponentBalance = getUserBalance(invitation.opponentId);
    if (opponentBalance < invitation.stake) {
      addNotification({
        type: 'error',
        title: 'Недостаточно средств!',
        message: `У вас недостаточно коинов для участия в баттле. Требуется: ${invitation.stake}, у вас: ${opponentBalance}`,
        priority: 'high'
      });
      return;
    }

    // Проверяем баланс инициатора
    const challengerBalance = getUserBalance(invitation.challengerId);
    if (challengerBalance < invitation.stake) {
      addNotification({
        type: 'error',
        title: 'Баттл отменен!',
        message: `У ${invitation.challengerName} недостаточно коинов для продолжения баттла.`,
        priority: 'medium'
      });
      
      // Отклоняем приглашение
      setBattleInvitations(prev => 
        prev.map(inv => 
          inv.id === invitationId 
            ? { ...inv, status: 'declined' as const }
            : inv
        )
      );
      return;
    }

    // Обновляем статус приглашения
    setBattleInvitations(prev => 
      prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: 'accepted' as const }
          : inv
      )
    );

    // Создаем активный баттл
    const newBattle: Battle = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      challengerId: invitation.challengerId,
      challengerName: invitation.challengerName,
      opponentId: invitation.opponentId,
      opponentName: invitation.opponentName,
      stake: invitation.stake,
      status: 'active',
      startedAt: new Date()
    };

    setBattles(prev => [newBattle, ...prev]);

    // Уведомляем инициатора
    addNotification({
      type: 'battle',
      title: 'Вызов принят!',
      message: `${invitation.opponentName} принял ваш вызов на баттл. Ставка: ${invitation.stake} коинов.`,
      priority: 'medium',
      data: { battleId: newBattle.id }
    });

    console.log('Баттл создан:', newBattle);
  }, [battleInvitations, getUserBalance, addNotification]);

  const declineBattleInvitation = useCallback((invitationId: string) => {
    const invitation = battleInvitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    setBattleInvitations(prev => 
      prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: 'declined' as const }
          : inv
      )
    );

    // Уведомляем инициатора
    addNotification({
      type: 'battle',
      title: 'Вызов отклонен',
      message: `${invitation.opponentName} отклонил ваш вызов на баттл.`,
      priority: 'low',
      data: { invitationId }
    });
  }, [battleInvitations, addNotification]);



  const completeBattle = useCallback((battleId: string, winnerId: string) => {
    const battle = battles.find(b => b.id === battleId);
    if (!battle) return;

    const winnerName = winnerId === battle.challengerId ? battle.challengerName : battle.opponentName;
    const loserName = winnerId === battle.challengerId ? battle.opponentName : battle.challengerName;
    const loserId = winnerId === battle.challengerId ? battle.opponentId : battle.challengerId;

    // Начисляем деньги победителю и списываем с проигравшего
    updateUserBalance(winnerId, battle.stake);
    updateUserBalance(loserId, -battle.stake);

    setBattles(prev => 
      prev.map(b => 
        b.id === battleId 
          ? { 
              ...b, 
              status: 'completed' as const,
              completedAt: new Date(),
              winnerId,
              winnerName,
              loserId,
              loserName
            }
          : b
      )
    );

    // Уведомляем участников о результате
    if (winnerId === 'current-user') {
      addNotification({
        type: 'battle',
        title: '🎉 Баттл выигран!',
        message: `Поздравляем! Вы победили в баттле против ${loserName}. Получено: ${battle.stake} коинов.`,
        priority: 'high',
        data: { battleId, winnerId, stake: battle.stake, result: 'victory' }
      });
    } else if (loserId === 'current-user') {
      addNotification({
        type: 'battle',
        title: '😔 Баттл проигран',
        message: `Баттл против ${winnerName} завершился поражением. Потеряно: ${battle.stake} коинов.`,
        priority: 'medium',
        data: { battleId, winnerId, stake: battle.stake, result: 'defeat' }
      });
    } else {
      addNotification({
        type: 'battle',
        title: '⚔️ Баттл завершен',
        message: `Баттл завершен! Победитель: ${winnerName}, проигравший: ${loserName}. Ставка: ${battle.stake} коинов.`,
        priority: 'low',
        data: { battleId, winnerId, stake: battle.stake, result: 'spectator' }
      });
    }

    console.log(`Баттл завершен. Победитель ${winnerName} получил ${battle.stake} коинов, проигравший ${loserName} потерял ${battle.stake} коинов.`);
  }, [battles, updateUserBalance, addNotification]);

  const handleToggleDarkMode = useCallback(() => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  }, [isDarkMode]);

  // Применяем темную тему к документу и добавляем viewport meta tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Добавляем viewport meta tag для корректного отображения на мобильных устройствах
    let viewport = document.querySelector("meta[name=viewport]");
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }, [isDarkMode]);

  // Загружаем сохранённую тему при инициализации и синхронизируем с Telegram
  useEffect(() => {
    // Если доступен Telegram Web App, используем его тему
    if (telegram.isAvailable && telegram.colorScheme) {
      const telegramTheme = telegram.colorScheme === 'dark';
      setIsDarkMode(telegramTheme);
      localStorage.setItem('theme', telegramTheme ? 'dark' : 'light');
      console.log('🎨 Тема синхронизирована с Telegram:', telegram.colorScheme);
    } else {
      // Иначе загружаем сохранённую тему
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        setIsDarkMode(false);
      } else {
        setIsDarkMode(true); // По умолчанию тёмная тема
      }
    }

    // Мониторинг размера localStorage при загрузке
    const totalSize = getLocalStorageSize();
    console.log(`Общий размер localStorage: ${(totalSize / 1024).toFixed(2)} KB`);
    
    // Если размер больше 8MB, выполняем очистку
    if (totalSize > 8 * 1024 * 1024) {
      console.warn('localStorage близок к переполнению, выполняем очистку');
      cleanupLocalStorage();
    }
  }, [telegram.isAvailable, telegram.colorScheme]);

  // Загружаем кейсы при инициализации
  useEffect(() => {
    const savedCases = localStorage.getItem('cases');
    if (savedCases) {
      try {
        const parsedCases = JSON.parse(savedCases);
        
        // Мержим сохранённые кейсы с mock данными
        // Это позволяет сохранить изменения, но восстановить изображения из mock данных
        const mergedCases = parsedCases.map((savedCase: any) => {
          const mockCase = mockCaseTypes.find(mock => mock.id === savedCase.id);
          if (mockCase) {
            return {
              ...savedCase,
              // Восстанавливаем изображение из mock данных если оно не было сохранено
              image: savedCase.image || mockCase.image,
              // Восстанавливаем изображения призов из mock данных
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
      } catch (error) {
        console.error('Ошибка при загрузке кейсов:', error);
        setCases(mockCaseTypes);
      }
    } else {
      // Если нет сохраненных кейсов, используем mock данные
      setCases(mockCaseTypes);
    }
    casesInitialized.current = true;
  }, []);

  // Сохраняем кейсы при изменении (но не при первой загрузке)
  useEffect(() => {
    if (casesInitialized.current && cases.length > 0) {
      try {
        // Создаем упрощенную версию кейсов для сохранения (без base64 изображений)
        const casesToSave = cases.map(caseItem => {
          // Если изображение - это base64, не сохраняем его
          const isBase64Image = caseItem.image && caseItem.image.startsWith('data:');
          
          return {
            ...caseItem,
            // Сохраняем изображение только если это не base64
            image: isBase64Image ? null : caseItem.image,
            // Упрощаем призы - убираем base64 изображения
            prizes: caseItem.prizes.map(prize => ({
              ...prize,
              image: prize.image && prize.image.startsWith('data:') ? null : prize.image
            }))
          };
        });

        const dataToSave = JSON.stringify(casesToSave);
        
        // Проверяем размер данных перед сохранением
        const dataSize = new Blob([dataToSave]).size;
        console.log(`Размер данных кейсов: ${(dataSize / 1024).toFixed(2)} KB`);
        
        // Если данные больше 4MB, не сохраняем
        if (dataSize > 4 * 1024 * 1024) {
          console.warn('Данные кейсов слишком большие для localStorage');
          return;
        }

        localStorage.setItem('cases', dataToSave);
      } catch (error) {
        console.error('Ошибка при сохранении кейсов:', error);
        
        // В случае ошибки QuotaExceededError пытаемся очистить старые данные
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.warn('localStorage переполнен, очищаем старые данные кейсов');
          try {
            localStorage.removeItem('cases');
            // Также можем очистить другие ненужные данные
            const keysToCheck = ['oldCases', 'tempCases', 'backup_cases'];
            keysToCheck.forEach(key => {
              if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                console.log(`Удален ключ: ${key}`);
              }
            });
          } catch (cleanupError) {
            console.error('Ошибка при очистке localStorage:', cleanupError);
          }
        }
      }
    }
  }, [cases]);

  // Загружаем и сохраняем пользовательские кейсы
  useEffect(() => {
    const savedUserCases = localStorage.getItem('userCases');
    if (savedUserCases) {
      try {
        const parsedCases = JSON.parse(savedUserCases, (key, value) => {
          // Восстанавливаем Date объекты
          if (key === 'obtainedAt') {
            return new Date(value);
          }
          return value;
        });
        setUserCases(parsedCases);
      } catch (error) {
        console.error('Ошибка при загрузке пользовательских кейсов:', error);
      }
    }
  }, []);

  // Загружаем и сохраняем персональные баттлы
  useEffect(() => {
    const savedBattles = localStorage.getItem('personalBattles');
    if (savedBattles) {
      try {
        const parsedBattles = JSON.parse(savedBattles, (key, value) => {
          // Восстанавливаем Date объекты
          if (key === 'endDate' || key === 'created') {
            return new Date(value);
          }
          return value;
        });
        setPersonalBattles(parsedBattles);
      } catch (error) {
        console.error('Ошибка при загрузке персональных баттлов:', error);
      }
    }
  }, []);

  // Сохраняем персональные баттлы при изменении
  useEffect(() => {
    if (personalBattles.length > 0 || localStorage.getItem('personalBattles')) {
      try {
        localStorage.setItem('personalBattles', JSON.stringify(personalBattles));
      } catch (error) {
        console.error('Ошибка при сохранении персональных баттлов:', error);
      }
    }
  }, [personalBattles]);

  // Загружаем уведомления при инициализации
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications, (key, value) => {
          if (key === 'timestamp') {
            return new Date(value);
          }
          return value;
        });
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error('Ошибка при загрузке уведомлений:', error);
      }
    }

    // Добавляем приветственное уведомление при первом запуске
    const hasWelcomeNotification = localStorage.getItem('hasWelcomeNotification');
    if (!hasWelcomeNotification) {
      const timeout1 = setTimeout(() => {
        const welcomeNotification: Notification = {
          id: 'welcome_' + Date.now().toString(),
          type: 'system',
          title: 'Добро пожаловать в GRITHER!',
          message: 'Здесь вы будете получать уведомления о новых задачах, достижениях, баттлах и многом другом.',
          priority: 'medium',
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [welcomeNotification, ...prev]);
        localStorage.setItem('hasWelcomeNotification', 'true');
      }, 2000);

      return () => clearTimeout(timeout1);
    }
  }, []);

  // Отдельный useEffect для периодических уведомлений
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Ежедневная мотивация (каждые 24 часа)
    const lastDailyMotivation = localStorage.getItem('lastDailyMotivation');
    const now = new Date().getTime();
    
    if (!lastDailyMotivation || now - parseInt(lastDailyMotivation) > 24 * 60 * 60 * 1000) {
      const timeout2 = setTimeout(() => {
        const motivationMessages = [
          'Время покорять новые вершины! Проверьте новые задачи и достижения.',
          'Ваши коллеги уже активны сегодня. Не отставайте!',
          'Новый день - новые возможности заработать больше коинов!',
          'Проверьте магазин - возможно, появились новые товары!',
          'Время для нового баттла? Вызовите коллег на соревнование!'
        ];
        
        const randomMessage = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
        
        addNotification({
          type: 'system',
          title: '🌟 Ежедневная мотивация',
          message: randomMessage,
          priority: 'low'
        });
        
        localStorage.setItem('lastDailyMotivation', now.toString());
      }, 30000);
      
      timeouts.push(timeout2);
    }

    // Напоминание о невыполненных задачах
    const timeout3 = setTimeout(() => {
      const incompleteTasks = tasks.filter(task => !task.completed && task.deadline);
      const urgentTasks = incompleteTasks.filter(task => {
        if (!task.deadline) return false;
        const deadline = new Date(task.deadline);
        const timeUntilDeadline = deadline.getTime() - now;
        return timeUntilDeadline > 0 && timeUntilDeadline < 24 * 60 * 60 * 1000;
      });

      if (urgentTasks.length > 0) {
        addNotification({
          type: 'task',
          title: '⏰ Срочные задачи!',
          message: `У вас ${urgentTasks.length} задач с дедлайном менее чем через 24 часа. Не забудьте их выполнить!`,
          priority: 'high',
          data: { urgentTasksCount: urgentTasks.length }
        });
      }
    }, 60000);
    
    timeouts.push(timeout3);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [addNotification, tasks]);

  // Одноразовый сброс данных пользователей для исправления уровня
  useEffect(() => {
    const hasResetUserLevel = localStorage.getItem('hasResetUserLevel');
    if (!hasResetUserLevel) {
      // Сбрасываем сохраненные данные пользователей
      localStorage.removeItem('users');
      localStorage.setItem('hasResetUserLevel', 'true');
      console.log('🔄 Сброшены данные пользователей для исправления уровня');
      
      // Принудительно устанавливаем правильные значения
      setUsers(initializeUsers);
    }
  }, [initializeUsers]);

  // Эффект для инициализации с Telegram данными
  useEffect(() => {
    if (telegram.isAvailable && telegram.user) {
      console.log('📱 Telegram Web App инициализирован:', {
        user: telegram.user,
        platform: telegram.platform,
        colorScheme: telegram.colorScheme
      });

      // Обновляем данные текущего пользователя
      setUsers(prev => prev.map(user => 
        user.id === 'current-user' ? {
          ...user,
          name: `${telegram.user!.first_name}${telegram.user!.last_name ? ' ' + telegram.user!.last_name : ''}`,
          telegramId: telegram.user!.id,
          username: telegram.user!.username || null,
          avatar: telegram.user!.photo_url || null,
          // Убеждаемся, что у новых пользователей правильные начальные значения
          level: user.level || 1,
          experience: user.experience || 0,
          maxExperience: user.maxExperience || 100
        } : user
      ));

      // Отправляем приветственное уведомление с именем пользователя
      setTimeout(() => {
        addNotification({
          type: 'system',
          title: '👋 Добро пожаловать!',
          message: `Привет, ${telegram.user!.first_name}! Добро пожаловать в GRITHER через Telegram!`,
          priority: 'medium'
        });
      }, 3000);

      // Настраиваем haptic feedback для всего приложения
      telegram.impactFeedback('light');
    } else {
      console.log('🌐 Запуск в браузере (без Telegram Web App)');
    }
  }, [telegram.isAvailable, telegram.user, telegram.platform, telegram.colorScheme, addNotification]);

  // Сохраняем уведомления при изменении
  useEffect(() => {
    if (notifications.length > 0 || localStorage.getItem('notifications')) {
      try {
        // Ограничиваем количество сохраняемых уведомлений (последние 100)
        const notificationsToSave = notifications.slice(0, 100);
        localStorage.setItem('notifications', JSON.stringify(notificationsToSave));
      } catch (error) {
        console.error('Ошибка при сохранении уведомлений:', error);
        
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          // В случае переполнения оставляем только последние 50 уведомлений
          try {
            const trimmedNotifications = notifications.slice(0, 50);
            localStorage.setItem('notifications', JSON.stringify(trimmedNotifications));
            setNotifications(trimmedNotifications);
          } catch (trimError) {
            console.error('Не удалось сохранить даже урезанные уведомления:', trimError);
            localStorage.removeItem('notifications');
          }
        }
      }
    }
  }, [notifications]);

  // Сохраняем пользовательские кейсы при изменении
  useEffect(() => {
    if (userCases.length > 0 || localStorage.getItem('userCases')) {
      try {
        const dataToSave = JSON.stringify(userCases);
        const dataSize = new Blob([dataToSave]).size;
        
        // Проверяем размер данных пользовательских кейсов
        if (dataSize > 2 * 1024 * 1024) { // 2MB лимит
          console.warn('Данные пользовательских кейсов слишком большие');
          
          // Оставляем только последние 50 кейсов
          const trimmedUserCases = userCases.slice(-50);
          localStorage.setItem('userCases', JSON.stringify(trimmedUserCases));
          
          // Обновляем состояние
          if (trimmedUserCases.length !== userCases.length) {
            setUserCases(trimmedUserCases);
          }
        } else {
          localStorage.setItem('userCases', dataToSave);
        }
      } catch (error) {
        console.error('Ошибка при сохранении пользовательских кейсов:', error);
        
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          // В случае переполнения оставляем только последние 20 кейсов
          try {
            const trimmedUserCases = userCases.slice(-20);
            localStorage.setItem('userCases', JSON.stringify(trimmedUserCases));
            setUserCases(trimmedUserCases);
            console.log('Сохранены только последние 20 пользовательских кейсов');
          } catch (trimError) {
            console.error('Не удалось сохранить даже урезанные данные:', trimError);
            localStorage.removeItem('userCases');
          }
        }
      }
    }
  }, [userCases]);

  // Загружаем и сохраняем балансы пользователей
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        // Принудительно обновляем данные текущего пользователя до правильных значений по умолчанию
        const updatedUsers = parsedUsers.map((user: any) => {
          if (user.id === 'current-user') {
            return {
              ...user,
              level: 1, // Новичок начинает с 1 уровня
              experience: 0, // Опыт начинается с 0
              maxExperience: 100, // Для достижения 2 уровня нужно 100 опыта
              rating: 0, // Новичок начинает с 0 рейтинга
              balance: 1000 // Стартовый баланс 1000 коинов
            };
          }
          return user;
        });
        setUsers(updatedUsers);
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
        // В случае ошибки инициализируем заново
        setUsers(initializeUsers);
      }
    }
  }, [initializeUsers]);

  // Сохраняем пользователей при изменении
  useEffect(() => {
    if (users.length > 0) {
      try {
        localStorage.setItem('users', JSON.stringify(users));
      } catch (error) {
        console.error('Ошибка при сохранении пользователей:', error);
      }
    }
  }, [users]);

  // ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЙ ДЛЯ АВТОМАТИЧЕСКИХ УВЕДОМЛЕНИЙ

  // Отслеживание изменений достижений
  const prevAchievements = useRef<Achievement[]>([]);
  useEffect(() => {
    if (prevAchievements.current.length > 0) {
      achievements.forEach(achievement => {
        const prevAchievement = prevAchievements.current.find(a => a.id === achievement.id);
        if (prevAchievement && !prevAchievement.unlocked && achievement.unlocked) {
          handleAchievementUnlock(achievement);
        }
      });
    }
    prevAchievements.current = [...achievements];
  }, [achievements, handleAchievementUnlock]);

  // Отслеживание изменений задач
  const prevTasks = useRef<Task[]>([]);
  useEffect(() => {
    if (prevTasks.current.length > 0) {
      // Проверяем новые задачи
      tasks.forEach(task => {
        const prevTask = prevTasks.current.find(t => t.id === task.id);
        if (!prevTask) {
          handleNewTask(task);
        } else if (!prevTask.completed && task.completed) {
          handleTaskCompletion(task);
        }
      });
    }
    prevTasks.current = [...tasks];
  }, [tasks, handleNewTask, handleTaskCompletion]);

  // Отслеживание изменений товаров в магазине
  const prevShopItems = useRef<ShopItem[]>([]);
  useEffect(() => {
    if (prevShopItems.current.length > 0) {
      shopItems.forEach(item => {
        const prevItem = prevShopItems.current.find(i => i.id === item.id);
        if (!prevItem) {
          handleNewShopItem(item);
        } else if (item.sale && (!prevItem.sale || prevItem.sale !== item.sale)) {
          handleShopItemSale(item, prevItem.price);
        }
      });
    }
    prevShopItems.current = [...shopItems];
  }, [shopItems, handleNewShopItem, handleShopItemSale]);

  // Отслеживание изменений заказов
  const prevOrders = useRef<Order[]>([]);
  useEffect(() => {
    if (prevOrders.current.length > 0) {
      orders.forEach(order => {
        const prevOrder = prevOrders.current.find(o => o.id === order.id);
        if (prevOrder && prevOrder.status !== order.status && (order.status === 'approved' || order.status === 'rejected')) {
          handleOrderApproval(order);
        }
      });
    }
    prevOrders.current = [...orders];
  }, [orders, handleOrderApproval]);

  // Отслеживание изменений кейсов
  const prevCases = useRef<CaseType[]>([]);
  useEffect(() => {
    if (prevCases.current.length > 0) {
      cases.forEach(caseItem => {
        const prevCase = prevCases.current.find(c => c.id === caseItem.id);
        if (!prevCase) {
          handleNewCase(caseItem);
        }
      });
    }
    prevCases.current = [...cases];
  }, [cases, handleNewCase]);

  // Отслеживание открытия кейсов
  const prevUserCases = useRef<UserCase[]>([]);
  useEffect(() => {
    if (prevUserCases.current.length > 0) {
      userCases.forEach(userCase => {
        const prevUserCase = prevUserCases.current.find(uc => uc.id === userCase.id);
        if (!prevUserCase) {
          // Найдем соответствующий кейс и приз
          const caseItem = cases.find(c => c.id === userCase.caseId);
          if (caseItem && userCase.prize) {
            handleCaseOpening(caseItem, userCase.prize);
          }
        }
      });
    }
    prevUserCases.current = [...userCases];
  }, [userCases, cases, handleCaseOpening]);

  // Секретная комбинация для админ панели
  useEffect(() => {
    let sequence = '';
    const secretCode = 'admin';
    let isProcessingSecret = false;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      // Предотвращаем обработку если уже обрабатываем секретный код
      if (isProcessingSecret) return;
      
      sequence += e.key.toLowerCase();
      if (sequence.length > secretCode.length) {
        sequence = sequence.slice(-secretCode.length);
      }
      if (sequence === secretCode) {
        isProcessingSecret = true;
        setCurrentPage('admin');
        sequence = '';
        // Сбрасываем флаг через небольшое время
        const timeout = setTimeout(() => {
          isProcessingSecret = false;
        }, 1000);
        
        return () => clearTimeout(timeout);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'achievements':
        return <AchievementsPage 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          achievements={achievements}
          setAchievements={setAchievements}
          profilePhoto={profilePhoto}
          theme={isDarkMode ? 'dark' : 'light'}
          notifications={notifications}
          onMarkNotificationAsRead={markNotificationAsRead}
          onMarkAllNotificationsAsRead={markAllNotificationsAsRead}
          onRemoveNotification={removeNotification}
          onClearAllNotifications={clearAllNotifications}
          addNotification={addNotification}
        />;
      case 'tasks':
        return <TasksPage 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          profilePhoto={profilePhoto}
          tasks={tasks}
          setTasks={setTasks}
          theme={isDarkMode ? 'dark' : 'light'}
          addNotification={addNotification}
        />;
      case 'cases':
        return <CasesShopPage 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          profilePhoto={profilePhoto}
          theme={isDarkMode ? 'dark' : 'light'}
          cases={cases}
          setCases={setCases}
          userCases={userCases}
          setUserCases={setUserCases}
          shopItems={shopItems}
          setShopItems={setShopItems}
          orders={orders}
          setOrders={setOrders}
          currentUser={users.find(u => u.id === 'current-user')}
          onUpdateUserBalance={updateUserBalance}
          onUpdateUserExperience={updateUserExperience}
          addNotification={addNotification}
        />;
      case 'profile':
        return <ProfilePage 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          profilePhoto={profilePhoto}
          setProfilePhoto={setProfilePhoto}
          theme={isDarkMode ? 'dark' : 'light'}
          battles={battles}
          battleInvitations={battleInvitations}
          personalBattles={personalBattles}
          users={users}
          currentUser={users.find(u => u.id === 'current-user')}
        />;
      case 'battles':
        return <BattlesPageExtended 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          profilePhoto={profilePhoto}
          personalBattles={personalBattles}
          setPersonalBattles={setPersonalBattles}
          theme={isDarkMode ? 'dark' : 'light'}
          notifications={notifications}
          onMarkNotificationAsRead={markNotificationAsRead}
          onMarkAllNotificationsAsRead={markAllNotificationsAsRead}
          onRemoveNotification={removeNotification}
          onClearAllNotifications={clearAllNotifications}
          addNotification={addNotification}
        />;

      case 'admin':
        return <AdminPanel 
          onNavigate={handleAdminNavigate}
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
          onCompleteBattle={completeBattle}
          users={users}
          onUpdateUserBalance={updateUserBalance}
          addNotification={addNotification}
        />;
      case 'home':
      default:
        return <HomePage 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          achievements={achievements}
          profilePhoto={profilePhoto}
          personalBattles={personalBattles}
          setPersonalBattles={setPersonalBattles}
          theme={isDarkMode ? 'dark' : 'light'}
          notifications={notifications}
          onMarkNotificationAsRead={markNotificationAsRead}
          onMarkAllNotificationsAsRead={markAllNotificationsAsRead}
          onRemoveNotification={removeNotification}
          onClearAllNotifications={clearAllNotifications}
          addNotification={addNotification}
          battles={battles}
          battleInvitations={battleInvitations}
          users={users}
          leaderboard={leaderboard}
          onCreateBattleInvitation={createBattleInvitation}
          onAcceptBattleInvitation={acceptBattleInvitation}
          onDeclineBattleInvitation={declineBattleInvitation}
          onCompleteBattle={completeBattle}
          currentUser={users.find(u => u.id === 'current-user')}
        />;
    }
  };

  return (
    <>
      {/* BackgroundFX - самый нижний слой для светлой темы */}
      <BackgroundFX 
        variant="spotlight+grain+vignette" 
        theme={isDarkMode ? 'dark' : 'light'}
      />
      
      {/* Основное содержимое страниц - выше BackgroundFX */}
      <div 
        className="page-content"
        style={{ 
          position: 'relative', 
          zIndex: 10,
          minHeight: '100vh'
        }}
      >
        {renderCurrentPage()}
      </div>
      
      {/* Модальные окна - самый верхний слой */}
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenAdminPanel={handleOpenAdminPanel}
        theme={isDarkMode ? 'dark' : 'light'}
      />
    </>
  );
}