/**
 * User model represents a user in the system
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Full name of the user */
  name: string;
  /** Email address of the user (must be unique) */
  email: string;
  /** Hashed password of the user */
  password: string;
  /** Phone number of the user (optional) */
  phone?: string;
  /** Role of the user (USER or ADMIN) */
  role: 'USER' | 'ADMIN';
  /** Telegram ID for notifications (optional) */
  telegramId?: string;
  /** Date when the user was created */
  createdAt: Date;
  /** Date when the user was last updated */
  updatedAt: Date;
}

/**
 * Product model represents a product in the store
 */
export interface Product {
  /** Unique identifier for the product */
  id: string;
  /** Name of the product */
  name: string;
  /** Description of the product */
  description: string;
  /** Price of the product */
  price: number;
  /** Cost of the product */
  cost: number;
  /** Stock quantity */
  stock: number;
  /** ID of the subcategory this product belongs to */
  subcategoryId: string;
  /** Subcategory this product belongs to */
  subcategory: Subcategory;
  /** Main product image URL */
  image: string;
  /** Array of product image URLs */
  images: string[];
  /** Product rating */
  rating: number;
  /** Product reviews */
  reviews: any[];
  /** Product discounts */
  discounts: Discount[];
  /** Date when the product was created */
  createdAt: Date;
  /** Date when the product was last updated */
  updatedAt: Date;
}

/**
 * Category model represents a product category
 */
export interface Category {
  /** Unique identifier for the category */
  id: string;
  /** Name of the category */
  name: string;
  /** Description of the category (optional) */
  description?: string;
  /** Image URL for the category (optional) */
  image?: string;
  /** List of products in this category */
  products: Product[];
  /** List of subcategories under this category */
  subcategories: Subcategory[];
  /** Date when the category was created */
  createdAt: Date;
  /** Date when the category was last updated */
  updatedAt: Date;
}

/**
 * Subcategory model represents a product subcategory
 */
export interface Subcategory {
  /** Unique identifier for the subcategory */
  id: string;
  /** Name of the subcategory */
  name: string;
  /** Description of the subcategory (optional) */
  description?: string;
  /** Image URL for the subcategory (optional) */
  image?: string;
  /** ID of the parent category */
  categoryId: string;
  /** Parent category */
  category: Category;
  /** List of products in this subcategory */
  products: Product[];
  /** Date when the subcategory was created */
  createdAt: Date;
  /** Date when the subcategory was last updated */
  updatedAt: Date;
}

/**
 * Order model represents a customer order
 */
export interface Order {
  /** Unique identifier for the order */
  id: string;
  /** ID of the user who placed the order */
  userId: string;
  /** User who placed the order */
  user: User;
  /** Current status of the order */
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  /** Total amount of the order */
  total: number;
  /** List of items in the order */
  items: OrderItem[];
  /** Expected delivery date (optional) */
  expectedDeliveryTime?: Date;
  /** Date when the order was created */
  createdAt: Date;
  /** Date when the order was last updated */
  updatedAt: Date;
}

/**
 * OrderItem model represents an item in an order
 */
export interface OrderItem {
  /** Unique identifier for the order item */
  id: string;
  /** ID of the order this item belongs to */
  orderId: string;
  /** Order this item belongs to */
  order: Order;
  /** ID of the product */
  productId: string;
  /** Product details */
  product: Product;
  /** Quantity of the product */
  quantity: number;
  /** Price of the product at the time of order */
  price: number;
}

/**
 * Discount model represents a discount for a product
 */
export interface Discount {
  /** Unique identifier for the discount */
  id: string;
  /** ID of the product this discount applies to */
  productId: string;
  /** Minimum quantity required for the discount */
  minQuantity: number;
  /** Discount percentage */
  discountPercentage: number;
}

export interface Review {
  /** Unique identifier for the review */
  id: string;
  /** ID of the user who wrote the review */
  userId: string;
  /** Name of the user who wrote the review */
  userName: string;
  /** Rating (1-5) */
  rating: number;
  /** Review comment */
  comment: string;
  /** Date when the review was created */
  createdAt: Date;
}

// Default values for optional fields
export const defaultValues = {
  User: {
    role: 'USER' as const,
    phone: '',
    telegramId: '',
  },
  Product: {
    image: '',
    stock: 0,
    cost: 0,
  },
  Category: {
    description: '',
    image: '',
  },
  Subcategory: {
    description: '',
    image: '',
  },
  Order: {
    status: 'PENDING' as const,
    expectedDeliveryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
};