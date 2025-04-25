const Company = require("../../models/company");
const Student = require("../../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Environment secret
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// ✅ Company Registration
const registerCompany = async (req, res) => {
  try {
    const { name, hrName, hrEmail, contactNumber, password } = req.body;

    const existing = await Company.findOne({ hrEmail });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);


    const company = new Company({
      name,
      hrName,
      hrEmail,
      contactNumber,
      password: hashedPassword,
    });

    await company.save();
    res.status(201).json({ message: "Company registered successfully" ,
      company
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {registerCompany};


