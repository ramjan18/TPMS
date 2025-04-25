const Student = require("../../models/student");

// Controller to get a student by ID
const getStudentById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const student = await Student.findById(id);
      console.log(student)
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getStudentById };
