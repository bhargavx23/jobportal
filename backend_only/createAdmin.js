import mongoose from "mongoose";
import { User } from "./models/userModel.js";
import { mongoDBURL } from "./config.js";

async function createAdmin() {
  try {
    await mongoose.connect(mongoDBURL);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists:", {
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: existingAdmin.role,
      });
      return;
    }

    // Create new admin user
    const adminUser = new User({
      name: "admin",
      email: "bhargav@admin",
      password: "bhargav1122",
      role: "admin",
    });

    await adminUser.save();

    console.log("Admin user created successfully!");
    console.log("Email: bhargav@admin");
    console.log("Password: bhargav1122");
    console.log("Please change the password after first login.");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
