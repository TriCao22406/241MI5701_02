const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/authenticateToken');


// POST: Gửi OPT
router.post('/', orderController.saveOrder);

router.get('/:UserId', authenticateToken, orderController.getUserOrders);

router.get('/order/:orderId', orderController.getOrderById);



module.exports = router;