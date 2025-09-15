import { Achievement } from '../types/achievements';
import { ShopItem, Order } from '../types/shop';
import { Task } from '../types/tasks';
import { CaseType, UserCase, CaseShopItem, Prize } from '../types/cases';
import { User as BattleUser } from '../types/battles';

import { LeaderboardEntry, User } from '../types/global';

// Расширенные мок-данные для достижений
export const mockAchievements: Achievement[] = [
  // Общие достижения
  {
    id: 'ach1',
    title: 'Первые шаги',
    description: 'Выполните первую задачу',
    icon: 'star',
    category: 'general',
    rarity: 'common',
    requirements: {
      type: 'tasks_completed',
      target: 1,
      current: 0
    },
    reward: {
      type: 'coins',
      amount: 100
    },
    status: 'available',
    isActive: true,
    conditions: ['Выполнить любую задачу']
  },
  {
    id: 'ach2',
    title: 'Новичок',
    description: 'Достигните 2 уровня',
    icon: 'trophy',
    category: 'level',
    rarity: 'common',
    requirements: {
      type: 'level_reached',
      target: 2,
      current: 1
    },
    reward: {
      type: 'coins',
      amount: 200
    },
    status: 'in_progress',
    isActive: true,
    conditions: ['Набрать достаточно опыта для 2 уровня']
  },
  {
    id: 'ach3',
    title: 'Трудолюбивый',
    description: 'Выполните 10 задач',
    icon: 'award',
    category: 'tasks',
    rarity: 'rare',
    requirements: {
      type: 'tasks_completed',
      target: 10,
      current: 3
    },
    reward: {
      type: 'experience',
      amount: 500
    },
    status: 'in_progress',
    isActive: true,
    conditions: ['Выполнить 10 задач любой сложности']
  },
  {
    id: 'ach4',
    title: 'Боец',
    description: 'Выиграйте первый баттл',
    icon: 'medal',
    category: 'battles',
    rarity: 'rare',
    requirements: {
      type: 'battles_won',
      target: 1,
      current: 0
    },
    reward: {
      type: 'coins',
      amount: 300
    },
    status: 'available',
    isActive: true,
    conditions: ['Выиграть любой баттл']
  },
  {
    id: 'ach5',
    title: 'Коллекционер',
    description: 'Откройте 5 кейсов',
    icon: 'trophy',
    category: 'cases',
    rarity: 'rare',
    requirements: {
      type: 'cases_opened',
      target: 5,
      current: 1
    },
    reward: {
      type: 'coins',
      amount: 750
    },
    status: 'in_progress',
    isActive: true,
    conditions: ['Открыть 5 кейсов любого типа']
  },
  // Эпические достижения
  {
    id: 'ach6',
    title: 'Мастер',
    description: 'Достигните 10 уровня',
    icon: 'star',
    category: 'level',
    rarity: 'epic',
    requirements: {
      type: 'level_reached',
      target: 10,
      current: 1
    },
    reward: {
      type: 'coins',
      amount: 1000
    },
    status: 'locked',
    isActive: true,
    conditions: ['Набрать достаточно опыта для 10 уровня']
  },
  {
    id: 'ach7',
    title: 'Воин',
    description: 'Выиграйте 10 баттлов',
    icon: 'award',
    category: 'battles',
    rarity: 'epic',
    requirements: {
      type: 'battles_won',
      target: 10,
      current: 0
    },
    reward: {
      type: 'experience',
      amount: 1500
    },
    status: 'locked',
    isActive: true,
    conditions: ['Выиграть 10 баттлов подряд или в общем']
  },
  {
    id: 'ach8',
    title: 'Трудоголик',
    description: 'Выполните 50 задач',
    icon: 'medal',
    category: 'tasks',
    rarity: 'epic',
    requirements: {
      type: 'tasks_completed',
      target: 50,
      current: 3
    },
    reward: {
      type: 'coins',
      amount: 2000
    },
    status: 'locked',
    isActive: true,
    conditions: ['Выполнить 50 задач любой сложности']
  },
  // Легендарные достижения
  {
    id: 'ach9',
    title: 'Легенда',
    description: 'Достигните 20 уровня',
    icon: 'trophy',
    category: 'level',
    rarity: 'legendary',
    requirements: {
      type: 'level_reached',
      target: 20,
      current: 1
    },
    reward: {
      type: 'coins',
      amount: 5000
    },
    status: 'locked',
    isActive: true,
    conditions: ['Достичь максимального мастерства']
  },
  {
    id: 'ach10',
    title: 'Чемпион',
    description: 'Выиграйте 25 баттлов',
    icon: 'star',
    category: 'battles',
    rarity: 'legendary',
    requirements: {
      type: 'battles_won',
      target: 25,
      current: 0
    },
    reward: {
      type: 'experience',
      amount: 3000
    },
    status: 'locked',
    isActive: true,
    conditions: ['Стать непобедимым чемпионом арены']
  }
];

