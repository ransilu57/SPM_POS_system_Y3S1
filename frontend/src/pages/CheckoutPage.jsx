import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], totalAmount = 0 } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Calculations
  const subtotal = totalAmount;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + tax;
  const cashReceivedAmount = parseFloat(cashReceived) || 0;
  const change = cashReceivedAmount - finalTotal;

  // Redirect if no cart data
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">No Items to Checkout</h2>
          <p className="text-gray-600 mb-4">Please add items to your cart first.</p>
          <Link
            to="/cashier"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Back to POS
          </Link>
        </div>
      </div>
    );
  }

  const handleProcessPayment = async () => {
    if (paymentMethod === 'cash' && cashReceivedAmount < finalTotal) {
      alert('Insufficient cash received');
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate transaction ID
      const txnId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      setTransactionId(txnId);
      setTransactionComplete(true);

      // Here you would typically:
      // 1. Create a sale record in the database
      // 2. Update product stock
      // 3. Generate receipt
      // 4. Print receipt (if printer connected)

      console.log('Transaction completed:', {
        transactionId: txnId,
        items: cart,
        subtotal,
        tax,
        total: finalTotal,
        paymentMethod,
        cashReceived: paymentMethod === 'cash' ? cashReceivedAmount : finalTotal,
        change: paymentMethod === 'cash' ? change : 0,
        customerName,
        customerPhone,
        timestamp: new Date().toISOString()
      });

    } catch {
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleNewSale = () => {
    navigate('/cashier');
  };

  const printReceipt = () => {
    const receiptContent = `
      ========================================
                    RECEIPT
      ========================================
      Transaction ID: ${transactionId}
      Date: ${new Date().toLocaleString()}
      
      Customer: ${customerName || 'Walk-in Customer'}
      Phone: ${customerPhone || 'N/A'}
      
      ========================================
                     ITEMS
      ========================================
      ${cart.map(item => 
        `${item.name}\n  ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${(item.quantity * item.unitPrice).toFixed(2)}`
      ).join('\n\n')}
      
      ========================================
      Subtotal:          $${subtotal.toFixed(2)}
      Tax (8%):          $${tax.toFixed(2)}
      Total:             $${finalTotal.toFixed(2)}
      
      Payment Method:    ${paymentMethod.toUpperCase()}
      ${paymentMethod === 'cash' ? `Cash Received:     $${cashReceivedAmount.toFixed(2)}` : ''}
      ${paymentMethod === 'cash' ? `Change:            $${change.toFixed(2)}` : ''}
      
      ========================================
                Thank You for Your Business!
      ========================================
    `;

    // In a real implementation, this would send to a receipt printer
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`<pre style="font-family: monospace; font-size: 12px; white-space: pre-wrap;">${receiptContent}</pre>`);
    newWindow.document.close();
    newWindow.print();
  };

  if (transactionComplete) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
          <div className="space-y-2 text-left bg-gray-50 p-4 rounded mb-6">
            <p><strong>Transaction ID:</strong> {transactionId}</p>
            <p><strong>Total:</strong> ${finalTotal.toFixed(2)}</p>
            <p><strong>Payment:</strong> {paymentMethod.toUpperCase()}</p>
            {paymentMethod === 'cash' && (
              <p><strong>Change:</strong> ${change.toFixed(2)}</p>
            )}
          </div>
          <div className="space-y-3">
            <button
              onClick={printReceipt}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Print Receipt
            </button>
            <button
              onClick={handleNewSale}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              New Sale
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
            <Link
              to="/cashier"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Back to POS
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            {/* Items List */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="font-semibold">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>

            {/* Customer Information */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Customer Information (Optional)</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Payment Method</h3>
              <div className="space-y-2">
                {['cash', 'card', 'digital'].map(method => (
                  <label key={method} className="flex items-center">
                    <input
                      type="radio"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="capitalize">{method} Payment</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cash Payment Details */}
            {paymentMethod === 'cash' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cash Received
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={finalTotal}
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder={`Minimum: $${finalTotal.toFixed(2)}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {cashReceivedAmount >= finalTotal && (
                  <p className="mt-2 text-green-600 font-semibold">
                    Change: ${change.toFixed(2)}
                  </p>
                )}
                {cashReceivedAmount > 0 && cashReceivedAmount < finalTotal && (
                  <p className="mt-2 text-red-600 font-semibold">
                    Insufficient amount (Need ${(finalTotal - cashReceivedAmount).toFixed(2)} more)
                  </p>
                )}
              </div>
            )}

            {/* Process Payment Button */}
            <button
              onClick={handleProcessPayment}
              disabled={processing || (paymentMethod === 'cash' && cashReceivedAmount < finalTotal)}
              className={`w-full py-3 px-4 rounded-lg font-bold transition duration-200 ${
                processing || (paymentMethod === 'cash' && cashReceivedAmount < finalTotal)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {processing ? 'Processing Payment...' : `Process Payment ($${finalTotal.toFixed(2)})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;