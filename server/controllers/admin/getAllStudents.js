const Student = require("../../models/student");

// Controller to get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password"); // exclude password field
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {getAllStudents};