// Расширенные мок-данные для товаров в магазине
export const mockShopItems: ShopItem[] = [
  // Бонусы и усиления
  {
    id: 'shop1',
    name: 'Бонус опыта 2x',
    price: 500,
    description: 'Удваивает получаемый опыт на 24 часа',
    category: 'bonus',
    isActive: true,
    stock: 50,
    emoji: '⚡'
  },
  {
    id: 'shop2',
    name: 'Тройной опыт',
    price: 1200,
    description: 'Утраивает получаемый опыт на 12 часов',
    category: 'bonus',
    isActive: true,
    stock: 25,
    emoji: '🔥'
  },
  {
    id: 'shop3',
    name: 'Монетный дождь',
    price: 800,
    description: 'Увеличивает получение монет на 150% на 24 часа',
    category: 'bonus',
    isActive: true,
    stock: 30,
    emoji: '💰'
  },
  {
    id: 'shop4',
    name: 'Удача новичка',
    price: 600,
    description: 'Повышает шанс выпадения редких предметов из кейсов на 24 часа',
    category: 'bonus',
    isActive: true,
    stock: 20,
    emoji: '🍀'
  },
  
  // Статусы и привилегии
  {
    id: 'shop5',
    name: 'VIP статус',
    price: 2000,
    description: 'Расширенные привилегии на месяц: +50% к опыту, доступ к эксклюзивным кейсам',
    category: 'privilege',
    isActive: true,
    stock: 10,
    emoji: '👑'
  },
  {
    id: 'shop6',
    name: 'Premium статус',
    price: 5000,
    description: 'Максимальные привилегии на месяц: +100% к опыту, +50% к монетам, приоритет в баттлах',
    category: 'privilege',
    isActive: true,
    stock: 5,
    emoji: '💎'
  },
  
  // Косметические предметы
  {
    id: 'shop7',
    name: 'Золотой аватар',
    price: 1500,
    description: 'Эксклюзивная золотая рамка для аватара',
    category: 'cosmetic',
    isActive: true,
    stock: 15,
    emoji: '🏆'
  },
  {
    id: 'shop8',
    name: 'Неоновая подсветка',
    price: 1000,
    description: 'Яркая неоновая подсветка профиля',
    category: 'cosmetic',
    isActive: true,
    stock: 25,
    emoji: '🌈'
  },
  {
    id: 'shop9',
    name: 'Титул "Мастер"',
    price: 3000,
    description: 'Престижный титул, отображаемый рядом с именем',
    category: 'cosmetic',
    isActive: true,
    stock: 8,
    emoji: '🎖️'
  },
  
  // Утилиты
  {
    id: 'shop10',
    name: 'Ключ от кейса',
    price: 200,
    description: 'Открывает любой кейс без затрат монет',
    category: 'utility',
    isActive: true,
    stock: 100,
    emoji: '🔑'
  },
  {
    id: 'shop11',
    name: 'Магнит монет',
    price: 300,
    description: 'Автоматически собирает монеты в течение 6 часов',
    category: 'utility',
    isActive: true,
    stock: 40,
    emoji: '🧲'
  },
  {
    id: 'shop12',
    name: 'Щит защиты',
    price: 1800,
    description: 'Защищает от потери монет в проигранных баттлах на 48 часов',
    category: 'utility',
    isActive: true,
    stock: 12,
    emoji: '🛡️'
  }
];

