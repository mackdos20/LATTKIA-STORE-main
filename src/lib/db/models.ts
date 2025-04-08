export type Category = {
  id: string;
  name: string;
  image: string;
};

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  subcategoryId: string;
  image: string;
  categoryId: string;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  discounts?: Discount[];
};

export type Discount = {
  id: string;
  productId: string;
  minQuantity: number;
  discountPercentage: number;
};

export type Order = {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
  expectedDeliveryTime?: string;
  items: OrderItem[];
  total: number;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
};