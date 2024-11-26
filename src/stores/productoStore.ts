import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  tags: string[];
  imagen?: string;
}

interface ProductoStore {
  productos: Producto[];
  categorias: string[];
  addProducto: (producto: Producto) => void;
  updateProducto: (id: string, producto: Partial<Producto>) => void;
  deleteProducto: (id: string) => void;
  addCategoria: (categoria: string) => void;
}

export const useProductoStore = create<ProductoStore>()(
  persist(
    (set) => ({
      productos: [
        {
          id: '1',
          nombre: 'Producto de ejemplo',
          descripcion: 'Descripción del producto de ejemplo',
          precio: 99.99,
          categoria: 'General',
          tags: ['ejemplo'],
        }
      ],
      categorias: ['General', 'Servicios', 'Hardware', 'Software'],
      
      addProducto: (producto) =>
        set((state) => ({
          productos: [...state.productos, producto],
        })),
        
      updateProducto: (id, producto) =>
        set((state) => ({
          productos: state.productos.map((p) =>
            p.id === id ? { ...p, ...producto } : p
          ),
        })),
        
      deleteProducto: (id) =>
        set((state) => ({
          productos: state.productos.filter((p) => p.id !== id),
        })),
        
      addCategoria: (categoria) =>
        set((state) => ({
          categorias: [...state.categorias, categoria],
        })),
    }),
    {
      name: 'productos-storage',
      version: 1,
    }
  )
);