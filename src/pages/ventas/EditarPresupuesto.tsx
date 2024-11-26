import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { usePresupuestoStore } from '../../stores/presupuestoStore';
import { ProductSearchInput } from '../../components/ProductSearchInput';

type PresupuestoForm = {
  numero: string;
  fecha: string;
  fechaValidez: string;
  cliente: {
    nombre: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    nif: string;
    email: string;
    telefono: string;
  };
  contacto: string;
  emailContacto: string;
  comercial: string;
  items: {
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
  }[];
  observaciones?: string;
};

export default function EditarPresupuesto() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { presupuestos, updatePresupuesto } = usePresupuestoStore();
  const presupuesto = presupuestos.find(p => p.id === id);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PresupuestoForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    if (presupuesto) {
      reset({
        numero: presupuesto.numero,
        fecha: presupuesto.fecha,
        fechaValidez: presupuesto.fechaValidez,
        cliente: {
          nombre: presupuesto.cliente,
          nif: presupuesto.nifCliente,
          direccion: presupuesto.direccionCliente,
          ciudad: presupuesto.ciudadCliente,
          codigoPostal: presupuesto.cpCliente,
          email: presupuesto.emailCliente,
          telefono: presupuesto.telefonoCliente,
        },
        contacto: presupuesto.contacto,
        emailContacto: presupuesto.emailContacto,
        comercial: presupuesto.comercial,
        items: presupuesto.items,
        observaciones: presupuesto.observaciones,
      });
    }
  }, [presupuesto, reset]);

  const items = watch('items');
  const subtotal = items?.reduce(
    (sum, item) => sum + (item.cantidad || 0) * (item.precioUnitario || 0),
    0
  );
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const handleProductSelect = (index: number) => (descripcion: string, precio?: number) => {
    setValue(`items.${index}.descripcion`, descripcion);
    if (precio !== undefined) {
      setValue(`items.${index}.precioUnitario`, precio);
    }
  };

  const onSubmit = async (data: PresupuestoForm) => {
    if (!presupuesto) return;

    try {
      setIsLoading(true);

      // Preparar los items con los totales calculados
      const itemsConTotales = items.map(item => ({
        descripcion: item.descripcion,
        cantidad: item.cantidad || 0,
        precioUnitario: item.precioUnitario || 0,
        total: (item.cantidad || 0) * (item.precioUnitario || 0)
      }));

      const presupuestoActualizado = {
        ...presupuesto,
        fecha: data.fecha,
        fechaValidez: data.fechaValidez,
        cliente: data.cliente.nombre,
        nifCliente: data.cliente.nif,
        direccionCliente: data.cliente.direccion,
        ciudadCliente: data.cliente.ciudad,
        cpCliente: data.cliente.codigoPostal,
        emailCliente: data.cliente.email,
        telefonoCliente: data.cliente.telefono,
        contacto: data.contacto,
        emailContacto: data.emailContacto,
        comercial: data.comercial,
        items: itemsConTotales,
        subtotal,
        iva,
        total,
        observaciones: data.observaciones,
      };

      updatePresupuesto(presupuesto.id, presupuestoActualizado);
      toast.success('Presupuesto actualizado correctamente');
      navigate('/ventas/presupuestos');
    } catch (error) {
      toast.error('Error al actualizar el presupuesto');
    } finally {
      setIsLoading(false);
    }
  };

  if (!presupuesto) {
    return <div>Presupuesto no encontrado</div>;
  }

  // No permitir editar si el presupuesto no está pendiente
  if (presupuesto.estado !== 'pendiente') {
    return (
      <div className="alert alert-warning">
        Este presupuesto ya está {presupuesto.estado} y no puede ser editado.
        <br />
        <Link to="/ventas/presupuestos" className="btn btn-default mt-3">
          Volver a presupuestos
        </Link>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Editar Presupuesto</h3>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  {/* Datos básicos */}
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Número de Presupuesto</label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        {...register('numero')}
                        readOnly
                      />
                    </div>
                    <label className="col-sm-2 col-form-label">Fecha</label>
                    <div className="col-sm-4">
                      <input
                        type="date"
                        className="form-control"
                        {...register('fecha')}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Fecha Validez</label>
                    <div className="col-sm-4">
                      <input
                        type="date"
                        className="form-control"
                        {...register('fechaValidez')}
                      />
                    </div>
                  </div>

                  {/* Datos del cliente */}
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Nombre/Razón Social</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        {...register('cliente.nombre', { required: 'Este campo es requerido' })}
                      />
                      {errors.cliente?.nombre && (
                        <span className="text-danger">{errors.cliente.nombre.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">NIF/CIF</label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        {...register('cliente.nif', { required: 'Este campo es requerido' })}
                      />
                      {errors.cliente?.nif && (
                        <span className="text-danger">{errors.cliente.nif.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Dirección</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        {...register('cliente.direccion', { required: 'Este campo es requerido' })}
                      />
                      {errors.cliente?.direccion && (
                        <span className="text-danger">{errors.cliente.direccion.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Ciudad</label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        {...register('cliente.ciudad', { required: 'Este campo es requerido' })}
                      />
                      {errors.cliente?.ciudad && (
                        <span className="text-danger">{errors.cliente.ciudad.message}</span>
                      )}
                    </div>
                    <label className="col-sm-2 col-form-label">Código Postal</label>
                    <div className="col-sm-2">
                      <input
                        type="text"
                        className="form-control"
                        {...register('cliente.codigoPostal', { required: 'Este campo es requerido' })}
                      />
                      {errors.cliente?.codigoPostal && (
                        <span className="text-danger">{errors.cliente.codigoPostal.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-4">
                      <input
                        type="email"
                        className="form-control"
                        {...register('cliente.email')}
                      />
                      {errors.cliente?.email && (
                        <span className="text-danger">{errors.cliente.email.message}</span>
                      )}
                    </div>
                    <label className="col-sm-2 col-form-label">Teléfono</label>
                    <div className="col-sm-4">
                      <input
                        type="tel"
                        className="form-control"
                        {...register('cliente.telefono')}
                      />
                      {errors.cliente?.telefono && (
                        <span className="text-danger">{errors.cliente.telefono.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Datos de contacto */}
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Persona de Contacto</label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        {...register('contacto', { required: 'Este campo es requerido' })}
                      />
                      {errors.contacto && (
                        <span className="text-danger">{errors.contacto.message}</span>
                      )}
                    </div>
                    <label className="col-sm-2 col-form-label">Email de Contacto</label>
                    <div className="col-sm-4">
                      <input
                        type="email"
                        className="form-control"
                        {...register('emailContacto', {
                          required: 'Este campo es requerido',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email inválido',
                          },
                        })}
                      />
                      {errors.emailContacto && (
                        <span className="text-danger">{errors.emailContacto.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Comercial</label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        {...register('comercial', { required: 'Este campo es requerido' })}
                      />
                      {errors.comercial && (
                        <span className="text-danger">{errors.comercial.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Líneas de presupuesto */}
                  <div className="form-group">
                    <label>Líneas de Presupuesto</label>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Descripción</th>
                            <th width="150">Cantidad</th>
                            <th width="150">Precio Unit.</th>
                            <th width="150">Total</th>
                            <th width="50"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields.map((field, index) => (
                            <tr key={field.id}>
                              <td>
                                <ProductSearchInput
                                  value={items[index]?.descripcion || ''}
                                  onChange={(value, precio) => handleProductSelect(index)(value, precio)}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  {...register(`items.${index}.cantidad`)}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="form-control"
                                  {...register(`items.${index}.precioUnitario`)}
                                />
                              </td>
                              <td className="text-right">
                                €{((items[index]?.cantidad || 0) * (items[index]?.precioUnitario || 0)).toFixed(2)}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => remove(index)}
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-right">
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() => append({ descripcion: '', cantidad: 1, precioUnitario: 0 })}
                      >
                        <i className="fa fa-plus"></i> Añadir línea
                      </button>
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Observaciones</label>
                    <div className="col-sm-10">
                      <textarea
                        className="form-control"
                        rows={3}
                        {...register('observaciones')}
                      ></textarea>
                    </div>
                  </div>

                  {/* Totales */}
                  <div className="row">
                    <div className="col-md-4 offset-md-8">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th>Subtotal:</th>
                            <td className="text-right">€{subtotal.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <th>IVA (21%):</th>
                            <td className="text-right">€{iva.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <th>Total:</th>
                            <td className="text-right"><strong>€{total.toFixed(2)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <Link to="/ventas/presupuestos" className="btn btn-default">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary float-right"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Actualizar Presupuesto'}
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