import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CashierLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, loginType: "cashier" }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Check if the logged in user is actually a cashier
        if (data.role !== "cashier") {
          setError("Access denied. Please use the admin login.");
          setLoading(false);
          return;
        }
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        navigate("/cashier");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🧑‍💼</div>
        <h1 className="text-4xl font-bold text-blue-900">Cashier Login</h1>
        <p className="text-lg text-blue-700 mt-2">Access the Point of Sale system</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 border-2 border-blue-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-blue-50 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-blue-50 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login as Cashier"}
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
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            ← Back to Role Selection
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Contact your administrator if you need assistance</p>
        </div>
      </div>
    </div>
  );
};

export default CashierLogin;
