import React, { useState } from "react";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 0,
    unitPrice: 0,
    image: null, // Changed to null for file handling
  });

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
    // Create a FormData object to handle multipart/form-data for the image
    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("quantity", formData.quantity);
    productData.append("unitPrice", formData.unitPrice);
    if (formData.image) {
      productData.append("image", formData.image);
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          // 'Content-Type' is not needed; the browser will set it for FormData
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: productData,
      });

      if (response.ok) {
        console.log("Product added successfully");
        // Optionally reset form or navigate away
        setFormData({
          name: "",
          description: "",
          quantity: 0,
          unitPrice: 0,
          image: null,
        });
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Product</h2>
  <form onSubmit={handleSubmit} className="space-y-5">
    <div>
      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
        Product Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
        Product Description
      </label>
      <input
        type="text"
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
        Product Quantity
      </label>
      <input
        type="number"
        id="quantity"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        min="0"
      />
    </div>

    <div>
      <label htmlFor="unitPrice" className="block text-sm font-semibold text-gray-700 mb-2">
        Unit Price
      </label>
      <input
        type="number"
        id="unitPrice"
        name="unitPrice"
        value={formData.unitPrice}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        min="0"
        step="0.01"
      />
    </div>

    <div>
      <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
        Image
      </label>
      <input
        type="file"
        id="image"
        name="image"
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <button
      type="submit"
      className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
    >
      Add Product
    </button>
  </form>
</div>

  );
}

export default AddProduct;