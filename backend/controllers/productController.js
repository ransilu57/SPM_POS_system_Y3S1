import Product from '../models/product.js';

export async function addProduct(req, res) {
  try {
    const { productId, name, price } = req.body;
    const product = new Product({ productId, name, price });
    await product.save();
    res.status(201).json({ message: 'Product added', product });
  } catch (err) {
    res.status(400).json({ message: 'Error adding product', error: err.message });
  }
}

export async function getProducts(req, res) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const product = await Product.findOneAndUpdate(
      { productId: id },
      { name, price },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(400).json({ message: 'Error updating product', error: err.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ productId: id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting product', error: err.message });
  }
}
