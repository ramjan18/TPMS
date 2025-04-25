const Vacancy = require("../../models/vacancy");
const Student = require("../../models/student");


const applyForVacancy = async (req, res) => {
  try {
    // const studentId = req.user._id;
    const vacancyId = req.params.id;
    const {studentId} = req.body;

    const vacancy = await Vacancy.findById(vacancyId);
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if already applied
    const alreadyApplied = vacancy.appliedStudents.some(
      (app) => app.studentId.toString() === studentId.toString()
    );
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "Already applied to this vacancy" });
    }

    // Check eligibility
    if (
      vacancy.eligibilityCriteria?.cgpa &&
      student.cgpa < vacancy.eligibilityCriteria.cgpa
    ) {
      return res
        .status(403)
        .json({ message: "You do not meet the CGPA criteria" });
    }

    if (
      vacancy.eligibilityCriteria?.branchesAllowed?.length &&
      !vacancy.eligibilityCriteria.branchesAllowed.includes(student.branch)
    ) {
      return res
        .status(403)
        .json({ message: "Your branch is not eligible for this job" });
    }

    // Add student to vacancy
    vacancy.appliedStudents.push({ studentId });
    await vacancy.save();

    // Optional: also update student’s appliedCompanies
    student.appliedCompanies.push({ companyId: vacancy.companyId });
    await student.save();

    res.status(200).json({ message: "Successfully applied for the vacancy" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {applyForVacancy};