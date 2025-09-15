import { useState, useEffect } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { Menu, Paperclip, ArrowLeft, Calendar, Coins, Award, Clock } from './Icons';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
// Убираем импорт mockAppState
import { EmptyCard } from './EmptyCard';
import { Panel } from './Panel';

interface TasksPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings?: () => void;
  profilePhoto?: string | null;
  tasks: any[];
  setTasks: (tasks: any[]) => void;
  theme?: 'light' | 'dark';
}

interface Subtask {
  id: number;
  title: string;
  isRequired: boolean;
  hasDocument: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string;
  employee: string;
  team: string;
  status: 'in_progress' | 'on_review' | 'completed';
  reward: {
    amount: number;
    type: 'coins' | 'experience';
  };
  startDate: string;
  endDate: string;
  subtasks: Subtask[];
}

type SortType = 'date' | 'reward_asc' | 'reward_desc' | 'time_asc' | 'time_desc';

export function TasksPage({ onNavigate, currentPage, onOpenSettings, profilePhoto, tasks: globalTasks, setTasks: setGlobalTasks, theme = 'light' }: TasksPageProps) {
  // ��оздаем мок-данные ��ля демонстрации
  const currentUser = {
    id: 'user1',
    name: 'Иван Иванов',
    username: '@iivanov'
  };
  
  const users = [];
  const teams = [
    { id: 't1', name: 'Команда разработки', memberIds: ['user1'] }
  ];
  
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [sortType, setSortType] = useState<SortType>('date');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState<{taskId: number, subtaskId: number} | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historySortType, setHistorySortType] = useState<SortType>('date');
  const [historySortMenuOpen, setHistorySortMenuOpen] = useState(false);

  // Преобразуем задачи из глобального состояния в старый формат для совместимости
  const convertGlobalTasksToTasks = (globalTasks: any[]): Task[] => {
    return globalTasks
      .filter(task => task.isPublished && task.status === 'active')
      .map((task, index) => {
        // Создаем уникальный числовой ID на основе строкового ID или индекса
        const numericId = task.id && typeof task.id === 'string' 
          ? parseInt(task.id.replace(/\D/g, '')) || (index + 1000)
          : (index + 1000);
        
        return {
          id: numericId,
          title: task.title,
          description: task.description,
          employee: currentUser.name,
          team: teams.find(t => t.memberIds.includes(currentUser.id))?.name || 'Без команды',
          status: 'in_progress' as const,
          reward: {
            amount: task.reward,
            type: task.rewardType === 'coins' ? 'coins' as const : 'experience' as const
          },
          startDate: task.createdAt || new Date().toLocaleDateString('ru-RU'),
          endDate: task.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
          subtasks: [
            {
              id: 1,
              title: 'Выполнить основную задачу',
              isRequired: true,
              hasDocument: false
            },
            {
              id: 2,
              title: 'Предоставить отчет о выполнении',
              isRequired: false,
              hasDocument: false
            }
          ]
        };
      });
  };

  const [tasks, setTasks] = useState<Task[]>(convertGlobalTasksToTasks(globalTasks));

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'in_progress': return 'В процессе';
      case 'on_review': return 'На проверке';
      case 'completed': return 'Выполнена';
      default: return 'Неизвестно';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'in_progress': return 'text-muted-foreground';
      case 'on_review': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      default: return 'text-muted-foreground';
    }
  };

  const formatReward = (reward: Task['reward']) => {
    return `${reward.amount} ${reward.type === 'coins' ? 'g' : 'XP'}`;
  };

  const canCompleteTask = (task: Task) => {
    return task.subtasks.every(subtask => !subtask.isRequired || subtask.hasDocument);
  };

  const handleSort = (type: SortType) => {
    setSortType(type);
    setSortMenuOpen(false);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    switch (sortType) {
      case 'date':
        return new Date(a.startDate.split('.').reverse().join('-')).getTime() - 
               new Date(b.startDate.split('.').reverse().join('-')).getTime();
      case 'reward_asc':
        return a.reward.amount - b.reward.amount;
      case 'reward_desc':
        return b.reward.amount - a.reward.amount;
      case 'time_asc':
        return new Date(a.endDate.split('.').reverse().join('-')).getTime() - 
               new Date(b.endDate.split('.').reverse().join('-')).getTime();
      case 'time_desc':
        return new Date(b.endDate.split('.').reverse().join('-')).getTime() - 
               new Date(a.endDate.split('.').reverse().join('-')).getTime();
      default:
        return 0;
    }
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleCompleteTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && isTaskOverdue(task.endDate)) {
      // Если задача просрочена, всё равно отправляем на проверку, но без награды
      console.log('Задача выполнена с опозданием, награда не будет начислена');
    }
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'on_review' as const }
          : task
      )
    );
    setIsTaskDetailOpen(false);
  };

  const toggleSubtaskDocument = (taskId: number, subtaskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(subtask =>
                subtask.id === subtaskId
                  ? { ...subtask, hasDocument: !subtask.hasDocument }
                  : subtask
              )
            }
          : task
      )
    );
    
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prevTask => {
        if (!prevTask) return null;
        return {
          ...prevTask,
          subtasks: prevTask.subtasks.map(subtask =>
            subtask.id === subtaskId
              ? { ...subtask, hasDocument: !subtask.hasDocument }
              : subtask
          )
        };
      });
    }
  };

  // Обновляем время каждую секунду для таймера
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate.split('.').reverse().join('-'));
    const now = currentTime;
    const difference = end.getTime() - now.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      if (days > 0) {
        return `${days}д ${hours}ч ${minutes}м`;
      } else if (hours > 0) {
        return `${hours}ч ${minutes}м ${seconds}с`;
      } else {
        return `${minutes}м ${seconds}с`;
      }
    } else {
      return 'Время истекло';
    }
  };

  const isTaskOverdue = (endDate: string) => {
    const end = new Date(endDate.split('.').reverse().join('-'));
    return currentTime.getTime() > end.getTime();
  };

  const handleHistoryClick = () => {
    setHistoryOpen(true);
  };

  const handleHistorySort = (type: SortType) => {
    setHistorySortType(type);
    setHistorySortMenuOpen(false);
  };

  // История задач - завершенные задачи пользователя
  const historyTasks: Task[] = globalTasks
    .filter(task => task.status === 'completed')
    .map((task, index) => {
      // Создаем уникальный числовой ID на основе строкового ID или индекса
      const numericId = task.id && typeof task.id === 'string' 
        ? parseInt(task.id.replace(/\D/g, '')) || (index + 2000)
        : (index + 2000);
      
      return {
        id: numericId,
        title: task.title,
        description: task.description,
        employee: currentUser.name,
        team: teams.find(t => t.memberIds.includes(currentUser.id))?.name || 'Без команды',
        status: 'completed' as const,
        reward: {
          amount: task.reward,
          type: task.rewardType === 'coins' ? 'coins' as const : 'experience' as const
        },
        startDate: task.createdAt || new Date().toLocaleDateString('ru-RU'),
        endDate: task.completedAt || task.createdAt || new Date().toLocaleDateString('ru-RU'),
        subtasks: []
      };
    });

  const sortedHistoryTasks = [...historyTasks].sort((a, b) => {
    switch (historySortType) {
      case 'date':
        return new Date(b.endDate.split('.').reverse().join('-')).getTime() - 
               new Date(a.endDate.split('.').reverse().join('-')).getTime();
      case 'reward_asc':
        return a.reward.amount - b.reward.amount;
      case 'reward_desc':
        return b.reward.amount - a.reward.amount;
      case 'time_asc':
        return new Date(a.endDate.split('.').reverse().join('-')).getTime() - 
               new Date(b.endDate.split('.').reverse().join('-')).getTime();
      case 'time_desc':
        return new Date(b.endDate.split('.').reverse().join('-')).getTime() - 
               new Date(a.endDate.split('.').reverse().join('-')).getTime();
      default:
        return 0;
    }
  });

  const handleAttachFile = (taskId: number, subtaskId: number) => {
    setSelectedSubtask({ taskId, subtaskId });
    setFileUploadOpen(true);
  };

  const handleFileSelected = () => {
    if (selectedSubtask) {
      toggleSubtaskDocument(selectedSubtask.taskId, selectedSubtask.subtaskId);
    }
    setFileUploadOpen(false);
    setSelectedSubtask(null);
  };

  return (
    <>
      <div 
        className="min-h-screen"
        style={{
          background: theme === 'dark' ? '#0B0D10' : '#FFFFFF',
          color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Header onNavigate={onNavigate} currentPage={currentPage} onOpenSettings={onOpenSettings} user={currentUser} profilePhoto={profilePhoto} theme={theme} />
        </div>
        
        {/* Main Content */}
        <div className="max-w-md mx-auto px-4 pb-32" style={{ position: 'relative', zIndex: 10 }}>
          <Panel
            theme={theme}
            leftIcon={
              <button
                onClick={handleHistoryClick}
                className="apple-button transition-all hover:scale-105"
                style={{
                  width: '28px',
                  height: '28px',
                  minWidth: '28px',
                  minHeight: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Clock style={{ width: '16px', height: '16px', color: '#000000' }} />
              </button>
            }
            title="Доступные задачи"
            rightButton={
              <button
                onClick={() => setSortMenuOpen(true)}
                className="apple-button transition-all hover:scale-105"
                style={{
                  width: '28px',
                  height: '28px',
                  minWidth: '28px',
                  minHeight: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Menu style={{ width: '16px', height: '16px', color: '#000000' }} />
              </button>
            } className="bg-[rgba(255,255,255,0)] text-[rgba(242,228,228,1)]"
          >
            {sortedTasks.length > 0 ? (
              <div className="space-y-3">
                {sortedTasks.map((task, index) => (
                  <div
                    key={`task-${task.id}-${index}`}
                    className="surface-card transition-all hover:scale-[0.98] cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                    style={{
                      backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
                      borderRadius: '16px',
                      padding: '16px',
                      border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
                      boxShadow: theme === 'dark' ? '0 8px 24px rgba(0, 0, 0, 0.6)' : '0 8px 24px rgba(0, 0, 0, 0.10)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div 
                          className="font-medium text-sm mb-2"
                          style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                        >
                          {task.title}
                        </div>
                        <div className="space-y-1">
                          <div className={`text-xs ${getStatusColor(task.status)}`}>
                            Статус: {getStatusText(task.status)}
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: '#6B7280' }}
                          >
                            Сотрудник: {task.employee}, {task.team}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[100px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task);
                          }}
                          className="px-4 py-2 text-sm font-medium transition-all hover:scale-[0.98] flex items-center justify-center text-center"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#1A1A1A',
                            borderRadius: '12px',
                            height: '44px'
                          }}
                        >
                          Выполнить
                        </button>
                        
                        <div 
                          className="p-3 text-center"
                          style={{
                            backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8',
                            borderRadius: '12px',
                            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
                          }}
                        >
                          <div 
                            className="text-xs mb-1 font-medium"
                            style={{ color: '#6B7280' }}
                          >
                            Время
                          </div>
                          <div 
                            className={`text-xs font-semibold`}
                            style={{
                              color: isTaskOverdue(task.endDate) ? '#ff3b30' : theme === 'dark' ? '#E8ECF2' : '#0F172A'
                            }}
                          >
                            {getTimeRemaining(task.endDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyCard variant="tasks_empty" theme={theme} />
            )}
          </Panel>
        </div>
        
        {/* Bottom Navigation */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <BottomNavigation onNavigate={onNavigate} currentPage={currentPage} theme={theme} />
        </div>
      </div>

      {/* Меню сортировки */}
      <Dialog open={sortMenuOpen} onOpenChange={setSortMenuOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-sm p-6 [&>button]:hidden"
          aria-describedby="tasks-sort-menu-description"
        >
          <DialogTitle className="text-lg font-medium text-foreground text-center mb-6">
            Сортировка
          </DialogTitle>
          
          <DialogDescription id="tasks-sort-menu-description" className="sr-only">
            Выберит�� тип сортировки задач
          </DialogDescription>

          <div className="space-y-3">
            <button
              onClick={() => handleSort('date')}
              className={`w-full glass-card rounded-2xl p-4 text-sm font-medium transition-all hover:scale-[0.98] ${
                sortType === 'date' ? 'bg-primary/20 text-primary' : 'text-foreground'
              }`}
            >
              По дате
            </button>
            <button
              onClick={() => handleSort('reward_asc')}
              className={`w-full glass-card rounded-2xl p-4 text-sm font-medium transition-all hover:scale-[0.98] ${
                sortType === 'reward_asc' ? 'bg-primary/20 text-primary' : 'text-foreground'
              }`}
            >
              По награде (по возрастанию)
            </button>
            <button
              onClick={() => handleSort('reward_desc')}
              className={`w-full glass-card rounded-2xl p-4 text-sm font-medium transition-all hover:scale-[0.98] ${
                sortType === 'reward_desc' ? 'bg-primary/20 text-primary' : 'text-foreground'
              }`}
            >
              По награде (по убыванию)
            </button>
            <button
              onClick={() => handleSort('time_asc')}
              className={`w-full glass-card rounded-2xl p-4 text-sm font-medium transition-all hover:scale-[0.98] ${
                sortType === 'time_asc' ? 'bg-primary/20 text-primary' : 'text-foreground'
              }`}
            >
              По времени (по возрастанию)
            </button>
            <button
              onClick={() => handleSort('time_desc')}
              className={`w-full glass-card rounded-2xl p-4 text-sm font-medium transition-all hover:scale-[0.98] ${
                sortType === 'time_desc' ? 'bg-primary/20 text-primary' : 'text-foreground'
              }`}
            >
              По времени (по убыванию)
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Детали задачи */}
      <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-0 max-h-[80vh] flex flex-col [&>button]:hidden"
          aria-describedby="task-detail-description"
        >
          <div className="p-6 flex-1 flex flex-col">
            {/* Заголовок */}
            <div className="flex items-center justify-center mb-6">
              <DialogTitle className="text-lg font-medium text-foreground text-center">
                {selectedTask?.title}
              </DialogTitle>
            </div>
            
            <DialogDescription id="task-detail-description" className="sr-only">
              Детальная информация о задаче
            </DialogDescription>

            {selectedTask && (
              <div className="flex-1 overflow-y-auto space-y-4">
                {/* Описание задачи */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="text-sm font-medium text-foreground mb-2">
                    Описание задачи
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedTask.description}
                  </div>
                  
                  {/* Подзадачи */}
                  {selectedTask.subtasks.length > 0 && (
                    <div className="mt-4">
                      <div className="space-y-2">
                        {selectedTask.subtasks.map((subtask) => (
                          <div key={subtask.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                              <span className="text-sm text-foreground">{subtask.title}</span>
                            </div>
                            <button
                              onClick={() => handleAttachFile(selectedTask.id, subtask.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                subtask.hasDocument
                                  ? 'bg-green-500/20 text-green-600'
                                  : 'hover:bg-black/5 text-muted-foreground'
                              }`}
                            >
                              <Paperclip className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Информация о задаче */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <span className="text-foreground font-medium">Сотрудник:</span> {selectedTask.employee}, {selectedTask.team}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="text-foreground font-medium">Статус:</span> 
                      <span className={getStatusColor(selectedTask.status)}> {getStatusText(selectedTask.status)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="text-foreground font-medium">Награда:</span> {formatReward(selectedTask.reward)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="text-foreground font-medium">Дата:</span> {selectedTask.startDate} → {selectedTask.endDate}
                    </div>
                  </div>
                </div>

                {/* Таймер */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="text-sm font-medium text-foreground mb-2 text-center">
                    Время до завершения
                  </div>
                  <div className={`text-center text-lg font-medium ${
                    isTaskOverdue(selectedTask.endDate) 
                      ? 'text-red-500' 
                      : 'text-foreground'
                  }`}>
                    {getTimeRemaining(selectedTask.endDate)}
                  </div>
                  {isTaskOverdue(selectedTask.endDate) && (
                    <div className="text-xs text-red-500 text-center mt-1">
                      Награда не будет начислена
                    </div>
                  )}
                </div>

                {/* Кнопки - контейнер с Auto Layout */}
                <div 
                  className="flex pt-4"
                  style={{
                    gap: '12px', // Auto layout gap
                    padding: '16px 0 0 0', // Padding сверху
                    overflow: 'hidden', // Clip content
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <button
                    onClick={() => setIsTaskDetailOpen(false)}
                    className="glass-card rounded-2xl unified-button hover:scale-[0.98] transition-transform text-center"
                    style={{
                      flex: '1', // Равномерное распределение
                      padding: '12px',
                      minWidth: '120px', // Минимальная ширина для читаемости
                      flexShrink: 0, // Hug contents - не сжимается
                      maxWidth: '50%', // Не больше половины контейнера
                      overflow: 'hidden', // Clip content внутри кнопки
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                    }}
                  >
                    Отменить
                  </button>
                  <button
                    onClick={() => handleCompleteTask(selectedTask.id)}
                    disabled={selectedTask.status !== 'in_progress' || !canCompleteTask(selectedTask)}
                    className="rounded-2xl unified-button transition-transform text-center"
                    style={{
                      flex: '1', // Равномерное распределение
                      padding: '12px',
                      minWidth: '120px', // Минимальная ширина для читаемости
                      flexShrink: 0, // Hug contents - не сжимается
                      maxWidth: '50%', // Не больше половины контейнера
                      overflow: 'hidden', // Clip content внутри кнопки
                      background: selectedTask.status === 'in_progress' && canCompleteTask(selectedTask)
                        ? '#2B82FF'
                        : theme === 'dark' ? '#1C2029' : '#F3F5F8',
                      color: selectedTask.status === 'in_progress' && canCompleteTask(selectedTask) 
                        ? '#FFFFFF' 
                        : theme === 'dark' ? '#A7B0BD' : '#6B7280',
                      border: selectedTask.status === 'in_progress' && canCompleteTask(selectedTask)
                        ? 'none'
                        : theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
                      cursor: selectedTask.status === 'in_progress' && canCompleteTask(selectedTask)
                        ? 'pointer'
                        : 'not-allowed',
                      opacity: selectedTask.status === 'in_progress' && canCompleteTask(selectedTask) ? 1 : 0.6
                    }}
                  >
                    Отправить
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно загрузки файла */}
      <Dialog open={fileUploadOpen} onOpenChange={setFileUploadOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-sm p-6 [&>button]:hidden"
          aria-describedby="task-file-upload-description"
        >
          <DialogTitle className="text-lg font-medium text-foreground text-center mb-6">
            Прикрепить файл
          </DialogTitle>
          
          <DialogDescription id="task-file-upload-description" className="sr-only">
            Выберите файл для прикрепления к подзадаче
          </DialogDescription>

          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-xl flex items-center justify-center">
                <Paperclip className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Выберите файл дл�� загрузки
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileSelected}
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="w-full glass-card rounded-2xl p-3 text-sm font-medium text-foreground hover:scale-[0.98] transition-transform cursor-pointer inline-block"
              >
                Выбрать файл
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setFileUploadOpen(false)}
                className="flex-1 glass-card rounded-2xl p-3 text-sm font-medium text-foreground hover:scale-[0.98] transition-transform text-center"
              >
                Отменить
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно истории задач */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-0 max-h-[80vh] flex flex-col [&>button]:hidden"
          aria-describedby="task-history-description"
        >
          <div className="p-6 flex-1 flex flex-col">
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setHistorySortMenuOpen(true)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-foreground/70" />
              </button>
              
              <DialogTitle className="text-lg font-medium text-foreground">
                История задач
              </DialogTitle>
              
              <div className="w-9"></div>
            </div>
            
            <DialogDescription id="task-history-description" className="sr-only">
              История выполненных задач
            </DialogDescription>

            {/* Список задач истории */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {sortedHistoryTasks.length > 0 ? (
                sortedHistoryTasks.map((task) => (
                  <div
                    key={task.id}
                    className="glass-card rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground text-sm">{task.title}</h3>
                      <span className="text-xs text-green-600 font-medium">Выполнена</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Завершена: {task.endDate}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Награда: {formatReward(task.reward)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center min-h-[200px]">
                  <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-6 w-80 apple-shadow">
                    <p className="text-muted-foreground text-sm text-center opacity-70">
                      История пуста
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Кнопка закрыть */}
            <div className="pt-4">
              <button
                onClick={() => setHistoryOpen(false)}
                className="w-full glass-card rounded-2xl p-3 text-sm font-medium text-foreground hover:scale-[0.98] transition-transform text-center"
              >
                Закрыть
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Меню сортировки истории */}
      <Dialog open={historySortMenuOpen} onOpenChange={setHistorySortMenuOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-sm p-6 [&>button]:hidden"
          aria-describedby="history-sort-menu-description"
        >
          <DialogTitle className="text-lg font-medium text-foreground text-center mb-6">
            Сортировка истории
          </DialogTitle>
          
          <DialogDescription id="history-sort-menu-description" className="sr-only">
            Выберите тип сортировки истории задач
          </DialogDescription>

          <div className="space-y-3">
            <button
              onClick={() => handleHistorySort('date')}
              className={`w-full glass-card rounded-2xl p-4 text-sm font-medium transition-all hover:scale-[0.98] ${
                historySortType === 'date' ? 'bg-primary/20 text-primary' : 'text-foreground'
              }`}
            >
              По дате
            </button>
            <button
              onClick={() => handleHistorySort('reward_asc')}
              className={`w-full glass-card rounded-2xl p-4 text-sm font-medium transition-all hover:scale-[0.98] ${
                historySortType === 'reward_asc' ? 'bg-primary/20 text-primary' : 'text-foreground'
              }`}
            >
              По награде (по возрастани��)
            </button>
            <button
              onClick={() => handleHistorySort('reward_desc')}
              className={`w-full glass-card rounded-2xl p-4 text-sm font-medium transition-all hover:scale-[0.98] ${
                historySortType === 'reward_desc' ? 'bg-primary/20 text-primary' : 'text-foreground'
              }`}
            >
              По награде (по убыванию)
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}