const Cart = require('../models/Cart');
const Product = require('../models/Products');

exports.addToCart = async (req, res) => {
  const { userId, productId, size, quantity } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId là bắt buộc' });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    const selectedSize = product.sizes.find(s => s.size === size);
    if (!selectedSize || selectedSize.quantity < quantity) {
      return res.status(400).json({ message: 'Size hoặc số lượng không phù hợp' });
    }

    let cart = await Cart.findOne({ userId });

    if (cart) {
      const productIndex = cart.products.findIndex(
        p => p.productId == productId && p.size === size
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, size, quantity });
      }
    } else {
      cart = new Cart({
        userId,
        products: [{ productId, size, quantity }]
      });
    }

    selectedSize.quantity -= quantity;
    // await product.save();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    }

    // Tìm sản phẩm trong giỏ hàng dựa trên cartid (tức là _id của sản phẩm trong mảng products)
    const productIndex = cart.products.findIndex(p => p._id.toString() === itemId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    cart.products.splice(productIndex, 1);

    // Lưu giỏ hàng đã được cập nhật
    await cart.save();
    res.status(200).json({ message: 'Đã xóa sản phẩm thành công', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Update số lượng
exports.updateProductQuantity = async (req, res) => {
  const { userId, itemid, productId, quantity, size } = req.body;

  try {
    // Find user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    }

    // Find product in cart by cart ID
    const productIndex = cart.products.findIndex(p => p._id.toString() === itemid);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
    }

    // Find product in database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    // Validate size
    const selectedSize = product.sizes.find(s => s.size == size);
    if (!selectedSize) {
      return res.status(404).json({ 
        message: 'Size không tồn tại cho sản phẩm này', 
        availableSizes: product.sizes.map(s => s.size) 
      });
    }

    // Check if requested quantity exceeds available stock
    if (quantity > selectedSize.quantity) {
      return res.status(400).json({ 
        message: 'Số lượng yêu cầu vượt quá số lượng có sẵn trong kho', 
        currentQuantity: cart.products[productIndex].quantity 
      });
    }

    // Update cart product's quantity and size
    cart.products[productIndex].quantity = quantity;
    cart.products[productIndex].size = size;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Update size
exports.updateProductSize = async (req, res) => {
  const { userId, productId, oldSize, newSize } = req.body;

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    }

    // Tìm sản phẩm theo productId và oldSize
    const productIndex = cart.products.findIndex(p => p.productId == productId && p.size === oldSize);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
    }

    // Cập nhật kích cỡ của sản phẩm
    cart.products[productIndex].size = newSize;

    // Lưu giỏ hàng đã được cập nhật
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Try to find the cart for the given user
    let cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart) {
      // If no cart exists, create an empty one
      cart = new Cart({ userId, products: [] });
      await cart.save();
    }

    let cartUpdated = false;

    // Validate quantities in the cart
    for (const item of cart.products) {
      const product = item.productId;
      const selectedSize = product.sizes.find(s => s.size === item.size);

      if (selectedSize && item.quantity > selectedSize.quantity) {
        // Adjust quantity in the cart if it exceeds available stock
        item.quantity = selectedSize.quantity;
        cartUpdated = true;
      }
    }

    // Save updates if the cart was modified
    if (cartUpdated) {
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.removeCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find and delete the cart for the given user
    const cart = await Cart.findOneAndDelete({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    }

    res.status(200).json({ message: 'Giỏ hàng đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
