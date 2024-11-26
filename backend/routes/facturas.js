import express from 'express';
import Factura from '../models/Factura.js';
import FacturaItem from '../models/FacturaItem.js';

const router = express.Router();

// Obtener todas las facturas
router.get('/', async (req, res) => {
  try {
    const facturas = await Factura.findAll({
      include: [FacturaItem],
      order: [['fecha', 'DESC']],
    });
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear nueva factura
router.post('/', async (req, res) => {
  try {
    const factura = await Factura.create(req.body, {
      include: [FacturaItem],
    });
    res.status(201).json(factura);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar factura
router.put('/:id', async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id);
    if (factura) {
      await factura.update(req.body);
      res.json(factura);
    } else {
      res.status(404).json({ message: 'Factura no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar factura
router.delete('/:id', async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id);
    if (factura) {
      await factura.destroy();
      res.json({ message: 'Factura eliminada' });
    } else {
      res.status(404).json({ message: 'Factura no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;