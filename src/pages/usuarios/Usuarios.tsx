import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useUsuarioStore } from '../../stores/usuarioStore';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Usuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const { usuarios, deleteUsuario } = useUsuarioStore();
  const { user } = useAuth();

  // Verificar si el usuario actual es administrador
  if (user?.departamento !== 'administracion') {
    return <div>No tienes permisos para acceder a esta página</div>;
  }

  const handleDelete = (id: string) => {
    if (id === '1') {
      toast.error('No se puede eliminar el usuario administrador');
      return;
    }

    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      deleteUsuario(id);
      toast.success('Usuario eliminado correctamente');
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    Object.values(usuario).some(value =>
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
                <h3 className="card-title">Listado de Usuarios</h3>
                <div className="card-tools">
                  <Link to="/usuarios/nuevo" className="btn btn-primary btn-sm">
                    <i className="fas fa-plus"></i> Nuevo Usuario
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
                        placeholder="Buscar usuarios..."
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
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Departamento</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsuarios.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.nombre}</td>
                          <td>{usuario.email}</td>
                          <td>
                            <span className={`badge ${
                              usuario.departamento === 'administracion' 
                                ? 'bg-primary' 
                                : 'bg-info'
                            }`}>
                              {usuario.departamento === 'administracion' 
                                ? 'Administración' 
                                : 'Comercial'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${
                              usuario.activo ? 'bg-success' : 'bg-danger'
                            }`}>
                              {usuario.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group">
                              <Link
                                to={`/usuarios/editar/${usuario.id}`}
                                className="btn btn-info btn-xs"
                                title="Editar"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              {usuario.id !== '1' && (
                                <button
                                  onClick={() => handleDelete(usuario.id)}
                                  className="btn btn-danger btn-xs"
                                  title="Eliminar"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              )}
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