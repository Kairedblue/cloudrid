const otpSevices = require("../services/otp.services");

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const { code, message, otp } = await otpSevices.sendOtp(email);
  res.status(code).json({ message, otp });
};
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const { code, message } = await otpSevices.verifyOtp(email, otp);
  res.status(code).json({ message });
};
