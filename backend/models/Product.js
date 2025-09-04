import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Product name is required"],
        trim: true 
    },
    description: { 
        type: String, 
        required: [true, "Description is required"],
        trim: true 
    },
    unitPrice: { 
        type: Number, 
        required: [true, "Unit price is required"], 
        min: [0.01, "Unit price must be positive"] 
    },
    image: {
        data: { type: Buffer },
        contentType: { type: String }
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;