export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: 'xp' | 'coins' | 'experience';
  deadline: string;
  category: 'individual' | 'team' | 'global' | 'daily' | 'weekly';
  priority?: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'expired';
  assignedTo?: string; // для индивидуальных задач
  teamId?: number; // для командных задач
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  isPublished: boolean;
  tags?: string[];
}