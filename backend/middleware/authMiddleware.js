const jwt = require("jsonwebtoken");
const user = require("../models/user");

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1]; // Expect Bearer <token>

  if (!token)
    return res.status(401).json({ message: "Not authorized, token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect ;
