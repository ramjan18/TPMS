const Company = require("../../models/company"); // Import the Company model

// Controller to update company details
const updateCompany = async (req, res) => {
  // const {  } = req.params; // Get company ID from params
  const {
    name,
    hrName,
    hrEmail,
    contactNumber,
    website,
    address,
    description,
    // password,
    _id
  } = req.body; // Destructure data from request body

  try {
    // Find company by ID and update it with the new data
    const company = await Company.findByIdAndUpdate(
      _id,
      {
        name,
        hrName,
        hrEmail,
        contactNumber,
        website,
        address,
        description,
      },
 
    );

    // If company not found
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Send response with the updated company details
    res.status(200).json({
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {updateCompany};