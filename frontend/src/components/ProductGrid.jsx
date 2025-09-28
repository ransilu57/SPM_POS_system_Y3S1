import React, { useState } from 'react';

const ProductGrid = ({ products, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);

  const handleAddToCart = (product) => {
    onAddToCart(product);
    // Optional: Show a brief success message
    const button = document.getElementById(`add-btn-${product._id}`);
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Added!';
      button.classList.add('bg-green-700');
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-green-700');
      }, 1000);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products available.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              {/* Product Image Placeholder */}
              <div className="w-full h-32 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-500 text-4xl">📦</span>
                )}
              </div>

              {/* Product Info */}
              <div className="mb-3">
                <h3 className="font-semibold text-gray-800 truncate" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 truncate" title={product.description}>
                  {product.description}
                </p>
                {product.category && (
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Price and Stock */}
              <div className="mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">
                    ${parseFloat(product.unitPrice || 0).toFixed(2)}
                  </span>
                  <span className={`text-sm ${
                    (product.quantity || 0) > 10 ? 'text-green-600' : 
                    (product.quantity || 0) > 0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    Stock: {product.quantity || 0}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                id={`add-btn-${product._id}`}
                onClick={() => handleAddToCart(product)}
                disabled={(product.quantity || 0) <= 0}
                className={`w-full py-2 px-4 rounded-lg font-medium transition duration-200 ${
                  (product.quantity || 0) <= 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {(product.quantity || 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="mt-6 text-center text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
};

export default ProductGrid;