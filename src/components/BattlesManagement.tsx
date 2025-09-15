import { useState } from 'react';
import { Crown, X, Paperclip, History, User } from './Icons';
import { Battle, BattleInvitation } from '../types/battles';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import coinIcon from 'figma:asset/29d513144bb95c08c031f3604ac2dd2e7bee6450.png';

interface PublicBattle {
  id: string; // Изменяем на string чтобы соответствовать Battle.id
  originalId: string; // Добавляем поле для оригинального ID
  challenger: { name: string; status: 'winning' | 'losing' | 'neutral' };
  opponent: { name: string; status: 'winning' | 'losing' | 'neutral' };
  date: string;
  prize: number;
  status: 'active' | 'finished';
}

interface BattlesManagementProps {
  battles: Battle[];
  setBattles: (battles: Battle[]) => void;
  battleInvitations: BattleInvitation[];
  setBattleInvitations: (invitations: BattleInvitation[]) => void;
  onCompleteBattle: (battleId: string, winnerId: string) => void;
  currentUserBalance?: number;
  addNotification?: (notification: { type: string; title: string; message: string; priority: string; data?: any }) => void;
  users?: Array<{ id: string; name: string; balance: number; level?: number; [key: string]: any }>;
}

export function BattlesManagement({ 
  battles, 
  setBattles, 
  battleInvitations, 
  setBattleInvitations, 
  onCompleteBattle,
  currentUserBalance = 0,
  addNotification,
  users = []
}: BattlesManagementProps) {
  // Состояния для модальных окон
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [battleDetailOpen, setBattleDetailOpen] = useState(false);
  const [checkedBattlesOpen, setCheckedBattlesOpen] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<'challenger' | 'opponent' | null>(null);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  
  // Моковые данные для доказательств (в реальной версии будут из API)
  const mockEvidence = [
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop&crop=center'
  ];

  // Функция для получения баланса пользователя по ID
  const getUserBalance = (userId: string): number => {
    const user = users.find(u => u.id === userId);
    return user ? user.balance : 0;
  };
  // Преобразуем battles в формат для отображения
  const displayBattles: PublicBattle[] = battles.map((battle, index) => ({
    id: `display-${battle.id}-${index}`, // Уникальный display ID
    originalId: battle.id, // Сохраняем оригинальный ID
    challenger: { 
      name: battle.challengerName, 
      status: battle.winnerId === battle.challengerId ? 'winning' : 
              battle.winnerId === battle.opponentId ? 'losing' : 'neutral' 
    },
    opponent: { 
      name: battle.opponentName, 
      status: battle.winnerId === battle.opponentId ? 'winning' : 
              battle.winnerId === battle.challengerId ? 'losing' : 'neutral' 
    },
    date: battle.startedAt.toLocaleDateString('ru-RU'),
    prize: battle.stake,
    status: battle.status === 'completed' ? 'finished' : 'active'
  }));

  const handleSetWinner = (originalId: string, winner: 'challenger' | 'opponent') => {
    const battle = battles.find(b => b.id === originalId);
    if (!battle) return;

    const winnerId = winner === 'challenger' ? battle.challengerId : battle.opponentId;
    onCompleteBattle(battle.id, winnerId);
  };

  const handleDeleteBattle = (originalId: string) => {
    const battleToDelete = battles.find(b => b.id === originalId);
    if (battleToDelete) {
      setBattles(battles.filter(b => b.id !== battleToDelete.id));
    }
  };

  // Обработчик клика по баттлу для открытия деталей
  const handleBattleClick = (battle: PublicBattle) => {
    const originalBattle = battles.find(b => b.id === battle.originalId);
    if (originalBattle && originalBattle.status === 'active') {
      setSelectedBattle(originalBattle);
      setSelectedWinner(null);
      setBattleDetailOpen(true);
    }
  };

  // Обработчик одобрения результата баттла
  const handleApproveBattle = () => {
    if (selectedBattle && selectedWinner) {
      const winnerId = selectedWinner === 'challenger' ? selectedBattle.challengerId : selectedBattle.opponentId;
      const winnerName = selectedWinner === 'challenger' ? selectedBattle.challengerName : selectedBattle.opponentName;
      const loserName = selectedWinner === 'challenger' ? selectedBattle.opponentName : selectedBattle.challengerName;
      
      onCompleteBattle(selectedBattle.id, winnerId);
      
      // Отправляем уведомление об одобрении результата
      if (addNotification) {
        addNotification({
          type: 'admin',
          title: '✅ Баттл одобрен администратором',
          message: `Результат баттла одобрен. Победитель: ${winnerName}, проигравший: ${loserName}. Ставка: ${selectedBattle.stake} коинов.`,
          priority: 'medium',
          data: { 
            battleId: selectedBattle.id, 
            winnerId, 
            winnerName, 
            loserName, 
            stake: selectedBattle.stake 
          }
        });
      }
      
      setBattleDetailOpen(false);
      setSelectedBattle(null);
      setSelectedWinner(null);
    }
  };

  const activeBattles = displayBattles.filter(b => b.status === 'active');
  const finishedBattles = displayBattles.filter(b => b.status === 'finished');

  const handleTestBattleComplete = () => {
    // Создаем тестовый баттл и сразу завершаем его
    const testBattle: Battle = {
      id: `test-battle-${Date.now()}`,
      challengerId: 'user1', 
      challengerName: 'Анна Иванова',
      opponentId: 'current-user',
      opponentName: 'Вы',
      stake: 100,
      status: 'active',
      startedAt: new Date()
    };
    
    // Добавляем тестовый баттл
    setBattles(prev => [testBattle, ...prev]);
    
    // Завершаем его через секунду, делая текущего пользователя победителем
    setTimeout(() => {
      onCompleteBattle(testBattle.id, 'current-user');
    }, 1000);
  };

  return (
    <>
      <div 
        className="glass-card"
        style={{
          padding: '24px',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          minHeight: '100vh',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Заголовок с кнопкой проверенных */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          <h2 className="unified-heading" style={{ color: 'var(--text)', margin: 0 }}>
            Управление баттлами
          </h2>
          
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            {/* Кнопка истории проверенных баттлов */}
            <button
              onClick={() => setCheckedBattlesOpen(true)}
              className="unified-button"
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'var(--secondary)',
                color: 'var(--foreground)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--secondary)';
              }}
            >
              <History style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              Проверенные
            </button>
            

          </div>
        </div>

        {/* Активные баттлы */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          <h3 className="unified-heading" style={{ color: 'var(--text)', margin: 0 }}>
            Активные баттлы ({activeBattles.length})
          </h3>
          
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflow: 'hidden'
            }}
          >
            {activeBattles.length > 0 ? (
              activeBattles.map((battle) => (
                <div
                  key={battle.id}
                  className="glass-card"
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}
                  onClick={() => handleBattleClick(battle)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--card)';
                  }}
                >
                  {/* Участники */}
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      overflow: 'hidden'
                    }}
                  >
                    <div 
                      style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        background: 'var(--secondary)',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}
                    >
                      <span className="unified-text" style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                        {battle.challenger.name}
                      </span>
                    </div>
                    
                    <span className="unified-text" style={{ color: 'var(--muted-foreground)', flexShrink: 0 }}>VS</span>
                    
                    <div 
                      style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        background: 'var(--secondary)',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}
                    >
                      <span className="unified-text" style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                        {battle.opponent.name}
                      </span>
                    </div>
                    
                    <div 
                      style={{
                        marginLeft: 'auto',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        background: 'var(--primary-muted)',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}
                    >
                      <span className="unified-text" style={{ color: 'var(--primary)' }}>
                        Ставка: {battle.prize}g
                      </span>
                    </div>
                  </div>
                  
                  {/* Кнопки действий */}
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetWinner(battle.originalId, 'challenger');
                      }}
                      className="unified-button"
                      style={{
                        flex: '1',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: 'var(--chart-2)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        overflow: 'hidden',
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <Crown style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                      {battle.challenger.name}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetWinner(battle.originalId, 'opponent');
                      }}
                      className="unified-button"
                      style={{
                        flex: '1',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: 'var(--chart-2)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        overflow: 'hidden',
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <Crown style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                      {battle.opponent.name}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBattle(battle.originalId);
                      }}
                      className="unified-button"
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        background: 'var(--destructive)',
                        color: 'var(--destructive-foreground)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden',
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <X style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div 
                className="glass-card"
                style={{
                  padding: '32px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  overflow: 'hidden'
                }}
              >
                <p className="unified-text" style={{ color: 'var(--muted-foreground)' }}>
                  Нет активных баттлов
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    {/* Модальное окно детального просмотра баттла */}
    <Dialog open={battleDetailOpen} onOpenChange={setBattleDetailOpen}>
      <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
        <DialogTitle className="sr-only">Вызов на баттл</DialogTitle>
        <DialogDescription className="sr-only">
          Детальная информация о баттле с возможностью выбора победителя
        </DialogDescription>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="unified-heading" style={{ color: 'var(--foreground)', textAlign: 'center', flex: '1' }}>
              Вызов на баттл
            </h2>
            <button
              onClick={() => setBattleDetailOpen(false)}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" style={{ color: 'rgba(var(--foreground), 0.7)' }} />
            </button>
          </div>

          {selectedBattle && (
            <div className="space-y-4">
              {/* Участники баттла */}
              <div 
                className="glass-card"
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  overflow: 'hidden'
                }}
              >
                {/* Инициатор баттла */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <User style={{ width: '20px', height: '20px', color: 'var(--muted-foreground)' }} />
                  </div>
                  <div style={{ overflow: 'hidden', flex: '1' }}>
                    <div className="unified-text" style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                      {selectedBattle.challengerName}
                    </div>
                    <div className="unified-text" style={{ color: 'var(--muted-foreground)' }}>
                      Инициатор баттла
                    </div>
                    <div className="unified-text" style={{ color: 'var(--muted-foreground)', fontSize: '11px' }}>
                      Баланс: {getUserBalance(selectedBattle.challengerId)}
                      <img src={coinIcon} alt="G-coin" style={{ width: '12px', height: '12px', marginLeft: '4px' }} />
                    </div>
                  </div>
                </div>

                {/* Оппонент */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <User style={{ width: '20px', height: '20px', color: 'var(--muted-foreground)' }} />
                  </div>
                  <div style={{ overflow: 'hidden', flex: '1' }}>
                    <div className="unified-text" style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                      {selectedBattle.opponentName}
                    </div>
                    <div className="unified-text" style={{ color: 'var(--muted-foreground)' }}>
                      Соперник в баттле
                    </div>
                    <div className="unified-text" style={{ color: 'var(--muted-foreground)', fontSize: '11px' }}>
                      Баланс: {getUserBalance(selectedBattle.opponentId)}
                      <img src={coinIcon} alt="G-coin" style={{ width: '12px', height: '12px', marginLeft: '4px' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Награда при выигрыше */}
              <div 
                className="glass-card"
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  overflow: 'hidden'
                }}
              >
                <div className="unified-text" style={{ color: 'var(--muted-foreground)', marginBottom: '8px' }}>
                  Награда при выигрыше
                </div>
                <div 
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'linear-gradient(90deg, rgba(43, 130, 255, 0.1), transparent)',
                    border: '1px solid rgba(43, 130, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span className="unified-text" style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                    {selectedBattle.stake}
                  </span>
                  <img src={coinIcon} alt="G-coin" style={{ width: '16px', height: '16px' }} />
                </div>
              </div>

              {/* Баланс пользователя */}
              <div 
                className="glass-card"
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                <div className="unified-text" style={{ color: 'var(--muted-foreground)', marginBottom: '8px' }}>
                  Баланс пользователя
                </div>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span className="unified-text" style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                    {currentUserBalance}
                  </span>
                  <img src={coinIcon} alt="G-coin" style={{ width: '16px', height: '16px' }} />
                </div>
              </div>

              {/* Комментарий от участников */}
              <div 
                className="glass-card"
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                <div className="unified-text" style={{ color: 'var(--muted-foreground)', marginBottom: '8px' }}>
                  Комментарий от участников
                </div>
                <div className="unified-text" style={{ color: 'var(--foreground)' }}>
                  Комментарий отсутствует
                </div>
              </div>

              {/* Прикрепленные доказател��ства */}
              <div 
                className="glass-card"
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}
                >
                  <div className="unified-text" style={{ color: 'var(--muted-foreground)' }}>
                    Прикрепленные док-ва победы
                  </div>
                  <button
                    onClick={() => setEvidenceOpen(true)}
                    className="unified-button"
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      border: 'none',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <Paperclip style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
                <div className="unified-text" style={{ color: 'var(--foreground)' }}>
                  2 изображения прикреплены
                </div>
              </div>

              {/* Выбор победителя */}
              <div 
                className="glass-card"
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                <div className="unified-text" style={{ color: 'var(--muted-foreground)', marginBottom: '12px', textAlign: 'center' }}>
                  Выберите победителя
                </div>
                <div 
                  style={{
                    display: 'flex',
                    gap: '12px'
                  }}
                >
                  <button
                    onClick={() => setSelectedWinner('challenger')}
                    className={`unified-button ${selectedWinner === 'challenger' ? 'selected' : ''}`}
                    style={{
                      flex: '1',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: selectedWinner === 'challenger' ? 'var(--primary)' : 'var(--secondary)',
                      color: selectedWinner === 'challenger' ? 'var(--primary-foreground)' : 'var(--foreground)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      overflow: 'hidden'
                    }}
                  >
                    {selectedBattle.challengerName}
                  </button>
                  <button
                    onClick={() => setSelectedWinner('opponent')}
                    className={`unified-button ${selectedWinner === 'opponent' ? 'selected' : ''}`}
                    style={{
                      flex: '1',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: selectedWinner === 'opponent' ? 'var(--primary)' : 'var(--secondary)',
                      color: selectedWinner === 'opponent' ? 'var(--primary-foreground)' : 'var(--foreground)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      overflow: 'hidden'
                    }}
                  >
                    {selectedBattle.opponentName}
                  </button>
                </div>
              </div>

              {/* Кнопки действий */}
              <div 
                style={{
                  display: 'flex',
                  gap: '12px',
                  paddingTop: '16px'
                }}
              >
                <button
                  onClick={() => setBattleDetailOpen(false)}
                  className="unified-button"
                  style={{
                    flex: '1',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'var(--secondary)',
                    color: 'var(--foreground)',
                    border: 'none',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                >
                  Отменить
                </button>
                <button
                  onClick={handleApproveBattle}
                  disabled={!selectedWinner}
                  className="unified-button"
                  style={{
                    flex: '1',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: selectedWinner ? 'var(--primary)' : 'var(--muted)',
                    color: selectedWinner ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                    border: 'none',
                    cursor: selectedWinner ? 'pointer' : 'not-allowed',
                    overflow: 'hidden',
                    opacity: selectedWinner ? 1 : 0.6
                  }}
                >
                  Одобрить
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>

    {/* Модальное окно проверенных баттлов */}
    <Dialog open={checkedBattlesOpen} onOpenChange={setCheckedBattlesOpen}>
      <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
        <DialogTitle className="sr-only">Проверенные баттлы</DialogTitle>
        <DialogDescription className="sr-only">
          Панель управления со списком проверенных баттлов
        </DialogDescription>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="unified-heading" style={{ color: 'var(--foreground)', textAlign: 'center', flex: '1' }}>
              Панель управления
            </h2>
            <button
              onClick={() => setCheckedBattlesOpen(false)}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" style={{ color: 'rgba(var(--foreground), 0.7)' }} />
            </button>
          </div>

          <div 
            className="glass-card"
            style={{
              padding: '16px',
              borderRadius: '16px',
              overflow: 'hidden'
            }}
          >
            <h3 className="unified-text" style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>
              Проверенные баттлы
            </h3>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {finishedBattles.length > 0 ? (
                <div className="space-y-3">
                  {finishedBattles.map((battle) => (
                    <div 
                      key={battle.id}
                      className="glass-card"
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flex: '1',
                          overflow: 'hidden'
                        }}
                      >
                        <div 
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <User style={{ width: '16px', height: '16px', color: 'var(--muted-foreground)' }} />
                        </div>
                        <div style={{ overflow: 'hidden', flex: '1' }}>
                          <div className="unified-text" style={{ color: 'var(--foreground)', fontWeight: 'var(--font-weight-medium)' }}>
                            {battle.challenger.name}, команда
                          </div>
                          <div className="unified-text" style={{ color: 'var(--muted-foreground)' }}>
                            Соперник: {battle.opponent.name}
                          </div>
                        </div>
                      </div>
                      <button
                        className="unified-button"
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'var(--secondary)',
                          color: 'var(--foreground)',
                          border: 'none',
                          cursor: 'pointer',
                          flexShrink: 0,
                          overflow: 'hidden'
                        }}
                      >
                        Победитель
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="unified-text" style={{ color: 'var(--muted-foreground)', textAlign: 'center', padding: '32px 0' }}>
                  Нет проверенных баттлов
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Модальное окно просмотра доказательств */}
    <Dialog open={evidenceOpen} onOpenChange={setEvidenceOpen}>
      <DialogContent className="bg-background border-none max-w-md p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
        <DialogTitle className="sr-only">Прикрепленные доказательства</DialogTitle>
        <DialogDescription className="sr-only">
          Просмотр прикрепленных изображений как доказательства победы в баттле
        </DialogDescription>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="unified-heading" style={{ color: 'var(--foreground)', textAlign: 'center', flex: '1' }}>
              Прикрепленные доказательства
            </h2>
            <button
              onClick={() => setEvidenceOpen(false)}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" style={{ color: 'rgba(var(--foreground), 0.7)' }} />
            </button>
          </div>

          <div className="space-y-4">
            {mockEvidence.map((imageUrl, index) => (
              <div 
                key={index}
                className="glass-card"
                style={{
                  padding: '8px',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src={imageUrl} 
                  alt={`Доказательство ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                <div className="unified-text" style={{ color: 'var(--muted-foreground)', textAlign: 'center', marginTop: '8px' }}>
                  Скриншот {index + 1}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setEvidenceOpen(false)}
            className="unified-button"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              border: 'none',
              cursor: 'pointer',
              marginTop: '16px',
              overflow: 'hidden'
            }}
          >
            Закрыть
          </button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}