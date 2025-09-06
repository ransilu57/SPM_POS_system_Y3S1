import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AddProduct from '../components/AddProduct';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Here you can manage users, view reports, and configure system settings.</p>
      
      {/* Add more admin-specific features here */}
      <Link to={"/admin/addproduct"}>Add Products</Link>
    </div>
    </>
  );
};

export default AdminDashboard;
