import { Star, X } from './Icons';
import coinImage from 'figma:asset/acaa4cccbfaf8eeee6ecbbe8f29c92d03b701371.png';

interface ModalXPProps {
  isOpen: boolean;
  onClose: () => void;
  level?: number;
  experience?: number;
  maxExperience?: number;
  theme?: 'light' | 'dark';
}

// Данные уровней и наград
const LEVEL_DATA = {
  // Статусы по уровням
  statuses: {
    1: 'Новичок', 2: 'Салага', 3: 'Стажер', 4: 'Практик', 5: 'Обменщик',
    6: 'Хомяк', 7: 'Чекер', 8: 'Фармер', 9: 'Лудоман', 10: 'Лидер',
    11: 'Приколист', 12: 'Суетолог', 13: 'Богомол', 14: 'Чепух', 15: 'KYC агент',
    16: 'Пуджик', 17: 'Кнопкодав', 18: 'Доллароид', 19: 'Диван ходлер', 20: 'Эксперт',
    21: 'Аналитик', 22: 'Инвестор', 23: 'Крутило', 24: 'Спекулянт', 25: 'Трейдер',
    26: 'Гуру', 27: 'Криптан', 28: 'Хакер', 29: 'Технарь', 30: 'Мастер',
    31: 'Профи', 32: 'Магистер', 33: 'Фиатник', 34: 'Новатор', 35: 'Арбитражник',
    36: 'Инфлюенсер', 37: 'Рублефил', 38: 'Визионер', 39: 'Патриот', 40: 'Икона',
    41: 'Стратег', 42: 'Генерал', 43: 'Лудик', 44: 'Леброн', 45: 'Маркетмейкер',
    46: 'Монетчик', 47: 'Ренегат', 48: 'Босс KFC', 49: 'Мастодонт', 50: 'Легенда'
  },
  
  // Требования XP для каждого уровня (всего опыта)
  requirements: {
    1: 0, 2: 100, 3: 250, 4: 500, 5: 900, 6: 1500, 7: 2350, 8: 3500, 9: 5000, 10: 6900,
    11: 9250, 12: 12100, 13: 15500, 14: 19500, 15: 24150, 16: 29500, 17: 35600, 18: 42500, 19: 50250, 20: 58900,
    21: 68500, 22: 79100, 23: 90750, 24: 103500, 25: 117400, 26: 132500, 27: 148850, 28: 166500, 29: 185500, 30: 205900,
    31: 227750, 32: 251100, 33: 276000, 34: 302500, 35: 330650, 36: 360500, 37: 392100, 38: 425500, 39: 460750, 40: 497900,
    41: 537000, 42: 578100, 43: 621250, 44: 666500, 45: 713900, 46: 763500, 47: 815350, 48: 869500, 49: 926000, 50: 984900
  },
  
  // Награды за переходы
  rewards: {
    2: 50, 3: 75, 4: 125, 5: 200, 6: 300, 7: 425, 8: 575, 9: 750, 10: 950,
    11: 1200, 12: 1500, 13: 1800, 14: 2200, 15: 2600, 16: 3100, 17: 3600, 18: 4200, 19: 4800, 20: 5500,
    21: 6300, 22: 7100, 23: 8000, 24: 9000, 25: 10000, 26: 11200, 27: 12500, 28: 13900, 29: 15400, 30: 17000,
    31: 18700, 32: 20500, 33: 22400, 34: 24400, 35: 26500, 36: 28700, 37: 31000, 38: 33400, 39: 35900, 40: 38500,
    41: 41200, 42: 44000, 43: 46900, 44: 49900, 45: 53000, 46: 56200, 47: 59500, 48: 62900, 49: 66400, 50: 70000
  }
};

