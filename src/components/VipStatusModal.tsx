import { Package } from './Icons';
import { ModalOpaque } from './ModalOpaque';

interface VipStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  theme?: 'light' | 'dark';
}

export function VipStatusModal({ isOpen, onClose, onApprove, onReject, theme = 'light' }: VipStatusModalProps) {
  return (
    <ModalOpaque
      isOpen={isOpen}
      onClose={onClose}
      title="VIP статус"
      theme={theme}
      actions={
        <div className="flex gap-3">
          <button
            onClick={onReject}
            className="flex-1 transition-colors text-center"
            style={{
              height: '44px',
              borderRadius: '12px',
              backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
              border: theme === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.06)' 
                : '1px solid #E6E9EF',
              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
            }}
          >
            Отменить
          </button>
          <button
            onClick={onApprove}
            className="flex-1 transition-colors text-center"
            style={{
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#2B82FF',
              color: '#ffffff',
              border: 'none'
            }}
          >
            Применить
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Иконка товара */}
        <div className="flex justify-center mb-4">
          <div 
            className="flex items-center justify-center"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: theme === 'dark' ? '#202734' : '#F3F5F8',
              borderRadius: '16px'
            }}
          >
            <Package style={{ width: '32px', height: '32px', color: '#2B82FF' }} />
          </div>
        </div>

        {/* Описание товара */}
        <div className="text-center">
          <div 
            className="mb-2 font-medium"
            style={{ 
              fontSize: '14px',
              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
            }}
          >
            Описание товара
          </div>
          <div 
            className="leading-relaxed"
            style={{ 
              fontSize: '14px',
              color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
            }}
          >
            Статус VIP пользователя на месяц • Приоритетная поддержка • Скидки на все товары
          </div>
        </div>

        {/* Цена */}
        <div className="text-center">
          <div 
            className="mb-1"
            style={{ 
              fontSize: '14px',
              color: theme === 'dark' ? '#A7B0BD' : '#6B7280'
            }}
          >
            Цена:
          </div>
          <div 
            className="font-medium"
            style={{ 
              fontSize: '18px',
              color: theme === 'dark' ? '#E8ECF2' : '#0F172A'
            }}
          >
            200 XP
          </div>
        </div>
      </div>
    </ModalOpaque>
  );
}