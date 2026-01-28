import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * USER SCHEMA
 * Defines the structure for user documents in the MongoDB database
 * Stores user authentication data and profile information
 */
const userSchema = mongoose.Schema(
  {
    // User's full name (required)
    name: {
      type: String,
      required: true,
    },
    // User's email address (required, must be unique to prevent duplicates)
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // User's password (required, will be hashed before storage)
    password: {
      type: String,
      required: true,
    },
    // User's role - determines access levels (admin can manage jobs/users, user can apply)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // User's profile information - optional fields for job applicants
    profile: {
      phone: String, // Contact phone number
      address: String, // Residential address
      resume: String, // Path to uploaded resume file
      skills: [String], // Array of professional skills
      experience: String, // Work experience description
      education: String, // Educational background
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps to documents
    timestamps: true,
  },
);

/**
 * PRE-SAVE MIDDLEWARE
 * Automatically hashes password before saving to database
 *
 * This ensures:
 * 1. Passwords are never stored in plain text
 * 2. Only modified passwords are hashed (not on every save)
 * 3. Uses bcryptjs with salt rounds of 12 for security
 */
userSchema.pre("save", async function (next) {
  // Skip hashing if password hasn't been modified
  if (!this.isModified("password")) return next();

  // Hash password with 12 salt rounds
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * INSTANCE METHOD: comparePassword
 * Compares a plain-text password with the hashed password stored in database
 *
 * Used during login to verify user credentials
 *
 * @param {string} candidatePassword - Plain-text password to check
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
