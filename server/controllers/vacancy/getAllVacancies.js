const Vacancy = require("../../models/vacancy");


const getAllVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.find()
      .populate("companyId", "name hrName hrEmail")
      .populate("appliedStudents.studentId");
    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {getAllVacancies};