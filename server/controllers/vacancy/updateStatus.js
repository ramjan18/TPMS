const Vacancy = require("../../models/vacancy");
const Student = require("../../models/student");

const updateStudentStatusInVacancy = async (req, res) => {
  try {
    const { vacancyId, studentId, status } = req.body;

    // 1. Find the Vacancy
    const vacancy = await Vacancy.findById(vacancyId);
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    // 2. Find student application inside the vacancy
    const studentApplication = vacancy.appliedStudents.find(
      (entry) => entry.studentId.toString() === studentId
    );

    if (!studentApplication) {
      return res.status(404).json({
        message: "Student has not applied to this vacancy",
      });
    }

    // Update status
    studentApplication.status = status;
    await vacancy.save();

    // 3. Update in the Student model
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const companyApplication = student.appliedCompanies.find(
      (entry) => entry.companyId.toString() === vacancy.companyId.toString()
    );

    if (companyApplication) {
      companyApplication.status = status;
      await student.save();
    } else {
      console.warn(
        "No matching entry found in student's appliedCompanies for this company"
      );
    }

    res
      .status(200)
      .json({ message: "Student application status updated successfully" });
  } catch (error) {
    console.error("Error updating student status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { updateStudentStatusInVacancy };
