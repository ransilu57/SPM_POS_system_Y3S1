import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-yellow-900 mb-4">
          Point of Sale System
        </h1>
        <p className="text-xl text-yellow-700">
          for Supermarkets
        </p>
        <p className="text-lg text-gray-600 mt-4">
          Streamlining your sales, one transaction at a time.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-12 border-2 border-yellow-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Select Login Type
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Login Button */}
          <button
            onClick={() => navigate('/login/admin')}
            className="group relative overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl p-8 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            <div className="relative z-10">
              <div className="text-6xl mb-4">👨‍💼</div>
              <h3 className="text-2xl font-bold mb-2">Admin</h3>
              <p className="text-sm text-yellow-50">
                Manage products, cashiers & system
              </p>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>

          {/* Cashier Login Button */}
          <button
            onClick={() => navigate('/login/cashier')}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl p-8 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            <div className="relative z-10">
              <div className="text-6xl mb-4">🧑‍💼</div>
              <h3 className="text-2xl font-bold mb-2">Cashier</h3>
              <p className="text-sm text-blue-50">
                Process sales & manage transactions
              </p>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Select your role to continue to the login page</p>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400">
        <p>© 2025 POS System. All rights reserved.</p>
      </div>
    </div>
  );
};

export default RoleSelection;
