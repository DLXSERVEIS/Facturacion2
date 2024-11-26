import express from 'express';
import Empresa from '../models/Empresa.js';

const router = express.Router();

// Obtener configuración de empresa
router.get('/', async (req, res) => {
  try {
    const empresa = await Empresa.findOne();
    res.json(empresa || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar configuración de empresa
router.put('/', async (req, res) => {
  try {
    let empresa = await Empresa.findOne();
    if (empresa) {
      empresa = await empresa.update(req.body);
    } else {
      empresa = await Empresa.create(req.body);
    }
    res.json(empresa);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;