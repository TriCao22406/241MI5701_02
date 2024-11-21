const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
  productName: { type: String, required: true },
  productType: { type: String, required: true },
  material: { type: String, required: true },
  productNameEnglish: { type: String, default: "" },
  price: { type: Number, required: true },
  priceUSD: { type: String, default: "" },
  productDetails: { type: String, required: true },
  productDetailsEnglish: { type: String, default: "" },
  description: { type: String, required: true },
  productCollection: { type: String, default: "" },
  images: { type: [String], default: [] },
  materialfilter: { type: String, default: "" },
  sizes: [
    {
      size: { type: String, default: "" },
      quantity: { type: Number, default: 0 }
    }
  ],
  productCode: { type: String, required: true, unique: true },
  discount: { type: Number, default: 0 }
}, { collection: 'products' });

module.exports = mongoose.model('Product', productSchema);

