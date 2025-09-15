import { useState, useEffect, useRef } from 'react';
import { Menu, User } from './Icons';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { LeaderboardEntry } from '../types/global';

type SortType = 'level' | 'achievements' | 'balance';

interface UserData {
  id: number;
  name: string;
  team: string;
  level: number;
  balance: string;
  achievements: number;
  avatar?: string;
}



interface BattleLeaderboardProps {
  leaderboard?: LeaderboardEntry[];
  onNavigate?: (page: string) => void;
  theme?: 'light' | 'dark';
}

export function BattleLeaderboard({ leaderboard = [], onNavigate, theme = 'light' }: BattleLeaderboardProps) {
  const [sortType, setSortType] = useState<SortType>('level');
  const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
  const [dialogSortType, setDialogSortType] = useState<SortType>('level');

  // Преобразуем данные лидерборда в placeholder формат или используем тестовые данные
  const users: UserData[] = leaderboard.length > 0 
    ? leaderboard.map((entry, index) => ({
        id: index + 1,
        name: entry.user.name || 'Placeholder',
        team: `Team ${entry.user.teamId || Math.floor(Math.random() * 6) + 1}`,
        level: entry.user.level || Math.floor(Math.random() * 20) + 1,
        balance: `${entry.user.balance || Math.floor(Math.random() * 10000) + 1000}g`,
        achievements: entry.user.achievementsCount || Math.floor(Math.random() * 50) + 1,
        avatar: entry.user.avatar || ''
      }))
    : [
        // Тестовые данные для демонстрации сортировки
        { id: 1, name: 'Анна Иванова', team: 'Team 1', level: 15, balance: '5400g', achievements: 32, avatar: '' },
        { id: 2, name: 'Петр Петров', team: 'Team 2', level: 12, balance: '8200g', achievements: 28, avatar: '' },
        { id: 3, name: 'Мария Сидорова', team: 'Team 3', level: 18, balance: '3600g', achievements: 45, avatar: '' }
      ];

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleSortClick = () => {
    // Визуальный эффект нажатия
    setIsButtonClicked(true);
    setTimeout(() => setIsButtonClicked(false), 200);

    // Переключение типа сортировки по кругу
    const sortTypes: SortType[] = ['level', 'achievements', 'balance'];
    const currentIndex = sortTypes.indexOf(sortType);
    const nextIndex = (currentIndex + 1) % sortTypes.length;
    const newSortType = sortTypes[nextIndex];
    setSortType(newSortType);
    
    console.log(`Сортировка изменена с "${getSortTypeText(sortType)}" на "${getSortTypeText(newSortType)}"`);
  };

  const handleDialogSortClick = () => {
    // Переключение типа сортировки в диалоге
    const sortTypes: SortType[] = ['level', 'achievements', 'balance'];
    const currentIndex = sortTypes.indexOf(dialogSortType);
    const nextIndex = (currentIndex + 1) % sortTypes.length;
    setDialogSortType(sortTypes[nextIndex]);
  };

  const handleUsersClick = () => {
    setIsUsersDialogOpen(true);
  };

  const handleUserClick = (userId: number) => {
    console.log(`Открыть профиль пользователя ${userId}`);
  };

  const getSortTypeText = (type: SortType) => {
    switch (type) {
      case 'level':
        return 'По уровню';
      case 'achievements':
        return 'По ачивкам';
      case 'balance':
        return 'По балансу';
      default:
        return 'По уровню';
    }
  };

  const sortUsers = (users: UserData[], sortType: SortType): UserData[] => {
    return [...users].sort((a, b) => {
      switch (sortType) {
        case 'level':
          return b.level - a.level;
        case 'achievements':
          return b.achievements - a.achievements;
        case 'balance':
          // Парсим числовое значение из строки баланса для правильной сортировки
          const balanceA = parseFloat(a.balance.replace(/[^\d.-]/g, '')) || 0;
          const balanceB = parseFloat(b.balance.replace(/[^\d.-]/g, '')) || 0;
          return balanceB - balanceA;
        default:
          return b.level - a.level;
      }
    });
  };

  const sortedUsers = sortUsers(users, dialogSortType);

  return (
    <>
      {/* Рейтинг карточка */}
      <div 
        className={`${theme === 'dark' ? 'dark' : ''} cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('LEADERBOARD CARD CLICKED!');
          handleUsersClick();
        }}
        style={{
          backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
          borderRadius: '20px',
          border: theme === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.06)' 
            : '1px solid #E6E9EF',
          boxShadow: theme === 'dark' 
            ? '0 8px 24px rgba(0, 0, 0, 0.6)' 
            : '0 8px 24px rgba(0, 0, 0, 0.10)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div className="relative p-4 pb-0">

          <div className="text-center">
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8"></div>
              <h3 
                className="unified-heading flex-1 text-center"
                style={{ 
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              >
                Рейтинг
              </h3>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Циклично переключаем типы сортировки: level → balance → achievements → level
                  const nextType = 
                    sortType === 'level' ? 'balance' : 
                    sortType === 'balance' ? 'achievements' : 'level';
                  setSortType(nextType);
                }}
                className="w-7 h-7 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                style={{
                  background: theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#FFFFFF',
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #E6E9EF',
                  color: theme === 'dark' ? '#1A1A1A' : '#0F172A',
                  boxShadow: theme === 'dark' 
                    ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.06)',
                  cursor: 'pointer'
                }}
                title={`Сортировка: ${
                  sortType === 'level' ? 'По уровню' : 
                  sortType === 'balance' ? 'По балансу' : 
                  'По достижениям'
                } (нажмите для изменения)`}
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
            <p 
              className="text-xs opacity-60 mt-1"
              style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
            >
              {getSortTypeText(sortType)}
            </p>
          </div>
        </div>
        
        <div className="p-4 pt-3">
          <div className="flex items-center justify-center min-h-[50px]">
            {users.length > 0 ? (
            <div className="w-full space-y-1">
              {sortUsers(users, sortType).slice(0, 3).map((user, index) => (
                <div 
                  key={`${user.id}-${sortType}`} 
                  className="flex items-center gap-2 text-xs transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    animation: 'fadeIn 0.3s ease-in-out'
                  }}
                >
                  <span 
                    className="font-medium w-4"
                    style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                  >
                    {index + 1}.
                  </span>
                  <span 
                    className="truncate flex-1"
                    style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                  >
                    {user.name}
                  </span>
                  <span 
                    className="text-xs font-medium"
                    style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                  >
                    {sortType === 'level' && `Ур.${user.level}`}
                    {sortType === 'achievements' && `${user.achievements}★`}
                    {sortType === 'balance' && user.balance}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p 
              className="text-sm text-center opacity-70"
              style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
            >
              Список лидеров отсутствует
            </p>
          )}
          </div>
        </div>
      </div>

      {/* Рейтинг пользователей - модалка в стиле баттлов */}
      <Dialog open={isUsersDialogOpen} onOpenChange={setIsUsersDialogOpen}>
        <DialogContent 
          className={`${theme === 'dark' ? 'dark' : ''} w-[90vw] max-w-md max-h-[80vh] overflow-hidden rounded-3xl p-0 [&>button]:hidden flex flex-col`}
        >
          {/* Accessibility elements */}
          <DialogTitle className="sr-only">
            Рейтинг пользователей
          </DialogTitle>
          <DialogDescription className="sr-only">
            Полный список участников с возможностью сортировки по уровню, достижениям и балансу
          </DialogDescription>
          
          {/* Заголовок */}
          <div 
            className="flex items-center justify-between p-6 border-b shrink-0"
            style={{
              borderColor: theme === 'dark' 
                ? 'rgba(255, 255, 255, 0.06)' 
                : 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <h2 
              className="text-lg font-medium"
              style={{
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Рейтинг
            </h2>
            
            <button
              onClick={() => setIsUsersDialogOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{
                background: theme === 'dark' 
                  ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                  : '#FFFFFF',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.2)' 
                  : '1px solid #E6E9EF',
                boxShadow: theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
            >
              <X 
                style={{
                  width: '16px',
                  height: '16px',
                  color: theme === 'dark' ? '#1A1A1A' : '#6B7280'
                }}
              />
            </button>
          </div>

          {/* Панель сортировки */}
          <div 
            className="flex items-center justify-between p-6 border-b shrink-0"
            style={{
              borderColor: theme === 'dark' 
                ? 'rgba(255, 255, 255, 0.06)' 
                : 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <span 
              className="text-sm font-medium"
              style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
            >
              Сортировка: {getSortTypeText(dialogSortType)}
            </span>
            <button
              onClick={handleDialogSortClick}
              className="py-2 px-4 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{
                background: theme === 'dark' 
                  ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                  : '#2B82FF',
                color: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.2)' 
                  : '1px solid #2B82FF',
                boxShadow: theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
            >
              Изменить
            </button>
          </div>
          
          {/* Список пользователей */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-3">
              {sortedUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="p-4 rounded-2xl border transition-all hover:scale-[1.01] cursor-pointer"
                  style={{
                    background: theme === 'dark' 
                      ? 'rgba(43, 130, 255, 0.1)' 
                      : 'rgba(43, 130, 255, 0.05)',
                    borderColor: theme === 'dark' 
                      ? 'rgba(43, 130, 255, 0.2)' 
                      : 'rgba(43, 130, 255, 0.15)'
                  }}
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                        style={{
                          background: theme === 'dark' 
                            ? 'rgba(43, 130, 255, 0.2)' 
                            : 'rgba(43, 130, 255, 0.15)',
                          color: '#2B82FF'
                        }}
                      >
                        {index + 1}
                      </span>
                      
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback 
                          className="text-sm font-medium"
                          style={{
                            background: theme === 'dark' ? '#2A3340' : '#E6E9EF',
                            color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                          }}
                        >
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div 
                          className="font-medium"
                          style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                        >
                          {user.name}
                        </div>
                        <div 
                          className="text-sm"
                          style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                        >
                          {user.team}
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className="text-sm font-medium"
                      style={{
                        color: '#2B82FF'
                      }}
                    >
                      {dialogSortType === 'level' && `Ур.${user.level}`}
                      {dialogSortType === 'achievements' && `${user.achievements}★`}
                      {dialogSortType === 'balance' && user.balance}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Пустое состояние */}
              {sortedUsers.length === 0 && (
                <div className="text-center py-12">
                  <div 
                    className="text-4xl mb-4"
                    style={{
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                    }}
                  >
                    🏆
                  </div>
                  <p 
                    className="text-sm"
                    style={{
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                    }}
                  >
                    Рейтинг пуст
                  </p>
                  <p 
                    className="text-xs mt-1"
                    style={{
                      color: theme === 'dark' ? '#6B7280' : '#9CA3AF'
                    }}
                  >
                    Участники появятся здесь
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}