import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useFacturaStore } from '../../stores/facturaStore';
import { ProductSearchInput } from '../../components/ProductSearchInput';

type FacturaForm = {
  numero: string;
  fecha: string;
  fechaVencimiento: string;
  proveedor: {
    nombre: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    nif: string;
    email: string;
    telefono: string;
  };
  items: {
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
  }[];
};

export default function EditarFacturaCompra() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { facturas, updateFactura } = useFacturaStore();
  const factura = facturas.find(f => f.id === id);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FacturaForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    if (factura) {
      reset({
        numero: factura.numero,
        fecha: factura.fecha,
        fechaVencimiento: factura.fechaVencimiento || '',
        proveedor: {
          nombre: factura.cliente,
          nif: factura.nifCliente,
          direccion: factura.direccionCliente,
          ciudad: factura.ciudadCliente,
          codigoPostal: factura.cpCliente,
          email: factura.emailCliente || '',
          telefono: factura.telefonoCliente || '',
        },
        items: factura.items,
      });
    }
  }, [factura, reset]);

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

  const onSubmit = async (data: FacturaForm) => {
    if (!factura) return;

    try {
      setIsLoading(true);

      // Preparar los items con los totales calculados
      const itemsConTotales = items.map(item => ({
        descripcion: item.descripcion,
        cantidad: item.cantidad || 0,
        precioUnitario: item.precioUnitario || 0,
        total: (item.cantidad || 0) * (item.precioUnitario || 0)
      }));

      const facturaActualizada = {
        ...factura,
        fecha: data.fecha,
        fechaVencimiento: data.fechaVencimiento,
        cliente: data.proveedor.nombre,
        nifCliente: data.proveedor.nif,
        direccionCliente: data.proveedor.direccion,
        ciudadCliente: data.proveedor.ciudad,
        cpCliente: data.proveedor.codigoPostal,
        emailCliente: data.proveedor.email,
        telefonoCliente: data.proveedor.telefono,
        items: itemsConTotales,
        subtotal,
        iva,
        total,
      };

      updateFactura(factura.id, facturaActualizada);
      toast.success('Factura actualizada correctamente');
      navigate('/compras/facturas');
    } catch (error) {
      toast.error('Error al actualizar la factura');
    } finally {
      setIsLoading(false);
    }
  };

  if (!factura) {
    return <div>Factura no encontrada</div>;
  }

  // No permitir editar si la factura está pagada
  if (factura.estado === 'pagada') {
    return (
      <div className="alert alert-warning">
        Esta factura ya está pagada y no puede ser editada.
        <br />
        <Link to="/compras/facturas" className="btn btn-default mt-3">
          Volver a facturas
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
                <h3 className="card-title">Editar Factura de Compra</h3>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  {/* Datos básicos */}
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Número de Factura</label>
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
                    <label className="col-sm-2 col-form-label">Fecha Vencimiento</label>
                    <div className="col-sm-4">
                      <input
                        type="date"
                        className="form-control"
                        {...register('fechaVencimiento')}
                      />
                    </div>
                  </div>

                  {/* Datos del proveedor */}
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Nombre/Razón Social</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        {...register('proveedor.nombre', { required: 'Este campo es requerido' })}
                      />
                      {errors.proveedor?.nombre && (
                        <span className="text-danger">{errors.proveedor.nombre.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">NIF/CIF</label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        {...register('proveedor.nif', { required: 'Este campo es requerido' })}
                      />
                      {errors.proveedor?.nif && (
                        <span className="text-danger">{errors.proveedor.nif.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Dirección</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        {...register('proveedor.direccion', { required: 'Este campo es requerido' })}
                      />
                      {errors.proveedor?.direccion && (
                        <span className="text-danger">{errors.proveedor.direccion.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Ciudad</label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        {...register('proveedor.ciudad', { required: 'Este campo es requerido' })}
                      />
                      {errors.proveedor?.ciudad && (
                        <span className="text-danger">{errors.proveedor.ciudad.message}</span>
                      )}
                    </div>
                    <label className="col-sm-2 col-form-label">Código Postal</label>
                    <div className="col-sm-2">
                      <input
                        type="text"
                        className="form-control"
                        {...register('proveedor.codigoPostal', { required: 'Este campo es requerido' })}
                      />
                      {errors.proveedor?.codigoPostal && (
                        <span className="text-danger">{errors.proveedor.codigoPostal.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-4">
                      <input
                        type="email"
                        className="form-control"
                        {...register('proveedor.email')}
                      />
                      {errors.proveedor?.email && (
                        <span className="text-danger">{errors.proveedor.email.message}</span>
                      )}
                    </div>
                    <label className="col-sm-2 col-form-label">Teléfono</label>
                    <div className="col-sm-4">
                      <input
                        type="tel"
                        className="form-control"
                        {...register('proveedor.telefono')}
                      />
                      {errors.proveedor?.telefono && (
                        <span className="text-danger">{errors.proveedor.telefono.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Líneas de factura */}
                  <div className="form-group">
                    <label>Líneas de Factura</label>
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
                  <Link to="/compras/facturas" className="btn btn-default">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary float-right"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Actualizar Factura'}
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