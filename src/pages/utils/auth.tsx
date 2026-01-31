import type { User } from './types';
import mockData from '../mockData.json';

export const authenticateUser = (email: string, password: string): User | null => {
  const user = mockData.users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  return null;
};

export const setAuthToken = (user: User): void => {
  localStorage.setItem('authToken', JSON.stringify(user));
};

export const getAuthToken = (): User | null => {
  const token = localStorage.getItem('authToken');
  return token ? JSON.parse(token) : null;
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};