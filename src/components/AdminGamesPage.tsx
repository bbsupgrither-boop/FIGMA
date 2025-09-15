import { useState } from 'react';
import { ArrowLeft, Plus, Gamepad2, CircleDot, Dices, Clock, Eye, EyeOff, Edit, Trash2, X, Home, Users, Zap, Trophy, CheckSquare, ShoppingBag, Box } from './Icons';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

interface AdminGamesPageProps {
  onBack: () => void;
  onNavigateToSection: (section: string) => void;
}

interface Game {
  id: string;
  name: string;
  description: string;
  cost: number;
  minReward: number;
  maxReward: number;
  cooldownHours: number;
  type: 'wheel' | 'rps' | 'casino' | 'custom';
  isActive: boolean;
  settings?: {
    [key: string]: any;
  };
}

const gameTypes = [
  { id: 'wheel', name: 'Колесо фортуны', icon: CircleDot },
  { id: 'rps', name: 'Камень, ножницы, бумага', icon: Gamepad2 },
  { id: 'casino', name: 'Казино', icon: Dices },
  { id: 'custom', name: 'Кастомная игра', icon: Gamepad2 }
];

export function AdminGamesPage({ onBack, onNavigateToSection }: AdminGamesPageProps) {
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

  // Добавляем тестовую игру для демонстрации
  const [games, setGames] = useState<Game[]>([
    {
      id: '1',
      name: 'ППП',
      description: 'Колесо фортуны • Кулдаун 300с',
      cost: 0,
      minReward: 0,
      maxReward: 0,
      cooldownHours: 24,
      type: 'wheel',
      isActive: true
    }
  ]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);


  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: 0,
    minReward: 10,
    maxReward: 100,
    cooldownHours: 24,
    type: 'wheel' as Game['type'],
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cost: 0,
      minReward: 10,
      maxReward: 100,
      cooldownHours: 24,
      type: 'wheel',
      isActive: true
    });
  };

  const handleCreateGame = () => {
    const newGame: Game = {
      id: Date.now().toString(),
      ...formData
    };
    setGames(prev => [...prev, newGame]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditGame = () => {
    if (!selectedGame) return;
    
    setGames(prev => prev.map(game => 
      game.id === selectedGame.id 
        ? { ...game, ...formData }
        : game
    ));
    setIsEditModalOpen(false);
    setSelectedGame(null);
    resetForm();
  };

  const handleDeleteGame = (gameId: string) => {
    setGames(prev => prev.filter(game => game.id !== gameId));
  };

  const handleToggleGameStatus = (gameId: string) => {
    setGames(prev => prev.map(game => 
      game.id === gameId 
        ? { ...game, isActive: !game.isActive }
        : game
    ));
  };

  const openEditModal = (game: Game) => {
    setSelectedGame(game);
    setFormData({
      name: game.name,
      description: game.description,
      cost: game.cost,
      minReward: game.minReward,
      maxReward: game.maxReward,
      cooldownHours: game.cooldownHours,
      type: game.type,
      isActive: game.isActive
    });
    setIsEditModalOpen(true);
  };

  const activeGames = games.filter(game => game.isActive);
  const inactiveGames = games.filter(game => !game.isActive);

  const getGameTypeIcon = (type: string) => {
    const gameType = gameTypes.find(gt => gt.id === type);
    return gameType ? gameType.icon : Gamepad2;
  };

  const getGameTypeName = (type: string) => {
    const gameType = gameTypes.find(gt => gt.id === type);
    return gameType ? gameType.name : 'Неизвестная игра';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 sm:p-6 space-y-6 max-w-full overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-medium text-foreground">Управление играми</h1>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-2xl apple-shadow">
            <div className="text-center">
              <div className="text-2xl font-medium text-foreground mb-1">
                {games.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Всего игр
              </div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl apple-shadow">
            <div className="text-center">
              <div className="text-2xl font-medium text-green-600 mb-1">
                {activeGames.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Активных
              </div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl apple-shadow">
            <div className="text-center">
              <div className="text-2xl font-medium text-muted-foreground mb-1">
                {inactiveGames.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Неактивных
              </div>
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:scale-[0.98] transition-transform apple-shadow"
          >
            <Plus className="w-4 h-4" />
            Создать игру
          </button>
        </div>

        {/* Список игр */}
        <div className="space-y-4">
          {games.length > 0 ? (
            games.map((game) => {
              const GameIcon = getGameTypeIcon(game.type);
              return (
                <div key={game.id} className="glass-card rounded-2xl p-4 apple-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center shrink-0">
                      <GameIcon className="w-6 h-6 text-foreground/70" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground truncate">
                            {game.name}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {game.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleToggleGameStatus(game.id)}
                            className="p-2 hover:bg-black/5 rounded-lg transition-colors shrink-0"
                            title={game.isActive ? 'Деактивировать' : 'Активировать'}
                          >
                            {game.isActive ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                          <button
                            onClick={() => openEditModal(game)}
                            className="p-2 hover:bg-black/5 rounded-lg transition-colors shrink-0"
                            title="Редактировать"
                          >
                            <Edit className="w-4 h-4 text-foreground/70" />
                          </button>
                          <button
                            onClick={() => handleDeleteGame(game.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors shrink-0"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Игр: </span>
                          <span className="text-foreground">
                            {game.cost === 0 ? '0' : game.cost}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Наград: </span>
                          <span className="text-foreground">
                            {game.maxReward === 0 ? '0' : game.maxReward}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 text-sm gap-2">
                        <div className="text-muted-foreground">
                          Обновлено: {new Date().toLocaleDateString()} • Опубликовано: {new Date().toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <button className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm hover:scale-[0.98] transition-transform">
                          <Eye className="w-4 h-4" />
                          Предпросмотр
                        </button>
                        <button 
                          onClick={() => openEditModal(game)}
                          className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm hover:scale-[0.98] transition-transform"
                        >
                          <Edit className="w-4 h-4" />
                          Редактировать
                        </button>
                        <button className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 hover:scale-[0.98] transition-transform">
                          <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center apple-shadow">
              <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Игр пока нет
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно создания игры */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-0 max-h-[80vh] flex flex-col [&>button]:hidden">
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <DialogTitle className="text-lg font-medium text-foreground">
                Создать игру
              </DialogTitle>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-foreground/70" />
              </button>
            </div>
            
            <DialogDescription className="sr-only">
              Форма создания новой мини-игры
            </DialogDescription>

            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Тип игры */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Тип игры
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {gameTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setFormData(prev => ({ ...prev, type: type.id as Game['type'] }))}
                        className={`p-3 rounded-xl text-left transition-all ${
                          formData.type === type.id
                            ? 'bg-primary text-primary-foreground'
                            : 'glass-card text-foreground hover:scale-[0.98]'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2" />
                        <div className="text-sm font-medium">{type.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Название */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Название игры
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Введите название игры"
                />
              </div>

              {/* Описание */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Описание игры"
                  rows={3}
                />
              </div>

              {/* Стоимость */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Стоимость участия (монет)
                </label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Награды */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Мин. награда
                  </label>
                  <input
                    type="number"
                    value={formData.minReward}
                    onChange={(e) => setFormData(prev => ({ ...prev, minReward: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Макс. награда
                  </label>
                  <input
                    type="number"
                    value={formData.maxReward}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxReward: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
              </div>

              {/* Кулдаун */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Кулдаун (часов)
                </label>
                <input
                  type="number"
                  value={formData.cooldownHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, cooldownHours: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="flex-1 glass-card rounded-2xl p-3 text-sm font-medium text-foreground hover:scale-[0.98] transition-transform"
              >
                Отменить
              </button>
              <button
                onClick={handleCreateGame}
                disabled={!formData.name.trim()}
                className={`flex-1 rounded-2xl p-3 text-sm font-medium transition-transform ${
                  formData.name.trim()
                    ? 'bg-primary text-primary-foreground hover:scale-[0.98]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Создать
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно редактирования игры */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-0 max-h-[80vh] flex flex-col [&>button]:hidden">
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <DialogTitle className="text-lg font-medium text-foreground">
                Редактировать игру
              </DialogTitle>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedGame(null);
                  resetForm();
                }}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-foreground/70" />
              </button>
            </div>
            
            <DialogDescription className="sr-only">
              Форма редактирования мини-игры
            </DialogDescription>

            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Тип игры */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Тип игры
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {gameTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setFormData(prev => ({ ...prev, type: type.id as Game['type'] }))}
                        className={`p-3 rounded-xl text-left transition-all ${
                          formData.type === type.id
                            ? 'bg-primary text-primary-foreground'
                            : 'glass-card text-foreground hover:scale-[0.98]'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2" />
                        <div className="text-sm font-medium">{type.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Название */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Название игры
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Введите название игры"
                />
              </div>

              {/* Описание */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Описание игры"
                  rows={3}
                />
              </div>

              {/* Стоимость */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Стоимость участия (монет)
                </label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Награды */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Мин. награда
                  </label>
                  <input
                    type="number"
                    value={formData.minReward}
                    onChange={(e) => setFormData(prev => ({ ...prev, minReward: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Макс. награда
                  </label>
                  <input
                    type="number"
                    value={formData.maxReward}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxReward: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
              </div>

              {/* Кулдаун */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Кулдаун (часов)
                </label>
                <input
                  type="number"
                  value={formData.cooldownHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, cooldownHours: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedGame(null);
                  resetForm();
                }}
                className="flex-1 glass-card rounded-2xl p-3 text-sm font-medium text-foreground hover:scale-[0.98] transition-transform"
              >
                Отменить
              </button>
              <button
                onClick={handleEditGame}
                disabled={!formData.name.trim()}
                className={`flex-1 rounded-2xl p-3 text-sm font-medium transition-transform ${
                  formData.name.trim()
                    ? 'bg-primary text-primary-foreground hover:scale-[0.98]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Сохранить
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Быстрая навигация */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/20">
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-4">
            {navigationItems.slice(0, 4).map((item, index) => {
              const Icon = item.icon;
              const isActive = item.section === 'games';
              return (
                <button 
                  key={index} 
                  className="flex flex-col items-center text-center"
                  onClick={() => onNavigateToSection(item.section)}
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
              const isActive = item.section === 'games';
              return (
                <button 
                  key={index} 
                  className="flex flex-col items-center text-center"
                  onClick={() => onNavigateToSection(item.section)}
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
  );
}