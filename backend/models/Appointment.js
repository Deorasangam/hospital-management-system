const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    pName: { type: String, required: true },
    dName: { type: String, required: true },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    payment: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
