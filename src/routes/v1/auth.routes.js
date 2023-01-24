const router = require("express").Router();
const { body } = require("express-validator");

const userController = require("../../api/v1/controllers/user.controller");
const tokenHandler = require("../../api/v1/handlers/token.handler");
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
  validate,
  userController.register
);
router.post("/activate", validate, userController.activate);
router.post(
  "/login",
  body("email").isEmail().withMessage("Email must be valid"),
  body("username")
    .isLength({ min: 8 })
    .withMessage("Username must be at least 8 characters"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  validate,
  userController.login
);
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Email must be valid"),
  validate,
  userController.forgotPassword
);
router.post(
  "/reset-password",
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
  body("confirmNewPassword")
    .isLength({ min: 8 })
    .withMessage("Confirm new password must be at least 8 characters"),
  validate,
  userController.resetPassword
);
router.post("/refresh-token", userController.refreshToken);
router.post(
  "/verify-access-token",
  tokenHandler.verifyAccessToken,
  (req, res) => {
    res.status(200).json({ message: "Token is valid" });
  }
);

module.exports = router;
