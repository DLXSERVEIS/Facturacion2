-- Create database if not exists
CREATE DATABASE IF NOT EXISTS facturas_db;
USE facturas_db;

-- Empresa table
CREATE TABLE IF NOT EXISTS empresas (
  id VARCHAR(36) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  nif VARCHAR(50) NOT NULL,
  direccion VARCHAR(255),
  codigoPostal VARCHAR(10),
  ciudad VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(255),
  logo TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
  id VARCHAR(36) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  departamento ENUM('comercial', 'administracion') NOT NULL,
  activo BOOLEAN DEFAULT true,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert admin user with password '123456'
INSERT INTO usuarios (id, nombre, email, password, departamento, activo)
VALUES (
  UUID(),
  'Administrador',
  'admin',
  '$2a$10$8Ux9XHxQFjfyF1/U1TxPs.q0gby5kQUuG9OoMjsJ6oYcAXvdvDYxm',
  'administracion',
  true
);

-- Facturas table
CREATE TABLE IF NOT EXISTS facturas (
  id VARCHAR(36) PRIMARY KEY,
  tipo ENUM('compra', 'venta') NOT NULL,
  numero VARCHAR(50) NOT NULL,
  fecha DATE NOT NULL,
  fechaVencimiento DATE,
  fechaPago DATE,
  estado ENUM('pendiente', 'pagada', 'vencida') DEFAULT 'pendiente',
  cliente VARCHAR(255) NOT NULL,
  nifCliente VARCHAR(50),
  direccionCliente VARCHAR(255),
  ciudadCliente VARCHAR(100),
  cpCliente VARCHAR(10),
  emailCliente VARCHAR(255),
  telefonoCliente VARCHAR(20),
  subtotal DECIMAL(10,2) NOT NULL,
  iva DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  archivoNombre VARCHAR(255),
  archivoUrl TEXT,
  archivoTipo VARCHAR(50),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Factura items table
CREATE TABLE IF NOT EXISTS factura_items (
  id VARCHAR(36) PRIMARY KEY,
  facturaId VARCHAR(36) NOT NULL,
  descripcion TEXT NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  precioUnitario DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facturaId) REFERENCES facturas(id) ON DELETE CASCADE
);