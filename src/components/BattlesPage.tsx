import { useState } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { ModalOpaque } from './ModalOpaque';
import { Trophy, Clock, Users, Award, Calendar, User, ArrowRight, Check, Star, Plus, X, ArrowLeft, Paperclip, ChevronDown } from './Icons';

import { mockAppState } from '../data/mockData';

interface BattlesPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings?: () => void;
  profilePhoto?: string | null;
  theme?: 'light' | 'dark';
}

export function BattlesPage({ onNavigate, currentPage, onOpenSettings, profilePhoto, theme = 'light' }: BattlesPageProps) {
  const currentUser = mockAppState.currentUser;
  
  // Mock данные сотрудников с командами
  const employees = [
    { id: '1', name: 'Анна Иванова', team: 1, level: 5, avatar: null, status: 'available' },
    { id: '2', name: 'Петр Петров', team: 1, level: 7, avatar: null, status: 'in_battle' },
    { id: '3', name: 'Мария Сидорова', team: 2, level: 6, avatar: null, status: 'available' },
    { id: '4', name: 'Алексей Козлов', team: 2, level: 8, avatar: null, status: 'available' },
    { id: '5', name: 'Елена Морозова', team: 3, level: 4, avatar: null, status: 'available' },
    { id: '6', name: 'Дмитрий Волков', team: 3, level: 9, avatar: null, status: 'available' },
    { id: '7', name: 'Ольга Соколова', team: 4, level: 5, avatar: null, status: 'available' },
    { id: '8', name: 'Сергей Орлов', team: 4, level: 6, avatar: null, status: 'in_battle' },
    { id: '9', name: 'Михаил Рыбаков', team: 5, level: 7, avatar: null, status: 'available' },
    { id: '10', name: 'Татьяна Белова', team: 5, level: 5, avatar: null, status: 'available' },
    { id: '11', name: 'Владимир Новиков', team: 6, level: 8, avatar: null, status: 'available' },
    { id: '12', name: 'Екатерина Попова', team: 6, level: 6, avatar: null, status: 'available' },
  ];
  
  // Mock активных баттлов
  const [activeBattles, setActiveBattles] = useState([
    {
      id: '1',
      opponent: employees.find(e => e.id === '2'),
      status: 'active',
      prize: 500,
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      created: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ]);

  // Состояния модальных окон
  const [isEmployeeSelectOpen, setIsEmployeeSelectOpen] = useState(false);
  const [isBattleConfirmOpen, setIsBattleConfirmOpen] = useState(false);
  const [isEmployeeDetailOpen, setIsEmployeeDetailOpen] = useState(false);
  const [isCancelBattleOpen, setIsCancelBattleOpen] = useState(false);
  const [isVictorySubmitOpen, setIsVictorySubmitOpen] = useState(false);

  // Состояния для выбора сотрудника
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [isTeamSelectOpen, setIsTeamSelectOpen] = useState(false);

  // Состояния для подтверждения победы
  const [victoryComment, setVictoryComment] = useState('');
  const [victoryFile1, setVictoryFile1] = useState<File | null>(null);
  const [victoryFile2, setVictoryFile2] = useState<File | null>(null);
  const [selectedBattle, setSelectedBattle] = useState<any>(null);

  // Состояния навигации
  const [activeTab, setActiveTab] = useState<'battles' | 'employees'>('battles');

  // Проверяем есть ли у пользователя активный баттл
  const hasActiveBattle = activeBattles.length > 0;

  // Фильтруем сотрудников по выбранной команде
  const filteredEmployees = selectedTeam 
    ? employees.filter(emp => emp.team === selectedTeam)
    : employees.filter(emp => emp.team >= 1 && emp.team <= 6);

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

  // Обработчики
  const handleEmployeeSelect = (employee: any) => {
    if (hasActiveBattle || employee.status === 'in_battle') return;
    setSelectedEmployee(employee);
    setIsBattleConfirmOpen(true);
  };

  const handleBattleConfirm = () => {
    if (!selectedEmployee) return;
    
    const newBattle = {
      id: Date.now().toString(),
      opponent: selectedEmployee,
      status: 'active',
      prize: 500,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      created: new Date()
    };

    setActiveBattles([...activeBattles, newBattle]);
    setIsBattleConfirmOpen(false);
    setIsEmployeeSelectOpen(false);
    setSelectedEmployee(null);
  };

  const handleCancelBattle = (battle: any) => {
    setSelectedBattle(battle);
    setIsCancelBattleOpen(true);
  };

  const confirmCancelBattle = () => {
    if (!selectedBattle) return;
    setActiveBattles(activeBattles.filter(b => b.id !== selectedBattle.id));
    setIsCancelBattleOpen(false);
    setSelectedBattle(null);
  };

  const handleEmployeeDetail = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEmployeeDetailOpen(true);
  };

  const handleVictorySubmit = (battle: any) => {
    setSelectedBattle(battle);
    setIsVictorySubmitOpen(true);
  };

  const submitVictoryProof = () => {
    if (!victoryFile1 || !victoryFile2) return;
    
    console.log('Доказательства победы отправлены:', {
      battle: selectedBattle.id,
      comment: victoryComment,
      file1: victoryFile1.name,
      file2: victoryFile2.name
    });

    // Сброс формы
    setVictoryComment('');
    setVictoryFile1(null);
    setVictoryFile2(null);
    setIsVictorySubmitOpen(false);
    setSelectedBattle(null);
  };

  const handleFileUpload = (fileNumber: 1 | 2) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (fileNumber === 1) {
        setVictoryFile1(file);
      } else {
        setVictoryFile2(file);
      }
    }
  };

  return (
    <>
      <div 
        className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}
        style={{
          background: theme === 'dark' 
            ? 'radial-gradient(circle at center, #12151B 0%, #0B0D10 100%)'
            : 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)',
          color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
        }}
      >
        {/* Header */}
        <Header 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
          onOpenSettings={onOpenSettings}
          user={currentUser}
          profilePhoto={profilePhoto}
          theme={theme}
        />
        
        {/* Main Content */}
        <div className="max-w-md mx-auto pt-20 px-4 pb-24">
          <div 
            className="glass-card rounded-2xl flex flex-col apple-shadow" 
            style={{ minHeight: '500px' }}
          >
            {/* Заголовок */}
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
                className="text-lg font-medium flex-1 text-center"
                style={{
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              >
                Баттлы
              </h2>
              <button
                onClick={() => setIsEmployeeSelectOpen(true)}
                disabled={hasActiveBattle}
                className={`transition-all ${hasActiveBattle ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                style={{
                  width: '28px',
                  height: '28px',
                  minWidth: '28px',
                  minHeight: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: theme === 'dark' ? '#0F1116' : '#FFFFFF',
                  border: theme === 'dark' 
                    ? '1px solid #2A2F36' 
                    : '1px solid #E6E9EF',
                  boxShadow: theme === 'dark'
                    ? '0 2px 8px rgba(0, 0, 0, 0.8)'
                    : '0 2px 8px rgba(0, 0, 0, 0.06)'
                }}
              >
                <Plus 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: hasActiveBattle 
                      ? (theme === 'dark' ? '#4A5568' : '#9CA3AF')
                      : (theme === 'dark' ? '#A7B0BD' : '#6B7280')
                  }} 
                />
              </button>
            </div>

            {/* Вкладки */}
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
                  onClick={() => setActiveTab('battles')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex-1 text-center transition-all ${
                    activeTab === 'battles'
                      ? (theme === 'dark' 
                          ? 'bg-white text-black' 
                          : 'bg-black text-white')
                      : (theme === 'dark' 
                          ? 'text-white hover:text-white' 
                          : 'text-gray-600 hover:text-black')
                  }`}
                  style={{
                    boxShadow: activeTab === 'battles' 
                      ? (theme === 'dark'
                          ? '0 2px 8px rgba(0, 0, 0, 0.8)'
                          : '0 2px 8px rgba(0, 0, 0, 0.06)')
                      : 'none'
                  }}
                >
                  Баттлы ({activeBattles.length})
                </button>
                <button
                  onClick={() => setActiveTab('employees')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex-1 text-center transition-all ${
                    activeTab === 'employees'
                      ? (theme === 'dark' 
                          ? 'bg-white text-black' 
                          : 'bg-black text-white')
                      : (theme === 'dark' 
                          ? 'text-white hover:text-white' 
                          : 'text-gray-600 hover:text-black')
                  }`}
                  style={{
                    boxShadow: activeTab === 'employees' 
                      ? (theme === 'dark'
                          ? '0 2px 8px rgba(0, 0, 0, 0.8)'
                          : '0 2px 8px rgba(0, 0, 0, 0.06)')
                      : 'none'
                  }}
                >
                  Сотрудники
                </button>
              </div>
            </div>
            
            {/* Контент */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {activeTab === 'battles' ? (
                // Список баттлов
                activeBattles.length > 0 ? (
                  <div className="space-y-4">
                    {activeBattles.map((battle) => (
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
                            <span className="text-xl">{battle.opponent?.name?.charAt(0) || '?'}</span>
                          </div>
                          <div className="flex-1">
                            <div 
                              className="font-medium"
                              style={{
                                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                              }}
                            >
                              {battle.opponent?.name}
                            </div>
                            <div 
                              className="text-sm"
                              style={{
                                color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                              }}
                            >
                              Команда {battle.opponent?.team} • Уровень {battle.opponent?.level}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm">
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
                            onClick={() => handleVictorySubmit(battle)}
                            className="flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all"
                            style={{
                              backgroundColor: '#2B82FF',
                              color: '#FFFFFF'
                            }}
                          >
                            Подтвердить победу
                          </button>
                          <button
                            onClick={() => handleCancelBattle(battle)}
                            className="py-2 px-4 rounded-xl text-sm font-medium transition-all"
                            style={{
                              backgroundColor: theme === 'dark' ? '#3A2A2A' : '#FEF2F2',
                              color: '#EF4444',
                              border: '1px solid #EF4444'
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
                      <Trophy 
                        className="w-12 h-12 mx-auto mb-4"
                        style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                      />
                      <p 
                        className="text-sm opacity-70"
                        style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                      >
                        Нет активных баттлов
                      </p>
                    </div>
                  </div>
                )
              ) : (
                // Список сотрудников
                <div className="space-y-4">
                  {/* Фильтр по командам */}
                  <div className="relative">
                    <button
                      onClick={() => setIsTeamSelectOpen(!isTeamSelectOpen)}
                      className="w-full flex items-center justify-between p-3 rounded-xl text-sm"
                      style={{
                        backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                        border: theme === 'dark' 
                          ? '1px solid rgba(255, 255, 255, 0.06)' 
                          : '1px solid #E6E9EF',
                        color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                      }}
                    >
                      <span>
                        {selectedTeam ? `Команда ${selectedTeam}` : 'Все команды (1-6)'}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {isTeamSelectOpen && (
                      <div 
                        className="absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-lg z-10"
                        style={{
                          backgroundColor: theme === 'dark' ? '#202734' : '#FFFFFF',
                          border: theme === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.06)' 
                            : '1px solid #E6E9EF'
                        }}
                      >
                        <button
                          onClick={() => {
                            setSelectedTeam(null);
                            setIsTeamSelectOpen(false);
                          }}
                          className="w-full text-left p-3 text-sm hover:bg-opacity-50 transition-colors"
                          style={{
                            color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                          }}
                        >
                          Все команды (1-6)
                        </button>
                        {[1, 2, 3, 4, 5, 6].map(team => (
                          <button
                            key={team}
                            onClick={() => {
                              setSelectedTeam(team);
                              setIsTeamSelectOpen(false);
                            }}
                            className="w-full text-left p-3 text-sm hover:bg-opacity-50 transition-colors"
                            style={{
                              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                            }}
                          >
                            Команда {team}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Список сотрудников */}
                  <div className="space-y-3">
                    {filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                        style={{
                          backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                          border: theme === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.06)' 
                            : '1px solid #E6E9EF'
                        }}
                        onClick={() => handleEmployeeDetail(employee)}
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
                          <span className="text-lg">{employee.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div 
                            className="font-medium"
                            style={{
                              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                            }}
                          >
                            {employee.name}
                          </div>
                          <div 
                            className="text-sm"
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
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigation onNavigate={onNavigate} currentPage={currentPage} theme={theme} />
      </div>

      {/* Модальное окно выбора сотрудника */}
      <ModalOpaque
        isOpen={isEmployeeSelectOpen}
        onClose={() => setIsEmployeeSelectOpen(false)}
        title="Выбрать соперника"
        theme={theme}
      >
        <div className="space-y-4">
          {/* Фильтр по командам */}
          <div className="relative">
            <button
              onClick={() => setIsTeamSelectOpen(!isTeamSelectOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl text-sm transition-colors"
              style={{
                backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              <span>
                {selectedTeam ? `Команда ${selectedTeam}` : 'Все команды (1-6)'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isTeamSelectOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-lg z-10"
                style={{
                  backgroundColor: theme === 'dark' ? '#202734' : '#FFFFFF',
                  border: theme === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.06)' 
                    : '1px solid #E6E9EF'
                }}
              >
                <button
                  onClick={() => {
                    setSelectedTeam(null);
                    setIsTeamSelectOpen(false);
                  }}
                  className="w-full text-left p-3 text-sm hover:bg-opacity-50 transition-colors"
                  style={{
                    color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                  }}
                >
                  Все команды (1-6)
                </button>
                {[1, 2, 3, 4, 5, 6].map(team => (
                  <button
                    key={team}
                    onClick={() => {
                      setSelectedTeam(team);
                      setIsTeamSelectOpen(false);
                    }}
                    className="w-full text-left p-3 text-sm hover:bg-opacity-50 transition-colors"
                    style={{
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                    }}
                  >
                    Команда {team}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Список сотрудников */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all hover:scale-[0.98]"
                style={{
                  backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
                  border: theme === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.06)' 
                    : '1px solid #E6E9EF',
                  opacity: employee.status === 'in_battle' ? 0.5 : 1
                }}
                onClick={() => employee.status !== 'in_battle' && handleEmployeeSelect(employee)}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: theme === 'dark' ? '#0F1116' : '#F3F5F8',
                    border: theme === 'dark' 
                      ? '1px solid #2A2F36' 
                      : '1px solid #E6E9EF'
                  }}
                >
                  <span className="text-lg">{employee.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div 
                    className="font-medium"
                    style={{
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                    }}
                  >
                    {employee.name}
                  </div>
                  <div 
                    className="text-sm"
                    style={{
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                    }}
                  >
                    Команда {employee.team} • Уровень {employee.level}
                  </div>
                  {employee.status === 'in_battle' && (
                    <div 
                      className="text-xs mt-1"
                      style={{ color: '#EF4444' }}
                    >
                      Участвует в баттле
                    </div>
                  )}
                </div>
                {employee.status !== 'in_battle' && (
                  <ArrowRight 
                    className="w-5 h-5"
                    style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </ModalOpaque>

      {/* Подтверждение вызова на баттл */}
      <ModalOpaque
        isOpen={isBattleConfirmOpen}
        onClose={() => setIsBattleConfirmOpen(false)}
        title="Подтвердить вызов"
        theme={theme}
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => setIsBattleConfirmOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors"
              style={{
                backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Отменить
            </button>
            <button
              onClick={handleBattleConfirm}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-white transition-colors"
              style={{
                backgroundColor: '#2B82FF'
              }}
            >
              Баттл!
            </button>
          </div>
        }
      >
        <div className="text-center space-y-4">
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(43, 130, 255, 0.12)' : 'rgba(43, 130, 255, 0.10)',
            }}
          >
            <Trophy className="w-8 h-8" style={{ color: '#2B82FF' }} />
          </div>
          <div>
            <p 
              className="font-medium mb-2"
              style={{
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Вызвать на баттл?
            </p>
            <p 
              className="text-sm"
              style={{
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
              }}
            >
              {selectedEmployee?.name}
            </p>
          </div>
          <div 
            className="p-4 rounded-xl"
            style={{
              backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
              border: theme === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.06)' 
                : '1px solid #E6E9EF'
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-4 h-4" style={{ color: '#FFD700' }} />
              <span 
                className="font-medium"
                style={{
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              >
                Награда: 500g
              </span>
            </div>
            <p 
              className="text-xs"
              style={{
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
              }}
            >
              Время на выполнение: 7 дней
            </p>
          </div>
        </div>
      </ModalOpaque>

      {/* Детали сотрудника */}
      <ModalOpaque
        isOpen={isEmployeeDetailOpen}
        onClose={() => setIsEmployeeDetailOpen(false)}
        title="Информация о сотруднике"
        theme={theme}
      >
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: theme === 'dark' ? '#0F1116' : '#FFFFFF',
                  border: theme === 'dark' 
                    ? '1px solid #2A2F36' 
                    : '1px solid #E6E9EF'
                }}
              >
                <span className="text-2xl">{selectedEmployee.name.charAt(0)}</span>
              </div>
              <h3 
                className="font-medium mb-2"
                style={{
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              >
                {selectedEmployee.name}
              </h3>
              <p 
                className="text-sm"
                style={{
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                }}
              >
                Команда {selectedEmployee.team} • Уровень {selectedEmployee.level}
              </p>
            </div>

            <div 
              className="p-4 rounded-xl"
              style={{
                backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF'
              }}
            >
              <h4 
                className="font-medium mb-2"
                style={{
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              >
                Статистика
              </h4>
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div 
                    className="font-medium"
                    style={{
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                    }}
                  >
                    12
                  </div>
                  <div 
                    style={{
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                    }}
                  >
                    Побед
                  </div>
                </div>
                <div>
                  <div 
                    className="font-medium"
                    style={{
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                    }}
                  >
                    3
                  </div>
                  <div 
                    style={{
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                    }}
                  >
                    Поражений
                  </div>
                </div>
              </div>
            </div>

            {!hasActiveBattle && selectedEmployee.status !== 'in_battle' && (
              <button
                onClick={() => {
                  setIsEmployeeDetailOpen(false);
                  handleEmployeeSelect(selectedEmployee);
                }}
                className="w-full py-3 px-4 rounded-xl font-medium text-white transition-colors"
                style={{
                  backgroundColor: '#2B82FF'
                }}
              >
                Вызвать на баттл
              </button>
            )}
          </div>
        )}
      </ModalOpaque>

      {/* Подтверждение отмены баттла */}
      <ModalOpaque
        isOpen={isCancelBattleOpen}
        onClose={() => setIsCancelBattleOpen(false)}
        title="Отменить баттл"
        theme={theme}
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => setIsCancelBattleOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors"
              style={{
                backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Нет
            </button>
            <button
              onClick={confirmCancelBattle}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-white transition-colors"
              style={{
                backgroundColor: '#EF4444'
              }}
            >
              Да, отменить
            </button>
          </div>
        }
      >
        <div className="text-center space-y-4">
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.10)',
            }}
          >
            <X className="w-8 h-8" style={{ color: '#EF4444' }} />
          </div>
          <div>
            <p 
              className="font-medium mb-2"
              style={{
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Вы уверены, что хотите отменить баттл?
            </p>
            <p 
              className="text-sm"
              style={{
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
              }}
            >
              Баттл с {selectedBattle?.opponent?.name} будет отменен
            </p>
          </div>
        </div>
      </ModalOpaque>

      {/* Подтверждение победы */}
      <ModalOpaque
        isOpen={isVictorySubmitOpen}
        onClose={() => {
          setIsVictorySubmitOpen(false);
          setVictoryComment('');
          setVictoryFile1(null);
          setVictoryFile2(null);
        }}
        title="Подтвердить победу"
        theme={theme}
        actions={
          <button
            onClick={submitVictoryProof}
            disabled={!victoryFile1 || !victoryFile2}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
              victoryFile1 && victoryFile2
                ? 'text-white'
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{
              backgroundColor: victoryFile1 && victoryFile2 
                ? '#2B82FF' 
                : (theme === 'dark' ? '#4A5568' : '#9CA3AF')
            }}
          >
            Отправить на проверку
          </button>
        }
      >
        <div className="space-y-4">
          <div className="text-center">
            <div 
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.10)',
              }}
            >
              <Trophy className="w-8 h-8" style={{ color: '#22C55E' }} />
            </div>
            <p 
              className="font-medium mb-2"
              style={{
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Баттл с {selectedBattle?.opponent?.name}
            </p>
            <p 
              className="text-sm"
              style={{
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
              }}
            >
              Прикрепите доказательства победы для проверки администратором
            </p>
          </div>

          {/* Комментарий */}
          <div>
            <label 
              className="block mb-2 font-medium"
              style={{
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Комментарий
            </label>
            <textarea
              value={victoryComment}
              onChange={(e) => setVictoryComment(e.target.value)}
              placeholder="Опишите результаты баттла..."
              rows={3}
              className="w-full p-3 rounded-xl transition-colors resize-none"
              style={{
                backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                outline: 'none'
              }}
            />
          </div>

          {/* Файлы */}
          <div className="space-y-3">
            <div>
              <label 
                className="block mb-2 font-medium"
                style={{
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              >
                Отчет первого участника *
              </label>
              <div className="flex items-center gap-2">
                <div 
                  className="flex-1 p-3 rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                    border: theme === 'dark' 
                      ? '1px solid rgba(255, 255, 255, 0.06)' 
                      : '1px solid #E6E9EF',
                    color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                  }}
                >
                  <span className="block truncate text-sm">
                    {victoryFile1 ? victoryFile1.name : 'Файл не выбран'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileUpload(1)}
                    accept="image/*,.pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="p-3 rounded-xl transition-colors"
                    style={{
                      backgroundColor: '#2B82FF',
                      color: '#FFFFFF'
                    }}
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label 
                className="block mb-2 font-medium"
                style={{
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                }}
              >
                Отчет второго участника *
              </label>
              <div className="flex items-center gap-2">
                <div 
                  className="flex-1 p-3 rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                    border: theme === 'dark' 
                      ? '1px solid rgba(255, 255, 255, 0.06)' 
                      : '1px solid #E6E9EF',
                    color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                  }}
                >
                  <span className="block truncate text-sm">
                    {victoryFile2 ? victoryFile2.name : 'Файл не выбран'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileUpload(2)}
                    accept="image/*,.pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="p-3 rounded-xl transition-colors"
                    style={{
                      backgroundColor: '#2B82FF',
                      color: '#FFFFFF'
                    }}
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p 
            className="text-xs text-center"
            style={{
              color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
            }}
          >
            * Обязательно приложить отчеты обоих участников для проверки
          </p>
        </div>
      </ModalOpaque>
    </>
  );
}