// Мок-данные для заказов
export const mockOrders: Order[] = [
  {
    id: 'order1',
    userId: 'current_user',
    items: [
      {
        id: 'shop1',
        name: 'Бонус опыта 2x',
        price: 500,
        quantity: 1,
        emoji: '⚡'
      }
    ],
    total: 500,
    status: 'completed',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 часа назад
    customerName: 'Тестовый пользователь'
  },
  {
    id: 'order2',
    userId: 'current_user',
    items: [
      {
        id: 'shop10',
        name: 'Ключ от кейса',
        price: 200,
        quantity: 3,
        emoji: '🔑'
      }
    ],
    total: 600,
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 день назад
    customerName: 'Тестовый пользователь'
  },
  {
    id: 'order3',
    userId: 'current_user',
    items: [
      {
        id: 'shop3',
        name: 'Монетный дождь',
        price: 800,
        quantity: 1,
        emoji: '💰'
      }
    ],
    total: 800,
    status: 'pending',
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 минут назад
    customerName: 'Тестовый пользователь'
  },
  {
    id: 'order4',
    userId: '1',
    items: [
      {
        id: 'shop5',
        name: 'VIP статус',
        price: 2000,
        quantity: 1,
        emoji: '👑'
      }
    ],
    total: 2000,
    status: 'completed',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 дня назад
    customerName: 'Анна Иванова',
    customerTeam: 'Команда 1'
  },
  {
    id: 'order5',
    userId: '2',
    items: [
      {
        id: 'shop6',
        name: 'Premium статус',
        price: 5000,
        quantity: 1,
        emoji: '💎'
      }
    ],
    total: 5000,
    status: 'completed',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 дня назад
    customerName: 'Петр Петров',
    customerTeam: 'Команда 2'
  }
];

// Расширенные мок-данные для задач
export const mockTasks: Task[] = [
  // Индивидуальные задачи
  {
    id: 'task1',
    title: 'Создать новый компонент',
    description: 'Разработать переиспользуемый компонент для интерфейса пользователя. Компонент должен быть адаптивным и следовать принципам дизайн-системы.',
    reward: 300,
    rewardType: 'coins',
    deadline: '2024-01-25T18:00:00Z',
    category: 'individual',
    status: 'active',
    priority: 'medium',
    assignedTo: 'current_user',
    createdBy: 'admin',
    createdAt: '2024-01-20T09:00:00Z',
    isPublished: true,
    tags: ['фронтенд', 'react', 'компоненты']
  },
  {
    id: 'task2',
    title: 'Оптимизация производительности',
    description: 'Провести анализ и оптимизацию производительности главной страницы приложения',
    reward: 500,
    rewardType: 'coins',
    deadline: '2024-01-30T20:00:00Z',
    category: 'individual',
    status: 'active',
    priority: 'high',
    assignedTo: 'current_user',
    createdBy: 'admin',
    createdAt: '2024-01-22T10:30:00Z',
    isPublished: true,
    tags: ['оптимизация', 'производительность', 'анализ']
  },
  {
    id: 'task3',
    title: 'Написать документацию',
    description: 'Создать подробную документацию для нового API модуля',
    reward: 200,
    rewardType: 'experience',
    deadline: '2024-01-28T16:00:00Z',
    category: 'individual',
    status: 'active',
    priority: 'low',
    assignedTo: 'current_user',
    createdBy: 'admin',
    createdAt: '2024-01-21T14:15:00Z',
    isPublished: true,
    tags: ['документация', 'API', 'техписание']
  },
  {
    id: 'task4',
    title: 'Исправить баги в форме',
    description: 'Устранить проблемы с валидацией в форме регистрации пользователей',
    reward: 250,
    rewardType: 'coins',
    deadline: '2024-01-26T12:00:00Z',
    category: 'individual',
    status: 'completed',
    priority: 'high',
    assignedTo: 'current_user',
    createdBy: 'admin',
    createdAt: '2024-01-19T11:20:00Z',
    completedAt: '2024-01-24T15:30:00Z',
    isPublished: true,
    tags: ['багфикс', 'валидация', 'формы']
  },
  
  // Командные задачи
  {
    id: 'task5',
    title: 'Разработка нового модуля',
    description: 'Совместная разработка модуля аналитики для административной панели',
    reward: 800,
    rewardType: 'coins',
    deadline: '2024-02-05T18:00:00Z',
    category: 'team',
    status: 'active',
    priority: 'high',
    assignedTo: 'team',
    createdBy: 'admin',
    createdAt: '2024-01-23T09:00:00Z',
    isPublished: true,
    tags: ['команда', 'аналитика', 'модуль']
  },
  {
    id: 'task6',
    title: 'Код-ревью недели',
    description: 'Провести комплексное ревью кода для всех новых компонентов',
    reward: 400,
    rewardType: 'experience',
    deadline: '2024-01-29T17:00:00Z',
    category: 'team',
    status: 'active',
    priority: 'medium',
    assignedTo: 'team',
    createdBy: 'admin',
    createdAt: '2024-01-22T16:45:00Z',
    isPublished: true,
    tags: ['код-ревью', 'качество', 'команда']
  },
  
  // Ежедневные задачи
  {
    id: 'task7',
    title: 'Проверка системы мониторинга',
    description: 'Ежедневная проверка работоспособности системы мониторинга и логов',
    reward: 100,
    rewardType: 'coins',
    deadline: '2024-01-25T09:00:00Z',
    category: 'daily',
    status: 'active',
    priority: 'medium',
    assignedTo: 'current_user',
    createdBy: 'system',
    createdAt: '2024-01-24T06:00:00Z',
    isPublished: true,
    tags: ['мониторинг', 'ежедневно', 'система']
  },
  {
    id: 'task8',
    title: 'Обновление зависимостей',
    description: 'Проверить и обновить устаревшие npm зависимости проекта',
    reward: 150,
    rewardType: 'experience',
    deadline: '2024-01-27T14:00:00Z',
    category: 'daily',
    status: 'active',
    priority: 'low',
    assignedTo: 'current_user',
    createdBy: 'system',
    createdAt: '2024-01-24T08:30:00Z',
    isPublished: true,
    tags: ['обновления', 'зависимости', 'npm']
  },
  
  // Еженедельные задачи
  {
    id: 'task9',
    title: 'Встреча команды',
    description: 'Еженедельная встреча для обсуждения прогресса и планирования',
    reward: 200,
    rewardType: 'experience',
    deadline: '2024-01-26T15:00:00Z',
    category: 'weekly',
    status: 'active',
    priority: 'medium',
    assignedTo: 'team',
    createdBy: 'admin',
    createdAt: '2024-01-22T12:00:00Z',
    isPublished: true,
    tags: ['встреча', 'планирование', 'команда']
  },
  {
    id: 'task10',
    title: 'Отчет по производительности',
    description: 'Составить еженедельный отчет по производительности приложения',
    reward: 300,
    rewardType: 'coins',
    deadline: '2024-01-28T18:00:00Z',
    category: 'weekly',
    status: 'active',
    priority: 'medium',
    assignedTo: 'current_user',
    createdBy: 'admin',
    createdAt: '2024-01-21T10:15:00Z',
    isPublished: true,
    tags: ['отчет', 'производительность', 'еженедельно']
  }
];

