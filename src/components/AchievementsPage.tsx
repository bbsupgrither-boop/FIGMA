import { useState } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { Menu, X, Paperclip, Trophy } from './Icons';
import { ModalOpaque } from './ModalOpaque';
import { Achievement, SortType } from '../types/achievements';
// Убираем импорт mockAppState, так как его нет в файле
import { EmptyCard } from './EmptyCard';
import { Panel } from './Panel';

interface AchievementsPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings?: () => void;
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  profilePhoto?: string | null;
  theme?: 'light' | 'dark';
}

export function AchievementsPage({ onNavigate, currentPage, onOpenSettings, achievements, setAchievements, profilePhoto, theme = 'light' }: AchievementsPageProps) {
  // Создаем мок-пользователя для демонстрации
  const currentUser = {
    id: 'user1',
    name: 'Иван Иванов',
    username: '@iivanov'
  };
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sortType, setSortType] = useState<SortType>('progress_desc');
  const [fileUploadOpen, setFileUploadOpen] = useState(false);

  const handleSort = (type: SortType) => {
    setSortType(type);
    setSortMenuOpen(false);
  };

  const sortedAchievements = [...achievements].sort((a, b) => {
    switch (sortType) {
      case 'alphabet':
        return a.title.localeCompare(b.title);
      case 'progress_asc':
        const percentA = (a.requirements.current / a.requirements.target) * 100;
        const percentB = (b.requirements.current / b.requirements.target) * 100;
        return percentA - percentB;
      case 'progress_desc':
        const percentDescA = (a.requirements.current / a.requirements.target) * 100;
        const percentDescB = (b.requirements.current / b.requirements.target) * 100;
        // Сначала достижения с прогрессом, потом без прогресса
        if (percentDescA > 0 && percentDescB === 0) return -1;
        if (percentDescA === 0 && percentDescB > 0) return 1;
        return percentDescB - percentDescA;

      default:
        return 0;
    }
  });

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsDetailOpen(true);
  };

  const handleFileSelected = () => {
    if (selectedAchievement) {
      setAchievements(prevAchievements =>
        prevAchievements.map(achievement =>
          achievement.id === selectedAchievement.id
            ? { ...achievement, userFile: 'user_file.pdf' }
            : achievement
        )
      );
      
      setSelectedAchievement(prev => 
        prev ? { ...prev, userFile: 'user_file.pdf' } : null
      );
    }
    setFileUploadOpen(false);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  return (
    <>
      <div 
        className="min-h-screen"
        style={{
          background: theme === 'dark' ? '#0B0D10' : '#FFFFFF',
          color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
        }}
      >
        {/* Header */}
        <Header onNavigate={onNavigate} currentPage={currentPage} onOpenSettings={onOpenSettings} user={currentUser} profilePhoto={profilePhoto} />
        
        {/* Main Content */}
        <div className="max-w-md mx-auto pt-20 px-4 pb-32">
          <Panel
            title="Доступные достижения"
            rightButton={
              <button
                onClick={() => setSortMenuOpen(true)}
                className="apple-button transition-all hover:scale-105"
                style={{
                  width: '40px',
                  height: '40px',
                  minWidth: '44px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Menu style={{ width: '24px', height: '24px', color: '#6B7280' }} />
              </button>
            }
          >
            {sortedAchievements.length > 0 ? (
              <div className="space-y-3">
                {sortedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    onClick={() => handleAchievementClick(achievement)}
                    className={`surface-card transition-all hover:scale-[0.98] cursor-pointer flex items-center gap-4 ${
                      achievement.requirements.current === 0 
                        ? 'opacity-50 grayscale' 
                        : ''
                    }`}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '16px',
                      border: '1px solid #E6E9EF',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.10)'
                    }}
                  >
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-xl"
                      style={{ backgroundColor: 'rgba(43, 130, 255, 0.10)' }}
                    >
                      <Trophy style={{ width: '20px', height: '20px', color: '#2B82FF' }} />
                    </div>
                    
                    <div className="flex-1">
                      <div 
                        className="font-medium text-sm mb-1"
                        style={{ color: '#0F172A' }}
                      >
                        {achievement.title}
                      </div>
                      <div 
                        className="text-xs mb-2"
                        style={{ color: '#6B7280' }}
                      >
                        {achievement.description}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div 
                        className="text-sm font-medium"
                        style={{ color: '#0F172A' }}
                      >
                        {getProgressPercentage(achievement.requirements.current, achievement.requirements.target)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyCard variant="achievements_empty" />
            )}
          </Panel>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigation onNavigate={onNavigate} currentPage={currentPage} />
      </div>

      {/* Меню сортировки */}
      <ModalOpaque
        isOpen={sortMenuOpen}
        onClose={() => setSortMenuOpen(false)}
        title="Сортировка"
        theme={theme}
      >
        <div className="space-y-3">
          <button
            onClick={() => handleSort('alphabet')}
            className="w-full transition-all hover:scale-[0.98] text-center"
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: sortType === 'alphabet' 
                ? theme === 'dark' ? 'rgba(43, 130, 255, 0.12)' : 'rgba(43, 130, 255, 0.10)'
                : theme === 'dark' ? '#1C2029' : '#F3F5F8',
              border: sortType === 'alphabet' 
                ? '1px solid rgba(43, 130, 255, 0.20)'
                : theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
              color: sortType === 'alphabet' 
                ? '#2B82FF' 
                : theme === 'dark' ? '#E8ECF2' : '#0F172A',
              fontSize: '14px'
            }}
          >
            По алфавиту
          </button>
          <button
            onClick={() => handleSort('progress_asc')}
            className="w-full transition-all hover:scale-[0.98] text-center"
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: sortType === 'progress_asc' 
                ? theme === 'dark' ? 'rgba(43, 130, 255, 0.12)' : 'rgba(43, 130, 255, 0.10)'
                : theme === 'dark' ? '#1C2029' : '#F3F5F8',
              border: sortType === 'progress_asc' 
                ? '1px solid rgba(43, 130, 255, 0.20)'
                : theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
              color: sortType === 'progress_asc' 
                ? '#2B82FF' 
                : theme === 'dark' ? '#E8ECF2' : '#0F172A',
              fontSize: '14px'
            }}
          >
            По проценту (от наименьшего)
          </button>
          <button
            onClick={() => handleSort('progress_desc')}
            className="w-full transition-all hover:scale-[0.98] text-center"
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: sortType === 'progress_desc' 
                ? theme === 'dark' ? 'rgba(43, 130, 255, 0.12)' : 'rgba(43, 130, 255, 0.10)'
                : theme === 'dark' ? '#1C2029' : '#F3F5F8',
              border: sortType === 'progress_desc' 
                ? '1px solid rgba(43, 130, 255, 0.20)'
                : theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
              color: sortType === 'progress_desc' 
                ? '#2B82FF' 
                : theme === 'dark' ? '#E8ECF2' : '#0F172A',
              fontSize: '14px'
            }}
          >
            По проценту (от наибольшего)
          </button>
        </div>
      </ModalOpaque>

      {/* Детали достижения */}
      <ModalOpaque
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Условия выполнения достижения"
        theme={theme}
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => setIsDetailOpen(false)}
              className="flex-1 transition-colors text-center unified-button"
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
              className="flex-1 transition-colors text-center unified-button"
              style={{
                height: '44px',
                borderRadius: '12px',
                background: '#2B82FF',
                color: '#FFFFFF',
                border: 'none'
              }}
            >
              Применить
            </button>
          </div>
        }
      >
        {selectedAchievement && (
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <div className="space-y-4">
              {/* Иконка и название */}
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="flex items-center justify-center"
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: theme === 'dark' ? 'rgba(167, 176, 189, 0.3)' : 'rgba(107, 114, 128, 0.3)',
                    borderRadius: '16px'
                  }}
                >
                  <Trophy style={{ width: '32px', height: '32px', color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} />
                </div>
                
                <div className="flex-1">
                  <div 
                    className="font-medium mb-1"
                    style={{ 
                      fontSize: '14px',
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                    }}
                  >
                    {selectedAchievement.title}
                  </div>
                  <div 
                    style={{ 
                      fontSize: '12px',
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                    }}
                  >
                    {selectedAchievement.description}
                  </div>
                </div>
              </div>

              {/* Условия выполнения */}
              <div 
                className="rounded-xl p-4 mb-4"
                style={{
                  backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8',
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
                }}
              >
                <div 
                  className="font-medium mb-3"
                  style={{ 
                    fontSize: '14px',
                    color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                  }}
                >
                  Краткое описание достижения
                </div>
                <div className="space-y-2">
                  {selectedAchievement.conditions?.length ? (
                    selectedAchievement.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="rounded-full"
                            style={{
                              width: '4px',
                              height: '4px',
                              backgroundColor: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                            }}
                          />
                          <span 
                            style={{ 
                              fontSize: '14px',
                              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                            }}
                          >
                            {condition}
                          </span>
                        </div>
                        <button
                          onClick={() => setFileUploadOpen(true)}
                          className="p-2 rounded-lg transition-colors"
                          style={{
                            backgroundColor: selectedAchievement.userFile
                              ? theme === 'dark' ? '#A7B0BD' : '#6B7280'
                              : 'transparent'
                          }}
                        >
                          <Paperclip style={{ width: '16px', height: '16px', color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2">
                      <div 
                        className="rounded-full"
                        style={{
                          width: '4px',
                          height: '4px',
                          backgroundColor: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                        }}
                      />
                      <span 
                        style={{ 
                          fontSize: '14px',
                          color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                        }}
                      >
                        {selectedAchievement.requirements.type}: {selectedAchievement.requirements.current}/{selectedAchievement.requirements.target}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Комментарий от админа */}
              <div 
                className={`rounded-xl p-4 ${!selectedAchievement.adminComment ? 'opacity-50' : ''}`}
                style={{
                  backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8',
                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="font-medium"
                    style={{ 
                      fontSize: '14px',
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                    }}
                  >
                    Комментарий от Админа
                  </div>
                  {selectedAchievement.adminFile && (
                    <button
                      className="p-2 rounded-lg transition-colors"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <Paperclip style={{ width: '16px', height: '16px', color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} />
                    </button>
                  )}
                </div>
                <div 
                  style={{ 
                    fontSize: '14px',
                    color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                  }}
                >
                  {selectedAchievement.adminComment || 'Комментарий не добавлен'}
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalOpaque>

      {/* Модальное окно загрузки файла */}
      <ModalOpaque
        isOpen={fileUploadOpen}
        onClose={() => setFileUploadOpen(false)}
        title="Прикрепить файл"
        theme={theme}
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => setFileUploadOpen(false)}
              className="flex-1 transition-colors text-center unified-button"
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
          </div>
        }
      >
        <div 
          className="rounded-xl p-6 text-center"
          style={{
            backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
          }}
        >
          <div 
            className="mx-auto mb-4 flex items-center justify-center"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(43, 130, 255, 0.20)',
              borderRadius: '12px'
            }}
          >
            <Paperclip style={{ width: '24px', height: '24px', color: '#2B82FF' }} />
          </div>
          <p 
            className="mb-4"
            style={{ 
              fontSize: '14px',
              color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
            }}
          >
            Выберите файл для загрузки
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileSelected}
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
          <label
            htmlFor="file-upload"
            className="w-full transition-colors cursor-pointer inline-block text-center unified-button"
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#F3F5F8',
              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #E6E9EF',
              color: theme === 'dark' ? '#1A1A1A' : '#0F172A',
              fontSize: '14px',
              boxShadow: theme === 'dark' 
                ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                : 'none'
            }}
          >
            Выбрать файл
          </label>
        </div>
      </ModalOpaque>
    </>
  );
}