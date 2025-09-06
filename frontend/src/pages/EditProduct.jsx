import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 0,
    unitPrice: 0,
    image: null, // For new image uploads
  });
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product data.");
        }

        const data = await response.json();
        const { name, description, quantity, unitPrice, image } = data.product;
        setFormData({ name, description, quantity, unitPrice, image: null });
        setCurrentImage(image || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("quantity", formData.quantity);
    productData.append("unitPrice", formData.unitPrice);
    if (formData.image) {
      productData.append("image", formData.image);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: productData,
      });

      if (response.ok) {
        alert("Product updated successfully!");
        navigate("/admin");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }
    } catch (error) {
      setError(error.message);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Product Description</label>
          <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">Product Quantity</label>
          <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" />
        </div>

        <div>
          <label htmlFor="unitPrice" className="block text-sm font-semibold text-gray-700 mb-2">Unit Price</label>
          <input type="number" id="unitPrice" name="unitPrice" value={formData.unitPrice} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" step="0.01" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Current Image</label>
          {currentImage ? <img src={currentImage} alt="Current product" className="w-32 h-32 object-cover rounded-md mb-4" /> : <p>No image available.</p>}
          <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">Upload New Image (Optional)</label>
          <input type="file" id="image" name="image" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="flex space-x-4">
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200">Update Product</button>
            <button type="button" onClick={() => navigate("/admin")} className="w-full py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 transition-colors duration-200">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
