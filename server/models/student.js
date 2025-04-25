const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    year: {
      type: String, // current academic year
      required: true,
    },
    // 🎓 Academic History
    tenthYear: {
      type: String,
      required: true,
    },
    tenthMarks: {
      type: String,
      required: true,
    },
    twelfthYear: {
      type: String,
      required: true,
    },
    twelfthMarks: {
      type: String,
      required: true,
    },
    degreeYear: {
      type: String,
    },
    cgpa: {
      type: String,
    },

    // resume: {
    //   type: String, // file name of uploaded resume
    // },
    skills: [String],

    // 📩 Company Applications
    appliedCompanies: [
      {
        companyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
        },
        status: {
          type: String,
          enum: ["applied", "selected", "rejected"],
          default: "applied",
        },
      },
    ],
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student"],
      default: "student",
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
