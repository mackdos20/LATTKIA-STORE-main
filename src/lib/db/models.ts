export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  category: Category;
  subcategoryId?: string;
  subcategory?: Subcategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  products: Product[];
  subcategories: Subcategory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  categoryId: string;
  category: Category;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  user: User;
  status: 'PENDING' | 'APPROVED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
  total: number;
  items: OrderItem[];
  expectedDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  order: Order;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}