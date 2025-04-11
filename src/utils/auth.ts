import { User } from '@/lib/db/models';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

export const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    return {
      id: decoded.userId,
      role: decoded.role as 'admin' | 'customer'
    };
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  return getUserFromToken(token) !== null;
};

export const isAdmin = () => {
  const token = getToken();
  if (!token) return false;
  const user = getUserFromToken(token);
  return user?.role === 'ADMIN';
}; 