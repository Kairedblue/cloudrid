const router = require("express").Router();
const { body } = require("express-validator");

const userController = require("../../api/v2/controllers/user.controller");
const otpController = require("../../api/v2/controllers/otp.controller");
const { validate } = require("../../api/v1/middlewares/user.validate");
router.post(
  "/register",
  body("email").isEmail().withMessage("Email must be valid"),
  body("username")
    .isLength({ min: 8 })
    .withMessage("Username must be at least 8 characters"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("otp")
    .isLength({ min: 6 })
    .withMessage("OTP must be at least 6 characters"),
  validate,

  userController.register
);
router.post(
  "/send-otp",
  body("email").isEmail().withMessage("Email must be valid"),
  validate,
  otpController.sendOtp
);

module.exports = router;
