
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CashierDashboard from './pages/CashierDashboard';
import AddProduct from './components/AddProduct';
import EditProduct from './pages/EditProduct'; // Import the new EditProduct page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Changed to /admin for consistency */}
      <Route path="/admin" element={<AdminDashboard />} /> 
      <Route path="/admin/addproduct" element={<AddProduct />} />
      {/* Add the new route for editing a product */}
      <Route path="/admin/editproduct/:id" element={<EditProduct />} />
      <Route path="/cashier" element={<CashierDashboard />} />

    </Routes>
  );
}

export default App;
