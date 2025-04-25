const Vacancy = require("../../models/vacancy");

const getVacancyById = async (req, res) => {
  try {
    const { id } = req.params;

    const vacancy = await Vacancy.find(id)
      .populate("companyId", "name hrName hrEmail") // populate company details
      .populate("appliedStudents.studentId", "name email branch rollNumber"); // populate student details

    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }
    res.status(200).json(vacancy);
  } catch (error) {
    console.error("Error fetching vacancy by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getVacancyById };