// Мок-данные для призов
export const mockPrizes: Prize[] = [
  // Базовые призы
  { id: 'prize1', name: '50 монет', image: '🪙', rarity: 'common', color: '#94A3B8', value: 50, dropChance: 40, description: 'Небольшое количество монет', type: 'coins' },
  { id: 'prize2', name: '100 опыта', image: '⭐', rarity: 'common', color: '#94A3B8', value: 100, dropChance: 30, description: 'Немного опыта для прогресса', type: 'experience' },
  { id: 'prize3', name: 'Базовый усилитель', image: '🔋', rarity: 'common', color: '#94A3B8', value: 75, dropChance: 20, description: 'Простой усилитель характеристик', type: 'item' },
  
  // Редкие призы
  { id: 'prize4', name: '200 монет', image: '💰', rarity: 'rare', color: '#3B82F6', value: 200, dropChance: 25, description: 'Хорошее количество монет', type: 'coins' },
  { id: 'prize5', name: '300 опыта', image: '✨', rarity: 'rare', color: '#3B82F6', value: 300, dropChance: 20, description: 'Заметное количество опыта', type: 'experience' },
  { id: 'prize6', name: 'Редкий артефакт', image: '🔮', rarity: 'rare', color: '#3B82F6', value: 250, dropChance: 15, description: 'Ценный арт��факт с особыми свойствами', type: 'item' },
  
  // Эпические призы
  { id: 'prize7', name: '500 монет', image: '💎', rarity: 'epic', color: '#8B5CF6', value: 500, dropChance: 15, description: 'Внушительная сумма монет', type: 'coins' },
  { id: 'prize8', name: '750 опыта', image: '🌟', rarity: 'epic', color: '#8B5CF6', value: 750, dropChance: 10, description: 'Большое количество опыта', type: 'experience' },
  { id: 'prize9', name: 'Эпический амулет', image: '🏺', rarity: 'epic', color: '#8B5CF6', value: 600, dropChance: 8, description: 'Мощный амулет с уникальными способностями', type: 'item' },
  
  // Легендарные призы
  { id: 'prize10', name: '1000 монет', image: '👑', rarity: 'legendary', color: '#F59E0B', value: 1000, dropChance: 4, description: 'Огромная сумма монет', type: 'coins' },
  { id: 'prize11', name: '1500 опыта', image: '💫', rarity: 'legendary', color: '#F59E0B', value: 1500, dropChance: 3, description: 'Колоссальное количество опыта', type: 'experience' },
  { id: 'prize12', name: 'Легендарное оружие', image: '⚔️', rarity: 'legendary', color: '#F59E0B', value: 1200, dropChance: 2, description: 'Легендарное оружие невероятной силы', type: 'item' },
  
  // Мифические призы
  { id: 'prize13', name: '2500 монет', image: '🏆', rarity: 'mythic', color: '#EF4444', value: 2500, dropChance: 0.8, description: 'Мифическое богатство', type: 'coins' },
  { id: 'prize14', name: '3000 опыта', image: '🔥', rarity: 'mythic', color: '#EF4444', value: 3000, dropChance: 0.5, description: 'Божественное количество опыта', type: 'experience' },
  { id: 'prize15', name: 'Мифический артефакт', image: '🗿', rarity: 'mythic', color: '#EF4444', value: 2000, dropChance: 0.2, description: 'Артефакт древних богов', type: 'item' }
];

