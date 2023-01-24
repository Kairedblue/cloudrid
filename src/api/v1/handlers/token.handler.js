const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const tokenDecode = (req, key) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return false;

  const bearer = bearerHeader.split(" ")[1];

  try {
    const tokenDecoded = jwt.verify(bearer, key);
    return tokenDecoded;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return "TokenExpiredError";
    }
  }
};
exports.verifyAccessToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req, process.env.ACCESS_TOKEN_SECRET_KEY);
  if (!tokenDecoded) {
    return res.status(401).json("Unauthorized");
  }
  if (tokenDecoded === "TokenExpiredError") {
    return res.status(403).json({ message: "Token expired" });
  }
  const user = await User.findById(tokenDecoded.id);
  if (!user) {
    return res.status(401).json("Unauthorized");
  }
  req.user = user;
  next();
};
exports.verifyRefreshToken = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req, process.env.REFRESH_TOKEN_SECRET_KEY);
  if (!tokenDecoded) {
    return res.status(401).json("Unauthorized");
  }
  if (tokenDecoded === "TokenExpiredError") {
    return res.status(403).json({ message: "Token expired" });
  }
  const user = await User.findById(tokenDecoded.id);
  if (!user) {
    return res.status(401).json("Unauthorized");
  }
  req.user = user;
  next();
};
