export interface User {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  rating: number;
  balance: number;
  experience?: number;
  maxExperience?: number;
  isOnline?: boolean;
  telegramId?: number | null;
  username?: string | null;
}

export interface BattleInvitation {
  id: string;
  challengerId: string;
  challengerName: string;
  opponentId: string;
  opponentName: string;
  stake: number;
  message?: string;
  createdAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface Battle {
  id: string;
  challengerId: string;
  challengerName: string;
  opponentId: string;
  opponentName: string;
  stake: number;
  status: 'active' | 'completed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  winnerId?: string;
  winnerName?: string;
  loserId?: string;
  loserName?: string;
}

export interface BattleStats {
  wins: number;
  losses: number;
  totalBattles: number;
  totalEarned: number;
  totalLost: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
}