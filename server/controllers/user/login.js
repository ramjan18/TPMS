const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../../models/student");
const Company = require("../../models/company");
const TPO = require("../../models/tpo"); // Training & Placement Officer
const Admin = require("../../models/adminModel"); // Optional if separate

const JWT_SECRET = process.env.JWT_SECRET || "mysecrete";

const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    switch (role) {
      case "student":
        user = await Student.findOne({ email });
        break;
      case "company":
        user = await Company.findOne({ hrEmail: email });
        break;
      case "tpo":
        user = await TPO.findOne({ email });
        break;
      case "admin":
        user = await Admin.findOne({ email });
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role,user }, JWT_SECRET, {
      expiresIn: "1d",
    });
    
    req.user = user;

   return res.json({
      token,
      user: {
        id: user._id,
        name: user.name || user.hrName,
        email,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {loginUser};