// Создаем кейсы без circular reference
const createCaseTypes = (): CaseType[] => {
  const commonPrizes = mockPrizes.filter(p => p.rarity === 'common');
  const rarePrizes = mockPrizes.filter(p => p.rarity === 'common' || p.rarity === 'rare');
  const epicPrizes = mockPrizes.filter(p => p.rarity === 'rare' || p.rarity === 'epic');
  const legendaryPrizes = mockPrizes.filter(p => p.rarity === 'epic' || p.rarity === 'legendary');
  const mythicPrizes = mockPrizes.filter(p => p.rarity === 'legendary' || p.rarity === 'mythic');

  return [
    {
      id: 'case1',
      name: 'CLASSIC',
      image: 'https://images.unsplash.com/photo-1662348317573-594daeff9ce1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwYmxhY2slMjB0ZWNoJTIwY2FzZSUyMGJveHxlbnwxfHx8fDE3NTcwNzcxNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rarity: 'common',
      color: '#FF4444',
      description: 'Обычный кейс с базовыми предметами',
      contents: ['Монеты x100', 'Опыт x50', 'Базовый предмет'],
      prizes: commonPrizes,
      isActive: true,
      glowColor: '#FF4444',
      glowIntensity: 'low'
    },
    {
      id: 'case2',
      name: 'PRO',
      image: 'https://images.unsplash.com/photo-1546728684-0c649e299b0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMG5lb24lMjBjeWJlcnB1bmslMjB0ZWNoJTIwY2FzZXxlbnwxfHx8fDE3NTcwNzcxNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rarity: 'rare',
      color: '#00FF44',
      description: 'Редкий кейс с ценными предметами',
      contents: ['Монеты x300', 'Опыт x150', 'Редкий предмет'],
      prizes: rarePrizes,
      isActive: true,
      glowColor: '#00FF44',
      glowIntensity: 'medium'
    },
    {
      id: 'case3',
      name: 'ULTRA',
      image: 'https://images.unsplash.com/photo-1754302003140-8aae275f1a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwZ2xvd2luZyUyMHRlY2glMjBjb250YWluZXIlMjBjYXNlfGVufDF8fHx8MTc1NzA3NzE3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rarity: 'epic',
      color: '#4488FF',
      description: 'Эпический кейс с мощными предметами',
      contents: ['Монеты x500', 'Опыт x300', 'Эпический предмет'],
      prizes: epicPrizes,
      isActive: true,
      glowColor: '#4488FF',
      glowIntensity: 'high'
    },
    {
      id: 'case4',
      name: 'LEGEND',
      image: 'https://images.unsplash.com/photo-1664849328797-d94d3831a793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBsdXh1cnklMjB0ZWNoJTIwY29udGFpbmVyJTIwY2FzZXxlbnwxfHx8fDE3NTcwODA0NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rarity: 'legendary',
      color: '#F59E0B',
      description: 'Легендарный кейс с уникальными предметами',
      contents: ['Монеты x1000', 'Опыт x500', 'Легендарный предмет'],
      prizes: legendaryPrizes,
      isActive: true,
      glowColor: '#F59E0B',
      glowIntensity: 'high'
    },
    {
      id: 'case5',
      name: 'MYTHIC',
      image: 'https://images.unsplash.com/photo-1609323170129-bf4d7d4d7dbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBnbG93aW5nJTIwZnV0dXJpc3RpYyUyMHRlY2glMjBjYXNlfGVufDF8fHx8MTc1NzA4MDQ3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rarity: 'mythic',
      color: '#EF4444',
      description: 'Мифический кейс с самыми редкими предметами',
      contents: ['Монеты x2000', 'Опыт x1000', 'Мифический предмет'],
      prizes: mythicPrizes,
      isActive: true,
      glowColor: '#EF4444',
      glowIntensity: 'high'
    }
  ];
};

