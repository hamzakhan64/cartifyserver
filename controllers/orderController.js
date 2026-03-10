const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// placeOrder() — Convert cart to order
exports.placeOrder = async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.user.id }).populate('productId');
        if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });

        const items = cartItems.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price
        }));

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = new Order({
            userId: req.user.id,
            items,
            total,
            shippingAddress: req.body.shippingAddress,
            payment: 'COD'
        });

        await order.save();
        await Cart.deleteMany({ userId: req.user.id }); // Clear cart after order

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// getUserOrders()
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }).populate('items.productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// getOrder()
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.productId').populate('userId', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .populate('items.productId', 'title');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('userId', 'name email');

        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: Get Dashboard Stats
exports.getAdminStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();

        const orders = await Order.find({ status: { $ne: 'cancelled' } });
        const revenue = orders.reduce((sum, order) => sum + order.total, 0);

        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            revenue
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
