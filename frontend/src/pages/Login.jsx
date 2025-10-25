import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify token is valid before auto-redirecting
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (token && role === "admin") {
        try {
          // Try to fetch products to verify token is valid
          const res = await fetch("http://localhost:5000/api/products", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          
          if (res.ok) {
            // Token is valid, redirect to admin dashboard
            navigate("/admin");
          } else {
            // Token is invalid or expired, clear localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("role");
          }
        } catch {
          // Error verifying token, clear localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      }
    };

    verifyToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, loginType: "admin" }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Check if the logged in user is actually an admin
        if (data.role !== "admin") {
          setError("Access denied. Please use the cashier login.");
          setLoading(false);
          return;
        }
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        navigate("/admin");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 px-4">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">👨‍💼</div>
        <h1 className="text-4xl font-bold text-yellow-900">Admin Login</h1>
        <p className="text-lg text-yellow-700 mt-2">Manage your POS system</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 border-2 border-yellow-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors bg-yellow-50 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors bg-yellow-50 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-4 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-600 text-center bg-red-50 border border-red-300 rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium transition-colors"
          >
            ← Back to Role Selection
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200">
            Default: <span className="font-mono font-semibold">admin / admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