// Мок-данные для типов кейсов
export const mockCaseTypes: CaseType[] = createCaseTypes();

// Мок-данные для пользовательских кейсов
export const mockUserCases: UserCase[] = [
  {
    id: 'user_case1',
    userId: 'current_user',
    caseTypeId: 'case1',
    caseName: 'CLASSIC',
    prizeWon: {
      id: 'prize1',
      name: '50 монет',
      image: '🪙',
      rarity: 'common',
      color: '#94A3B8',
      value: 50,
      dropChance: 40,
      description: 'Небольшое количество монет',
      type: 'coins'
    },
    obtainedAt: new Date(Date.now() - 3600000), // 1 час назад
    openedAt: new Date(Date.now() - 3500000)
  },
  {
    id: 'user_case2',
    userId: 'current_user',
    caseTypeId: 'case2',
    caseName: 'PRO',
    prizeWon: {
      id: 'prize4',
      name: '200 монет',
      image: '💰',
      rarity: 'rare',
      color: '#3B82F6',
      value: 200,
      dropChance: 25,
      description: 'Хорошее количество монет',
      type: 'coins'
    },
    obtainedAt: new Date(Date.now() - 86400000), // 1 день назад
    openedAt: new Date(Date.now() - 86300000)
  },
  {
    id: 'user_case3',
    userId: 'current_user',
    caseTypeId: 'case1',
    caseName: 'CLASSIC',
    prizeWon: {
      id: 'prize2',
      name: '100 опыта',
      image: '⭐',
      rarity: 'common',
      color: '#94A3B8',
      value: 100,
      dropChance: 30,
      description: 'Немного опыта для прогресса',
      type: 'experience'
    },
    obtainedAt: new Date(Date.now() - 172800000), // 2 дня назад
    openedAt: new Date(Date.now() - 172700000)
  },
  {
    id: 'user_case4',
    userId: 'current_user',
    caseTypeId: 'case3',
    caseName: 'ULTRA',
    prizeWon: {
      id: 'prize7',
      name: '500 монет',
      image: '💎',
      rarity: 'epic',
      color: '#8B5CF6',
      value: 500,
      dropChance: 15,
      description: 'Внушительная сумма монет',
      type: 'coins'
    },
    obtainedAt: new Date(Date.now() - 259200000), // 3 дня назад
    openedAt: new Date(Date.now() - 259100000)
  },
  {
    id: 'user_case5',
    userId: 'current_user',
    caseTypeId: 'case1',
    caseName: 'CLASSIC',
    prizeWon: {
      id: 'prize3',
      name: 'Базовый усилитель',
      image: '🔋',
      rarity: 'common',
      color: '#94A3B8',
      value: 75,
      dropChance: 20,
      description: 'Простой усилитель характеристик',
      type: 'item'
    },
    obtainedAt: new Date(Date.now() - 432000000), // 5 дней назад
    openedAt: new Date(Date.now() - 431900000)
  }
];

// Мок-данные для магазина кейсов
export const mockCaseShopItems: CaseShopItem[] = [
  {
    id: 'shop_case1',
    caseTypeId: 'case1',
    price: 5000,
    currency: 'coins',
    isAvailable: true
  },
  {
    id: 'shop_case2',
    caseTypeId: 'case2',
    price: 12000,
    currency: 'coins',
    isAvailable: true
  },
  {
    id: 'shop_case3',
    caseTypeId: 'case3',
    price: 25000,
    currency: 'coins',
    isAvailable: true
  },
  {
    id: 'shop_case4',
    caseTypeId: 'case4',
    price: 50000,
    currency: 'coins',
    isAvailable: true
  },
  {
    id: 'shop_case5',
    caseTypeId: 'case5',
    price: 100000,
    currency: 'coins',
    isAvailable: true
  }
];



