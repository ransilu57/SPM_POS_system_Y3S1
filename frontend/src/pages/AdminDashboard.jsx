import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Here you can manage users, view reports, and configure system settings.</p>
      {/* Add more admin-specific features here */}
      <Link to={"/admin/addproduct"}>Add Product</Link>
    </div>
  );
};

export default AdminDashboard;
