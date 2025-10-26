
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CashierDashboard = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [taxRate, setTaxRate] = useState(8); // 8% default tax rate
  const [paymentMethods, setPaymentMethods] = useState([{ method: 'cash', amount: 0 }]);
  const [amountPaid, setAmountPaid] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
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

  const getSubtotal = () =>
    cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

  const getTaxAmount = () => (getSubtotal() * taxRate) / 100;

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discountAmount = parseFloat(discount) || 0; // Ensure it's a number
    const taxAmount = getTaxAmount();
    const total = subtotal - discountAmount + taxAmount;
    return total.toFixed(2);
  };

  const getChange = () => {
    const total = parseFloat(getTotal());
    const paid = parseFloat(amountPaid) || 0;
    return paid >= total ? (paid - total).toFixed(2) : '0.00';
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage("Cart is empty!");
      return;
    }

    const total = parseFloat(getTotal());
    const paid = parseFloat(amountPaid) || 0;

    if (paid < total) {
      setMessage(`Insufficient payment! Required: $${total.toFixed(2)}, Received: $${paid.toFixed(2)}`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            product: item._id,
            quantity: item.qty
          })),
          discount: parseFloat(discount) || 0,
          tax: getTaxAmount(),
          paymentMethods: paymentMethods.map(pm => ({
            method: pm.method,
            amount: parseFloat(pm.amount) || 0
          })),
          amountPaid: paid
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Sale completed! Change: $${data.change || getChange()}`);
        setCart([]);
        setDiscount(0);
        setTax(0);
        setAmountPaid(0);
        setPaymentMethods([{ method: 'cash', amount: 0 }]);
        setShowCheckoutModal(false);
        setTimeout(() => setMessage(""), 5000);
        fetchProducts(); // Refresh inventory
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setMessage("Error processing transaction.");
    }
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
            <div className="mt-4 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span>Discount:</span>
                <div className="flex items-center">
                  <span className="mr-1 text-red-600">-$</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border rounded text-right"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax ({taxRate}%):</span>
                <span className="text-green-600">+${getTaxAmount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">${getTotal()}</span>
              </div>
              <button
                onClick={() => setShowCheckoutModal(true)}
                disabled={cart.length === 0}
                className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg mt-4"
              >
                Checkout
              </button>
            </div>
            {message && (
              <div className={`mt-2 p-2 rounded ${message.includes('Error') || message.includes('Insufficient') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} font-semibold text-center`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Complete Payment</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-red-600">
                  <span>Discount:</span>
                  <span>-${(parseFloat(discount) || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Tax ({taxRate}%):</span>
                  <span>+${getTaxAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total Due:</span>
                  <span className="text-green-600">${getTotal()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method:</label>
                <select
                  value={paymentMethods[0]?.method || 'cash'}
                  onChange={(e) => setPaymentMethods([{ method: e.target.value, amount: 0 }])}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="mobile">Mobile Payment</option>
                  <option value="voucher">Voucher</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount Paid ($):</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-md"
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                  autoFocus
                />
              </div>

              {amountPaid >= parseFloat(getTotal()) && (
                <div className="bg-green-50 p-4 rounded border border-green-200">
                  <div className="flex justify-between text-lg font-bold text-green-700">
                    <span>Change:</span>
                    <span>${getChange()}</span>
                  </div>
                </div>
              )}

              {amountPaid > 0 && amountPaid < parseFloat(getTotal()) && (
                <div className="bg-red-50 p-4 rounded border border-red-200">
                  <div className="text-red-700 text-sm">
                    Insufficient payment! Short by ${(parseFloat(getTotal()) - amountPaid).toFixed(2)}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleCheckout}
                  disabled={amountPaid < parseFloat(getTotal())}
                  className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  Complete Sale
                </button>
                <button
                  onClick={() => {
                    setShowCheckoutModal(false);
                    setAmountPaid(0);
                    setMessage("");
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierDashboard;
