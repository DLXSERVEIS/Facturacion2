import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

interface User {
  id: string;
  nombre: string;
  email: string;
  departamento: 'comercial' | 'administracion';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authStore = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Verificar si hay un token almacenado y configurar axios
    if (authStore.token) {
      // Configurar el token para todas las peticiones
      // axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
    }
    setIsInitialized(true);
  }, [authStore.token]);

  const value = {
    user: authStore.user,
    login: authStore.login,
    logout: authStore.logout,
    isAuthenticated: authStore.isAuthenticated,
  };

  if (!isInitialized) {
    return null; // O un componente de carga
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}