const TPO = require("../../models/tpo");

// Controller to update a TPO
const updateTPO = async (req, res) => {
  const { id } = req.params;
  const { name, employeeId, email, phone, department, password } = req.body;

  try {
    const updateFields = {
      name,
      employeeId,
      email,
      phone,
      department,
    };

    if (password) {
      updateFields.password = password; // Optionally update password (hashing should be done if added)
    }

    const updatedTPO = await TPO.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password"); // Exclude password in response

    if (!updatedTPO) {
      return res.status(404).json({ message: "TPO not found" });
    }

    res.status(200).json({
      message: "TPO updated successfully",
      tpo: updatedTPO,
    });
  } catch (error) {
    console.error("Error updating TPO:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {updateTPO};