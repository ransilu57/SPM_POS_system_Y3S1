import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productname: {type: String, required: true},
    description: {type: String, required: true},
    quantity: {type: Number, required: true},
    unitPrice: {type: Number, required: true},
    image: { type: Buffer, contentType: String}
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema);
export default Product;
