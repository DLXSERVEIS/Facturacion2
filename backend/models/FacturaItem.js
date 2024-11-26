import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Factura from './Factura.js';

const FacturaItem = sequelize.define('FacturaItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

FacturaItem.belongsTo(Factura, {
  foreignKey: 'facturaId',
  onDelete: 'CASCADE',
});

Factura.hasMany(FacturaItem, {
  foreignKey: 'facturaId',
});

export default FacturaItem;