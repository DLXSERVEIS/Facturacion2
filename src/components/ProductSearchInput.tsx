import React, { useState, useEffect, useRef } from 'react';
import { useProductoStore } from '../stores/productoStore';
import type { Producto } from '../stores/productoStore';

interface ProductSearchInputProps {
  value: string;
  onChange: (value: string, precio?: number) => void;
}

export function ProductSearchInput({ value, onChange }: ProductSearchInputProps) {
  const [suggestions, setSuggestions] = useState<Producto[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { productos } = useProductoStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // Si el input comienza con @, buscar productos
    if (inputValue.startsWith('@')) {
      const searchTerm = inputValue.slice(1).toLowerCase();
      const filtered = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectProduct = (producto: Producto) => {
    onChange(producto.nombre, producto.precio);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="position-relative">
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="position-absolute w-100 bg-white border rounded shadow-lg" 
          style={{ 
            bottom: '100%', 
            marginBottom: '5px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 9999 
          }}
        >
          {suggestions.map((producto) => (
            <div
              key={producto.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectProduct(producto)}
            >
              <div className="font-medium">{producto.nombre}</div>
              <div className="text-sm text-gray-600">€{producto.precio.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
      
      <input
        type="text"
        className="form-control"
        value={value}
        onChange={handleInputChange}
        placeholder="Escribe @ para buscar productos"
      />
    </div>
  );
}