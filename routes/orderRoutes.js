const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders, getOrder, getAllOrders, updateOrderStatus, getAdminStats } = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// All order routes require authentication
router.use(verifyToken);

// User & Admin routes
router.post('/', placeOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);

// Admin-only routes
router.get('/admin/all', requireAdmin, getAllOrders);
router.get('/admin/stats', requireAdmin, getAdminStats);
router.put('/admin/:id/status', requireAdmin, updateOrderStatus);

module.exports = router;
