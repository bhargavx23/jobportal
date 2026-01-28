import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { authenticate } from "../middleware/auth.js";
import { JWT_SECRET } from "../config.js";

const router = express.Router();

/**
 * REGISTER ENDPOINT
 * POST /api/auth/register
 *
 * Creates a new user account with provided credentials
 *
 * Request body:
 * - name: User's full name
 * - email: User's email (must be unique)
 * - password: User's password (will be hashed)
 * - role: User's role (optional, defaults to "user")
 *
 * Returns:
 * - Token: JWT token for immediate authentication
 * - User info: Basic user data (id, name, email, role)
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user document in database
    // Password will be automatically hashed by userSchema pre-save middleware
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user", // Default to "user" role if not specified
    });

    // Generate JWT token for the new user (valid for 7 days)
    // Token contains user ID which is decoded during authentication
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Return success response with token and user information
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * LOGIN ENDPOINT
 * POST /api/auth/login
 *
 * Authenticates a user with email and password
 *
 * Request body:
 * - email: User's email address
 * - password: User's password (plain-text, will be compared with hashed password)
 *
 * Returns:
 * - Token: JWT token for subsequent authenticated requests
 * - User info: Basic user data (id, name, email, role)
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare provided password with hashed password in database
    // Uses bcrypt.compare() defined in userModel.js
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token for authenticated user (valid for 7 days)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Return success response with token and user information
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET PROFILE ENDPOINT
 * GET /api/auth/profile
 * Protected route - requires valid JWT token
 *
 * Fetches the current authenticated user's profile information
 *
 * Returns:
 * - Complete user object (all fields except password)
 */
router.get("/profile", authenticate, async (req, res) => {
  try {
    // req.user is populated by authenticate middleware
    // select("-password") excludes password field from response
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * UPDATE PROFILE ENDPOINT
 * PUT /api/auth/profile
 * Protected route - requires valid JWT token
 *
 * Updates the current authenticated user's profile information
 * Prevents users from changing their password or role through this endpoint
 *
 * Request body:
 * - Any user fields except password and role (e.g., name, profile.phone, etc.)
 *
 * Returns:
 * - Updated user object with new information
 */
router.put("/profile", authenticate, async (req, res) => {
  try {
    const updates = req.body;

    // Prevent users from modifying their password through this endpoint
    delete updates.password;

    // Prevent users from changing their own role (privilege escalation prevention)
    delete updates.role;

    // Find user by ID and update with provided data
    // new: true returns the updated document
    // runValidators: true validates the update against schema
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
