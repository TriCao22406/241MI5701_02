const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/authenticateToken');

// POST: Thêm sản phẩm vào giỏ hàng
router.post('/add', cartController.addToCart);

// PUT: Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/updateQuantity', cartController.updateProductQuantity);

// PUT: Cập nhật size 
router.put('/updateSize', cartController.updateProductSize);

// DELETE: Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove', cartController.removeFromCart);

// DELETE: Remove the entire cart by userId
router.delete('/removeCart/:userId', authenticateToken, cartController.removeCart);


// Nếu bạn cần route GET
router.get('/:userId', cartController.getCart); // <-- Đảm bảo hàm getCart tồn tại trong cartController

module.exports = router;

