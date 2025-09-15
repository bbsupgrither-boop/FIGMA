import { useState } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { ShoppingBag, Stethoscope, Award, WashingMachine, Car, X, Package, Trash2, FileText, ArrowLeft, CheckCircle, Gamepad2, Gift, CircleDot, Dices, Clock, Box } from './Icons';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import coinImage from 'figma:asset/acaa4cccbfaf8eeee6ecbbe8f29c92d03b701371.png';

interface ShopPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings?: () => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: number;
  items: CartItem[];
  total: number;
  date: string;
  completedDate?: string;
  status: 'pending' | 'approved' | 'rejected' | 'received';
  trackingInfo?: string;
}

export function ShopPage({ onNavigate, currentPage, onOpenSettings }: ShopPageProps) {
  const [userBalance, setUserBalance] = useState(0); // 0g начальный баланс
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isInsufficientFundsOpen, setIsInsufficientFundsOpen] = useState(false);
  const [orderTab, setOrderTab] = useState<'active' | 'completed'>('active');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [activeShopTab, setActiveShopTab] = useState<'goods' | 'games' | 'cases'>('goods');
  const [lastWheelSpin, setLastWheelSpin] = useState<Date | null>(null);
  const [lastCaseOpen, setLastCaseOpen] = useState<Date | null>(null);
  const [isOpeningCase, setIsOpeningCase] = useState(false);
  const [caseResult, setCaseResult] = useState<number | null>(null);
  const [isCaseDescriptionOpen, setIsCaseDescriptionOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);

  // Товары магазина (пустой список - товары будут добавлены через админ-панель)
  const products: Product[] = [];

  // Функция для проверки доступности колеса фортуны
  const isWheelAvailable = () => {
    if (!lastWheelSpin) return true;
    const now = new Date();
    const timeDiff = now.getTime() - lastWheelSpin.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff >= 24;
  };

  const getWheelCooldownTime = () => {
    if (!lastWheelSpin) return '';
    const now = new Date();
    const nextSpin = new Date(lastWheelSpin.getTime() + 24 * 60 * 60 * 1000);
    const timeDiff = nextSpin.getTime() - now.getTime();
    const hoursLeft = Math.ceil(timeDiff / (1000 * 60 * 60));
    return `Доступно через ${hoursLeft}ч`;
  };

  // Функция для проверки доступности кейса
  const isCaseAvailable = () => {
    if (!lastCaseOpen) return true;
    const now = new Date();
    const timeDiff = now.getTime() - lastCaseOpen.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff >= 24;
  };

  const getCaseCooldownTime = () => {
    if (!lastCaseOpen) return '';
    const now = new Date();
    const nextOpen = new Date(lastCaseOpen.getTime() + 24 * 60 * 60 * 1000);
    const timeDiff = nextOpen.getTime() - now.getTime();
    const hoursLeft = Math.ceil(timeDiff / (1000 * 60 * 60));
    return `Доступно через ${hoursLeft}ч`;
  };

  // Мини-игры (в будущем будут управляться через админ панель)
  const games = [
    {
      id: 1,
      name: 'Колесо фортуны',
      description: 'Бесплатная игра раз в 24 часа',
      cost: 0,
      reward: '10-500g',
      icon: CircleDot,
      cooldown: !isWheelAvailable(),
      cooldownText: getWheelCooldownTime()
    },
    {
      id: 2,
      name: 'Камень, ножницы, бумага',
      description: 'Классическая игра против компьютера',
      cost: 10,
      reward: '20-50g',
      icon: Gamepad2,
      cooldown: false
    },
    {
      id: 3,
      name: 'Казино',
      description: 'Рискните своими очками в игре на удачу',
      cost: 50,
      reward: '0-300g',
      icon: Dices,
      cooldown: false
    }
  ];

  // Функция для расчета выпадения награды из кейса
  const openCase = () => {
    const random = Math.random() * 100;
    
    // Система вероятностей:
    // 10 монет - 40% (0-40)
    // 30 монет - 30% (40-70) 
    // 50 монет - 15% (70-85)
    // 70 монет - 10% (85-95)
    // 100 монет - 5% (95-100)
    
    if (random <= 40) return 10;
    if (random <= 70) return 30;
    if (random <= 85) return 50;
    if (random <= 95) return 70;
    return 100;
  };

  const handleOpenCase = () => {
    setIsOpeningCase(true);
    setIsCaseDescriptionOpen(false);
    
    // Устанавливаем кулдаун
    setLastCaseOpen(new Date());
    
    // Имитация анимации открытия кейса
    setTimeout(() => {
      const reward = openCase();
      setCaseResult(reward);
      setUserBalance(prev => prev + reward);
      
      setTimeout(() => {
        setIsOpeningCase(false);
        setCaseResult(null);
      }, 3000);
    }, 2000);
  };

  const handleCaseClick = (caseItem: any) => {
    setSelectedCase(caseItem);
    setIsCaseDescriptionOpen(true);
  };

  // Кейсы (в будущем будут управляться через админ панель)
  const cases = [
    {
      id: 1,
      name: 'Бесплатный кейс',
      description: 'Случайная награда от 10 до 100 монет',
      cost: 0,
      rewards: [
        { coins: 10, chance: '40%' },
        { coins: 30, chance: '30%' },
        { coins: 50, chance: '15%' },
        { coins: 70, chance: '10%' },
        { coins: 100, chance: '5%' }
      ],
      icon: Box,
      cooldown: !isCaseAvailable(),
      cooldownText: getCaseCooldownTime()
    }
  ];

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + 'g';
  };

  const canAfford = (price: number) => {
    return userBalance >= price;
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const handlePurchase = () => {
    const total = getCartTotal();
    if (total > userBalance) {
      setIsInsufficientFundsOpen(true);
      return;
    }

    // Создаем новый заказ
    const newOrder: Order = {
      id: Date.now(),
      items: [...cart],
      total,
      date: new Date().toLocaleDateString('ru-RU'),
      status: 'pending'
    };

    // Снимаем деньги с баланса
    setUserBalance(prev => prev - total);
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();
    setIsCartOpen(false);
  };

  const activeOrders = orders.filter(order => order.status === 'pending' || order.status === 'approved');
  const completedOrders = orders.filter(order => order.status === 'rejected' || order.status === 'received');

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'В процессе одобрения';
      case 'approved': return 'Одобрен';
      case 'rejected': return 'Отклонен';
      case 'received': return 'Получен';
      default: return 'Неизвестно';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-muted-foreground';
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'received': return 'text-green-600';
      default: return 'text-muted-foreground';
    }
  };

  const handleMarkAsReceived = (orderId: number) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: 'received' as const,
              completedDate: new Date().toLocaleDateString('ru-RU')
            }
          : order
      )
    );
  };

  const handleShowTracking = (order: Order) => {
    setSelectedOrder(order);
    setIsTrackingOpen(true);
  };

  // Функция для имитации обновления статусов заказов (для демонстрации)
  const simulateOrderStatusUpdate = (orderId: number, newStatus: Order['status'], trackingInfo?: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedOrder: Order = {
            ...order,
            status: newStatus,
            completedDate: (newStatus === 'rejected' || newStatus === 'received') 
              ? new Date().toLocaleDateString('ru-RU') 
              : order.completedDate
          };
          
          if (trackingInfo) {
            updatedOrder.trackingInfo = trackingInfo;
          }

          // Возврат денег при отклонении
          if (newStatus === 'rejected') {
            setUserBalance(prev => prev + order.total);
          }

          return updatedOrder;
        }
        return order;
      })
    );
  };

  return (
    <>
      <div className="min-h-screen flex flex-col max-w-md mx-auto">
        {/* Header */}
        <Header onNavigate={onNavigate} currentPage={currentPage} onOpenSettings={onOpenSettings} />
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="mx-4 mt-6 h-full">
            <div className="glass-card rounded-2xl h-full flex flex-col apple-shadow">
              {/* Верхняя секция с балансом и заголовком */}
              <div className="flex items-center p-6 border-b border-border/20">
                <div className="glass-card rounded-lg px-3 py-2 apple-shadow">
                  <div className="text-xs text-muted-foreground mb-1">Баланс</div>
                  <div className="text-sm font-medium text-foreground">{formatPrice(userBalance)}</div>
                </div>
                
                <h2 className="text-lg font-medium text-foreground flex-1 text-center">
                  {activeShopTab === 'goods' ? 'Товары' : activeShopTab === 'games' ? 'Мини-игры' : 'Кейсы'}
                </h2>
                
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="apple-button p-2 rounded-full hover:scale-105 transition-transform relative"
                >
                  <ShoppingBag className="w-5 h-5 text-foreground/70" />
                  {cart.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                  )}
                </button>
              </div>

              {/* Вкладки магазина */}
              <div className="px-6 pb-4">
                <div className="flex gap-2 p-1 glass-card rounded-2xl">
                  <button
                    onClick={() => setActiveShopTab('goods')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex-1 text-center transition-all ${
                      activeShopTab === 'goods'
                        ? 'bg-foreground text-background apple-shadow'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Товары
                  </button>
                  <button
                    onClick={() => setActiveShopTab('games')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex-1 text-center transition-all ${
                      activeShopTab === 'games'
                        ? 'bg-foreground text-background apple-shadow'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Мини-игры
                  </button>
                  <button
                    onClick={() => setActiveShopTab('cases')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex-1 text-center transition-all ${
                      activeShopTab === 'cases'
                        ? 'bg-foreground text-background apple-shadow'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Кейсы
                  </button>
                </div>
              </div>
              
              {/* Содержимое в зависимости от активной вкладки */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeShopTab === 'goods' && (
                  <>
                    {products.length > 0 ? (
                      products.map((product) => {
                        const affordable = canAfford(product.price);
                        return (
                          <div
                            key={product.id}
                            className={`glass-card rounded-2xl p-4 flex items-center gap-4 apple-shadow transition-all ${
                              affordable ? 'hover:scale-[0.98] cursor-pointer' : 'opacity-50'
                            }`}
                            onClick={() => affordable && handleProductClick(product)}
                          >
                            <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center">
                              <product.icon className="w-6 h-6 text-foreground/70" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="font-medium text-foreground text-sm mb-1">
                                {product.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatPrice(product.price)}
                              </div>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (affordable) {
                                  addToCart(product);
                                }
                              }}
                              disabled={!affordable}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                affordable
                                  ? 'glass-card hover:scale-[0.98] text-foreground'
                                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                              }`}
                            >
                              Купить
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center min-h-[200px]">
                        <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-6 w-80 apple-shadow">
                          <p className="text-muted-foreground opacity-70 text-center">
                            Товары для покупки отсутствуют
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeShopTab === 'games' && (
                  <>
                    {games.map((game) => {
                      const affordable = canAfford(game.cost);
                      const canPlay = affordable && !game.cooldown;
                      return (
                        <div
                          key={game.id}
                          className={`glass-card rounded-2xl p-4 apple-shadow transition-all ${
                            canPlay ? 'hover:scale-[0.98] cursor-pointer' : 'opacity-50'
                          }`}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center relative">
                              <game.icon className="w-6 h-6 text-foreground/70" />
                              {game.cooldown && (
                                <div className="absolute inset-0 bg-muted/50 rounded-xl flex items-center justify-center">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="font-medium text-foreground text-sm">
                                  {game.name}
                                </div>
                                {game.cost === 0 && (
                                  <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full">
                                    Бесплатно
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {game.description}
                              </div>
                              {game.cooldown && game.cooldownText && (
                                <div className="text-xs text-orange-600 mt-1">
                                  {game.cooldownText}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              {game.cost > 0 ? `Стоимость: ${formatPrice(game.cost)}` : 'Бесплатно'} • Награда: {game.reward}
                            </div>
                            <button
                              disabled={!canPlay}
                              onClick={() => {
                                if (game.id === 1 && canPlay) {
                                  // Колесо фортуны - устанавливаем кулдаун
                                  setLastWheelSpin(new Date());
                                }
                                // Здесь будет логика запуска игр
                              }}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                canPlay
                                  ? 'bg-primary text-primary-foreground hover:scale-[0.98]'
                                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                              }`}
                            >
                              {game.cooldown ? 'Недоступно' : 'Играть'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    
                    {games.length === 0 && (
                      <div className="flex items-center justify-center min-h-[200px]">
                        <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-6 w-80 apple-shadow">
                          <p className="text-muted-foreground opacity-70 text-center">
                            Мини-игры пока недоступны
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeShopTab === 'cases' && (
                  <>
                    {cases.map((caseItem) => {
                      const affordable = canAfford(caseItem.cost);
                      const canClick = affordable && !isOpeningCase;
                      return (
                        <div
                          key={caseItem.id}
                          className={`glass-card rounded-2xl p-4 apple-shadow transition-all cursor-pointer ${
                            canClick ? 'hover:scale-[0.98]' : 'opacity-50'
                          }`}
                          onClick={() => canClick && handleCaseClick(caseItem)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center relative">
                              <caseItem.icon className="w-6 h-6 text-foreground/70" />
                              {caseItem.cooldown && (
                                <div className="absolute inset-0 bg-muted/50 rounded-xl flex items-center justify-center">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                </div>
                              )}
                              {isOpeningCase && (
                                <div className="absolute inset-0 bg-primary/20 rounded-xl flex items-center justify-center animate-pulse">
                                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="font-medium text-foreground text-sm">
                                  {caseItem.name}
                                </div>
                                {caseItem.cost === 0 && (
                                  <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full">
                                    Бесплатно
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {caseItem.description}
                              </div>
                              {caseItem.cooldown && caseItem.cooldownText && (
                                <div className="text-xs text-orange-600 mt-1">
                                  {caseItem.cooldownText}
                                </div>
                              )}
                            </div>
                            
                            <button className="px-4 py-2 rounded-xl text-sm font-medium bg-muted text-muted-foreground">
                              Открыть
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    
                    {cases.length === 0 && (
                      <div className="flex items-center justify-center min-h-[200px]">
                        <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-6 w-80 apple-shadow">
                          <p className="text-muted-foreground opacity-70 text-center">
                            Кейсы пока недоступны
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigation onNavigate={onNavigate} currentPage={currentPage} />
      </div>

      {/* Корзина */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-0 max-h-[80vh] flex flex-col [&>button]:hidden"
        >
          <div className="p-6 flex-1 flex flex-col">
            {/* Заголовок корзины */}
            <div className="flex items-center justify-between mb-6">
              <DialogTitle className="text-lg font-medium text-foreground">
                Корзина
              </DialogTitle>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-foreground/70" />
              </button>
            </div>
            
            <DialogDescription className="sr-only">
              Корзина покупок с товарами для оформления заказа
            </DialogDescription>

            {/* Баланс и кнопка заказов */}
            <div className="flex items-center gap-3 mb-4">
              <div className="glass-card rounded-lg px-3 py-2">
                <div className="text-xs text-muted-foreground mb-1">Баланс</div>
                <div className="text-sm font-medium text-foreground">{formatPrice(userBalance)}</div>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsOrdersOpen(true);
                }}
                className="glass-card rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:scale-[0.98] transition-transform ml-auto"
              >
                Заказы
              </button>
            </div>

            {/* Товары в корзине */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.product.id} className="glass-card rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 glass-card rounded-lg flex items-center justify-center">
                      <item.product.icon className="w-5 h-5 text-foreground/70" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {item.product.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatPrice(item.product.price)}
                        {item.quantity > 1 && ` x${item.quantity}`}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center min-h-[120px]">
                  <p className="text-muted-foreground text-sm text-center opacity-70">
                    Корзина пуста
                  </p>
                </div>
              )}
            </div>

            {/* Итого и кнопки */}
            {cart.length > 0 && (
              <>
                <div className="border-t border-border/20 pt-4 mb-4">
                  <div className="text-lg font-medium text-foreground text-center">
                    Итого: {formatPrice(getCartTotal())}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 glass-card rounded-2xl p-3 text-sm font-medium text-foreground hover:scale-[0.98] transition-transform"
                  >
                    Очистить
                  </button>
                  <button
                    onClick={handlePurchase}
                    className="flex-1 bg-primary text-primary-foreground rounded-2xl p-3 text-sm font-medium hover:scale-[0.98] transition-transform"
                  >
                    Оплатить
                  </button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Детали товара */}
      <Dialog open={isProductDetailOpen} onOpenChange={setIsProductDetailOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-sm p-6 [&>button]:hidden"
          aria-describedby="product-detail-description"
        >
          <DialogTitle className="text-lg font-medium text-foreground text-center mb-6">
            Информация о товаре
          </DialogTitle>
          
          <DialogDescription id="product-detail-description" className="sr-only">
            Детальная информация о товаре
          </DialogDescription>

          {selectedProduct && (
            <div className="space-y-4">
              {/* Изображение товара */}
              <div className="w-full h-32 glass-card rounded-2xl flex items-center justify-center">
                <selectedProduct.icon className="w-16 h-16 text-foreground/70" />
              </div>

              {/* Описание товара */}
              <div className="glass-card rounded-2xl p-4">
                <div className="text-sm font-medium text-foreground mb-2">
                  Описание товара
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedProduct.description}
                </div>
              </div>

              {/* Цена */}
              <div className="text-center">
                <div className="text-lg font-medium text-foreground">
                  Цена: {formatPrice(selectedProduct.price)}
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsProductDetailOpen(false)}
                  className="flex-1 glass-card rounded-2xl p-3 text-sm font-medium text-foreground hover:scale-[0.98] transition-transform"
                >
                  Отменить
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setIsProductDetailOpen(false);
                  }}
                  className="flex-1 bg-primary text-primary-foreground rounded-2xl p-3 text-sm font-medium hover:scale-[0.98] transition-transform"
                >
                  Приобрести
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Заказы */}
      <Dialog open={isOrdersOpen} onOpenChange={setIsOrdersOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-0 max-h-[80vh] flex flex-col [&>button]:hidden"
          aria-describedby="orders-description"
        >
          <div className="p-6 flex-1 flex flex-col">
            {/* Заголовок с н��вигацией */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => {
                  setIsOrdersOpen(false);
                  setIsCartOpen(true);
                }}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-foreground/70" />
              </button>
              
              <DialogTitle className="text-lg font-medium text-foreground">
                Заказы
              </DialogTitle>
              
              <div className="w-8"></div> {/* Spacer для центрирования */}
            </div>
            
            <DialogDescription id="orders-description" className="sr-only">
              Список заказов пользователя
            </DialogDescription>

            {/* Вкладки */}
            <div className="flex gap-3 p-1 glass-card rounded-2xl mb-4">
              <button
                onClick={() => setOrderTab('active')}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex-1 transition-all ${
                  orderTab === 'active' 
                    ? 'bg-muted text-foreground apple-shadow' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Актуальные ({activeOrders.length})
              </button>
              <button
                onClick={() => setOrderTab('completed')}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex-1 transition-all ${
                  orderTab === 'completed' 
                    ? 'bg-muted text-foreground apple-shadow' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Завершенные ({completedOrders.length})
              </button>
            </div>

            {/* Список заказов */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {(orderTab === 'active' ? activeOrders : completedOrders).length > 0 ? (
                (orderTab === 'active' ? activeOrders : completedOrders).map((order) => (
                  <div key={order.id} className={`glass-card rounded-2xl p-4 ${order.status === 'rejected' ? 'opacity-60' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-foreground">
                        {order.items[0].product.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {orderTab === 'completed' && order.completedDate 
                          ? `${order.date} → ${order.completedDate}`
                          : order.date
                        }
                      </div>
                    </div>
                    
                    <div className="text-sm font-medium text-foreground mb-3">
                      {formatPrice(order.total)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                        Статус: {getStatusText(order.status)}
                      </div>
                      
                      {order.status === 'approved' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleShowTracking(order)}
                            className="glass-card rounded-lg px-3 py-1 text-xs font-medium text-foreground hover:scale-[0.98] transition-transform"
                          >
                            Трек-номер
                          </button>
                          <button
                            onClick={() => handleMarkAsReceived(order.id)}
                            className="bg-primary text-primary-foreground rounded-lg px-3 py-1 text-xs font-medium hover:scale-[0.98] transition-transform"
                          >
                            Получен
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Демо кнопки для изменения статуса - только для тестирования */}
                    {order.status === 'pending' && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border/20">
                        <button
                          onClick={() => simulateOrderStatusUpdate(order.id, 'approved', 'TRK123456789')}
                          className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded"
                        >
                          [DEMO] Одобрить
                        </button>
                        <button
                          onClick={() => simulateOrderStatusUpdate(order.id, 'rejected')}
                          className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded"
                        >
                          [DEMO] Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center min-h-[120px]">
                  <p className="text-muted-foreground text-sm text-center opacity-70">
                    {orderTab === 'active' ? 'Нет актуальных заказов' : 'Нет завершенных заказов'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Трек-номер */}
      <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-sm p-6 [&>button]:hidden"
          aria-describedby="tracking-description"
        >
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-lg font-medium text-foreground">
              Информация о заказе
            </DialogTitle>
            <button
              onClick={() => setIsTrackingOpen(false)}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-foreground/70" />
            </button>
          </div>
          
          <DialogDescription id="tracking-description" className="sr-only">
            Информация для отслеживания заказа
          </DialogDescription>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-4">
                <div className="text-sm font-medium text-foreground mb-2">
                  Трек-номер для отслеживания
                </div>
                <div className="font-mono text-sm bg-muted rounded-lg p-2 text-center">
                  {selectedOrder.trackingInfo || 'TRK123456789'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Заказ одобрен и передан в доставку.
                  Используйте трек-номер для отслеживания.
                </div>
              </div>
              
              <button
                onClick={() => setIsTrackingOpen(false)}
                className="w-full bg-primary text-primary-foreground rounded-2xl p-3 text-sm font-medium hover:scale-[0.98] transition-transform"
              >
                Понятно
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Недостаточно средств */}
      <Dialog open={isInsufficientFundsOpen} onOpenChange={setIsInsufficientFundsOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-sm p-6 [&>button]:hidden"
          aria-describedby="insufficient-funds-description"
        >
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-lg font-medium text-foreground">
              Недостаточно средств
            </DialogTitle>
            <button
              onClick={() => setIsInsufficientFundsOpen(false)}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-foreground/70" />
            </button>
          </div>
          
          <DialogDescription id="insufficient-funds-description" className="sr-only">
            Уведомление о недостатке средств
          </DialogDescription>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <X className="w-8 h-8 text-red-500" />
            </div>
            
            <p className="text-sm text-foreground">
              У вас недостаточно средств для покупки всех товаров в корзине. 
              Пожалуйста, удалите некоторые товары или пополните баланс.
            </p>
            
            <button
              onClick={() => setIsInsufficientFundsOpen(false)}
              className="w-full bg-primary text-primary-foreground rounded-2xl p-3 text-sm font-medium hover:scale-[0.98] transition-transform"
            >
              Понятно
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Описание кейса */}
      <Dialog open={isCaseDescriptionOpen} onOpenChange={setIsCaseDescriptionOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-0 [&>button]:hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="text-lg font-medium text-foreground">
                {selectedCase?.name}
              </DialogTitle>
              <button
                onClick={() => setIsCaseDescriptionOpen(false)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-foreground/70" />
              </button>
            </div>
            
            <DialogDescription className="sr-only">
              Описание и содержимое кейса с информацией о шансах выпадения наград
            </DialogDescription>

            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-4">
                {selectedCase?.description}
              </div>
              
              <div className="mb-4">
                <div className="text-sm font-medium text-foreground mb-2">Шансы выпадения:</div>
                <div className="space-y-2">
                  {selectedCase?.rewards?.map((reward: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{reward.coins} монет</span>
                      <span className="text-muted-foreground">{reward.chance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsCaseDescriptionOpen(false)}
                className="flex-1 glass-card rounded-xl py-3 text-sm font-medium text-foreground hover:scale-[0.98] transition-transform"
              >
                Отмена
              </button>
              <button
                onClick={handleOpenCase}
                disabled={selectedCase?.cooldown || isOpeningCase}
                className={`flex-1 rounded-xl py-3 text-sm font-medium transition-all ${
                  selectedCase?.cooldown || isOpeningCase
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:scale-[0.98]'
                }`}
              >
                {isOpeningCase ? 'Открываем...' : selectedCase?.cooldown ? 'Недоступно' : 'Открыть'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Результат открытия кейса */}
      <Dialog open={caseResult !== null} onOpenChange={() => setCaseResult(null)}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-sm p-0 [&>button]:hidden"
        >
          <div className="p-6 text-center">
            <DialogTitle className="sr-only">
              Результат открытия кейса
            </DialogTitle>
            
            <DialogDescription className="sr-only">
              Награда полученная из кейса и начисленная на баланс
            </DialogDescription>

            {/* Изображение монеты */}
            <div className="w-16 h-16 mx-auto mb-4">
              <ImageWithFallback 
                src={coinImage} 
                alt="Монета"
                className="w-full h-full object-contain animate-bounce"
              />
            </div>

            {/* Результат */}
            <div className="text-2xl font-bold text-foreground mb-4">
              +{caseResult}g
            </div>

            <button
              onClick={() => setCaseResult(null)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:scale-[0.98] transition-transform"
            >
              ОК
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}