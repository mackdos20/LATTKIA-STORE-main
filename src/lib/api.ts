import { PrismaClient } from '@prisma/client';
import { User, Product, Category, Subcategory, Order, OrderItem } from '@/lib/db/models';
import { uploadImage } from '../utils/uploadImage';

const prisma = new PrismaClient();

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Define a type for the database user that includes password
export type DbUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'customer';
  telegramId?: string;
};

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
    await delay(500);
    const user = await getUserByEmail(email);
    if (!user || user.password !== password) return null;
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      token: 'mock-jwt-token',
    };
  },
  
  // User functions
  createUser: async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    return prisma.user.create({
      data: user
    });
  },
  
  getUserByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email }
    });
  },
  
  updateUser: async (id: string, data: Partial<User>) => {
    return prisma.user.update({
      where: { id },
      data
    });
  },
  
  // Product functions
  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    return prisma.product.create({
      data: product
    });
  },
  
  getProducts: async () => {
    return prisma.product.findMany({
      include: {
        category: true,
        subcategory: true
      }
    });
  },
  
  getProductById: async (id: string) => {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true
      }
    });
  },
  
  updateProduct: async (id: string, data: Partial<Product>) => {
    return prisma.product.update({
      where: { id },
      data
    });
  },
  
  deleteProduct: async (id: string) => {
    return prisma.product.delete({
      where: { id }
    });
  },
  
  // Category functions
  createCategory: async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    return prisma.category.create({
      data: category
    });
  },
  
  getCategories: async () => {
    return prisma.category.findMany({
      include: {
        subcategories: true
      }
    });
  },
  
  getCategoryById: async (id: string): Promise<Category | undefined> => {
    await delay(200);
    return prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true
      }
    });
  },
  
  updateCategory: async (id: string, data: Partial<Category>) => {
    return prisma.category.update({
      where: { id },
      data
    });
  },
  
  deleteCategory: async (id: string) => {
    return prisma.category.delete({
      where: { id }
    });
  },
  
  // Subcategory functions
  createSubcategory: async (subcategory: Omit<Subcategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    return prisma.subcategory.create({
      data: subcategory
    });
  },
  
  getSubcategories: async () => {
    return prisma.subcategory.findMany({
      include: {
        category: true
      }
    });
  },
  
  getSubcategoriesByCategoryId: async (categoryId: string): Promise<Subcategory[]> => {
    await delay(300);
    return prisma.subcategory.findMany({
      where: { categoryId },
      include: {
        category: true
      }
    });
  },
  
  getSubcategoryById: async (id: string): Promise<Subcategory | undefined> => {
    await delay(200);
    return prisma.subcategory.findUnique({
      where: { id },
      include: {
        category: true
      }
    });
  },
  
  updateSubcategory: async (id: string, data: Partial<Subcategory>) => {
    return prisma.subcategory.update({
      where: { id },
      data
    });
  },
  
  deleteSubcategory: async (id: string) => {
    return prisma.subcategory.delete({
      where: { id }
    });
  },
  
  // Order functions
  createOrder: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>, items: Omit<OrderItem, 'id'>[]) => {
    return prisma.order.create({
      data: {
        ...order,
        items: {
          create: items
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    });
  },
  
  getOrders: async (userId?: string) => {
    return prisma.order.findMany({
      where: userId ? { userId } : undefined,
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },
  
  getOrderById: async (id: string) => {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    });
  },
  
  updateOrder: async (id: string, data: Partial<Order>) => {
    return prisma.order.update({
      where: { id },
      data
    });
  },
  
  deleteOrder: async (id: string) => {
    return prisma.order.delete({
      where: { id }
    });
  },
  
  // Discounts
  addProductDiscount: async (productId: string, discount: Omit<Discount, 'id' | 'productId'>): Promise<Product> => {
    await delay(500);
    
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    const newDiscount = {
      id: `discount-${Date.now()}`,
      productId,
      ...discount,
    };
    
    const product = products[productIndex];
    const updatedProduct = {
      ...product,
      discounts: [...(product.discounts || []), newDiscount],
    };
    
    products[productIndex] = updatedProduct;
    
    return updatedProduct;
  },
  
  removeProductDiscount: async (productId: string, discountId: string): Promise<Product> => {
    await delay(400);
    
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    const product = products[productIndex];
    if (!product.discounts) {
      throw new Error('Product has no discounts');
    }
    
    const updatedProduct = {
      ...product,
      discounts: product.discounts.filter(discount => discount.id !== discountId),
    };
    
    products[productIndex] = updatedProduct;
    
    return updatedProduct;
  },
  
  // Telegram notifications
  sendTelegramNotification: async (userId: string, message: string): Promise<boolean> => {
    await delay(300);
    
    const user = await getUserByEmail(userId);
    if (!user || !user.telegramId) {
      return false;
    }
    
    // In a real app, we would send a message to the Telegram bot API
    console.log(`Sending Telegram notification to ${user.telegramId}: ${message}`);
    
    return true;
  },
};