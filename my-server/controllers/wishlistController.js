const Wishlist = require('../models/Wishlist');
const Product = require('../models/Products');

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId là bắt buộc' });
  }

  if (!productId) {
    return res.status(400).json({ message: 'productId là bắt buộc' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    // Check if the wishlist already exists for the user
    let wishlist = await Wishlist.findOne({ userId });


    if (wishlist) {
      // Check if product already in wishlist
      const productIndex = wishlist.products.findIndex(p => p._id == productId);
      if (productIndex > -1) {
        return res.status(400).json({ message: 'Sản phẩm đã có trong danh sách yêu thích' });
      }
      wishlist.products.push(product);
    } else {
      // If no wishlist exists for the user, create a new one
      wishlist = new Wishlist({
        userId,
        products: [product]
      });
    }

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId là bắt buộc' });
  }

  if (!productId) {
    return res.status(400).json({ message: 'productId là bắt buộc' });
  }

  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Danh sách yêu thích không tồn tại' });
    }

    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter(p => p._id != productId);

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products in wishlist
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'userId là bắt buộc' });
  }

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate('products');

    if (!wishlist) {
      return res.status(404).json({ message: 'Danh sách yêu thích không tồn tại' });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
