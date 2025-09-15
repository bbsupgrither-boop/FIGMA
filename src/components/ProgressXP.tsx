import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Star } from './Icons';
import { X } from 'lucide-react';
import coinImage from 'figma:asset/acaa4cccbfaf8eeee6ecbbe8f29c92d03b701371.png';

interface ProgressXPProps {
  level?: number;
  experience?: number;
  maxExperience?: number;
  showModal?: boolean;
  theme?: 'light' | 'dark';
}

export function ProgressXP({ 
  level = 1, 
  experience = 0, 
  maxExperience = 250,
  showModal = true,
  theme = 'light'
}: ProgressXPProps) {
  const [isXpDialogOpen, setIsXpDialogOpen] = useState(false);
  
  // Данные пользователя
  const currentXp = experience;
  const currentLevel = level;
  const xpNeededForNextLevel = maxExperience;
  const nextLevelReward = Math.floor(level * 50); // G-coins за переход на следующий уровень
  
  // Используем CSS переменные для точного соответствия дизайн-системе
  
  return (
    <>
      {/* Progress XP Component */}
      <div className="flex flex-col" style={{ gap: '8px' }}>
        {/* Лента прогресса со звездой */}
        <div className="relative">
          {/* Звезда слева с перекрытием */}
          <div 
            className="absolute z-10"
            style={{
              left: '-12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px'
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Star 
                className="w-8 h-8 fill-current" 
                style={{ color: 'var(--text)' }}
              />
              <span 
                className="absolute font-bold"
                style={{ 
                  fontSize: '12px',
                  color: '#FFFFFF'
                }}
              >
                {currentLevel}
              </span>
            </div>
          </div>
          
          {/* Лента прогресса */}
          <div 
            className="w-full"
            style={{
              height: '16px',
              backgroundColor: 'var(--progress-track)',
              borderRadius: '12px',
              border: '1px solid var(--progress-track-border)',
              opacity: 1
            }}
          >
            <div 
              className="transition-all duration-500"
              style={{ 
                width: `${(currentXp / xpNeededForNextLevel) * 100}%`,
                height: '16px',
                background: theme === 'dark' 
                  ? 'var(--primary)'
                  : 'linear-gradient(90deg, #2B82FF 0%, #62A6FF 100%)',
                borderRadius: '12px',
                opacity: 1
              }}
            />
          </div>
        </div>
        
        {/* Число прогресса под лентой */}
        <div className="text-center">
          <span 
            className="font-semibold"
            style={{ 
              fontSize: '14px',
              color: 'var(--text)',
              opacity: 1
            }}
          >
            {showModal ? (
              <button 
                onClick={() => setIsXpDialogOpen(true)}
                className="transition-colors cursor-pointer hover:opacity-70"
              >
                {currentXp.toLocaleString()}/{xpNeededForNextLevel.toLocaleString()}
              </button>
            ) : (
              `${currentXp.toLocaleString()}/${xpNeededForNextLevel.toLocaleString()}`
            )}
          </span>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <Dialog open={isXpDialogOpen} onOpenChange={setIsXpDialogOpen}>
          <DialogContent 
            className="w-auto min-w-[320px] max-w-[360px] mx-4"
            style={{
              padding: '16px',
              gap: '12px',
              borderRadius: '16px'
            }}
          >
            <DialogTitle className="sr-only">
              Ваш текущий опыт
            </DialogTitle>
            
            <DialogDescription className="sr-only">
              Просмотр текущего уровня, опыта и награды за следующий уровень
            </DialogDescription>
            
            {/* Шапка с заголовком и кнопкой закрытия */}
            <div className="flex items-center justify-between" style={{ margin: '0 0 0 0' }}>
              <div className="flex-1"></div>
              <h2 
                className="text-center font-semibold whitespace-nowrap flex-1"
                style={{ 
                  fontSize: '18px',
                  color: 'var(--text)',
                  margin: 0
                }}
              >
                Ваш текущий опыт
              </h2>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setIsXpDialogOpen(false)}
                  className="flex items-center justify-center transition-colors hover:bg-surface-2"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)'
                  }}
                >
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
            </div>

            {/* Блок прогресса */}
            <div className="flex flex-col" style={{ gap: '8px' }}>
              {/* Лента прогресса со звездой */}
              <div className="relative">
                {/* Звезда слева с перекрытием */}
                <div 
                  className="absolute z-10"
                  style={{
                    left: '-12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Star 
                      className="w-8 h-8 fill-current" 
                      style={{ color: 'var(--text)' }}
                    />
                    <span 
                      className="absolute font-bold"
                      style={{ 
                        fontSize: '12px',
                        color: 'var(--primary-foreground)'
                      }}
                    >
                      {currentLevel}
                    </span>
                  </div>
                </div>
                
                {/* Лента прогресса */}
                <div 
                  className="w-full rounded-xl"
                  style={{
                    height: '16px',
                    backgroundColor: 'var(--surface-3)',
                    borderRadius: '12px'
                  }}
                >
                  <div 
                    className="rounded-xl transition-all duration-500"
                    style={{ 
                      width: `${(currentXp / xpNeededForNextLevel) * 100}%`,
                      height: '16px',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '12px'
                    }}
                  />
                </div>
              </div>
              
              {/* Число прогресса под лентой */}
              <div className="text-center">
                <span 
                  className="font-semibold"
                  style={{ 
                    fontSize: '14px',
                    color: 'var(--text)'
                  }}
                >
                  {currentXp.toLocaleString()}/{xpNeededForNextLevel.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Блок награды */}
            <div className="flex flex-col items-center" style={{ gap: '8px' }}>
              {/* Заголовок награды */}
              <span 
                className="font-semibold text-center"
                style={{ 
                  fontSize: '14px',
                  color: 'var(--text)'
                }}
              >
                Награда за уровень
              </span>
              
              {/* Пилюля с монетой */}
              <div 
                className="flex items-center border"
                style={{
                  height: '32px',
                  borderRadius: '999px',
                  padding: '0 12px',
                  gap: '8px',
                  backgroundColor: 'var(--surface-2)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px'
                }}
              >
                <img 
                  src={coinImage} 
                  alt="G-coin" 
                  style={{ width: '16px', height: '16px' }}
                />
                <span 
                  className="font-semibold"
                  style={{ 
                    fontSize: '14px',
                    color: 'var(--text)'
                  }}
                >
                  {nextLevelReward}g
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}