import React from 'react';

const Cart = ({ cart, onRemoveFromCart, onUpdateQuantity, onClearCart, totalAmount }) => {
  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity >= 0) {
      onUpdateQuantity(productId, quantity);
    }
  };

  const increaseQuantity = (productId, currentQuantity) => {
    onUpdateQuantity(productId, currentQuantity + 1);
  };

  const decreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      onUpdateQuantity(productId, currentQuantity - 1);
    } else {
      onRemoveFromCart(productId);
    }
  };

  if (cart.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-500">Your cart is empty</p>
          <p className="text-sm text-gray-400 mt-2">Add products to start a new sale</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Shopping Cart</h2>
        <button
          onClick={onClearCart}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        {cart.map(item => (
          <div key={item._id} className="bg-gray-50 p-3 rounded-lg border">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-sm truncate" title={item.name}>
                  {item.name}
                </h4>
                <p className="text-xs text-gray-600 truncate" title={item.description}>
                  {item.description}
                </p>
                <p className="text-sm font-semibold text-green-600">
                  ${parseFloat(item.unitPrice || 0).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => onRemoveFromCart(item._id)}
                className="text-red-500 hover:text-red-700 ml-2"
                title="Remove item"
              >
                ✕
              </button>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => decreaseQuantity(item._id, item.quantity)}
                  className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm"
                >
                  −
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                  className="w-12 text-center border border-gray-300 rounded px-1 py-1 text-sm"
                  min="1"
                />
                <button
                  onClick={() => increaseQuantity(item._id, item.quantity)}
                  className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm"
                >
                  +
                </button>
              </div>
              <div className="text-sm font-semibold text-gray-800">
                ${(parseFloat(item.unitPrice || 0) * item.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="border-t pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Items:</span>
            <span>{cart.reduce((total, item) => total + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (8%):</span>
            <span>${(totalAmount * 0.08).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">
                ${(totalAmount * 1.08).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const confirmation = window.confirm('Are you sure you want to clear the cart?');
              if (confirmation) onClearCart();
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium py-2 px-3 rounded transition duration-200"
          >
            Clear Cart
          </button>
          <button
            onClick={() => {
              const cartData = {
                items: cart,
                totalAmount: totalAmount,
                tax: totalAmount * 0.08,
                finalTotal: totalAmount * 1.08,
                timestamp: new Date().toISOString()
              };
              console.log('Cart saved:', cartData);
              alert('Cart saved for later!');
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded transition duration-200"
          >
            Save Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;