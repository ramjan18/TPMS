const TPO = require("../../models/tpo"); // Adjust the path if needed

// Controller to get all TPOs
const getAllTPOs = async (req, res) => {
  try {
    const tpos = await TPO.find().select("-password"); // Exclude passwords
    res.status(200).json({ tpos });
  } catch (error) {
    console.error("Error fetching TPOs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {getAllTPOs};