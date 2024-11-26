import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EmpresaConfig {
  nombre: string;
  nif: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  telefono: string;
  email: string;
  logo?: string;
}

interface EmpresaStore {
  config: EmpresaConfig;
  loading: boolean;
  error: string | null;
  updateConfig: (config: Partial<EmpresaConfig>) => void;
  setLogo: (logo: string) => void;
}

const defaultConfig: EmpresaConfig = {
  nombre: 'ELEXMA',
  nif: 'B12345678',
  direccion: 'Calle Principal 123',
  codigoPostal: '28001',
  ciudad: 'Madrid',
  telefono: '912345678',
  email: 'info@elexma.com',
};

export const useEmpresaStore = create<EmpresaStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      loading: false,
      error: null,

      updateConfig: async (newConfig) => {
        try {
          set({ loading: true });
          set({ config: { ...get().config, ...newConfig }, error: null });
        } catch (error) {
          set({ error: 'Error al actualizar la configuración' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      setLogo: async (logo) => {
        await get().updateConfig({ logo });
      },
    }),
    {
      name: 'empresa-storage',
      version: 1,
    }
  )
);