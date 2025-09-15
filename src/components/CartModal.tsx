import { useState } from 'react';
import { ModalOpaque } from './ModalOpaque';
import { CartItem, ShopItem } from '../types/shop';
import { Trash2, Plus, Minus } from './Icons';
import coinIcon from 'figma:asset/29d513144bb95c08c031f3604ac2dd2e7bee6450.png';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  shopItems: ShopItem[];
  userBalance: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPurchase: () => void;
  theme?: 'light' | 'dark';
}

export function CartModal({ 
  isOpen, 
  onClose, 
  cart, 
  shopItems, 
  userBalance,
  onUpdateQuantity,
  onRemoveItem,
  onPurchase,
  theme = 'light' 
}: CartModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Получаем информацию о товарах в корзине
  const cartWithItems = cart.map(cartItem => {
    const shopItem = shopItems.find(item => item.id === cartItem.itemId);
    return {
      ...cartItem,
      shopItem
    };
  }).filter(item => item.shopItem);

  // Рассчитываем общую стоимость
  const totalCost = cartWithItems.reduce((sum, item) => 
    sum + (item.shopItem!.price * item.quantity), 0
  );

  const canAfford = userBalance >= totalCost;

  const handlePurchase = async () => {
    if (!canAfford || isProcessing || cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onPurchase();
      onClose();
    } catch (error) {
      console.error('Ошибка при покупке:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOpaque 
      isOpen={isOpen} 
      onClose={onClose}
      title="Корзина"
      theme={theme}
    >
      <div className="space-y-4">
        {cart.length === 0 ? (
          <div className="text-center py-8">
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
    </ModalOpaque>
  );
}