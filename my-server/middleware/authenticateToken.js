const jwt = require('jsonwebtoken');
const JWT_SECRET = 'super_secret_key_pacifist';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Giải mã token
    req.user = decoded; // Gán thông tin người dùng vào request
    next(); // Tiếp tục xử lý route tiếp theo
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken; // Đảm bảo xuất khẩu đúng
