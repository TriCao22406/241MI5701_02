const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

// POST: Gửi OPT
router.post('/send-otp', otpController.sendOtpEmail);

router.post('/verify-otp', otpController.verifyOtp);

module.exports = router;