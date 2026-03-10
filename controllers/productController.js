
const Product = require('../models/Product');

// getAll() — Fetch all products
exports.getAll = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// getOne() — Fetch single product
exports.getOne = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// create() — Admin only
exports.create = async (req, res) => {
    try {
        const productData = { ...req.body };

        // If an image was uploaded via Multer/Cloudinary
        if (req.file) {
            productData.image = req.file.path;
        }

        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// update() — Admin only
exports.update = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// delete() — Admin only
exports.delete = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
