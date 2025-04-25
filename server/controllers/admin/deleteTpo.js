const TPO = require("../../models/tpo");

// Controller to delete a TPO
const deleteTPO = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTPO = await TPO.findByIdAndDelete(id);

    if (!deletedTPO) {
      return res.status(404).json({ message: "TPO not found" });
    }

    res.status(200).json({
      message: "TPO deleted successfully",
      tpo: deletedTPO, // Optional: include deleted TPO data
    });
  } catch (error) {
    console.error("Error deleting TPO:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {deleteTPO};