// Расширенные mock данные для пользователей
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Анна Иванова',
    username: '@anna_ivanova',
    avatar: '',
    role: 'worker',
    level: 15,
    experience: 2250,
    maxExperience: 3000,
    balance: 8500,
    rating: 1250,
    completedTasks: 45,
    achievementsCount: 32,
    battlesWon: 12,
    battlesLost: 3,
    teamId: 'team1',
    isOnline: true,
    lastSeen: new Date(),
    joinedDate: new Date('2023-06-15')
  },
  {
    id: '2',
    name: 'Петр Петров',
    username: '@petr_petrov',
    avatar: '',
    role: 'teamlead',
    level: 18,
    experience: 1800,
    maxExperience: 4000,
    balance: 12000,
    rating: 1450,
    completedTasks: 62,
    achievementsCount: 45,
    battlesWon: 18,
    battlesLost: 4,
    teamId: 'team2',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1800000), // 30 минут назад
    joinedDate: new Date('2023-03-20')
  },
  {
    id: '3',
    name: 'Мария Сидорова',
    username: '@maria_sidorova',
    avatar: '',
    role: 'worker',
    level: 12,
    experience: 1200,
    maxExperience: 2500,
    balance: 5600,
    rating: 980,
    completedTasks: 28,
    achievementsCount: 23,
    battlesWon: 7,
    battlesLost: 5,
    teamId: 'team1',
    isOnline: true,
    lastSeen: new Date(),
    joinedDate: new Date('2023-08-10')
  },
  {
    id: '4',
    name: 'Алексей Козлов',
    username: '@alexey_kozlov',
    avatar: '',
    role: 'worker',
    level: 14,
    experience: 2100,
    maxExperience: 2800,
    balance: 7300,
    rating: 1120,
    completedTasks: 38,
    achievementsCount: 29,
    battlesWon: 10,
    battlesLost: 6,
    teamId: 'team3',
    isOnline: true,
    lastSeen: new Date(),
    joinedDate: new Date('2023-05-05')
  },
  {
    id: '5',
    name: 'Елена Морозова',
    username: '@elena_morozova',
    avatar: '',
    role: 'junior_admin',
    level: 16,
    experience: 2400,
    maxExperience: 3200,
    balance: 9800,
    rating: 1380,
    completedTasks: 51,
    achievementsCount: 38,
    battlesWon: 15,
    battlesLost: 2,
    teamId: 'team2',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000), // 1 час назад
    joinedDate: new Date('2023-01-12')
  },
  // Дополнительные пользователи
  {
    id: '6',
    name: 'Сергей Волков',
    username: '@sergey_volkov',
    avatar: '',
    role: 'senior_admin',
    level: 22,
    experience: 3200,
    maxExperience: 4500,
    balance: 25000,
    rating: 1850,
    completedTasks: 125,
    achievementsCount: 78,
    battlesWon: 45,
    battlesLost: 5,
    teamId: 'team1',
    isOnline: true,
    lastSeen: new Date(),
    joinedDate: new Date('2022-11-08')
  },
  {
    id: '7',
    name: 'Ольга Смирнова',
    username: '@olga_smirnova',
    avatar: '',
    role: 'worker',
    level: 8,
    experience: 450,
    maxExperience: 1200,
    balance: 2800,
    rating: 650,
    completedTasks: 15,
    achievementsCount: 12,
    battlesWon: 3,
    battlesLost: 4,
    teamId: 'team3',
    isOnline: true,
    lastSeen: new Date(),
    joinedDate: new Date('2023-12-01')
  },
  {
    id: '8',
    name: 'Дмитрий Кузнецов',
    username: '@dmitry_kuznetsov',
    avatar: '',
    role: 'teamlead',
    level: 19,
    experience: 2900,
    maxExperience: 3800,
    balance: 15500,
    rating: 1520,
    completedTasks: 89,
    achievementsCount: 56,
    battlesWon: 28,
    battlesLost: 7,
    teamId: 'team3',
    isOnline: false,
    lastSeen: new Date(Date.now() - 7200000), // 2 часа назад
    joinedDate: new Date('2023-02-14')
  },
  {
    id: '9',
    name: 'Татьяна Лебедева',
    username: '@tatyana_lebedeva',
    avatar: '',
    role: 'worker',
    level: 11,
    experience: 890,
    maxExperience: 1800,
    balance: 4200,
    rating: 820,
    completedTasks: 22,
    achievementsCount: 18,
    battlesWon: 5,
    battlesLost: 3,
    teamId: 'team2',
    isOnline: true,
    lastSeen: new Date(),
    joinedDate: new Date('2023-09-20')
  },
  {
    id: '10',
    name: 'Игорь Соколов',
    username: '@igor_sokolov',
    avatar: '',
    role: 'junior_admin',
    level: 17,
    experience: 2100,
    maxExperience: 3400,
    balance: 11200,
    rating: 1320,
    completedTasks: 67,
    achievementsCount: 42,
    battlesWon: 22,
    battlesLost: 8,
    teamId: 'team1',
    isOnline: false,
    lastSeen: new Date(Date.now() - 5400000), // 1.5 часа назад
    joinedDate: new Date('2023-04-03')
  },
  {
    id: '11',
    name: 'Наталья Федорова',
    username: '@natalya_fedorova',
    avatar: '',
    role: 'worker',
    level: 6,
    experience: 250,
    maxExperience: 900,
    balance: 1500,
    rating: 420,
    completedTasks: 8,
    achievementsCount: 6,
    battlesWon: 1,
    battlesLost: 2,
    teamId: 'team2',
    isOnline: true,
    lastSeen: new Date(),
    joinedDate: new Date('2024-01-10')
  },
  {
    id: '12',
    name: 'Максим Григорьев',
    username: '@maxim_grigoriev',
    avatar: '',
    role: 'worker',
    level: 13,
    experience: 1650,
    maxExperience: 2600,
    balance: 6800,
    rating: 1050,
    completedTasks: 34,
    achievementsCount: 26,
    battlesWon: 9,
    battlesLost: 4,
    teamId: 'team3',
    isOnline: true,
    lastSeen: new Date(),
    joinedDate: new Date('2023-07-22')
  }
];

