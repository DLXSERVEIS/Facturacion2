import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useClienteStore } from '../../stores/clienteStore';

type ClienteForm = {
  nombre: string;
  nif: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
};

export default function NuevoCliente() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const addCliente = useClienteStore(state => state.addCliente);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteForm>();

  const onSubmit = async (data: ClienteForm) => {
    try {
      setIsLoading(true);
      
      const nuevoCliente = {
        id: crypto.randomUUID(),
        ...data
      };
      
      addCliente(nuevoCliente);
      toast.success('Cliente creado correctamente');
      navigate('/clientes');
    } catch (error) {
      toast.error('Error al crear el cliente');
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
                <h3 className="card-title">Nuevo Cliente</h3>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Nombre/Razón Social</label>
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
                    <label className="col-sm-2 col-form-label">NIF/CIF</label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        {...register('nif', { required: 'Este campo es requerido' })}
                      />
                      {errors.nif && (
                        <span className="text-danger">{errors.nif.message}</span>
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
                    <label className="col-sm-2 col-form-label">Teléfono</label>
                    <div className="col-sm-4">
                      <input
                        type="tel"
                        className="form-control"
                        {...register('telefono', { required: 'Este campo es requerido' })}
                      />
                      {errors.telefono && (
                        <span className="text-danger">{errors.telefono.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Dirección</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        {...register('direccion', { required: 'Este campo es requerido' })}
                      />
                      {errors.direccion && (
                        <span className="text-danger">{errors.direccion.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Ciudad</label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        {...register('ciudad', { required: 'Este campo es requerido' })}
                      />
                      {errors.ciudad && (
                        <span className="text-danger">{errors.ciudad.message}</span>
                      )}
                    </div>
                    <label className="col-sm-2 col-form-label">Código Postal</label>
                    <div className="col-sm-2">
                      <input
                        type="text"
                        className="form-control"
                        {...register('codigoPostal', { required: 'Este campo es requerido' })}
                      />
                      {errors.codigoPostal && (
                        <span className="text-danger">{errors.codigoPostal.message}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <Link to="/clientes" className="btn btn-default">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary float-right"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Cliente'}
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