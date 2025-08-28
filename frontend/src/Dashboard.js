import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard({ onLogout }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        setError('Unauthorized. Please login again.');
        onLogout();
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '100px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Admin Dashboard</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {data ? (
        <pre style={{ background: '#f7f7f7', padding: 16 }}>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <div>Loading...</div>
      )}
      <button onClick={onLogout} style={{ marginTop: 20 }}>Logout</button>
    </div>
  );
}
