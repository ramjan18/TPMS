const Vacancy = require("../../models/vacancy");

// @desc    Create a new job vacancy
// @route   POST /api/vacancies
// @access  Private (Company only)
const createVacancy = async (req, res) => {
  try {
    // Get company ID from the authenticated user (set by middleware)
    const { studentId } = req.body;

    if (!studentId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Company ID missing" });
    }

    // Destructure the fields from request body
    const {
      jobTitle,
      jobDescription,
      salaryPackage,
      location,
      lastDateToApply,
      eligibilityCriteria,
    } = req.body;

    // Create vacancy
    const vacancy = await Vacancy.create({
      companyId : studentId,
      jobTitle,
      jobDescription,
      salaryPackage,
      location,
      lastDateToApply,
      eligibilityCriteria,
    });

    res.status(201).json({
      message: "Vacancy created successfully",
      vacancy,
    });
  } catch (error) {
    console.error("Error creating vacancy:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createVacancy };
