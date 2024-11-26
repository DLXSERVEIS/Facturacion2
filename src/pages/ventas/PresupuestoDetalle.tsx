import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { usePresupuestoStore } from '../../stores/presupuestoStore';
import { useEmpresaStore } from '../../stores/empresaStore';
import { generatePDF } from '../../utils/generatePDF';

export default function PresupuestoDetalle() {
  const { id } = useParams();
  const presupuesto = usePresupuestoStore(state => state.presupuestos.find(p => p.id === id));
  const empresaConfig = useEmpresaStore(state => state.config);

  if (!presupuesto) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Link
            to="/ventas/presupuestos"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a presupuestos
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-center text-gray-600">Presupuesto no encontrado</p>
        </div>
      </div>
    );
  }

  const handleGeneratePDF = () => {
    if (presupuesto && empresaConfig) {
      generatePDF({ factura: presupuesto, empresaConfig });
    }
  };

  // Asegurar que los valores numéricos sean números
  const formatNumber = (value: any) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 0 : num;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link
          to="/ventas/presupuestos"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a presupuestos
        </Link>
        <div className="space-x-2">
          <button 
            onClick={handleGeneratePDF}
            className="inline-flex items-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Cabecera del presupuesto */}
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Presupuesto #{presupuesto.numero}
              </h2>
              <p className="text-gray-600">
                Fecha: {new Date(presupuesto.fecha).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Válido hasta: {new Date(presupuesto.fechaValidez).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Estado: <span className={`badge ${
                  presupuesto.estado === 'aceptado' ? 'bg-success' :
                  presupuesto.estado === 'rechazado' ? 'bg-danger' : 'bg-warning'
                }`}>
                  {presupuesto.estado.charAt(0).toUpperCase() + presupuesto.estado.slice(1)}
                </span>
              </p>
              <p className="text-gray-600">
                Comercial: {presupuesto.comercial}
              </p>
            </div>
            <div className="text-right">
              {empresaConfig.logo && (
                <img 
                  src={empresaConfig.logo} 
                  alt="Logo empresa" 
                  className="h-16 mb-2 ml-auto"
                />
              )}
              <h3 className="text-lg font-semibold">{empresaConfig.nombre}</h3>
              <p className="text-gray-600">{empresaConfig.direccion}</p>
              <p className="text-gray-600">{empresaConfig.codigoPostal} {empresaConfig.ciudad}</p>
              <p className="text-gray-600">NIF: {empresaConfig.nif}</p>
              <p className="text-gray-600">Tel: {empresaConfig.telefono}</p>
              <p className="text-gray-600">{empresaConfig.email}</p>
            </div>
          </div>

          {/* Datos del cliente */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Cliente</h3>
            <div className="text-gray-600">
              <p className="font-medium">{presupuesto.cliente}</p>
              <p>{presupuesto.direccionCliente}</p>
              <p>{presupuesto.ciudadCliente}, {presupuesto.cpCliente}</p>
              <p>NIF: {presupuesto.nifCliente}</p>
              <p>Email: {presupuesto.emailCliente}</p>
              <p>Teléfono: {presupuesto.telefonoCliente}</p>
              <p>Contacto: {presupuesto.contacto}</p>
              <p>Email Contacto: {presupuesto.emailContacto}</p>
            </div>
          </div>

          {/* Tabla de items */}
          <div className="border-t pt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio unitario
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {presupuesto.items?.map((item, index) => {
                  const cantidad = formatNumber(item.cantidad);
                  const precioUnitario = formatNumber(item.precioUnitario);
                  const total = cantidad * precioUnitario;
                  
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.descripcion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {cantidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        €{precioUnitario.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        €{total.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="border-t pt-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>€{formatNumber(presupuesto.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA (21%)</span>
                  <span>€{formatNumber(presupuesto.iva).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>€{formatNumber(presupuesto.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          {presupuesto.observaciones && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Observaciones</h3>
              <p className="text-gray-600 whitespace-pre-line">{presupuesto.observaciones}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}