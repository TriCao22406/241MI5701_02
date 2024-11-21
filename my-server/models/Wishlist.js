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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', CartSchema);
