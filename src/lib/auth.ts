import { api } from './api';
import { User } from '@/lib/db/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Token management
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

// Password hashing
export const hashPassword = async (password: string) => {
  if (!password) throw new Error('كلمة المرور مطلوبة');
  return bcrypt.hash(password, 10);
};

export const comparePasswords = async (password: string, hash: string) => {
  if (!password || !hash) throw new Error('كلمة المرور والتجزئة مطلوبان');
  return bcrypt.compare(password, hash);
};

// JWT functions
export const generateToken = (userId: string, role: 'USER' | 'ADMIN') => {
  if (!userId || !role) throw new Error('معرف المستخدم والدور مطلوبان');
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: 'USER' | 'ADMIN' };
  } catch (error) {
    return null;
  }
};

// Auth functions
export const register = async (userData: { name: string; email: string; password: string; phone?: string }) => {
  // Validate input
  if (!userData.name || !userData.email || !userData.password) {
    throw new Error('جميع الحقول المطلوبة يجب إدخالها');
  }

  if (userData.name.length < 2) {
    throw new Error('الاسم يجب أن يكون على الأقل حرفين');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    throw new Error('البريد الإلكتروني غير صالح');
  }

  if (userData.password.length < 6) {
    throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
  }

  if (userData.phone && !/^\+?[0-9]{10,15}$/.test(userData.phone)) {
    throw new Error('رقم الهاتف غير صالح');
  }

  const existingUser = await api.getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('البريد الإلكتروني مستخدم بالفعل');
  }

  const hashedPassword = await hashPassword(userData.password);
  const user = await api.createUser({
    ...userData,
    password: hashedPassword,
    role: 'USER' as const
  });

  const token = generateToken(user.id, user.role);
  return { user, token };
};

export const login = async (email: string, password: string) => {
  // Validate input
  if (!email || !password) {
    throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
  }

  const user = await api.getUserByEmail(email);
  if (!user) {
    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }

  const isValidPassword = await comparePasswords(password, user.password);
  if (!isValidPassword) {
    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }

  const token = generateToken(user.id, user.role);
  return { user, token };
}; 