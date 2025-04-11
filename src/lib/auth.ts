import { createUser, getUserByEmail } from './api';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch (error) {
    return null;
  }
};

export const register = async (userData: { name: string; email: string; password: string; phone?: string }) => {
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('البريد الإلكتروني مستخدم بالفعل');
  }

  const hashedPassword = await hashPassword(userData.password);
  const user = await createUser({
    ...userData,
    password: hashedPassword,
    role: 'USER'
  });

  const token = generateToken(user.id, user.role);
  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
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