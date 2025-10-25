
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import AdminLogin from './pages/Login';
import CashierLogin from './pages/CashierLogin';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CashierDashboard from './pages/CashierDashboard';
import AddProduct from './components/AddProduct';
import EditProduct from './pages/EditProduct';
import ManageCashiers from './pages/ManageCashiers';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Default route - Role Selection Page */}
      <Route path="/" element={<RoleSelection />} />
      
      {/* Login routes */}
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/cashier" element={<CashierLogin />} />
      
      {/* Legacy login route - redirect to role selection */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      
      {/* Admin routes - protected and require admin role */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/addproduct" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AddProduct />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/editproduct/:id" 
        element={
          <ProtectedRoute requiredRole="admin">
            <EditProduct />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/manage-cashiers" 
        element={
          <ProtectedRoute requiredRole="admin">
            <ManageCashiers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <ProtectedRoute requiredRole="admin">
            <Register />
          </ProtectedRoute>
        } 
      />
      
      {/* Cashier routes - protected and require cashier role */}
      <Route 
        path="/cashier" 
        element={
          <ProtectedRoute requiredRole="cashier">
            <CashierDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;

