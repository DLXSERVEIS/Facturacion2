import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Empresa = sequelize.define('Empresa', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nif: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: DataTypes.STRING,
  codigoPostal: DataTypes.STRING,
  ciudad: DataTypes.STRING,
  telefono: DataTypes.STRING,
  email: DataTypes.STRING,
  logo: DataTypes.TEXT,
});

export default Empresa;