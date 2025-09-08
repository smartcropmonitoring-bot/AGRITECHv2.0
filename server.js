import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import cors from "cors";
import Farmer from "./src/models/Farmer.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Load .env
dotenv.config();
console.log("Mongo URI:", process.env.MONGODB_URI);

const app = express();
app.use(express.json());

// ✅ CORS setup
const allowedOrigins = [
  "https://agritechv2-0.onrender.com",
  "http://localhost:3000"
];
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🔎 CORS request from:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🔹 MongoDB
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is undefined. Check your .env file!");
  process.exit(1);
}
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ------------------ USER SCHEMA ------------------ */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

/* ------------------ USER APIs ------------------ */
// Register
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "Username & password required" });

    const exists = await User.findOne({ username });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: "user",
    });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login (✅ fixed to return user object)
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "Username & password required" });

    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });

    // ✅ Return role + username for frontend
    res.json({
      success: true,
      message: "Login successful",
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------ FARMER APIs ------------------ */
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
    res
      .status(201)
      .json({ success: true, message: "Farmer record saved!", farmer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Search farmers
app.get("/api/farmers/search", async (req, res) => {
  try {
    const {
      query,
      name,
      farmerId,
      province,
      municipality,
      barangay,
      crop,
      animal,
    } = req.query;
    const q = {};

    if (query)
      q.$or = [
        { fullName: new RegExp(query, "i") },
        { farmerId: new RegExp(query, "i") },
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

// 🔹 Seed default admin if not exists
async function seedAdmin() {
  try {
    const exists = await User.findOne({ username: "admin" });
    if (exists) {
      console.log("⚠️ Admin already exists, skipping seed.");
      return;
    }
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      username: "admin",
      password: hashedPassword,
      role: "admin"
    });
    await admin.save();
    console.log("✅ Default admin user created: admin / admin123");
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
  }
}

// Call after DB connect
mongoose.connection.once("open", () => {
  console.log("📦 MongoDB ready");
  seedAdmin();
});

// Get single farmer
app.get("/api/farmers/:id", async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer)
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get by farmerId
app.get("/api/farmers/by-farmerId/:farmerId", async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ farmerId: req.params.farmerId });
    if (!farmer)
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });
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
    if (!farmer)
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });
    res.json({ success: true, farmer });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

/* ------------------ STATIC FILES ------------------ */
// Serve all HTML/CSS/JS inside src/Screens
app.use(express.static(path.join(__dirname, "src", "Screens")));

// Default → LoginPage.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "Screens", "LoginPage.html"));
});

// ✅ Catch-all to serve static HTML (e.g., /forms/cattle.html)
app.get("*", (req, res) => {
  const filePath = path.join(__dirname, "src", "Screens", req.path);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send("Page not found");
  });
});

/* ------------------ START SERVER ------------------ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
