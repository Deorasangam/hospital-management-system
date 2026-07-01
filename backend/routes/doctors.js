const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

router.get("/", async (req, res) => {
  try {
    res.json(await Doctor.find().sort({ createdAt: -1 }));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, spec, phone, email, status } = req.body;
    if (!name || !spec)
      return res.status(400).json({ message: "Name and specialty required." });
    const d = await Doctor.create({
      name,
      spec,
      phone,
      email,
      status: status || "Available",
    });
    res.status(201).json(d);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const d = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!d) return res.status(404).json({ message: "Doctor not found" });
    res.json(d);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
