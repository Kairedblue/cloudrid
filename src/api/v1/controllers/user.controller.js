const userServices = require("../services/user.services");
const Token = require("../models/token.model");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  const { code, message, token, errors } = await userServices.register(
    email,
    username,
    password
  );
  res.status(code).json({ message, token, errors });
};
exports.activate = async (req, res) => {
  const { token } = req.body;
  const decoded = await userServices.activate(token);
  res.status(decoded.code).json({ message: decoded.message });
};
exports.login = async (req, res) => {
  const { email, username, password } = req.body;
  const { code, message, user, accessToken, refreshToken, errors } =
    await userServices.login(email, username, password);
  res.status(code).json({ message, user, accessToken, refreshToken, errors });
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const { code, message, token } = await userServices.forgotPassword(email);
  res.status(code).json({ message, token });
};
exports.resetPassword = async (req, res) => {
  const { token, newPassword, confirmNewPassword } = req.body;
  const { code, message, errors } = await userServices.resetPassword(
    token,
    newPassword,
    confirmNewPassword
  );
  res.status(code).json({ message, errors });
};
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  const decoded = await userServices.refreshToken(refreshToken);
  res.status(decoded.code).json({
    message: decoded.message,
    accessToken: decoded.accessToken,
    errors: decoded.errors,
  });
};
