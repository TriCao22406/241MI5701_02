const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CartSchema = Schema({
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    products: [
    {
        productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
        },
        size: {
        type: String,
        required: true
        },
        quantity: {
        type: Number,
        required: true,
        default: 1
        }
    }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);