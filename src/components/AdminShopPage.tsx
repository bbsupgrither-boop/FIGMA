import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, X, Upload, ArrowUpDown, Package } from './Icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShopItem } from '../types/shop';

interface AdminShopPageProps {
  onBack: () => void;
  onNavigateToSection: (section: string) => void;
  onNavigateToModeration?: () => void;
  shopItems: ShopItem[];
  setShopItems: (items: ShopItem[]) => void;
}

export function AdminShopPage({ onBack, onNavigateToSection, onNavigateToModeration, shopItems, setShopItems }: AdminShopPageProps) {
  // Товары теперь управляются через глобальное состояние
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');



  const categories = [
    { value: 'bonus', label: 'Бонус' },
    { value: 'privilege', label: 'Привилегия' },
    { value: 'cosmetic', label: 'Косметика' },
    { value: 'tool', label: 'Инструмент' }
  ];

  const sortedItems = [...shopItems].sort((a, b) => {
    return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
  });

  const handleEditItem = (item: ShopItem) => {
    setSelectedItem(item);
    setShowEditItem(true);
  };

  const handleItemClick = (item: ShopItem) => {
    setSelectedItem(item);
    setShowEditItem(true);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDeleteItem = (itemId: string) => {
    setShopItems(prev => prev.filter(item => item.id !== itemId));
  };



  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        
        {/* Управление - Auto Layout контейнер */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px', // Auto layout горизонтальный
            marginBottom: '16px',
            overflow: 'hidden', // Clip content
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <button
            onClick={() => setShowAddItem(true)}
            className="glass-card unified-button"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              color: 'var(--foreground)',
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0, // Hug contents
              overflow: 'hidden' // Clip content
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Plus 
              style={{ 
                width: '16px', 
                height: '16px',
                flexShrink: 0
              }} 
            />
            Доб. товар
          </button>
          
          <button
            onClick={() => onNavigateToModeration?.()}
            className="glass-card unified-button"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              color: 'var(--foreground)',
              transition: 'background-color 0.2s ease',
              flexShrink: 0, // Hug contents
              overflow: 'hidden' // Clip content
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Одобрить
          </button>
        </div>
      </div>

      {/* Содержимое */}
      <div className="px-6 space-y-6">
        {/* Секция товаров - Auto Layout контейнер */}
        <div 
          className="glass-card apple-shadow"
          style={{
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column', // Auto layout вертикальный
            gap: '16px', // Равномерный gap
            overflow: 'hidden', // Clip content
            boxSizing: 'border-box'
          }}
        >
          {/* Заголовок с кнопкой сортировки - Auto Layout горизонтальный */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px', // Auto layout горизонтальный
              overflow: 'hidden', // Clip content
              width: '100%'
            }}
          >
            <h2 className="unified-heading" style={{ color: 'var(--foreground)', flex: '1' }}>
              Доступные товары
            </h2>
            <button
              onClick={toggleSortOrder}
              className="glass-card unified-button"
              title={`Сортировать по стоимости ${sortOrder === 'asc' ? 'по убыванию' : 'по возрастанию'}`}
              style={{
                padding: '8px',
                borderRadius: '8px',
                transition: 'background-color 0.2s ease',
                flexShrink: 0, // Hug contents
                overflow: 'hidden' // Clip content
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowUpDown 
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  color: 'var(--muted-foreground)',
                  flexShrink: 0
                }} 
              />
            </button>
          </div>

          {/* Список товаров - Auto Layout вертикальный */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px', // Auto layout вертикальный
              overflow: 'hidden', // Clip content
              width: '100%'
            }}
          >
            {sortedItems.map((item) => (
              <div 
                key={item.id} 
                className="unified-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px', // Auto layout горизонтальный
                  padding: '12px',
                  border: '1px solid rgba(var(--border), 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  overflow: 'hidden', // Clip content
                  boxSizing: 'border-box'
                }}
                onClick={() => handleItemClick(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px', // Auto layout горизонтальный
                    flex: '1',
                    overflow: 'hidden' // Clip content
                  }}
                >
                  {/* Картинка товара */}
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'var(--secondary)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden', // Clip content
                      flexShrink: 0 // Hug contents
                    }}
                  >
                    {item.image ? (
                      <ImageWithFallback 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package 
                        style={{ 
                          width: '20px', 
                          height: '20px', 
                          color: 'var(--primary)',
                          flexShrink: 0
                        }} 
                      />
                    )}
                  </div>
                  <div 
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      overflow: 'hidden', // Clip content
                      flex: '1'
                    }}
                  >
                    <div 
                      className="unified-text"
                      style={{
                        color: 'var(--foreground)',
                        fontWeight: 'var(--font-weight-medium)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.title}
                    </div>
                    <div 
                      className="unified-text"
                      style={{
                        color: 'var(--muted-foreground)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Стоимость: {item.price}g
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Логика покупки будет добавлена позже
                  }}
                  className="glass-card unified-button"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    color: 'var(--foreground)',
                    transition: 'background-color 0.2s ease',
                    flexShrink: 0, // Hug contents
                    overflow: 'hidden' // Clip content
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Купить
                </button>
              </div>
            ))}
            {sortedItems.length === 0 && (
              <div 
                className="unified-text"
                style={{
                  textAlign: 'center',
                  color: 'var(--muted-foreground)',
                  padding: '32px 0',
                  overflow: 'hidden' // Clip content
                }}
              >
                Нет товаров для отображения
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно добавления товара */}
      {showAddItem && (
        <ShopItemModal
          isEdit={false}
          item={null}
          onClose={() => setShowAddItem(false)}
          onSave={(itemData) => {
            console.log('Получены данные для добавления товара:', itemData);
            const newItem: ShopItem = {
              id: Date.now().toString(),
              ...itemData,
              isActive: true
            };
            console.log('Новый товар:', newItem);
            setShopItems(prev => {
              const updated = [...prev, newItem];
              console.log('Обновленный список товаров:', updated);
              return updated;
            });
            setShowAddItem(false);
          }}
          categories={categories}
        />
      )}

      {/* Модальное окно редактирования товара */}
      {showEditItem && selectedItem && (
        <ShopItemModal
          isEdit={true}
          item={selectedItem}
          onClose={() => {
            setShowEditItem(false);
            setSelectedItem(null);
          }}
          onSave={(itemData) => {
            console.log('Получены данные для редактирования товара:', itemData);
            console.log('ID редактируемого товара:', selectedItem.id);
            setShopItems(prev => {
              const updated = prev.map(item => 
                item.id === selectedItem.id 
                  ? { ...item, ...itemData }
                  : item
              );
              console.log('Обновленный список товаров после редактирования:', updated);
              return updated;
            });
            setShowEditItem(false);
            setSelectedItem(null);
          }}
          onDelete={() => {
            setShopItems(prev => prev.filter(item => item.id !== selectedItem.id));
            setShowEditItem(false);
            setSelectedItem(null);
          }}
          categories={categories}
        />
      )}


    </div>
  );
}

