import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Proveedor {
  id: string;
  nombre: string;
  nif: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
}

// Datos iniciales de ejemplo
const proveedoresIniciales: Proveedor[] = [
  {
    id: '1',
    nombre: 'Proveedor ABC S.L.',
    nif: 'B12345678',
    email: 'contacto@proveedorabc.com',
    telefono: '912345678',
    direccion: 'Calle Principal 123',
    ciudad: 'Madrid',
    codigoPostal: '28001',
  },
  {
    id: '2',
    nombre: 'Proveedor XYZ S.A.',
    nif: 'A87654321',
    email: 'info@proveedorxyz.com',
    telefono: '934567890',
    direccion: 'Avenida Central 456',
    ciudad: 'Barcelona',
    codigoPostal: '08001',
  },
  {
    id: '3',
    nombre: 'Suministros Industriales S.L.',
    nif: 'B98765432',
    email: 'info@suministrosindustriales.com',
    telefono: '915555555',
    direccion: 'Polígono Industrial 789',
    ciudad: 'Valencia',
    codigoPostal: '46001',
  },
];

interface ProveedorStore {
  proveedores: Proveedor[];
  addProveedor: (proveedor: Proveedor) => void;
  updateProveedor: (id: string, proveedor: Partial<Proveedor>) => void;
  deleteProveedor: (id: string) => void;
  searchProveedores: (query: string) => Proveedor[];
}

export const useProveedorStore = create<ProveedorStore>()(
  persist(
    (set, get) => ({
      proveedores: proveedoresIniciales,
      addProveedor: (proveedor) =>
        set((state) => ({
          proveedores: [...state.proveedores, proveedor],
        })),
      updateProveedor: (id, proveedor) =>
        set((state) => ({
          proveedores: state.proveedores.map((p) =>
            p.id === id ? { ...p, ...proveedor } : p
          ),
        })),
      deleteProveedor: (id) =>
        set((state) => ({
          proveedores: state.proveedores.filter((p) => p.id !== id),
        })),
      searchProveedores: (query) => {
        const { proveedores } = get();
        const searchTerm = query.toLowerCase().trim();
        return proveedores.filter(
          (proveedor) =>
            proveedor.nombre.toLowerCase().includes(searchTerm) ||
            proveedor.nif.toLowerCase().includes(searchTerm)
        );
      },
    }),
    {
      name: 'proveedores-storage',
      version: 1,
    }
  )
);