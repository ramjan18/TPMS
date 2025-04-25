const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hrName: {
      type: String,
      required: true,
    },
    hrEmail: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["company"],
      default: "company",
    },
  },
  { timestamps: true }
);

const Company = mongoose.model('Company', companySchema)

module.exports = Company