const User = require("../../../api/v1/models/user.model");
const otpServices = require("./otp.services");
const bcrypt = require("bcrypt");

exports.register = async (username, email, password, otp) => {
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const user = await User.findOne({ email }).select("+username");
  if (user) {
    return {
      code: 409,
      errors: [
        {
          param: "email",
          message: "Email already exists",
        },
      ],
    };
  }
  await otpServices.verifyOtp(email, otp);
  await User.create({ username, email, password: hash });
  return {
    code: 201,
    message: "User created successfully",
  };
};
