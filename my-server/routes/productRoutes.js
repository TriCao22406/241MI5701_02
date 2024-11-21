const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET: Lấy tất cả các products
router.get('/', productController.getAllProducts);

// GET: Lấy sản phẩm theo collection
router.get('/collection/:collectionName', productController.getProductsByCollection);

// GET: Lấy sản phẩm theo ID
router.get('/:id', productController.getProductById);

// GET: Lấy sản phẩm theo mã Code
router.get('/code/:code', productController.getProductByCode);

// POST: Thêm sản phẩm mới
router.post('/', productController.createProduct);

// PUT: Sửa sản phẩm theo ID
router.put('/:id', productController.updateProduct);

// DELETE: Xóa sản phẩm theo ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
