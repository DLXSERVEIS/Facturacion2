import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useUsuarioStore } from '../../stores/usuarioStore';
import { useAuth } from '../../context/AuthContext';

type UsuarioForm = {
  nombre: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  departamento: 'comercial' | 'administracion';
  activo: boolean;
};

export default function EditarUsuario() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { usuarios, updateUsuario } = useUsuarioStore();
  const usuario = usuarios.find(u => u.id === id);

  // Verificar si el usuario actual es administrador
  if (user?.departamento !== 'administracion') {
    return <div>No tienes permisos para acceder a esta página</div>;
  }

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UsuarioForm>();

  useEffect(() => {
    if (usuario) {
      reset({
        nombre: usuario.nombre,
        email: usuario.email,
        departamento: usuario.departamento,
        activo: usuario.activo,
      });
    }
  }, [usuario, reset]);

  const password = watch('password');

  const onSubmit = async (data: UsuarioForm) => {
    if (!usuario) return;

    try {
      setIsLoading(true);

      // Si es el usuario admin, no permitir cambiar ciertos campos
      if (usuario.id === '1') {
        if (data.departamento !== 'administracion' || !data.activo) {
          toast.error('No se pueden modificar estos campos para el usuario administrador');
          return;
        }
      }

      const usuarioActualizado = {
        ...usuario,
        nombre: data.nombre,
        email: data.email,
        departamento: data.departamento,
        activo: data.activo,
      };

      updateUsuario(usuario.id, usuarioActualizado);
      toast.success('Usuario actualizado correctamente');
      navigate('/usuarios');
    } catch (error) {
      toast.error('Error al actualizar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  if (!usuario) {
    return <div>Usuario no encontrado</div>;
  }

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Editar Usuario</h3>
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
                    <label className="col-sm-2 col-form-label">Nueva Contraseña</label>
                    <div className="col-sm-10">
                      <input
                        type="password"
                        className="form-control"
                        {...register('password', {
                          minLength: {
                            value: 6,
                            message: 'La contraseña debe tener al menos 6 caracteres',
                          },
                        })}
                        placeholder="Dejar en blanco para mantener la actual"
                      />
                      {errors.password && (
                        <span className="text-danger">{errors.password.message}</span>
                      )}
                    </div>
                  </div>

                  {password && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Confirmar Contraseña</label>
                      <div className="col-sm-10">
                        <input
                          type="password"
                          className="form-control"
                          {...register('confirmPassword', {
                            validate: value =>
                              !password || value === password || 'Las contraseñas no coinciden',
                          })}
                        />
                        {errors.confirmPassword && (
                          <span className="text-danger">{errors.confirmPassword.message}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Departamento</label>
                    <div className="col-sm-10">
                      <select
                        className="form-control"
                        {...register('departamento', { required: 'Este campo es requerido' })}
                        disabled={usuario.id === '1'}
                      >
                        <option value="comercial">Comercial</option>
                        <option value="administracion">Administración</option>
                      </select>
                      {errors.departamento && (
                        <span className="text-danger">{errors.departamento.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Estado</label>
                    <div className="col-sm-10">
                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customSwitch1"
                          {...register('activo')}
                          disabled={usuario.id === '1'}
                        />
                        <label className="custom-control-label" htmlFor="customSwitch1">
                          {watch('activo') ? 'Activo' : 'Inactivo'}
                        </label>
                      </div>
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
                    {isLoading ? 'Guardando...' : 'Actualizar Usuario'}
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