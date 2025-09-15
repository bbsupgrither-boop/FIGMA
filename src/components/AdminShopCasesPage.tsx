import { useState } from 'react';
import { ArrowLeft, Plus, Settings, Package, ShoppingBag, Box } from './Icons';
import { AdminShopPage } from './AdminShopPage';
import { AdminCasesPage } from './AdminCasesPage';
import { ShopModerationPage } from './ShopModerationPage';
import { ShopItem, Order } from '../types/shop';
import { CaseType, UserCase } from '../types/cases';

interface AdminShopCasesPageProps {
  onBack: () => void;
  shopItems: ShopItem[];
  setShopItems: (items: ShopItem[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  cases: CaseType[];
  setCases: (cases: CaseType[]) => void;
  userCases: UserCase[];
  setUserCases: (userCases: UserCase[]) => void;
  onUpdateUserBalance?: (userId: string, amount: number) => void;
}

export function AdminShopCasesPage({
  onBack,
  shopItems,
  setShopItems,
  orders,
  setOrders,
  cases,
  setCases,
  userCases,
  setUserCases,
  onUpdateUserBalance
}: AdminShopCasesPageProps) {
  const [activeTab, setActiveTab] = useState<'shop' | 'cases' | 'moderation'>('shop');
  const [currentShopSection, setCurrentShopSection] = useState('main');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'shop':
        return (
          <AdminShopPage 
            onBack={onBack}
            onNavigateToSection={(section) => setCurrentShopSection(section)}
            onNavigateToModeration={() => setActiveTab('moderation')}
            shopItems={shopItems}
            setShopItems={setShopItems}
          />
        );
        
      case 'cases':
        return (
          <AdminCasesPage 
            theme="dark"
            cases={cases}
            setCases={setCases}
          />
        );
        
      case 'moderation':
        return (
          <ShopModerationPage 
            onBack={() => setActiveTab('shop')}
            orders={orders}
            setOrders={setOrders}
            onUpdateUserBalance={onUpdateUserBalance}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">

          <div>
            <h1 className="unified-heading text-foreground">Магазин</h1>
            <p className="unified-text text-muted-foreground">Управление товарами и кейсами</p>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="p-4 max-w-md mx-auto">
        <div className="flex mb-6 p-1 glass-card rounded-xl">
          {[
            { key: 'shop', label: 'Товары', icon: ShoppingBag },
            { key: 'cases', label: 'Кейсы', icon: Box },
            { key: 'moderation', label: 'Заказы', icon: Package }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all unified-button ${
                activeTab === key ? 'bg-primary text-white apple-shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon style={{ width: '16px', height: '16px' }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Содержимое вкладки */}
      <div className="max-w-md mx-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}