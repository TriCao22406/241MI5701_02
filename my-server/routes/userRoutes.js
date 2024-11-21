const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');


// GET: Lấy danh sách user
router.get('/', userController.getAllUsers);

// DELETE: Xóa theo id 
router.delete('/delete/:id', userController.deleteUserById)

// POST: Đăng nhập người dùng
router.post('/login', userController.loginUser)

// POST: Thay đổi mật khẩu
router.post('/changepsw', userController.changePassword);

// PUT: Chỉnh sửa thông tin user 
router.put('/update/:id', userController.updateUser);

// POST: Tạo thêm user mới
router.post('/signup', userController.createUser);

// POST: Check email khi đăng ký 
router.post('/signup/check-email', userController.signUpCheckMail);

// POST: Check số điện thoại khi đăng ký 
router.post('/signup/check-phone', userController.signUpCheckPhone)

// GET: Lấy thông tin người dùng
router.get('/:id', authenticateToken ,userController.getUserInfo);



// router.get('/protected-route', authenticateToken, (req, res) => {
//     res.json({ message: 'This is a protected route.', user: req.user });
//   });
module.exports = router;
