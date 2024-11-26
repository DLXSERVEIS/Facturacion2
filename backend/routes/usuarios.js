import express from 'express';
import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !await usuario.verificarPassword(password)) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ message: 'Usuario inactivo' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, departamento: usuario.departamento },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        departamento: usuario.departamento,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los usuarios (protegido - solo administración)
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear usuario (protegido - solo administración)
router.post('/', async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    const { password, ...usuarioSinPassword } = usuario.toJSON();
    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar usuario (protegido - solo administración)
router.put('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    await usuario.update(req.body);
    const { password, ...usuarioSinPassword } = usuario.toJSON();
    res.json(usuarioSinPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;