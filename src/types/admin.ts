export interface AdminUser {
  telegramId: string;
  username: string;
  role: 'admin' | 'teamlead' | 'senior_admin' | 'junior_admin';
  teamNumber?: number;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  scope: 'global' | 'team' | 'user';
}

export interface User {
  telegramId: string;
  username: string;
  displayName: string;
  teamNumber: number;
  gCoins: number;
  level: number;
  experience: number;
  achievements: string[]; // ID достижений
  joinedAt: Date;
  lastActive: Date;
  status: 'active' | 'inactive' | 'banned';
}

export interface Battle {
  id: string;
  title: string;
  description: string;
  teamA: number;
  teamB: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  createdBy: string; // Telegram ID админа/тимлида
  prize: {
    winner: number; // G-монеты для победителя
    participant: number; // G-монеты за участие
  };
  results?: {
    winner: number; // номер команды-победителя
    scoreA: number;
    scoreB: number;
  };
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalAchievements: number;
  activeBattles: number;
  totalBattles: number;
  totalGCoinsInCirculation: number;
  topTeams: Array<{
    teamNumber: number;
    totalGCoins: number;
    memberCount: number;
    averageLevel: number;
  }>;
}

export interface AdminAction {
  id: string;
  adminId: string;
  action: 'create_achievement' | 'create_battle' | 'ban_user' | 'give_coins' | 'modify_user';
  target?: string; // ID цели действия (пользователь, достижение и т.д.)
  details: Record<string, any>;
  timestamp: Date;
}