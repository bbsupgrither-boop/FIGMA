import { useState, useMemo } from 'react';
import { ModalOpaque } from './ModalOpaque';
import { Order } from '../types/shop';
import { X } from './Icons';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  theme?: 'light' | 'dark';
}

export function OrdersModal({ 
  isOpen, 
  onClose, 
  orders, 
  onUpdateOrder,
  theme = 'light' 
}: OrdersModalProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'completed'>('current');

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

  const displayOrders = activeTab === 'current' ? currentOrders : completedOrders;

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
      title="Заказы"
      theme={theme}
    >
      <div className="space-y-4">
        {/* Вкладки */}
        <div className="flex rounded-xl p-1" style={{
          background: theme === 'dark' ? '#1C2029' : '#F3F5F8'
        }}>
          <button
            onClick={() => setActiveTab('current')}
            className="flex-1 py-2 px-4 rounded-lg transition-all unified-text"
            style={{
              background: activeTab === 'current' 
                ? (theme === 'dark' ? '#2B82FF' : '#2B82FF')
                : 'transparent',
              color: activeTab === 'current' 
                ? '#FFFFFF' 
                : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
              fontWeight: activeTab === 'current' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'
            }}
          >
            Актуальные {currentOrders.length > 0 && `(${currentOrders.length})`}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className="flex-1 py-2 px-4 rounded-lg transition-all unified-text"
            style={{
              background: activeTab === 'completed' 
                ? (theme === 'dark' ? '#2B82FF' : '#2B82FF')
                : 'transparent',
              color: activeTab === 'completed' 
                ? '#FFFFFF' 
                : (theme === 'dark' ? '#A7B0BD' : '#6B7280'),
              fontWeight: activeTab === 'completed' ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'
            }}
          >
            Завершенные {completedOrders.length > 0 && `(${completedOrders.length})`}
          </button>
        </div>

        {/* Список заказов */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {displayOrders.length === 0 ? (
            <div className="text-center py-8">
              <span className="unified-text" style={{ 
                color: theme === 'dark' ? '#A7B0BD' : '#6B7280' 
              }}>
                {activeTab === 'current' ? 'Нет актуальных заказов' : 'Нет завершенных заказов'}
              </span>
            </div>
          ) : (
            displayOrders.map((order) => (
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
                    {activeTab === 'completed' && order.completedAt ? (
                      `${formatDate(order.createdAt)} → ${formatDate(order.completedAt)}`
                    ) : (
                      formatDate(order.createdAt)
                    )}
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

                {/* Кнопка "Получен" для одобренных заказов */}
                {order.status === 'approved' && (
                  <button
                    onClick={() => handleMarkAsReceived(order.id)}
                    className="w-full py-2 px-4 rounded-lg transition-all unified-text"
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
      </div>
    </ModalOpaque>
  );
}