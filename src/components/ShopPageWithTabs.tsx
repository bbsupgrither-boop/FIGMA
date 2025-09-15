import { useState } from 'react';
import { ShoppingCart, Package, Gamepad2, Gift, Star, Clock, Users, Play, DollarSign, CircleDot, Scissors, Plus, Minus, X, CheckCircle } from './Icons';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { ShopItem, Order } from '../types/shop';

interface ShopPageWithTabsProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings: () => void;
  profilePhoto?: string | null;
  shopItems: ShopItem[];
  setShopItems: (items: ShopItem[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

// Моки данных для игр и кейсов
const gamesData = [
  {
    id: '1',
    name: 'Колесо удачи',
    description: 'Крутите колесо и получайте случайные награды каждые 5 минут',
    type: 'wheel',
    icon: '🎰',
    cooldown: '5м',
    stats: { plays: 1254, rewards: 45680, players: 387 },
    status: 'available'
  },
  {
    id: '2',
    name: 'Битва выбора',
    description: 'Классическая игра камень-ножницы-бумага против умного бота',
    type: 'rps',
    icon: '✂️',
    cooldown: '3м',
    stats: { plays: 892, rewards: 15430, players: 234 },
    status: 'available'
  },
  {
    id: '3',
    name: 'Золотые слоты',
    description: 'Автомат с тремя барабанами и шансом на джекпот',
    type: 'slots',
    icon: '🎰',
    cooldown: '10м',
    stats: { plays: 1567, rewards: 78900, players: 456 },
    status: 'available'
  }
];

const casesData = [
  {
    id: '1',
    name: 'Стартовый кейс',
    description: 'Базовые награды для новичков',
    price: 100,
    currency: 'coins',
    rarity: 'common',
    icon: '📦',
    rewards: ['10-50 монет', '5-20 XP', 'Базовые предметы'],
    dropRate: '100%'
  },
  {
    id: '2',
    name: 'Золотой кейс',
    description: 'Ценные награды и редкие предметы',
    price: 500,
    currency: 'coins',
    rarity: 'rare',
    icon: '🏆',
    rewards: ['100-500 монет', '50-200 XP', 'Редкие предметы', 'Премиум бонусы'],
    dropRate: '25%'
  },
  {
    id: '3',
    name: 'Легендарный кейс',
    description: 'Эксклюзивные награды высшего уровня',
    price: 1500,
    currency: 'coins',
    rarity: 'legendary',
    icon: '💎',
    rewards: ['500-2000 монет', '200-1000 XP', 'Легендарные предметы', 'VIP статус'],
    dropRate: '5%'
  },
  {
    id: '4',
    name: 'Праздничный кейс',
    description: 'Ограниченная серия с эксклюзивными наградами',
    price: 300,
    currency: 'coins',
    rarity: 'epic',
    icon: '🎁',
    rewards: ['150-800 монет', '30-150 XP', 'Праздничные предметы', 'Временные бонусы'],
    dropRate: '15%',
    limited: true
  }
];

// Тип для товара в корзине
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export function ShopPageWithTabs({ 
  onNavigate, 
  currentPage, 
  onOpenSettings, 
  profilePhoto,
  shopItems,
  setShopItems,
  orders,
  setOrders 
}: ShopPageWithTabsProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'games' | 'cases'>('items');
  const [userBalance] = useState(1500); // Мок баланса пользователя
  const [userCooldowns, setUserCooldowns] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartTab, setCartTab] = useState<'cart' | 'active' | 'completed'>('cart');

  const tabs = [
    { id: 'items' as const, label: 'Товары', icon: Package },
    { id: 'games' as const, label: 'Игры', icon: Gamepad2 },
    { id: 'cases' as const, label: 'Кейсы', icon: Gift }
  ];

  const gameTypeIcons = {
    wheel: CircleDot,
    rps: Scissors,
    slots: DollarSign
  };

  const rarityColors = {
    common: 'text-gray-600 bg-gray-100',
    rare: 'text-blue-600 bg-blue-100',
    epic: 'text-purple-600 bg-purple-100',
    legendary: 'text-yellow-600 bg-yellow-100'
  };

  const formatStats = (num: number) => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}k`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  const canPlayGame = (gameId: string) => {
    const cooldownEndTime = userCooldowns[gameId];
    if (!cooldownEndTime) return true;
    return Date.now() > cooldownEndTime;
  };

  const getRemainingCooldown = (gameId: string) => {
    const cooldownEndTime = userCooldowns[gameId];
    if (!cooldownEndTime) return 0;
    return Math.max(0, Math.ceil((cooldownEndTime - Date.now()) / 1000));
  };

  const formatCooldown = (seconds: number) => {
    if (seconds < 60) return `${seconds}с`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}м`;
    return `${Math.floor(seconds / 3600)}ч`;
  };

  const playGame = (game: any) => {
    // Симуляция кулдауна (преобразуем текстовый кулдаун в секунды)
    const cooldownInSeconds = game.cooldown === '5м' ? 300 : game.cooldown === '3м' ? 180 : 600;
    const cooldownEndTime = Date.now() + (cooldownInSeconds * 1000);
    setUserCooldowns(prev => ({
      ...prev,
      [game.id]: cooldownEndTime
    }));
    
    // Здесь будет логика запуска игры
    console.log(`Запуск игры: ${game.name}`);
  };

  const openCase = (caseItem: any) => {
    if (userBalance >= caseItem.price) {
      // Здесь будет логика открытия кейса
      console.log(`Открытие кейса: ${caseItem.name}`);
    }
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
      // Создаем новый заказ
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
        status: 'active',
        createdAt: new Date().toISOString(),
        userId: 'current-user' // В реальном приложении будет ID текущего пользователя
      };
      
      // Добавляем заказ в список заказов
      setOrders(prevOrders => [...prevOrders, newOrder]);
      
      // Очищаем корзину и переключаемся на таб активных заказов
      clearCart();
      setCartTab('active');
      
      console.log('Заказ оформлен:', newOrder);
    }
  };

  const renderItemsTab = () => (
    <div className="space-y-4">
      {shopItems.length > 0 ? (
        shopItems.map((item) => (
          <div key={item.id} className="glass-card rounded-2xl p-4 apple-shadow">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center">
                <span className="text-2xl">{item.emoji}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{item.price} G-coin</div>
                    <div className="text-xs text-muted-foreground">В наличии: {item.stock}</div>
                  </div>
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-xl hover:scale-[0.98] transition-transform disabled:bg-secondary disabled:text-muted-foreground"
                  disabled={item.stock === 0}
                >
                  {item.stock === 0 ? 'Нет в наличии' : 'Добавить в корзину'}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center apple-shadow">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Товары скоро появятся</h3>
          <p className="text-sm text-muted-foreground">
            Администрат��ры работают над пополнением ассортимента
          </p>
        </div>
      )}
    </div>
  );

  const renderGamesTab = () => (
    <div className="space-y-4">
      {gamesData.map((game) => {
        const GameIcon = gameTypeIcons[game.type as keyof typeof gameTypeIcons] || Gamepad2;
        const canPlay = canPlayGame(game.id);
        const remainingCooldown = getRemainingCooldown(game.id);
        
        return (
          <div key={game.id} className="glass-card rounded-2xl p-4 apple-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center">
                <span className="text-2xl">{game.icon}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-foreground">{game.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {game.description}
                    </div>
                  </div>
                  {!canPlay && (
                    <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">
                      <Clock className="w-3 h-3" />
                      {formatCooldown(remainingCooldown)}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-xs mb-4">
                  <div className="text-center">
                    <div className="text-foreground font-medium">{formatStats(game.stats.plays)}</div>
                    <div className="text-muted-foreground">Игр</div>
                  </div>
                  <div className="text-center">
                    <div className="text-foreground font-medium">{formatStats(game.stats.rewards)}</div>
                    <div className="text-muted-foreground">Наград</div>
                  </div>
                  <div className="text-center">
                    <div className="text-foreground font-medium">{formatStats(game.stats.players)}</div>
                    <div className="text-muted-foreground">Игроков</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Кулдаун: {game.cooldown}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Публичная игра
                  </div>
                </div>
                
                <button
                  onClick={() => playGame(game)}
                  disabled={!canPlay}
                  className={`w-full py-3 rounded-xl transition-transform ${
                    canPlay
                      ? 'bg-primary text-primary-foreground hover:scale-[0.98]'
                      : 'bg-secondary text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    {canPlay ? 'Играть' : `Ждите ${formatCooldown(remainingCooldown)}`}
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderCasesTab = () => (
    <div className="space-y-4">
      {casesData.map((caseItem) => (
        <div key={caseItem.id} className="glass-card rounded-2xl p-4 apple-shadow">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center relative">
              <span className="text-3xl">{caseItem.icon}</span>
              {caseItem.limited && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Limited
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{caseItem.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${rarityColors[caseItem.rarity as keyof typeof rarityColors]}`}>
                      {caseItem.rarity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{caseItem.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Шанс редкой награды: {caseItem.dropRate}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-foreground">{caseItem.price} G-coin</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-xs font-medium text-foreground mb-2">Возможные награды:</div>
                <div className="flex flex-wrap gap-1">
                  {caseItem.rewards.map((reward, index) => (
                    <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">
                      {reward}
                    </span>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => openCase(caseItem)}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:scale-[0.98] transition-transform disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed"
                disabled={userBalance < caseItem.price}
              >
                <div className="flex items-center justify-center gap-2">
                  <Gift className="w-4 h-4" />
                  {userBalance < caseItem.price ? 'Недостаточно средств' : `Открыть за ${caseItem.price} G-coin`}
                </div>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Магазин" 
        onOpenSettings={onOpenSettings} 
        profilePhoto={profilePhoto}
      />
      
      <div className="pt-20 pb-20 p-6">
        {/* Баланс пользователя */}
        <div className="glass-card rounded-2xl p-4 mb-6 apple-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Ваш баланс</div>
              <div className="text-2xl font-medium text-foreground">{userBalance} G-coin</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
              </div>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-12 h-12 glass-card rounded-xl flex items-center justify-center hover:scale-[0.95] transition-transform"
              >
                <ShoppingCart className="w-6 h-6 text-foreground" />
                {getTotalCartItems() > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalCartItems()}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'glass-card text-foreground hover:scale-[0.98]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>



        {/* Контент табов */}
        {activeTab === 'items' && renderItemsTab()}
        {activeTab === 'games' && renderGamesTab()}
        {activeTab === 'cases' && renderCasesTab()}
      </div>

      {/* Модальное окно корзины */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-background rounded-t-2xl max-h-[75vh] flex flex-col">
            {/* Заголовок корзины - фиксированный */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border shrink-0">
              <h2 className="text-xl font-medium text-foreground">Корзина</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full glass-card flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Табы корзины - фиксированные */}
            <div className="flex gap-2 p-6 py-4 shrink-0">
              <button
                onClick={() => setCartTab('cart')}
                className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                  cartTab === 'cart' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'glass-card text-foreground hover:scale-[0.98]'
                }`}
              >
                Корзина
              </button>
              <button
                onClick={() => setCartTab('active')}
                className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                  cartTab === 'active' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'glass-card text-foreground hover:scale-[0.98]'
                }`}
              >
                Активные
              </button>
              <button
                onClick={() => setCartTab('completed')}
                className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                  cartTab === 'completed' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'glass-card text-foreground hover:scale-[0.98]'
                }`}
              >
                Завершенные
              </button>
            </div>

            {/* Прокручиваемое содержимое корзины */}
            <div className="flex-1 overflow-y-auto px-6 min-h-0">
              {cartTab === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Корзина пуста</p>
                    </div>
                  ) : (
                    <div className="space-y-4 pb-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 glass-card p-4 rounded-xl">
                          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                            <span className="text-xl">{item.emoji}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.price} G-coin за шт.</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:scale-[0.9] transition-transform"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:scale-[0.9] transition-transform"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:scale-[0.9] transition-transform"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Итого и кнопки - фиксированные внизу */}
            {cartTab === 'cart' && cart.length > 0 && (
              <div className="border-t border-border p-6 pt-4 shrink-0 bg-background">
                <div className="flex items-center justify-between text-lg font-medium mb-4">
                  <span>Итого:</span>
                  <span>{getTotalCartPrice()} G-coin</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 py-3 rounded-xl glass-card text-muted-foreground hover:scale-[0.98] transition-transform"
                  >
                    Очистить
                  </button>
                  <button
                    onClick={checkout}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground hover:scale-[0.98] transition-transform disabled:bg-secondary disabled:text-muted-foreground"
                    disabled={userBalance < getTotalCartPrice()}
                  >
                    {userBalance < getTotalCartPrice() ? 'Недостаточно средств' : 'Купить'}
                  </button>
                </div>
              </div>
            )}

              {/* Активные заказы */}
              {cartTab === 'active' && (
                <div className="space-y-4 pb-4">
                  {orders.filter(order => order.status === 'active').length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Нет активных заказов</p>
                    </div>
                  ) : (
                    orders.filter(order => order.status === 'active').map((order) => (
                      <div key={order.id} className="glass-card p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Заказ #{order.id}</span>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            В обработке
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{item.price * item.quantity} G-coin</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between font-medium">
                            <span>Итого:</span>
                            <span>{order.total} G-coin</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Завершенные заказы */}
              {cartTab === 'completed' && (
                <div className="space-y-4 pb-4">
                  {orders.filter(order => order.status === 'completed').length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Нет завершенных заказов</p>
                    </div>
                  ) : (
                    orders.filter(order => order.status === 'completed').map((order) => (
                      <div key={order.id} className="glass-card p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Заказ #{order.id}</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Выполнен
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{item.price * item.quantity} G-coin</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between font-medium">
                            <span>Итого:</span>
                            <span>{order.total} G-coin</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
          </div>
        </div>
      )}

      <BottomNavigation currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
}