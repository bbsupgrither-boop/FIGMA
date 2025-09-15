import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Prize, PrizeRouletteResult } from '../types/cases';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PrizeRouletteProps {
  prizes: Prize[];
  onResult: (result: PrizeRouletteResult) => void;
  isSpinning: boolean;
  onSpinComplete: () => void;
  hasSpun: boolean;
}

export function PrizeRoulette({ prizes, onResult, isSpinning, onSpinComplete, hasSpun }: PrizeRouletteProps) {
  const [spinOffset, setSpinOffset] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);

  // Если нет призов, не рендерим компонент
  if (!prizes || prizes.length === 0) {
    return (
      <div className="relative w-full h-48 overflow-hidden rounded-xl bg-surface border border-border flex items-center justify-center">
        <div className="text-muted-foreground">Загрузка призов...</div>
      </div>
    );
  }

  // Функция для проверки, является ли строка URL или base64
  const isImageUrl = (str: string) => {
    try {
      new URL(str);
      return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:');
    } catch {
      return false;
    }
  };

  // Компонент для отображения изображения или эмодзи
  const ImageOrEmoji = ({ src, className = '', style = {} }: { src: string; className?: string; style?: React.CSSProperties }) => {
    if (isImageUrl(src)) {
      return (
        <ImageWithFallback
          src={src}
          alt="Prize image"
          className={`${className} object-cover`}
          style={style}
        />
      );
    }
    return (
      <div className={`flex items-center justify-center ${className}`} style={style}>
        <span className="text-3xl">{src}</span>
      </div>
    );
  };

  // Функция для выбора приза на основе вероятностей
  const selectRandomPrize = (): Prize => {
    const totalChance = prizes.reduce((sum, prize) => sum + prize.dropChance, 0);
    let randomValue = Math.random() * totalChance;
    
    for (const prize of prizes) {
      randomValue -= prize.dropChance;
      if (randomValue <= 0) {
        return prize;
      }
    }
    
    // Возвращаем последний приз как fallback
    return prizes[prizes.length - 1];
  };

  // Создаем зацикленный массив призов для бесшовной прокрутки
  const repeatCount = 12;
  const repeatedPrizes = [];
  for (let i = 0; i < repeatCount; i++) {
    repeatedPrizes.push(...prizes);
  }
  
  const itemWidth = 100;
  const containerWidth = 300;
  const centerPosition = containerWidth / 2;

  useEffect(() => {
    if (isSpinning && prizes.length > 0) {
      // Выбираем случайный приз на основе вероятностей
      const randomPrize = selectRandomPrize();
      setSelectedPrize(randomPrize);
      
      // Находим позицию выбранного приза в средней части повторяющегося массива
      const middleRepeatIndex = Math.floor(repeatCount / 2);
      const prizeIndex = prizes.findIndex(p => p.id === randomPrize.id);
      const targetIndex = middleRepeatIndex * prizes.length + prizeIndex;
      const targetPosition = targetIndex * itemWidth;
      
      // Рассчитываем финальный offset чтобы выбранный приз оказался в центре
      const finalOffset = -(targetPosition - centerPosition + itemWidth / 2);
      
      // Добавляем дополнительные обороты для эффекта
      const extraSpins = 3;
      const totalOffset = finalOffset - (prizes.length * itemWidth * extraSpins);
      
      setSpinOffset(totalOffset);

      // Через 5 секунд завершаем спин
      setTimeout(() => {
        onResult({
          selectedPrize: randomPrize,
          animationDuration: 5000
        });
        onSpinComplete();
      }, 5000);
    }
  }, [isSpinning, prizes, onResult, onSpinComplete, centerPosition, itemWidth, repeatCount]);

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-xl bg-surface border border-border">
      {/* Центральная линия-указатель */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary z-20">
        {/* Треугольник сверху */}
        <div 
          className="absolute -top-2 left-1/2 transform -translate-x-1/2"
        >
          <div 
            className="w-0 h-0 border-l-3 border-r-3 border-b-8 border-transparent border-b-primary"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />
        </div>
        {/* Треугольник снизу */}
        <div 
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
        >
          <div 
            className="w-0 h-0 border-l-3 border-r-3 border-t-8 border-transparent border-t-primary"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />
        </div>
      </div>

      {/* Рулетка */}
      <div className="absolute inset-0 flex items-center overflow-hidden">
        <motion.div
          className="flex items-start h-full"
          style={{ 
            width: repeatedPrizes.length * itemWidth,
            x: hasSpun ? spinOffset : 0,
            paddingTop: '16px'
          }}
          animate={{ 
            x: isSpinning ? spinOffset : (hasSpun ? spinOffset : 0)
          }}
          transition={{
            duration: isSpinning ? 5 : 0,
            ease: isSpinning ? [0.23, 1, 0.32, 1] : 'linear'
          }}
          initial={{ x: 0 }}
        >
          {repeatedPrizes.map((prize, index) => (
            <div
              key={`${prize.id}-${index}`}
              className="flex-shrink-0 flex flex-col items-center"
              style={{ 
                width: itemWidth,
                height: '160px'
              }}
            >
              <div 
                className="w-20 h-20 rounded-lg border-2 transition-all duration-200 overflow-hidden"
                style={{ 
                  backgroundColor: prize.color + '20',
                  borderColor: prize.color,
                  boxShadow: `0 4px 8px ${prize.color}30`
                }}
              >
                <ImageOrEmoji
                  src={prize.image}
                  className="w-full h-full"
                />
              </div>
              <div 
                className="text-xs text-center font-medium text-foreground px-1 mt-2"
                style={{
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: '1.2'
                }}
              >
                {prize.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {prize.dropChance}%
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Градиентные края для эффекта затухания */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface via-surface/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface via-surface/80 to-transparent pointer-events-none z-10" />
    </div>
  );
}