import { useState } from 'react';
import { Clock, Plus, ChevronLeft, ChevronRight, ArrowRight } from './Icons';
import { LeaderboardEntry, Battle } from '../types/global';

type ActivityTab = 'battles' | 'leaderboard' | 'history';

interface ActivityCardProps {
  leaderboard?: LeaderboardEntry[];
  activeBattles?: Battle[];
  onNavigate?: (page: string) => void;
}

interface BattleEntry {
  id: number;
  participantA: string;
  participantB: string;
  status: 'active' | 'completed' | 'cancelled';
  date?: string;
}

interface HistoryEntry extends BattleEntry {
  date: string;
}

export function ActivityCard({ leaderboard = [], activeBattles = [], onNavigate }: ActivityCardProps) {
  const [activeTab, setActiveTab] = useState<ActivityTab>('battles');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Преобразуем активные баттлы в нужный формат
  const transformedBattles: BattleEntry[] = activeBattles.map(battle => ({
    id: parseInt(battle.id),
    participantA: battle.participants.length > 0 ? battle.participants[0].user.name : 'Участник А',
    participantB: battle.participants.length > 1 ? battle.participants[1].user.name : 'Участник Б',
    status: battle.status === 'active' ? 'active' as const : 'completed' as const
  }));

  // Mock данные для демонстрации (если нет активных баттлов)
  const mockBattles: BattleEntry[] = transformedBattles.length > 0 ? transformedBattles : [
    { id: 1, participantA: 'Алексей', participantB: 'Мария', status: 'active' },
    { id: 2, participantA: 'Дмитрий', participantB: 'Анна', status: 'completed' },
    { id: 3, participantA: 'Сергей', participantB: 'Елена', status: 'cancelled' },
  ];

  const mockHistory: HistoryEntry[] = [
    { id: 1, participantA: 'Иван', participantB: 'Петр', status: 'completed', date: '11.09' },
    { id: 2, participantA: 'Ольга', participantB: 'Катя', status: 'completed', date: '10.09' },
    { id: 3, participantA: 'Антон', participantB: 'Павел', status: 'cancelled', date: '09.09' },
  ];

  const tabs = [
    { id: 'battles' as const, label: 'Баттлы' },
    { id: 'leaderboard' as const, label: 'Лидерборд' },
    { id: 'history' as const, label: 'История' }
  ];

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return 'Сегодня';
    }
    
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const handlePrevDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Идет';
      case 'completed':
        return 'Готово';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  const renderBattlesContent = () => {
    const battles = mockBattles.length > 0 ? mockBattles : [];
    
    if (battles.length === 0) {
      return (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-center text-sm">
            Нет активных баттлов
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {battles.map((battle, index) => (
          <div key={battle.id} className="flex items-center gap-1 sm:gap-2 min-h-[48px] p-1 sm:p-2 rounded-lg hover:bg-muted/30 transition-colors">
            <span className="text-foreground font-medium text-xs sm:text-sm w-4 sm:w-5 flex-shrink-0">
              {index + 1}.
            </span>
            
            <div className="px-1 sm:px-2 py-1 bg-secondary rounded-full text-xs font-medium flex-1 text-center truncate min-w-0">
              {battle.participantA}
            </div>
            
            <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            
            <div className="px-1 sm:px-2 py-1 bg-secondary rounded-full text-xs font-medium flex-1 text-center truncate min-w-0">
              {battle.participantB}
            </div>
            
            <div className={`px-1 sm:px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 whitespace-nowrap ${getStatusColor(battle.status)}`}>
              {getStatusText(battle.status)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLeaderboardContent = () => {
    if (leaderboard.length === 0) {
      return (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-center text-sm">
            Список лидеров отсутствует
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {leaderboard.slice(0, 10).map((entry, index) => (
          <div 
            key={entry.user.id} 
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
              index === 0 
                ? 'bg-primary/10 border border-primary/20 hover:bg-primary/15' 
                : 'hover:bg-muted/50'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
              index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {index + 1}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                {entry.user.name}
              </div>
            </div>
            
            <div className="text-sm font-medium text-primary flex-shrink-0">
              {entry.user.rating}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderHistoryContent = () => {
    const history = mockHistory.length > 0 ? mockHistory : [];
    
    if (history.length === 0) {
      return (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-center text-sm">
            История отсутствует
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {history.map((battle, index) => (
          <div key={battle.id} className="flex items-center gap-1 sm:gap-2 min-h-[48px] p-1 sm:p-2 rounded-lg hover:bg-muted/30 transition-colors">
            <span className="text-foreground font-medium text-xs sm:text-sm w-4 sm:w-5 flex-shrink-0">
              {index + 1}.
            </span>
            
            <div className="px-1 sm:px-2 py-1 bg-secondary rounded-full text-xs font-medium flex-1 text-center truncate min-w-0">
              {battle.participantA}
            </div>
            
            <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            
            <div className="px-1 sm:px-2 py-1 bg-secondary rounded-full text-xs font-medium flex-1 text-center truncate min-w-0">
              {battle.participantB}
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
                {battle.date}
              </span>
              <div className={`px-1 sm:px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(battle.status)}`}>
                {getStatusText(battle.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'battles':
        return renderBattlesContent();
      case 'leaderboard':
        return renderLeaderboardContent();
      case 'history':
        return renderHistoryContent();
      default:
        return null;
    }
  };

  const handleHistoryClick = () => {
    // Открыть историю за все дни
    console.log('Открыть полную историю');
  };

  const handleCreateBattleClick = () => {
    onNavigate?.('battles');
  };

  return (
    <div className="glass-card rounded-2xl p-4 apple-shadow">
      {/* Заголовок */}
      <div className="relative flex items-center justify-center mb-4">
        <button 
          onClick={handleHistoryClick}
          className="absolute left-0 apple-button p-2 rounded-full hover:scale-105 transition-transform"
          title="История"
        >
          <Clock className="w-4 h-4 text-foreground/70" />
        </button>
        
        <h2 className="font-medium text-foreground">Активность дня</h2>
        
        <button 
          onClick={handleCreateBattleClick}
          className="absolute right-0 apple-button p-2 rounded-full hover:scale-105 transition-transform"
          title="Создать баттл"
        >
          <Plus className="w-4 h-4 text-foreground/70" />
        </button>
      </div>

      {/* Сегментный переключатель */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'glass-card text-foreground hover:scale-[0.98]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Переключатель дня */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevDay}
          className="apple-button p-2 rounded-full hover:scale-105 transition-transform"
        >
          <ChevronLeft className="w-4 h-4 text-foreground/70" />
        </button>
        
        <div className="px-3 py-1 bg-secondary rounded-full text-sm font-medium text-foreground">
          {formatDate(currentDate)}
        </div>
        
        <button
          onClick={handleNextDay}
          className="apple-button p-2 rounded-full hover:scale-105 transition-transform"
        >
          <ChevronRight className="w-4 h-4 text-foreground/70" />
        </button>
      </div>

      {/* Контент */}
      <div className="overflow-y-auto max-h-[240px] sm:max-h-[280px] -mx-1 px-1">
        {renderContent()}
      </div>
    </div>
  );
}