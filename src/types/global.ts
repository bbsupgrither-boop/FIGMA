// Глобальные типы для приложения GRITHER

export type UserRole = 'worker' | 'teamlead' | 'junior_admin' | 'senior_admin' | 'main_admin';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: UserRole;
  level: number;
  experience: number;
  maxExperience: number;
  balance: number;
  rating: number;
  completedTasks: number;
  achievementsCount: number;
  battlesWon: number;
  battlesLost: number;
  teamId?: string;
  isOnline: boolean;
  lastSeen: Date;
  joinedDate: Date;
}

export interface Team {
  id: string;
  name: string;
  leaderId: string;
  memberIds: string[];
  totalRating: number;
  completedProjects: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  experienceReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed' | 'pending' | 'rejected';
  assignedTo: string[];
  createdBy: string;
  createdAt: Date;
  deadline?: Date;
  category: string;
  tags: string[];
  submissionUrl?: string;
  completedBy?: string;
  completedAt?: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
}

export interface Battle {
  id: string;
  title: string;
  description: string;
  participants: string[];
  maxParticipants: number;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  prize: number;
  experiencePrize: number;
  winner?: string;
  submissions: BattleSubmission[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdBy: string;
  rules: string[];
}

// Персональный баттл между двумя пользователями
export interface PersonalBattle {
  id: string;
  challenger: {
    id: string;
    name: string;
    team: number;
    level: number;
    avatar: string | null;
    role: string;
    achievements: number;
    completedTasks: number;
  };
  opponent: {
    id: string;
    name: string;
    team: number;
    level: number;
    avatar: string | null;
    status: 'available' | 'in_battle';
    role: string;
    achievements: number;
    completedTasks: number;
  };
  status: 'active' | 'pending' | 'completed';
  prize: number;
  endDate: Date;
  created: Date;
  winner?: 'challenger' | 'opponent';
  evidences?: {
    challenger?: {
      comment: string;
      files: string[];
      submittedAt: Date;
    };
    opponent?: {
      comment: string;
      files: string[];
      submittedAt: Date;
    };
  };
}

export interface BattleSubmission {
  id: string;
  battleId: string;
  userId: string;
  submissionUrl: string;
  description: string;
  submittedAt: Date;
  score?: number;
  votes: number;
  status: 'pending' | 'verified' | 'rejected';
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'bonus' | 'privilege' | 'cosmetic' | 'tool';
  imageUrl: string;
  isAvailable: boolean;
  stock?: number;
  discount?: number;
  requirements?: {
    level?: number;
    achievements?: string[];
    role?: UserRole[];
  };
  effects: {
    experienceBoost?: number;
    balanceBoost?: number;
    privilegeDays?: number;
    description: string;
  };
}

export interface Purchase {
  id: string;
  userId: string;
  itemId: string;
  price: number;
  purchasedAt: Date;
  status: 'active' | 'used' | 'expired';
  expiresAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'achievement' | 'task' | 'battle' | 'purchase' | 'admin' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  change: number; // изменение позиции с прошлой недели
  score?: number; // текущий счёт/рейтинг
}

export interface AppState {
  users: User[];
  teams: Team[];
  tasks: Task[];
  battles: Battle[];
  shopItems: ShopItem[];
  purchases: Purchase[];
  notifications: Notification[];
  currentUser: User;
  leaderboard: LeaderboardEntry[];
}