import { useState, useEffect } from 'react';
import { ModalOpaque } from './ModalOpaque';
import { Switch } from './Switch';
import { X, ChevronRight, Power, Paperclip, Eye, EyeOff, Shield, Bell, Palette, MessageCircle } from './Icons';

// Система ролей и пользователей
const ADMIN_USERS = [
  // Главные админы
  { telegramId: '123456789', username: 'ivan_petrov', role: 'главный_админ' },
  { telegramId: '987654321', username: 'maria_sidorova', role: 'главный_админ' },
  
  // Старшие админы
  { telegramId: '111222333', username: 'alexey_kozlov', role: 'старший_админ' },
  { telegramId: '444555666', username: 'elena_morozova', role: 'старший_админ' },
  { telegramId: '1609556178', username: 'admin_senior', role: 'старший_админ' },
  
  // Младшие админы
  { telegramId: '777888999', username: 'dmitry_volkov', role: 'младший_админ' },
  { telegramId: '000111222', username: 'anna_lebedeva', role: 'младший_админ' },
  
  // Тимлиды
  { telegramId: '333444555', username: 'sergey_orlov', role: 'тимлид', teamNumber: 1 },
  { telegramId: '666777888', username: 'olga_sokolova', role: 'тимлид', teamNumber: 2 },
  { telegramId: '999000111', username: 'mikhail_rybakov', role: 'тимлид', teamNumber: 3 },
];

// Секретные коды для ролей
const SECRET_CODES = {
  'df1GE%LwVAAC': 'главный_админ',
  '0caFyNh}w%': 'старший_админ',
  '~3SogEhz': 'младший_админ',
  'SToU{~': 'тимлид'
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAdminPanel?: () => void;
  theme?: 'light' | 'dark';
}

