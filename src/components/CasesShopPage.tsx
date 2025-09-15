import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Settings, Plus, Minus, X, CheckCircle, Clock, Gift, ShoppingBag, Coins, Gem } from './Icons';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { CaseRoulette } from './CaseRoulette';
import { PrizeRoulette } from './PrizeRoulette';
import { Modal } from './Modal';
import { ModalOpaque } from './ModalOpaque';
import { ShopItem, Order } from '../types/shop';
import { CaseType, UserCase, CaseShopItem, RouletteResult, PrizeRouletteResult, Prize } from '../types/cases';
import { ImageWithFallback } from './figma/ImageWithFallback';
import coinImage from 'figma:asset/acaa4cccbfaf8eeee6ecbbe8f29c92d03b701371.png';
import coinIcon from 'figma:asset/29d513144bb95c08c031f3604ac2dd2e7bee6450.png';
import { mockCaseTypes, mockUserCases, mockCaseShopItems } from '../data/mockData';

interface CasesShopPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings: () => void;
  profilePhoto: string | null;
  theme: 'light' | 'dark';
  cases: CaseType[];
  setCases: (cases: CaseType[]) => void;
  userCases: UserCase[];
  setUserCases: (userCases: UserCase[]) => void;
  shopItems: ShopItem[];
  setShopItems: (items: ShopItem[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  currentUser?: {
    id: string;
    name: string;
    balance: number;
    level?: number;
    experience?: number;
  };
  onUpdateUserBalance?: (userId: string, amount: number) => void;
  onUpdateUserExperience?: (userId: string, amount: number) => void;
  notificationsCount?: number;
}

// Тип для товара в корзине (локальный)
interface LocalCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export default function CasesShopPage({ 
  onNavigate, 
  currentPage, 
  onOpenSettings, 
  profilePhoto,
  theme,
  cases,
  setCases,
  userCases,
  setUserCases,
  shopItems,
  setShopItems,
  orders,
  setOrders,
  currentUser,
  onUpdateUserBalance,
  onUpdateUserExperience,
  notificationsCount
}: CasesShopPageProps) {
  const userBalance = currentUser?.balance || 0;
  const [activeTab, setActiveTab] = useState<'free' | 'shop' | 'my'>('free');
  const [cart, setCart] = useState<LocalCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartTab, setCartTab] = useState<'cart' | 'active' | 'completed'>('cart');
  
  // Локальные товары для магазина
  const localShopItems = [
    {
      id: 'shop1',
      name: 'Бонус опыта 2x',
      price: 500,
      description: 'Удваивает получаемый ��пыт на 24 часа',
      emoji: '⚡',
      isActive: true
    },
    {
      id: 'shop2', 
      name: 'VIP статус',
      price: 2000,
      description: 'Расширенные привилегии на месяц',
      emoji: '👑',
      isActive: true
    }
  ];
  
  // States для кейсов
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isPrizeRouletteOpen, setIsPrizeRouletteOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [canSpin, setCanSpin] = useState(false);
  const [wonCase, setWonCase] = useState<CaseType | null>(null);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [openingCase, setOpeningCase] = useState<UserCase | null>(null);
  const [caseDetailsOpen, setCaseDetailsOpen] = useState(false);
  const [selectedCaseForDetails, setSelectedCaseForDetails] = useState<CaseType | null>(null);
  const [selectedShopItem, setSelectedShopItem] = useState<CaseShopItem | null>(null);
  const [lastFreeCase, setLastFreeCase] = useState<Date | null>(null);

  // Функция для проверки, является ли строка URL
  const isImageUrl = (str: string) => {
    try {
      new URL(str);
      return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:') || str.startsWith('figma:');
    } catch {
      return false;
    }
  };

  // Компонент для отображения изображения или эмодзи
  const ImageOrEmoji = ({ src, className = '', style = {} }: { src: string; className?: string; style?: React.CSSProperties }) => {
    if (isImageUrl(src)) {
      return (
        <ImageWithFallback
          src={src}
          alt="Image"
          className={`${className} object-cover`}
          style={style}
        />
      );
    }
    return (
      <div className={`flex items-center justify-center ${className}`} style={style}>
        <span className="text-4xl">{src}</span>
      </div>
    );
  };

  // Проверяем доступность бесплатного кейса (для тестирования всегда доступен)
  const isFreeAvailable = true;

  // ================= HANDLERS ДЛЯ КЕЙСОВ =================
  const handleFreeCaseOpen = () => {
    if (isFreeAvailable) {
      setIsRouletteOpen(true);
      setCanSpin(true);
      setHasSpun(false);
      setWonCase(null);
    }
  };

  const handleStartSpin = () => {
    if (canSpin) {
      setIsSpinning(true);
      setCanSpin(false);
    }
  };

  const handleRouletteResult = (result: RouletteResult) => {
    console.log('Получен кейс:', result.selectedCase);
    setWonCase(result.selectedCase);
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
    setHasSpun(true);
  };

  const handleClaimCase = () => {
    if (wonCase) {
      const newCase: UserCase = {
        id: `user_case_${Date.now()}`,
        caseTypeId: wonCase.id,
        obtainedAt: new Date(),
        isOpened: false
      };
      
      setUserCases(prev => [...prev, newCase]);
      setLastFreeCase(new Date());
    }
    
    setIsRouletteOpen(false);
    setIsSpinning(false);
    setHasSpun(false);
    setCanSpin(false);
    setWonCase(null);
  };

  const handleCloseCaseRoulette = () => {
    if (!isSpinning && (!canSpin || hasSpun)) {
      if (hasSpun && wonCase) {
        handleClaimCase();
      } else {
        setIsRouletteOpen(false);
        setIsSpinning(false);
        setHasSpun(false);
        setCanSpin(false);
        setWonCase(null);
      }
    }
  };

  const handleOpenCase = (userCase: UserCase) => {
    const caseType = cases.find(c => c.id === userCase.caseTypeId);
    if (!caseType) return;

    setOpeningCase(userCase);
    setIsPrizeRouletteOpen(true);
    setCanSpin(true);
    setHasSpun(false);
    setWonPrize(null);
  };

  const handleStartPrizeSpin = () => {
    if (canSpin) {
      setIsSpinning(true);
      setCanSpin(false);
    }
  };

  const handlePrizeRouletteResult = (result: PrizeRouletteResult) => {
    console.log('Получен приз:', result.selectedPrize);
    setWonPrize(result.selectedPrize);
  };

  const handlePrizeSpinComplete = () => {
    setIsSpinning(false);
    setHasSpun(true);
  };

  const handleClaimPrize = () => {
    if (wonPrize && openingCase && currentUser) {
      if (wonPrize.type === 'coins' && onUpdateUserBalance) {
        onUpdateUserBalance(currentUser.id, wonPrize.value);
      } else if (wonPrize.type === 'experience' && onUpdateUserExperience) {
        onUpdateUserExperience(currentUser.id, wonPrize.value);
      }
      
      setUserCases(prev => prev.filter(uc => uc.id !== openingCase.id));
    }
    
    setIsPrizeRouletteOpen(false);
    setIsSpinning(false);
    setHasSpun(false);
    setCanSpin(false);
    setWonPrize(null);
    setOpeningCase(null);
  };

  const handleClosePrizeRoulette = () => {
    if (!isSpinning && (!canSpin || hasSpun)) {
      if (hasSpun && wonPrize) {
        handleClaimPrize();
      } else {
        setIsPrizeRouletteOpen(false);
        setIsSpinning(false);
        setHasSpun(false);
        setCanSpin(false);
        setWonPrize(null);
        setOpeningCase(null);
      }
    }
  };

  const handleShowCaseDetails = (caseType: CaseType, shopItem: CaseShopItem) => {
    setSelectedCaseForDetails(caseType);
    setSelectedShopItem(shopItem);
    setCaseDetailsOpen(true);
  };

  const handleBuyCase = (shopItem: CaseShopItem) => {
    const caseType = mockCaseTypes.find(c => c.id === shopItem.caseTypeId);
    if (!caseType) return;

    const newCase: UserCase = {
      id: `user_case_${Date.now()}`,
      caseTypeId: caseType.id,
      obtainedAt: new Date(),
      isOpened: false
    };
    
    setUserCases(prev => [...prev, newCase]);
    setCaseDetailsOpen(false);
  };

  // ================= HANDLERS ДЛЯ КОРЗИНЫ =================
  const addToCart = (item: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        emoji: item.emoji
      }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const totalAmount = getCartTotal();
    if (totalAmount > userBalance) {
      console.error('Недостаточно средств для покупки');
      return;
    }

    // Создаем новый заказ со всеми товарами из корзины
    const newOrder: Order = {
      id: Date.now().toString(),
      items: cart.map(cartItem => ({
        id: cartItem.id,
        name: cartItem.name,
        price: cartItem.price,
        quantity: cartItem.quantity,
        emoji: cartItem.emoji
      })),
      total: totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId: currentUser?.id || 'current-user',
      customerName: currentUser?.name || 'Пользователь',
      customerTeam: 'Frontend Team'
    };
    
    setOrders(prev => [newOrder, ...prev]);

    // Списываем средства
    if (onUpdateUserBalance && currentUser) {
      onUpdateUserBalance(currentUser.id, -totalAmount);
    }

    // Очищаем корзину
    setCart([]);
    
    if (addNotification) {
      console.log('Заказ оформлен:', {
        type: 'shop',
        title: '��� Заказ оформлен!',
        message: `Ваш заказ на сумму ${totalAmount} коинов отправлен на рассмотрение администратору.`,
        priority: 'medium'
      });
    }
  };

  // ================= RENDER FUNCTIONS =================
  const renderTabs = () => (
    <div className="flex items-center justify-center mb-6">
      <div 
        className="flex rounded-2xl p-1.5 tab-container"
        style={{
          background: theme === 'dark' 
            ? 'linear-gradient(145deg, rgba(8, 10, 14, 0.95) 0%, rgba(16, 20, 28, 0.95) 100%)'
            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
          border: theme === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.06)'
            : '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: theme === 'dark' 
            ? '0 8px 24px rgba(0, 0, 0, 0.6)'
            : '0 8px 24px rgba(0, 0, 0, 0.10)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <button
          onClick={() => setActiveTab('free')}
          className="px-6 py-3 rounded-xl unified-text transition-all duration-200 tab-button"
          style={{
            background: activeTab === 'free' 
              ? (theme === 'dark' 
                  ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                  : '#2B82FF')
              : 'transparent',
            color: activeTab === 'free' 
              ? (theme === 'dark' ? '#1A1A1A' : '#FFFFFF')
              : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
            border: activeTab === 'free' 
              ? (theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.2)' 
                  : '1px solid #2B82FF')
              : '1px solid transparent',
            boxShadow: activeTab === 'free' 
              ? (theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  : '0 2px 8px rgba(43, 130, 255, 0.3)')
              : 'none'
          }}
        >
          БЕСПЛАТНЫЙ
        </button>
        
        <button
          onClick={() => setActiveTab('shop')}
          className="px-6 py-3 rounded-xl unified-text transition-all duration-200 tab-button"
          style={{
            background: activeTab === 'shop' 
              ? (theme === 'dark' 
                  ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                  : '#2B82FF')
              : 'transparent',
            color: activeTab === 'shop' 
              ? (theme === 'dark' ? '#1A1A1A' : '#FFFFFF')
              : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
            border: activeTab === 'shop' 
              ? (theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.2)' 
                  : '1px solid #2B82FF')
              : '1px solid transparent',
            boxShadow: activeTab === 'shop' 
              ? (theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  : '0 2px 8px rgba(43, 130, 255, 0.3)')
              : 'none'
          }}
        >
          МАГАЗИН
        </button>
        
        <button
          onClick={() => setActiveTab('my')}
          className="px-6 py-3 rounded-xl unified-text transition-all duration-200 tab-button"
          style={{
            background: activeTab === 'my' 
              ? (theme === 'dark' 
                  ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                  : '#2B82FF')
              : 'transparent',
            color: activeTab === 'my' 
              ? (theme === 'dark' ? '#1A1A1A' : '#FFFFFF')
              : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
            border: activeTab === 'my' 
              ? (theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.2)' 
                  : '1px solid #2B82FF')
              : '1px solid transparent',
            boxShadow: activeTab === 'my' 
              ? (theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  : '0 2px 8px rgba(43, 130, 255, 0.3)')
              : 'none'
          }}
        >
          МОИ КЕЙСЫ
        </button>
      </div>
    </div>
  );

  const renderHeader = () => (
    <Header 
      onNavigate={onNavigate} 
      currentPage={currentPage} 
      onOpenSettings={onOpenSettings}
      profilePhoto={profilePhoto}
      theme={theme}
      showBackButton={false}
      customTitle={
        <div className="flex items-center gap-3">
          <span className="unified-text" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
            Баланс: {userBalance}
          </span>
          <img src={coinIcon} alt="G-coin" style={{ width: '14px', height: '14px' }} />
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full transition-all hover:scale-105"
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
            <ShoppingCart 
              style={{
                width: '16px',
                height: '16px',
                color: theme === 'dark' ? '#1A1A1A' : '#6B7280'
              }}
            />
            {cart.length > 0 && (
              <div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{
                  background: '#FF3B30',
                  color: '#FFFFFF'
                }}
              >
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </div>
            )}
          </button>
        </div>
      }
    />
  );

  const renderFreeCase = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="unified-heading" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
          БЕСПЛАТНЫЙ КЕЙС
        </h3>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto"></div>
      </div>

      <div 
        className="rounded-2xl p-6 border"
        style={{
          background: theme === 'dark' 
            ? 'linear-gradient(145deg, rgba(16, 20, 28, 0.95) 0%, rgba(22, 26, 34, 0.95) 100%)'
            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          border: theme === 'dark' 
            ? '1px solid rgba(34, 197, 94, 0.4)'
            : '1px solid rgba(34, 197, 94, 0.3)',
          boxShadow: theme === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
        }}
      >
        <div className="text-center space-y-6">
          <div 
            className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))',
              boxShadow: '0 0 30px rgba(34, 197, 94, 0.4), inset 0 0 20px rgba(34, 197, 94, 0.2)'
            }}
          >
            <Gift className="w-16 h-16 text-green-400" style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))' }} />
          </div>
          
          <div>
            <h4 
              className="unified-heading mb-3" 
              style={{ 
                color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                textShadow: theme === 'dark' ? '0 0 10px rgba(34, 197, 94, 0.8)' : '0 0 5px rgba(34, 197, 94, 0.3)'
              }}
            >
              БЕСПЛАТНЫЙ КЕЙС GRITHER
            </h4>
            <p 
              className="unified-text opacity-80"
              style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}
            >
              Получите случайный кейс совершенно бесплатно каждые 24 часа!
            </p>
          </div>
          
          {isFreeAvailable ? (
            <button
              onClick={handleFreeCaseOpen}
              className="w-full py-4 px-6 rounded-xl unified-button tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center text-center"
              style={{
                background: 'linear-gradient(145deg, #22C55E, #16A34A)',
                color: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              ОТКРЫТЬ БЕСПЛАТНЫЙ КЕЙС
            </button>
          ) : (
            <div className="space-y-4">
              <div 
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg"
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-red-300 unified-text">Следующий кейс через: 18:45:23</span>
              </div>
              <button
                disabled
                className="w-full py-4 px-6 rounded-xl unified-button tracking-wide cursor-not-allowed opacity-50"
                style={{
                  background: 'linear-gradient(145deg, #666666, #444444)',
                  color: '#CCCCCC',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
              >
                ОЖИДАНИЕ...
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderShopCases = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {mockCaseShopItems.map((shopItem) => {
          const caseType = cases.find(c => c.id === shopItem.caseTypeId);
          if (!caseType) return null;

          const discountPrice = shopItem.discount 
            ? shopItem.price * (1 - shopItem.discount / 100)
            : shopItem.price;

          const formattedPrice = (Math.floor(discountPrice) / 1000).toFixed(3).replace('.', '.');

          return (
            <div 
              key={shopItem.id} 
              className="relative rounded-2xl p-3 border transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: theme === 'dark' 
                  ? 'linear-gradient(145deg, rgba(16, 20, 28, 0.95) 0%, rgba(22, 26, 34, 0.95) 100%)'
                  : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                border: `1px solid ${caseType.color}${theme === 'dark' ? '40' : '30'}`,
                boxShadow: theme === 'dark' 
                  ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                  : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              }}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div 
                  className="relative w-full h-28 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{ 
                    background: `linear-gradient(145deg, ${caseType.glowColor || caseType.color}15, ${caseType.glowColor || caseType.color}05)`,
                    boxShadow: `0 0 30px ${caseType.glowColor || caseType.color}40, inset 0 0 20px ${caseType.glowColor || caseType.color}20`
                  }}
                  onClick={() => handleShowCaseDetails(caseType, shopItem)}
                >
                  <ImageOrEmoji src={caseType.image} className="w-full h-full object-cover" />
                  <div 
                    className="absolute inset-0 rounded-xl border-2 opacity-60"
                    style={{ 
                      border: `2px solid ${caseType.glowColor || caseType.color}`,
                      boxShadow: `inset 0 0 20px ${caseType.glowColor || caseType.color}30`
                    }}
                  />
                  <div 
                    className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs unified-button"
                    style={{
                      background: `linear-gradient(90deg, ${caseType.color}80, ${caseType.color}60)`,
                      color: '#FFFFFF',
                      textShadow: '0 0 8px rgba(0,0,0,0.8)'
                    }}
                  >
                    GRITHER
                  </div>
                </div>
                
                <h4 
                  className="unified-heading tracking-wider"
                  style={{ 
                    color: theme === 'dark' ? '#FFFFFF' : '#0F172A', 
                    textShadow: theme === 'dark' 
                      ? `0 0 10px ${caseType.color}80` 
                      : `0 0 5px ${caseType.color}40`
                  }}
                >
                  {caseType.name}
                </h4>
                
                <div className="space-y-2">
                  <div 
                    className="px-3 py-1 rounded-lg unified-text"
                    style={{ 
                      background: `linear-gradient(90deg, ${caseType.color}${theme === 'dark' ? '20' : '15'}, transparent)`,
                      border: `1px solid ${caseType.color}${theme === 'dark' ? '40' : '30'}`,
                      color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    {formattedPrice}
                    <img src={coinImage} alt="G-coin" style={{ width: '14px', height: '14px' }} />
                  </div>
                </div>
                
                <button
                  onClick={() => handleBuyCase(shopItem)}
                  className="w-full py-2 px-3 rounded-xl unified-button tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-center"
                  style={{
                    background: shopItem.isAvailable 
                      ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                      : 'linear-gradient(145deg, #666666, #444444)',
                    color: shopItem.isAvailable ? '#1A1A1A' : '#CCCCCC',
                    boxShadow: shopItem.isAvailable 
                      ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                      : '0 4px 15px rgba(0, 0, 0, 0.2)',
                    textShadow: shopItem.isAvailable ? 'none' : '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                  disabled={!shopItem.isAvailable}
                >
                  {shopItem.isAvailable ? 'КУПИТЬ' : 'Н��ДОСТУПНО'}
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Добавляем товары магазина */}
        {localShopItems.map((item) => (
          <div 
            key={item.id} 
            className="relative rounded-2xl p-3 border transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: theme === 'dark' 
                ? 'linear-gradient(145deg, rgba(16, 20, 28, 0.95) 0%, rgba(22, 26, 34, 0.95) 100%)'
                : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              border: theme === 'dark' 
                ? '1px solid rgba(43, 130, 255, 0.4)'
                : '1px solid rgba(43, 130, 255, 0.3)',
              boxShadow: theme === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div 
                className="relative w-full h-28 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(145deg, rgba(43, 130, 255, 0.15), rgba(43, 130, 255, 0.05))',
                  boxShadow: '0 0 30px rgba(43, 130, 255, 0.4), inset 0 0 20px rgba(43, 130, 255, 0.2)'
                }}
              >
                <div className="text-4xl">{item.emoji}</div>
                <div 
                  className="absolute inset-0 rounded-xl border-2 opacity-60"
                  style={{ 
                    border: '2px solid #2B82FF',
                    boxShadow: 'inset 0 0 20px rgba(43, 130, 255, 0.3)'
                  }}
                />
                <div 
                  className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs unified-button"
                  style={{
                    background: 'linear-gradient(90deg, #2B82FF80, #2B82FF60)',
                    color: '#FFFFFF',
                    textShadow: '0 0 8px rgba(0,0,0,0.8)'
                  }}
                >
                  GRITHER
                </div>
              </div>
              
              <h4 
                className="unified-heading tracking-wider"
                style={{ 
                  color: theme === 'dark' ? '#FFFFFF' : '#0F172A', 
                  textShadow: theme === 'dark' 
                    ? '0 0 10px #2B82FF80' 
                    : '0 0 5px #2B82FF40'
                }}
              >
                {item.name}
              </h4>
              
              <div className="space-y-2">
                <div 
                  className="px-3 py-1 rounded-lg unified-text"
                  style={{ 
                    background: theme === 'dark' 
                      ? 'linear-gradient(90deg, #2B82FF20, transparent)'
                      : 'linear-gradient(90deg, #2B82FF15, transparent)',
                    border: theme === 'dark' 
                      ? '1px solid #2B82FF40'
                      : '1px solid #2B82FF30',
                    color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  {(item.price / 1000).toFixed(3).replace('.', '.')}
                  <img src={coinImage} alt="G-coin" style={{ width: '14px', height: '14px' }} />
                </div>
              </div>
              
              <button
                onClick={() => addToCart(item)}
                className="w-full py-2 px-3 rounded-xl unified-button tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center text-center"
                style={{
                  background: 'linear-gradient(145deg, #FFFFFF, #E0E0E0)',
                  color: '#1A1A1A',
                  boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  textShadow: 'none'
                }}
              >
                В КОРЗИНУ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUserCases = () => (
    <div className="space-y-6">
      {userCases.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-2 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="unified-text mb-2">Пусто</h4>
          <p className="unified-text text-muted-foreground opacity-60">
            Здесь появятся полученные кейсы
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {userCases.map((userCase) => {
            const caseType = cases.find(c => c.id === userCase.caseTypeId);
            if (!caseType) return null;

            return (
              <div 
                key={userCase.id} 
                className="relative rounded-2xl p-4 border transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: theme === 'dark' 
                    ? 'linear-gradient(145deg, rgba(16, 20, 28, 0.95) 0%, rgba(22, 26, 34, 0.95) 100%)'
                    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                  border: `1px solid ${caseType.color}${theme === 'dark' ? '40' : '30'}`,
                  boxShadow: theme === 'dark' 
                    ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div 
                    className="relative w-full h-24 rounded-xl overflow-hidden transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(145deg, ${caseType.glowColor || caseType.color}15, ${caseType.glowColor || caseType.color}05)`,
                      boxShadow: `0 0 25px ${caseType.glowColor || caseType.color}40, inset 0 0 15px ${caseType.glowColor || caseType.color}20`
                    }}
                  >
                    <ImageOrEmoji src={caseType.image} className="w-full h-full object-cover" />
                    <div 
                      className="absolute inset-0 rounded-xl border-2 opacity-60"
                      style={{ 
                        border: `2px solid ${caseType.glowColor || caseType.color}`,
                        boxShadow: `inset 0 0 15px ${caseType.glowColor || caseType.color}30`
                      }}
                    />
                    <div 
                      className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded unified-text"
                      style={{
                        background: `linear-gradient(90deg, ${caseType.glowColor || caseType.color}80, ${caseType.glowColor || caseType.color}60)`,
                        color: '#FFFFFF',
                        textShadow: '0 0 6px rgba(0,0,0,0.8)'
                      }}
                    >
                      GRITHER
                    </div>
                  </div>
                  
                  <h4 
                    className="unified-heading tracking-wider"
                    style={{ 
                      color: theme === 'dark' ? '#FFFFFF' : '#0F172A', 
                      textShadow: theme === 'dark' 
                        ? `0 0 8px ${caseType.color}80` 
                        : `0 0 4px ${caseType.color}40`
                    }}
                  >
                    {caseType.name}
                  </h4>
                  
                  <p 
                    className="unified-text opacity-70"
                    style={{ color: theme === 'dark' ? '#FFFFFF' : '#6B7280' }}
                  >
                    {userCase.obtainedAt.toLocaleDateString()}
                  </p>
                  
                  <button
                    onClick={() => handleOpenCase(userCase)}
                    className="w-full py-2.5 px-4 rounded-xl unified-button tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center text-center"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF, #E0E0E0)',
                      color: '#1A1A1A',
                      boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                      textShadow: 'none'
                    }}
                  >
                    ОТКРЫТЬ КЕЙС
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderCartModal = () => (
    <ModalOpaque
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      title="Корзина и заказы"
      theme={theme}
    >
      <div className="h-full flex flex-col">
        {/* Вкладки */}
        <div className="flex mb-6 p-1 rounded-xl" style={{
          background: theme === 'dark' ? '#1C2029' : '#F3F5F8'
        }}>
          {[
            { key: 'cart', label: 'Корзина', icon: ShoppingCart },
            { key: 'active', label: 'Активные', icon: Clock },
            { key: 'completed', label: 'Завершенные', icon: CheckCircle }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setCartTab(key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all unified-button ${
                cartTab === key ? 'white-button' : ''
              }`}
              style={{
                background: cartTab === key 
                  ? (theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#2B82FF')
                  : 'transparent',
                color: cartTab === key 
                  ? (theme === 'dark' ? '#1A1A1A' : '#FFFFFF')
                  : (theme === 'dark' ? '#A7B0BD' : '#6B7280')
              }}
            >
              <Icon style={{ width: '16px', height: '16px' }} />
              {label}
            </button>
          ))}
        </div>

        {/* Содержимое вкладок */}
        <div className="flex-1 overflow-y-auto">
          {cartTab === 'cart' && (
            <div className="space-y-4">
              {/* Товары из магазина */}
              <div className="space-y-3">
                <h4 className="unified-heading text-center" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                  GRITHER SHOP
                </h4>
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mb-4"></div>
                
                {localShopItems.filter(item => item.isActive).length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
                      background: theme === 'dark' ? '#1C2029' : '#F3F5F8'
                    }}>
                      <ShoppingBag style={{ width: '24px', height: '24px', color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} />
                    </div>
                    <p className="unified-text" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                      Товары скоро появятся
                    </p>
                  </div>
                ) : (
                  localShopItems.filter(item => item.isActive).map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-2xl border"
                    style={{
                      background: theme === 'dark' 
                        ? 'rgba(43, 130, 255, 0.1)' 
                        : 'rgba(43, 130, 255, 0.05)',
                      borderColor: theme === 'dark' 
                        ? 'rgba(43, 130, 255, 0.2)' 
                        : 'rgba(43, 130, 255, 0.15)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{item.emoji}</div>
                      <div>
                        <div className="unified-text" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                          {item.name}
                        </div>
                        <div className="unified-text flex items-center gap-1" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                          {item.price}
                          <img src={coinIcon} alt="G-coin" style={{ width: '12px', height: '12px' }} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {cart.find(cartItem => cartItem.id === item.id) ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const cartItem = cart.find(ci => ci.id === item.id);
                              if (cartItem) {
                                updateCartQuantity(item.id, cartItem.quantity - 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105"
                            style={{
                              background: theme === 'dark' ? '#1C2029' : '#F3F5F8',
                              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
                            }}
                          >
                            <Minus style={{ width: '12px', height: '12px', color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }} />
                          </button>
                          <span className="unified-text w-8 text-center" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                            {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                          </span>
                          <button
                            onClick={() => {
                              const cartItem = cart.find(ci => ci.id === item.id);
                              if (cartItem) {
                                updateCartQuantity(item.id, cartItem.quantity + 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105"
                            style={{
                              background: theme === 'dark' ? '#1C2029' : '#F3F5F8',
                              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF'
                            }}
                          >
                            <Plus style={{ width: '12px', height: '12px', color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 rounded-xl unified-button transition-all hover:scale-105"
                          style={{
                            background: theme === 'dark' 
                              ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                              : '#2B82FF',
                            color: theme === 'dark' ? '#1A1A1A' : '#FFFFFF'
                          }}
                        >
                          Добавить
                        </button>
                      )}
                    </div>
                  </div>
                  ))
                )}
              </div>

              {/* Итого и оформление заказа */}
              {cart.length > 0 && (
                <div className="border-t pt-4" style={{ borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="unified-heading" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                      Итого:
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="unified-heading" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                        {getCartTotal()}
                      </span>
                      <img src={coinIcon} alt="G-coin" style={{ width: '16px', height: '16px' }} />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={getCartTotal() > userBalance}
                    className="w-full py-3 px-6 rounded-xl unified-button transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: getCartTotal() > userBalance
                        ? 'linear-gradient(145deg, #666666, #444444)'
                        : (theme === 'dark' 
                          ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                          : '#2B82FF'),
                      color: getCartTotal() > userBalance
                        ? '#CCCCCC'
                        : (theme === 'dark' ? '#1A1A1A' : '#FFFFFF')
                    }}
                  >
                    {getCartTotal() > userBalance ? 'Недостаточно средств' : 'Оформить заказ'}
                  </button>
                </div>
              )}

              {cart.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
                    background: theme === 'dark' ? '#1C2029' : '#F3F5F8'
                  }}>
                    <ShoppingCart style={{ width: '24px', height: '24px', color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} />
                  </div>
                  <p className="unified-text" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                    Корзина пуста
                  </p>
                </div>
              )}
            </div>
          )}

          {cartTab === 'active' && (
            <div className="space-y-3">
              {orders.filter(order => order.status === 'pending').map((order) => (
                <div 
                  key={order.id}
                  className="p-4 rounded-2xl border"
                  style={{
                    background: theme === 'dark' 
                      ? 'rgba(255, 159, 10, 0.1)' 
                      : 'rgba(255, 159, 10, 0.05)',
                    borderColor: theme === 'dark' 
                      ? 'rgba(255, 159, 10, 0.2)' 
                      : 'rgba(255, 159, 10, 0.15)'
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="unified-text" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                      {order.items.length > 1 ? `${order.items.length} товаров` : order.items[0]?.name || 'Заказ'}
                    </div>
                    <div className="unified-text text-right" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-1 mb-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="unified-text flex items-center gap-2" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                          <span>{item.emoji}</span>
                          <span>{item.name} x{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="unified-text" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                            {item.price * item.quantity}
                          </span>
                          <img src={coinIcon} alt="G-coin" style={{ width: '12px', height: '12px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF' }}>
                    <div className="unified-text" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                      Итого:
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="unified-heading" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                        {order.total}
                      </span>
                      <img src={coinIcon} alt="G-coin" style={{ width: '16px', height: '16px' }} />
                    </div>
                  </div>
                </div>
              ))}
              
              {orders.filter(order => order.status === 'pending').length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
                    background: theme === 'dark' ? '#1C2029' : '#F3F5F8'
                  }}>
                    <Clock style={{ width: '24px', height: '24px', color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} />
                  </div>
                  <p className="unified-text" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                    Нет активных заказов
                  </p>
                </div>
              )}
            </div>
          )}

          {cartTab === 'completed' && (
            <div className="space-y-3">
              {orders.filter(order => order.status === 'completed' || order.status === 'cancelled' || order.status === 'rejected').map((order) => {
                const isApproved = order.status === 'completed';
                const isRejected = order.status === 'cancelled' || order.status === 'rejected';
                
                return (
                  <div 
                    key={order.id}
                    className="p-4 rounded-2xl border"
                    style={{
                      background: isApproved
                        ? (theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)')
                        : (theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'),
                      borderColor: isApproved
                        ? (theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)')
                        : (theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)')
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="unified-text" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                        {order.items.length > 1 ? `${order.items.length} товаров` : order.items[0]?.name || 'Заказ'}
                      </div>
                      <div className="unified-text text-right" style={{ 
                        color: isApproved ? '#22C55E' : '#EF4444' 
                      }}>
                        {isApproved ? 'Выполнен' : 'Отклонен'}
                      </div>
                    </div>
                    <div className="space-y-1 mb-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="unified-text flex items-center gap-2" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                            <span>{item.emoji}</span>
                            <span>{item.name} x{item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="unified-text" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                              {item.price * item.quantity}
                            </span>
                            <img src={coinIcon} alt="G-coin" style={{ width: '12px', height: '12px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF' }}>
                      <div className="unified-text" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                        Итого:
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="unified-heading" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                          {order.total}
                        </span>
                        <img src={coinIcon} alt="G-coin" style={{ width: '16px', height: '16px' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {orders.filter(order => order.status === 'completed' || order.status === 'cancelled' || order.status === 'rejected').length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
                    background: theme === 'dark' ? '#1C2029' : '#F3F5F8'
                  }}>
                    <CheckCircle style={{ width: '24px', height: '24px', color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} />
                  </div>
                  <p className="unified-text" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                    Нет завершенных заказов
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ModalOpaque>
  );

  return (
    <div 
      className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`} 
      style={{ 
        position: 'relative',
        background: theme === 'dark' ? '#0B0D10' : '#FFFFFF'
      }}
    >
      <div style={{ position: 'relative', zIndex: 10 }}>
        {renderHeader()}
      </div>
      
      <div className="container mx-auto px-4 pb-24 pt-20 space-y-8" style={{ position: 'relative', zIndex: 10 }}>
        {renderTabs()}
        
        {activeTab === 'free' && renderFreeCase()}
        {activeTab === 'shop' && renderShopCases()}
        {activeTab === 'my' && renderUserCases()}
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <BottomNavigation 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
          theme={theme}
        />
      </div>

      {/* Модалки для кейсов */}
      {isRouletteOpen && (
        <CaseRoulette
          isOpen={isRouletteOpen}
          onClose={handleCloseCaseRoulette}
          cases={cases}
          onResult={handleRouletteResult}
          onSpinComplete={handleSpinComplete}
          isSpinning={isSpinning}
          canSpin={canSpin}
          hasSpun={hasSpun}
          wonCase={wonCase}
          onStartSpin={handleStartSpin}
          onClaimReward={handleClaimCase}
          theme={theme}
        />
      )}

      {isPrizeRouletteOpen && openingCase && (
        <PrizeRoulette
          isOpen={isPrizeRouletteOpen}
          onClose={handleClosePrizeRoulette}
          caseType={cases.find(c => c.id === openingCase.caseTypeId)!}
          onResult={handlePrizeRouletteResult}
          onSpinComplete={handlePrizeSpinComplete}
          isSpinning={isSpinning}
          canSpin={canSpin}
          hasSpun={hasSpun}
          wonPrize={wonPrize}
          onStartSpin={handleStartPrizeSpin}
          onClaimReward={handleClaimPrize}
          theme={theme}
        />
      )}

      {/* Модалка корзины */}
      {renderCartModal()}

      {/* Модалка деталей кейса */}
      {caseDetailsOpen && selectedCaseForDetails && selectedShopItem && (
        <Modal 
          isOpen={caseDetailsOpen}
          onClose={() => setCaseDetailsOpen(false)}
          title={selectedCaseForDetails.name}
          theme={theme}
        >
          <div className="space-y-6">
            <div 
              className="relative w-full h-48 rounded-2xl overflow-hidden"
              style={{ 
                background: `linear-gradient(145deg, ${selectedCaseForDetails.glowColor || selectedCaseForDetails.color}15, ${selectedCaseForDetails.glowColor || selectedCaseForDetails.color}05)`,
                boxShadow: `0 0 30px ${selectedCaseForDetails.glowColor || selectedCaseForDetails.color}40, inset 0 0 20px ${selectedCaseForDetails.glowColor || selectedCaseForDetails.color}20`
              }}
            >
              <ImageOrEmoji src={selectedCaseForDetails.image} className="w-full h-full object-cover" />
              <div 
                className="absolute inset-0 rounded-2xl border-2 opacity-60"
                style={{ 
                  border: `2px solid ${selectedCaseForDetails.glowColor || selectedCaseForDetails.color}`,
                  boxShadow: `inset 0 0 20px ${selectedCaseForDetails.glowColor || selectedCaseForDetails.color}30`
                }}
              />
            </div>

            <div className="space-y-4">
              <h3 className="unified-heading text-center" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                Возможные призы:
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {selectedCaseForDetails.prizes.map((prize) => (
                  <div 
                    key={prize.id}
                    className="p-3 rounded-xl border"
                    style={{
                      background: theme === 'dark' ? '#1C2029' : '#F3F5F8',
                      borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'
                    }}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-2xl">{prize.image}</div>
                      <div className="unified-text" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                        {prize.name}
                      </div>
                      <div className="unified-text" style={{ color: prize.color }}>
                        {prize.rarity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div 
                  className="px-4 py-2 rounded-lg unified-text mb-4"
                  style={{ 
                    background: `linear-gradient(90deg, ${selectedCaseForDetails.color}${theme === 'dark' ? '20' : '15'}, transparent)`,
                    border: `1px solid ${selectedCaseForDetails.color}${theme === 'dark' ? '40' : '30'}`,
                    color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  Цена: {(Math.floor(selectedShopItem.price) / 1000).toFixed(3).replace('.', '.')}
                  <img src={coinImage} alt="G-coin" style={{ width: '14px', height: '14px' }} />
                </div>
                
                <button
                  onClick={() => handleBuyCase(selectedShopItem)}
                  className="w-full py-3 px-6 rounded-xl unified-button tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-center"
                  style={{
                    background: selectedShopItem.isAvailable 
                      ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                      : 'linear-gradient(145deg, #666666, #444444)',
                    color: selectedShopItem.isAvailable ? '#1A1A1A' : '#CCCCCC',
                    boxShadow: selectedShopItem.isAvailable 
                      ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                      : '0 4px 15px rgba(0, 0, 0, 0.2)',
                    textShadow: selectedShopItem.isAvailable ? 'none' : '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                  disabled={!selectedShopItem.isAvailable}
                >
                  {selectedShopItem.isAvailable ? 'КУПИТЬ КЕЙС' : 'НЕДОСТУПНО'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}