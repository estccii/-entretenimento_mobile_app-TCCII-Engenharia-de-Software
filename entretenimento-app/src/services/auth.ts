import { api } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  const response = await api.post('/auth/google', { idToken });
  return response.data;
}
