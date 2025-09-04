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
            const { name, description, unitPrice } = req.body;

            // Basic input validation
            if (!name || !description || typeof unitPrice !== "number") {
                return res.status(400).json({ message: "Invalid input: name, description, and unitPrice are required" });
            }

            const image = req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : null;

            const product = new Product({ name, description, unitPrice, image });
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

        const products = await Product.find()
            .skip(skip)
            .limit(Number(limit));
        const total = await Product.countDocuments();

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

// Update a product
export async function updateProduct(req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Error uploading image", error: err.message });
        }
        try {
            const { id } = req.params;
            const { name, description, unitPrice } = req.body;

            // Basic input validation
            if (!name || !description || typeof unitPrice !== "number") {
                return res.status(400).json({ message: "Invalid input: name, description, and unitPrice are required" });
            }
            const image = req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : undefined;

            const product = await Product.findByIdAndUpdate(
                id,
                { name, description, unitPrice, ...(image && { image }) },
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