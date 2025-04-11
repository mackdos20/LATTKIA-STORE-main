import { User, Product, Category, Subcategory, Order, OrderItem } from '@/lib/db/models';
import { getToken } from './auth';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'حدث خطأ أثناء معالجة الطلب';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch (e) {
      // إذا فشل تحويل JSON، نستخدم رسالة الخطأ الافتراضية
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await delay(500);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
  
  // User functions
  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    telegramId?: string;
    role: 'USER' | 'ADMIN';
  }) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  getUserByEmail: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/users/email/${email}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateUser: async (id: string, data: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  // Product functions
  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    return handleResponse(response);
  },
  
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  getProductById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  updateProduct: async (id: string, data: Partial<Product>) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  deleteProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  // Category functions
  createCategory: async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(category),
    });
    return handleResponse(response);
  },
  
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  getCategoryById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  updateCategory: async (id: string, data: Partial<Category>) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  deleteCategory: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  // Subcategory functions
  createSubcategory: async (subcategory: Omit<Subcategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch(`${API_BASE_URL}/subcategories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(subcategory),
    });
    return handleResponse(response);
  },
  
  getSubcategories: async () => {
    const response = await fetch(`${API_BASE_URL}/subcategories`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  getSubcategoriesByCategoryId: async (categoryId: string) => {
    const response = await fetch(`${API_BASE_URL}/subcategories?categoryId=${categoryId}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  getSubcategoryById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  updateSubcategory: async (id: string, data: Partial<Subcategory>) => {
    const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  deleteSubcategory: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  // Order functions
  createOrder: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>, items: Omit<OrderItem, 'id'>[]) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ order, items }),
    });
    return handleResponse(response);
  },
  
  getOrders: async (userId?: string) => {
    const url = userId ? `${API_BASE_URL}/orders?userId=${userId}` : `${API_BASE_URL}/orders`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  getOrderById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  updateOrder: async (id: string, data: Partial<Order>) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  deleteOrder: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  sendWelcomeEmail: async (email: string, data: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/users/welcome-email`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, data }),
    });
    return handleResponse(response);
  },

  sendTelegramNotification: async (userId: string, message: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/telegram-notification`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message }),
    });
    return handleResponse(response);
  },
};