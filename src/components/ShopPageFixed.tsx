import { useState } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { ShoppingBag, X, Package, Trash2, CheckCircle, Gift, Zap } from './Icons';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import coinImage from 'figma:asset/acaa4cccbfaf8eeee6ecbbe8f29c92d03b701371.png';
import { mockAppState } from '../data/mockData';

interface ShopPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings?: () => void;
  profilePhoto?: string | null;
  shopItems?: any[];
  setShopItems: (items: any[]) => void;
  orders?: any[];
  setOrders: (orders: any[]) => void;
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

export function ShopPageFixed({ onNavigate, currentPage, onOpenSettings, profilePhoto, shopItems, setShopItems, orders: globalOrders, setOrders: setGlobalOrders }: ShopPageProps) {
  const { currentUser } = mockAppState;
  
  const [userBalance, setUserBalance] = useState(currentUser.balance);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isInsufficientFundsOpen, setIsInsufficientFundsOpen] = useState(false);
  const [orderTab, setOrderTab] = useState<'active' | 'completed'>('active');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);


  // Функция для получения иконки товара по категории
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bonus': return Zap;
      case 'privilege': return CheckCircle;
      case 'cosmetic': return Gift;
      case 'tool': return Package;
      default: return Package;
    }
  };

  // Преобразуем товары из глобального состояния в формат Product, показываем только активные товары
  const products: Product[] = (shopItems || [])
    .filter(item => item?.isActive)
    .map(item => ({
      id: parseInt(item.id),
      name: item.title,
      price: item.price,
      description: item.description,
      icon: getCategoryIcon(item.category || 'tool')
    }));



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
    setGlobalOrders && setGlobalOrders(prevOrders => [newOrder, ...(prevOrders || [])]);
    clearCart();
    setIsCartOpen(false);
  };

  const activeOrders = (globalOrders || []).filter(order => order?.status === 'pending' || order?.status === 'approved');
  const completedOrders = (globalOrders || []).filter(order => order?.status === 'rejected' || order?.status === 'received');

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
    setGlobalOrders && setGlobalOrders(prevOrders => 
      (prevOrders || []).map(order => 
        order?.id === orderId 
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

  return (
    <>
      <div className="min-h-screen flex flex-col max-w-md mx-auto">
        {/* Header */}
        <Header onNavigate={onNavigate} currentPage={currentPage} onOpenSettings={onOpenSettings} user={currentUser} profilePhoto={profilePhoto} />
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="mx-4 mt-6 h-full">
            <div className="glass-card rounded-2xl h-full flex flex-col apple-shadow">
              {/* Верхняя секция с балансом и заголовком */}
              <div className="flex items-center p-6 border-b border-border/20">
                <div className="glass-card rounded-lg px-3 py-2 apple-shadow">
                  <div className="text-xs text-muted-foreground mb-1">Баланс</div>
                  <div className="text-sm font-medium text-foreground">{userBalance}g</div>
                </div>
                
                <h2 className="text-lg font-medium text-foreground flex-1 text-center">
                  Магазин
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


              
              {/* Список товаров */}
              <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-4">
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
                <div className="text-sm font-medium text-foreground">{userBalance}g</div>
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
                      <div className="text-sm font-medium text-foreground mb-1">
                        {item.product.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatPrice(item.product.price)} × {item.quantity}
                      </div>
                    </div>
                    
                    <div className="text-sm font-medium text-foreground mr-2">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Корзина пуста</p>
                </div>
              )}
            </div>

            {/* Итого и кнопка покупки */}
            {cart.length > 0 && (
              <div className="border-t border-border/20 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-foreground">Итого:</span>
                  <span className="text-lg font-medium text-foreground">{formatPrice(getCartTotal())}</span>
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
                    disabled={getCartTotal() > userBalance}
                    className={`flex-1 rounded-2xl p-3 text-sm font-medium transition-transform ${
                      getCartTotal() > userBalance
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:scale-[0.98]'
                    }`}
                  >
                    Купить
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно недостаточно средств */}
      <Dialog open={isInsufficientFundsOpen} onOpenChange={setIsInsufficientFundsOpen}>
        <DialogContent className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-sm p-6 [&>button]:hidden">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <X className="w-8 h-8 text-red-500" />
            </div>
            
            <DialogTitle className="text-lg font-medium text-foreground mb-2">
              Недостаточно средств
            </DialogTitle>
            
            <DialogDescription className="text-sm text-muted-foreground mb-6">
              У вас недостаточно монет для совершения покупки. Выполните задания, чтобы заработать больше монет.
            </DialogDescription>
            
            <button
              onClick={() => setIsInsufficientFundsOpen(false)}
              className="w-full bg-primary text-primary-foreground rounded-2xl p-3 text-sm font-medium hover:scale-[0.98] transition-transform"
            >
              Понятно
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Детали товара */}
      <Dialog open={isProductDetailOpen} onOpenChange={setIsProductDetailOpen}>
        <DialogContent className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-0 max-h-[80vh] flex flex-col [&>button]:hidden">
          {selectedProduct && (
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <DialogTitle className="text-lg font-medium text-foreground">
                  Детали товара
                </DialogTitle>
                <button
                  onClick={() => setIsProductDetailOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-foreground/70" />
                </button>
              </div>
              
              <DialogDescription className="sr-only">
                Детальная информация о товаре
              </DialogDescription>

              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center">
                    <selectedProduct.icon className="w-8 h-8 text-foreground/70" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-lg font-medium text-foreground mb-2">
                      {selectedProduct.name}
                    </div>
                    <div className="text-xl font-medium text-primary">
                      {formatPrice(selectedProduct.price)}
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-4">
                  <div className="text-sm font-medium text-foreground mb-2">
                    Описание
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedProduct.description}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
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
                  disabled={!canAfford(selectedProduct.price)}
                  className={`flex-1 rounded-2xl p-3 text-sm font-medium transition-transform ${
                    canAfford(selectedProduct.price)
                      ? 'bg-primary text-primary-foreground hover:scale-[0.98]'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  В корзину
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Модальное окно заказов */}
      <Dialog open={isOrdersOpen} onOpenChange={setIsOrdersOpen}>
        <DialogContent className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-md p-0 max-h-[80vh] flex flex-col [&>button]:hidden">
          <div className="p-6 flex-1 flex flex-col">
            {/* Заголовок заказов */}
            <div className="flex items-center justify-between mb-6">
              <DialogTitle className="text-lg font-medium text-foreground">
                Мои заказы
              </DialogTitle>
              <button
                onClick={() => setIsOrdersOpen(false)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-foreground/70" />
              </button>
            </div>
            
            <DialogDescription className="sr-only">
              Список ваших заказов и их статус
            </DialogDescription>

            {/* Вкладки заказов */}
            <div className="flex gap-2 p-1 glass-card rounded-2xl mb-4">
              <button
                onClick={() => setOrderTab('active')}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex-1 text-center transition-all ${
                  orderTab === 'active'
                    ? 'bg-foreground text-background apple-shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Активные ({activeOrders.length})
              </button>
              <button
                onClick={() => setOrderTab('completed')}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex-1 text-center transition-all ${
                  orderTab === 'completed'
                    ? 'bg-foreground text-background apple-shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Завершенные ({completedOrders.length})
              </button>
            </div>

            {/* Список заказов */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {(orderTab === 'active' ? activeOrders : completedOrders).map((order) => (
                <div key={order.id} className="glass-card rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        Заказ #{order.id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {formatPrice(order.total)}
                      </div>
                      <div className={`text-xs ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-6 h-6 glass-card rounded flex items-center justify-center">
                          <item.product.icon className="w-3 h-3 text-foreground/70" />
                        </div>
                        <div className="flex-1 text-xs text-muted-foreground">
                          {item.product.name} × {item.quantity}
                        </div>
                        <div className="text-xs text-foreground">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.status === 'approved' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShowTracking(order)}
                        className="flex-1 glass-card rounded-lg p-2 text-xs font-medium text-foreground hover:scale-[0.98] transition-transform"
                      >
                        Отследить
                      </button>
                      <button
                        onClick={() => handleMarkAsReceived(order.id)}
                        className="flex-1 bg-green-500 text-white rounded-lg p-2 text-xs font-medium hover:scale-[0.98] transition-transform"
                      >
                        Получено
                      </button>
                    </div>
                  )}

                  {order.status === 'received' && order.completedDate && (
                    <div className="text-xs text-green-600">
                      Получено: {order.completedDate}
                    </div>
                  )}
                </div>
              ))}

              {(orderTab === 'active' ? activeOrders : completedOrders).length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground text-center">
                    {orderTab === 'active' ? 'Активных заказов нет' : 'Завершенных заказов нет'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно отслеживания */}
      <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
        <DialogContent className="glass-card rounded-3xl border-2 border-border apple-shadow w-[90vw] max-w-sm p-6 [&>button]:hidden">
          <div className="text-center">
            <DialogTitle className="text-lg font-medium text-foreground mb-4">
              Отслеживание заказа
            </DialogTitle>
            
            <DialogDescription className="sr-only">
              Информация об отслеживании заказа
            </DialogDescription>
            
            {selectedOrder && (
              <div className="space-y-4">
                <div className="glass-card rounded-2xl p-4">
                  <div className="text-sm font-medium text-foreground mb-2">
                    Заказ #{selectedOrder.id}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Статус: {getStatusText(selectedOrder.status)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Дата заказа: {selectedOrder.date}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Ваш заказ обрабатывается администратором. Вы получите уведомление, когда заказ будет готов к получению.
                </div>
              </div>
            )}
            
            <button
              onClick={() => setIsTrackingOpen(false)}
              className="w-full bg-primary text-primary-foreground rounded-2xl p-3 text-sm font-medium hover:scale-[0.98] transition-transform mt-6"
            >
              Закрыть
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
}