import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useProductoStore } from '../../stores/productoStore';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Productos() {
  const [searchTerm, setSearchTerm] = useState('');
  const { productos, deleteProducto } = useProductoStore();
  const { user } = useAuth();

  // Verificar si el usuario actual es administrador
  if (user?.departamento !== 'administracion') {
    return <div>No tienes permisos para acceder a esta página</div>;
  }

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      deleteProducto(id);
      toast.success('Producto eliminado correctamente');
    }
  };

  const filteredProductos = productos.filter(producto =>
    Object.values(producto).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Listado de Productos</h3>
                <div className="card-tools">
                  <Link to="/productos/nuevo" className="btn btn-primary btn-sm">
                    <i className="fas fa-plus"></i> Nuevo Producto
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div style={{ width: '300px' }}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <Search className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Tags</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProductos.map((producto) => (
                        <tr key={producto.id}>
                          <td>
                            {producto.imagen ? (
                              <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="img-thumbnail"
                                style={{ maxHeight: '50px' }}
                              />
                            ) : (
                              <span className="text-muted">Sin imagen</span>
                            )}
                          </td>
                          <td>{producto.nombre}</td>
                          <td>{producto.descripcion}</td>
                          <td>€{producto.precio.toFixed(2)}</td>
                          <td>{producto.categoria}</td>
                          <td>
                            {producto.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="badge bg-info mr-1"
                              >
                                {tag}
                              </span>
                            ))}
                          </td>
                          <td>
                            <div className="btn-group">
                              <Link
                                to={`/productos/editar/${producto.id}`}
                                className="btn btn-info btn-xs"
                                title="Editar"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              <button
                                onClick={() => handleDelete(producto.id)}
                                className="btn btn-danger btn-xs"
                                title="Eliminar"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}