// Mock данные для лидерборда
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: mockUsers.find(u => u.id === '6')!, // Сергей Волков (senior_admin)
    change: 2, // поднялся на 2 позиции
    score: mockUsers.find(u => u.id === '6')?.rating || 0
  },
  {
    rank: 2,
    user: mockUsers.find(u => u.id === '8')!, // Дмитрий Кузнецов (teamlead)
    change: 1, // поднялся на 1 позицию
    score: mockUsers.find(u => u.id === '8')?.rating || 0
  },
  {
    rank: 3,
    user: mockUsers.find(u => u.id === '2')!, // Петр Петров (teamlead)
    change: -2, // опустился на 2 позиции
    score: mockUsers.find(u => u.id === '2')?.rating || 0
  },
  {
    rank: 4,
    user: mockUsers.find(u => u.id === '5')!, // Елена Морозова (junior_admin)
    change: -1, // опустился на 1 позицию
    score: mockUsers.find(u => u.id === '5')?.rating || 0
  },
  {
    rank: 5,
    user: mockUsers.find(u => u.id === '10')!, // Игорь Соколов (junior_admin)
    change: 3, // поднялся на 3 позиции
    score: mockUsers.find(u => u.id === '10')?.rating || 0
  },
  {
    rank: 6,
    user: mockUsers.find(u => u.id === '1')!, // Анна Иванова (worker)
    change: -2, // опустился на 2 позиции
    score: mockUsers.find(u => u.id === '1')?.rating || 0
  },
  {
    rank: 7,
    user: mockUsers.find(u => u.id === '4')!, // Алексей Козлов (worker)
    change: 0, // без изменений
    score: mockUsers.find(u => u.id === '4')?.rating || 0
  },
  {
    rank: 8,
    user: mockUsers.find(u => u.id === '12')!, // Максим Григорьев (worker)
    change: 1, // поднялся на 1 позицию
    score: mockUsers.find(u => u.id === '12')?.rating || 0
  },
  {
    rank: 9,
    user: mockUsers.find(u => u.id === '3')!, // Мария Сидорова (worker)
    change: -1, // опустился на 1 позицию
    score: mockUsers.find(u => u.id === '3')?.rating || 0
  },
  {
    rank: 10,
    user: mockUsers.find(u => u.id === '9')!, // Татьяна Лебедева (worker)
    change: 0, // без изменений
    score: mockUsers.find(u => u.id === '9')?.rating || 0
  }
];