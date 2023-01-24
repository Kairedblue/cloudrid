const Otp = require("../models/otp.model");
const User = require("../../v1/models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendMail = require("../../v1/services/email.services");

exports.sendOtp = async (email) => {
  if (!email)
    return {
      code: 401,
      message: "Email is required",
    };
  const user = await User.findOne({
    email,
  });
  if (user)
    return {
      code: 409,
      message: "User already exists",
    };
  const num = crypto.randomInt(100000, 999999);
  const otp = num.toString().padStart("0", 6);
  const hash = bcrypt.hashSync(otp, bcrypt.genSaltSync(10));

  const newOtp = new Otp({
    email: email,
    otp: hash,
  });
  newOtp.save();
  const html = `
    <p>Hi ${email}!</p>
    <p>Here is your OTP for registration: ${otp}</p>
    <p>Thanks,</p>
    <p>Cloudrid Team</p>
    `;
  sendMail(email, "[Cloudrid] OTP for registration", html);
  return {
    code: 200,
    message: "OTP has been sent to your email",
  };
};
exports.verifyOtp = async (email, otp) => {
  if (!email)
    return {
      code: 401,
      message: "Email is required",
    };
  if (!otp)
    return {
      code: 401,
      message: "OTP is required",
    };
  const userOtp = await Otp.findOne({ email });
  if (!userOtp)
    return {
      code: 401,
      message: "OTP is invalid",
    };
  const isMatch = bcrypt.compareSync(otp, userOtp.otp);
  if (!isMatch)
    return {
      code: 401,
      message: "OTP is invalid",
    };
  return {
    code: 200,
    message: "OTP is valid",
  };
};
