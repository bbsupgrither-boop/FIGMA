import { useState } from 'react';
import { motion } from 'motion/react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { CaseRoulette } from './CaseRoulette';
import { PrizeRoulette } from './PrizeRoulette';
import { Modal } from './Modal';
import { CaseType, UserCase, CaseShopItem, RouletteResult, PrizeRouletteResult, Prize } from '../types/cases';
import { mockCaseTypes, mockUserCases, mockCaseShopItems } from '../data/mockData';
import { Gift, ShoppingBag, Clock, Coins, Gem } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import coinImage from 'figma:asset/acaa4cccbfaf8eeee6ecbbe8f29c92d03b701371.png';

interface CasesPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings: () => void;
  profilePhoto: string | null;
  theme: 'light' | 'dark';
  cases: CaseType[];
  setCases: (cases: CaseType[]) => void;
  userCases: UserCase[];
  setUserCases: (userCases: UserCase[]) => void;
  currentUser?: {
    id: string;
    name: string;
    balance: number;
    level?: number;
    experience?: number;
  };
  onUpdateUserBalance?: (userId: string, amount: number) => void;
  onUpdateUserExperience?: (userId: string, amount: number) => void;
}

export function CasesPageFixed({ 
  onNavigate, 
  currentPage, 
  onOpenSettings, 
  profilePhoto,
  theme,
  cases,
  setCases,
  userCases,
  setUserCases,
  currentUser,
  onUpdateUserBalance,
  onUpdateUserExperience
}: CasesPageProps) {
  const [activeTab, setActiveTab] = useState<'free' | 'shop' | 'inventory'>('free');
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
      return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:');
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
        <span className="text-xl">{src}</span>
      </div>
    );
  };

  // Проверяем доступность бесплатного кейса (для тестирования всегда доступен)
  const isFreeAvailable = true;

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
        console.log(`Зачислено ${wonPrize.value} монет пользователю ${currentUser.name}`);
      } else if (wonPrize.type === 'experience' && onUpdateUserExperience) {
        onUpdateUserExperience(currentUser.id, wonPrize.value);
        console.log(`Зачислено ${wonPrize.value} опыта пользователю ${currentUser.name}`);
      } else if (!wonPrize.type) {
        if (wonPrize.name.toLowerCase().includes('монет') || wonPrize.name.toLowerCase().includes('coins') || wonPrize.name.toLowerCase().includes('g-coin')) {
          if (onUpdateUserBalance) {
            onUpdateUserBalance(currentUser.id, wonPrize.value);
            console.log(`Зачислено ${wonPrize.value} монет пользователю ${currentUser.name} (определено по названию)`);
          }
        } else if (wonPrize.name.toLowerCase().includes('опыт') || wonPrize.name.toLowerCase().includes('exp') || wonPrize.name.toLowerCase().includes('experience')) {
          if (onUpdateUserExperience) {
            onUpdateUserExperience(currentUser.id, wonPrize.value);
            console.log(`Зачислено ${wonPrize.value} опыта пользователю ${currentUser.name} (определено по названию)`);
          }
        }
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
    setActiveTab('inventory');
  };

  // ============== НАВИГАЦИОННЫЕ КНОПКИ (ФИКСИРОВАННЫЙ СТИЛЬ) ==============
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
          onClick={() => setActiveTab('inventory')}
          className="px-6 py-3 rounded-xl unified-text transition-all duration-200 tab-button"
          style={{
            background: activeTab === 'inventory' 
              ? (theme === 'dark' 
                  ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                  : '#2B82FF')
              : 'transparent',
            color: activeTab === 'inventory' 
              ? (theme === 'dark' ? '#1A1A1A' : '#FFFFFF')
              : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
            border: activeTab === 'inventory' 
              ? (theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.2)' 
                  : '1px solid #2B82FF')
              : '1px solid transparent',
            boxShadow: activeTab === 'inventory' 
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

  const renderFreeCase = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 
          className="text-2xl font-bold mb-2"
          style={{
            color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
          }}
        >
          БЕСПЛАТНЫЙ КЕЙС
        </h3>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto"></div>
      </div>

      <div 
        className="rounded-2xl p-6 border"
        style={{
          background: theme === 'dark' 
            ? `linear-gradient(145deg, rgba(16, 20, 28, 0.95) 0%, rgba(22, 26, 34, 0.95) 100%)`
            : `linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)`,
          border: theme === 'dark' 
            ? '1px solid rgba(34, 197, 94, 0.4)'
            : '1px solid rgba(34, 197, 94, 0.3)',
          boxShadow: theme === 'dark' 
            ? `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
            : `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
        }}
      >
        <div className="text-center space-y-6">
          <div 
            className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(145deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))`,
              boxShadow: `0 0 30px rgba(34, 197, 94, 0.4), inset 0 0 20px rgba(34, 197, 94, 0.2)`
            }}
          >
            <Gift className="w-16 h-16 text-green-400" style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))' }} />
          </div>
          
          <div>
            <h4 
              className="text-xl font-bold mb-3" 
              style={{ 
                color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
                textShadow: theme === 'dark' ? '0 0 10px rgba(34, 197, 94, 0.8)' : '0 0 5px rgba(34, 197, 94, 0.3)'
              }}
            >
              БЕСПЛАТНЫЙ КЕЙС GRITHER
            </h4>
            <p 
              className="text-sm opacity-80"
              style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}
            >
              Получите случайный кейс совершенно бесплатно каждые 24 часа!
            </p>
          </div>
          
          {isFreeAvailable ? (
            <button
              onClick={handleFreeCaseOpen}
              className="w-full py-4 px-6 rounded-xl font-bold tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center text-center"
              style={{
                background: `linear-gradient(145deg, #22C55E, #16A34A)`,
                color: '#FFFFFF',
                boxShadow: `0 4px 20px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
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
                <span className="text-red-300 text-sm font-medium">Следующий кейс через: 18:45:23</span>
              </div>
              <button
                disabled
                className="w-full py-4 px-6 rounded-xl font-bold tracking-wide cursor-not-allowed opacity-50"
                style={{
                  background: `linear-gradient(145deg, #666666, #444444)`,
                  color: '#CCCCCC',
                  boxShadow: `0 4px 15px rgba(0, 0, 0, 0.2)`
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

  const renderShop = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 
          className="text-2xl font-bold mb-2"
          style={{
            color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
          }}
        >
          GRITHER CASES
        </h3>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
      </div>
      
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
                  ? `linear-gradient(145deg, rgba(16, 20, 28, 0.95) 0%, rgba(22, 26, 34, 0.95) 100%)`
                  : `linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)`,
                border: `1px solid ${caseType.color}${theme === 'dark' ? '40' : '30'}`,
                boxShadow: theme === 'dark' 
                  ? `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
                  : `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
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
                  <ImageOrEmoji
                    src={caseType.image}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0 rounded-xl border-2 opacity-60"
                    style={{ 
                      border: `2px solid ${caseType.glowColor || caseType.color}`,
                      boxShadow: `inset 0 0 20px ${caseType.glowColor || caseType.color}30`
                    }}
                  />
                  <div 
                    className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-bold"
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
                  className="text-lg font-bold tracking-wider"
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
                    className="px-3 py-1 rounded-lg text-sm font-medium"
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
                    <img 
                      src={coinImage} 
                      alt="G-coin" 
                      style={{ width: '14px', height: '14px' }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => handleBuyCase(shopItem)}
                  className="w-full py-2 px-3 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-center"
                  style={{
                    background: shopItem.isAvailable 
                      ? `linear-gradient(145deg, #FFFFFF, #E0E0E0)` 
                      : `linear-gradient(145deg, #666666, #444444)`,
                    color: shopItem.isAvailable ? '#1A1A1A' : '#CCCCCC',
                    boxShadow: shopItem.isAvailable 
                      ? `0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)` 
                      : `0 4px 15px rgba(0, 0, 0, 0.2)`,
                    textShadow: shopItem.isAvailable ? 'none' : '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                  disabled={!shopItem.isAvailable}
                >
                  {shopItem.isAvailable ? 'КУПИТЬ' : 'НЕДОСТУПНО'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 
          className="text-2xl font-bold mb-2"
          style={{
            color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
          }}
        >
          МОИ КЕЙСЫ
        </h3>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
      </div>
      
      {userCases.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-2 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="font-medium mb-2">Пусто</h4>
          <p className="text-sm text-muted-foreground opacity-60">
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
                    ? `linear-gradient(145deg, rgba(16, 20, 28, 0.95) 0%, rgba(22, 26, 34, 0.95) 100%)`
                    : `linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)`,
                  border: `1px solid ${caseType.color}${theme === 'dark' ? '40' : '30'}`,
                  boxShadow: theme === 'dark' 
                    ? `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
                    : `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
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
                    <ImageOrEmoji
                      src={caseType.image}
                      className="w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 rounded-xl border-2 opacity-60"
                      style={{ 
                        border: `2px solid ${caseType.glowColor || caseType.color}`,
                        boxShadow: `inset 0 0 15px ${caseType.glowColor || caseType.color}30`
                      }}
                    />
                    <div 
                      className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold"
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
                    className="text-lg font-bold tracking-wider"
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
                    className="text-xs opacity-70"
                    style={{ color: theme === 'dark' ? '#FFFFFF' : '#6B7280' }}
                  >
                    {userCase.obtainedAt.toLocaleDateString()}
                  </p>
                  
                  <button
                    onClick={() => handleOpenCase(userCase)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center text-center"
                    style={{
                      background: `linear-gradient(145deg, #FFFFFF, #E0E0E0)`,
                      color: '#1A1A1A',
                      boxShadow: `0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
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

  return (
    <>
      <Header 
        onNavigate={onNavigate} 
        currentPage={currentPage} 
        onOpenSettings={onOpenSettings}
        profilePhoto={profilePhoto}
        theme={theme}
      />
      
      <div className="min-h-screen pt-20 pb-24 px-4">
        <div className="max-w-md mx-auto">
          {renderTabs()}
          
          {activeTab === 'free' && renderFreeCase()}
          {activeTab === 'shop' && renderShop()}
          {activeTab === 'inventory' && renderInventory()}
        </div>
      </div>

      {/* Case Roulette Modal */}
      {isRouletteOpen && (
        <CaseRoulette
          isOpen={isRouletteOpen}
          onClose={handleCloseCaseRoulette}
          cases={cases}
          onResult={handleRouletteResult}
          onSpinComplete={handleSpinComplete}
          canSpin={canSpin}
          onStartSpin={handleStartSpin}
          isSpinning={isSpinning}
          hasSpun={hasSpun}
          wonCase={wonCase}
          onClaimCase={handleClaimCase}
          theme={theme}
        />
      )}

      {/* Prize Roulette Modal */}
      {isPrizeRouletteOpen && openingCase && (
        <PrizeRoulette
          isOpen={isPrizeRouletteOpen}
          onClose={handleClosePrizeRoulette}
          caseType={cases.find(c => c.id === openingCase.caseTypeId) || mockCaseTypes[0]}
          onResult={handlePrizeRouletteResult}
          onSpinComplete={handlePrizeSpinComplete}
          canSpin={canSpin}
          onStartSpin={handleStartPrizeSpin}
          isSpinning={isSpinning}
          hasSpun={hasSpun}
          wonPrize={wonPrize}
          onClaimPrize={handleClaimPrize}
          theme={theme}
        />
      )}

      {/* Case Details Modal */}
      {caseDetailsOpen && selectedCaseForDetails && selectedShopItem && (
        <Modal
          isOpen={caseDetailsOpen}
          onClose={() => setCaseDetailsOpen(false)}
          theme={theme}
        >
          <div className="p-6 text-center space-y-6">
            <div 
              className="w-48 h-48 mx-auto rounded-2xl overflow-hidden"
              style={{ 
                background: `linear-gradient(145deg, ${selectedCaseForDetails.glowColor || selectedCaseForDetails.color}15, ${selectedCaseForDetails.glowColor || selectedCaseForDetails.color}05)`,
                boxShadow: `0 0 30px ${selectedCaseForDetails.glowColor || selectedCaseForDetails.color}40, inset 0 0 20px ${selectedCaseForDetails.glowColor || selectedCaseForDetails.color}20`
              }}
            >
              <ImageOrEmoji
                src={selectedCaseForDetails.image}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: theme === 'dark' ? '#FFFFFF' : '#0F172A' }}>
                {selectedCaseForDetails.name}
              </h3>
              <p className="text-sm opacity-80" style={{ color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}>
                {selectedCaseForDetails.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-sm" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                Возможные призы:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {selectedCaseForDetails.prizes.map((prize, index) => (
                  <div 
                    key={index}
                    className="p-2 rounded-lg border text-xs"
                    style={{
                      background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
                    }}
                  >
                    {prize.name} - {prize.value}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleBuyCase(selectedShopItem)}
              className="w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 transform hover:scale-105"
              style={{
                background: selectedShopItem.isAvailable 
                  ? `linear-gradient(145deg, #FFFFFF, #E0E0E0)` 
                  : `linear-gradient(145deg, #666666, #444444)`,
                color: selectedShopItem.isAvailable ? '#1A1A1A' : '#CCCCCC',
                boxShadow: selectedShopItem.isAvailable 
                  ? `0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)` 
                  : `0 4px 15px rgba(0, 0, 0, 0.2)`
              }}
              disabled={!selectedShopItem.isAvailable}
            >
              {selectedShopItem.isAvailable ? 'КУПИТЬ КЕЙС' : 'НЕДОСТУПНО'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}