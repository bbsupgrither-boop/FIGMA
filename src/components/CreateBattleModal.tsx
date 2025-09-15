import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { ModalOpaque } from './ModalOpaque';
import { User, BattleInvitation } from '../types/battles';
import { BattleConfirmModal } from './BattleConfirmModal';

interface CreateBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUserId: string;
  onCreateInvitation: (invitation: Omit<BattleInvitation, 'id' | 'createdAt' | 'expiresAt' | 'status'>) => void;
  theme?: 'light' | 'dark';
}

export function CreateBattleModal({ 
  isOpen, 
  onClose, 
  users, 
  currentUserId, 
  onCreateInvitation, 
  theme = 'light' 
}: CreateBattleModalProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [stake, setStake] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Фильтруем пользователей (исключаем текущего пользователя)
  const availableUsers = users.filter(user => 
    user.id !== currentUserId && 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrepareChallenge = () => {
    if (!selectedUser || !stake.trim()) return;

    const stakeAmount = parseInt(stake);
    if (isNaN(stakeAmount) || stakeAmount <= 0) return;

    // Показываем модалку подтверждения
    setShowConfirmModal(true);
  };

  const handleConfirmChallenge = () => {
    if (!selectedUser || !stake.trim()) return;

    const stakeAmount = parseInt(stake);
    if (isNaN(stakeAmount) || stakeAmount <= 0) return;

    // Находим имя текущего пользователя
    const currentUser = users.find(u => u.id === currentUserId);
    const currentUserName = currentUser?.name || 'Неизвестный пользователь';

    onCreateInvitation({
      challengerId: currentUserId,
      challengerName: currentUserName,
      opponentId: selectedUser.id,
      opponentName: selectedUser.name,
      stake: stakeAmount,
      message: `${currentUserName} вызывает вас на баттл на ${stakeAmount} коинов!`
    });

    // Сбрасываем форму и закрываем модалки
    setSelectedUser(null);
    setStake('');
    setSearchQuery('');
    setShowConfirmModal(false);
    onClose();
  };

  return (
    <>
      <ModalOpaque
        isOpen={isOpen}
        onClose={onClose}
        title="Создать вызов"
        theme={theme}
      >
        <div className="space-y-4">
          {/* Поиск пользователей */}
          <div className="space-y-2">
            <label 
              className="unified-text font-medium"
              style={{
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Выберите соперника
            </label>
            
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                }}
              />
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm focus:border-primary focus:outline-none transition-colors"
                style={{
                  background: theme === 'dark' 
                    ? '#161A22' 
                    : '#FFFFFF',
                  borderColor: theme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.12)' 
                    : '#E6E9EF',
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              />
            </div>
          </div>

          {/* Список пользователей */}
          <div className="space-y-2 relative">
            <div 
              className="space-y-2 overflow-y-auto scrollbar-hide scroll-container"
              style={{ 
                minHeight: '200px',
                maxHeight: '300px',
                paddingRight: '4px'
              }}
            >
            {availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 rounded-2xl border text-left transition-all hover:scale-[0.98] ${
                  selectedUser?.id === user.id ? 'ring-2' : ''
                }`}
                style={{
                  background: selectedUser?.id === user.id 
                    ? (theme === 'dark' 
                        ? 'rgba(43, 130, 255, 0.15)' 
                        : 'rgba(43, 130, 255, 0.1)')
                    : (theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : '#FFFFFF'),
                  borderColor: selectedUser?.id === user.id 
                    ? '#2B82FF' 
                    : (theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : '#E6E9EF'),
                  ringColor: '#2B82FF'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{
                        background: 'linear-gradient(135deg, #2B82FF 0%, #1E40AF 100%)',
                        color: '#FFFFFF'
                      }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    
                    <div>
                      <div 
                        className="text-sm font-medium"
                        style={{
                          color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                        }}
                      >
                        {user.name}
                      </div>
                      <div 
                        className="text-xs"
                        style={{
                          color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                        }}
                      >
                        Уровень {user.level} • Рейтинг {user.rating}
                      </div>
                    </div>
                  </div>
                  
                  {user.isOnline && (
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#34C759' }}
                    />
                  )}
                </div>
              </button>
            ))}
            
              {availableUsers.length === 0 && (
                <div 
                  className="text-center py-8 text-sm"
                  style={{
                    color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                  }}
                >
                  {searchQuery ? 'Пользователи не найдены' : 'Нет доступных пользователей'}
                </div>
              )}
            </div>
            
            {/* Подсказка о скролле */}
            {availableUsers.length > 4 && (
              <div 
                className="text-center text-xs mt-2"
                style={{
                  color: theme === 'dark' ? '#6B7280' : '#9CA3AF'
                }}
              >
                ↕ Прокрутите для просмотра всех сотрудников
              </div>
            )}
          </div>

          {/* Ставка */}
          <div className="space-y-2">
            <label 
              className="unified-text font-medium"
              style={{
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Ставка (коины)
            </label>
            
            <input
              type="number"
              placeholder="500"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              min="1"
              className="w-full px-4 py-3 rounded-xl border-2 text-sm focus:border-primary focus:outline-none transition-colors"
              style={{
                background: theme === 'dark' 
                  ? '#161A22' 
                  : '#FFFFFF',
                borderColor: theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.12)' 
                  : '#E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl unified-button transition-all hover:scale-[0.98]"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Отменить
            </button>
            
            <button
              onClick={handlePrepareChallenge}
              disabled={!selectedUser || !stake.trim() || parseInt(stake) <= 0}
              className="flex-1 py-3 px-4 rounded-2xl unified-button text-white transition-all hover:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: selectedUser && stake.trim() && parseInt(stake) > 0 
                  ? '#2B82FF' 
                  : '#9CA3AF'
              }}
            >
              Вызвать на баттл
            </button>
          </div>
        </div>
      </ModalOpaque>
      
      {/* Модалка подтверждения */}
      {selectedUser && (
        <BattleConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          challenger={users.find(u => u.id === currentUserId)!}
          opponent={selectedUser}
          stake={parseInt(stake) || 0}
          onConfirm={handleConfirmChallenge}
          theme={theme}
        />
      )}
    </>
  );
}