// Middleware to authorize based on user role
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    // Assuming user info is attached to req.user by previous auth middleware
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data" });
    }

    // Check if user's role is included in the roles array
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    next(); // Role is authorized, continue to next middleware/handler
  };
};

module.exports = authorizeRole;
