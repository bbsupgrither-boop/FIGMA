import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Play, Pause, Archive, Copy, Check, ChevronLeft, ChevronRight, Home, Users, Zap, Trophy, CheckSquare, ShoppingBag, Gamepad2, Box, CircleDot, Scissors, DollarSign, X, Settings } from './Icons';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Game, GameType, GameStatus, GameWizardState, WheelSector, RPSConfig, SlotsConfig, SlotSymbol, SlotCombination, GameReward, RewardType } from '../types/games';

interface AdminGamesPageNewProps {
  onBack: () => void;
  onNavigateToSection: (section: string) => void;
}

export function AdminGamesPageNew({ onBack, onNavigateToSection }: AdminGamesPageNewProps) {
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
      type: 'wheel',
      status: 'draft',
      icon: '🎮',
      config: {
        sectors: [],
        spinAnimationMs: 3000
      },
      rewards: [],
      access: {
        visibility: 'public',
        cooldownSeconds: 300
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalPlays: 0,
        totalRewards: 0,
        uniquePlayers: 0
      }
    }
  ]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Состояние мастера создания игры
  const [wizardState, setWizardState] = useState<GameWizardState>({
    currentStep: 0,
    steps: [
      { id: 'type', title: 'Тип игры', description: 'Выберите тип мини-игры', isComplete: false },
      { id: 'basic', title: 'Основное', description: 'Название, описание, иконка', isComplete: false },
      { id: 'config', title: 'Параметры', description: 'Настройки игры', isComplete: false },
      { id: 'rewards', title: 'Награды', description: 'Система наград', isComplete: false },
      { id: 'access', title: 'Доступ', description: 'Видимость и кулдаун', isComplete: false },
      { id: 'preview', title: 'Предпросмотр', description: 'Проверка и��ры', isComplete: false },
      { id: 'publish', title: 'Публикация', description: 'Сохранение игры', isComplete: false }
    ],
    gameData: {
      type: undefined,
      status: 'draft',
      access: {
        visibility: 'public',
        cooldownSeconds: 300
      },
      rewards: []
    }
  });

  const gameTypes = [
    { 
      id: 'wheel' as GameType, 
      name: 'Колесо фортуны', 
      icon: CircleDot,
      description: 'Крутите колесо и получайте случайные награды'
    },
    { 
      id: 'rps' as GameType, 
      name: 'Камень, ножницы, бумага', 
      icon: Scissors,
      description: 'Классическая ��гра против бота или других игроков'
    },
    { 
      id: 'slots' as GameType, 
      name: 'Слоты', 
      icon: DollarSign,
      description: 'Автомат с барабанами и комбинациями символов'
    }
  ];

  const rewardTypes = [
    { id: 'xp' as RewardType, name: 'Опыт (XP)', icon: '⭐' },
    { id: 'currency' as RewardType, name: 'Валюта', icon: '💰' },
    { id: 'loot' as RewardType, name: 'Предмет', icon: '🎁' },
    { id: 'none' as RewardType, name: 'Без награды', icon: '❌' }
  ];

  const resetWizard = () => {
    setWizardState({
      currentStep: 0,
      steps: wizardState.steps.map(s => ({ ...s, isComplete: false })),
      gameData: {
        type: undefined,
        status: 'draft',
        access: {
          visibility: 'public',
          cooldownSeconds: 300
        },
        rewards: []
      }
    });
  };

  const updateWizardData = (data: Partial<Game>) => {
    setWizardState(prev => ({
      ...prev,
      gameData: { ...prev.gameData, ...data }
    }));
  };

  const completeStep = (stepIndex: number) => {
    setWizardState(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => 
        index === stepIndex ? { ...step, isComplete: true } : step
      )
    }));
  };

  const nextStep = () => {
    if (wizardState.currentStep < wizardState.steps.length - 1) {
      completeStep(wizardState.currentStep);
      setWizardState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }));
    }
  };

  const prevStep = () => {
    if (wizardState.currentStep > 0) {
      setWizardState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }));
    }
  };

  const handleGameStatusChange = (gameId: string, newStatus: GameStatus) => {
    setGames(prev => prev.map(game => 
      game.id === gameId 
        ? { 
            ...game, 
            status: newStatus,
            updatedAt: new Date().toISOString(),
            publishedAt: newStatus === 'published' ? new Date().toISOString() : game.publishedAt
          }
        : game
    ));
  };

  const handleDeleteGame = (gameId: string) => {
    setGames(prev => prev.filter(game => game.id !== gameId));
  };

  const copyGameJson = (game: Game) => {
    const json = JSON.stringify(game, null, 2);
    navigator.clipboard.writeText(json);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const createGame = () => {
    if (!wizardState.gameData.name || !wizardState.gameData.type) return;

    const newGame: Game = {
      id: Date.now().toString(),
      name: wizardState.gameData.name,
      description: wizardState.gameData.description || '',
      type: wizardState.gameData.type,
      status: wizardState.gameData.status || 'draft',
      icon: wizardState.gameData.icon,
      config: wizardState.gameData.config || getDefaultConfig(wizardState.gameData.type),
      rewards: wizardState.gameData.rewards || [],
      access: wizardState.gameData.access || { visibility: 'public', cooldownSeconds: 300 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: wizardState.gameData.status === 'published' ? new Date().toISOString() : undefined,
      stats: {
        totalPlays: 0,
        totalRewards: 0,
        uniquePlayers: 0
      }
    };

    setGames(prev => [...prev, newGame]);
    setIsWizardOpen(false);
    resetWizard();
  };

  const getDefaultConfig = (type: GameType) => {
    switch (type) {
      case 'wheel':
        return {
          sectors: [
            { label: '10 XP', weight: 40, rewardType: 'xp' as RewardType, rewardValue: 10 },
            { label: '50 монет', weight: 30, rewardType: 'currency' as RewardType, rewardValue: 50 },
            { label: '100 монет', weight: 20, rewardType: 'currency' as RewardType, rewardValue: 100 },
            { label: 'Пусто', weight: 10, rewardType: 'none' as RewardType, rewardValue: 0 }
          ],
          spinAnimationMs: 3000
        };
      case 'rps':
        return {
          mode: 'pve' as const,
          rounds: 1,
          winReward: { type: 'currency' as RewardType, value: 50 },
          drawReward: { type: 'currency' as RewardType, value: 10 }
        };
      case 'slots':
        return {
          reels: 3,
          symbols: [
            { id: 'cherry', label: 'Вишня', icon: '🍒', rarity: 1 },
            { id: 'lemon', label: 'Лимон', icon: '🍋', rarity: 1 },
            { id: 'grape', label: 'Виноград', icon: '🍇', rarity: 2 },
            { id: 'bell', label: 'Колокол', icon: '🔔', rarity: 3 },
            { id: 'star', label: 'Звезда', icon: '⭐', rarity: 5 }
          ],
          combinations: [
            { pattern: ['cherry', 'cherry', 'cherry'], multiplier: 10, description: 'Три вишни' },
            { pattern: ['star', 'star', 'star'], multiplier: 100, description: 'Три звезды' }
          ],
          spinDurationMs: 2000
        };
      default:
        return {};
    }
  };

  const renderWizardStep = () => {
    const currentStepData = wizardState.steps[wizardState.currentStep];
    
    switch (currentStepData.id) {
      case 'type':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-foreground mb-2">Выберите тип игры</h3>
              <p className="text-sm text-muted-foreground">Каждый тип имеет свои особенности и настройки</p>
            </div>
            <div className="grid gap-4">
              {gameTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = wizardState.gameData.type === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => updateWizardData({ type: type.id })}
                    className={`p-4 rounded-2xl text-left transition-all ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'glass-card hover:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-white/20' : 'bg-secondary'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1">{type.name}</div>
                        <div className={`text-sm ${isSelected ? 'opacity-90' : 'text-muted-foreground'}`}>
                          {type.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'basic':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-foreground mb-2">Основная информация</h3>
              <p className="text-sm text-muted-foreground">Название и описание игры</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Название игры *
                </label>
                <Input
                  value={wizardState.gameData.name || ''}
                  onChange={(e) => updateWizardData({ name: e.target.value })}
                  placeholder="Введите название игры"
                  className="glass-card"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Описание
                </label>
                <Textarea
                  value={wizardState.gameData.description || ''}
                  onChange={(e) => updateWizardData({ description: e.target.value })}
                  placeholder="Краткое описание игры"
                  className="glass-card resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Иконка (emoji)
                </label>
                <Input
                  value={wizardState.gameData.icon || ''}
                  onChange={(e) => updateWizardData({ icon: e.target.value })}
                  placeholder="🎮"
                  className="glass-card"
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        );

      case 'config':
        return renderGameConfigStep();

      case 'rewards':
        return renderRewardsStep();

      case 'access':
        return renderAccessStep();

      case 'preview':
        return renderPreviewStep();

      case 'publish':
        return renderPublishStep();

      default:
        return (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              Шаг "{currentStepData.title}" в разработке
            </div>
          </div>
        );
    }
  };

  const canProceedToNext = () => {
    const currentStepData = wizardState.steps[wizardState.currentStep];
    
    switch (currentStepData.id) {
      case 'type':
        return !!wizardState.gameData.type;
      case 'basic':
        return !!wizardState.gameData.name?.trim();
      case 'config':
        return !!wizardState.gameData.config;
      case 'rewards':
        return true; // Награды не обязательны
      case 'access':
        return !!wizardState.gameData.access?.cooldownSeconds;
      case 'preview':
        return true;
      case 'publish':
        return !!wizardState.gameData.status;
      default:
        return true;
    }
  };

  const getStatusColor = (status: GameStatus) => {
    switch (status) {
      case 'published': return 'text-green-600';
      case 'draft': return 'text-orange-500';
      case 'archived': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getStatusLabel = (status: GameStatus) => {
    switch (status) {
      case 'published': return 'Опубликовано';
      case 'draft': return 'Черновик';
      case 'archived': return 'Архив';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderGameConfigStep = () => {
    const gameType = wizardState.gameData.type;
    
    if (!gameType) return <div>Сначала выберите тип игры</div>;

    switch (gameType) {
      case 'wheel':
        return renderWheelConfig();
      case 'rps':
        return renderRPSConfig();
      case 'slots':
        return renderSlotsConfig();
      default:
        return <div>Неизвестный тип игры</div>;
    }
  };

  const renderWheelConfig = () => {
    const config = wizardState.gameData.config as WheelConfig || { sectors: [], spinAnimationMs: 3000 };
    
    const updateWheelConfig = (newConfig: Partial<WheelConfig>) => {
      updateWizardData({ config: { ...config, ...newConfig } });
    };
    
    const addSector = () => {
      const newSector: WheelSector = {
        label: 'Новый сектор',
        weight: 10,
        rewardType: 'none',
        rewardValue: 0
      };
      updateWheelConfig({ sectors: [...config.sectors, newSector] });
    };
    
    const updateSector = (index: number, sector: Partial<WheelSector>) => {
      const newSectors = [...config.sectors];
      newSectors[index] = { ...newSectors[index], ...sector };
      updateWheelConfig({ sectors: newSectors });
    };
    
    const removeSector = (index: number) => {
      updateWheelConfig({ sectors: config.sectors.filter((_, i) => i !== index) });
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-foreground mb-2">Настройки колеса фортуны</h3>
          <p className="text-sm text-muted-foreground">Добавьте секторы и настройте анимацию</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Время анимации (мс)
            </label>
            <Input
              type="number"
              value={config.spinAnimationMs}
              onChange={(e) => updateWheelConfig({ spinAnimationMs: parseInt(e.target.value) || 3000 })}
              className="glass-card"
              min="1000"
              max="10000"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Секторы колеса</label>
            <button
              onClick={addSector}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:scale-[0.98] transition-transform text-sm"
            >
              <Plus className="w-4 h-4" />
              Добавить сектор
            </button>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {config.sectors.map((sector, index) => (
              <div key={index} className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">Сектор {index + 1}</span>
                  <button
                    onClick={() => removeSector(index)}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Название</label>
                    <Input
                      value={sector.label}
                      onChange={(e) => updateSector(index, { label: e.target.value })}
                      className="glass-card text-sm"
                      placeholder="Название сектора"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Вес (%)</label>
                    <Input
                      type="number"
                      value={sector.weight}
                      onChange={(e) => updateSector(index, { weight: parseInt(e.target.value) || 0 })}
                      className="glass-card text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Тип награды</label>
                    <Select
                      value={sector.rewardType}
                      onValueChange={(value: RewardType) => updateSector(index, { rewardType: value })}
                    >
                      <SelectTrigger className="glass-card text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {rewardTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.icon} {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Количество</label>
                    <Input
                      type="number"
                      value={sector.rewardValue}
                      onChange={(e) => updateSector(index, { rewardValue: parseInt(e.target.value) || 0 })}
                      className="glass-card text-sm"
                      min="0"
                      disabled={sector.rewardType === 'none'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {config.sectors.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Добавьте секторы для колеса
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRPSConfig = () => {
    const config = wizardState.gameData.config as RPSConfig || {
      mode: 'pve',
      rounds: 1,
      winReward: { type: 'currency', value: 50 }
    };
    
    const updateRPSConfig = (newConfig: Partial<RPSConfig>) => {
      updateWizardData({ config: { ...config, ...newConfig } });
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-foreground mb-2">Настройки камень-ножницы-бумага</h3>
          <p className="text-sm text-muted-foreground">Режим игры и награды</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Режим игры</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateRPSConfig({ mode: 'pve' })}
                className={`p-3 rounded-xl text-left transition-all ${
                  config.mode === 'pve' ? 'bg-primary text-primary-foreground' : 'glass-card'
                }`}
              >
                <div className="font-medium">Против бота (PvE)</div>
                <div className={`text-sm ${config.mode === 'pve' ? 'opacity-90' : 'text-muted-foreground'}`}>
                  Игра против компьютера
                </div>
              </button>
              <button
                onClick={() => updateRPSConfig({ mode: 'pvp' })} 
                className={`p-3 rounded-xl text-left transition-all ${
                  config.mode === 'pvp' ? 'bg-primary text-primary-foreground' : 'glass-card'
                }`}
              >
                <div className="font-medium">Против игрока (PvP)</div>
                <div className={`text-sm ${config.mode === 'pvp' ? 'opacity-90' : 'text-muted-foreground'}`}>
                  Игра против других игроков
                </div>
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Количество раундов</label>
            <Input
              type="number"
              value={config.rounds}
              onChange={(e) => updateRPSConfig({ rounds: parseInt(e.target.value) || 1 })}
              className="glass-card"
              min="1"
              max="10"
            />
          </div>
          
          <div className="glass-card rounded-xl p-4">
            <h4 className="font-medium text-foreground mb-3">Награда за победу</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Тип награды</label>
                <Select
                  value={config.winReward.type}
                  onValueChange={(value: RewardType) => 
                    updateRPSConfig({ winReward: { ...config.winReward, type: value } })
                  }
                >
                  <SelectTrigger className="glass-card text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rewardTypes.filter(t => t.id !== 'none').map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Количество</label>
                <Input
                  type="number"
                  value={config.winReward.value}
                  onChange={(e) => 
                    updateRPSConfig({ winReward: { ...config.winReward, value: parseInt(e.target.value) || 0 } })
                  }
                  className="glass-card text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSlotsConfig = () => {
    const config = wizardState.gameData.config as SlotsConfig || {
      reels: 3,
      symbols: [],
      combinations: [],
      spinDurationMs: 2000
    };
    
    const updateSlotsConfig = (newConfig: Partial<SlotsConfig>) => {
      updateWizardData({ config: { ...config, ...newConfig } });
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-foreground mb-2">Настройки слотов</h3>
          <p className="text-sm text-muted-foreground">Барабаны, символы и комбинации</p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Количество барабанов</label>
              <Input
                type="number"
                value={config.reels}
                onChange={(e) => updateSlotsConfig({ reels: parseInt(e.target.value) || 3 })}
                className="glass-card"
                min="3"
                max="5"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Время прокрутки (мс)</label>
              <Input
                type="number"
                value={config.spinDurationMs}
                onChange={(e) => updateSlotsConfig({ spinDurationMs: parseInt(e.target.value) || 2000 })}
                className="glass-card"
                min="1000"
                max="5000"
              />
            </div>
          </div>
          
          <div className="text-center py-8 text-muted-foreground">
            Подробные настройки символов и комбинаций будут добавлены в следующей версии
          </div>
        </div>
      </div>
    );
  };

  const renderRewardsStep = () => {
    const rewards = wizardState.gameData.rewards || [];
    
    const addReward = () => {
      const newReward: GameReward = {
        condition: 'за победу',
        type: 'currency',
        value: 10,
        description: 'Награда за выполнение условия'
      };
      updateWizardData({ rewards: [...rewards, newReward] });
    };
    
    const updateReward = (index: number, reward: Partial<GameReward>) => {
      const newRewards = [...rewards];
      newRewards[index] = { ...newRewards[index], ...reward };
      updateWizardData({ rewards: newRewards });
    };
    
    const removeReward = (index: number) => {
      updateWizardData({ rewards: rewards.filter((_, i) => i !== index) });
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-foreground mb-2">Система наград</h3>
          <p className="text-sm text-muted-foreground">Настройте награды за различные действия</p>
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Награды</label>
          <button
            onClick={addReward}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:scale-[0.98] transition-transform text-sm"
          >
            <Plus className="w-4 h-4" />
            Добавить награду
          </button>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {rewards.map((reward, index) => (
            <div key={index} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Награда {index + 1}</span>
                <button
                  onClick={() => removeReward(index)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Условие</label>
                  <Input
                    value={reward.condition}
                    onChange={(e) => updateReward(index, { condition: e.target.value })}
                    className="glass-card text-sm"
                    placeholder="за победу"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Тип награды</label>
                  <Select
                    value={reward.type}
                    onValueChange={(value: RewardType) => updateReward(index, { type: value })}
                  >
                    <SelectTrigger className="glass-card text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rewardTypes.filter(t => t.id !== 'none').map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.icon} {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Количество</label>
                  <Input
                    type="number"
                    value={reward.value}
                    onChange={(e) => updateReward(index, { value: parseInt(e.target.value) || 0 })}
                    className="glass-card text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Описание</label>
                  <Input
                    value={reward.description}
                    onChange={(e) => updateReward(index, { description: e.target.value })}
                    className="glass-card text-sm"
                    placeholder="Описание награды"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {rewards.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Добавьте награды для игры
          </div>
        )}
      </div>
    );
  };

  const renderAccessStep = () => {
    const access = wizardState.gameData.access || { visibility: 'public', cooldownSeconds: 300 };
    
    const updateAccess = (newAccess: Partial<typeof access>) => {
      updateWizardData({ access: { ...access, ...newAccess } });
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-foreground mb-2">Настройки доступа</h3>
          <p className="text-sm text-muted-foreground">Видимость игры и ограничения</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Видимость</label>
            <div className="space-y-2">
              <button
                onClick={() => updateAccess({ visibility: 'public' })}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  access.visibility === 'public' ? 'bg-primary text-primary-foreground' : 'glass-card'
                }`}
              >
                <div className="font-medium">🌐 Публичная</div>
                <div className={`text-sm ${access.visibility === 'public' ? 'opacity-90' : 'text-muted-foreground'}`}>
                  Игра доступна всем пользователям
                </div>
              </button>
              <button
                onClick={() => updateAccess({ visibility: 'private' })}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  access.visibility === 'private' ? 'bg-primary text-primary-foreground' : 'glass-card'
                }`}
              >
                <div className="font-medium">🔒 Приватная</div>
                <div className={`text-sm ${access.visibility === 'private' ? 'opacity-90' : 'text-muted-foreground'}`}>
                  Игра доступна только по прямой ссылке
                </div>
              </button>
              <button
                onClick={() => updateAccess({ visibility: 'byRole' })}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  access.visibility === 'byRole' ? 'bg-primary text-primary-foreground' : 'glass-card'
                }`}
              >
                <div className="font-medium">👥 По ролям</div>
                <div className={`text-sm ${access.visibility === 'byRole' ? 'opacity-90' : 'text-muted-foreground'}`}>
                  Игра доступна только определенным ролям
                </div>
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Кулдаун (секунды)
            </label>
            <Input
              type="number"
              value={access.cooldownSeconds}
              onChange={(e) => updateAccess({ cooldownSeconds: parseInt(e.target.value) || 0 })}
              className="glass-card"
              min="0"
              placeholder="300"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Время ожидания между играми для одного пользователя
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderPreviewStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-foreground mb-2">Предпросмотр игры</h3>
          <p className="text-sm text-muted-foreground">Проверьте настройки перед публикацией</p>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              {wizardState.gameData.icon ? (
                <span className="text-3xl">{wizardState.gameData.icon}</span>
              ) : (
                <Gamepad2 className="w-8 h-8 text-foreground/70" />
              )}
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">
              {wizardState.gameData.name}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {wizardState.gameData.description}
            </p>
            
            <div className="inline-flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm">
              {gameTypes.find(t => t.id === wizardState.gameData.type)?.name}
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Кулдаун:</span>
              <span>{wizardState.gameData.access?.cooldownSeconds}с</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Видимость:</span>
              <span>{wizardState.gameData.access?.visibility}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Наград:</span>
              <span>{wizardState.gameData.rewards?.length || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:scale-[0.98] transition-transform">
            Пробная игра
          </button>
        </div>
      </div>
    );
  };

  const renderPublishStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-foreground mb-2">Публикация игры</h3>
          <p className="text-sm text-muted-foreground">Выберите, как сохранить игру</p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => updateWizardData({ status: 'draft' })}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              wizardState.gameData.status === 'draft' ? 'bg-orange-500 text-white' : 'glass-card'
            }`}
          >
            <div className="font-medium">📝 Сохранить как черновик</div>
            <div className={`text-sm ${wizardState.gameData.status === 'draft' ? 'opacity-90' : 'text-muted-foreground'}`}>
              Игра будет сохранена, но не будет доступна пользователям
            </div>
          </button>
          <button
            onClick={() => updateWizardData({ status: 'published' })}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              wizardState.gameData.status === 'published' ? 'bg-green-600 text-white' : 'glass-card'
            }`}
          >
            <div className="font-medium">🚀 Опубликовать сразу</div>
            <div className={`text-sm ${wizardState.gameData.status === 'published' ? 'opacity-90' : 'text-muted-foreground'}`}>
              Игра станет доступна всем пользователям немедленно
            </div>
          </button>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <h4 className="font-medium text-foreground mb-2">JSON конфигурация</h4>
          <pre className="text-xs bg-secondary p-3 rounded-lg overflow-auto max-h-40 text-foreground">
            {JSON.stringify(wizardState.gameData, null, 2)}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(wizardState.gameData, null, 2));
              setCopiedJson(true);
              setTimeout(() => setCopiedJson(false), 2000);
            }}
            className="flex items-center gap-2 mt-2 text-sm text-primary hover:underline"
          >
            {copiedJson ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedJson ? 'Скопировано!' : 'Скопировать JSON'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6 space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-foreground">Управление играми</h1>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:scale-[0.98] transition-transform apple-shadow"
          >
            <Plus className="w-4 h-4" />
            Создать игру
          </button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl apple-shadow">
            <div className="text-center">
              <div className="text-2xl font-medium text-foreground mb-1">{games.length}</div>
              <div className="text-sm text-muted-foreground">Всего игр</div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl apple-shadow">
            <div className="text-center">
              <div className="text-2xl font-medium text-green-600 mb-1">
                {games.filter(g => g.status === 'published').length}
              </div>
              <div className="text-sm text-muted-foreground">Опубликовано</div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl apple-shadow">
            <div className="text-center">
              <div className="text-2xl font-medium text-orange-500 mb-1">
                {games.filter(g => g.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">Черновики</div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl apple-shadow">
            <div className="text-center">
              <div className="text-2xl font-medium text-muted-foreground mb-1">
                {games.filter(g => g.status === 'archived').length}
              </div>
              <div className="text-sm text-muted-foreground">В архиве</div>
            </div>
          </div>
        </div>

        {/* Список игр */}
        <div className="space-y-4">
          {games.length > 0 ? (
            games.map((game) => {
              const gameType = gameTypes.find(t => t.id === game.type);
              const GameIcon = gameType?.icon || Gamepad2;
              
              return (
                <div key={game.id} className="glass-card rounded-2xl p-4 apple-shadow">
                  <div className="flex items-start gap-4">
                    {/* Иконка игры */}
                    <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center">
                      {game.icon ? (
                        <span className="text-2xl">{game.icon}</span>
                      ) : (
                        <GameIcon className="w-6 h-6 text-foreground/70" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      {/* Заголовок и статус */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-foreground">{game.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {gameType?.name} • Кулдаун: {game.access.cooldownSeconds}с
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`text-sm font-medium ${getStatusColor(game.status)}`}>
                            {getStatusLabel(game.status)}
                          </div>
                          <button
                            onClick={() => copyGameJson(game)}
                            className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                            title="Копировать JSON"
                          >
                            {copiedJson ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-foreground/70" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* Описание */}
                      {game.description && (
                        <div className="text-sm text-muted-foreground mb-3">
                          {game.description}
                        </div>
                      )}
                      
                      {/* Статистика */}
                      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Игр: </span>
                          <span className="text-foreground">{game.stats?.totalPlays || 0}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Наград: </span>
                          <span className="text-foreground">{game.stats?.totalRewards || 0}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Игроков: </span>
                          <span className="text-foreground">{game.stats?.uniquePlayers || 0}</span>
                        </div>
                      </div>
                      
                      {/* Дата обновления */}
                      <div className="text-xs text-muted-foreground mb-4">
                        Обновлено: {formatDate(game.updatedAt)}
                        {game.publishedAt && (
                          <> • Опубликовано: {formatDate(game.publishedAt)}</>
                        )}
                      </div>
                      
                      {/* Действия */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedGame(game);
                            setIsPreviewOpen(true);
                          }}
                          className="flex items-center gap-2 px-3 py-2 glass-card rounded-lg hover:scale-[0.98] transition-transform text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Предпросмотр
                        </button>
                        <button
                          className="flex items-center gap-2 px-3 py-2 glass-card rounded-lg hover:scale-[0.98] transition-transform text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Редактировать
                        </button>
                        
                        {game.status === 'draft' && (
                          <button
                            onClick={() => handleGameStatusChange(game.id, 'published')}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:scale-[0.98] transition-transform text-sm"
                          >
                            <Play className="w-4 h-4" />
                            Опубликовать
                          </button>
                        )}
                        
                        {game.status === 'published' && (
                          <button
                            onClick={() => handleGameStatusChange(game.id, 'draft')}
                            className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:scale-[0.98] transition-transform text-sm"
                          >
                            <Pause className="w-4 h-4" />
                            Снять с публикации
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleGameStatusChange(game.id, 'archived')}
                          className="flex items-center gap-2 px-3 py-2 glass-card rounded-lg hover:scale-[0.98] transition-transform text-sm"
                        >
                          <Archive className="w-4 h-4" />
                          Архивировать
                        </button>
                        
                        <button
                          onClick={() => handleDeleteGame(game.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:scale-[0.98] transition-transform text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Удалить
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
              <p className="text-muted-foreground mb-4">Игр пока нет</p>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:scale-[0.98] transition-transform"
              >
                Создать первую игру
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Мастер создания игры */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-2xl p-0 max-h-[90vh] flex flex-col [&>button]:hidden">
          <div className="p-6 flex-1 flex flex-col">
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <DialogTitle className="text-lg font-medium text-foreground">
                  Создание игры
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Шаг {wizardState.currentStep + 1} из {wizardState.steps.length}: {wizardState.steps[wizardState.currentStep].title}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsWizardOpen(false);
                  resetWizard();
                }}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-foreground/70" />
              </button>
            </div>
            
            <DialogDescription className="sr-only">
              Мастер создания новой мини-игры
            </DialogDescription>

            {/* Прогресс-бар */}
            <div className="flex items-center gap-2 mb-6">
              {wizardState.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    index < wizardState.currentStep
                      ? 'bg-green-500'
                      : index === wizardState.currentStep
                      ? 'bg-primary'
                      : 'bg-secondary'
                  }`}
                />
              ))}
            </div>

            {/* Содержимое шага */}
            <div className="flex-1 overflow-y-auto">
              {renderWizardStep()}
            </div>

            {/* Навигация */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
              <button
                onClick={prevStep}
                disabled={wizardState.currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Назад
              </button>
              
              <div className="text-sm text-muted-foreground">
                {wizardState.currentStep + 1} / {wizardState.steps.length}
              </div>
              
              {wizardState.currentStep === wizardState.steps.length - 1 ? (
                <button
                  onClick={createGame}
                  disabled={!canProceedToNext()}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Создать игру
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProceedToNext()}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Далее
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Предпросмотр игры */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-0 [&>button]:hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <DialogTitle className="text-lg font-medium text-foreground">
                Предпросмотр игры
              </DialogTitle>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-foreground/70" />
              </button>
            </div>
            
            <DialogDescription className="sr-only">
              Предпросмотр созданной игры
            </DialogDescription>

            {selectedGame && (
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {selectedGame.icon ? (
                    <span className="text-3xl">{selectedGame.icon}</span>
                  ) : (
                    <Gamepad2 className="w-8 h-8 text-foreground/70" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {selectedGame.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {selectedGame.description}
                </p>
                
                <div className="glass-card rounded-2xl p-4 mb-6">
                  <div className="text-center text-muted-foreground">
                    Предпросмотр игрового интерфейса будет здесь
                  </div>
                </div>
                
                <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:scale-[0.98] transition-transform">
                  Играть
                </button>
              </div>
            )}
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