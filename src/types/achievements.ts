export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  isUnlocked?: boolean;
  unlockedAt?: Date;
  category?: 'general' | 'battles' | 'progression' | 'tasks' | 'shop' | 'level' | 'cases';
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: string;
    target: number;
    current: number;
  };
  reward?: {
    type: 'coins' | 'badge' | 'experience';
    amount: number;
    badgeType?: string;
  };
  status?: 'available' | 'in_progress' | 'completed' | 'locked' | 'pending';
  isActive?: boolean;
  // Поля для админки
  adminComment?: string;
  adminFile?: string;
  userFile?: string;
  conditions?: string[];
  submittedAt?: string;
}

export type SortType = 'alphabet' | 'progress_asc' | 'progress_desc' | 'completed' | 'date' | 'reward_asc' | 'reward_desc' | 'time_asc' | 'time_desc';