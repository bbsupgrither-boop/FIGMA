import { Plus } from 'lucide-react';
import { Battle, BattleInvitation } from '../types/battles';

interface BattleCardProps {
  battles: Battle[];
  invitations: BattleInvitation[];
  onShowAllBattles: () => void;
  onCreateBattle: () => void;
  theme?: 'light' | 'dark';
}

export function BattleCard({ 
  battles, 
  invitations, 
  onShowAllBattles, 
  onCreateBattle, 
  theme = 'light' 
}: BattleCardProps) {
  const activeBattles = battles.filter(b => b.status === 'active');
  const pendingInvitations = invitations.filter(i => i.status === 'pending');
  const totalCount = activeBattles.length + pendingInvitations.length;

  return (
    <div 
      className="surface-card cursor-pointer transition-all hover:scale-[0.98] active:scale-[0.96]"
      onClick={onShowAllBattles}
      style={{
        position: 'relative'
      }}
    >
      {/* Заголовок */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <h3 
            className="unified-heading"
            style={{ 
              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
            }}
          >
            Баттлы
          </h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🎯 Кнопка + нажата!');
              onCreateBattle();
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg active:scale-95"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E6E9EF',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              cursor: 'pointer',
              zIndex: 999
            }}
          >
            <Plus 
              style={{
                width: '14px',
                height: '14px',
                color: '#6B7280'
              }}
            />
          </button>
        </div>
      </div>

      {/* Контент */}
      <div className="space-y-3 px-4 pb-4" style={{ marginTop: '16px' }}>
        {/* Активные баттлы */}
        {activeBattles.length > 0 && (
          <div>
            <div 
              className="text-xs font-medium mb-2"
              style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
            >
              Активные баттлы
            </div>
            
            <div className="space-y-2">
              {activeBattles.slice(0, 2).map((battle) => (
                <div
                  key={battle.id}
                  className="flex items-center py-2 px-3 rounded-xl"
                  style={{
                    background: theme === 'dark' 
                      ? 'rgba(43, 130, 255, 0.1)' 
                      : 'rgba(43, 130, 255, 0.05)',
                    border: theme === 'dark' 
                      ? '1px solid rgba(43, 130, 255, 0.2)' 
                      : '1px solid rgba(43, 130, 255, 0.15)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs font-medium"
                      style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                    >
                      {battle.challengerName}
                    </span>
                    <span 
                      className="text-xs"
                      style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                    >
                      VS
                    </span>
                    <span 
                      className="text-xs font-medium"
                      style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                    >
                      {battle.opponentName}
                    </span>
                  </div>
                </div>
              ))}
              
              {activeBattles.length > 2 && (
                <div 
                  className="text-xs text-center py-1"
                  style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                >
                  +{activeBattles.length - 2} еще
                </div>
              )}
            </div>
          </div>
        )}

        {/* Приглашения */}
        {pendingInvitations.length > 0 && (
          <div>
            <div 
              className="text-xs font-medium mb-2"
              style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
            >
              Приглашения
            </div>
            
            <div className="space-y-2">
              {pendingInvitations.slice(0, 2).map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center py-2 px-3 rounded-xl"
                  style={{
                    background: theme === 'dark' 
                      ? 'rgba(255, 159, 10, 0.1)' 
                      : 'rgba(255, 159, 10, 0.05)',
                    border: theme === 'dark' 
                      ? '1px solid rgba(255, 159, 10, 0.2)' 
                      : '1px solid rgba(255, 159, 10, 0.15)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs font-medium"
                      style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                    >
                      {invitation.challengerName}
                    </span>
                    <span 
                      className="text-xs"
                      style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                    >
                      вызывает
                    </span>
                  </div>
                </div>
              ))}
              
              {pendingInvitations.length > 2 && (
                <div 
                  className="text-xs text-center py-1"
                  style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                >
                  +{pendingInvitations.length - 2} еще
                </div>
              )}
            </div>
          </div>
        )}

        {/* Пустое состояние */}
        {totalCount === 0 && (
          <div className="text-center py-6">
            <div 
              className="text-2xl mb-2"
              style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
            >
              ⚔️
            </div>
            <p 
              className="text-xs"
              style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
            >
              Нет активных баттлов
            </p>
            <p 
              className="text-xs mt-1"
              style={{ color: theme === 'dark' ? '#6B7280' : '#9CA3AF' }}
            >
              Нажмите + чтобы создать вызов
            </p>
          </div>
        )}

        {/* Счетчик внизу - тоже кликабельный */}
        {totalCount > 0 && (
          <button 
            className="w-full text-xs text-center pt-2 border-t cursor-pointer hover:opacity-80 transition-opacity"
            style={{ 
              color: theme === 'dark' ? '#A7B0BD' : '#6B7280',
              borderColor: theme === 'dark' 
                ? 'rgba(255, 255, 255, 0.06)' 
                : 'rgba(0, 0, 0, 0.1)',
              background: 'transparent',
              border: 'none',
              borderTop: theme === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.06)' 
                : '1px solid rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🎯 Счетчик баттлов нажат!');
              onShowAllBattles();
            }}
          >
            Всего: {totalCount} {totalCount === 1 ? 'баттл' : 'баттлов'}
          </button>
        )}
      </div>
    </div>
  );
}