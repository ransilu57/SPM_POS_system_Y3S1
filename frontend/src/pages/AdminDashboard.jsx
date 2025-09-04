import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Here you can manage users, view reports, and configure system settings.</p>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {/* Add more admin-specific features here */}
    </div>
  );
};

export default AdminDashboard;
