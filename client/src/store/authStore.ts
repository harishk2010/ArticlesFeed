import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '../services/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  preferences: string[];
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (identifier: string, password: string) => {
        const { data } = await apiService.login({ identifier, password });
        console.log(data,"data")
        set({
          user: data.data.user,
          token: data.data.token,
          isAuthenticated: true,
        });
        localStorage.setItem('token', data.data.token);
      },
      register: async (data: any) => {
        const { data: response } = await apiService.register(data);
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
        localStorage.setItem('token', response.token);
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('token');
      },
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
); 