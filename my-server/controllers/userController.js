const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret key để mã hóa token (thay đổi giá trị này cho ứng dụng của bạn)
const JWT_SECRET = 'super_secret_key_pacifist'; // Use your actual secret key


// Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo người dùng mới
exports.createUser = async (req, res) => {
  try {
    const { email, phone, name, dob, password, confirmPassword, termsAccepted } = req.body;

    // Kiểm tra xem người dùng đã chấp nhận điều khoản chưa
    if (!termsAccepted) {
      return res.status(400).json({ message: 'Bạn phải đồng ý với các điều khoản và điều kiện.' });
    }

    // Kiểm tra email và số điện thoại đã tồn tại hay chưa
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email hoặc số điện thoại đã được đăng ký.' });
    }

    // Kiểm tra mật khẩu và xác thực mật khẩu có trùng khớp không
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Xác thực mật khẩu không trùng khớp' });
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return res.status(400).json({ message: 'Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm cả chữ cái và số.' });
    }

    // Tạo người dùng mới
    const newUser = new User({
      email,
      phone,
      name,
      dob,
      password: password,
      termsAccepted,
    });

    // Lưu vào cơ sở dữ liệu
    await newUser.save();
    res.status(201).json({ message: 'Đăng ký thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server, vui lòng thử lại sau.' });
  }
};

// Chỉnh sửa thông tin user 
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id; 
    const { phone, name, dob, address } = req.body; // Lấy thông tin cần cập nhật từ body request

    // Khởi tạo một đối tượng để lưu các thay đổi
    const updateFields = {};

    // Kiểm tra từng trường và chỉ thêm vào đối tượng updateFields nếu nó tồn tại
    if (phone) {
        // Kiểm tra xem số điện thoại có trùng với người dùng khác không
        const existingUser = await User.findOne({ phone, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ message: 'Số điện thoại đã được sử dụng bởi người dùng khác.' });
        }
        updateFields.phone = phone;
    }
    if (name) {
        updateFields.name = name;
    }
    if (dob) {
        updateFields.dob = dob;
    }
    if (address) {
        updateFields.address = address;
    }

    // Chỉ cập nhật updatedAt nếu có thay đổi
    if (Object.keys(updateFields).length > 0) {
        updateFields.updatedAt = Date.now();
    }

    // Cập nhật thông tin người dùng
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateFields, // Chỉ cập nhật các trường có trong updateFields
        { new: true } // Trả về document đã cập nhật
    );

    if (!updatedUser) {
        return res.status(404).json({ message: 'Người dùng không tồn tại!' });
    }

    // Trả về thông tin người dùng sau khi cập nhật
    res.status(200).json({
        message: 'Cập nhật thông tin người dùng thành công!',
        user: updatedUser
    });
} catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ!', error: error.message });
}
};



// Check email khi đăng ký tài khoản 
exports.signUpCheckMail = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được đăng ký' });
    }
    res.status(200).json({ message: 'Email hợp lệ' });
  } catch (error) {
    res.status(500).json({ message: 'Server error'});
  }

}

// Check phone khi đăng ký tài khoản 
exports.signUpCheckPhone = async (req, res) => {
  const { phone } = req.body;
  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Số điện thoại đã được đăng ký' });
    }
    res.status(200).json({ message: 'Số điện thoại hợp lệ' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}



// Đăng nhập người dùng
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' } // Token sẽ hết hạn sau 1 giờ
    );

    // Trả về token và userId cho phía client
    res.status(200).json({
      message: 'Đăng nhập thành công',
      token: token,
      userId: user._id // Thêm userId vào response
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng nhập', error });
  }
};

// Cập nhật mật khẩu
exports.changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Tìm người dùng từ token
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại'});

    // Kiểm tra mật khẩu hiện tại
    // const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (user.password !== currentPassword) {
      return res.status(409).json({ message: 'Mật khẩu hiện tại không chính xác', status: 409 });
    }
    // Mã hóa mật khẩu mới và cập nhật
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;
    await user.save({validateModifiedOnly: true});

    res.status(200).json({ message: 'Cập nhật mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật mật khẩu', error });
  }
};



  // Lấy thông tin người dùng bằng userId
  exports.getUserInfo = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Đảm bảo rằng chỉ có người dùng đang đăng nhập mới có thể lấy thông tin của họ
      if (req.user.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized access', error: userId });
      }
  
      const user = await User.findById(userId, '-password');
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error });
    }
  };
  
  

exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id; // Lấy ID từ params
    const deletedUser = await User.findOneAndDelete({ _id: userId }); // Tìm và xóa user dựa trên _id

    if (!deletedUser) {
        return res.status(404).json({ message: 'Người dùng không tồn tại!' });
    }

    res.status(200).json({
        message: 'Xóa người dùng thành công!',
        user: {
            id: deletedUser._id,
            name: deletedUser.name,
            email: deletedUser.email,
            phone: deletedUser.phone,
            dob: deletedUser.dob,
        }
    });
} catch (error) {
    res.status(500).json({ message: 'Lỗi request ', error: error.message });
}
};



