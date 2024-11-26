import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Factura {
  id: string;
  tipo: 'compra' | 'venta';
  numero: string;
  fecha: string;
  fechaVencimiento?: string;
  fechaPago?: string;
  estado: 'pendiente' | 'pagada' | 'vencida';
  cliente: string;
  nifCliente: string;
  direccionCliente: string;
  ciudadCliente: string;
  cpCliente: string;
  emailCliente?: string;
  telefonoCliente?: string;
  items: {
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
  }[];
  subtotal: number;
  iva: number;
  total: number;
  archivo?: {
    nombre: string;
    url: string;
    tipo: string;
  };
}

interface FacturaStore {
  facturas: Factura[];
  addFactura: (factura: Factura) => void;
  updateFactura: (id: string, factura: Partial<Factura>) => void;
  deleteFactura: (id: string) => void;
  marcarComoPagada: (id: string, fechaPago: string) => void;
  marcarComoPendiente: (id: string) => void;
}

export const useFacturaStore = create<FacturaStore>()(
  persist(
    (set) => ({
      facturas: [],
      addFactura: (factura) =>
        set((state) => ({
          facturas: [...state.facturas, factura],
        })),
      updateFactura: (id, factura) =>
        set((state) => ({
          facturas: state.facturas.map((f) =>
            f.id === id ? { ...f, ...factura } : f
          ),
        })),
      deleteFactura: (id) =>
        set((state) => ({
          facturas: state.facturas.filter((f) => f.id !== id),
        })),
      marcarComoPagada: (id, fechaPago) =>
        set((state) => ({
          facturas: state.facturas.map((f) =>
            f.id === id ? { ...f, estado: 'pagada', fechaPago } : f
          ),
        })),
      marcarComoPendiente: (id) =>
        set((state) => ({
          facturas: state.facturas.map((f) =>
            f.id === id ? { ...f, estado: 'pendiente', fechaPago: undefined } : f
          ),
        })),
    }),
    {
      name: 'facturas-storage',
    }
  )
);