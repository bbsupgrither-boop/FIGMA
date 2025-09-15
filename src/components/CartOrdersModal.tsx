import { useState, useMemo } from 'react';
import { ModalOpaque } from './ModalOpaque';
import { CartItem, ShopItem, Order } from '../types/shop';
import { Trash2, Plus, Minus, ShoppingCart } from './Icons';
import coinIcon from 'figma:asset/29d513144bb95c08c031f3604ac2dd2e7bee6450.png';

interface CartOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  orders: Order[];
  shopItems: ShopItem[];
  userBalance: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPurchase: () => void;
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  theme?: 'light' | 'dark';
}

export function CartOrdersModal({ 
  isOpen, 
  onClose, 
  cart,
  orders,
  shopItems, 
  userBalance,
  onUpdateQuantity,
  onRemoveItem,
  onPurchase,
  onUpdateOrder,
  theme = 'light' 
}: CartOrdersModalProps) {
  const [activeTab, setActiveTab] = useState<'cart' | 'current' | 'completed'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);

  // Получаем информацию о товарах в корзине
  const cartWithItems = cart.map(cartItem => {
    const shopItem = shopItems.find(item => item.id === cartItem.itemId);
    return {
      ...cartItem,
      shopItem
    };
  }).filter(item => item.shopItem);

  // Рассчитываем общую стоимость корзины
  const totalCost = cartWithItems.reduce((sum, item) => 
    sum + (item.shopItem!.price * item.quantity), 0
  );

  const canAfford = userBalance >= totalCost;

  // Разделяем заказы на актуальные и завершенные
  const { currentOrders, completedOrders } = useMemo(() => {
    const current = orders.filter(order => 
      order.status === 'processing' || order.status === 'approved'
    );
    const completed = orders.filter(order => 
      order.status === 'rejected' || order.status === 'completed'
    );
    return { currentOrders: current, completedOrders: completed };
  }, [orders]);

  const handlePurchase = async () => {
    if (!canAfford || isProcessing || cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onPurchase();
      // Переключаемся на вкладку "Актуальные" после покупки
      setActiveTab('current');
    } catch (error) {
      console.error('Ошибка при покупке:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return theme === 'dark' ? '#A7B0BD' : '#6B7280'; // Серый
      case 'approved':
        return '#34C759'; // Зеленый
      case 'rejected':
        return '#FF453A'; // Красный
      case 'completed':
        return '#34C759'; // Зеленый
      default:
        return theme === 'dark' ? '#A7B0BD' : '#6B7280';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'В процессе одобрения';
      case 'approved':
        return 'Одобрен';
      case 'rejected':
        return 'Отклонен';
      case 'completed':
        return 'Получен';
      default:
        return status;
    }
  };

  const handleMarkAsReceived = (orderId: string) => {
    onUpdateOrder(orderId, {
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <ModalOpaque 
      isOpen={isOpen} 
      onClose={onClose}
      title=""
      theme={theme}
    >
      <div className="space-y-4">
        {/* Вкладки */}
        <div className="flex rounded-xl p-1" style={{
          background: theme === 'dark' ? '#1C2029' : '#F3F5F8'
        }}>
          <button
            onClick={() => setActiveTab('cart')}
            className="flex-1 py-2 px-4 rounded-lg transition-all unified-text"
            style={{
              background: activeTab === 'cart' 
                ? '#2B82FF'
                : 'transparent',
              color: activeTab === 'cart' 
                ? '#FFFFFF' 
                : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
              fontWeight: activeTab === 'cart' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'
            }}
          >
            Корзина
          </button>
          <button
            onClick={() => setActiveTab('current')}
            className="flex-1 py-2 px-4 rounded-lg transition-all unified-text"
            style={{
              background: activeTab === 'current' 
                ? '#2B82FF'
                : 'transparent',
              color: activeTab === 'current' 
                ? '#FFFFFF' 
                : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
              fontWeight: activeTab === 'current' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'
            }}
          >
            Актуальные
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className="flex-1 py-2 px-4 rounded-lg transition-all unified-text"
            style={{
              background: activeTab === 'completed' 
                ? '#2B82FF'
                : 'transparent',
              color: activeTab === 'completed' 
                ? '#FFFFFF' 
                : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
              fontWeight: activeTab === 'completed' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'
            }}
          >
            Завершенные
          </button>
        </div>

        {/* Контент корзины */}
        {activeTab === 'cart' && (
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart 
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: theme === 'dark' ? '#A7B0BD' : '#6B7280' }}
                />
                <span className="unified-text" style={{ 
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                }}>
                  Корзина пуста
                </span>
              </div>
            ) : (
              <>
                {/* Список товаров */}
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {cartWithItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl border"
                      style={{
                        background: theme === 'dark' ? '#161A22' : '#FFFFFF',
                        border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'}`
                      }}
                    >
                      {/* Иконка товара */}
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: theme === 'dark' ? '#1C2029' : '#F3F5F8'
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{item.shopItem!.emoji}</span>
                      </div>

                      {/* Информация о товаре */}
                      <div className="flex-1">
                        <div className="unified-text" style={{ 
                          color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                          fontWeight: 'var(--font-weight-medium)',
                          marginBottom: '2px'
                        }}>
                          {item.shopItem!.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="unified-text" style={{ 
                            color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                          }}>
                            {item.shopItem!.price} G за шт.
                          </span>
                        </div>
                      </div>

                      {/* Управление количеством */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.itemId, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          style={{
                            background: theme === 'dark' ? '#1C2029' : '#F3F5F8',
                            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'}`
                          }}
                        >
                          <Minus style={{ 
                            width: '12px', 
                            height: '12px', 
                            color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                          }} />
                        </button>

                        <span className="unified-text min-w-[20px] text-center" style={{ 
                          color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                          fontWeight: 'var(--font-weight-medium)'
                        }}>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => onUpdateQuantity(item.itemId, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          style={{
                            background: theme === 'dark' ? '#1C2029' : '#F3F5F8',
                            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'}`
                          }}
                        >
                          <Plus style={{ 
                            width: '12px', 
                            height: '12px', 
                            color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                          }} />
                        </button>

                        <button
                          onClick={() => onRemoveItem(item.itemId)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all ml-2"
                          style={{
                            background: theme === 'dark' ? '#2A1F1F' : '#FEF2F2',
                            border: `1px solid ${theme === 'dark' ? 'rgba(255, 107, 107, 0.2)' : '#FECACA'}`
                          }}
                        >
                          <Trash2 style={{ 
                            width: '12px', 
                            height: '12px', 
                            color: theme === 'dark' ? '#FF6B6B' : '#DC2626' 
                          }} />
                        </button>
                      </div>

                      {/* Стоимость */}
                      <div className="flex items-center gap-1">
                        <span className="unified-text" style={{ 
                          color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                          fontWeight: 'var(--font-weight-medium)'
                        }}>
                          {item.shopItem!.price * item.quantity}
                        </span>
                        <img src={coinIcon} alt="G-coin" style={{ width: '12px', height: '12px' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Итого и кнопка покупки */}
                <div className="space-y-4 pt-4 border-t" style={{
                  borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'
                }}>
                  {/* Баланс */}
                  <div className="flex justify-between items-center">
                    <span className="unified-text" style={{ 
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                    }}>
                      Ваш баланс:
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="unified-text" style={{ 
                        color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                        fontWeight: 'var(--font-weight-medium)'
                      }}>
                        {userBalance}
                      </span>
                      <img src={coinIcon} alt="G-coin" style={{ width: '12px', height: '12px' }} />
                    </div>
                  </div>

                  {/* Общая стоимость */}
                  <div className="flex justify-between items-center">
                    <span className="unified-text" style={{ 
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                      fontWeight: 'var(--font-weight-medium)'
                    }}>
                      К оплате:
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="unified-text" style={{ 
                        color: canAfford 
                          ? (theme === 'dark' ? '#E8ECF2' : '#0F172A')
                          : (theme === 'dark' ? '#FF6B6B' : '#DC2626'),
                        fontWeight: 'var(--font-weight-medium)',
                        fontSize: '14px'
                      }}>
                        {totalCost}
                      </span>
                      <img src={coinIcon} alt="G-coin" style={{ width: '14px', height: '14px' }} />
                    </div>
                  </div>

                  {/* Предупреждение о недостатке средств */}
                  {!canAfford && (
                    <div className="p-3 rounded-lg" style={{
                      background: theme === 'dark' ? '#2A1F1F' : '#FEF2F2'
                    }}>
                      <span className="unified-text" style={{ 
                        color: theme === 'dark' ? '#FF6B6B' : '#DC2626' 
                      }}>
                        Недостаточно средств для покупки
                      </span>
                    </div>
                  )}

                  {/* Кнопка покупки */}
                  <button
                    onClick={handlePurchase}
                    disabled={!canAfford || isProcessing || cart.length === 0}
                    className="w-full py-3 px-4 rounded-xl transition-all unified-text"
                    style={{
                      background: canAfford && !isProcessing 
                        ? '#2B82FF' 
                        : (theme === 'dark' ? '#1C2029' : '#F3F5F8'),
                      color: canAfford && !isProcessing 
                        ? '#FFFFFF' 
                        : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: canAfford && !isProcessing ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {isProcessing ? 'Обработка...' : 'Оформить заказ'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Контент актуальных заказов */}
        {activeTab === 'current' && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {currentOrders.length === 0 ? (
              <div className="text-center py-8">
                <span className="unified-text" style={{ 
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                }}>
                  Нет актуальных заказов
                </span>
              </div>
            ) : (
              currentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border"
                  style={{
                    background: theme === 'dark' ? '#161A22' : '#FFFFFF',
                    border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'}`
                  }}
                >
                  {/* Заголовок заказа */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="unified-text" style={{ 
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                      fontWeight: 'var(--font-weight-medium)'
                    }}>
                      Заказ #{order.id.slice(-6)}
                    </span>
                    <span
                      className="px-2 py-1 rounded-lg unified-text"
                      style={{
                        background: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  {/* Товары */}
                  <div className="space-y-2 mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '16px' }}>{item.emoji}</span>
                          <span className="unified-text" style={{ 
                            color: theme === 'dark' ? '#E8ECF2' : '#0F172A' 
                          }}>
                            {item.name}
                          </span>
                          {item.quantity > 1 && (
                            <span className="unified-text" style={{ 
                              color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                            }}>
                              x{item.quantity}
                            </span>
                          )}
                        </div>
                        <span className="unified-text" style={{ 
                          color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                          fontWeight: 'var(--font-weight-medium)'
                        }}>
                          {item.price * item.quantity} G
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Дата */}
                  <div className="mb-3">
                    <span className="unified-text" style={{ 
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                    }}>
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  {/* Дополнительная информация */}
                  {order.status === 'approved' && order.trackingInfo && (
                    <div className="mb-3 p-3 rounded-lg" style={{
                      background: theme === 'dark' ? '#1C2029' : '#F3F5F8'
                    }}>
                      <div className="unified-text" style={{ 
                        color: theme === 'dark' ? '#A7B0BD' : '#6B7280',
                        marginBottom: '4px'
                      }}>
                        Информация для отслеживания:
                      </div>
                      <div className="unified-text" style={{ 
                        color: theme === 'dark' ? '#E8ECF2' : '#0F172A' 
                      }}>
                        {order.trackingInfo}
                      </div>
                    </div>
                  )}

                  {/* Кнопка "Получен" для одобренных заказов */}
                  {order.status === 'approved' && (
                    <button
                      onClick={() => handleMarkAsReceived(order.id)}
                      className="w-full py-2 px-4 rounded-lg transition-all unified-text mb-3"
                      style={{
                        background: '#34C759',
                        color: '#FFFFFF',
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                    >
                      Отметить как получен
                    </button>
                  )}

                  {/* Общая сумма */}
                  <div className="flex justify-between items-center pt-3 border-t" style={{
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'
                  }}>
                    <span className="unified-text" style={{ 
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                    }}>
                      Итого:
                    </span>
                    <span className="unified-text" style={{ 
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                      fontWeight: 'var(--font-weight-medium)'
                    }}>
                      {order.total} G
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Контент завершенных заказов */}
        {activeTab === 'completed' && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {completedOrders.length === 0 ? (
              <div className="text-center py-8">
                <span className="unified-text" style={{ 
                  color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                }}>
                  Нет завершенных заказов
                </span>
              </div>
            ) : (
              completedOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border"
                  style={{
                    background: theme === 'dark' ? '#161A22' : '#FFFFFF',
                    border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'}`
                  }}
                >
                  {/* Заголовок заказа */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="unified-text" style={{ 
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                      fontWeight: 'var(--font-weight-medium)'
                    }}>
                      Заказ #{order.id.slice(-6)}
                    </span>
                    <span
                      className="px-2 py-1 rounded-lg unified-text"
                      style={{
                        background: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  {/* Товары */}
                  <div className="space-y-2 mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '16px' }}>{item.emoji}</span>
                          <span className="unified-text" style={{ 
                            color: theme === 'dark' ? '#E8ECF2' : '#0F172A' 
                          }}>
                            {item.name}
                          </span>
                          {item.quantity > 1 && (
                            <span className="unified-text" style={{ 
                              color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                            }}>
                              x{item.quantity}
                            </span>
                          )}
                        </div>
                        <span className="unified-text" style={{ 
                          color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                          fontWeight: 'var(--font-weight-medium)'
                        }}>
                          {item.price * item.quantity} G
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Дата */}
                  <div className="mb-3">
                    <span className="unified-text" style={{ 
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                    }}>
                      {order.completedAt ? (
                        `${formatDate(order.createdAt)} → ${formatDate(order.completedAt)}`
                      ) : (
                        formatDate(order.createdAt)
                      )}
                    </span>
                  </div>

                  {/* Причина отклонения */}
                  {order.status === 'rejected' && order.rejectionReason && (
                    <div className="mb-3 p-3 rounded-lg" style={{
                      background: theme === 'dark' ? '#2A1F1F' : '#FEF2F2'
                    }}>
                      <div className="unified-text" style={{ 
                        color: theme === 'dark' ? '#FF6B6B' : '#DC2626',
                        marginBottom: '4px'
                      }}>
                        Причина отклонения:
                      </div>
                      <div className="unified-text" style={{ 
                        color: theme === 'dark' ? '#E8ECF2' : '#0F172A' 
                      }}>
                        {order.rejectionReason}
                      </div>
                    </div>
                  )}

                  {/* Общая сумма */}
                  <div className="flex justify-between items-center pt-3 border-t" style={{
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#E6E9EF'
                  }}>
                    <span className="unified-text" style={{ 
                      color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
                    }}>
                      Итого:
                    </span>
                    <span className="unified-text" style={{ 
                      color: theme === 'dark' ? '#E8ECF2' : '#0F172A',
                      fontWeight: 'var(--font-weight-medium)'
                    }}>
                      {order.total} G
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </ModalOpaque>
  );
}