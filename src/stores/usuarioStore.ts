import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  departamento: 'comercial' | 'administracion';
  activo: boolean;
}

interface UsuarioStore {
  usuarios: Usuario[];
  addUsuario: (usuario: Usuario) => void;
  updateUsuario: (id: string, usuario: Partial<Usuario>) => void;
  deleteUsuario: (id: string) => void;
}

export const useUsuarioStore = create<UsuarioStore>()(
  persist(
    (set) => ({
      usuarios: [
        {
          id: '1',
          nombre: 'Administrador',
          email: 'admin@admin.com',
          departamento: 'administracion',
          activo: true,
        }
      ],
      addUsuario: (usuario) =>
        set((state) => ({
          usuarios: [...state.usuarios, usuario],
        })),
      updateUsuario: (id, usuario) =>
        set((state) => ({
          usuarios: state.usuarios.map((u) =>
            u.id === id ? { ...u, ...usuario } : u
          ),
        })),
      deleteUsuario: (id) =>
        set((state) => ({
          usuarios: state.usuarios.filter((u) => u.id !== id),
        })),
    }),
    {
      name: 'usuarios-storage',
      version: 1,
    }
  )
);