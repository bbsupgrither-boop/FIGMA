export interface ShopItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'bonus' | 'privilege' | 'cosmetic' | 'tool';
  isActive: boolean;
  stock: number;
  emoji: string;
  image?: string;
}

export interface CartItem {
  id: string;
  itemId: string;
  quantity: number;
  addedAt: string;
}

export interface Order {
  id: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    emoji: string;
  }[];
  total: number;
  status: 'processing' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  completedAt?: string;
  userId: string;
  customerName?: string;
  customerTeam?: string;
  trackingInfo?: string;
  rejectionReason?: string;
}

export interface AdminOrder {
  id: string;
  itemName: string;
  itemImage?: string;
  itemPrice: number;
  customerName: string;
  customerTeam: string;
  customerBalance: number;
  orderDate: string;
  status: 'pending' | 'approved' | 'rejected';
  trackingInfo?: string;
  rejectionReason?: string;
}