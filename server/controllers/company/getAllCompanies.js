const Company = require("../../models/company");
const Student = require("../../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Environment secret
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// 📄 Get All Companies + Vacancies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {getCompanies};