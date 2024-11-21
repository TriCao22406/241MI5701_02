const Collection = require('../models/Collections');

// Lấy danh sách tất cả sản phẩm
exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (error) {
    res.status(500).send(error.message);
  }
};