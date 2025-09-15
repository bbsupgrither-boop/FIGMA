import { useState } from 'react';
import { Plus, Edit, Trash2, Package, DollarSign } from './Icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  available: boolean;
}

export function AdminShop() {
  const [items, setItems] = useState<ShopItem[]>([
    {
      id: '1',
      name: 'Аватар "Звезда"',
      description: 'Эксклюзивный аватар со звездным дизайном',
      price: 500,
      category: 'Аватары',
      stock: -1, // -1 означает неограниченный запас
      available: true
    },
    {
      id: '2',
      name: 'Бейдж "Легенда"',
      description: 'Особый бейдж для выдающихся достижений',
      price: 1000,
      category: 'Бейджи',
      stock: 50,
      available: true
    },
    {
      id: '3',
      name: 'Тема "Космос"',
      description: 'Космическая тема оформления профиля',
      price: 750,
      category: 'Темы',
      stock: -1,
      available: false
    }
  ]);
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 100,
    category: '',
    stock: -1,
    imageUrl: '',
    available: true
  });

  const handleCreate = () => {
    const newItem: ShopItem = {
      id: Date.now().toString(),
      ...formData
    };
    setItems([...items, newItem]);
    setCreateModalOpen(false);
    setFormData({ name: '', description: '', price: 100, category: '', stock: -1, imageUrl: '', available: true });
  };

  const handleEdit = () => {
    if (selectedItem) {
      const updatedItems = items.map(item =>
        item.id === selectedItem.id
          ? { ...item, ...formData }
          : item
      );
      setItems(updatedItems);
      setEditModalOpen(false);
      setSelectedItem(null);
      setFormData({ name: '', description: '', price: 100, category: '', stock: -1, imageUrl: '', available: true });
    }
  };

  const handleDelete = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  };

  const openEditModal = (item: ShopItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      stock: item.stock,
      imageUrl: item.imageUrl || '',
      available: item.available
    });
    setEditModalOpen(true);
  };

  const toggleAvailability = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id
        ? { ...item, available: !item.available }
        : item
    );
    setItems(updatedItems);
  };

  return (
    <>
      <div className="p-4 space-y-6">
        {/* Заголовок и кнопка создания */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-foreground">Управление магазином</h2>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить товар
          </Button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Всего товаров</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">{items.length}</div>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-medium text-foreground">Доступных</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {items.filter(item => item.available).length}
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-foreground">Недоступных</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {items.filter(item => !item.available).length}
            </div>
          </div>
        </div>

        {/* Список товаров */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center">
              <div className="text-muted-foreground">Товары пока не добавлены</div>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="glass-card p-4 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {item.category}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {item.price} очков
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.available 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {item.available ? 'Доступен' : 'Недоступен'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="text-xs text-muted-foreground">
                      Запас: {item.stock === -1 ? 'Неограниченный' : `${item.stock} шт.`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAvailability(item.id)}
                      className={item.available ? 'text-red-600' : 'text-green-600'}
                    >
                      {item.available ? 'Скрыть' : 'Показать'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Модальное окно создания */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="glass-card border-none max-w-md p-0 [&>button]:hidden">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium text-foreground mb-4">
                Добавить товар
              </DialogTitle>
              <DialogDescription className="sr-only">
                Форма для добавления нового товара в магазин
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Название
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Введите название товара"
                  className="bg-input-background"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Описание
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Введите описание товара"
                  className="bg-input-background min-h-20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Цена (очки)
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="bg-input-background"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Запас
                  </label>
                  <Input
                    type="number"
                    value={formData.stock === -1 ? '' : formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value === '' ? -1 : parseInt(e.target.value) || 0 })}
                    placeholder="Пусто = ∞"
                    className="bg-input-background"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Категория
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Категория товара"
                  className="bg-input-background"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  URL изображения
                </label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="bg-input-background"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="available" className="text-sm font-medium text-foreground/80">
                  Доступен для покупки
                </label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1"
                >
                  Отменить
                </Button>
                <Button
                  onClick={handleCreate}
                  className="flex-1 bg-primary text-primary-foreground"
                  disabled={!formData.name || !formData.description}
                >
                  Добавить
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно редактирования */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="glass-card border-none max-w-md p-0 [&>button]:hidden">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium text-foreground mb-4">
                Редактировать товар
              </DialogTitle>
              <DialogDescription className="sr-only">
                Форма для редактирования существующего товара
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Название
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Введите название товара"
                  className="bg-input-background"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Описание
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Введите описание товара"
                  className="bg-input-background min-h-20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Цена (очки)
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="bg-input-background"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Запас
                  </label>
                  <Input
                    type="number"
                    value={formData.stock === -1 ? '' : formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value === '' ? -1 : parseInt(e.target.value) || 0 })}
                    placeholder="Пусто = ∞"
                    className="bg-input-background"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Категория
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Категория товара"
                  className="bg-input-background"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  URL изображения
                </label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="bg-input-background"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available-edit"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="available-edit" className="text-sm font-medium text-foreground/80">
                  Доступен для покупки
                </label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1"
                >
                  Отменить
                </Button>
                <Button
                  onClick={handleEdit}
                  className="flex-1 bg-primary text-primary-foreground"
                  disabled={!formData.name || !formData.description}
                >
                  Сохранить
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}