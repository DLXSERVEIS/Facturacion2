import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import facturasRoutes from './routes/facturas.js';
import empresaRoutes from './routes/empresa.js';
import usuariosRoutes from './routes/usuarios.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Rutas públicas
app.use('/api/usuarios/login', usuariosRoutes);

// Rutas protegidas
app.use('/api/facturas', verificarToken, facturasRoutes);
app.use('/api/empresa', verificarToken, empresaRoutes);
app.use('/api/usuarios', verificarToken, usuariosRoutes);

// Sincronizar base de datos
sequelize.sync().then(() => {
  console.log('Base de datos sincronizada');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});