const userServices = require("../services/user.services");

exports.register = async (req, res) => {
  const { username, email, password, otp } = req.body;
  const { code, errors, message } = await userServices.register(
    username,
    email,
    password,
    otp
  );
  res.status(code).json({ errors, message });
};
