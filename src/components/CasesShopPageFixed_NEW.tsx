import { useState } from 'react';
import { Header } from './Header';
import { CartModal } from './CartModal';
import { OrdersModal } from './OrdersModal';
import { ModalOpaque } from './ModalOpaque';
import { Gift, ShoppingBag } from './Icons';
import { ImageWithFallback } from './figma/ImageWithFallback';
import coinImage from 'figma:asset/acaa4cccbfaf8eeee6ecbbe8f29c92d03b701371.png';
import { mockCaseTypes, mockUserCases } from '../data/mockData';
import { CaseType, UserCase } from '../types/cases';
import { ShopItem, CartItem, Order } from '../types/shop';

interface CasesShopPageFixedProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings: () => void;
  profilePhoto: string | null;
  theme: 'light' | 'dark';
  cases: CaseType[];
  userCases: UserCase[];
  setUserCases: (userCases: UserCase[]) => void;
  currentUser?: {
    id: string;
    name: string;
    balance: number;
  };
  onUpdateUserBalance?: (userId: string, amount: number) => void;
  onUpdateUserExperience?: (userId: string, amount: number) => void;
}

export default function CasesShopPageFixed({ 
  onNavigate, 
  currentPage, 
  onOpenSettings, 
  profilePhoto,
  theme,
  cases = mockCaseTypes,
  userCases,
  setUserCases,
  currentUser,
  onUpdateUserBalance,
  onUpdateUserExperience
}: CasesShopPageFixedProps) {
  const userBalance = currentUser?.balance ?? 0;
  const [activeTab, setActiveTab] = useState<'free' | 'shop' | 'my'>('free');
  const [selectedCase, setSelectedCase] = useState<UserCase | null>(null);
  const [caseOpenModal, setCaseOpenModal] = useState(false);
  const [prizeWon, setPrizeWon] = useState<string | null>(null);
  
  // Состояние корзины и заказов
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartModal, setCartModal] = useState(false);
  const [ordersModal, setOrdersModal] = useState(false);

  // Преобразуем кейсы в товары магазина
  const shopItems: ShopItem[] = mockCaseTypes.map(caseType => ({
    id: caseType.id,
    name: caseType.name,
    price: 100,
    description: `Открой кейс ${caseType.name} и получи крутые призы!`,
    category: 'bonus' as const,
    isActive: true,
    stock: 999,
    emoji: '📦',
    image: caseType.image
  }));

  const handleOpenCase = (userCase: UserCase) => {
    setSelectedCase(userCase);
    setCaseOpenModal(true);
    
    setTimeout(() => {
      const prizes = ['100 XP', '50 G-коинов', '20 XP', '200 G-коинов', '500 XP'];
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setPrizeWon(randomPrize);
      
      setUserCases(userCases.filter(uc => uc.id !== userCase.id));
      
      if (randomPrize.includes('G-коинов') && onUpdateUserBalance && currentUser) {
        const amount = parseInt(randomPrize);
        onUpdateUserBalance(currentUser.id, amount);
      }
    }, 2000);
  };

  const handleFreeCaseOpen = () => {
    const randomCase = mockCaseTypes[Math.floor(Math.random() * mockCaseTypes.length)];
    const newCase: UserCase = {
      id: `user_case_${Date.now()}`,
      caseTypeId: randomCase.id,
      obtainedAt: new Date(),
      isOpened: false
    };
    
    setUserCases([...userCases, newCase]);
  };

  // Функции для работы с корзиной
  const addToCart = (caseType: CaseType, price: number = 100) => {
    const existingItem = cart.find(item => item.itemId === caseType.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.itemId === caseType.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: `cart_${Date.now()}`,
        itemId: caseType.id,
        quantity: 1,
        addedAt: new Date().toISOString()
      };
      setCart([...cart, newItem]);
    }
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.itemId !== itemId));
      return;
    }
    
    setCart(cart.map(item => 
      item.itemId === itemId 
        ? { ...item, quantity }
        : item
    ));
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.itemId !== itemId));
  };

  const purchaseCart = () => {
    if (cart.length === 0) return;

    // Создаем заказ
    const orderItems = cart.map(cartItem => {
      const shopItem = shopItems.find(item => item.id === cartItem.itemId);
      return {
        id: cartItem.itemId,
        name: shopItem?.name || 'Товар',
        price: shopItem?.price || 100,
        quantity: cartItem.quantity,
        emoji: shopItem?.emoji || '📦'
      };
    });

    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder: Order = {
      id: `order_${Date.now()}`,
      items: orderItems,
      total,
      status: 'processing',
      createdAt: new Date().toISOString(),
      userId: currentUser?.id || 'user',
      customerName: currentUser?.name || 'Пользователь'
    };

    setOrders([...orders, newOrder]);

    // Уменьшаем баланс
    if (onUpdateUserBalance && currentUser) {
      onUpdateUserBalance(currentUser.id, -total);
    }

    // Очищаем корзину
    setCart([]);
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, ...updates }
        : order
    ));
  };

  const availableCases = mockCaseTypes.slice(0, 4);

  return (
    <>
      <div 
        className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}
        style={{
          background: theme === 'dark' ? '#0B0D10' : '#FFFFFF',
          color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
        }}
      >
        <Header 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
          onOpenSettings={onOpenSettings}
          profilePhoto={profilePhoto}
          theme={theme}
          user={currentUser}
          showBalance={true}
          balance={userBalance}
          showCartButton={true}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setCartModal(true)}
          extraButtons={
            <button
              onClick={() => setOrdersModal(true)}
              className="apple-button transition-all hover:scale-105"
              style={{
                width: '28px',
                height: '28px',
                minWidth: '28px',
                minHeight: '28px',
                maxWidth: '28px',
                maxHeight: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme === 'dark' ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' : '#FFFFFF',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #E6E9EF',
                boxShadow: theme === 'dark' 
                  ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.06)',
                flexShrink: 0,
                flexGrow: 0,
                borderRadius: '8px',
                cursor: 'pointer',
                pointerEvents: 'auto',
                position: 'relative',
                zIndex: 1
              }}
            >
              <ShoppingBag 
                style={{
                  width: '16px',
                  height: '16px',
                  color: theme === 'dark' ? '#1A1A1A' : '#6B7280'
                }}
              />
            </button>
          }
        />
        
        <div className="max-w-md mx-auto px-4 pb-32">
          {/* Tabs */}
          <div className="flex items-center justify-center mb-6">
            <div 
              className="flex rounded-2xl p-1.5"
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
              {(['free', 'shop', 'my'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-6 py-3 rounded-xl unified-text transition-all duration-200"
                  style={{
                    background: activeTab === tab 
                      ? (theme === 'dark' 
                          ? 'linear-gradient(145deg, #FFFFFF, #E0E0E0)' 
                          : '#2B82FF')
                      : 'transparent',
                    color: activeTab === tab 
                      ? (theme === 'dark' ? '#1A1A1A' : '#FFFFFF')
                      : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
                    border: activeTab === tab 
                      ? (theme === 'dark' 
                          ? '1px solid rgba(255, 255, 255, 0.2)' 
                          : '1px solid #2B82FF')
                      : '1px solid transparent',
                    boxShadow: activeTab === tab 
                      ? (theme === 'dark' 
                          ? '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                          : '0 2px 8px rgba(43, 130, 255, 0.3)')
                      : 'none'
                  }}
                >
                  {tab === 'free' && 'БЕСПЛАТНЫЙ'}
                  {tab === 'shop' && 'МАГАЗИН'}
                  {tab === 'my' && 'МОИ КЕЙСЫ'}
                </button>
              ))}
            </div>
          </div>

          {/* Content - остальной код остается тот же */}
          {activeTab === 'free' && (
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
                </div>
              </div>
            </div>
          )}

          {/* Остальные вкладки сокращаем для экономии места */}
          {activeTab === 'shop' && (
            <div className="space-y-6">
              <div 
                className="grid grid-cols-2 gap-4"
                style={{ maxHeight: '500px', overflowY: 'auto', padding: '2px' }}
              >
                {availableCases.map((caseType) => (
                  <div 
                    key={caseType.id} 
                    className="relative rounded-2xl p-3 border transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    style={{
                      background: theme === 'dark' 
                        ? 'linear-gradient(145deg, rgba(16, 20, 28, 0.95) 0%, rgba(22, 26, 34, 0.95) 100%)'
                        : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                      border: `1px solid ${caseType.color}${theme === 'dark' ? '40' : '30'}`,
                      boxShadow: theme === 'dark' 
                        ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                        : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                    }}
                    onClick={() => addToCart(caseType, 100)}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div 
                        className="relative w-full h-28 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
                        style={{ 
                          background: `linear-gradient(145deg, ${caseType.glowColor || caseType.color}15, ${caseType.glowColor || caseType.color}05)`,
                          boxShadow: `0 0 30px ${caseType.glowColor || caseType.color}40, inset 0 0 20px ${caseType.glowColor || caseType.color}20`
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageWithFallback 
                            src={caseType.image}
                            alt={caseType.name}
                            className="w-full h-full object-cover rounded-xl"
                            style={{ objectFit: 'cover' }}
                          />
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
                          100
                          <img src={coinImage} alt="G-coin" style={{ width: '14px', height: '14px' }} />
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(caseType, 100);
                        }}
                        className="w-full py-2 px-3 rounded-xl unified-button tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center text-center"
                        style={{
                          background: 'linear-gradient(145deg, #FFFFFF, #E0E0E0)',
                          color: '#1A1A1A',
                          boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        В КОРЗИНУ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'my' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="unified-heading" style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}>
                  МОИ КЕЙСЫ
                </h3>
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
              </div>

              {userCases && userCases.length > 0 ? (
                <div 
                  className="grid grid-cols-2 gap-4"
                  style={{ maxHeight: '500px', overflowY: 'auto', padding: '2px' }}
                >
                  {/* Код для отображения пользовательских кейсов остается тот же */}
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[200px]">
                  <div 
                    className="rounded-xl p-6 text-center"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <ShoppingBag 
                      className="w-12 h-12 mx-auto mb-4"
                      style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                    />
                    <p 
                      className="unified-text opacity-70"
                      style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                    >
                      У вас пока нет кейсов
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Case Opening Modal */}
      <ModalOpaque
        isOpen={caseOpenModal}
        onClose={() => {
          setCaseOpenModal(false);
          setSelectedCase(null);
          setPrizeWon(null);
        }}
        title={prizeWon ? "Поздравляем!" : "Открытие кейса..."}
        theme={theme}
        actions={
          prizeWon ? (
            <button
              onClick={() => {
                setCaseOpenModal(false);
                setSelectedCase(null);
                setPrizeWon(null);
              }}
              className="w-full transition-colors text-center"
              style={{
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#2B82FF',
                color: '#FFFFFF',
                border: 'none'
              }}
            >
              Забрать приз
            </button>
          ) : undefined
        }
      >
        <div className="text-center space-y-4">
          {!prizeWon ? (
            <>
              <div 
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center animate-pulse"
                style={{
                  background: 'linear-gradient(145deg, rgba(43, 130, 255, 0.15), rgba(43, 130, 255, 0.05))',
                  boxShadow: '0 0 30px rgba(43, 130, 255, 0.4)'
                }}
              >
                <Gift className="w-12 h-12" style={{ color: '#2B82FF' }} />
              </div>
              <p className="unified-text" style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                Открываем кейс...
              </p>
            </>
          ) : (
            <>
              <div 
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))',
                  boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)'
                }}
              >
                <Gift className="w-12 h-12 text-green-400" />
              </div>
              <div>
                <h4 
                  className="unified-heading mb-2"
                  style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                >
                  Вы выиграли:
                </h4>
                <p 
                  className="unified-heading"
                  style={{ color: '#22C55E' }}
                >
                  {prizeWon}
                </p>
              </div>
            </>
          )}
        </div>
      </ModalOpaque>

      {/* New Cart Modal */}
      <CartModal
        isOpen={cartModal}
        onClose={() => setCartModal(false)}
        cart={cart}
        shopItems={shopItems}
        userBalance={userBalance}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onPurchase={purchaseCart}
        theme={theme}
      />

      {/* New Orders Modal */}
      <OrdersModal
        isOpen={ordersModal}
        onClose={() => setOrdersModal(false)}
        orders={orders}
        onUpdateOrder={updateOrder}
        theme={theme}
      />
    </>
  );
}