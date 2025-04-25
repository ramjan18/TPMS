const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    salaryPackage: {
      type: String,
     
    },
    location: {
      type: String,
      required: true,
    },
    lastDateToApply: {
      type: Date,
      required: true,
    },
    eligibilityCriteria: {
      cgpa: {
        type: Number,
      },
      branchesAllowed: [String],
    },
    appliedStudents: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        status: {
          type: String,
          enum: ["applied", "selected", "rejected"],
          default: "applied",
        },
      },
    ],
  },
  { timestamps: true }
);

const Vacancy = mongoose.model("Vacancy", vacancySchema);

module.exports = Vacancy;
