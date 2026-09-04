const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
const authMiddleware = require("./middleware/authMiddleware");

// ─── Silence Chrome DevTools 404 probe ───────────────────────────────────────
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.json({});
});

// ─── Serve index.html (works whether it's in /frontend or same folder) ────────
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(express.static(path.join(__dirname, ".."))); // fallback

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/patients", require("./routes/patients"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/billing", require("./routes/billing"));
app.use("/api/home", require("./routes/home"));
app.use("/api/about", require("./routes/about"));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? "healthy" : "database_disconnected",
    dbState: mongoose.connection.readyState,
    timestamp: new Date().toISOString(),
  });
});

// ─── Catch-all: serve index.html for any unknown route ───────────────────────
app.get("*", (req, res) => {
  // Try frontend/index.html first, then root index.html
  const frontendPath = path.join(__dirname, "..", "frontend", "home.html");
  const rootPath = path.join(__dirname, "..", "home.html");
  const fs = require("fs");
  if (fs.existsSync(frontendPath)) {
    res.sendFile(frontendPath);
  } else if (fs.existsSync(rootPath)) {
    res.sendFile(rootPath);
  } else {
    res
      .status(404)
      .send(
        "index.html not found. Please place it in the same folder as server.js or inside a /frontend subfolder."
      );
  }
});

// ─── MongoDB + Server Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://sangamdeora622:wanted@cluster0.gqqhk.mongodb.net/hospital";

// Start server first so Render detects the open port immediately
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Check if trying to connect to localhost in production
if (process.env.NODE_ENV === "production" && MONGO_URI.includes("localhost")) {
  console.warn("⚠️ Warning: MONGO_URI is pointing to localhost in production! Please set MONGO_URI in your Render environment variables.");
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected successfully");
    await seedInitialData();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    if (MONGO_URI.includes("localhost") || MONGO_URI.includes("127.0.0.1")) {
      console.error(
        "💡 Hint: On Render/cloud host, you must provide a cloud MongoDB connection string (e.g., MongoDB Atlas) in your environment variables as MONGO_URI."
      );
    }
  });

// ─── Initial Data Seeder ──────────────────────────────────────────────────────
async function seedInitialData() {
  try {
    const Patient = require("./models/Patient");
    const Doctor = require("./models/Doctor");
    const Appointment = require("./models/Appointment");
    const Bill = require("./models/Bill");
    const User = require("./models/User");

    const patientCount = await Patient.countDocuments();
    if (patientCount === 0) {
      console.log("🌱 Seeding initial hospital data...");
      await Patient.create([
        { name: "John Doe", age: 35, gender: "Male", phone: "555-0101", disease: "Hypertension", address: "123 Main St" },
        { name: "Jane Smith", age: 28, gender: "Female", phone: "555-0102", disease: "Asthma", address: "456 Oak Ave" },
        { name: "Robert Taylor", age: 52, gender: "Male", phone: "555-0103", disease: "Type 2 Diabetes", address: "789 Pine Rd" },
        { name: "Sarah Williams", age: 41, gender: "Female", phone: "555-0104", disease: "Migraine", address: "321 Elm St" },
        { name: "Michael Brown", age: 64, gender: "Male", phone: "555-0105", disease: "Cardiac Arrhythmia", address: "654 Maple Dr" }
      ]);
    }

    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      await Doctor.create([
        { name: "Dr. Alexander Wright", spec: "Cardiology", phone: "555-1001", email: "wright@hospital.com", status: "Available" },
        { name: "Dr. Emily Watson", spec: "Pediatrics", phone: "555-1002", email: "watson@hospital.com", status: "Available" },
        { name: "Dr. Marcus Vance", spec: "Neurology", phone: "555-1003", email: "vance@hospital.com", status: "Available" },
        { name: "Dr. Sarah Jenkins", spec: "Orthopedics", phone: "555-1004", email: "jenkins@hospital.com", status: "Available" },
        { name: "Dr. Robert Chen", spec: "General Medicine", phone: "555-1005", email: "chen@hospital.com", status: "Available" }
      ]);
    }

    const apptCount = await Appointment.countDocuments();
    if (apptCount === 0) {
      await Appointment.create([
        { pName: "John Doe", dName: "Dr. Alexander Wright", date: new Date().toISOString(), status: "Completed", payment: "Paid", notes: "Routine checkup" },
        { pName: "Jane Smith", dName: "Dr. Emily Watson", date: new Date(Date.now() + 86400000).toISOString(), status: "Pending", payment: "Unpaid", notes: "Follow-up visit" },
        { pName: "Robert Taylor", dName: "Dr. Robert Chen", date: new Date(Date.now() + 172800000).toISOString(), status: "Pending", payment: "Paid", notes: "Blood sugar test" }
      ]);
    }

    const billCount = await Bill.countDocuments();
    if (billCount === 0) {
      await Bill.create([
        { patientName: "John Doe", doctorName: "Dr. Alexander Wright", service: "Consultation", fee: 150, date: new Date().toISOString().split("T")[0], status: "Paid", notes: "Full checkup" },
        { patientName: "Jane Smith", doctorName: "Dr. Emily Watson", service: "Lab Test", fee: 220, date: new Date().toISOString().split("T")[0], status: "Unpaid", notes: "Blood panel" },
        { patientName: "Robert Taylor", doctorName: "Dr. Robert Chen", service: "Follow-up Visit", fee: 90, date: new Date().toISOString().split("T")[0], status: "Paid", notes: "Medication review" }
      ]);
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        { name: "System Administrator", email: "admin@hospital.com", password: "mediflow123", role: "admin" },
        { name: "Dr. Alexander Wright", email: "doctor@hospital.com", password: "mediflow123", role: "doctor" },
        { name: "Front Desk Staff", email: "frontdesk@hospital.com", password: "mediflow123", role: "front_desk" }
      ]);
    }
  } catch (seedErr) {
    console.warn("Notice: Data seed check skipped:", seedErr.message);
  }
}

