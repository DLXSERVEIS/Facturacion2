import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useUsuarioStore } from '../../stores/usuarioStore';
import { useAuth } from '../../context/AuthContext';

type UsuarioForm = {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  departamento: 'comercial' | 'administracion';
};

export default function NuevoUsuario() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const addUsuario = useUsuarioStore(state => state.addUsuario);

  // Verificar si el usuario actual es administrador
  if (user?.departamento !== 'administracion') {
    return <div>No tienes permisos para acceder a esta página</div>;
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UsuarioForm>();

  const password = watch('password');

  const onSubmit = async (data: UsuarioForm) => {
    try {
      setIsLoading(true);

      const nuevoUsuario = {
        id: crypto.randomUUID(),
        nombre: data.nombre,
        email: data.email,
        departamento: data.departamento,
        activo: true,
      };

      addUsuario(nuevoUsuario);
      toast.success('Usuario creado correctamente');
      navigate('/usuarios');
    } catch (error) {
      toast.error('Error al crear el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Nuevo Usuario</h3>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Nombre</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        {...register('nombre', { required: 'Este campo es requerido' })}
                      />
                      {errors.nombre && (
                        <span className="text-danger">{errors.nombre.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                      <input
                        type="email"
                        className="form-control"
                        {...register('email', {
                          required: 'Este campo es requerido',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email inválido',
                          },
                        })}
                      />
                      {errors.email && (
                        <span className="text-danger">{errors.email.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Contraseña</label>
                    <div className="col-sm-10">
                      <input
                        type="password"
                        className="form-control"
                        {...register('password', {
                          required: 'Este campo es requerido',
                          minLength: {
                            value: 6,
                            message: 'La contraseña debe tener al menos 6 caracteres',
                          },
                        })}
                      />
                      {errors.password && (
                        <span className="text-danger">{errors.password.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Confirmar Contraseña</label>
                    <div className="col-sm-10">
                      <input
                        type="password"
                        className="form-control"
                        {...register('confirmPassword', {
                          required: 'Este campo es requerido',
                          validate: value =>
                            value === password || 'Las contraseñas no coinciden',
                        })}
                      />
                      {errors.confirmPassword && (
                        <span className="text-danger">{errors.confirmPassword.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Departamento</label>
                    <div className="col-sm-10">
                      <select
                        className="form-control"
                        {...register('departamento', { required: 'Este campo es requerido' })}
                      >
                        <option value="comercial">Comercial</option>
                        <option value="administracion">Administración</option>
                      </select>
                      {errors.departamento && (
                        <span className="text-danger">{errors.departamento.message}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <Link to="/usuarios" className="btn btn-default">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary float-right"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}