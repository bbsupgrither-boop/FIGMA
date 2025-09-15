import { useState, useEffect } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { Target, CheckCircle, Clock, AlertTriangle, Coins, Star, Calendar, Timer, User, Search } from './Icons';
import { Task } from '../types/tasks';
import { mockAppState } from '../data/mockData';

interface TasksPageStyledProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings?: () => void;
  profilePhoto?: string | null;
  tasks: any[];
  setTasks: (tasks: any[]) => void;
}

export function TasksPageStyled({ 
  onNavigate, 
  currentPage, 
  onOpenSettings, 
  profilePhoto, 
  tasks: globalTasks, 
  setTasks: setGlobalTasks 
}: TasksPageStyledProps) {
  const { currentUser } = mockAppState;
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'review' | 'overdue'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const tabs = [
    { id: 'active' as const, label: 'Активные', icon: Target },
    { id: 'review' as const, label: 'На проверке', icon: Clock },
    { id: 'completed' as const, label: 'Выполненные', icon: CheckCircle },
    { id: 'overdue' as const, label: 'Просроченные', icon: AlertTriangle }
  ];

  // Преобразуем задачи из глобального состояния
  const convertGlobalTasksToTasks = (globalTasks: any[]) => {
    return globalTasks
      .filter(task => task.isPublished)
      .map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        reward: task.reward,
        rewardType: task.rewardType,
        deadline: task.deadline,
        createdAt: task.createdAt,
        status: task.status,
        priority: task.priority || 'medium',
        assignedTo: currentUser.name,
        completedAt: task.completedAt,
        category: task.category || 'general'
      }));
  };

  const convertedTasks = convertGlobalTasksToTasks(globalTasks);

  // Обновляем время каждую секунду для таймера
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Проверяем просроченные задачи
  const isTaskOverdue = (deadline: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    return currentTime > deadlineDate && activeTab === 'active';
  };

  // Получаем время до дедлайна
  const getTimeRemaining = (deadline: string) => {
    if (!deadline) return 'Б��з дедлайна';
    
    const deadlineDate = new Date(deadline);
    const difference = deadlineDate.getTime() - currentTime.getTime();

    if (difference <= 0) return 'Просрочено';

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);

    if (days > 0) return `${days}д ${hours}ч`;
    if (hours > 0) return `${hours}ч ${minutes}м`;
    return `${minutes}м`;
  };

  // Фильтрация задач
  const getFilteredTasks = () => {
    let filtered = convertedTasks;

    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по табам
    switch (activeTab) {
      case 'active':
        return filtered.filter(task => task.status === 'active' && !isTaskOverdue(task.deadline));
      case 'review':
        return filtered.filter(task => task.status === 'review');
      case 'completed':
        return filtered.filter(task => task.status === 'completed');
      case 'overdue':
        return filtered.filter(task => task.status === 'active' && isTaskOverdue(task.deadline));
      default:
        return filtered;
    }
  };

  const filteredTasks = getFilteredTasks();
  const activeCount = convertedTasks.filter(task => task.status === 'active' && !isTaskOverdue(task.deadline)).length;
  const reviewCount = convertedTasks.filter(task => task.status === 'review').length;
  const completedCount = convertedTasks.filter(task => task.status === 'completed').length;
  const overdueCount = convertedTasks.filter(task => task.status === 'active' && isTaskOverdue(task.deadline)).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleTaskAction = (task: any, action: 'start' | 'complete' | 'review') => {
    const updatedTasks = globalTasks.map(t => {
      if (t.id === task.id) {
        switch (action) {
          case 'start':
            return { ...t, status: 'active' };
          case 'review':
            return { ...t, status: 'review' };
          case 'complete':
            return { ...t, status: 'completed', completedAt: new Date().toISOString() };
          default:
            return t;
        }
      }
      return t;
    });
    setGlobalTasks(updatedTasks);
  };

  const renderTaskCard = (task: any) => (
    <div key={task.id} className="glass-card rounded-2xl p-4 apple-shadow">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          task.status === 'completed' 
            ? 'bg-gradient-to-br from-green-400 to-green-600' 
            : task.status === 'review'
            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
            : isTaskOverdue(task.deadline)
            ? 'bg-gradient-to-br from-red-400 to-red-600'
            : 'bg-gradient-to-br from-blue-400 to-blue-600'
        }`}>
          {task.status === 'completed' ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : task.status === 'review' ? (
            <Clock className="w-6 h-6 text-white" />
          ) : isTaskOverdue(task.deadline) ? (
            <AlertTriangle className="w-6 h-6 text-white" />
          ) : (
            <Target className="w-6 h-6 text-white" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-medium text-foreground">{task.title}</div>
              <div className="text-sm text-muted-foreground">{task.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority === 'high' ? 'Высокий' : 
                 task.priority === 'medium' ? 'Средний' : 'Низкий'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Coins className="w-3 h-3" />
                <span>{task.reward} {task.rewardType === 'coins' ? 'монет' : 'XP'}</span>
              </div>
              {task.deadline && (
                <div className={`flex items-center gap-1 ${
                  isTaskOverdue(task.deadline) ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  <Timer className="w-3 h-3" />
                  <span>{getTimeRemaining(task.deadline)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span>{task.assignedTo}</span>
            </div>
            
            <div className="flex gap-2">
              {task.status === 'active' && !isTaskOverdue(task.deadline) && (
                <button
                  onClick={() => handleTaskAction(task, 'review')}
                  className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs hover:scale-[0.98] transition-transform"
                >
                  Выполнить
                </button>
              )}
              {task.status === 'review' && (
                <div className="bg-yellow-100 text-yellow-600 px-3 py-1.5 rounded-lg text-xs">
                  На проверке
                </div>
              )}
              {task.status === 'completed' && (
                <div className="bg-green-100 text-green-600 px-3 py-1.5 rounded-lg text-xs">
                  Выполнено
                </div>
              )}
              {isTaskOverdue(task.deadline) && task.status === 'active' && (
                <div className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs">
                  Просрочено
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Задачи" 
        onOpenSettings={onOpenSettings} 
        profilePhoto={profilePhoto}
        user={currentUser}
      />
      
      <div className="pt-20 pb-20 p-6">
        {/* Статистика */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="glass-card p-3 rounded-2xl apple-shadow text-center">
            <div className="text-xl font-medium text-blue-600 mb-1">
              {activeCount}
            </div>
            <div className="text-xs text-muted-foreground">
              Активные
            </div>
          </div>
          <div className="glass-card p-3 rounded-2xl apple-shadow text-center">
            <div className="text-xl font-medium text-yellow-600 mb-1">
              {reviewCount}
            </div>
            <div className="text-xs text-muted-foreground">
              На проверке
            </div>
          </div>
          <div className="glass-card p-3 rounded-2xl apple-shadow text-center">
            <div className="text-xl font-medium text-green-600 mb-1">
              {completedCount}
            </div>
            <div className="text-xs text-muted-foreground">
              Выполнено
            </div>
          </div>
          <div className="glass-card p-3 rounded-2xl apple-shadow text-center">
            <div className="text-xl font-medium text-red-600 mb-1">
              {overdueCount}
            </div>
            <div className="text-xs text-muted-foreground">
              Просрочено
            </div>
          </div>
        </div>

        {/* Поиск */}
        <div className="glass-card rounded-2xl p-4 mb-6 apple-shadow">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск задач..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Табы */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'glass-card text-foreground hover:scale-[0.98]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Список задач */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(renderTaskCard)
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center apple-shadow">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? 'Ничего не найдено' : 'Нет задач'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery 
                  ? 'Попробуйте изменить поисковый запрос'
                  : activeTab === 'active'
                  ? 'У вас нет активных задач'
                  : activeTab === 'completed'
                  ? 'У вас нет выполненных задач'
                  : activeTab === 'review'
                  ? 'Нет задач на проверке'
                  : 'У вас нет просроченных задач'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:scale-[0.98] transition-transform"
                >
                  Очистить поиск
                </button>
              )}
            </div>
          )}
        </div>

        {/* Мотивационное сообщение */}
        {convertedTasks.length > 0 && !searchQuery && (
          <div className="glass-card rounded-2xl p-4 mt-6 apple-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground text-sm">Совет дня</div>
                <div className="text-sm text-muted-foreground">
                  {activeTab === 'active' 
                    ? 'Выполняйте задачи вовремя, чтобы получить полную награду!'
                    : activeTab === 'completed'
                    ? `Отлично! Вы выполнили ${completedCount} задач. Продолжайте в том же духе!`
                    : activeTab === 'overdue'
                    ? 'Постарайтесь выполнить просроченные задачи как можно скорее.'
                    : 'Дождитесь проверки ваших задач администратором.'
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation onNavigate={onNavigate} currentPage={currentPage} />
    </div>
  );
}