export function ModalXP({ 
  isOpen, 
  onClose, 
  level = 1, 
  experience = 0, 
  maxExperience = 100,
  theme = 'light'
}: ModalXPProps) {
  if (!isOpen) return null;

  const currentLevel = Math.max(1, Math.min(50, level)); // Ограничиваем от 1 до 50
  const currentXp = Math.max(0, experience);
  
  // Получаем данные текущего уровня
  const currentStatus = LEVEL_DATA.statuses[currentLevel as keyof typeof LEVEL_DATA.statuses] || 'Новичок';
  const currentLevelXp = LEVEL_DATA.requirements[currentLevel as keyof typeof LEVEL_DATA.requirements] || 0;
  
  // Следующий уровень
  const nextLevel = Math.min(50, currentLevel + 1);
  const nextStatus = LEVEL_DATA.statuses[nextLevel as keyof typeof LEVEL_DATA.statuses] || 'Салага';
  const nextLevelXp = LEVEL_DATA.requirements[nextLevel as keyof typeof LEVEL_DATA.requirements] || 100;
  const nextLevelReward = LEVEL_DATA.rewards[nextLevel as keyof typeof LEVEL_DATA.rewards] || 50;
  
  // Рассчитываем прогресс к следующему уровню
  const xpToNextLevel = nextLevelXp - currentLevelXp;
  const currentProgressXp = currentXp - currentLevelXp;
  const progressPercentage = Math.min(Math.max(0, (currentProgressXp / xpToNextLevel) * 100), 100);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="responsive-dialog-container force-modal-top"
      style={{
        background: theme === 'dark' 
          ? 'rgba(0, 0, 0, 0.45)' 
          : 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 999999,
        position: 'fixed'
      }}
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div 
        className="responsive-xp-modal responsive-modal force-viewport-contained"
        style={{
          backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          gap: '16px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)',
          border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'}`,
          position: 'relative',
          zIndex: 999999,
          width: '340px',
          maxWidth: '90vw'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header с кнопкой закрытия */}
        <div 
          style={{ 
            position: 'relative',
            marginBottom: '4px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <h2 
            className="unified-heading"
            style={{ 
              color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
              margin: 0,
              textAlign: 'center'
            }}
          >
            Текущий уровень
          </h2>
          
          <button
            onClick={onClose}
            className="apple-button"
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X 
              className="w-5 h-5" 
              style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
            />
          </button>
        </div>

        {/* Информация о текущем уровне */}
        <div 
          className="flex items-center justify-between"
          style={{ marginBottom: '0px' }}
        >
          <div className="unified-text" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
            Статус: {currentStatus}
          </div>
          <div className="unified-text" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
            lvl {currentLevel}
          </div>
        </div>

        {/* Прогресс бар */}
        <div 
          style={{
            height: '16px',
            backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8',
            borderRadius: '12px',
            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'}`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}
        >
          {/* Полоса прогресса */}
          <div 
            className="transition-all duration-500"
            style={{ 
              width: `${progressPercentage}%`,
              height: '14px',
              background: '#2B82FF',
              borderRadius: '11px',
              position: 'absolute',
              left: '1px',
              top: '1px'
            }}
          />
          
          {/* Текст прогресса */}
          <span 
            className="unified-text"
            style={{ 
              color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
              position: 'relative',
              zIndex: 2,
              fontWeight: '500'
            }}
          >
            {Math.max(0, currentProgressXp)}/{xpToNextLevel}
          </span>
        </div>

        {/* Информация о следующем ур��вне */}
        {currentLevel < 50 && (
          <>
            <div 
              className="unified-text" 
              style={{ 
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                marginBottom: '12px',
                textAlign: 'center'
              }}
            >
              На следующем уровне:
            </div>

            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div 
                className="flex items-center gap-2"
              >
                <span className="unified-text" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                  Статус:
                </span>
                <span className="unified-text" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                  {nextStatus}
                </span>
              </div>

              <div 
                className="flex items-center gap-2"
              >
                <span className="unified-text" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                  Награда:
                </span>
                <div 
                  className="flex items-center gap-1"
                >
                  <img 
                    src={coinImage} 
                    alt="G-coin" 
                    style={{ 
                      width: '16px', 
                      height: '16px'
                    }}
                  />
                  <span className="unified-text" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                    {nextLevelReward}g
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}