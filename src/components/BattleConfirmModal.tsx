import { ModalOpaque } from './ModalOpaque';
import { X, User, Coins } from 'lucide-react';
import { User as BattleUser } from '../types/battles';

interface BattleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenger: BattleUser;
  opponent: BattleUser;
  stake: number;
  onConfirm: () => void;
  theme?: 'light' | 'dark';
}

export function BattleConfirmModal({ 
  isOpen, 
  onClose, 
  challenger,
  opponent,
  stake,
  onConfirm,
  theme = 'light' 
}: BattleConfirmModalProps) {
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <ModalOpaque
      isOpen={isOpen}
      onClose={onClose}
      title="Подтверждение вызова"
      theme={theme}
      actions={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl transition-all hover:opacity-80"
            style={{
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#F3F5F8',
              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E6E9EF',
              color: theme === 'dark' ? '#E8ECF2' : '#6B7280'
            }}
          >
            <span className="unified-button">Отменить</span>
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-xl transition-all hover:opacity-90"
            style={{
              background: '#2B82FF',
              border: '1px solid #2B82FF',
              color: '#FFFFFF'
            }}
          >
            <span className="unified-button">Вызвать на баттл</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Предупреждение */}
        <div 
          className="p-4 rounded-xl border"
          style={{
            background: theme === 'dark' ? 'rgba(255, 159, 10, 0.1)' : 'rgba(255, 159, 10, 0.05)',
            border: theme === 'dark' ? '1px solid rgba(255, 159, 10, 0.2)' : '1px solid rgba(255, 159, 10, 0.15)'
          }}
        >
          <p 
            className="unified-text text-center"
            style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
          >
            Вы уверены, что хотите вызвать{' '}
            <span className="font-medium">{opponent.name}</span>{' '}
            на баттл?
          </p>
        </div>

        {/* Участники баттла */}
        <div className="space-y-3">
          {/* Инициатор */}
          <div 
            className="p-3 rounded-xl border"
            style={{
              background: theme === 'dark' ? '#1C2029' : '#F9FAFB',
              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: theme === 'dark' ? 'rgba(43, 130, 255, 0.2)' : 'rgba(43, 130, 255, 0.1)',
                  border: theme === 'dark' ? '1px solid rgba(43, 130, 255, 0.3)' : '1px solid rgba(43, 130, 255, 0.2)'
                }}
              >
                <User 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: theme === 'dark' ? '#2B82FF' : '#2B82FF' 
                  }} 
                />
              </div>
              <div className="flex-1">
                <div 
                  className="unified-text font-medium"
                  style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                >
                  {challenger.name}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                >
                  Инициатор (вы)
                </div>
              </div>
              <div 
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: theme === 'dark' ? 'rgba(52, 199, 89, 0.2)' : 'rgba(52, 199, 89, 0.1)',
                  color: theme === 'dark' ? '#34C759' : '#34C759'
                }}
              >
                Lv.{challenger.level}
              </div>
            </div>
          </div>

          {/* VS */}
          <div className="text-center">
            <span 
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#F3F5F8',
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
              }}
            >
              VS
            </span>
          </div>

          {/* Оппонент */}
          <div 
            className="p-3 rounded-xl border"
            style={{
              background: theme === 'dark' ? '#1C2029' : '#F9FAFB',
              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: theme === 'dark' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 59, 48, 0.1)',
                  border: theme === 'dark' ? '1px solid rgba(255, 59, 48, 0.3)' : '1px solid rgba(255, 59, 48, 0.2)'
                }}
              >
                <User 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: theme === 'dark' ? '#FF3B30' : '#FF3B30' 
                  }} 
                />
              </div>
              <div className="flex-1">
                <div 
                  className="unified-text font-medium"
                  style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                >
                  {opponent.name}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                >
                  Оппонент
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: theme === 'dark' ? 'rgba(52, 199, 89, 0.2)' : 'rgba(52, 199, 89, 0.1)',
                    color: theme === 'dark' ? '#34C759' : '#34C759'
                  }}
                >
                  Lv.{opponent.level}
                </div>
                <div 
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                  style={{
                    background: opponent.isOnline 
                      ? (theme === 'dark' ? 'rgba(48, 209, 88, 0.2)' : 'rgba(52, 199, 89, 0.1)')
                      : (theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#F3F5F8'),
                    color: opponent.isOnline 
                      ? (theme === 'dark' ? '#30D158' : '#34C759')
                      : (theme === 'dark' ? '#A7B0BD' : '#6B7280')
                  }}
                >
                  {opponent.isOnline ? '🟢' : '⚫'} {opponent.isOnline ? 'Онлайн' : 'Офлайн'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ставка */}
        <div 
          className="p-4 rounded-xl border text-center"
          style={{
            background: theme === 'dark' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 215, 0, 0.05)',
            border: theme === 'dark' ? '1px solid rgba(255, 215, 0, 0.2)' : '1px solid rgba(255, 215, 0, 0.15)'
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Coins 
              style={{ 
                width: '16px', 
                height: '16px', 
                color: theme === 'dark' ? '#FFD700' : '#FFA500' 
              }} 
            />
            <span 
              className="unified-heading"
              style={{ color: theme === 'dark' ? '#FFD700' : '#FFA500' }}
            >
              {stake} монет
            </span>
          </div>
          <p 
            className="text-xs"
            style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
          >
            Награда при выигрыше
          </p>
        </div>
      </div>
    </ModalOpaque>
  );
}