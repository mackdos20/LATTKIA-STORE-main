import { categories, subcategories, products, orders, users, 
  saveCategories, saveSubcategories, saveProducts, saveOrders, saveUsers } from './db/mock-data';
import { Category, Subcategory, Product, Order, Discount } from './db/models';
import { User } from './stores/auth-store';

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
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return null;
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      token: 'mock-jwt-token',
    };
  },
  
  // Categories
  getCategories: async (): Promise<Category[]> => {
    await delay(300);
    return categories;
  },
  
  getCategoryById: async (id: string): Promise<Category | undefined> => {
    await delay(200);
    return categories.find(category => category.id === id);
  },
  
  // Subcategories
  getSubcategories: async (): Promise<Subcategory[]> => {
    await delay(300);
    return subcategories;
  },
  
  getSubcategoriesByCategoryId: async (categoryId: string): Promise<Subcategory[]> => {
    await delay(300);
    return subcategories.filter(subcategory => subcategory.categoryId === categoryId);
  },
  
  getSubcategoryById: async (id: string): Promise<Subcategory | undefined> => {
    await delay(200);
    return subcategories.find(subcategory => subcategory.id === id);
  },
  
  // Products
  getProducts: async (): Promise<Product[]> => {
    await delay(500);
    return products;
  },
  
  getProductsBySubcategoryId: async (subcategoryId: string): Promise<Product[]> => {
    await delay(500);
    return products.filter(product => product.subcategoryId === subcategoryId);
  },
  
  getProductById: async (id: string): Promise<Product | undefined> => {
    await delay(300);
    return products.find(product => product.id === id);
  },
  
  getFeaturedProducts: async (): Promise<Product[]> => {
    await delay(400);
    // Return the newest products first
    return [...products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  },
  
  // Orders
  getOrders: async (userId?: string): Promise<Order[]> => {
    await delay(600);
    if (userId) {
      return orders.filter(order => order.userId === userId);
    }
    return orders;
  },
  
  getOrderById: async (id: string): Promise<Order | undefined> => {
    await delay(400);
    return orders.find(order => order.id === id);
  },
  
  createOrder: async (userId: string, items: { productId: string; quantity: number }[]): Promise<Order> => {
    await delay(800);
    
    const orderItems = items.map((item, index) => {
      const product = products.find(p => p.id === item.productId)!;
      
      // Calculate discount
      let price = product.price;
      if (product.discounts && product.discounts.length > 0) {
        const sortedDiscounts = [...product.discounts].sort(
          (a, b) => b.minQuantity - a.minQuantity
        );
        
        const applicableDiscount = sortedDiscounts.find(
          discount => item.quantity >= discount.minQuantity
        );
        
        if (applicableDiscount) {
          price = price * (1 - applicableDiscount.discountPercentage / 100);
        }
      }
      
      return {
        id: `new-${index}`,
        orderId: 'new-order',
        productId: item.productId,
        product,
        quantity: item.quantity,
        price,
      };
    });
    
    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      items: orderItems,
      total,
    };
    
    // In a real app, we would save this to the database
    orders.push(newOrder);
    
    return newOrder;
  },
  
  updateOrderStatus: async (orderId: string, status: Order['status'], expectedDeliveryTime?: string): Promise<Order> => {
    await delay(500);
    
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    const updatedOrder = {
      ...orders[orderIndex],
      status,
      ...(expectedDeliveryTime ? { expectedDeliveryTime } : {}),
    };
    
    orders[orderIndex] = updatedOrder;
    
    return updatedOrder;
  },
  
  // Admin
  createUser: async (userData: Omit<DbUser, 'id'>): Promise<User> => {
    // In a real app, this would make an API call
    // For now, we'll use mock data
    const newUser: DbUser = {
      id: `user${Date.now()}`,
      ...userData,
      role: userData.role || 'customer', // Ensure role is set
    };
    
    // Add to mock data
    users.push(newUser);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  updateUser: async (userId: string, userData: Partial<Omit<DbUser, 'id'>>): Promise<User> => {
    await delay(500);
    
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...userData,
    };
    
    users[userIndex] = updatedUser;
    
    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },
  
  createProduct: async (productData: Omit<Product, 'id'>, imageFile?: File): Promise<Product> => {
    await delay(700);
    
    let imageUrl = productData.image;
    
    if (imageFile) {
      // Convert image to Base64
      const reader = new FileReader();
      imageUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(imageFile);
      });
    }
    
    const newProduct = {
      id: `product-${Date.now()}`,
      ...productData,
      image: imageUrl,
    };
    
    products.push(newProduct);
    saveProducts(products);
    
    return newProduct;
  },
  
  updateProduct: async (id: string, productData: Partial<Product>, imageFile?: File): Promise<Product> => {
    await delay(600);
    
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    let imageUrl = productData.image || products[productIndex].image;
    
    if (imageFile) {
      // Convert image to Base64
      const reader = new FileReader();
      imageUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(imageFile);
      });
    }
    
    const updatedProduct = {
      ...products[productIndex],
      ...productData,
      image: imageUrl,
    };
    
    products[productIndex] = updatedProduct;
    saveProducts(products);
    
    return updatedProduct;
  },
  
  deleteProduct: async (id: string): Promise<void> => {
    await delay(500);
    
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    products.splice(productIndex, 1);
    saveProducts(products);
  },
  
  // Categories and Subcategories management
  createCategory: async (categoryData: Omit<Category, 'id'>, imageFile?: File): Promise<Category> => {
    await delay(500);
    
    let imageUrl = categoryData.image;
    
    if (imageFile) {
      // Convert image to Base64
      const reader = new FileReader();
      imageUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(imageFile);
      });
    }
    
    const newCategory = {
      id: `category-${Date.now()}`,
      ...categoryData,
      image: imageUrl,
    };
    
    categories.push(newCategory);
    saveCategories(categories);
    
    return newCategory;
  },
  
  updateCategory: async (id: string, categoryData: Partial<Category>, imageFile?: File): Promise<Category> => {
    await delay(400);
    
    const categoryIndex = categories.findIndex(category => category.id === id);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }
    
    let imageUrl = categoryData.image || categories[categoryIndex].image;
    
    if (imageFile) {
      // Convert image to Base64
      const reader = new FileReader();
      imageUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(imageFile);
      });
    }
    
    const updatedCategory = {
      ...categories[categoryIndex],
      ...categoryData,
      image: imageUrl,
    };
    
    categories[categoryIndex] = updatedCategory;
    saveCategories(categories);
    
    return updatedCategory;
  },
  
  deleteCategory: async (id: string): Promise<void> => {
    await delay(400);
    
    const categoryIndex = categories.findIndex(category => category.id === id);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }
    
    categories.splice(categoryIndex, 1);
    saveCategories(categories);
  },
  
  createSubcategory: async (subcategoryData: Omit<Subcategory, 'id'>, imageFile?: File): Promise<Subcategory> => {
    await delay(500);
    
    let imageUrl = subcategoryData.image;
    
    if (imageFile) {
      // Convert image to Base64
      const reader = new FileReader();
      imageUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(imageFile);
      });
    }
    
    const newSubcategory = {
      id: `subcategory-${Date.now()}`,
      ...subcategoryData,
      image: imageUrl,
    };
    
    subcategories.push(newSubcategory);
    saveSubcategories(subcategories);
    
    return newSubcategory;
  },
  
  updateSubcategory: async (id: string, subcategoryData: Partial<Subcategory>, imageFile?: File): Promise<Subcategory> => {
    await delay(400);
    
    const subcategoryIndex = subcategories.findIndex(subcategory => subcategory.id === id);
    if (subcategoryIndex === -1) {
      throw new Error('Subcategory not found');
    }
    
    let imageUrl = subcategoryData.image || subcategories[subcategoryIndex].image;
    
    if (imageFile) {
      // Convert image to Base64
      const reader = new FileReader();
      imageUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(imageFile);
      });
    }
    
    const updatedSubcategory = {
      ...subcategories[subcategoryIndex],
      ...subcategoryData,
      image: imageUrl,
    };
    
    subcategories[subcategoryIndex] = updatedSubcategory;
    saveSubcategories(subcategories);
    
    return updatedSubcategory;
  },
  
  deleteSubcategory: async (id: string): Promise<void> => {
    await delay(400);
    
    const subcategoryIndex = subcategories.findIndex(subcategory => subcategory.id === id);
    if (subcategoryIndex === -1) {
      throw new Error('Subcategory not found');
    }
    
    subcategories.splice(subcategoryIndex, 1);
    saveSubcategories(subcategories);
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
    
    const user = users.find(u => u.id === userId);
    if (!user || !user.telegramId) {
      return false;
    }
    
    // In a real app, we would send a message to the Telegram bot API
    console.log(`Sending Telegram notification to ${user.telegramId}: ${message}`);
    
    return true;
  },
};