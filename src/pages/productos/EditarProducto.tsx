import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useProductoStore } from '../../stores/productoStore';
import { useAuth } from '../../context/AuthContext';

type ProductoForm = {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  tags: string;
  imagen?: string;
};

export default function EditarProducto() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { productos, updateProducto, categorias } = useProductoStore();
  const producto = productos.find(p => p.id === id);

  // Verificar si el usuario actual es administrador
  if (user?.departamento !== 'administracion') {
    return <div>No tienes permisos para acceder a esta página</div>;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductoForm>();

  useEffect(() => {
    if (producto) {
      reset({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        categoria: producto.categoria,
        tags: producto.tags.join(', '),
      });
      setSelectedImage(producto.imagen || null);
    }
  }, [producto, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProductoForm) => {
    if (!producto) return;

    try {
      setIsLoading(true);

      const productoActualizado = {
        ...producto,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: Number(data.precio),
        categoria: data.categoria,
        tags: data.tags.split(',').map(tag => tag.trim()),
        imagen: selectedImage || undefined,
      };

      updateProducto(producto.id, productoActualizado);
      toast.success('Producto actualizado correctamente');
      navigate('/productos');
    } catch (error) {
      toast.error('Error al actualizar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  if (!producto) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Editar Producto</h3>
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
                    <label className="col-sm-2 col-form-label">Descripción</label>
                    <div className="col-sm-10">
                      <textarea
                        className="form-control"
                        rows={3}
                        {...register('descripcion', { required: 'Este campo es requerido' })}
                      ></textarea>
                      {errors.descripcion && (
                        <span className="text-danger">{errors.descripcion.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Precio</label>
                    <div className="col-sm-4">
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          {...register('precio', {
                            required: 'Este campo es requerido',
                            min: { value: 0, message: 'El precio debe ser mayor o igual a 0' },
                          })}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">€</span>
                        </div>
                      </div>
                      {errors.precio && (
                        <span className="text-danger">{errors.precio.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Categoría</label>
                    <div className="col-sm-4">
                      <select
                        className="form-control"
                        {...register('categoria', { required: 'Este campo es requerido' })}
                      >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((categoria) => (
                          <option key={categoria} value={categoria}>
                            {categoria}
                          </option>
                        ))}
                      </select>
                      {errors.categoria && (
                        <span className="text-danger">{errors.categoria.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Tags</label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Separar tags por comas"
                        {...register('tags')}
                      />
                      <small className="form-text text-muted">
                        Ejemplo: hardware, impresora, tinta
                      </small>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Imagen</label>
                    <div className="col-sm-10">
                      <input
                        type="file"
                        className="form-control-file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {selectedImage && (
                        <img
                          src={selectedImage}
                          alt="Preview"
                          className="mt-2"
                          style={{ maxHeight: '200px' }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <Link to="/productos" className="btn btn-default">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary float-right"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Actualizar Producto'}
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