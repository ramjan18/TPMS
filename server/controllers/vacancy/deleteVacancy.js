const Vacancy = require("../../models/vacancy");


const deleteVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);

    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    // Only the company that created it can delete
    if (vacancy.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await vacancy.deleteOne();
    res.status(200).json({ message: "Vacancy deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {deleteVacancy};