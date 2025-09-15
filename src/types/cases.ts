export interface Prize {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  color: string;
  value: number; // Стоимость приза
  dropChance: number; // Вероятность выпадения в процентах
  description: string;
  type?: 'coins' | 'experience' | 'item'; // Тип приза для определения что зачислять
}

export interface CaseType {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  color: string;
  description: string;
  contents: string[];
  prizes: Prize[]; // Массив призов в кейсе
  isActive: boolean; // Активен ли кейс
  glowColor?: string; // Цвет неоновой обводки (опциональный)
  glowIntensity?: 'low' | 'medium' | 'high'; // Интенсивность свечения
}

export interface UserCase {
  id: string;
  caseTypeId: string;
  obtainedAt: Date;
  isOpened: boolean;
  reward?: Prize; // Изменили на объект Prize
}

export interface CaseShopItem {
  id: string;
  caseTypeId: string;
  price: number;
  currency: 'coins' | 'gems';
  discount?: number;
  isAvailable: boolean;
}

export interface RouletteResult {
  selectedCase: CaseType;
  animationDuration: number;
}

export interface PrizeRouletteResult {
  selectedPrize: Prize;
  animationDuration: number;
}