import express from "express";
import { Job } from "../models/jobModel.js";
import { Application } from "../models/applicationModel.js";
import { authenticate, authorize } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * JOB ROUTES
 * Handles all job posting operations including:
 * - Viewing job listings (public)
 * - Creating, updating, deleting jobs (admin only)
 * - Applying to jobs (authenticated users)
 * - Viewing job statistics (public)
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
  // Set destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  // Set filename pattern: timestamp + original file extension
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/**
 * GET ALL JOBS ENDPOINT
 * GET /api/jobs
 * Public route - accessible to all users
 *
 * Fetches paginated list of active job postings with optional filtering
 *
 * Query parameters:
 * - page: Page number for pagination (default: 1)
 * - limit: Number of jobs per page (default: 10)
 * - search: Search keyword to match against title, company, or description
 * - location: Filter by job location
 * - type: Filter by employment type (full-time, part-time, etc.)
 * - category: Filter by job category
 *
 * Returns:
 * - jobs: Array of matching job objects
 * - totalPages: Total number of pages available
 * - currentPage: Current page number
 * - total: Total number of matching jobs
 */
router.get("/", async (req, res) => {
  try {
    // Extract pagination and filter parameters from query string
    const {
      page = 1,
      limit = 10,
      search,
      location,
      type,
      category,
    } = req.query;

    // Build MongoDB query - start with only active jobs
    let query = { isActive: true };

    // Add search filter if provided (case-insensitive regex search)
    if (search) {
      // Search in title, company, or description fields
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add location filter if provided (case-insensitive)
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Add employment type filter if provided (exact match)
    if (type) {
      query.type = type;
    }

    // Add category filter if provided (case-insensitive)
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    // Query database with pagination
    const jobs = await Job.find(query)
      .populate("postedBy", "name email") // Get admin name and email
      .sort({ createdAt: -1 }) // Show newest jobs first
      .limit(limit * 1) // Limit results per page
      .skip((page - 1) * limit); // Skip to the correct page

    // Get total count of matching documents (for pagination info)
    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET JOB STATISTICS ENDPOINT
 * GET /api/jobs/stats
 * Public route - accessible to all users
 *
 * Retrieves dashboard statistics about the job portal
 *
 * Returns:
 * - totalJobs: Number of active job postings
 * - totalCompanies: Number of unique companies with active listings
 * - totalApplications: Total applications across all jobs
 */
router.get("/stats", async (req, res) => {
  try {
    // Count total active job postings
    const totalJobs = await Job.countDocuments({ isActive: true });

    // Count unique companies with active listings
    const totalCompanies = await Job.distinct("company", {
      isActive: true,
    }).then((companies) => companies.length);

    // Count total applications (all statuses)
    const totalApplications = await Application.countDocuments();

    res.json({
      totalJobs,
      totalCompanies,
      totalApplications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET SINGLE JOB ENDPOINT
 * GET /api/jobs/:id
 * Public route - accessible to all users
 *
 * Fetches detailed information about a specific job posting
 *
 * URL parameters:
 * - id: MongoDB job ID
 *
 * Returns:
 * - Complete job object with admin details populated
 */
router.get("/:id", async (req, res) => {
  try {
    // Find job by ID and populate admin information
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email",
    );

    // Return 404 if job not found
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * CREATE JOB ENDPOINT
 * POST /api/jobs
 * Protected route - admin only
 *
 * Creates a new job posting with company logo upload capability
 *
 * Authentication: Requires valid JWT token with admin role
 *
 * Request body:
 * - title, company, location, type, salary, description, requirements, etc.
 * - companyLogo: File upload (optional)
 *
 * Returns:
 * - Created job object with all populated fields
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("companyLogo"),
  async (req, res) => {
    try {
      // Prepare job data with uploaded file and authenticated user
      const jobData = {
        ...req.body,
        postedBy: req.user._id, // Set current admin as job poster
        companyLogo: req.file ? req.file.filename : null, // Save filename if uploaded
      };

      // Create new job document in database
      const job = await Job.create(jobData);

      // Populate admin details before returning
      await job.populate("postedBy", "name email");

      res.status(201).json(job);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

/**
 * UPDATE JOB ENDPOINT
 * PUT /api/jobs/:id
 * Protected route - admin only
 *
 * Updates an existing job posting with optional company logo update
 *
 * Authentication: Requires valid JWT token with admin role
 *
 * URL parameters:
 * - id: MongoDB job ID
 *
 * Request body:
 * - Any job fields to update
 * - companyLogo: File upload (optional)
 *
 * Returns:
 * - Updated job object
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("companyLogo"),
  async (req, res) => {
    try {
      const updates = req.body;

      // If new logo was uploaded, update the filename
      if (req.file) {
        updates.companyLogo = req.file.filename;
      }

      // Find job by ID and update with new data
      const job = await Job.findByIdAndUpdate(req.params.id, updates, {
        new: true, // Return updated document
        runValidators: true, // Validate against schema
      }).populate("postedBy", "name email");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

/**
 * DELETE JOB ENDPOINT
 * DELETE /api/jobs/:id
 * Protected route - admin only
 *
 * Deletes a job posting and all associated applications
 *
 * Authentication: Requires valid JWT token with admin role
 *
 * URL parameters:
 * - id: MongoDB job ID
 *
 * Side effects:
 * - Deletes the job document
 * - Cascades delete to all applications for this job
 */
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    // Delete the job from database
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Cascade delete all applications associated with this job
    await Application.deleteMany({ job: req.params.id });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * APPLY FOR JOB ENDPOINT
 * POST /api/jobs/:id/apply
 * Protected route - authenticated users only
 *
 * Creates a job application for the authenticated user
 * Prevents duplicate applications from the same user
 *
 * Authentication: Requires valid JWT token
 *
 * URL parameters:
 * - id: MongoDB job ID
 *
 * Request body:
 * - coverLetter: Application cover letter (text)
 * - resume: File upload (optional)
 *
 * Returns:
 * - Created application object with populated job and applicant details
 *
 * Validation:
 * - Checks if job exists
 * - Prevents duplicate applications from same user to same job
 */
router.post(
  "/:id/apply",
  authenticate,
  upload.single("resume"),
  async (req, res) => {
    try {
      // Check if the job exists
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Check if user already applied to this job (prevent duplicates)
      const existingApplication = await Application.findOne({
        job: req.params.id,
        applicant: req.user._id,
      });

      if (existingApplication) {
        return res
          .status(400)
          .json({ message: "Already applied for this job" });
      }

      // Create new application document
      const application = await Application.create({
        job: req.params.id,
        applicant: req.user._id,
        coverLetter: req.body.coverLetter,
        resume: req.file ? req.file.filename : null,
      });

      // Increment the application count for the job
      await Job.findByIdAndUpdate(req.params.id, {
        $inc: { applicationCount: 1 },
      });

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
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

export default router;
