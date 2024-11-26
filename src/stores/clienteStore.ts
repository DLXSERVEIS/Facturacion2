import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Cliente {
  id: string;
  nombre: string;
  nif: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  contacto: string;
  emailContacto: string;
  comercial: string;
}

const clientesIniciales: Cliente[] = [
  {
    id: '1',
    nombre: 'Empresa ABC S.L.',
    nif: 'B12345678',
    email: 'contacto@empresaabc.com',
    telefono: '912345678',
    direccion: 'Calle Principal 123',
    ciudad: 'Madrid',
    codigoPostal: '28001',
    contacto: 'Juan Pérez',
    emailContacto: 'juan.perez@empresaabc.com',
    comercial: 'Ana García'
  }
];

interface ClienteStore {
  clientes: Cliente[];
  addCliente: (cliente: Cliente) => void;
  updateCliente: (id: string, cliente: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;
  searchClientes: (query: string) => Cliente[];
}

export const useClienteStore = create<ClienteStore>()(
  persist(
    (set, get) => ({
      clientes: clientesIniciales,
      addCliente: (cliente) =>
        set((state) => ({
          clientes: [...state.clientes, cliente],
        })),
      updateCliente: (id, cliente) =>
        set((state) => ({
          clientes: state.clientes.map((c) =>
            c.id === id ? { ...c, ...cliente } : c
          ),
        })),
      deleteCliente: (id) =>
        set((state) => ({
          clientes: state.clientes.filter((c) => c.id !== id),
        })),
      searchClientes: (query) => {
        const { clientes } = get();
        const searchTerm = query.toLowerCase().trim();
        return clientes.filter(
          (cliente) =>
            cliente.nombre.toLowerCase().includes(searchTerm) ||
            cliente.nif.toLowerCase().includes(searchTerm)
        );
      },
    }),
    {
      name: 'clientes-storage',
      version: 1,
    }
  )
);