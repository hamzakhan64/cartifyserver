const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, delete: deleteProduct } = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getAll);
router.get('/:id', getOne);

// Admin protected routes
router.post('/', verifyToken, requireAdmin, upload.single('image'), create);
router.put('/:id', verifyToken, requireAdmin, upload.single('image'), update);
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);

module.exports = router;
