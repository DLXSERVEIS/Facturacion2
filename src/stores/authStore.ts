import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  nombre: string;
  email: string;
  departamento: 'comercial' | 'administracion';
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email: string, password: string) => {
        try {
          // Normalizar el email
          const normalizedEmail = email.toLowerCase().trim();

          // Verificar credenciales del administrador
          if (
            (normalizedEmail === 'admin@admin.com' || normalizedEmail === 'admin') && 
            password === '123456'
          ) {
            set({
              user: {
                id: '1',
                nombre: 'Administrador',
                email: 'admin@admin.com',
                departamento: 'administracion',
              },
              token: 'dev-token',
            });
            return;
          }

          // Verificar otros usuarios registrados
          // Aquí iría la lógica para verificar otros usuarios cuando se implementen

          throw new Error('Credenciales inválidas');
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      isAuthenticated: () => {
        const state = get();
        return !!state.token && !!state.user;
      },
    }),
    {
      name: 'auth-storage',
      version: 1,
    }
  )
);