const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

router.get("/", async (req, res) => {
  try {
    res.json(await Appointment.find().sort({ createdAt: -1 }));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { pName, dName, date, status, payment, notes } = req.body;
    if (!pName || !dName || !date)
      return res
        .status(400)
        .json({ message: "Patient, doctor and date required." });
    const a = await Appointment.create({
      pName,
      dName,
      date,
      status: status || "Pending",
      payment: payment || "Unpaid",
      notes,
    });
    res.status(201).json(a);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const a = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!a) return res.status(404).json({ message: "Appointment not found" });
    res.json(a);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
