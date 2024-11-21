const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// POST: Thêm sản phẩm vào giỏ hàng
router.get("/", (req, res) => {
    res.send("ok");
});


// THêm sản phẩm vào wishlist, truyền userId, productId
router.post('/add', wishlistController.addToWishlist);

// DELETE: Xóa sản phẩm khỏi wishlist, , truyền userId, productId
router.delete('/remove', wishlistController.removeFromWishlist);

// Lấy wishlist, truyền userId
router.get('/:userId', wishlistController.getWishlist);

module.exports = router;

