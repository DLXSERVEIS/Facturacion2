import { useState } from 'react';
import { toast } from 'react-hot-toast';
import DraggableModal from '../DraggableModal';

interface GenerarFacturaModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  presupuesto: {
    numero: string;
    total: number;
  };
}

export default function GenerarFacturaModal({ show, onHide, onConfirm, presupuesto }: GenerarFacturaModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      onConfirm();
      toast.success('Factura generada correctamente');
      onHide();
    } catch (error) {
      toast.error('Error al generar la factura');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DraggableModal
      show={show}
      onHide={onHide}
      title="Generar Factura desde Presupuesto"
    >
      <div className="modal-body">
        <p>¿Está seguro de que desea generar una factura a partir del presupuesto <strong>{presupuesto.numero}</strong>?</p>
        <p>
          <strong>Importe:</strong> €{presupuesto.total.toFixed(2)}
        </p>
        <p className="text-info">
          <i className="fas fa-info-circle mr-2"></i>
          Se creará una nueva factura con los datos del presupuesto.
        </p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onHide}>
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Generando...' : 'Generar Factura'}
        </button>
      </div>
    </DraggableModal>
  );
}