import { useState } from 'react';
import { Plus, X, Paperclip, ChevronDown, Menu, Home, Users, Zap, Trophy, CheckSquare, ShoppingBag, Gamepad2, Box, History, ArrowLeft, Calendar, User } from './Icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

interface Subtask {
  id: string;
  description: string;
  requiresAttachment: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  subtasks: Subtask[];
  assignedTo: string[];
  assignedBy: string;
  dateAssigned: string;
  deadline?: string;
  reward: {
    type: 'XP' | 'G-coin';
    amount: number;
  };
  difficulty: 'легкое' | 'среднее' | 'тяжелое';
  status: 'pending' | 'completed' | 'overdue' | 'rejected' | 'needs_revision';
  completedDate?: string;
  attachments?: string[]; // URLs к файлам
  rejectionReason?: string;
  hasUnreadFeedback?: boolean;
}

interface Employee {
  id: string;
  name: string;
  team: string;
  avatar?: string;
}

interface AdminTasksProps {
  currentAdminPage?: string;
  setCurrentAdminPage?: (page: string) => void;
}

export function AdminTasks({ currentAdminPage = 'tasks', setCurrentAdminPage }: AdminTasksProps) {
  // Список сотрудников для выбора
  const employees: Employee[] = [
    { id: '1', name: 'Александр Петров', team: 'Команда А' },
    { id: '2', name: 'Мария Иванова', team: 'Команда Б' },
    { id: '3', name: 'Дмитрий Сидоров', team: 'Команда А' },
    { id: '4', name: 'Елена Козлова', team: 'Команда В' },
    { id: '5', name: 'Андрей Морозов', team: 'Команда Б' },
    { id: '6', name: 'Ольга Волкова', team: 'Команда А' },
  ];

  // Навигационные элементы панели администратора
  const navigationItems = [
    { icon: Home, label: 'Главная', section: 'dashboard' },
    { icon: Users, label: 'Воркеры', section: 'workers' },
    { icon: Zap, label: 'Баттлы', section: 'battles' },
    { icon: Trophy, label: 'Достижения', section: 'achievements' },
    { icon: CheckSquare, label: 'Задачи', section: 'tasks' },
    { icon: ShoppingBag, label: 'Товары', section: 'shop' },
    { icon: Gamepad2, label: 'Игры', section: 'games' },
    { icon: Box, label: 'Кейсы', section: 'cases' }
  ];

  // Placeholder данные для активных задач (на проверке)
  const [activeTasks, setActiveTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Создать презентацию',
      description: 'Создать презентацию для клиента по новому проекту',
      subtasks: [
        { id: '1', description: 'Подготовить макеты', requiresAttachment: true },
        { id: '2', description: 'Написать текст', requiresAttachment: false }
      ],
      assignedTo: ['Александр Петров, Команда А'],
      assignedBy: 'Админ',
      dateAssigned: '2024-01-15',
      deadline: '2024-01-20',
      reward: { type: 'XP', amount: 100 },
      difficulty: 'среднее',
      status: 'pending',
      attachments: ['presentation.pdf', 'mockups.jpg']
    },
    {
      id: '2',
      title: 'Провести исследование',
      description: 'Исследовать конкурентов в сфере',
      subtasks: [
        { id: '1', description: 'Собрать данные', requiresAttachment: false }
      ],
      assignedTo: ['Мария Иванова, Команда Б'],
      assignedBy: 'Тимлид',
      dateAssigned: '2024-01-14', 
      reward: { type: 'XP', amount: 50 },
      difficulty: 'легкое',
      status: 'needs_revision',
      rejectionReason: 'Нужно добавить больше деталей в анализ. Не хватает информации о ценовых стратегиях конкурентов.',
      hasUnreadFeedback: false
    },
    {
      id: '3',
      title: 'Разработать дизайн',
      description: 'Создать дизайн-макеты для мобильного приложения',
      subtasks: [
        { id: '1', description: 'Главная страница', requiresAttachment: true },
        { id: '2', description: 'Страница профиля', requiresAttachment: true }
      ],
      assignedTo: ['Дмитрий Сидоров, Команда А'],
      assignedBy: 'Тимлид',
      dateAssigned: '2024-01-13', 
      reward: { type: 'XP', amount: 75 },
      difficulty: 'среднее',
      status: 'pending',
      attachments: ['design_v1.fig', 'mockup.png']
    },
    {
      id: '4',
      title: 'Написать отчет',
      description: 'Подготовить ежемесячный отчет по продажам',
      subtasks: [
        { id: '1', description: 'Собрать статистику', requiresAttachment: true }
      ],
      assignedTo: ['Елена Козлова, Команда В'],
      assignedBy: 'Админ',
      dateAssigned: '2024-01-12', 
      reward: { type: 'G-coin', amount: 25 },
      difficulty: 'тяжелое',
      status: 'pending',
      attachments: ['report.xlsx', 'charts.png']
    }
  ]);

  // Placeholder данные для выполненных задач
  const [completedTasks, setCompletedTasks] = useState<Task[]>([
    {
      id: '5',
      title: 'Создать логотип',
      description: 'Разработать логотип для нового бренда',
      subtasks: [
        { id: '1', description: 'Концептуальные наброски', requiresAttachment: true },
        { id: '2', description: 'Финальная версия', requiresAttachment: true }
      ],
      assignedTo: ['Андрей Морозов, Команда Б'],
      assignedBy: 'Админ',
      dateAssigned: '2024-01-10',
      deadline: '2024-01-15',
      completedDate: '2024-01-14',
      reward: { type: 'XP', amount: 200 },
      difficulty: 'тяжелое',
      status: 'completed'
    },
    {
      id: '6',
      title: 'Обновить базу данных',
      description: 'Актуализировать информацию о клиентах',
      subtasks: [
        { id: '1', description: 'Проверить контакты', requiresAttachment: false }
      ],
      assignedTo: ['Ольга Волкова, Команда А'],
      assignedBy: 'Тимлид',
      dateAssigned: '2024-01-08',
      completedDate: '2024-01-10',
      reward: { type: 'XP', amount: 150 },
      difficulty: 'среднее',
      status: 'completed'
    }
  ]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [employeeSelectModalOpen, setEmployeeSelectModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [sortBy, setSortBy] = useState<'team' | 'employee' | 'date'>('date');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [historySortBy, setHistorySortBy] = useState<'team' | 'employee' | 'date'>('date');
  const [showHistorySortDropdown, setShowHistorySortDropdown] = useState(false);
  
  // Данные формы создания задачи
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subtasks: [{ id: '1', description: '', requiresAttachment: false }] as Subtask[],
    assignedTo: [] as string[],
    deadline: '',
    reward: { type: 'XP' as 'XP' | 'G-coin', amount: 100 },
    difficulty: 'среднее' as 'легкое' | 'среднее' | 'тяжелое'
  });

  const [tempReward, setTempReward] = useState({ type: 'XP' as 'XP' | 'G-coin', amount: 100 });

  // Функции обработки задач
  const handleCreateTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      subtasks: formData.subtasks.filter(st => st.description.trim()),
      assignedTo: formData.assignedTo,
      assignedBy: 'Админ',
      dateAssigned: new Date().toISOString().split('T')[0],
      deadline: formData.deadline || undefined,
      reward: formData.reward,
      difficulty: formData.difficulty,
      status: 'pending'
    };
    
    setActiveTasks([...activeTasks, newTask]);
    setCreateModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subtasks: [{ id: '1', description: '', requiresAttachment: false }],
      assignedTo: [],
      deadline: '',
      reward: { type: 'XP', amount: 100 },
      difficulty: 'среднее'
    });
  };

  const addSubtask = () => {
    const newSubtask: Subtask = {
      id: Date.now().toString(),
      description: '',
      requiresAttachment: false
    };
    setFormData({
      ...formData,
      subtasks: [...formData.subtasks, newSubtask]
    });
  };

  const updateSubtask = (index: number, field: keyof Subtask, value: string | boolean) => {
    const newSubtasks = [...formData.subtasks];
    newSubtasks[index] = { ...newSubtasks[index], [field]: value };
    setFormData({ ...formData, subtasks: newSubtasks });
  };

  const removeSubtask = (index: number) => {
    if (formData.subtasks.length > 1) {
      const newSubtasks = formData.subtasks.filter((_, i) => i !== index);
      setFormData({ ...formData, subtasks: newSubtasks });
    }
  };

  const handleApproveTask = (taskId: string) => {
    // Логика одобрения задачи - переместить в выполненные
    const task = activeTasks.find(t => t.id === taskId);
    if (task && task.status !== 'needs_revision') {
      const completedTask = { 
        ...task, 
        status: 'completed' as const, 
        completedDate: new Date().toISOString().split('T')[0] 
      };
      setCompletedTasks([completedTask, ...completedTasks]);
      setActiveTasks(activeTasks.filter(t => t.id !== taskId));
      setTaskDetailModalOpen(false);
    }
  };

  const handleRejectTask = (taskId: string) => {
    // Открыть модальное окно для ввода причины отклонения
    const task = activeTasks.find(t => t.id === taskId);
    if (task && task.status !== 'needs_revision') {
      setSelectedTask(task);
      setRejectionReason('');
      setRejectionModalOpen(true);
    }
  };

  const handleConfirmRejection = () => {
    if (selectedTask && rejectionReason.trim()) {
      const updatedTasks = activeTasks.map(task =>
        task.id === selectedTask.id
          ? { 
              ...task, 
              status: 'needs_revision' as const,
              rejectionReason: rejectionReason.trim(),
              hasUnreadFeedback: true
            }
          : task
      );
      setActiveTasks(updatedTasks);
      setRejectionModalOpen(false);
      setTaskDetailModalOpen(false);
      setRejectionReason('');
    }
  };

  const handleEmployeeSelect = () => {
    setEmployeeSelectModalOpen(true);
  };

  const handleEmployeeToggle = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      const employeeName = `${employee.name}, ${employee.team}`;
      const isSelected = formData.assignedTo.includes(employeeName);
      
      if (isSelected) {
        setFormData({
          ...formData,
          assignedTo: formData.assignedTo.filter(name => name !== employeeName)
        });
      } else {
        setFormData({
          ...formData,
          assignedTo: [...formData.assignedTo, employeeName]
        });
      }
    }
  };

  const isEmployeeSelected = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      const employeeName = `${employee.name}, ${employee.team}`;
      return formData.assignedTo.includes(employeeName);
    }
    return false;
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailModalOpen(true);
  };

  const handleRewardClick = () => {
    setTempReward(formData.reward);
    setRewardModalOpen(true);
  };

  const handleRewardSave = () => {
    setFormData({ ...formData, reward: tempReward });
    setRewardModalOpen(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'легкое': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'среднее': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'тяжелое': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Сортировка задач
  const sortedActiveTasks = [...activeTasks].sort((a, b) => {
    switch (sortBy) {
      case 'team':
        return a.assignedTo[0].localeCompare(b.assignedTo[0]);
      case 'employee':
        return a.assignedTo[0].localeCompare(b.assignedTo[0]);
      case 'date':
        return new Date(b.dateAssigned).getTime() - new Date(a.dateAssigned).getTime();
      default:
        return 0;
    }
  });

  const sortedCompletedTasks = [...completedTasks].sort((a, b) => {
    switch (historySortBy) {
      case 'team':
        return a.assignedTo[0].localeCompare(b.assignedTo[0]);
      case 'employee':
        return a.assignedTo[0].localeCompare(b.assignedTo[0]);
      case 'date':
        return new Date(b.completedDate || b.dateAssigned).getTime() - new Date(a.completedDate || a.dateAssigned).getTime();
      default:
        return 0;
    }
  });

  return (
    <>
      <div className="min-h-screen bg-background pb-40">
        <div className="p-6">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-foreground">Панель управления</h2>
          </div>

          {/* Управление */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2 glass-card rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground"
              >
                Доб. задачу
              </button>
            </div>
          </div>

          {/* Card с активными задачами */}
          <div className="px-6">
            <div className="glass-card rounded-2xl apple-shadow p-4">
              {/* Заголовок с кнопками */}
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setHistoryModalOpen(true)}
                  className="glass-card p-3 rounded-xl transition-colors hover:bg-accent/50"
                  title="История задач"
                >
                  <History size={16} className="text-foreground/70" />
                </button>
                <h3 className="text-lg font-medium text-foreground">Активные задачи</h3>
                <div className="relative">
                  <button 
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="glass-card p-3 rounded-xl transition-colors hover:bg-accent/50" 
                    title="Сортировка"
                  >
                    <Menu size={16} className="text-foreground/70" />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 glass-card rounded-xl apple-shadow z-10">
                      {[
                        { key: 'date', label: 'По дате' },
                        { key: 'team', label: 'По команде' },
                        { key: 'employee', label: 'По сотруднику' }
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => {
                            setSortBy(option.key as any);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                            sortBy === option.key ? 'bg-primary text-primary-foreground' : 'hover:bg-black/5 text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Список активных задач */}
              <div className="space-y-3">
                {sortedActiveTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border border-border/20 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground mb-1">{task.title}</div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Статус: {task.status === 'needs_revision' ? 'требует доработки' : 'в процессе'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Сотрудник: {task.assignedTo.join('; ')}
                      </div>
                      {task.status === 'needs_revision' && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          ⚠️ Есть замечания
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectTask(task.id);
                        }}
                        disabled={task.status === 'needs_revision'}
                        className={`p-2 rounded-lg transition-colors ${
                          task.status === 'needs_revision' 
                            ? 'opacity-30 cursor-not-allowed' 
                            : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveTask(task.id);
                        }}
                        disabled={task.status === 'needs_revision'}
                        className={`p-2 rounded-lg transition-colors ${
                          task.status === 'needs_revision' 
                            ? 'opacity-30 cursor-not-allowed' 
                            : 'hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                      >
                        <CheckSquare className="w-4 h-4 text-green-500" />
                      </button>
                    </div>
                  </div>
                ))}
                {sortedActiveTasks.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Активных задач нет
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Быстрая навигация */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/20">
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-4">
                {navigationItems.slice(0, 4).map((item, index) => {
                  const Icon = item.icon;
                  const isActive = item.section === currentAdminPage;
                  return (
                    <button 
                      key={index} 
                      className="flex flex-col items-center text-center"
                      onClick={() => setCurrentAdminPage?.(item.section)}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 apple-shadow ${
                        isActive ? 'bg-primary' : 'glass-card'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          isActive ? 'text-white' : 'text-foreground/70'
                        }`} />
                      </div>
                      <span className={`text-xs ${
                        isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {navigationItems.slice(4, 8).map((item, index) => {
                  const Icon = item.icon;
                  const isActive = item.section === currentAdminPage;
                  return (
                    <button 
                      key={index} 
                      className="flex flex-col items-center text-center"
                      onClick={() => setCurrentAdminPage?.(item.section)}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 apple-shadow ${
                        isActive ? 'bg-primary' : 'glass-card'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          isActive ? 'text-white' : 'text-foreground/70'
                        }`} />
                      </div>
                      <span className={`text-xs ${
                        isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Модальное окно истории задач */}
        <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
          <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
            <DialogTitle className="text-lg font-medium text-foreground text-center">История задач</DialogTitle>
            <DialogDescription className="sr-only">
              Модальное окно со списком выполненных задач
            </DialogDescription>
            <div className="p-6">
              {/* Заголовок с сортировкой и крестиком */}
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowHistorySortDropdown(!showHistorySortDropdown)}
                    className="glass-card p-3 rounded-xl transition-colors hover:bg-accent/50" 
                    title="Сортировка"
                  >
                    <Menu size={16} className="text-foreground/70" />
                  </button>
                  {showHistorySortDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 glass-card rounded-xl apple-shadow z-10">
                      {[
                        { key: 'date', label: 'По дате выполнения' },
                        { key: 'team', label: 'По команде' },
                        { key: 'employee', label: 'По сотруднику' }
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => {
                            setHistorySortBy(option.key as any);
                            setShowHistorySortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                            historySortBy === option.key ? 'bg-primary text-primary-foreground' : 'hover:bg-black/5 text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-medium text-foreground flex-1 text-center">Выполненные задачи</h3>
                <button
                  onClick={() => setHistoryModalOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground/70" />
                </button>
              </div>

              {/* Список выполненных задач */}
              <div className="overflow-y-auto max-h-[calc(80vh-200px)] space-y-3">
                {sortedCompletedTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-3 border border-border/20 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="text-sm font-medium text-foreground mb-1">{task.title}</div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Статус: выполнена
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Сотрудник: {task.assignedTo.join('; ')}
                    </div>
                    <div className="flex justify-end">
                      <span className="text-xs bg-secondary px-2 py-1 rounded">
                        {task.completedDate && new Date(task.completedDate).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                ))}
                {sortedCompletedTasks.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Выполненных задач нет
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Модальное окно создания задачи */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
            <DialogTitle className="sr-only">Название задачи</DialogTitle>
            <DialogDescription className="sr-only">
              Модальное окно для создания новой задачи с подзадачами, выбором сотрудников и настройкой награды
            </DialogDescription>
            <div className="p-6">
              {/* Заголовок с кнопкой назад и выбором сотрудника */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground/70" />
                </button>
                <Input
                  placeholder="Название задачи"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="flex-1 mx-4 bg-transparent border border-border rounded-lg text-center font-medium"
                />
                <button 
                  onClick={handleEmployeeSelect}
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <User className="w-5 h-5 text-foreground/70" />
                </button>
              </div>

              {/* Описание задачи с подзадачами */}
              <div className="glass-card rounded-2xl p-4 mb-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Описание задачи</span>
                    <button
                      onClick={addSubtask}
                      className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                  <Textarea
                    placeholder="Описание того, что нужно сделать для выполнения задачи"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-transparent border-none resize-none min-h-16 text-sm focus:outline-none p-0"
                  />
                </div>

                {/* Подзадачи */}
                <div className="space-y-2">
                  {formData.subtasks.map((subtask, index) => (
                    <div key={subtask.id} className="flex items-center gap-2 pl-2 border-l-2 border-muted">
                      <span className="text-sm">•</span>
                      <Input
                        placeholder="Подзадача"
                        value={subtask.description}
                        onChange={(e) => updateSubtask(index, 'description', e.target.value)}
                        className="bg-transparent border-none text-sm p-0 h-6 flex-1"
                      />
                      <button
                        onClick={() => updateSubtask(index, 'requiresAttachment', !subtask.requiresAttachment)}
                        className={`p-1 rounded transition-colors ${
                          subtask.requiresAttachment 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground'
                        }`}
                      >
                        <Paperclip className="w-3 h-3" />
                      </button>
                      {formData.subtasks.length > 1 && (
                        <button 
                          onClick={() => removeSubtask(index)}
                          className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                        >
                          <X className="w-3 h-3 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Информация о задаче */}
              <div className="space-y-3 mb-6">
                <div className="text-sm text-foreground">
                  Сотрудник: {formData.assignedTo.length > 0 ? formData.assignedTo.join('; ') : 'Не выбран'}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Дата: {new Date().toLocaleDateString('ru-RU')}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="text-xs bg-transparent border border-border rounded px-2 py-1"
                    />
                    <Calendar className="w-4 h-4 text-foreground/70" />
                  </div>
                </div>
                
                {/* Сложность задачи */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Сложность:</span>
                  <div className="relative">
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                      className="text-sm bg-transparent border border-border rounded px-2 py-1"
                    >
                      <option value="легкое">легкое</option>
                      <option value="среднее">среднее</option>
                      <option value="тяжелое">тяжелое</option>
                    </select>
                  </div>
                </div>
                
                {/* Награда */}
                <button
                  onClick={handleRewardClick}
                  className="text-sm text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded px-2 py-1 transition-colors w-full text-left"
                >
                  Награда: {formData.reward.amount} {formData.reward.type}
                </button>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3">
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-secondary text-foreground rounded-full text-sm font-medium transition-colors hover:bg-accent"
                >
                  Отменить
                </button>
                <button
                  onClick={handleCreateTask}
                  disabled={!formData.title || !formData.description || formData.assignedTo.length === 0}
                  className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  Применить
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Модальное окно деталей задачи */}
        <Dialog open={taskDetailModalOpen} onOpenChange={setTaskDetailModalOpen}>
          <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
            <DialogTitle className="sr-only">{selectedTask?.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Подробная информация о выбранной задаче с возможностью одобрения или отклонения
            </DialogDescription>
            <div className="p-6">
              {selectedTask && (
                <div className="space-y-4">
                  {/* Заголовок с кнопками действий */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-foreground flex-1">{selectedTask.title}</h3>
                    <div className="flex items-center gap-2 ml-4">
                      <button 
                        onClick={() => handleRejectTask(selectedTask.id)}
                        disabled={selectedTask.status === 'needs_revision'}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedTask.status === 'needs_revision' 
                            ? 'opacity-30 cursor-not-allowed' 
                            : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                      >
                        <X className="w-5 h-5 text-red-500" />
                      </button>
                      <button 
                        onClick={() => handleApproveTask(selectedTask.id)}
                        disabled={selectedTask.status === 'needs_revision'}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedTask.status === 'needs_revision' 
                            ? 'opacity-30 cursor-not-allowed' 
                            : 'hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                      >
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Сотрудник: {selectedTask.assignedTo.join('; ')}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-4">{selectedTask.description}</p>
                  </div>

                  {/* Подзадачи */}
                  {selectedTask.subtasks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Подзадачи:</h4>
                      <div className="space-y-2">
                        {selectedTask.subtasks.map((subtask) => (
                          <div key={subtask.id} className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-secondary/50 rounded-lg">
                            <span>•</span>
                            <span className="flex-1">{subtask.description}</span>
                            {subtask.requiresAttachment && (
                              <Paperclip className="w-3 h-3 text-primary" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Прикрепленные файлы */}
                  {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Прикрепленные файлы:</h4>
                      <div className="space-y-2">
                        {selectedTask.attachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg">
                            <Paperclip className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground flex-1">{file}</span>
                            <button className="text-xs text-primary hover:text-primary/80 px-2 py-1 hover:bg-primary/10 rounded">
                              Открыть
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Комментарий об ошибке */}
                  {selectedTask.rejectionReason && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/40 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                        Требуется доработка:
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        {selectedTask.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Информация о задаче */}
                  <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border/50">
                    <div>Назначил: {selectedTask.assignedBy}</div>
                    <div>Дата назначения: {new Date(selectedTask.dateAssigned).toLocaleDateString('ru-RU')}</div>
                    {selectedTask.deadline && (
                      <div>Дедлайн: {new Date(selectedTask.deadline).toLocaleDateString('ru-RU')}</div>
                    )}
                    {selectedTask.completedDate && (
                      <div>Дата выполнения: {new Date(selectedTask.completedDate).toLocaleDateString('ru-RU')}</div>
                    )}
                    <div>Награда: {selectedTask.reward.amount} {selectedTask.reward.type}</div>
                    <div className="flex items-center gap-2">
                      <span>Сложность:</span>
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(selectedTask.difficulty)}`}>
                        {selectedTask.difficulty}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setTaskDetailModalOpen(false)}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors hover:bg-primary/90"
                  >
                    Закрыть
                  </button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Модальное окно выбора сотрудников */}
        <Dialog open={employeeSelectModalOpen} onOpenChange={setEmployeeSelectModalOpen}>
          <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
            <DialogTitle className="text-lg font-medium text-foreground text-center">Список сотрудников</DialogTitle>
            <DialogDescription className="sr-only">
              Модальное окно для выбора сотрудников для назначения задачи
            </DialogDescription>
            <div className="p-6">
              {/* Заголовок с крестиком */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Menu className="w-5 h-5 text-foreground/70" />
                  <h3 className="text-lg font-medium text-foreground">Список сотрудников</h3>
                </div>
                <button
                  onClick={() => setEmployeeSelectModalOpen(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground/70" />
                </button>
              </div>

              {/* Список сотрудников */}
              <div className="space-y-3 max-h-[calc(80vh-200px)] overflow-y-auto">
                {employees.map((employee) => (
                  <div 
                    key={employee.id} 
                    className="flex items-center justify-between p-3 border border-border/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-foreground/70" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">{employee.team}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleEmployeeToggle(employee.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isEmployeeSelected(employee.id) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary hover:bg-accent'
                      }`}
                    >
                      {isEmployeeSelected(employee.id) ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4 text-foreground/70" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setEmployeeSelectModalOpen(false)}
                className="w-full mt-6 py-3 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors hover:bg-primary/90"
              >
                Готово ({formData.assignedTo.length} выбрано)
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Модальное окно отклонения задачи */}
        <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
          <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden rounded-3xl">
            <DialogTitle className="text-lg font-medium text-foreground text-center">Причина отклонения</DialogTitle>
            <DialogDescription className="sr-only">
              Модальное окно для ввода причины отклонения задачи
            </DialogDescription>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Укажите, что нужно исправить:
                  </label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Опишите что нужно доработать в задаче..."
                    className="bg-input-background min-h-24 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setRejectionModalOpen(false);
                      setRejectionReason('');
                    }}
                    className="flex-1 py-3 px-4 bg-secondary text-foreground rounded-full text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Отменить
                  </button>
                  <button
                    onClick={handleConfirmRejection}
                    disabled={!rejectionReason.trim()}
                    className="flex-1 py-3 px-4 bg-red-500 text-white rounded-full text-sm font-medium transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Модальное окно настройки награды */}
        <Dialog open={rewardModalOpen} onOpenChange={setRewardModalOpen}>
          <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden rounded-3xl">
            <DialogTitle className="text-lg font-medium text-foreground text-center">Настройка награды</DialogTitle>
            <DialogDescription className="sr-only">
              Модальное окно для изменения типа и размера награды за задачу
            </DialogDescription>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Тип награды
                  </label>
                  <select
                    value={tempReward.type}
                    onChange={(e) => setTempReward({ ...tempReward, type: e.target.value as 'XP' | 'G-coin' })}
                    className="w-full p-3 bg-input-background border border-border rounded-lg text-sm"
                  >
                    <option value="XP">Опыт (XP)</option>
                    <option value="G-coin">Коины (G-coin)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Количество
                  </label>
                  <Input
                    type="number"
                    value={tempReward.amount}
                    onChange={(e) => setTempReward({ ...tempReward, amount: parseInt(e.target.value) || 0 })}
                    className="bg-input-background"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setRewardModalOpen(false)}
                    className="flex-1 py-3 px-4 bg-secondary text-foreground rounded-full text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Отменить
                  </button>
                  <button
                    onClick={handleRewardSave}
                    className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors hover:bg-primary/90"
                  >
                    Применить
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}