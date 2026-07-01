const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },
    phone: { type: String, default: "" },
    disease: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
