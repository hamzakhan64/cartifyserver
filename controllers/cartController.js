const Cart = require('../models/Cart');

// getCart() — Fetch user's cart
exports.getCart = async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.user.id }).populate('productId');
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// addItem() — Add or increment item
exports.addItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let item = await Cart.findOne({ userId: req.user.id, productId });

        if (item) {
            item.quantity += (quantity || 1);
            await item.save();
        } else {
            item = new Cart({ userId: req.user.id, productId, quantity: quantity || 1 });
            await item.save();
        }
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// updateItem() — Update exact quantity
exports.updateItem = async (req, res) => {
    try {
        const item = await Cart.findOneAndUpdate(
            { userId: req.user.id, productId: req.params.productId },
            { quantity: req.body.quantity },
            { new: true }
        );
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// removeItem() — Remove item
exports.removeItem = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.user.id, productId: req.params.productId });
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
