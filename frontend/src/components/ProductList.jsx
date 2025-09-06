import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data.products);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (productId) => {
        navigate(`/admin/editproduct/${productId}`);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete product');
                }

                // Refresh the product list to show the deletion
                fetchProducts();
            } catch (err) {
                setError(err.message); // Show error to the user
                alert(`Error: ${err.message}`);
            }
        }
    };

    if (loading) return <p className="text-center mt-8">Loading products...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">Error: {error}</p>;

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Product List</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price (LKR)</th>
                            <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.length > 0 ? products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                <td className="py-4 px-6">
                                    {product.image ? (
                                        <img
                                            src={product.image} // Directly use the base64 string from the backend
                                            alt={product.name}
                                            className="h-16 w-16 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap">{product.name}</td>
                                <td className="py-4 px-6">{product.description}</td>
                                <td className="py-4 px-6 text-center">{product.quantity}</td>
                                <td className="py-4 px-6 text-right">{product.unitPrice.toFixed(2)}</td>
                                <td className="py-4 px-6 text-center">
                                    <button 
                                        onClick={() => handleEdit(product._id)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-xs mr-2 transition duration-200"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(product._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs transition duration-200"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
