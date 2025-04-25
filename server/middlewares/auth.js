const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const Student = require("../models/student");
const TPO = require("../models/tpo");
const Company = require("../models/company");
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "mysecrete"; // Replace with env var

// Middleware to verify token and identify user
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  // console.log(token);

  try {
    console.log(JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Determine the correct model based on role
    let user;
    switch (decoded.role) {
      case "admin":
        user = await Admin.findById(decoded.id).select("-password");
        break;
      case "student":
        user = await Student.findById(decoded.id).select("-password");
        break;
      case "tpo":
        user = await TPO.findById(decoded.id).select("-password");
        break;
      case "company":
        user = await Company.findById(decoded.id).select("-password");
        break;
      default:
        return res.status(403).json({ message: "Unauthorized: Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = verifyToken;
