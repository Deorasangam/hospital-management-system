const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// GET all
router.get("/", async (req, res) => {
  try {
    res.json(await Patient.find().sort({ createdAt: -1 }));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST create
router.post("/", async (req, res) => {
  try {
    const { name, age, gender, phone, disease, address } = req.body;
    if (!name || !age || !disease)
      return res
        .status(400)
        .json({ message: "Name, age and condition required." });
    const p = await Patient.create({
      name,
      age,
      gender,
      phone,
      disease,
      address,
    });
    res.status(201).json(p);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PUT update
router.put("/:id", async (req, res) => {
  try {
    const p = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!p) return res.status(404).json({ message: "Patient not found" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
