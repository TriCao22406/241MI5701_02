const nodemailer = require('nodemailer');
let otpStore = {}; // Bộ nhớ tạm để lưu OTP và email

// Hàm để tạo mã OTP ngẫu nhiên
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // Mã OTP 6 chữ số
}

// Gửi OTP tới email
exports.sendOtpEmail = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  // Cấu hình transporter của Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'tuhaphuc04@gmail.com', 
      pass: 'eonu pgio avpp yavb'         
    }
  });

  const mailOptions = {
    from: 'tuhaphuc04@gmail.com',
    to: email,
    subject: 'Mã OTP xác thực đăng ký tài khoản Pacifist',
    text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`
  };

  try {
    await transporter.sendMail(mailOptions);
    // Lưu OTP tạm thời trong bộ nhớ với thời gian hết hạn 5 phút
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
    res.status(200).send({ message: 'OTP đã được gửi thành công!' });
  } catch (error) {
    res.status(500).send({ message: 'Gửi OTP thất bại', error });
  }
};

exports.verifyOtp = (req, res) => {
    const { email, otp } = req.body;
  
    // Kiểm tra xem mã OTP có hợp lệ không
    const storedOtpData = otpStore[email];
  
    if (storedOtpData) {
      // Chuyển đổi otp từ client thành số
      const parsedOtp = parseInt(otp, 10);
  
      // Kiểm tra xem mã OTP có trùng khớp và có hết hạn không
      if (storedOtpData.otp === parsedOtp && storedOtpData.expiresAt > Date.now()) {
        // OTP hợp lệ
        delete otpStore[email]; // Xóa OTP sau khi xác nhận thành công
        res.status(200).send({ success: true, message: "OTP hợp lệ" });
      } else {
        res.status(400).send({ success: false, message: "OTP không đúng hoặc đã hết hạn" });
      }
    } else {
      res.status(400).send({ success: false, message: "OTP không đúng hoặc đã hết hạn" });
    }
  };
