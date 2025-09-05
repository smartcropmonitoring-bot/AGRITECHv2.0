// server.js
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import cors from "cors";
import Farmer from "./src/models/Farmer.js"; // Make sure this path is correct

// 🔹 Load .env explicitly
dotenv.config(); // loads .env
console.log("Mongo URI:", process.env.MONGO_URI);


// Debug: confirm Mongo URI is loaded
console.log("Mongo URI:", process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Connect to MongoDB
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is undefined. Check your .env file!");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

/* ------------------ USER SCHEMA ------------------ */
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

/* ------------------ USER APIs ------------------ */
// Register
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: "Username & password required" });

    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role: "user" });
    await newUser.save();
    res.status(201).json({ success: true, message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: "Username & password required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid password" });

    res.json({ success: true, message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------ FARMER APIs ------------------ */
// Helper: generate Farmer ID like F001
async function generateFarmerId() {
  const count = await Farmer.countDocuments();
  return "F" + String(count + 1).padStart(3, "0");
}

// Create farmer
app.post("/api/farmers", async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.farmerId) payload.farmerId = await generateFarmerId();

    const farmer = new Farmer(payload);
    await farmer.save();
    res.status(201).json({ success: true, message: "Farmer record saved!", farmer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Search farmers
app.get("/api/farmers/search", async (req, res) => {
  try {
    const { query, name, farmerId, province, municipality, barangay, crop, animal } = req.query;
    const q = {};

    if (query) q.$or = [
      { fullName: new RegExp(query, "i") },
      { farmerId: new RegExp(query, "i") }
    ];
    if (name) q.fullName = new RegExp(name, "i");
    if (farmerId) q.farmerId = new RegExp(farmerId, "i");
    if (province) q["location.province"] = province;
    if (municipality) q["location.municipality"] = municipality;
    if (barangay) q["location.barangay"] = barangay;
    if (crop) q["farming.crops.mainCrop"] = crop;
    if (animal) q[`animalHusbandry.${animal}`] = { $exists: true };

    const results = await Farmer.find(q).sort({ updatedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single farmer by Mongo _id
app.get("/api/farmers/:id", async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ success: false, message: "Farmer not found" });
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single farmer by human-friendly farmerId (F001)
app.get("/api/farmers/by-farmerId/:farmerId", async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ farmerId: req.params.farmerId });
    if (!farmer) return res.status(404).json({ success: false, message: "Farmer not found" });
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update farmer
app.put("/api/farmers/:id", async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!farmer) return res.status(404).json({ success: false, message: "Farmer not found" });
    res.json({ success: true, farmer });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

/* ------------------ DEFAULT ROUTE ------------------ */
app.get("/", (req, res) => {
  res.send("🌱 SmartCrop API Running...");
});

/* ------------------ START SERVER ------------------ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
