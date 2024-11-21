const Order = require('../models/Orders');

// Lấy danh sách tất cả sản phẩm
exports.saveOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ orderId: savedOrder._id, ...savedOrder._doc });
  } catch (error) {
    console.error('Error saving order:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Failed to save order' });
  }
};




exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.UserId;

    // Ensure the user is only accessing their own data
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access', error: userId });
    }

    // Retrieve all orders for the user
    const orders = await Order.find({ userId: userId }).populate('orderDetail.productId');
    
    // If no orders found, return a 404 response
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    // Return the list of orders
    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a single order by ID with specific fields
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Retrieve the order by ID, selecting only the required fields
    const order = await Order.findById(orderId)
      .select('_id status orderDetail total timer.expectedDate') // Select only necessary fields
      .populate('orderDetail.productId', 'productName'); // Populate productId with only the productName field

    // If no order is found, return a 404 response
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Format the response
    const response = {
      orderId: order._id,
      status: order.status,
      orderDetail: order.orderDetail.map(detail => ({
        productName: detail.productId.productName,
        size: detail.size,
        quantity: detail.quantity,
      })),
      total: order.total,
      expectedDate: order.timer.expectedDate,
    };

    // Return the formatted order details
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};