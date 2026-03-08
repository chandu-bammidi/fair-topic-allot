const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 Protect Routes Middleware
exports.protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check if Authorization header exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //  Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //  Attach user to request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // move to next middleware or controller
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};


// 🔐 Role-Based Authorization Middleware
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${roles.join(", ")} can access this route.`,
      });
    }
    next();
  };
};

