import Product from "../models/Product.js";
import multer from "multer";

// Configure multer for in-memory storage of image uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPEG, PNG, and GIF images are allowed"));
        }
        cb(null, true);
    }
}).single("image"); // Expect 'image' field in form-data

// Add a new product
export async function addProduct(req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Error uploading image", error: err.message });
        }
        try {
            const { name, description } = req.body;
            const unitPrice = parseFloat(req.body.unitPrice);
            const quantity = parseInt(req.body.quantity, 10);

            // Basic input validation
            if (!name || !description || isNaN(unitPrice) || isNaN(quantity)) {
                return res.status(400).json({ message: "Invalid input: name, description, unitPrice, and quantity are required" });
            }

            const image = req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : null;

            const product = new Product({ name, description, unitPrice, quantity, image });
            await product.save();
            res.status(201).json({ message: "Product added", product });
        } catch (err) {
            console.error("Error adding product:", err);
            res.status(400).json({
                message: "Error adding product",
                error: err.message,
                details: err.name === "ValidationError" ? err.errors : null
            });
        }
    });
}

// Get all products with pagination
export async function getProducts(req, res) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return res.status(400).json({ message: "Invalid page or limit parameters" });
        }

        const productsFromDB = await Product.find()
            .skip(skip)
            .limit(Number(limit));
        const total = await Product.countDocuments();

        // Transform products to include a base64 image string for easier frontend rendering
        const products = productsFromDB.map(p => {
            const product = p.toObject(); // Convert Mongoose doc to plain object
            if (product.image && product.image.data) {
                product.image = `data:${product.image.contentType};base64,${product.image.data.toString('base64')}`;
            }
            return product;
        });

        res.json({
            message: "Products fetched successfully",
            products,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Error fetching products", error: err.message });
    }
}

// Get a single product by ID
export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const productFromDB = await Product.findById(id);

        if (!productFromDB) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Also convert image to base64 for consistency
        const product = productFromDB.toObject();
        if (product.image && product.image.data) {
            product.image = `data:${product.image.contentType};base64,${product.image.data.toString('base64')}`;
        }

        res.json({ message: "Product fetched successfully", product });
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ message: "Error fetching product", error: err.message });
    }
}

// Update a product
export async function updateProduct(req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Error uploading image", error: err.message });
        }
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const unitPrice = parseFloat(req.body.unitPrice);
            const quantity = parseInt(req.body.quantity, 10);

            // Basic input validation
            if (!name || !description || isNaN(unitPrice) || isNaN(quantity)) {
                return res.status(400).json({ message: "Invalid input: name, description, unitPrice, and quantity are required" });
            }

            const updateData = { name, description, unitPrice, quantity };

            if (req.file) {
                updateData.image = { data: req.file.buffer, contentType: req.file.mimetype };
            }

            const product = await Product.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.json({ message: "Product updated", product });
        } catch (err) {
            console.error("Error updating product:", err);
            res.status(400).json({
                message: "Error updating product",
                error: err.message,
                details: err.name === "ValidationError" ? err.errors : null
            });
        }
    });
}

// Delete a product
export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted", product });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(400).json({ message: "Error deleting product", error: err.message });
    }
}