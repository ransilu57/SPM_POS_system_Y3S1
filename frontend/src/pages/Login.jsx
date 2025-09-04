import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "cashier") {
        navigate("/cashier");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else if (data.role === "cashier") {
          navigate("/cashier");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border-2 border-yellow-200">
        <h1 className="text-2xl font-bold underline text-center text-yellow-800 mb-8">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors bg-yellow-50"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors bg-yellow-50"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-colors font-medium shadow-md"
          >
            Login
          </button>
        </form>
        {error && (
          <p className="mt-4 text-yellow-800 text-center bg-yellow-100 border border-yellow-300 rounded-lg p-3">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
