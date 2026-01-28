import express from "express";
import mongoose from "mongoose";
import { Application } from "../models/applicationModel.js";
import { Job } from "../models/jobModel.js";
import { authenticate, authorize } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * APPLICATION ROUTES
 * Handles all job application operations including:
 * - Users viewing their own applications
 * - Admins reviewing applications for their jobs
 * - Creating, updating, and deleting applications
 */

const router = express.Router();

// ===== FILE UPLOAD CONFIGURATION =====
// Ensure uploads directory exists (create if it doesn't)
if (!fs.existsSync("public/uploads")) {
  fs.mkdirSync("public/uploads", { recursive: true });
}

// Configure multer for file uploads
// Stores uploaded files in public/uploads with timestamp-based filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/**
 * GET USER'S APPLICATIONS ENDPOINT
 * GET /api/applications/my-applications
 * Protected route - authenticated users only
 *
 * Fetches all applications submitted by the current authenticated user
 * Includes detailed job and admin information for each application
 *
 * Returns:
 * - applications: Array of user's applications with populated job details
 */
router.get("/my-applications", authenticate, async (req, res) => {
  try {
    // Find all applications where the applicant is the current user
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        // Nested populate to get job poster (admin) details
        populate: { path: "postedBy", select: "name email" },
      })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 }); // Show newest applications first

    res.json({ applications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET APPLICATIONS FOR A JOB ENDPOINT
 * GET /api/applications/job/:jobId
 * Protected route - admin only
 *
 * Retrieves all applications for a specific job posting
 * Used by admins to review applications for their posted jobs
 *
 * URL parameters:
 * - jobId: MongoDB job ID
 *
 * Returns:
 * - Array of applications with applicant profile information
 */
router.get(
  "/job/:jobId",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      // Find all applications for the specified job
      const applications = await Application.find({ job: req.params.jobId })
        .populate("applicant", "name email profile") // Include applicant details and profile
        .sort({ createdAt: -1 }); // Show newest applications first

      res.json(applications);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

/**
 * UPDATE APPLICATION STATUS ENDPOINT
 * PUT /api/applications/:id/status
 * Protected route - admin only
 *
 * Updates the status of a job application (pending, reviewed, accepted, rejected)
 * Only admins can change application statuses
 *
 * URL parameters:
 * - id: MongoDB application ID
 *
 * Request body:
 * - status: New status (pending, reviewed, accepted, or rejected)
 *
 * Returns:
 * - Updated application object with populated job and applicant details
 */
router.put(
  "/:id/status",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      // Find and update application status
      const application = await Application.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }, // Return updated document
      ).populate([
        { path: "job", populate: { path: "postedBy", select: "name email" } },
        { path: "applicant", select: "name email profile" },
      ]);

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json({
        message: "Application status updated successfully",
        application,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

/**
 * CREATE APPLICATION ENDPOINT
 * POST /api/applications
 * Protected route - authenticated users only
 *
 * Creates a new job application with optional resume upload
 * Includes multiple contact methods and supplementary information
 *
 * Authentication: Requires valid JWT token
 *
 * Request body:
 * - jobId: MongoDB job ID (required)
 * - coverLetter: Application cover letter (required)
 * - resume: File upload (optional)
 * - portfolio: Portfolio URL/path (optional)
 * - linkedin: LinkedIn profile URL (optional)
 * - github: GitHub profile URL (optional)
 * - expectedSalary: Expected salary range (optional)
 * - availability: Availability details (optional)
 * - additionalInfo: Any additional information (optional)
 *
 * Returns:
 * - Created application object with populated details
 *
 * Validation:
 * - Checks if job exists
 * - Prevents duplicate applications from same user to same job
 */
router.post("/", authenticate, upload.single("resume"), async (req, res) => {
  try {
    const {
      jobId,
      coverLetter,
      portfolio,
      linkedin,
      github,
      expectedSalary,
      availability,
      additionalInfo,
    } = req.body;

    // Validate required fields
    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }

    if (!coverLetter) {
      return res.status(400).json({ message: "coverLetter is required" });
    }

    // Validate that user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Validate jobId is a valid MongoDB ObjectId
    if (!jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid jobId format" });
    }

    // Ensure jobId is a proper ObjectId instance
    const jobObjectId = new mongoose.Types.ObjectId(jobId);

    // Check if the job exists
    const job = await Job.findById(jobObjectId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user already applied to this job (prevent duplicates)
    const existingApplication = await Application.findOne({
      job: jobObjectId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    // Create new application document
    const application = await Application.create({
      job: jobObjectId,
      applicant: req.user._id,
      coverLetter,
      resume: req.file ? req.file.filename : null,
      portfolio,
      linkedin,
      github,
      expectedSalary,
      availability,
      additionalInfo,
    });

    // Increment the application count for the job
    const updatedJob = await Job.findByIdAndUpdate(
      jobObjectId,
      { $inc: { applicationCount: 1 } },
      { new: true },
    );

    if (!updatedJob) {
      // If job update fails, delete the created application to maintain consistency
      await Application.findByIdAndDelete(application._id);
      return res.status(404).json({ message: "Job not found during update" });
    }

    // Populate related data before returning
    await application.populate([
      { path: "job", populate: { path: "postedBy", select: "name email" } },
      { path: "applicant", select: "name email" },
    ]);

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Application creation error:", error);

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({ message: `Validation error: ${messages}` });
    }

    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

/**
 * DELETE APPLICATION ENDPOINT
 * DELETE /api/applications/:id
 * Protected route - authenticated users only
 *
 * Deletes a job application
 * Users can only delete their own applications, admins can delete any application
 *
 * URL parameters:
 * - id: MongoDB application ID
 *
 * Authorization:
 * - Users can delete their own applications
 * - Admins can delete any application
 *
 * Side effects:
 * - Decrements the application count for the associated job
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    // Find the application to check permissions
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check authorization: Only applicant or admin can delete
    if (
      application.applicant.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete the application
    await Application.findByIdAndDelete(req.params.id);

    // Decrement the application count for the job
    await Job.findByIdAndUpdate(application.job, {
      $inc: { applicationCount: -1 },
    });

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
