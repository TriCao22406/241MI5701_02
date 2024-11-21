const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Order schema
const OrderSchema = new Schema(
  {
    // Reference to the user who placed the order
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Links to the User model
      ref: 'User'    },
    // Customer information
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    // Array of order details (products in the order)
    orderDetail: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId, // Links to the Product model
          ref: 'Product',
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    // Order status
    status: {
      type: String,
      enum: ['Chờ xác nhận', 'Đang chuẩn bị hàng', 'Đang giao hàng', 'Giao hàng thành công', 'Đã hoàn thành', 'Giao hàng không thành công', 'Đang hoàn về', 'Đã hoàn hàng về','Đã huỷ'],
      default: 'Chờ xác nhận',
    },
    // Total amount for the order
    total: {
      type: Number,
      required: true,
    },
    // Payment method used for the order
    paymentMethod: {
      type: String,
      required: true,
    },
    // Optional fields
    notes: { type: String },
    promotionConsent: { type: Boolean, default: false },
    companyInvoice: { type: Boolean, default: false },
    policyAgreed: { type: Boolean, required: true },
    // Timestamps and delivery expectations
    timer: {
      orderTime: { type: Date, required: true },
      Timestamp1: { type: Date }, // e.g., 30 minutes after orderTime
      Timestamp2: { type: Date }, // e.g., 4 hours after orderTime
      Timestamp3: { type: Date }, // e.g., 2 days after orderTime
      Timestamp4: { type: Date }, // e.g., completion date (optional)
      expectedDate: { type: Date }, // e.g., 2.5 days after orderTime
    },
  },
  { timestamps: true },
  { collection: 'orders' } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model('Order', OrderSchema);
