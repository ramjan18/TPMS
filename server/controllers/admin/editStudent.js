const Student = require("../../models/student");

// Controller to update student details
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    rollNumber,
    email,
    phone,
    branch,
    year,
    tenthMarks,
    tenthYear,
    twelfthMarks,
    twelfthYear,
    cgpa,
    degreeYear,
    skills,
    password, // Optional, only update if provided
  } = req.body;

  const student = await Student.findById(id);

   const resumeUrl = req.files?.resume?.[0]?.path || student.resume;
   const profilePicUrl = req.files?.profilePic?.[0]?.path || student.profilePic;
  try {
    // Prepare update object
    const updateFields = {
      name,
      rollNumber,
      email,
      phone,
      branch,
      year,
      tenthMarks,
      tenthYear,
      twelfthMarks,
      twelfthYear,
      cgpa,
      degreeYear,
      skills,
      password,
      resume: resumeUrl,
      profilePic : profilePicUrl
    };

    if (password) {
      updateFields.password = password; // only update password if it's included
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {updateStudent};