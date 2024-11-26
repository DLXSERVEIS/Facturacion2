import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Presupuesto {
  id: string;
  numero: string;
  fecha: string;
  fechaValidez: string;
  estado: 'pendiente' | 'aceptado' | 'rechazado';
  cliente: string;
  nifCliente: string;
  direccionCliente: string;
  ciudadCliente: string;
  cpCliente: string;
  emailCliente: string;
  telefonoCliente: string;
  contacto: string;
  emailContacto: string;
  comercial: string;
  items: {
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
  }[];
  subtotal: number;
  iva: number;
  total: number;
  observaciones?: string;
}

interface PresupuestoStore {
  presupuestos: Presupuesto[];
  lastNumber: number;
  addPresupuesto: (presupuesto: Presupuesto) => void;
  updatePresupuesto: (id: string, presupuesto: Partial<Presupuesto>) => void;
  deletePresupuesto: (id: string) => void;
  getNextNumber: () => string;
  marcarComoAceptado: (id: string) => void;
  marcarComoRechazado: (id: string) => void;
}

export const usePresupuestoStore = create<PresupuestoStore>()(
  persist(
    (set, get) => ({
      presupuestos: [],
      lastNumber: 0,
      addPresupuesto: (presupuesto) =>
        set((state) => ({
          presupuestos: [...state.presupuestos, presupuesto],
          lastNumber: state.lastNumber + 1,
        })),
      updatePresupuesto: (id, presupuesto) =>
        set((state) => ({
          presupuestos: state.presupuestos.map((p) =>
            p.id === id ? { ...p, ...presupuesto } : p
          ),
        })),
      deletePresupuesto: (id) =>
        set((state) => ({
          presupuestos: state.presupuestos.filter((p) => p.id !== id),
        })),
      getNextNumber: () => {
        const currentYear = new Date().getFullYear();
        const nextNumber = (get().lastNumber + 1).toString().padStart(4, '0');
        return `PPTO-${currentYear}-${nextNumber}`;
      },
      marcarComoAceptado: (id) =>
        set((state) => ({
          presupuestos: state.presupuestos.map((p) =>
            p.id === id ? { ...p, estado: 'aceptado' } : p
          ),
        })),
      marcarComoRechazado: (id) =>
        set((state) => ({
          presupuestos: state.presupuestos.map((p) =>
            p.id === id ? { ...p, estado: 'rechazado' } : p
          ),
        })),
    }),
    {
      name: 'presupuestos-storage',
      version: 1,
    }
  )
);