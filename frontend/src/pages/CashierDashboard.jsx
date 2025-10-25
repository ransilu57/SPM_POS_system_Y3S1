
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CashierDashboard = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        console.error("Failed to fetch products:", res.status);
        setMessage("Failed to load products. Please try logging in again.");
        return;
      }
      
      const data = await res.json();
      setProducts(data.products || []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Error loading products.");
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((item) => item._id === product._id);
      if (found) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0).toFixed(2);

  const handleCheckout = () => {
    setMessage("Sale completed! (Simulation)");
    setCart([]);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Cashier Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Products</h2>
          <div className="bg-white rounded shadow p-4 max-h-[400px] overflow-y-auto">
            {products.length === 0 ? (
              <div className="text-gray-500">No products available.</div>
            ) : (
              <ul>
                {products.map((product) => (
                  <li
                    key={product._id}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <div>
                      <span className="font-medium">{product.name}</span>
                      <span className="ml-2 text-gray-500">
                        (${product.unitPrice})
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Cart */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Cart</h2>
          <div className="bg-white rounded shadow p-4 min-h-[200px]">
            {cart.length === 0 ? (
              <div className="text-gray-500">Cart is empty.</div>
            ) : (
              <ul>
                {cart.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-2 text-gray-500">
                        x{item.qty} (${(item.unitPrice * item.qty).toFixed(2)})
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex justify-between items-center">
              <span className="font-bold text-lg">Total: ${getTotal()}</span>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                Checkout
              </button>
            </div>
            {message && (
              <div className="mt-2 text-green-600 font-semibold">{message}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;
