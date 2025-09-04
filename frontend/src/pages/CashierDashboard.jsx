import React from 'react';
import { useNavigate } from 'react-router-dom';

const CashierDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h1>Cashier Dashboard</h1>
      <p>Welcome, Cashier! Here you can process sales, view transactions, and manage inventory.</p>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {/* Add more cashier-specific features here */}
    </div>
  );
};

export default CashierDashboard;
