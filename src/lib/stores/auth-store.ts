import { create } from 'zustand';
import { User } from '@/lib/db/models';
import { login, register, verifyToken } from '@/lib/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await login(email, password);
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'حدث خطأ أثناء تسجيل الدخول', isLoading: false });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await register(userData);
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'حدث خطأ أثناء التسجيل', isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      localStorage.removeItem('token');
      set({ user: null, token: null });
      return;
    }

    set({
      user: {
        id: decoded.userId,
        role: decoded.role === 'ADMIN' ? 'ADMIN' : 'USER',
        name: '',
        email: '',
        password: '',
        createdAt: new Date(),
        updatedAt: new Date()
      } as User
    });
  }
}));