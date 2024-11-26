import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Factura = sequelize.define('Factura', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tipo: {
    type: DataTypes.ENUM('compra', 'venta'),
    allowNull: false,
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fechaVencimiento: DataTypes.DATE,
  fechaPago: DataTypes.DATE,
  estado: {
    type: DataTypes.ENUM('pendiente', 'pagada', 'vencida'),
    defaultValue: 'pendiente',
  },
  cliente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nifCliente: DataTypes.STRING,
  direccionCliente: DataTypes.STRING,
  ciudadCliente: DataTypes.STRING,
  cpCliente: DataTypes.STRING,
  emailCliente: DataTypes.STRING,
  telefonoCliente: DataTypes.STRING,
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  iva: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  archivoNombre: DataTypes.STRING,
  archivoUrl: DataTypes.TEXT,
  archivoTipo: DataTypes.STRING,
});

export default Factura;