const TPO = require("../../models/tpo");

// Controller to get a TPO by ID
const getTPOById = async (req, res) => {
  const { id } = req.params;

  try {
    const tpo = await TPO.findById(id).select("-password"); // exclude password

    if (!tpo) {
      return res.status(404).json({ message: "TPO not found" });
    }

    res.status(200).json({ tpo });
  } catch (error) {
    console.error("Error fetching TPO by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {getTPOById};