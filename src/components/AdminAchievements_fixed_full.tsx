import { useState } from 'react';
import { Plus, Trophy, X, Paperclip, ChevronDown, Menu, Edit, History } from './Icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Achievement } from '../types/achievements';

interface AdminAchievementsProps {
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  currentAdminPage?: string;
  setCurrentAdminPage?: (page: string) => void;
}

export function AdminAchievements({ achievements, setAchievements, currentAdminPage = 'achievements', setCurrentAdminPage }: AdminAchievementsProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [moderationModalOpen, setModerationModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedModerationItem, setSelectedModerationItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [rewardType, setRewardType] = useState<'XP' | 'G-coin'>('XP');
  const [rewardAmount, setRewardAmount] = useState<string>('100');
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [moderationSortBy, setModerationSortBy] = useState<'alphabet' | 'date'>('date');
  const [showModerationSort, setShowModerationSort] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const [rejectFile, setRejectFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subtasks: [''],
    image: null as File | null,
    rewardType: 'XP' as 'XP' | 'G-coin',
    rewardAmount: 100
  });



  // Placeholder данные для отображения
  const placeholderAchievements = achievements.length > 0 ? achievements : [
    { 
      id: '1', 
      title: 'Первые шаги', 
      description: 'Выполните первую задачу в системе',
      icon: '🏆',
      isUnlocked: false,
      category: 'general' as const,
      rarity: 'common' as const,
      requirements: { type: 'tasks', target: 1, current: 0 }
    },
    { 
      id: '2', 
      title: 'Командный игрок', 
      description: 'Выполните 5 задач в команде',
      icon: '👥',
      isUnlocked: false,
      category: 'tasks' as const,
      rarity: 'rare' as const,
      requirements: { type: 'team_tasks', target: 5, current: 2 }
    },
    { 
      id: '3', 
      title: 'Эксперт баттлов', 
      description: 'Выиграйте 10 баттлов подряд',
      icon: '⚡',
      isUnlocked: false,
      category: 'battles' as const,
      rarity: 'epic' as const,
      requirements: { type: 'battle_wins', target: 10, current: 2 }
    },
    { 
      id: '4', 
      title: 'Легенда GRITHER', 
      description: 'Достигните максимального уровня',
      icon: '👑',
      isUnlocked: false,
      category: 'progression' as const,
      rarity: 'legendary' as const,
      requirements: { type: 'level', target: 100, current: 5 }
    }
  ];

  // Placeholder данные для модерации
  const moderationItems = [
    {
      id: '1',
      achievementTitle: 'Первые шаги',
      status: 'на проверке',
      employee: 'Алексей Иванов, Команда А',
      progress: 100.0,
      dateSubmitted: '2024-01-15'
    },
    {
      id: '2', 
      achievementTitle: 'Командный игрок',
      status: 'на проверке',
      employee: 'Мария Петрова, Команда Б',
      progress: 100.0,
      dateSubmitted: '2024-01-14'
    },
    {
      id: '3',
      achievementTitle: 'Эксперт баттлов', 
      status: 'на проверке',
      employee: 'Дмитрий Сидоров, Команда В',
      progress: 100.0,
      dateSubmitted: '2024-01-13'
    }
  ];

  const handleCreate = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: formData.title || 'Новое достижение',
      description: formData.description,
      icon: '🏆',
      isUnlocked: false,
      category: 'general',
      rarity: 'common',
      requirements: { 
        type: 'custom', 
        target: 1, 
        current: 0 
      }
    };
    setAchievements([...achievements, newAchievement]);
    setCreateModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subtasks: [''],
      image: null,
      rewardType: 'XP',
      rewardAmount: 100
    });
    setIsEditing(false);
    setIsEditingTitle(false);
  };

  const addSubtask = () => {
    setFormData({
      ...formData,
      subtasks: [...formData.subtasks, '']
    });
  };

  const updateSubtask = (index: number, value: string) => {
    const newSubtasks = [...formData.subtasks];
    newSubtasks[index] = value;
    setFormData({
      ...formData,
      subtasks: newSubtasks
    });
  };

  const removeSubtask = (index: number) => {
    if (formData.subtasks.length > 1) {
      const newSubtasks = formData.subtasks.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        subtasks: newSubtasks
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setRejectFile(file);
    }
  };

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      subtasks: ['Подзадача'],
      image: null,
      rewardType: 'XP',
      rewardAmount: achievement.requirements.target || 100
    });
    setDetailModalOpen(true);
  };

  const handleModerationClick = () => {
    setModerationModalOpen(true);
  };

  const handleApproveAchievement = (item: any) => {
    // Логика одобрения достижения
    console.log('Approved:', item);
  };

  const handleRejectAchievement = (item: any) => {
    setSelectedModerationItem(item);
    setRejectModalOpen(true);
  };

  const handleSubmitReject = () => {
    if (!rejectReason.trim()) {
      alert('Укажите причину отклонения');
      return;
    }
    // Логика отклонения достижения
    console.log('Rejected:', selectedModerationItem, rejectReason, rejectComment, rejectFile);
    setRejectModalOpen(false);
    setRejectReason('');
    setRejectComment('');
    setRejectFile(null);
    setSelectedModerationItem(null);
  };

  const sortedModerationItems = [...moderationItems].sort((a, b) => {
    if (moderationSortBy === 'alphabet') {
      return a.achievementTitle.localeCompare(b.achievementTitle);
    } else {
      return new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime();
    }
  });

  const handleSaveEdit = () => {
    if (selectedAchievement && (isEditing || isEditingTitle)) {
      const updatedAchievements = achievements.map(achievement =>
        achievement.id === selectedAchievement.id
          ? { 
              ...achievement, 
              title: formData.title,
              description: formData.description,
              requirements: {
                ...achievement.requirements,
                target: formData.rewardAmount
              }
            }
          : achievement
      );
      setAchievements(updatedAchievements);
      setIsEditing(false);
      setIsEditingTitle(false);
    }
  };

  const handleRewardClick = () => {
    if (selectedAchievement) {
      setRewardType('XP');
      setRewardAmount(formData.rewardAmount.toString());
      setRewardModalOpen(true);
    }
  };

  const handleRewardSave = () => {
    const newAmount = parseInt(rewardAmount) || 0;
    setFormData({ ...formData, rewardAmount: newAmount, rewardType });
    if (selectedAchievement) {
      const updatedAchievements = achievements.map(achievement =>
        achievement.id === selectedAchievement.id
          ? { 
              ...achievement, 
              requirements: {
                ...achievement.requirements,
                target: newAmount
              }
            }
          : achievement
      );
      setAchievements(updatedAchievements);
    }
    setRewardModalOpen(false);
    setIsEditingAmount(false);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="p-6">

          {/* Управление */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2 glass-card rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground"
              >
                Добавить
              </button>
              <button 
                onClick={handleModerationClick}
                className="px-4 py-2 glass-card rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground"
              >
                Проверка
              </button>
            </div>
          </div>

          {/* Card с достижениями */}
          <div className="px-6">
            <div className="glass-card rounded-2xl apple-shadow p-4">
              {/* Заголовок */}
              <div className="flex items-center justify-center mb-4">
                <h2 className="text-lg font-medium text-foreground text-center">Доступные достижения</h2>
              </div>

              {/* Список достижений */}
              <div className="space-y-3">
                {placeholderAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center justify-between p-3 border border-border/20 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => handleAchievementClick(achievement)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-foreground/70" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {Math.round((achievement.requirements.current / achievement.requirements.target) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
                {placeholderAchievements.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Достижения не найдены
                  </div>
                )}
              </div>
            </div>
          </div>
          

        </div>

        {/* Модальное окно создания достижения */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
            <DialogTitle className="sr-only">Создание достижения</DialogTitle>
            <DialogDescription className="sr-only">
              Модальное окно для создания нового достижения с указанием названия, описания, подзадач и награды
            </DialogDescription>
            <div className="p-6 pt-2">
              <h2 className="text-lg font-medium text-foreground text-center mb-4">Условия выполнения достижения</h2>
              <div className="space-y-6">
                {/* Поле названия достижения */}
                <div className="text-center">
                  <Input
                    placeholder="Название достижения"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-transparent border border-border rounded-lg text-center font-medium"
                  />
                </div>

                {/* Изображение и описание */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex gap-4">
                    {/* Область для изображения */}
                    <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-foreground/70" />
                    </div>

                    {/* Поле описания */}
                    <div className="flex-1">
                      <Textarea
                        placeholder="Краткое описание того, что нужно сделать для получения этого достижения"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-transparent border-none resize-none min-h-16 text-sm focus:outline-none p-0"
                      />
                      
                      {/* Подзадачи */}
                      <div className="mt-4 space-y-2">
                        {formData.subtasks.map((subtask, index) => (
                          <div key={index} className="flex items-center gap-2 pl-2 border-l-2 border-muted">
                            <Input
                              placeholder="Подзадача"
                              value={subtask}
                              onChange={(e) => updateSubtask(index, e.target.value)}
                              className="bg-transparent border-none text-sm p-0 h-6"
                            />
                            <div className="flex gap-1">
                              <button className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors">
                                <Paperclip className="w-3 h-3 text-muted-foreground" />
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
                          </div>
                        ))}
                        
                        {/* Кнопка добавления подзадачи */}
                        <button
                          onClick={addSubtask}
                          className="flex items-center gap-2 pl-2 py-1 text-sm text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Добавить подзадачу</span>
                        </button>
                      </div>
                    </div>

                    {/* Кнопка загрузки изображения */}
                    <div className="flex flex-col gap-1 pt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload-create"
                      />
                      <label
                        htmlFor="image-upload-create"
                        className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors cursor-pointer"
                      >
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Награда */}
                <div className="text-center">
                  <div className="text-sm font-medium text-foreground">
                    Награда: {formData.rewardAmount} {formData.rewardType}
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-3 pt-4 mt-6">
                  <button
                    onClick={() => {
                      setCreateModalOpen(false);
                      resetForm();
                    }}
                    className="flex-1 py-3 px-4 bg-secondary text-foreground rounded-full text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Отменить
                  </button>
                  <button
                    onClick={() => {
                      handleCreate();
                      resetForm();
                    }}
                    className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors hover:bg-primary/90"
                  >
                    Применить
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Модальное окно деталей достижения */}
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden rounded-3xl">
            <DialogTitle className="sr-only">Редактирование достижения</DialogTitle>
            <DialogDescription className="sr-only">
              Модальное окно с подробной информацией о достижении и возможностью редактирования названия, описания и награды
            </DialogDescription>
            <div className="p-6 pt-2">
              <h2 className="text-lg font-medium text-foreground text-center mb-4">Условия выполнения достижения</h2>
              {selectedAchievement && (
                <div className="space-y-6">
                  {/* Поле заголовка */}
                  <div className="text-center">
                    {isEditingTitle ? (
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        onBlur={() => setIsEditingTitle(false)}
                        className="bg-transparent border border-border rounded-lg text-center font-medium"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setIsEditingTitle(true)}
                        className="text-lg font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded px-2 py-1 transition-colors"
                      >
                        {formData.title}
                      </button>
                    )}
                  </div>

                  {/* Изображение и описание */}
                  <div className="glass-card rounded-2xl p-4">
                    <div className="flex gap-4">
                      {/* Область для изображения */}
                      <div className="relative w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-foreground/70" />
                        {/* Кнопка редактирования изображения */}
                        <div className="absolute -top-1 -right-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload-detail"
                          />
                          <label
                            htmlFor="image-upload-detail"
                            className="w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform apple-shadow"
                          >
                            <Edit className="w-3 h-3 text-white" />
                          </label>
                        </div>
                      </div>

                      {/* Поле описания */}
                      <div className="flex-1">
                        <div className="relative">
                          {isEditing ? (
                            <Textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              className="bg-transparent border-none resize-none min-h-16 text-sm focus:outline-none p-0"
                            />
                          ) : (
                            <div className="text-sm text-foreground min-h-16 py-2">
                              {formData.description}
                            </div>
                          )}
                        </div>
                        
                        {/* Подзадача */}
                        <div className="mt-4 pl-2 border-l-2 border-muted">
                          <div className="text-sm text-muted-foreground">Подзадача</div>
                        </div>
                      </div>

                      {/* Кнопки редактирования справа */}
                      <div className="flex flex-col gap-1 pt-2">
                        <button 
                          onClick={() => setIsEditing(!isEditing)}
                          className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors">
                          <Paperclip className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Награда - кликабельная */}
                  <div className="text-center">
                    <button
                      onClick={handleRewardClick}
                      className="text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded px-2 py-1 transition-colors"
                    >
                      Награда: {formData.rewardAmount} {formData.rewardType}
                    </button>
                  </div>

                  {/* Кнопки действий */}
                  <div className="flex gap-3 pt-4 mt-6">
                    <button
                      onClick={() => {
                        setDetailModalOpen(false);
                        resetForm();
                      }}
                      className="flex-1 py-3 px-4 bg-secondary text-foreground rounded-full text-sm font-medium transition-colors hover:bg-accent"
                    >
                      Отменить
                    </button>
                    <button
                      onClick={() => {
                        if (isEditing || isEditingTitle) {
                          handleSaveEdit();
                        }
                        setDetailModalOpen(false);
                        resetForm();
                      }}
                      className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors hover:bg-primary/90"
                    >
                      Применить
                    </button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Модальное окно редактирования награды */}
        <Dialog open={rewardModalOpen} onOpenChange={setRewardModalOpen}>
          <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden rounded-3xl">
            <DialogTitle className="text-lg font-medium text-foreground text-center">Настройка награды</DialogTitle>
            <DialogDescription className="sr-only">
              Модальное окно для настройки типа и количества награды за достижение
            </DialogDescription>
            <div className="p-6 pt-2">
              <div className="space-y-6">
                {/* Тип награды */}
                <div className="text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setRewardType('XP')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        rewardType === 'XP' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-foreground hover:bg-accent'
                      }`}
                    >
                      XP
                    </button>
                    <button
                      onClick={() => setRewardType('G-coin')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        rewardType === 'G-coin' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-foreground hover:bg-accent'
                      }`}
                    >
                      G-coin
                    </button>
                  </div>
                </div>

                {/* Количество */}
                <div className="text-center">
                  <Input
                    type="number"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                    className="bg-transparent border border-border rounded-lg text-center font-medium"
                    min="1"
                  />
                </div>

                {/* Кнопки действий */}
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
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Модальное окно модерации достижений */}
        <Dialog open={moderationModalOpen} onOpenChange={setModerationModalOpen}>
          <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
            <DialogTitle className="text-lg font-medium text-foreground text-center">Модерация достижений</DialogTitle>
            <DialogDescription className="sr-only">
              Модальное окно для проверки и модерации достижений, отправленных пользователями на проверку
            </DialogDescription>
            <div className="p-6">
              {/* Заголовок с сортировкой */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-foreground">
                  Достижения на проверке ({sortedModerationItems.length})
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowModerationSort(!showModerationSort)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Menu className="w-4 h-4 text-foreground/70" />
                  </button>
                  
                  {showModerationSort && (
                    <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg z-10 min-w-[160px]">
                      <button
                        onClick={() => {
                          setModerationSortBy('date');
                          setShowModerationSort(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors ${
                          moderationSortBy === 'date' ? 'text-primary font-medium' : 'text-foreground'
                        }`}
                      >
                        По дате
                      </button>
                      <button
                        onClick={() => {
                          setModerationSortBy('alphabet');
                          setShowModerationSort(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors ${
                          moderationSortBy === 'alphabet' ? 'text-primary font-medium' : 'text-foreground'
                        }`}
                      >
                        По алфавиту
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Список достижений на модерации */}
              <div className="space-y-3">
                {sortedModerationItems.length > 0 ? (
                  sortedModerationItems.map((item) => (
                    <div key={item.id} className="glass-card rounded-2xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground mb-1">
                            {item.achievementTitle}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {item.employee}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Прогресс: {item.progress}% • {item.dateSubmitted}
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-orange-500/20 text-orange-600 rounded-full">
                          {item.status}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveAchievement(item)}
                          className="flex-1 py-2 px-3 bg-green-500/20 text-green-600 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors"
                        >
                          Одобрить
                        </button>
                        <button
                          onClick={() => handleRejectAchievement(item)}
                          className="flex-1 py-2 px-3 bg-red-500/20 text-red-600 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                        >
                          Отклонить
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground text-sm">
                      Нет достижений на проверке
                    </div>
                  </div>
                )}
              </div>

              {/* Кнопка закрытия */}
              <div className="pt-6 mt-6 border-t border-border/20">
                <button
                  onClick={() => {
                    setModerationModalOpen(false);
                    setShowModerationSort(false);
                  }}
                  className="w-full py-3 px-4 bg-secondary text-foreground rounded-full text-sm font-medium transition-colors hover:bg-accent"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Модальное окно отклонения достижения */}
        <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
          <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden rounded-3xl">
            <DialogTitle className="text-lg font-medium text-foreground text-center">Отклонение достижения</DialogTitle>
            <DialogDescription className="sr-only">
              Модальное окно для указания причины отклонения достижения с возможностью добавления комментария и файла
            </DialogDescription>
            <div className="p-6 pt-2">
              <div className="space-y-4">
                {/* Информация о достижении */}
                {selectedModerationItem && (
                  <div className="glass-card rounded-xl p-3 mb-4">
                    <div className="text-sm font-medium text-foreground mb-1">
                      {selectedModerationItem.achievementTitle}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {selectedModerationItem.employee}
                    </div>
                  </div>
                )}

                {/* Причина отклонения */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Причина отклонения *
                  </label>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Укажите причину отклонения..."
                    className="bg-transparent border border-border rounded-lg text-sm min-h-[80px]"
                  />
                </div>

                {/* ��ополнительный комментарий */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Дополнительный комментарий
                  </label>
                  <Textarea
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    placeholder="Дополнительные поя��нения (опционально)"
                    className="bg-transparent border border-border rounded-lg text-sm min-h-[60px]"
                  />
                </div>

                {/* Прикрепление файла */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Прикрепить файл
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-2 border border-border rounded-lg bg-input-background text-muted-foreground text-sm">
                      {rejectFile ? rejectFile.name : 'Файл не выбран'}
                    </div>
                    <input
                      type="file"
                      id="reject-file-upload"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="reject-file-upload"
                      className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                      <Paperclip className="w-4 h-4" />
                    </label>
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setRejectModalOpen(false);
                      setRejectReason('');
                      setRejectComment('');
                      setRejectFile(null);
                      setSelectedModerationItem(null);
                    }}
                    className="flex-1 py-3 px-4 bg-secondary text-foreground rounded-full text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Отменить
                  </button>
                  <button
                    onClick={handleSubmitReject}
                    className="flex-1 py-3 px-4 bg-red-500 text-white rounded-full text-sm font-medium transition-colors hover:bg-red-600"
                  >
                    Отклонить
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