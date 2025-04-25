const TPO = require("../models/TPO");

// Helper: Parse MongoDB duplicate key error
const parseMongoError = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return `${field} already exists`;
  }
  return error.message;
};

// Create a new TPO
exports.addTPO = async (req, res) => {
  try {
    const { name, employeeId, email, phone, password } = req.body;

    // Basic validation
    if (!name || !employeeId || !email || !phone || !password) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    const newTPO = new TPO(req.body);
    await newTPO.save();

    res.status(201).json({ message: "TPO created successfully", tpo: newTPO });
  } catch (error) {
    res.status(400).json({ error: parseMongoError(error) });
  }
};

// Get all TPOs
exports.getTPOs = async (req, res) => {
  try {
    const tpos = await TPO.find().sort({ createdAt: -1 }); // optional: sort by newest
    res.status(200).json(tpos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch TPOs" });
  }
};

// Update an existing TPO by ID
exports.updateTPO = async (req, res) => {
  try {
    const updatedTPO = await TPO.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTPO) {
      return res.status(404).json({ error: "TPO not found" });
    }

    res
      .status(200)
      .json({ message: "TPO updated successfully", tpo: updatedTPO });
  } catch (error) {
    res.status(400).json({ error: parseMongoError(error) });
  }
};
