import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus } from 'lucide-react';
import { useProductoStore } from '../stores/productoStore';
import type { Producto } from '../stores/productoStore';

interface ProductoSearchProps {
  onProductoSelect: (producto: Producto) => void;
}

export default function ProductoSearch({ onProductoSelect }: ProductoSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { searchProductos } = useProductoStore();
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = searchProductos(searchTerm);
      setFilteredProductos(results);
      setIsOpen(true);
    } else {
      setFilteredProductos([]);
      setIsOpen(false);
    }
  }, [searchTerm, searchProductos]);

  const handleSelect = (producto: Producto) => {
    onProductoSelect(producto);
    setSearchTerm(producto.nombre);
    setIsOpen(false);
  };

  const handleSearch = () => {
    if (searchTerm && filteredProductos.length > 0) {
      handleSelect(filteredProductos[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar producto por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <div className="input-group-append">
          <button 
            type="button"
            className="btn btn-default"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOpen && filteredProductos.length > 0 && (
        <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg" style={{ zIndex: 9999 }}>
          {filteredProductos.map((producto) => (
            <div
              key={producto.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(producto)}
            >
              <div className="font-medium">{producto.nombre}</div>
              <div className="text-sm text-gray-600">€{producto.precio.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}