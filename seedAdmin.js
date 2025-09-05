import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const username = "admin";
    const plainPassword = "admin123"; // Change later to stronger password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existingAdmin = await User.findOne({ username });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
    } else {
      const admin = new User({
        username,
        password: hashedPassword,
        role: "admin",
      });
      await admin.save();
      console.log("✅ Admin user created successfully");
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    mongoose.connection.close();
  }
};

seedAdmin();
