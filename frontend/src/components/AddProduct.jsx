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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Product Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block mb-1 font-medium">
            Product Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="unitPrice" className="block mb-1 font-medium">
            Unit Price
          </label>
          <input
            type="number"
            id="unitPrice"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="image" className="block mb-1 font-medium">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;