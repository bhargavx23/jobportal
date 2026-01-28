import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import jobsRoute from "./routes/jobsRoute.js";
import applicationsRoute from "./routes/applicationsRoute.js";
import adminRoute from "./routes/adminRoute.js";
import cors from "cors";

/**
 * MAIN APPLICATION ENTRY POINT
 * This file sets up the Express server with all necessary middleware and routes
 */

// Initialize Express application
const app = express();

// Middleware to parse incoming JSON request bodies
// This allows the server to understand JSON data sent by clients
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)
// Allow requests from frontend and production domains
// Development: http://localhost:5173
// Production: Frontend deployed URL
const allowedOrigins = [
  "http://localhost:5173", // Development frontend
  "https://graceful-sfogliatella-193793.netlify.app", // Production frontend
  process.env.FRONTEND_URL || "", // Production frontend URL from environment
].filter(Boolean); // Remove empty strings

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Serve static files from public/uploads directory
// This makes uploaded files (resumes, logos) accessible via HTTP requests
app.use("/uploads", express.static("public/uploads"));

/**
 * ROOT ENDPOINT
 * A simple welcome endpoint to verify the server is running
 */
app.get("/", (request, response) => {
  return response.status(200).json({
    message: "Welcome To Job Portal MERN Stack",
    version: "1.0.0",
    status: "Server is running",
  });
});

/**
 * HEALTH CHECK ENDPOINT
 * Used by hosting platforms to verify server is alive
 */
app.get("/health", (request, response) => {
  response.status(200).json({ status: "OK", timestamp: new Date() });
});

/**
 * API ROUTE MOUNTING
 * All API routes are organized by feature and mounted with appropriate prefixes
 */

// Authentication routes - handles user registration, login, and profile management
app.use("/api/auth", authRoute);

// Job-related routes - handles job CRUD operations, searching, and job applications
app.use("/api/jobs", jobsRoute);

// Application management routes - handles reviewing and managing job applications
app.use("/api/applications", applicationsRoute);

// Admin-only routes - handles admin operations like user management and statistics
app.use("/api/admin", adminRoute);

/**
 * DATABASE CONNECTION AND SERVER STARTUP
 * Connects to MongoDB and starts the Express server on the specified port
 */
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("✓ App connected to database successfully");
    app.listen(PORT, () => {
      console.log(`✓ App is listening on port: ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((error) => {
    console.error("✗ Database connection failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
  });

/**
 * ERROR HANDLING MIDDLEWARE
 * Catches unhandled errors and returns appropriate responses
 */
app.use((error, req, res, next) => {
  console.error("✗ Error:", error);
  const statusCode = error.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : error.message;
  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { error: error.stack }),
  });
});
