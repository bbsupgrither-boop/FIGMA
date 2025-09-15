import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Play, Pause, Archive, Copy, Check, ChevronLeft, ChevronRight, CircleDot, Scissors, DollarSign, X, Settings, Gamepad2 } from './Icons';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

interface AdminGamesPageNewFixedProps {
  onBack: () => void;
  onNavigateToSection: (section: string) => void;
}

interface Game {
  id: string;
  name: string;
  description: string;
  type: 'wheel' | 'rps' | 'slots';
  status: 'draft' | 'published' | 'archived';
  icon?: string;
  config: any;
  rewards: any[];
  access: {
    visibility: string;
    cooldownSeconds: number;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  stats: {
    totalPlays: number;
    totalRewards: number;
    uniquePlayers: number;
  };
}

export function AdminGamesPageNewFixed({ onBack, onNavigateToSection }: AdminGamesPageNewFixedProps) {


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
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleGameStatusChange = (gameId: string, newStatus: Game['status']) => {
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

  const openEditModal = (game: Game) => {
    setSelectedGame(game);
    setIsWizardOpen(true);
  };

  const getStatusColor = (status: Game['status']) => {
    switch (status) {
      case 'published': return 'text-green-600';
      case 'draft': return 'text-orange-500';
      case 'archived': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getStatusLabel = (status: Game['status']) => {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6 space-y-6 max-w-full overflow-hidden">
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
                {games.filter(game => game.status === 'published').length}
              </div>
              <div className="text-sm text-muted-foreground">
                Опубликовано
              </div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl apple-shadow">
            <div className="text-center">
              <div className="text-2xl font-medium text-muted-foreground mb-1">
                {games.filter(game => game.status === 'archived').length}
              </div>
              <div className="text-sm text-muted-foreground">
                В архиве
              </div>
            </div>
          </div>
        </div>

        {/* Список игр */}
        <div className="space-y-4">
          {games.length > 0 ? (
            games.map((game) => (
              <div key={game.id} className="glass-card rounded-2xl p-4 apple-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center shrink-0">
                    <CircleDot className="w-6 h-6 text-foreground/70" />
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
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          game.status === 'published' ? 'bg-green-100 text-green-800' :
                          game.status === 'draft' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusLabel(game.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Игр: </span>
                        <span className="text-foreground">
                          {game.stats.totalPlays}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Наград: </span>
                        <span className="text-foreground">
                          {game.stats.totalRewards}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm gap-2 mb-3">
                      <div className="text-muted-foreground">
                        Обновлено: {formatDate(game.updatedAt)} • Опубликовано: {game.publishedAt ? formatDate(game.publishedAt) : 'Не опубликовано'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-wrap">
                      <button className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm hover:scale-[0.98] transition-transform shrink-0">
                        <Eye className="w-4 h-4" />
                        Предпросмотр
                      </button>
                      <button 
                        onClick={() => openEditModal(game)}
                        className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm hover:scale-[0.98] transition-transform shrink-0"
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
            ))
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

      {/* Простое модальное окно создания/редактирования игры */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-background rounded-2xl p-6 apple-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-foreground">
                {selectedGame ? 'Редактировать игру' : 'Создать игру'}
              </h2>
              <button
                onClick={() => {
                  setIsWizardOpen(false);
                  setSelectedGame(null);
                }}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-foreground/70" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Название игры
                </label>
                <input
                  type="text"
                  defaultValue={selectedGame?.name || ''}
                  className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Введите название игры"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Описание
                </label>
                <textarea
                  defaultValue={selectedGame?.description || ''}
                  className="w-full px-4 py-3 glass-card rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Описание игры"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsWizardOpen(false);
                    setSelectedGame(null);
                  }}
                  className="flex-1 glass-card rounded-2xl p-3 text-sm font-medium text-foreground hover:scale-[0.98] transition-transform"
                >
                  Отменить
                </button>
                <button
                  onClick={() => {
                    setIsWizardOpen(false);
                    setSelectedGame(null);
                  }}
                  className="flex-1 bg-primary text-primary-foreground rounded-2xl p-3 text-sm font-medium hover:scale-[0.98] transition-transform"
                >
                  {selectedGame ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}