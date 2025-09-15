import { useState } from 'react';
import { ModalXP } from './ModalXP';

interface ProgressBarProps {
  level?: number;
  experience?: number;
  maxExperience?: number;
  showStatus?: boolean;
  theme?: 'light' | 'dark';
}

// Функция для получения статуса по уровню
function getStatusForLevel(level: number): string {
  const statuses: { [key: number]: string } = {
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
  };
  
  return statuses[Math.min(Math.max(level, 1), 50)] || 'Новичок';
}

export function ProgressBar({ 
  level = 1, 
  experience = 0, 
  maxExperience = 100,
  showStatus = true,
  theme = 'light'
}: ProgressBarProps) {
  const [isXpDialogOpen, setIsXpDialogOpen] = useState(false);

  return (
    <>
      <div className="glass-card rounded-3xl p-4">
        <div className="flex items-center mb-4 px-1 gap-2">
          {showStatus && (
            <span className="unified-text text-muted-foreground whitespace-nowrap" style={{ fontSize: '11px !important', minWidth: 'fit-content' }}>
              Статус: {getStatusForLevel(level)}
            </span>
          )}
          <button 
            onClick={() => setIsXpDialogOpen(true)}
            className="unified-text flex-1 text-center transition-colors cursor-pointer text-muted-foreground hover:text-primary"
            style={{ fontSize: '11px !important' }}
          >
            XP: {experience}
          </button>
          <span 
            className={`unified-text font-medium text-muted-foreground ${showStatus ? 'text-right' : 'ml-auto'} whitespace-nowrap`}
            style={{ fontSize: '11px !important', minWidth: 'fit-content' }}
          >
            lvl {level}
          </span>
        </div>
        <div 
          className="w-full rounded-full h-3"
          style={{
            backgroundColor: theme === 'dark' ? '#0F1116' : '#ECEFF3',
            border: `1px solid ${theme === 'dark' ? '#2A2F36' : '#E6E9EF'}`
          }}
        >
          <div 
            className="h-3 rounded-full transition-all duration-500" 
            style={{ 
              width: `${Math.min((experience / maxExperience) * 100, 100)}%`,
              background: theme === 'dark' 
                ? '#2B82FF'
                : 'linear-gradient(90deg, #2B82FF 0%, #62A6FF 100%)'
            }}
          ></div>
        </div>
      </div>

      <ModalXP 
        isOpen={isXpDialogOpen}
        onClose={() => setIsXpDialogOpen(false)}
        level={level}
        experience={experience}
        maxExperience={maxExperience}
        theme={theme}
      />
    </>
  );
}