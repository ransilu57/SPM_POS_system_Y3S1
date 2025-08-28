import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return loggedIn ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
