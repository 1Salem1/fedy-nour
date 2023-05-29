const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const { id, role } = jwt.verify(token, "fedyNour123");
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ status: false, message: "Access denied" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: "Access denied" });
  }
};

exports.adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ status: false, message: "Admin access required" });
  }

  next();
};
