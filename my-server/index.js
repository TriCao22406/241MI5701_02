const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const port = 3000;

// Kích hoạt CORS để cho phép truy cập từ nhiều nguồn khác nhau
app.use(cors());
app.use(express.json());

// Kiểm tra API
app.get("/", (req, res) => {
    res.send("ok");
});

// Kết nối đến cơ sở dữ liệu MongoDB
db.connect();

// Import các routes đã chia tách
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const otpRoutes = require('./routes/otpRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');


// Sử dụng các routes tương ứng
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/collections', collectionRoutes);
app.use('/otp', otpRoutes);
app.use('/wishlists', wishlistRoutes);
app.use('/orders', orderRoutes);


// Bắt đầu server và lắng nghe ở cổng chỉ định
app.listen(port, () => {
    console.log(`Server đang lắng nghe tại cổng: ${port}`);
});
