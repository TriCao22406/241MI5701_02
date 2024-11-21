const Product = require('../models/Products');

// Lấy danh sách tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Lấy sản phẩm theo tên collection
exports.getProductsByCollection = async (req, res) => {
  let collectionName = req.params.collectionName.trim();  // Loại bỏ khoảng trắng dư thừa
  collectionName = decodeURIComponent(collectionName);  // Giải mã ký tự đặc biệt
  try {
    // Tìm kiếm không phân biệt chữ hoa chữ thường và khoảng trắng dư thừa
    const products = await Product.find({ productCollection: collectionName });
    if (products.length === 0) {
      return res.status(404).send('Không tìm thấy sản phẩm trong collection này');
    }
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Không tìm thấy sản phẩm');
    }
    res.json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};


// Lấy sản phẩm theo mã sản phẩm (productCode)
exports.getProductByCode = async (req, res) => {
  const productCode = req.params.code; // Lấy `productCode` từ URL
  try {
    const product = await Product.findOne({ productCode: productCode }); // Tìm theo `productCode`
    if (!product) {
      return res.status(404).send('Không tìm thấy sản phẩm');
    }
    res.json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};




// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  const {
    productName, productType, material, productNameEnglish, price, priceUSD,
    productDetails, productDetailsEnglish, description, productCollection, images,
    materialfilter, sizes, productCode, discount
  } = req.body;

  try {
    // Kiểm tra xem tất cả các trường bắt buộc có được cung cấp không
    if (!productName || !productType || !material || price === undefined ||
        !productDetails || !description || !productCode) {
      return res.status(400).json({ message: 'Một hoặc nhiều trường bắt buộc bị thiếu thông tin.' });
    }

    // Tạo một sản phẩm mới từ dữ liệu nhận được từ body của yêu cầu
    const newProduct = new Product({
      productName,
      productType,
      material,
      productNameEnglish: productNameEnglish || "",
      price,
      priceUSD: priceUSD || "",
      productDetails,
      productDetailsEnglish: productDetailsEnglish || "",
      description,
      productCollection: productCollection || "",
      images: images && images.length ? images : [],
      materialfilter: materialfilter || "",
      sizes: sizes && sizes.length ? sizes : [],
      productCode,
      discount: discount !== undefined ? discount : 0
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Cập nhật sản phẩm theo ID
exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const updatedData = req.body;

  try {
    // Tìm và cập nhật sản phẩm với dữ liệu mới
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).send('Không tìm thấy sản phẩm');
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Xóa sản phẩm theo ID
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    // Tìm và xóa sản phẩm theo ID
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).send('Không tìm thấy sản phẩm');
    }
    res.send('Xóa sản phẩm thành công');
  } catch (error) {
    res.status(500).send(error.message);
  }
};
