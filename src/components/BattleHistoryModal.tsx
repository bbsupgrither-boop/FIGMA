import { ModalOpaque } from './ModalOpaque';
import { X, Calendar } from 'lucide-react';
import { Battle } from '../types/battles';

interface BattleHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  battles: Battle[];
  theme?: 'light' | 'dark';
}

export function BattleHistoryModal({ 
  isOpen, 
  onClose, 
  battles, 
  theme = 'light' 
}: BattleHistoryModalProps) {
  
  // Получаем текущую неделю (с воскресенья по субботу)
  const getCurrentWeekRange = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = воскресенье
    
    // Начало недели (воскресенье)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - currentDay);
    weekStart.setHours(0, 0, 0, 0);
    
    // Конец недели (суббота)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    return { weekStart, weekEnd };
  };

  const { weekStart, weekEnd } = getCurrentWeekRange();
  
  // Фильтруем баттлы по текущей неделе и только завершенные
  const weeklyBattles = battles.filter(battle => {
    if (battle.status !== 'completed' || !battle.completedAt) return false;
    
    const battleDate = new Date(battle.completedAt);
    return battleDate >= weekStart && battleDate <= weekEnd;
  });

  // Сортируем по дате завершения (новые сначала)
  const sortedBattles = weeklyBattles.sort((a, b) => {
    const dateA = new Date(a.completedAt!);
    const dateB = new Date(b.completedAt!);
    return dateB.getTime() - dateA.getTime();
  });

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
    const endStr = end.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
    return `${startStr} - ${endStr}`;
  };

  const formatBattleTime = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { 
      weekday: 'short',
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ModalOpaque
      isOpen={isOpen}
      onClose={onClose}
      theme={theme}
    >
      {/* Кастомный заголовок */}
      <div 
        className="flex items-center justify-between"
        style={{ marginBottom: '20px' }}
      >
        <h3 
          className="unified-heading"
          style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
        >
          История баттлов
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
          style={{
            background: theme === 'dark' ? '#202734' : '#F3F5F8',
            border: theme === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.06)' 
              : '1px solid #E6E9EF',
            color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
          }}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
      
      {/* Период недели */}
      <div 
        className="flex items-center gap-2 mb-4 p-3 rounded-xl"
        style={{
          background: theme === 'dark' ? 'rgba(43, 130, 255, 0.1)' : 'rgba(43, 130, 255, 0.05)',
          border: theme === 'dark' ? '1px solid rgba(43, 130, 255, 0.2)' : '1px solid rgba(43, 130, 255, 0.15)'
        }}
      >
        <Calendar 
          style={{ 
            width: '16px', 
            height: '16px', 
            color: theme === 'dark' ? '#2B82FF' : '#2B82FF' 
          }} 
        />
        <span 
          className="text-xs font-medium"
          style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
        >
          {formatDateRange(weekStart, weekEnd)}
        </span>
      </div>

      <div 
        style={{ 
          flex: '1',
          overflowY: 'auto',
          overflowX: 'hidden',
          maxHeight: '60vh'
        }}
      >
        {sortedBattles.length === 0 ? (
          <div className="text-center py-8">
            <div 
              className="text-3xl mb-3"
              style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
            >
              📊
            </div>
            <p 
              className="unified-text mb-2"
              style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
            >
              Нет завершенных баттлов на этой неделе
            </p>
            <p 
              className="text-xs"
              style={{ color: theme === 'dark' ? '#6B7280' : '#9CA3AF' }}
            >
              История обновляется каждое воскресенье
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedBattles.map((battle) => (
              <div
                key={battle.id}
                className="p-4 rounded-xl border"
                style={{
                  background: theme === 'dark' ? '#1C2029' : '#F9FAFB',
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="text-xs"
                    style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                  >
                    {formatBattleTime(new Date(battle.completedAt!))}
                  </span>
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: theme === 'dark' ? 'rgba(48, 209, 88, 0.2)' : 'rgba(52, 199, 89, 0.1)',
                      color: theme === 'dark' ? '#30D158' : '#34C759'
                    }}
                  >
                    Завершен
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  {/* Победитель */}
                  <div 
                    className="flex-1 p-2 rounded-lg text-center"
                    style={{
                      background: theme === 'dark' ? 'rgba(48, 209, 88, 0.15)' : 'rgba(52, 199, 89, 0.1)',
                      border: theme === 'dark' ? '1px solid rgba(48, 209, 88, 0.3)' : '1px solid rgba(52, 199, 89, 0.2)'
                    }}
                  >
                    <div 
                      className="text-xs font-medium"
                      style={{ color: theme === 'dark' ? '#30D158' : '#34C759' }}
                    >
                      🏆 {battle.winnerName}
                    </div>
                    <div 
                      className="text-xs mt-1"
                      style={{ color: theme === 'dark' ? '#30D158' : '#34C759' }}
                    >
                      Победитель
                    </div>
                  </div>
                  
                  <div 
                    className="mx-2 text-xs"
                    style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                  >
                    VS
                  </div>
                  
                  {/* Проигравший */}
                  <div 
                    className="flex-1 p-2 rounded-lg text-center"
                    style={{
                      background: theme === 'dark' ? 'rgba(255, 69, 58, 0.15)' : 'rgba(255, 59, 48, 0.1)',
                      border: theme === 'dark' ? '1px solid rgba(255, 69, 58, 0.3)' : '1px solid rgba(255, 59, 48, 0.2)'
                    }}
                  >
                    <div 
                      className="text-xs font-medium"
                      style={{ color: theme === 'dark' ? '#FF453A' : '#FF3B30' }}
                    >
                      {battle.loserName}
                    </div>
                    <div 
                      className="text-xs mt-1"
                      style={{ color: theme === 'dark' ? '#FF453A' : '#FF3B30' }}
                    >
                      Проигравший
                    </div>
                  </div>
                </div>
                
                {/* Ставка */}
                <div 
                  className="text-center mt-3 pt-2 border-t"
                  style={{ 
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <span 
                    className="text-xs"
                    style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                  >
                    Ставка: 
                  </span>
                  <span 
                    className="text-xs font-medium ml-1"
                    style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                  >
                    {battle.stake} монет
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t" style={{ borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.1)' }}>
        <p 
          className="text-xs text-center"
          style={{ color: theme === 'dark' ? '#6B7280' : '#9CA3AF' }}
        >
          История сбрасывается каждое воскресенье
        </p>
      </div>
    </ModalOpaque>
  );
}