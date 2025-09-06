import { Link, useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList'; // Import the new component

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, Admin! Manage your products and settings.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/manage-cashiers"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Manage Cashiers
            </Link>
            <Link
              to="/admin/addproduct"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              + Add New Product
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Display the product list */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