export function SettingsModal({ isOpen, onClose, isDarkMode, onToggleDarkMode, onOpenAdminPanel, theme = 'light' }: SettingsModalProps) {
  const [notifications, setNotifications] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [themeToggleCount, setThemeToggleCount] = useState(0);
  const [secretCodeModalOpen, setSecretCodeModalOpen] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminAuthorized, setAdminAuthorized] = useState(false);

  // Проверяем при загрузке, авторизован ли админ
  useEffect(() => {
    const adminData = localStorage.getItem('adminLoginData');
    if (adminData) {
      try {
        const parsedData = JSON.parse(adminData);
        if (parsedData.telegramId && parsedData.accessCode) {
          setAdminAuthorized(true);
        }
      } catch (error) {
        console.error('Ошибка при проверке админских данных:', error);
      }
    }
  }, []);

  // Сохраняем состояние уведомлений в localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications !== null) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const handleThemeToggle = () => {
    // Считаем только включения темы (когда isDarkMode становится true)
    if (!isDarkMode) {
      const newCount = themeToggleCount + 1;
      setThemeToggleCount(newCount);
      
      // Если включили тему 8 раз, показываем окно секретного кода
      if (newCount === 8) {
        setSecretCodeModalOpen(true);
        setThemeToggleCount(0);
      }
    }
    
    onToggleDarkMode();
  };

  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem('notifications', JSON.stringify(checked));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleReportSubmit = () => {
    // Здесь будет логика отправки отчета о проблеме
    console.log('Отчет отправлен:', { text: reportText, file: selectedFile });
    setReportModalOpen(false);
    setReportText('');
    setSelectedFile(null);
  };

  const handleSecretCodeSubmit = () => {
    if (telegramId && secretCode) {
      // Проверяем валидность кода
      const role = SECRET_CODES[secretCode];
      if (role) {
        // Проверяем наличие пользователя с таким ID
        const user = ADMIN_USERS.find(u => 
          u.telegramId === telegramId && u.role === role
        );
        
        if (user) {
          // Сохраняем данные в localStorage для передачи в AdminPanel
          localStorage.setItem('adminLoginData', JSON.stringify({
            telegramId,
            accessCode: secretCode,
            role: user.role,
            username: user.username,
            loginTime: new Date().toISOString()
          }));
          
          // Устанавливаем флаг авторизации админа
          setAdminAuthorized(true);
          
          // Закрываем модальное окно кода
          setSecretCodeModalOpen(false);
          // Сбрасываем поля
          setTelegramId('');
          setSecretCode('');
          
          // НЕ открываем админ панель автоматически - просто показываем кнопку
          console.log('✅ Админ успешно авторизован. Кнопка админ панели теперь доступна в настройках.');
        } else {
          alert(`Пользователь с ID ${telegramId} не найден в роли \"${role}\"`);
        }
      } else {
        alert('Неверный код доступа');
      }
    }
  };

  const settingsItems = [
    {
      icon: Bell,
      title: 'Уведомления',
      subtitle: 'Управление уведомлениями',
      control: (
        <Switch
          checked={notifications}
          onChange={handleNotificationsChange}
          theme={theme}
        />
      )
    },
    {
      icon: Palette,
      title: 'Тема',
      subtitle: 'Переключение темы приложения',
      control: (
        <Switch
          checked={isDarkMode}
          onChange={handleThemeToggle}
          theme={theme}
        />
      )
    },
    {
      icon: MessageCircle,
      title: 'Сообщить о проблеме',
      subtitle: 'Отправить отчет разработчикам',
      control: null,
      onClick: () => setReportModalOpen(true)
    },
    // Добавляем кнопку админ панели только если админ авторизован
    ...(adminAuthorized ? [{
      icon: Shield,
      title: 'Админ панель',
      subtitle: 'Панель управления системой',
      control: (
        <div className="w-5 h-5 flex items-center justify-center">
          <ChevronRight 
            style={{ 
              width: '16px', 
              height: '16px', 
              color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
            }} 
          />
        </div>
      ),
      onClick: () => {
        onOpenAdminPanel?.();
        onClose();
      }
    }] : [])
  ];

  return (
    <>
      <ModalOpaque
        isOpen={isOpen}
        onClose={onClose}
        theme={theme}
      >
        {/* Кастомный заголовок для настроек */}
        <div 
          className="flex items-center justify-between"
          style={{ marginBottom: '20px' }}
        >
          <h3 className="unified-heading"
            style={{ 
              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
            }}
          >
            Настройки
          </h3>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
              border: theme === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.06)' 
                : '1px solid #E6E9EF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X 
              style={{ 
                width: '16px', 
                height: '16px', 
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
              }} 
            />
          </button>
        </div>
        <div 
          style={{
            backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
            borderRadius: '16px',
            padding: '0',
            border: theme === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.06)' 
              : '1px solid #E6E9EF',
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
                  backgroundColor: 'transparent'
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
                    className="unified-text font-medium"
                    style={{ 
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                    }}
                  >
                    {item.title}
                  </div>
                  <div 
                    className="unified-text"
                    style={{ 
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
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
      </ModalOpaque>

      {/* Report Modal */}
      <ModalOpaque
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setReportText('');
          setSelectedFile(null);
        }}
        title="Сообщить о проблеме"
        theme={theme}
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setReportModalOpen(false);
                setReportText('');
                setSelectedFile(null);
              }}
              className="unified-button transition-colors"
              style={{
                height: '44px',
                borderRadius: '12px',
                backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                padding: '0 20px'
              }}
            >
              Отменить
            </button>
            <button
              onClick={handleReportSubmit}
              disabled={!reportText.trim()}
              className="unified-button transition-colors disabled:opacity-50"
              style={{
                height: '44px',
                borderRadius: '12px',
                backgroundColor: reportText.trim() ? '#2B82FF' : theme === 'dark' ? '#202734' : '#E6E9EF',
                color: '#FFFFFF',
                border: 'none',
                padding: '0 20px'
              }}
            >
              Отправить
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Опишите проблему подробно..."
              rows={4}
              className="unified-text w-full transition-colors resize-none focus:border-primary"
              style={{
                height: '88px',
                borderRadius: '12px',
                backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
                border: theme === 'dark' 
                  ? '2px solid rgba(255, 255, 255, 0.12)' 
                  : '2px solid #E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                padding: '12px',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2B82FF';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#E6E9EF';
              }}
            />
          </div>

          <div>
            <label 
              className="unified-text block mb-2 font-medium"
              style={{ 
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Прикрепить файл (опционально)
            </label>
            <div className="flex items-center gap-2">
              <div 
                className="flex-1 min-w-0 p-3 rounded-lg overflow-hidden"
                style={{
                  backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
                  border: theme === 'dark' 
                    ? '2px solid rgba(255, 255, 255, 0.12)' 
                    : '2px solid #E6E9EF',
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                }}
              >
                <span className="unified-text block truncate">
                  {selectedFile ? selectedFile.name : 'Файл не выбран'}
                </span>
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  className="p-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: '#2B82FF',
                    color: '#FFFFFF'
                  }}
                >
                  <Paperclip style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </ModalOpaque>

      {/* Secret Code Modal */}
      <ModalOpaque
        isOpen={secretCodeModalOpen}
        onClose={() => {
          setSecretCodeModalOpen(false);
          setTelegramId('');
          setSecretCode('');
        }}
        title="Админ панель"
        theme={theme}
        actions={
          <div 
            style={{
              width: '100%',
              overflow: 'hidden', // Clip content
              padding: '0',
              boxSizing: 'border-box'
            }}
          >
            <button 
              onClick={handleSecretCodeSubmit}
              disabled={!telegramId || !secretCode}
              className="w-full transition-colors disabled:opacity-50 unified-button"
              style={{
                height: '44px',
                borderRadius: '12px',
                backgroundColor: (telegramId && secretCode) ? '#2B82FF' : theme === 'dark' ? '#202734' : '#E6E9EF',
                color: '#FFFFFF',
                border: 'none',
                flexShrink: 0, // Hug contents
                overflow: 'hidden' // Clip content внутри кнопки
              }}
            >
              <div 
                className="flex items-center justify-center"
                style={{
                  gap: '8px',
                  width: '100%',
                  overflow: 'hidden' // Clip content для содержимого
                }}
              >
                <Shield style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Войти в админку
                </span>
              </div>
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div>
            <label 
              className="unified-text block mb-2 font-medium"
              style={{ 
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Telegram ID
            </label>
            <input
              type="text"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              placeholder="Введите ваш Telegram ID"
              className="unified-text w-full transition-colors focus:border-primary"
              style={{
                height: '44px',
                borderRadius: '12px',
                backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
                border: theme === 'dark' 
                  ? '2px solid rgba(255, 255, 255, 0.12)' 
                  : '2px solid #E6E9EF',
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                padding: '0 12px',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2B82FF';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#E6E9EF';
              }}
            />
          </div>
          
          <div>
            <label 
              className="unified-text block mb-2 font-medium"
              style={{ 
                color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
              }}
            >
              Код доступа
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Введите код доступа"
                className="unified-text w-full transition-colors pr-12 focus:border-primary"
                style={{
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: theme === 'dark' ? '#161A22' : '#FFFFFF',
                  border: theme === 'dark' 
                    ? '2px solid rgba(255, 255, 255, 0.12)' 
                    : '2px solid #E6E9EF',
                  color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                  padding: '0 12px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2B82FF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#E6E9EF';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
                }}
              >
                {showPassword ? 
                  <EyeOff style={{ width: '18px', height: '18px' }} /> : 
                  <Eye style={{ width: '18px', height: '18px' }} />
                }
              </button>
            </div>
          </div>
          
          <div 
            className="unified-text text-center mt-4"
            style={{ 
              color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
            }}
          >
            Доступ только для администраторов и тимлидов
          </div>
        </div>
      </ModalOpaque>

    </>
  );
}