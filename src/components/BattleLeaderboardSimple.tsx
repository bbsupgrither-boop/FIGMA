import { useState } from 'react';

interface BattleLeaderboardSimpleProps {
  leaderboard?: any[];
  activeBattles?: any[];
  onNavigate?: (page: string) => void;
  personalBattles?: any[];
  setPersonalBattles?: (battles: any[]) => void;
  theme?: 'light' | 'dark';
}

export function BattleLeaderboardSimple({ 
  personalBattles = [], 
  setPersonalBattles,
  theme = 'light' 
}: BattleLeaderboardSimpleProps) {
  const [testMode, setTestMode] = useState(false);

  const handleTestClick = () => {
    console.log('TEST BUTTON CLICKED!');
    alert('Тестовая кнопка работает!');
    setTestMode(!testMode);
  };

  const handleVictoryClick = () => {
    console.log('VICTORY BUTTON CLICKED! personalBattles:', personalBattles);
    alert('Кнопка "Выиграл" работает!');
  };

  const handleCancelClick = () => {
    console.log('CANCEL BUTTON CLICKED! personalBattles:', personalBattles);
    alert('Кнопка "Отменить" работает!');
  };

  const handleCreateBattle = () => {
    console.log('CREATE BATTLE CLICKED!');
    if (setPersonalBattles) {
      const newBattle = {
        id: Date.now().toString(),
        opponent: { name: 'Тест Противник', team: 2, level: 5 },
        prize: 500,
        status: 'active',
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };
      setPersonalBattles([...personalBattles, newBattle]);
      alert('Тестовый баттл создан!');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Баттл секция */}
      <div 
        style={{
          backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
          borderRadius: '20px',
          border: theme === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.06)' 
            : '1px solid #E6E9EF',
          boxShadow: theme === 'dark' 
            ? '0 8px 24px rgba(0, 0, 0, 0.6)' 
            : '0 8px 24px rgba(0, 0, 0, 0.10)',
          padding: '16px',
          position: 'relative',
          zIndex: 30
        }}
      >
        <div style={{ marginBottom: '12px' }}>
          <h3 
            style={{ 
              color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
              textAlign: 'center',
              margin: '0 0 8px 0',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Диагностика Баттлов
          </h3>
          
          <button
            onClick={handleTestClick}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '8px',
              backgroundColor: testMode ? '#34C759' : '#FF3B30',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              position: 'relative',
              zIndex: 40
            }}
            onMouseDown={(e) => console.log('Mouse down на тест кнопке')}
            onMouseUp={(e) => console.log('Mouse up на тест кнопке')}
          >
            ТЕСТ КНОПКА {testMode ? '✓' : '✗'}
          </button>

          <button
            onClick={handleCreateBattle}
            style={{
              width: '100%',
              padding: '6px',
              marginBottom: '8px',
              backgroundColor: '#007AFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              position: 'relative',
              zIndex: 40
            }}
          >
            Создать тестовый баттл
          </button>
        </div>

        {personalBattles.length > 0 ? (
          <div>
            <div 
              style={{ 
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                borderRadius: '8px'
              }}
            >
              <div 
                style={{ 
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                  fontSize: '12px',
                  marginBottom: '4px'
                }}
              >
                Баттл с {personalBattles[0].opponent.name}
              </div>
              <div 
                style={{ 
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280',
                  fontSize: '10px',
                  marginBottom: '8px'
                }}
              >
                Ставка: {personalBattles[0].prize}g
              </div>
              
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('DIRECT CLICK на кнопку Выиграл');
                    handleVictoryClick();
                  }}
                  onMouseDown={(e) => console.log('MouseDown на Выиграл')}
                  onMouseUp={(e) => console.log('MouseUp на Выиграл')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    backgroundColor: '#34C759',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    position: 'relative',
                    zIndex: 50
                  }}
                >
                  Выиграл
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('DIRECT CLICK на кнопку Отменить');
                    handleCancelClick();
                  }}
                  onMouseDown={(e) => console.log('MouseDown на Отменить')}
                  onMouseUp={(e) => console.log('MouseUp на Отменить')}
                  style={{
                    padding: '6px 8px',
                    backgroundColor: '#FF3B30',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    position: 'relative',
                    zIndex: 50
                  }}
                >
                  Отменить
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            style={{
              textAlign: 'center',
              color: theme === 'dark' ? '#A7B0BD' : '#6B7280',
              fontSize: '12px',
              padding: '12px'
            }}
          >
            Нет активных баттлов
          </div>
        )}
      </div>

      {/* Лидерборд секция (упрощенная) */}
      <div 
        style={{
          backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
          borderRadius: '20px',
          border: theme === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.06)' 
            : '1px solid #E6E9EF',
          boxShadow: theme === 'dark' 
            ? '0 8px 24px rgba(0, 0, 0, 0.6)' 
            : '0 8px 24px rgba(0, 0, 0, 0.10)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <h3 
          style={{ 
            color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
            margin: '0',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Лидерборд
        </h3>
        <div 
          style={{
            color: theme === 'dark' ? '#A7B0BD' : '#6B7280',
            fontSize: '12px',
            marginTop: '4px'
          }}
        >
          (заглушка)
        </div>
      </div>
    </div>
  );
}