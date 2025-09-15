import { useState } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { ModalOpaque } from './ModalOpaque';
import { Trophy, Clock, Users, Plus, X } from './Icons';

interface BattlesPageFixedProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings?: () => void;
  profilePhoto?: string | null;
  personalBattles?: any[];
  setPersonalBattles?: (battles: any[]) => void;
  theme?: 'light' | 'dark';
  battles?: any[];
  battleInvitations?: any[];
  users?: any[];
  currentUser?: any;
  onCreateBattleInvitation?: (invitation: any) => void;
  onAcceptBattleInvitation?: (id: string) => void;
  onDeclineBattleInvitation?: (id: string) => void;
  onCompleteBattle?: (battleId: string, winnerId: string) => void;
}

interface Employee {
  id: string;
  name: string;
  team: number;
  level: number;
  avatar: string | null;
  status: 'available' | 'in_battle';
  role: string;
  achievements: number;
  completedTasks: number;
}

export function BattlesPageFixed({ 
  onNavigate, 
  currentPage, 
  onOpenSettings, 
  profilePhoto, 
  personalBattles = [], 
  setPersonalBattles, 
  theme = 'light',
  battles = [],
  battleInvitations = [],
  users = [],
  currentUser,
  onCreateBattleInvitation,
  onAcceptBattleInvitation,
  onDeclineBattleInvitation,
  onCompleteBattle
}: BattlesPageFixedProps) {
  // Use the actual currentUser prop or fallback to default display data
  const userDisplayData = currentUser || {
    id: 'user1',
    name: 'Иван Иванов',
    username: '@iivanov'
  };
  
  const employees: Employee[] = [
    { id: '1', name: 'Анна Иванова', team: 1, level: 5, avatar: null, status: 'available', role: 'Дизайнер', achievements: 12, completedTasks: 48 },
    { id: '2', name: 'Петр Петров', team: 1, level: 7, avatar: null, status: 'in_battle', role: 'Разработчик', achievements: 18, completedTasks: 67 },
    { id: '3', name: 'Мария Сидорова', team: 2, level: 6, avatar: null, status: 'available', role: 'Аналитик', achievements: 15, completedTasks: 52 },
    { id: '4', name: 'Алексей Козлов', team: 2, level: 8, avatar: null, status: 'available', role: 'Тимлид', achievements: 22, completedTasks: 78 },
    { id: '5', name: 'Елена Морозова', team: 3, level: 4, avatar: null, status: 'available', role: 'Маркетолог', achievements: 9, completedTasks: 34 },
    { id: '6', name: 'Дмитрий Волков', team: 3, level: 9, avatar: null, status: 'available', role: 'Архитектор', achievements: 25, completedTasks: 89 }
  ];
  
  const [isEmployeeSelectOpen, setIsEmployeeSelectOpen] = useState(false);
  const [isBattleConfirmOpen, setIsBattleConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'battles' | 'employees'>('employees');

  const hasActiveBattle = personalBattles.length > 0;

  const handleEmployeeSelect = (employee: Employee) => {
    if (hasActiveBattle || employee.status === 'in_battle') return;
    setSelectedEmployee(employee);
    setIsBattleConfirmOpen(true);
    setIsEmployeeSelectOpen(false);
  };

  const handleBattleConfirm = () => {
    if (!selectedEmployee || !setPersonalBattles) return;
    
    const newBattle = {
      id: Date.now().toString(),
      challenger: {
        id: 'current-user',
        name: 'Иван Иванов',
        team: 1,
        level: 5,
        avatar: null,
        role: 'Сотрудник',
        achievements: 10,
        completedTasks: 25
      },
      opponent: selectedEmployee,
      status: 'active',
      prize: 500,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      created: new Date()
    };

    setPersonalBattles([...personalBattles, newBattle]);
    setIsBattleConfirmOpen(false);
    setSelectedEmployee(null);
  };

  const formatTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Время истекло';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}д ${hours}ч`;
    } else {
      return `${hours}ч`;
    }
  };

  return (
    <>
      <div 
        className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}
        style={{
          background: 'transparent',
          color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
        }}
      >
        <Header 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
          onOpenSettings={onOpenSettings}
          user={userDisplayData}
          profilePhoto={profilePhoto}
          theme={theme}
        />
        
        <div className="max-w-md mx-auto px-4 pb-24">
          <div 
            className="glass-card rounded-2xl flex flex-col apple-shadow" 
            style={{ minHeight: '500px' }}
          >
            <div 
              className="flex items-center justify-between p-6"
              style={{
                borderBottom: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF'
              }}
            >
              <div className="w-8"></div>
              <h2 
                className="unified-heading flex-1 text-center"
                style={{
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              >
                Баттлы
              </h2>
              <button
                onClick={() => setIsEmployeeSelectOpen(true)}
                className="transition-all hover:scale-105"
                style={{
                  width: '28px',
                  height: '28px',
                  minWidth: '28px',
                  minHeight: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#FFFFFF',
                  border: theme === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.2)' 
                    : '1px solid #E6E9EF',
                  boxShadow: theme === 'dark'
                    ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.06)'
                }}
              >
                <Plus 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: theme === 'dark' ? '#1A1A1A' : '#6B7280'
                  }} 
                />
              </button>
            </div>

            <div className="px-6 py-4">
              <div 
                className="flex gap-2 p-1 rounded-2xl"
                style={{
                  backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                  border: theme === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.06)' 
                    : '1px solid #E6E9EF'
                }}
              >
                <button
                  onClick={() => setActiveTab('employees')}
                  className="px-4 py-2 rounded-xl unified-text flex-1 text-center transition-all"
                  style={activeTab === 'employees' ? {
                    background: theme === 'dark' 
                      ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)'
                      : '#000000',
                    color: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
                    border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                    boxShadow: theme === 'dark'
                      ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.06)'
                  } : {
                    background: 'transparent',
                    color: theme === 'dark' ? '#FFFFFF' : '#6B7280'
                  }}
                >
                  Сотрудники
                </button>
                <button
                  onClick={() => setActiveTab('battles')}
                  className="px-4 py-2 rounded-xl unified-text flex-1 text-center transition-all"
                  style={activeTab === 'battles' ? {
                    background: theme === 'dark' 
                      ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)'
                      : '#000000',
                    color: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
                    border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                    boxShadow: theme === 'dark'
                      ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.06)'
                  } : {
                    background: 'transparent',
                    color: theme === 'dark' ? '#FFFFFF' : '#6B7280'
                  }}
                >
                  Баттлы ({personalBattles.length})
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ minHeight: '300px' }}>
              {activeTab === 'employees' ? (
                <div className="space-y-3">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                      style={{
                        backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                        border: theme === 'dark' 
                          ? '1px solid rgba(255, 255, 255, 0.06)' 
                          : '1px solid #E6E9EF'
                      }}
                      onClick={() => handleEmployeeSelect(employee)}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: theme === 'dark' ? '#0F1116' : '#FFFFFF',
                          border: theme === 'dark' 
                            ? '1px solid #2A2F36' 
                            : '1px solid #E6E9EF'
                        }}
                      >
                        <span className="unified-text">{employee.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <div 
                          className="unified-text font-medium"
                          style={{
                            color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                          }}
                        >
                          {employee.name}
                        </div>
                        <div 
                          className="unified-text"
                          style={{
                            color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                          }}
                        >
                          Команда {employee.team} • Уровень {employee.level}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmployeeSelect(employee);
                        }}
                        disabled={hasActiveBattle || employee.status === 'in_battle'}
                        className={`transition-all ${
                          hasActiveBattle || employee.status === 'in_battle' 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:scale-105'
                        }`}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: hasActiveBattle || employee.status === 'in_battle'
                            ? (theme === 'dark' ? '#4A5568' : '#9CA3AF')
                            : '#2B82FF',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Plus 
                          style={{ 
                            width: '16px', 
                            height: '16px', 
                            color: '#FFFFFF'
                          }} 
                        />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                personalBattles && personalBattles.length > 0 ? (
                  <div className="space-y-4">
                    {personalBattles.map((battle: any) => (
                      <div
                        key={battle.id}
                        className="rounded-2xl p-4 transition-all"
                        style={{
                          backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                          border: theme === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.06)' 
                            : '1px solid #E6E9EF'
                        }}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: theme === 'dark' ? '#0F1116' : '#FFFFFF',
                              border: theme === 'dark' 
                                ? '1px solid #2A2F36' 
                                : '1px solid #E6E9EF'
                            }}
                          >
                            <span className="unified-text">{battle.opponent?.name?.charAt(0) || '?'}</span>
                          </div>
                          <div className="flex-1">
                            <div 
                              className="unified-text font-medium"
                              style={{
                                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                              }}
                            >
                              {battle.opponent?.name}
                            </div>
                            <div 
                              className="unified-text"
                              style={{
                                color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                              }}
                            >
                              Команда {battle.opponent?.team} • Уровень {battle.opponent?.level}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 unified-text">
                            <div className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" style={{ color: '#FFD700' }} />
                              <span style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                                {battle.prize}g
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} />
                              <span style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                                {formatTimeRemaining(battle.endDate)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            className="flex-1 py-2 px-4 rounded-xl unified-button transition-all hover:scale-[0.98]"
                            style={{
                              background: theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#2B82FF',
                              color: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
                              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                              boxShadow: theme === 'dark' 
                                ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                                : 'none'
                            }}
                          >
                            Выиграл баттл
                          </button>
                          <button
                            onClick={() => {
                              if (setPersonalBattles) {
                                setPersonalBattles(personalBattles.filter(b => b.id !== battle.id));
                              }
                            }}
                            className="py-2 px-4 rounded-xl unified-button transition-all hover:scale-[0.98]"
                            style={{
                              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                            }}
                          >
                            Отменить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[200px]">
                    <div 
                      className="rounded-xl p-6 text-center"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <Users 
                        className="w-12 h-12 mx-auto mb-4"
                        style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                      />
                      <p 
                        className="unified-text opacity-70"
                        style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                      >
                        Нет активных баттлов
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        
        <BottomNavigation onNavigate={onNavigate} currentPage={currentPage} theme={theme} />
      </div>

      {/* Модальные окна */}
      <ModalOpaque
        isOpen={isEmployeeSelectOpen}
        onClose={() => setIsEmployeeSelectOpen(false)}
        title="Выбор сотрудник��"
        theme={theme}
      >
        <div className="space-y-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {employees.map((employee) => (
            <button
              key={employee.id}
              onClick={() => handleEmployeeSelect(employee)}
              disabled={employee.status === 'in_battle'}
              className="w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF'
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: theme === 'dark' ? '#0F1116' : '#FFFFFF',
                  border: theme === 'dark' 
                    ? '1px solid #2A2F36' 
                    : '1px solid #E6E9EF'
                }}
              >
                <span className="unified-text">{employee.name.charAt(0)}</span>
              </div>
              <div className="flex-1 text-left">
                <div 
                  className="unified-text font-medium"
                  style={{
                    color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                  }}
                >
                  {employee.name}
                </div>
                <div 
                  className="unified-text"
                  style={{
                    color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                  }}
                >
                  {employee.role} • Команда {employee.team}
                </div>
              </div>
              {employee.status === 'in_battle' && (
                <div 
                  className="unified-text"
                  style={{ color: '#FF3B30' }}
                >
                  В баттле
                </div>
              )}
            </button>
          ))}
        </div>
      </ModalOpaque>

      <ModalOpaque
        isOpen={isBattleConfirmOpen}
        onClose={() => setIsBattleConfirmOpen(false)}
        title="Подтвердить вызов"
        theme={theme}
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => setIsBattleConfirmOpen(false)}
              className="flex-1 transition-colors text-center"
              style={{
                height: '44px',
                borderRadius: '12px',
                background: theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#F3F5F8',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.2)' 
                  : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#1A1A1A' : '#0F172A',
                boxShadow: theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                  : 'none'
              }}
            >
              Отменить
            </button>
            <button
              onClick={handleBattleConfirm}
              className="flex-1 transition-colors text-center"
              style={{
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#2B82FF',
                color: '#FFFFFF',
                border: 'none'
              }}
            >
              Вызвать
            </button>
          </div>
        }
      >
        {selectedEmployee && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: theme === 'dark' ? '#0F1116' : '#FFFFFF',
                  border: theme === 'dark' 
                    ? '1px solid #2A2F36' 
                    : '1px solid #E6E9EF'
                }}
              >
                <span className="unified-heading">{selectedEmployee.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div 
                  className="unified-heading"
                  style={{
                    color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                  }}
                >
                  {selectedEmployee.name}
                </div>
                <div 
                  className="unified-text"
                  style={{
                    color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                  }}
                >
                  {selectedEmployee.role} • Команда {selectedEmployee.team}
                </div>
              </div>
            </div>
            <div 
              className="unified-text text-center"
              style={{
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
              }}
            >
              Вы уверены, что хотите вызвать этого сотрудника на баттл?
            </div>
          </div>
        )}
      </ModalOpaque>
    </>
  );
}