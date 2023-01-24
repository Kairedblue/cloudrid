const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const sendMail = require("../services/email.services");

exports.register = async (email, username, password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (user) {
    return {
      code: 409,
      errors: [
        {
          param: "email",
          message: "User already exists",
        },
      ],
    };
  }
  const token = jwt.sign(
    { username, email, password: hash },
    process.env.REGISTER_SECRET_KEY,
    { expiresIn: "24h" }
  );
  return {
    code: 200,
    message: "User register successfully",
    token,
  };
};
exports.activate = async (token) => {
  if (!token) {
    return {
      code: 401,
      message: "Token is required",
    };
  }
  const decoded = jwt.verify(
    token,
    process.env.REGISTER_SECRET_KEY,
    async (err, decoded) => {
      if (err)
        return {
          code: 401,
          message: "Invalid token",
        };
      const { username, email, password } = decoded;
      await User.create({ username, email, password });
      return {
        code: 201,
        message: "User created successfully",
      };
    }
  );
  return decoded;
};
exports.login = async (email, username, password) => {
  const user = await User.findOne({ username, email }).select("+password");
  if (!user) {
    return {
      code: 401,
      errors: [
        {
          param: "username",
          message: "Invalid username or password",
        },
      ],
    };
  }
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return {
      code: 401,
      errors: [
        {
          param: "password",
          message: "Invalid username or password",
        },
      ],
    };
  }
  user.password = undefined;
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "2h",
    }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  await Token.create({ email: email, refreshToken: refreshToken });
  return {
    code: 200,
    message: "User login successfully",
    user,
    accessToken,
    refreshToken,
  };
};
exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return {
      code: 401,
      errors: [
        {
          param: "email",
          message: "User does not exists",
        },
      ],
    };
  }
  const token = jwt.sign(
    { id: user._id, password: user.password },
    process.env.FORGOT_PASSWORD_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  const html = `
  <p>Hi, ${email}!</p>
  <p>Click the link below to reset your password</p>
  <p><a href="${process.env.CLIENT_URL}/reset-password/${token}">Reset Password</a></p>
  `;
  sendMail(email, "[Cloudrid] Reset Password", html);
  return {
    code: 200,
    message: "Reset password link sent to your email",
    token,
  };
};
exports.resetPassword = async (token, newPassword, confirmNewPassword) => {
  if (!token) {
    return {
      code: 401,
      message: "Token is required",
    };
  }
  if (newPassword !== confirmNewPassword) {
    return {
      code: 401,
      errors: [
        {
          param: "confirmNewPassword",
          message: "Confirm new password does not match with new password",
        },
      ],
    };
  }
  const decoded = jwt.verify(token, process.env.FORGOT_PASSWORD_SECRET_KEY);
  const hash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
  await User.findByIdAndUpdate(decoded.id, { password: hash });
  return {
    code: 200,
    message: "Password reset successfully",
  };
};
exports.refreshToken = async (refreshToken) => {
  const refreshTokenData = await Token.find({ refreshToken });
  if (!refreshTokenData) {
    return {
      code: 401,
      message: "Invalid refresh token",
    };
  }
  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "5m",
    },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
      if (decoded) {
        const { id, username } = decoded;
        const accessToken = jwt.sign(
          { id, username },
          process.env.ACCESS_TOKEN_SECRET_KEY,
          {
            expiresIn: "30s",
          }
        );
        Token.deleteMany({ refreshToken });
        return {
          code: 200,
          message: "Generate new accessToken successfully",
          accessToken,
        };
      }
    }
  );
  return decoded;
  d;
};
