import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FacturasVenta from './pages/ventas/FacturasVenta';
import FacturasCompra from './pages/compras/FacturasCompra';
import NuevaFacturaVenta from './pages/ventas/NuevaFacturaVenta';
import NuevaFacturaCompra from './pages/compras/NuevaFacturaCompra';
import EditarFacturaVenta from './pages/ventas/EditarFacturaVenta';
import EditarFacturaCompra from './pages/compras/EditarFacturaCompra';
import Login from './pages/Login';
import Register from './pages/Register';
import FacturaDetalle from './pages/FacturaDetalle';
import Clientes from './pages/clientes/Clientes';
import NuevoCliente from './pages/clientes/NuevoCliente';
import EditarCliente from './pages/clientes/EditarCliente';
import Proveedores from './pages/proveedores/Proveedores';
import NuevoProveedor from './pages/proveedores/NuevoProveedor';
import EditarProveedor from './pages/proveedores/EditarProveedor';
import Productos from './pages/productos/Productos';
import NuevoProducto from './pages/productos/NuevoProducto';
import EditarProducto from './pages/productos/EditarProducto';
import Presupuestos from './pages/ventas/Presupuestos';
import NuevoPresupuesto from './pages/ventas/NuevoPresupuesto';
import EditarPresupuesto from './pages/ventas/EditarPresupuesto';
import PresupuestoDetalle from './pages/ventas/PresupuestoDetalle';
import Usuarios from './pages/usuarios/Usuarios';
import NuevoUsuario from './pages/usuarios/NuevoUsuario';
import EditarUsuario from './pages/usuarios/EditarUsuario';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />
              
              {/* Rutas de Ventas */}
              <Route path="ventas/facturas" element={<FacturasVenta />} />
              <Route path="ventas/facturas/nueva" element={<NuevaFacturaVenta />} />
              <Route path="ventas/facturas/editar/:id" element={<EditarFacturaVenta />} />
              <Route path="ventas/facturas/:id" element={<FacturaDetalle />} />
              <Route path="ventas/presupuestos" element={<Presupuestos />} />
              <Route path="ventas/presupuestos/nuevo" element={<NuevoPresupuesto />} />
              <Route path="ventas/presupuestos/editar/:id" element={<EditarPresupuesto />} />
              <Route path="ventas/presupuestos/:id" element={<PresupuestoDetalle />} />
              
              {/* Rutas de Compras */}
              <Route path="compras/facturas" element={<FacturasCompra />} />
              <Route path="compras/facturas/nueva" element={<NuevaFacturaCompra />} />
              <Route path="compras/facturas/editar/:id" element={<EditarFacturaCompra />} />
              <Route path="compras/facturas/:id" element={<FacturaDetalle />} />
              
              {/* Rutas de Clientes */}
              <Route path="clientes" element={<Clientes />} />
              <Route path="clientes/nuevo" element={<NuevoCliente />} />
              <Route path="clientes/:id" element={<EditarCliente />} />
              
              {/* Rutas de Proveedores */}
              <Route path="proveedores" element={<Proveedores />} />
              <Route path="proveedores/nuevo" element={<NuevoProveedor />} />
              <Route path="proveedores/:id" element={<EditarProveedor />} />
              
              {/* Rutas de Productos */}
              <Route path="productos" element={<Productos />} />
              <Route path="productos/nuevo" element={<NuevoProducto />} />
              <Route path="productos/editar/:id" element={<EditarProducto />} />
              
              {/* Rutas de Usuarios */}
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="usuarios/nuevo" element={<NuevoUsuario />} />
              <Route path="usuarios/editar/:id" element={<EditarUsuario />} />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;