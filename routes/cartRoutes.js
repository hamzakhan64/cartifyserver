const express = require('express');
const router = express.Router();
const { getCart, addItem, updateItem, removeItem } = require('../controllers/cartController');
const verifyToken = require('../middleware/authMiddleware');

// All cart routes require authentication
router.use(verifyToken);

router.get('/', getCart);
router.post('/', addItem);
router.put('/:productId', updateItem);
router.delete('/:productId', removeItem);

module.exports = router;
