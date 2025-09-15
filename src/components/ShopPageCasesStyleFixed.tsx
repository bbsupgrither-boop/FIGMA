import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Settings, Plus, Minus, X, CheckCircle, Clock } from './Icons';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { ShopItem, Order } from '../types/shop';
import { EmptyCard } from './EmptyCard';
import { ModalOpaque } from './ModalOpaque';
import { ImageWithFallback } from './figma/ImageWithFallback';
import coinIcon from 'figma:asset/29d513144bb95c08c031f3604ac2dd2e7bee6450.png';

interface ShopPageCasesStyleProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings: () => void;
  profilePhoto?: string | null;
  shopItems: ShopItem[];
  setShopItems: (items: ShopItem[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  theme?: 'light' | 'dark';
  currentUser?: import('../types/battles').User;
  onUpdateUserBalance?: (userId: string, amount: number) => void;
}

// Тип для товара в корзине
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export function ShopPageCasesStyleFixed({ 
  onNavigate, 
  currentPage, 
  onOpenSettings, 
  profilePhoto,
  shopItems,
  setShopItems,
  orders,
  setOrders,
  theme = 'light',
  currentUser,
  onUpdateUserBalance
}: ShopPageCasesStyleProps) {
  const userBalance = currentUser?.balance || 0;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartTab, setCartTab] = useState<'cart' | 'active' | 'completed'>('cart');
  const [isItemDetailsOpen, setIsItemDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

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

  // Функции для работы с корзиной
  const addToCart = (item: ShopItem) => {
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

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalCartPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  const checkout = () => {
    const totalPrice = getTotalCartPrice();
    if (userBalance >= totalPrice && cart.length > 0) {
      // Списываем деньги с баланса пользователя
      if (onUpdateUserBalance && currentUser) {
        onUpdateUserBalance(currentUser.id, -totalPrice);
      }
      
      // Создаем новый заказ со статусом "pending"
      const newOrder: Order = {
        id: Date.now().toString(),
        items: cart.map(cartItem => ({
          id: cartItem.id,
          name: cartItem.name,
          price: cartItem.price,
          quantity: cartItem.quantity,
          emoji: cartItem.emoji
        })),
        total: totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: 'current-user',
        customerName: currentUser?.name || 'Неизвестный пользователь',
        customerTeam: 'Frontend Team'
      };
      
      setOrders(prevOrders => [...prevOrders, newOrder]);
      
      // Уменьшаем количество товаров на складе
      setShopItems(prevItems => 
        prevItems.map(prevItem => {
          const cartItem = cart.find(c => c.id === prevItem.id);
          if (cartItem) {
            return { ...prevItem, stock: Math.max(0, prevItem.stock - cartItem.quantity) };
          }
          return prevItem;
        })
      );
      
      clearCart();
      setCartTab('active');
      
      console.log(`Заказ отправлен на модерацию на сумму ${totalPrice} коинов`);
    }
  };

  const handleShowItemDetails = (item: ShopItem) => {
    setSelectedItem(item);
    setIsItemDetailsOpen(true);
  };

  const handleBuyFromDetails = (item: ShopItem) => {
    if (userBalance >= item.price && item.stock > 0) {
      addToCart(item);
      setIsItemDetailsOpen(false);
    }
  };

  // Функция для получения цвета товара на основе категории или цены
  const getItemColor = (item: ShopItem) => {
    const category = item.category?.toLowerCase() || '';
    const price = item.price;
    
    if (category.includes('premium') || price > 5000) {
      return { color: '#8B5CF6', glowColor: '#8B5CF6', intensity: 'high' }; // Фиолетовый для премиум
    } else if (category.includes('special') || price > 2000) {
      return { color: '#F59E0B', glowColor: '#F59E0B', intensity: 'medium' }; // Золотой для особых
    } else if (category.includes('rare') || price > 1000) {
      return { color: '#06B6D4', glowColor: '#06B6D4', intensity: 'medium' }; // Голубой для редких
    } else if (category.includes('uncommon') || price > 500) {
      return { color: '#10B981', glowColor: '#10B981', intensity: 'low' }; // Зеленый для необычных
    } else {
      return { color: '#6B7280', glowColor: '#6B7280', intensity: 'low' }; // Серый для обычных
    }
  };

  const renderShop = () => (
    <div className="space-y-6">
      {/* Заголовок GRITHER SHOP */}
      <div className="text-center">
        <h3 
          className="text-2xl font-bold mb-2"
          style={{
            color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
          }}
        >
          GRITHER SHOP
        </h3>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
      </div>
      
      {shopItems.length === 0 ? (
        <div className="text-center py-12">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8',
            }}
          >
            <span className="text-2xl">🛒</span>
          </div>
          <h4 
            className="font-medium mb-2"
            style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
          >
            Магазин пуст
          </h4>
          <p 
            className="text-sm opacity-60"
            style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
          >
            Товары скоро появятся
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
          {shopItems.map((item) => {
            const itemStyle = getItemColor(item);
            
            // Форматируем цену без деления на 1000
            const formattedPrice = item.price.toLocaleString();

            return (
              <div 
                key={item.id} 
                className="relative rounded-2xl p-3 border transition-all duration-300 hover:scale-[1.02] w-full"
                style={{
                  background: theme === 'dark' 
                    ? `linear-gradient(145deg, rgba(16, 20, 28, 0.95) 0%, rgba(22, 26, 34, 0.95) 100%)`
                    : `linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)`,
                  border: `1px solid ${itemStyle.color}${theme === 'dark' ? '40' : '30'}`,
                  boxShadow: theme === 'dark' 
                    ? `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
                    : `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
                }}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Большое изображение товара с неоновым эффектом */}
                  <div 
                    className="relative w-full h-24 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                    style={{ 
                      background: `linear-gradient(145deg, ${itemStyle.glowColor}15, ${itemStyle.glowColor}05)`,
                      boxShadow: (() => {
                        const glowColor = itemStyle.glowColor;
                        const intensity = itemStyle.intensity;
                        
                        switch (intensity) {
                          case 'low':
                            return `0 0 15px ${glowColor}40, inset 0 0 10px ${glowColor}20`;
                          case 'medium':
                            return `0 0 30px ${glowColor}50, 0 0 60px ${glowColor}20, inset 0 0 20px ${glowColor}30`;
                          case 'high':
                            return `0 0 40px ${glowColor}80, 0 0 80px ${glowColor}40, 0 0 120px ${glowColor}20, inset 0 0 30px ${glowColor}40`;
                          default:
                            return `0 0 30px ${glowColor}40, inset 0 0 20px ${glowColor}20`;
                        }
                      })()
                    }}
                    onClick={() => handleShowItemDetails(item)}
                  >
                    <ImageOrEmoji
                      src={item.image || item.emoji}
                      className="w-full h-full object-cover"
                    />
                    {/* Неоновая рамка */}
                    <div 
                      className="absolute inset-0 rounded-xl border-2 opacity-60"
                      style={{ 
                        border: `2px solid ${itemStyle.glowColor}`,
                        boxShadow: (() => {
                          const glowColor = itemStyle.glowColor;
                          const intensity = itemStyle.intensity;
                          
                          switch (intensity) {
                            case 'low':
                              return `inset 0 0 15px ${glowColor}30`;
                            case 'medium':
                              return `inset 0 0 25px ${glowColor}40, inset 0 0 50px ${glowColor}20`;
                            case 'high':
                              return `inset 0 0 35px ${glowColor}50, inset 0 0 70px ${glowColor}30, inset 0 0 100px ${glowColor}10`;
                            default:
                              return `inset 0 0 20px ${glowColor}30`;
                          }
                        })()
                      }}
                    />
                    {/* GRITHER логотип на изображении */}
                    <div 
                      className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{
                        background: `linear-gradient(90deg, ${itemStyle.color}80, ${itemStyle.color}60)`,
                        color: '#FFFFFF',
                        textShadow: '0 0 6px rgba(0,0,0,0.8)',
                        fontSize: '9px'
                      }}
                    >
                      GRITHER
                    </div>
                  </div>
                  
                  {/* Название товара */}
                  <h4 
                    className="text-sm font-bold tracking-wider"
                    style={{ 
                      color: theme === 'dark' ? '#FFFFFF' : '#0F172A', 
                      textShadow: theme === 'dark' 
                        ? `0 0 10px ${itemStyle.color}80` 
                        : `0 0 5px ${itemStyle.color}40`
                    }}
                  >
                    {item.name.toUpperCase()}
                  </h4>
                  
                  {/* Цена с монеткой */}
                  <div 
                    className="px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 justify-center"
                    style={{ 
                      background: `linear-gradient(90deg, ${itemStyle.color}${theme === 'dark' ? '20' : '15'}, transparent)`,
                      border: `1px solid ${itemStyle.color}${theme === 'dark' ? '40' : '30'}`,
                      color: theme === 'dark' ? '#FFFFFF' : '#0F172A'
                    }}
                  >
                    {formattedPrice}
                    <img 
                      src={coinIcon} 
                      alt="coins" 
                      className="w-3 h-3"
                    />
                  </div>
                  
                  {/* Кнопка покупки в стиле GRITHER */}
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full py-1.5 px-2 rounded-lg font-bold text-xs tracking-wide transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-center"
                    style={{
                      background: (item.stock > 0 && userBalance >= item.price) 
                        ? `linear-gradient(145deg, #FFFFFF, #E0E0E0)` 
                        : `linear-gradient(145deg, #666666, #444444)`,
                      color: (item.stock > 0 && userBalance >= item.price) ? '#1A1A1A' : '#CCCCCC',
                      boxShadow: (item.stock > 0 && userBalance >= item.price)
                        ? `0 4px 15px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)` 
                        : `0 4px 15px rgba(0, 0, 0, 0.2)`,
                      textShadow: (item.stock > 0 && userBalance >= item.price) ? 'none' : '0 1px 2px rgba(0,0,0,0.5)',
                      height: '32px',
                      minHeight: '32px',
                      lineHeight: '1.2'
                    }}
                    disabled={item.stock <= 0 || userBalance < item.price}
                  >
                    {item.stock <= 0 ? 'НЕТ В НАЛИЧИИ' : 
                     userBalance < item.price ? 'НЕДОСТАТОЧНО СРЕДСТВ' : 'КУПИТЬ'}
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
    <div 
      className="min-h-screen"
      style={{
        background: theme === 'dark' 
          ? `radial-gradient(circle at center top, rgba(16, 20, 28, 1) 0%, rgba(11, 13, 16, 1) 100%)`
          : `linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)`,
        color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
      }}
    >
      {/* Шапка */}
      <Header 
        onNavigate={onNavigate}
        currentPage={currentPage}
        onOpenSettings={onOpenSettings} 
        profilePhoto={profilePhoto}
        theme={theme}
        user={currentUser ? {
          id: currentUser.id,
          name: currentUser.name, 
          username: currentUser.name, 
          avatar: '',
          role: 'user',
          level: currentUser.level,
          experience: 0,
          maxExperience: 100,
          balance: currentUser.balance,
          rating: currentUser.rating,
          completedTasks: 0,
          achievementsCount: 0,
          battlesWon: 0,
          battlesLost: 0,
          isOnline: currentUser.isOnline,
          lastSeen: new Date(),
          joinedDate: new Date()
        } : undefined}
      />
      
      <div className="max-w-md mx-auto px-4 pb-32 relative">
        {/* Основной контент с магазином */}
        {/* Баланс и корзина в шапке */}
        <div className="flex items-center justify-between mb-6">
          {/* Баланс */}
          <div 
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8',
            }}
          >
            <div 
              className="text-xs mb-1"
              style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
            >
              Баланс
            </div>
            <div className="flex items-center gap-1">
              <span 
                className="text-sm font-medium"
                style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
              >
                {userBalance.toLocaleString()}
              </span>
              <img 
                src={coinIcon} 
                alt="coins" 
                className="w-4 h-4"
              />
            </div>
          </div>
          
          {/* Корзина */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative apple-button hover:scale-95 transition-transform"
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShoppingCart style={{ width: '18px', height: '18px', color: theme === 'dark' ? '#1A1A1A' : '#6B7280' }} />
            {getTotalCartItems() > 0 && (
              <div 
                className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                style={{ backgroundColor: '#ff3b30', fontSize: '10px' }}
              >
                {getTotalCartItems()}
              </div>
            )}
          </button>
        </div>

        {/* Магазин */}
        {renderShop()}
      </div>

      {/* Нижняя навигация */}
      <BottomNavigation 
        onNavigate={onNavigate} 
        currentPage={currentPage}
        theme={theme}
      />

      {/* Модальное окно корзины */}
      <ModalOpaque
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title="Корзина"
        theme={theme}
      >
        <div className="space-y-4">
          {/* Табы корзины */}
          <div className="flex space-x-2">
            {[
              { key: 'cart', label: 'Корзина', count: getTotalCartItems() },
              { key: 'active', label: 'Активные', count: orders.filter(o => o.status === 'pending').length },
              { key: 'completed', label: 'Завершенные', count: orders.filter(o => o.status === 'completed').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCartTab(tab.key as typeof cartTab)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors relative ${
                  cartTab === tab.key ? 'font-medium' : ''
                }`}
                style={{
                  backgroundColor: cartTab === tab.key 
                    ? (theme === 'dark' ? '#2B82FF' : '#2B82FF')
                    : (theme === 'dark' ? '#1C2029' : '#F3F5F8'),
                  color: cartTab === tab.key 
                    ? '#FFFFFF' 
                    : (theme === 'dark' ? '#A7B0BD' : '#6B7280')
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ fontSize: '10px' }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Содержимое табов */}
          {cartTab === 'cart' && (
            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart 
                    className="w-12 h-12 mx-auto mb-4 opacity-50"
                    style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                  />
                  <p style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                    Корзина пуста
                  </p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8'
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.emoji}</span>
                        <div>
                          <p 
                            className="font-medium text-sm"
                            style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                          >
                            {item.name}
                          </p>
                          <p 
                            className="text-xs"
                            style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                          >
                            {item.price.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: theme === 'dark' ? '#202734' : '#E5E7EB'
                          }}
                        >
                          <Minus style={{ width: '12px', height: '12px', color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} />
                        </button>
                        <span 
                          className="text-sm font-medium w-8 text-center"
                          style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: theme === 'dark' ? '#202734' : '#E5E7EB'
                          }}
                        >
                          <Plus style={{ width: '12px', height: '12px', color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 w-6 h-6 rounded-full flex items-center justify-center text-red-500"
                          style={{
                            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                          }}
                        >
                          <X style={{ width: '12px', height: '12px' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Итого и кнопка оформления */}
                  <div 
                    className="border-t pt-4"
                    style={{ 
                      borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'
                    }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span 
                        className="font-medium"
                        style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                      >
                        Итого:
                      </span>
                      <div className="flex items-center gap-1">
                        <span 
                          className="font-medium"
                          style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                        >
                          {getTotalCartPrice().toLocaleString()}
                        </span>
                        <img 
                          src={coinIcon} 
                          alt="coins" 
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                    <button
                      onClick={checkout}
                      disabled={userBalance < getTotalCartPrice()}
                      className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: userBalance >= getTotalCartPrice() ? '#2B82FF' : '#6B7280',
                        color: '#FFFFFF'
                      }}
                    >
                      {userBalance >= getTotalCartPrice() ? 'Оформить заказ' : 'Недостаточно средств'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {cartTab === 'active' && (
            <div className="space-y-3">
              {orders.filter(order => order.status === 'pending').length === 0 ? (
                <div className="text-center py-8">
                  <Clock 
                    className="w-12 h-12 mx-auto mb-4 opacity-50"
                    style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                  />
                  <p style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                    Нет активных заказов
                  </p>
                </div>
              ) : (
                orders.filter(order => order.status === 'pending').map((order) => (
                  <div 
                    key={order.id}
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="text-sm font-medium"
                        style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                      >
                        Заказ #{order.id.slice(-4)}
                      </span>
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: 'rgba(251, 191, 36, 0.1)',
                          color: '#F59E0B'
                        }}
                      >
                        Ожидает
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-xs"
                        style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                      >
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <span 
                          className="text-sm font-medium"
                          style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                        >
                          {order.total.toLocaleString()}
                        </span>
                        <img 
                          src={coinIcon} 
                          alt="coins" 
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {cartTab === 'completed' && (
            <div className="space-y-3">
              {orders.filter(order => order.status === 'completed').length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle 
                    className="w-12 h-12 mx-auto mb-4 opacity-50"
                    style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                  />
                  <p style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                    Нет завершенных заказов
                  </p>
                </div>
              ) : (
                orders.filter(order => order.status === 'completed').map((order) => (
                  <div 
                    key={order.id}
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="text-sm font-medium"
                        style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                      >
                        Заказ #{order.id.slice(-4)}
                      </span>
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          color: '#22C55E'
                        }}
                      >
                        Выполнен
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-xs"
                        style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                      >
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <span 
                          className="text-sm font-medium"
                          style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                        >
                          {order.total.toLocaleString()}
                        </span>
                        <img 
                          src={coinIcon} 
                          alt="coins" 
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </ModalOpaque>

      {/* Модальное окно деталей товара */}
      <ModalOpaque
        isOpen={isItemDetailsOpen}
        onClose={() => setIsItemDetailsOpen(false)}
        title={selectedItem ? selectedItem.name : "Детали товара"}
        theme={theme}
        actions={
          selectedItem && selectedItem.stock > 0 && userBalance >= selectedItem.price ? (
            <button
              onClick={() => selectedItem && handleBuyFromDetails(selectedItem)}
              className="w-full transition-colors flex items-center justify-center gap-1"
              style={{
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                border: 'none',
                fontWeight: '600'
              }}
            >
              Купить за {selectedItem.price.toLocaleString()}
              <img 
                src={coinIcon} 
                alt="coins" 
                className="w-4 h-4"
              />
            </button>
          ) : selectedItem && selectedItem.stock <= 0 ? (
            <button
              disabled
              className="w-full transition-colors text-center"
              style={{
                height: '44px',
                borderRadius: '12px',
                backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF',
                cursor: 'not-allowed'
              }}
            >
              Нет в наличии
            </button>
          ) : selectedItem && userBalance < selectedItem.price ? (
            <button
              disabled
              className="w-full transition-colors text-center"
              style={{
                height: '44px',
                borderRadius: '12px',
                backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280',
                border: theme === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.06)' 
                  : '1px solid #E6E9EF',
                cursor: 'not-allowed'
              }}
            >
              Недостаточно средств
            </button>
          ) : undefined
        }
      >
        {selectedItem && (
          <div className="space-y-4">
            {/* Иконка или изображение товара */}
            <div className="flex justify-center">
              <div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
                style={{
                  backgroundColor: theme === 'dark' ? '#1C2029' : '#F3F5F8',
                }}
              >
                {selectedItem.image ? (
                  <ImageWithFallback 
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                    fallback={<span className="text-4xl">{selectedItem.emoji}</span>}
                  />
                ) : (
                  <span className="text-4xl">{selectedItem.emoji}</span>
                )}
              </div>
            </div>

            {/* Категория */}
            <div className="text-center">
              <span 
                className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: theme === 'dark' ? '#2B82FF20' : '#2B82FF20',
                  color: '#2B82FF'
                }}
              >
                {selectedItem.category}
              </span>
            </div>

            {/* Описание */}
            <div className="text-center space-y-2">
              <p 
                className="text-sm leading-relaxed"
                style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
              >
                {selectedItem.description}
              </p>
            </div>

            {/* Информация о наличии и цене */}
            <div 
              className="p-4 rounded-xl space-y-2"
              style={{
                backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8'
              }}
            >
              <div className="flex justify-between text-sm">
                <span style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                  Цена:
                </span>
                <span 
                  className="font-medium"
                  style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                >
                  <div className="flex items-center gap-1">
                    <span>{selectedItem.price.toLocaleString()}</span>
                    <img 
                      src={coinIcon} 
                      alt="coins" 
                      className="w-4 h-4"
                    />
                  </div>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}>
                  В наличии:
                </span>
                <span 
                  className="font-medium"
                  style={{ color: theme === 'dark' ? '#E8ECF2' : '#0F172A' }}
                >
                  {selectedItem.stock === -1 ? 'Неограниченно' : `${selectedItem.stock} шт.`}
                </span>
              </div>
            </div>
          </div>
        )}
      </ModalOpaque>
    </div>
  );
}