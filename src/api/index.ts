import api from './index';
import { LoginCredentials, RegisterCredentials } from '../types/auth.types';

export const login = (credentials: LoginCredentials) => {
  return api.post('/auth/login', credentials);
};

export const register = (credentials: RegisterCredentials) => {
  return api.post('/auth/register', credentials);
};

export const logout = () => {
  localStorage.removeItem('token');
  return api.post('/auth/logout');
};

export const checkAuth = () => {
  return api.get('/auth/me');
};