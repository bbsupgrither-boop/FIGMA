// Telegram Web App Integration

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    chat_type?: string;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text: string;
    }>;
  }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params: {
    text?: string;
  }, callback?: (text: string) => void) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback?: (text: string) => void) => void;
  sendData: (data: string) => void;
  requestWriteAccess: (callback?: (granted: boolean) => void) => void;
  requestContact: (callback?: (granted: boolean) => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

// Основной класс для работы с Telegram Web App
export class TelegramService {
  private static instance: TelegramService;
  private webApp: TelegramWebApp | null = null;
  private isInitialized = false;

  private constructor() {
    this.init();
  }

  static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  private init() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp;
      this.webApp.ready();
      this.webApp.expand();
      this.isInitialized = true;
      
      console.log('Telegram Web App initialized:', {
        version: this.webApp.version,
        platform: this.webApp.platform,
        colorScheme: this.webApp.colorScheme,
        user: this.webApp.initDataUnsafe?.user
      });

      // Настройка темы приложения на основе Telegram
      this.setupTheme();
    } else {
      console.log('Telegram Web App not available - running in browser mode');
    }
  }

  private setupTheme() {
    if (!this.webApp) return;

    const isDark = this.webApp.colorScheme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);

    // Применяем цвета темы Telegram
    const theme = this.webApp.themeParams;
    if (theme.bg_color) {
      document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color);
    }
    if (theme.text_color) {
      document.documentElement.style.setProperty('--tg-text-color', theme.text_color);
    }
  }

  // Проверка доступности Telegram Web App
  isAvailable(): boolean {
    return this.isInitialized && this.webApp !== null;
  }

  // Получение данных пользователя
  getUser() {
    if (!this.webApp) return null;
    return this.webApp.initDataUnsafe?.user || null;
  }

  // Получение init data для авторизации на бэкенде
  getInitData(): string {
    if (!this.webApp) return '';
    return this.webApp.initData || '';
  }

  // Проверка темы
  getColorScheme(): 'light' | 'dark' {
    if (!this.webApp) return 'dark'; // По умолчанию темная тема
    return this.webApp.colorScheme;
  }

  // Показ главной кнопки
  showMainButton(text: string, callback: () => void) {
    if (!this.webApp) return;
    
    this.webApp.MainButton.setText(text);
    this.webApp.MainButton.onClick(callback);
    this.webApp.MainButton.show();
  }

  // Скрытие главной кнопки
  hideMainButton() {
    if (!this.webApp) return;
    this.webApp.MainButton.hide();
  }

  // Показ кнопки "Назад"
  showBackButton(callback: () => void) {
    if (!this.webApp) return;
    
    this.webApp.BackButton.onClick(callback);
    this.webApp.BackButton.show();
  }

  // Скрытие кнопки "Назад"
  hideBackButton() {
    if (!this.webApp) return;
    this.webApp.BackButton.hide();
  }

  // Haptic feedback
  impactFeedback(style: 'light' | 'medium' | 'heavy' = 'medium') {
    if (!this.webApp) return;
    this.webApp.HapticFeedback.impactOccurred(style);
  }

  notificationFeedback(type: 'error' | 'success' | 'warning') {
    if (!this.webApp) return;
    this.webApp.HapticFeedback.notificationOccurred(type);
  }

  selectionFeedback() {
    if (!this.webApp) return;
    this.webApp.HapticFeedback.selectionChanged();
  }

  // Показ алерта
  showAlert(message: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.webApp) {
        alert(message);
        resolve();
        return;
      }
      
      this.webApp.showAlert(message, () => resolve());
    });
  }

  // Показ подтверждения
  showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.webApp) {
        resolve(confirm(message));
        return;
      }
      
      this.webApp.showConfirm(message, (confirmed) => resolve(confirmed));
    });
  }

  // Отправка данных боту
  sendData(data: any) {
    if (!this.webApp) return;
    this.webApp.sendData(JSON.stringify(data));
  }

  // Закрытие приложения
  close() {
    if (!this.webApp) return;
    this.webApp.close();
  }

  // Проверка на мобильное устройство
  isMobile(): boolean {
    if (!this.webApp) return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return ['android', 'ios'].includes(this.webApp.platform);
  }

  // Получение информации о платформе
  getPlatform(): string {
    if (!this.webApp) return 'web';
    return this.webApp.platform;
  }

  // Получение размеров viewport
  getViewportHeight(): number {
    if (!this.webApp) return window.innerHeight;
    return this.webApp.viewportHeight;
  }

  getStableViewportHeight(): number {
    if (!this.webApp) return window.innerHeight;
    return this.webApp.viewportStableHeight;
  }
}

// Хук для использования в React компонентах
export const useTelegram = () => {
  const telegram = TelegramService.getInstance();
  
  return {
    webApp: telegram.isAvailable() ? telegram : null,
    user: telegram.getUser(),
    colorScheme: telegram.getColorScheme(),
    isAvailable: telegram.isAvailable(),
    showMainButton: telegram.showMainButton.bind(telegram),
    hideMainButton: telegram.hideMainButton.bind(telegram),
    showBackButton: telegram.showBackButton.bind(telegram),
    hideBackButton: telegram.hideBackButton.bind(telegram),
    impactFeedback: telegram.impactFeedback.bind(telegram),
    notificationFeedback: telegram.notificationFeedback.bind(telegram),
    selectionFeedback: telegram.selectionFeedback.bind(telegram),
    showAlert: telegram.showAlert.bind(telegram),
    showConfirm: telegram.showConfirm.bind(telegram),
    sendData: telegram.sendData.bind(telegram),
    close: telegram.close.bind(telegram),
    isMobile: telegram.isMobile(),
    platform: telegram.getPlatform(),
    viewportHeight: telegram.getViewportHeight(),
    stableViewportHeight: telegram.getStableViewportHeight(),
    initData: telegram.getInitData()
  };
};

// Утилиты для работы с данными
export const telegramUtils = {
  // Проверка валидности init data (для бэкенда)
  validateInitData: (initData: string, botToken: string): boolean => {
    // Эта функция должна быть на бэкенде для безопасности
    // Здесь только заглушка
    return initData.length > 0;
  },

  // Форматирование имени пользователя
  formatUserName: (user: any): string => {
    if (!user) return 'Гость';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const username = user.username || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (username) {
      return `@${username}`;
    } else {
      return `User ${user.id}`;
    }
  },

  // Получение аватара пользователя
  getUserAvatar: (user: any): string | null => {
    return user?.photo_url || null;
  },

  // Определение языка пользователя
  getUserLanguage: (user: any): string => {
    return user?.language_code || 'ru';
  }
};

export default TelegramService;