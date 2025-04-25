const Vacancy = require("../../models/vacancy");

// @desc    Get all vacancies posted by a specific company
// @route   GET /api/vacancies/company/:companyId
// @access  Private (Company only or Admin)
const getVacanciesByCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const vacancies = await Vacancy.find({ companyId: id })
      .populate("appliedStudents.studentId") // Corrected path
      .populate("companyId", "name hrName hrEmail") // Optional: company info
      .sort({ createdAt: -1 });

    res.status(200).json({ vacancies });
  } catch (error) {
    console.error("Error fetching vacancies by company:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getVacanciesByCompany };
