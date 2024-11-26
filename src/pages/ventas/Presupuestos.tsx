import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { usePresupuestoStore } from '../../stores/presupuestoStore';
import { useFacturaStore } from '../../stores/facturaStore';
import { toast } from 'react-hot-toast';
import GenerarFacturaModal from '../../components/modals/GenerarFacturaModal';

export default function Presupuestos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<any>(null);
  const [showGenerarFacturaModal, setShowGenerarFacturaModal] = useState(false);

  const { 
    presupuestos, 
    deletePresupuesto, 
    marcarComoAceptado, 
    marcarComoRechazado 
  } = usePresupuestoStore();

  const { addFactura } = useFacturaStore();

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este presupuesto?')) {
      deletePresupuesto(id);
      toast.success('Presupuesto eliminado correctamente');
    }
  };

  const handleAceptar = async (presupuesto: any) => {
    setSelectedPresupuesto(presupuesto);
    setShowGenerarFacturaModal(true);
  };

  const handleRechazar = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea rechazar este presupuesto?')) {
      marcarComoRechazado(id);
      toast.success('Presupuesto marcado como rechazado');
    }
  };

  const handleGenerarFactura = () => {
    if (!selectedPresupuesto) return;

    try {
      const facturaData = {
        id: crypto.randomUUID(),
        tipo: 'venta' as const,
        numero: `FV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'pendiente' as const,
        cliente: selectedPresupuesto.cliente,
        nifCliente: selectedPresupuesto.nifCliente,
        direccionCliente: selectedPresupuesto.direccionCliente,
        ciudadCliente: selectedPresupuesto.ciudadCliente,
        cpCliente: selectedPresupuesto.cpCliente,
        emailCliente: selectedPresupuesto.emailCliente,
        telefonoCliente: selectedPresupuesto.telefonoCliente,
        items: selectedPresupuesto.items,
        subtotal: selectedPresupuesto.subtotal,
        iva: selectedPresupuesto.iva,
        total: selectedPresupuesto.total,
      };

      addFactura(facturaData);
      marcarComoAceptado(selectedPresupuesto.id);
      setShowGenerarFacturaModal(false);
      setSelectedPresupuesto(null);
      toast.success('Factura generada correctamente');
    } catch (error) {
      toast.error('Error al generar la factura');
    }
  };

  const filteredPresupuestos = presupuestos.filter(presupuesto => {
    const matchesSearch = Object.values(presupuesto).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const presupuestoDate = new Date(presupuesto.fecha);
    const desde = fechaDesde ? new Date(fechaDesde) : null;
    const hasta = fechaHasta ? new Date(fechaHasta) : null;

    const matchesFechaDesde = !desde || presupuestoDate >= desde;
    const matchesFechaHasta = !hasta || presupuestoDate <= hasta;

    return matchesSearch && matchesFechaDesde && matchesFechaHasta;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aceptado':
        return 'bg-success';
      case 'rechazado':
        return 'bg-danger';
      default:
        return 'bg-warning';
    }
  };

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Listado de Presupuestos</h3>
                <div className="card-tools">
                  <Link to="/ventas/presupuestos/nuevo" className="btn btn-primary btn-sm">
                    <i className="fas fa-plus"></i> Nuevo Presupuesto
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
                        placeholder="Buscar presupuestos..."
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
                  <div className="d-flex align-items-center">
                    <label className="mb-0 mr-2">Filtrar de:</label>
                    <input
                      type="date"
                      className="form-control mr-2"
                      style={{ width: '160px' }}
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                    />
                    <label className="mb-0 mx-2">a:</label>
                    <input
                      type="date"
                      className="form-control"
                      style={{ width: '160px' }}
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                    />
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Contacto</th>
                        <th>Comercial</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPresupuestos.map((presupuesto) => (
                        <tr key={presupuesto.id}>
                          <td>{presupuesto.numero}</td>
                          <td>{new Date(presupuesto.fecha).toLocaleDateString()}</td>
                          <td>{presupuesto.cliente}</td>
                          <td>{presupuesto.contacto}</td>
                          <td>{presupuesto.comercial}</td>
                          <td>€{presupuesto.total.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${getEstadoColor(presupuesto.estado)}`}>
                              {presupuesto.estado.charAt(0).toUpperCase() + presupuesto.estado.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group">
                              <Link
                                to={`/ventas/presupuestos/${presupuesto.id}`}
                                className="btn btn-default btn-xs"
                                title="Ver detalles"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                              {presupuesto.estado === 'pendiente' && (
                                <>
                                  <Link
                                    to={`/ventas/presupuestos/editar/${presupuesto.id}`}
                                    className="btn btn-info btn-xs"
                                    title="Editar"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </Link>
                                  <button
                                    onClick={() => handleAceptar(presupuesto)}
                                    className="btn btn-success btn-xs"
                                    title="Aceptar y generar factura"
                                  >
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <button
                                    onClick={() => handleRechazar(presupuesto.id)}
                                    className="btn btn-danger btn-xs"
                                    title="Rechazar"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDelete(presupuesto.id)}
                                className="btn btn-danger btn-xs"
                                title="Eliminar"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                              <button className="btn btn-default btn-xs" title="Descargar PDF">
                                <i className="fas fa-download"></i>
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

      {selectedPresupuesto && (
        <GenerarFacturaModal
          show={showGenerarFacturaModal}
          onHide={() => {
            setShowGenerarFacturaModal(false);
            setSelectedPresupuesto(null);
          }}
          onConfirm={handleGenerarFactura}
          presupuesto={selectedPresupuesto}
        />
      )}
    </div>
  );
}