interface ShopItemModalProps {
  isEdit: boolean;
  item: ShopItem | null;
  onClose: () => void;
  onSave: (itemData: Omit<ShopItem, 'id' | 'isActive'>) => void;
  onDelete?: () => void;
  categories: Array<{ value: string; label: string }>;
}

function ShopItemModal({ isEdit, item, onClose, onSave, onDelete, categories }: ShopItemModalProps) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    title: item?.name || '', // Дублируем для совместимости
    price: item?.price || 0,
    description: item?.description || '',
    category: item?.category || 'bonus' as const,
    image: item?.image || '',
    stock: item?.stock || 0,
    emoji: item?.emoji || '📦'
  });
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  // Глобальный блок HTML5 валидации для этого модального окна
  useEffect(() => {
    const handleInvalid = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('HTML5 validation blocked');
    };

    document.addEventListener('invalid', handleInvalid, true);
    
    return () => {
      document.removeEventListener('invalid', handleInvalid, true);
    };
  }, []);

  // Простая блокировка отправки формы без нарушения ��стальных событий
  const preventFormSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Более мягкие проверки - устанавливаем значения по умолчанию вместо блокировки
    const finalData = {
      name: formData.name.trim() || formData.title.trim() || 'Новый товар',
      price: formData.price > 0 ? formData.price : 1,
      description: formData.description,
      category: formData.category,
      image: formData.image,
      stock: formData.stock >= 0 ? formData.stock : 0,
      emoji: formData.emoji
    };
    
    console.log('Сохранение товара:', finalData);
    onSave(finalData);
  };

  const handleDelete = () => {
    // Временно убираем подтверждение удаления
    onDelete && onDelete();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('image', result);
      };
      reader.readAsDataURL(file);
    }
  };



  return (
    <Dialog 
      open={true} 
      onOpenChange={(open) => !open && onClose()}
      modal={true}
    >
      <DialogContent 
        className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl"
        onInvalid={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div
          onInvalid={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Dialog validation blocked');
          }}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Dialog submit blocked');
          }}
        >
        <DialogTitle className="sr-only">
          {isEdit ? 'Редактирование товара' : 'Добавле��ие товара'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Модальное окно для {isEdit ? 'редактирования существующего' : 'добавления нового'} товара в магазин с возможностью настройки названия, цены, категории и изображения
        </DialogDescription>
        <form 
          className="p-6"
          noValidate
          autoComplete="off"
          onSubmit={preventFormSubmit}
          onInvalid={(e) => e.preventDefault()}
          data-lpignore="true"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground text-center flex-1">
              {isEdit ? item?.name || 'Товар' : 'Добавление товара'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              formNoValidate
            >
              <X className="w-5 h-5 text-foreground/70" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(80vh-200px)] space-y-4">
            {/* Картинка товара и описание */}
            <div className="flex gap-4">
              {/* Картинка */}
              <div className="relative">
                <div 
                  className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {formData.image ? (
                    <ImageWithFallback 
                      src={formData.image} 
                      alt={formData.name || formData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  tabIndex={-1}
                />
              </div>
              
              {/* Описание */}
              <div className="flex-1 glass-card rounded-2xl p-3">
                <div className="text-sm font-medium text-foreground mb-2">Описание товара</div>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="• Подзадача"
                  className="w-full bg-transparent text-sm text-muted-foreground resize-none border-none outline-none"
                  rows={3}
                  autoComplete="off"
                  data-lpignore="true"
                  onInvalid={(e) => e.preventDefault()}
                />
              </div>
            </div>
            {/* Изменение цены (только для редактирования) */}
            {isEdit && (
              <div className="text-center">
                {!isEditingPrice ? (
                  <div
                    className="inline-block glass-card rounded-2xl px-4 py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => setIsEditingPrice(true)}
                  >
                    <div className="text-sm text-muted-foreground mb-1">Цена:</div>
                    <div className="font-medium text-foreground">
                      {formData.price}g
                    </div>
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl p-4">
                    <div className="text-sm font-medium text-foreground/80 mb-3 text-center">
                      Изменить стоимость товара
                    </div>
                    <div className="flex gap-3 mb-4">
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          handleInputChange('price', parseInt(value) || 0);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        }}
                        placeholder="0"
                        className="flex-1 p-3 bg-input-background border border-border rounded-2xl text-sm text-center"
                        autoComplete="off"
                        data-lpignore="true"
                        onInvalid={(e) => e.preventDefault()}
                      />
                      <div className="w-16 p-3 bg-input-background border border-border rounded-2xl text-sm text-center text-muted-foreground">
                        G
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingPrice(false)}
                        className="flex-1"
                        formNoValidate
                      >
                        Отменить
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setIsEditingPrice(false)}
                        className="flex-1 bg-primary text-primary-foreground"
                        formNoValidate
                      >
                        Применить
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isEdit && (
              <>
                {/* Название товара */}
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Название товара
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      handleInputChange('name', e.target.value);
                      handleInputChange('title', e.target.value); // Синхронизируем для совместимости
                    }}
                    placeholder="Введите название товара..."
                    className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm"
                    autoComplete="off"
                    data-lpignore="true"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    onInvalid={(e) => e.preventDefault()}
                  />
                </div>

                {/* Цена */}
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Цена (G-монеты)
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange('price', parseInt(value) || 0);
                    }}
                    placeholder="0"
                    className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm"
                    autoComplete="off"
                    data-lpignore="true"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    onInvalid={(e) => e.preventDefault()}
                  />
                </div>

                {/* Наличие товара */}
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Количество в наличии
                  </label>
                  <input
                    type="text"
                    value={formData.stock}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange('stock', parseInt(value) || 0);
                    }}
                    placeholder="0"
                    className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm"
                    autoComplete="off"
                    data-lpignore="true"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    onInvalid={(e) => e.preventDefault()}
                  />
                </div>

                {/* Эмодзи товара */}
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Эмодзи товара
                  </label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => handleInputChange('emoji', e.target.value)}
                    placeholder="📦"
                    className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm"
                    autoComplete="off"
                    data-lpignore="true"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    onInvalid={(e) => e.preventDefault()}
                  />
                </div>

                {/* Категория */}
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Категория
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm"
                    autoComplete="off"
                    data-lpignore="true"
                    onInvalid={(e) => e.preventDefault()}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Кнопки - Auto Layout контейнер */}
          <div 
            style={{
              display: isEdit ? 'grid' : 'flex',
              gridTemplateColumns: isEdit ? '1fr 1fr 1fr' : undefined,
              gap: '12px', // Равномерный gap
              paddingTop: '16px',
              borderTop: '1px solid rgba(var(--border), 0.2)',
              marginTop: '16px',
              overflow: 'hidden', // Clip content
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="unified-button"
              style={{
                flex: isEdit ? undefined : '1',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                flexShrink: 0, // Hug contents
                overflow: 'hidden' // Clip content
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(var(--muted), 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Отменить
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="unified-button"
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  color: 'var(--destructive)',
                  border: '1px solid var(--destructive)',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  flexShrink: 0, // Hug contents
                  overflow: 'hidden' // Clip content
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--destructive)';
                  e.currentTarget.style.color = 'var(--destructive-foreground)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--destructive)';
                }}
              >
                Удалить
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                console.log('Кнопка сохранения нажата, isEdit:', isEdit);
                console.log('Текущие данные формы:', formData);
                handleSave();
              }}
              className="unified-button"
              style={{
                flex: isEdit ? undefined : '1',
                padding: '12px 16px',
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                border: 'none',
                borderRadius: '8px',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer',
                flexShrink: 0, // Hug contents
                overflow: 'hidden' // Clip content
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(var(--primary), 0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
              }}
            >
              {isEdit ? 'Применить' : 'Добавить'}
            </button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}