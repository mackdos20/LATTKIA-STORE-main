import { Category, Subcategory, Product, Order } from './models';
import { DbUser } from '../api';

// Function to load data from localStorage or use default data
const loadData = <T>(key: string, defaultData: T[]): T[] => {
  if (typeof window === 'undefined') return defaultData;
  
  const storedData = localStorage.getItem(key);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage:`, error);
      return defaultData;
    }
  }
  return defaultData;
};

// Function to save data to localStorage
const saveData = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

// Mock Categories
export const categories: Category[] = loadData('categories', [
  {
    id: '1',
    name: 'Chargers',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Phone Cases',
    image: 'https://images.unsplash.com/photo-1541877590-a1c8d5a2d9e9?q=80&w=500&auto=format&fit=crop',
  },
]);

// Mock Subcategories
export const subcategories: Subcategory[] = loadData('subcategories', [
  {
    id: '1',
    name: '25W Chargers',
    categoryId: '1',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '2',
    name: '45W Chargers',
    categoryId: '1',
    image: 'https://images.unsplash.com/photo-1610792516775-01de03eae630?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Wireless Headphones',
    categoryId: '2',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Wired Headphones',
    categoryId: '2',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'iPhone Cases',
    categoryId: '3',
    image: 'https://images.unsplash.com/photo-1541877590-a1c8d5a2d9e9?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '6',
    name: 'Samsung Cases',
    categoryId: '3',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=500&auto=format&fit=crop',
  },
]);

// Mock Products
export const products: Product[] = loadData('products', [
  {
    id: '1',
    name: 'iPhone 14 Pro',
    description: 'Latest iPhone model with advanced features',
    price: 999,
    cost: 750,
    stock: 50,
    subcategoryId: '1',
    categoryId: 'phones',
    image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?q=80&w=500&auto=format&fit=crop',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    discounts: [
      { id: '1', productId: '1', minQuantity: 5, discountPercentage: 5 },
      { id: '2', productId: '1', minQuantity: 10, discountPercentage: 10 },
    ],
  },
  {
    id: '2',
    name: 'Samsung Galaxy S23',
    description: 'Flagship Android smartphone with premium features',
    price: 899,
    cost: 650,
    stock: 75,
    subcategoryId: '2',
    categoryId: 'phones',
    image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?q=80&w=500&auto=format&fit=crop',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    discounts: [
      { id: '3', productId: '2', minQuantity: 5, discountPercentage: 5 },
      { id: '4', productId: '2', minQuantity: 15, discountPercentage: 12 },
    ],
  },
  {
    id: '3',
    name: 'Apple Watch Series 8',
    description: 'Advanced smartwatch with health monitoring',
    price: 399,
    cost: 280,
    stock: 100,
    subcategoryId: '3',
    categoryId: 'wearables',
    image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?q=80&w=500&auto=format&fit=crop',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    discounts: [
      { id: '5', productId: '3', minQuantity: 8, discountPercentage: 7 },
      { id: '6', productId: '3', minQuantity: 20, discountPercentage: 15 },
    ],
  },
  {
    id: '4',
    name: 'Wireless Bluetooth Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation',
    price: 35,
    cost: 20,
    stock: 120,
    subcategoryId: '3',
    categoryId: 'accessories',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    discounts: [
      { id: '8', productId: '4', minQuantity: 10, discountPercentage: 8 },
      { id: '9', productId: '4', minQuantity: 25, discountPercentage: 15 },
    ],
  },
  {
    id: '5',
    name: 'Premium Wired Headphones',
    description: 'High-fidelity wired headphones with microphone',
    price: 20,
    cost: 12,
    stock: 90,
    subcategoryId: '4',
    categoryId: 'accessories',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=500&auto=format&fit=crop',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    discounts: [
      { id: '10', productId: '5', minQuantity: 15, discountPercentage: 10 },
      { id: '11', productId: '5', minQuantity: 30, discountPercentage: 20 },
    ],
  },
  {
    id: '6',
    name: 'iPhone 14 Pro Silicone Case',
    description: 'Premium silicone case for iPhone 14 Pro',
    price: 15,
    cost: 5,
    stock: 150,
    subcategoryId: '5',
    categoryId: 'accessories',
    image: 'https://images.unsplash.com/photo-1541877590-a1c8d5a2d9e9?q=80&w=500&auto=format&fit=crop',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    discounts: [
      { id: '12', productId: '6', minQuantity: 20, discountPercentage: 10 },
      { id: '13', productId: '6', minQuantity: 50, discountPercentage: 25 },
    ],
  },
  {
    id: '7',
    name: 'Samsung S23 Ultra Clear Case',
    description: 'Transparent protective case for Samsung S23 Ultra',
    price: 12,
    cost: 4,
    stock: 180,
    subcategoryId: '6',
    categoryId: 'accessories',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=500&auto=format&fit=crop',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    discounts: [
      { id: '14', productId: '7', minQuantity: 25, discountPercentage: 15 },
      { id: '15', productId: '7', minQuantity: 60, discountPercentage: 30 },
    ],
  },
]);

// Mock Orders
export const orders: Order[] = loadData('orders', [
  {
    id: '1',
    userId: 'customer1',
    status: 'approved',
    createdAt: '2023-10-15T10:30:00Z',
    expectedDeliveryTime: '2023-10-18T14:00:00Z',
    items: [
      {
        id: '1',
        orderId: '1',
        productId: '1',
        product: products[0],
        quantity: 15,
        price: products[0].price * 0.95, // 5% discount
      },
      {
        id: '2',
        orderId: '1',
        productId: '4',
        product: products[3],
        quantity: 10,
        price: products[3].price * 0.92, // 8% discount
      },
    ],
    total: products[0].price * 0.95 * 15 + products[3].price * 0.92 * 10,
  },
  {
    id: '2',
    userId: 'customer1',
    status: 'pending',
    createdAt: '2023-10-17T14:45:00Z',
    items: [
      {
        id: '3',
        orderId: '2',
        productId: '6',
        product: products[5],
        quantity: 30,
        price: products[5].price * 0.9, // 10% discount
      },
    ],
    total: products[5].price * 0.9 * 30,
  },
]);

// Mock Users
export const users: DbUser[] = loadData('users', [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, this would be hashed
    phone: '+1234567890',
    role: 'admin' as const,
  },
  {
    id: 'zain',
    name: 'زكوووان عرصا',
    email: 'zain@gmail.com',
    password: 'zainhadad', // In a real app, this would be hashed
    phone: '+963988227473',
    role: 'customer' as const,
    telegramId: '@storeowner',
  },
]);

// Export save functions to be used in api.ts
export const saveCategories = (data: Category[]) => saveData('categories', data);
export const saveSubcategories = (data: Subcategory[]) => saveData('subcategories', data);
export const saveProducts = (data: Product[]) => saveData('products', data);
export const saveOrders = (data: Order[]) => saveData('orders', data);
export const saveUsers = (data: DbUser[]) => saveData('users', data);