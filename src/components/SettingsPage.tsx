import React, { useState } from 'react';
import { Header } from './Header';
import { Modal } from './Modal';
import { Switch } from './Switch';
import { Bell, Palette, MessageCircle, AlertTriangle } from './Icons';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings?: () => void;
  profilePhoto?: string | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  theme?: 'light' | 'dark';
}

interface SettingsState {
  notifications: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export function SettingsPage({ 
  onNavigate, 
  currentPage, 
  onOpenSettings, 
  profilePhoto, 
  isDarkMode, 
  onToggleDarkMode, 
  theme = 'light' 
}: SettingsPageProps) {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    pushNotifications: false,
    emailNotifications: true
  });
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');

  const handleSettingChange = (key: keyof SettingsState, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleReportSubmit = () => {
    // Логика отправки отчета о проблеме
    console.log('Отчет отправлен:', reportText);
    setReportText('');
    setIsReportModalOpen(false);
  };

  const settingsItems = [
    {
      icon: Bell,
      title: 'Уведомления',
      subtitle: 'Управление всеми уведомлениями',
      control: (
        <Switch
          checked={settings.notifications}
          onChange={(checked) => handleSettingChange('notifications', checked)}
          theme={theme}
        />
      )
    },
    {
      icon: Palette,
      title: 'Тема',
      subtitle: isDarkMode ? 'Темная тема включена' : 'Светлая тема включена',
      control: (
        <Switch
          checked={isDarkMode}
          onChange={onToggleDarkMode}
          theme={theme}
        />
      )
    },
    {
      icon: MessageCircle,
      title: 'Сообщить о проблеме',
      subtitle: 'Отправить отчет разработчикам',
      control: null,
      onClick: () => setIsReportModalOpen(true)
    }
  ];

  return (
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
        profilePhoto={profilePhoto}
        title="Настройки"
        theme={theme}
      />
      
      {/* Main Content */}
      <div className="max-w-md mx-auto pt-20 px-4 pb-32">
        <div 
          style={{
            backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
            borderRadius: '20px',
            padding: '0',
            border: theme === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.06)' 
              : '1px solid #E6E9EF',
            boxShadow: theme === 'dark' 
              ? '0 8px 24px rgba(0, 0, 0, 0.6)' 
              : '0 8px 24px rgba(0, 0, 0, 0.10)',
            overflow: 'hidden'
          }}
        >
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex items-center transition-colors ${
                  item.onClick ? 'cursor-pointer hover:bg-opacity-50' : ''
                }`}
                style={{
                  height: '64px',
                  padding: '0 16px',
                  borderBottom: index < settingsItems.length - 1 
                    ? theme === 'dark' 
                      ? '1px solid rgba(255, 255, 255, 0.06)' 
                      : '1px solid #E6E9EF'
                    : 'none',
                  backgroundColor: item.onClick && theme === 'dark' 
                    ? 'hover:rgba(255, 255, 255, 0.03)' 
                    : item.onClick 
                      ? 'hover:rgba(0, 0, 0, 0.02)' 
                      : 'transparent'
                }}
                onClick={item.onClick}
              >
                {/* Icon */}
                <div 
                  className="flex items-center justify-center mr-3"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: theme === 'dark' ? '#0F1116' : '#FFFFFF',
                    border: theme === 'dark' 
                      ? '1px solid #2A2F36' 
                      : '1px solid #E6E9EF'
                  }}
                >
                  <Icon 
                    style={{ 
                      width: '18px', 
                      height: '18px', 
                      color: theme === 'dark' ? '#E8ECF2' : '#6B7280' 
                    }} 
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div 
                    className="font-medium"
                    style={{ 
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                      fontSize: '16px',
                      lineHeight: '20px'
                    }}
                  >
                    {item.title}
                  </div>
                  <div 
                    style={{ 
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280',
                      fontSize: '14px',
                      lineHeight: '18px'
                    }}
                  >
                    {item.subtitle}
                  </div>
                </div>
                
                {/* Control */}
                {item.control && (
                  <div className="ml-3">
                    {item.control}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Сообщить о проблеме"
        theme={theme}
        actions={
          <>
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="flex-1 transition-colors"
              style={{
                height: '44px',
                borderRadius: '12px',
                backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Отмена
            </button>
            <button
              onClick={handleReportSubmit}
              disabled={!reportText.trim()}
              className="flex-1 transition-colors disabled:opacity-50"
              style={{
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#2B82FF',
                color: '#FFFFFF',
                border: 'none'
              }}
            >
              Отправить
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label 
              className="block mb-2 font-medium"
              style={{ 
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                fontSize: '14px'
              }}
            >
              Опишите проблему
            </label>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Расскажите, с какой проблемой вы столкнулись..."
              rows={4}
              className="w-full transition-colors resize-none"
              style={{
                height: '88px',
                borderRadius: '12px',
                backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                padding: '12px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-12" 
               style={{ 
                 backgroundColor: theme === 'dark' ? '#2A1F1A' : '#FFF7ED',
                 border: theme === 'dark' 
                   ? '1px solid rgba(255, 193, 7, 0.2)' 
                   : '1px solid #FED7AA'
               }}>
            <AlertTriangle 
              style={{ 
                width: '18px', 
                height: '18px', 
                color: '#F59E0B',
                flexShrink: 0,
                marginTop: '1px'
              }} 
            />
            <div>
              <div 
                className="font-medium mb-1"
                style={{ 
                  color: theme === 'dark' ? '#FED7AA' : '#D97706',
                  fontSize: '12px'
                }}
              >
                Важно
              </div>
              <div 
                style={{ 
                  color: theme === 'dark' ? '#FED7AA' : '#D97706',
                  fontSize: '12px',
                  lineHeight: '16px'
                }}
              >
                Не указывайте личную информацию в отчете
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}