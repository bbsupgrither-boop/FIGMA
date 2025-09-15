import { useCallback } from 'react';
import { Battle, BattleInvitation } from '../types/battles';

interface UseBattleActionsProps {
  battles: Battle[];
  setBattles: (battles: Battle[]) => void;
  battleInvitations: BattleInvitation[];
  setBattleInvitations: (invitations: BattleInvitation[]) => void;
  getUserBalance: (userId: string) => number;
  updateUserBalance: (userId: string, amount: number) => void;
}

export function useBattleActions({
  battles,
  setBattles,
  battleInvitations,
  setBattleInvitations,
  getUserBalance,
  updateUserBalance
}: UseBattleActionsProps) {

  const createBattleInvitation = useCallback((invitation: Omit<BattleInvitation, 'id' | 'createdAt' | 'expiresAt' | 'status'>) => {
    try {
      const challengerBalance = getUserBalance(invitation.challengerId);
      if (challengerBalance < invitation.stake) {
        console.error('Недостаточно средств для создания баттла');
        return;
      }

      const opponentBalance = getUserBalance(invitation.opponentId);
      if (opponentBalance < invitation.stake) {
        console.error('У оппонента недостаточно коинов для участия в баттле');
        return;
      }
      
      const newInvitation: BattleInvitation = {
        ...invitation,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'pending'
      };
      
      setBattleInvitations(prev => [newInvitation, ...prev]);
    } catch (error) {
      console.error('Error in createBattleInvitation:', error);
    }
  }, [getUserBalance, setBattleInvitations]);

  const acceptBattleInvitation = useCallback((invitationId: string) => {
    const invitation = battleInvitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    const opponentBalance = getUserBalance(invitation.opponentId);
    if (opponentBalance < invitation.stake) {
      console.error('Недостаточно средств для участия в баттле');
      return;
    }

    const challengerBalance = getUserBalance(invitation.challengerId);
    if (challengerBalance < invitation.stake) {
      console.error('У инициатора недостаточно коинов для продолжения баттла');
      
      setBattleInvitations(prev => 
        prev.map(inv => 
          inv.id === invitationId 
            ? { ...inv, status: 'declined' as const }
            : inv
        )
      );
      return;
    }

    setBattleInvitations(prev => 
      prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: 'accepted' as const }
          : inv
      )
    );

    const newBattle: Battle = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      challengerId: invitation.challengerId,
      challengerName: invitation.challengerName,
      opponentId: invitation.opponentId,
      opponentName: invitation.opponentName,
      stake: invitation.stake,
      status: 'active',
      startedAt: new Date()
    };

    setBattles(prev => [newBattle, ...prev]);
  }, [battleInvitations, getUserBalance, setBattleInvitations, setBattles]);

  const declineBattleInvitation = useCallback((invitationId: string) => {
    setBattleInvitations(prev => 
      prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: 'declined' as const }
          : inv
      )
    );
  }, [setBattleInvitations]);

  const completeBattle = useCallback((battleId: string, winnerId: string) => {
    const battle = battles.find(b => b.id === battleId);
    if (!battle) return;

    const winnerName = winnerId === battle.challengerId ? battle.challengerName : battle.opponentName;
    const loserName = winnerId === battle.challengerId ? battle.opponentName : battle.challengerName;
    const loserId = winnerId === battle.challengerId ? battle.opponentId : battle.challengerId;

    updateUserBalance(winnerId, battle.stake);
    updateUserBalance(loserId, -battle.stake);

    setBattles(prev => 
      prev.map(b => 
        b.id === battleId 
          ? { 
              ...b, 
              status: 'completed' as const,
              completedAt: new Date(),
              winnerId,
              winnerName,
              loserId,
              loserName
            }
          : b
      )
    );
  }, [battles, updateUserBalance, setBattles]);

  return {
    createBattleInvitation,
    acceptBattleInvitation,
    declineBattleInvitation,
    completeBattle
  };
}