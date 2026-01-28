import express from "express";
import { User } from "../models/userModel.js";
import { Job } from "../models/jobModel.js";
import { Application } from "../models/applicationModel.js";
import { authenticate, authorize } from "../middleware/auth.js";

/**
 * ADMIN ROUTES
 * All routes require admin authentication and authorization
 * Handles admin-only operations like:
 * - User management (view, update role, delete)
 * - Job management (view all, delete)
 * - Application review and management
 * - Dashboard statistics
 */

const router = express.Router();

/**
 * GET ALL USERS ENDPOINT
 * GET /api/admin/users
 * Protected route - admin only
 *
 * Retrieves paginated list of all users with optional search
 * Passwords are excluded from response for security
 *
 * Query parameters:
 * - page: Page number for pagination (default: 1)
 * - limit: Number of users per page (default: 10)
 * - search: Search keyword to match name or email
 *
 * Returns:
 * - users: Array of user objects
 * - totalPages: Total number of pages
 * - currentPage: Current page number
 * - total: Total number of users
 */
router.get("/users", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // Build query object for filtering
    let query = {};
    if (search) {
      // Search in name or email fields (case-insensitive)
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Query database with pagination
    const users = await User.find(query)
      .select("-password") // Exclude password field for security
      .sort({ createdAt: -1 }) // Newest users first
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count of matching users
    const total = await User.countDocuments(query);

    res.json({
      users,
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
 * UPDATE USER ROLE ENDPOINT
 * PUT /api/admin/users/:id/role
 * Protected route - admin only
 *
 * Updates a user's role (user or admin)
 *
 * URL parameters:
 * - id: MongoDB user ID
 *
 * Request body:
 * - role: New role (must be "user" or "admin")
 *
 * Returns:
 * - Updated user object
 */
router.put(
  "/users/:id/role",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { role } = req.body;

      // Validate role value
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Find user and update role
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true },
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User role updated successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

/**
 * DELETE USER ENDPOINT
 * DELETE /api/admin/users/:id
 * Protected route - admin only
 *
 * Deletes a user account and all associated data
 * Cannot delete admin users (prevents data loss)
 *
 * URL parameters:
 * - id: MongoDB user ID
 *
 * Side effects:
 * - Deletes all applications submitted by this user
 */
router.delete(
  "/users/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent deleting admin users to prevent data loss
      if (user.role === "admin") {
        return res.status(400).json({ message: "Cannot delete admin user" });
      }

      // Delete the user
      await User.findByIdAndDelete(req.params.id);

      // Cascade delete: remove all applications submitted by this user
      await Application.deleteMany({ applicant: req.params.id });

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

/**
 * GET ALL JOBS WITH COUNTS ENDPOINT
 * GET /api/admin/jobs
 * Protected route - admin only
 *
 * Retrieves all job postings with application counts
 * Includes pagination and search functionality
 *
 * Query parameters:
 * - page: Page number for pagination (default: 1)
 * - limit: Number of jobs per page (default: 10)
 * - search: Search keyword to match title or company
 *
 * Returns:
 * - jobs: Array of job objects with application counts
 * - totalPages: Total number of pages
 * - currentPage: Current page number
 * - total: Total number of jobs
 */
router.get("/jobs", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // Build query object for filtering
    let query = {};
    if (search) {
      // Search in title or company fields (case-insensitive)
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Query database with pagination
    const jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean(); // Use lean() for better performance (returns plain objects)

    // Get application count for each job
    // Use Promise.all for parallel processing
    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({
          job: job._id,
        });
        return { ...job, applicationCount };
      }),
    );

    // Get total count of matching jobs
    const total = await Job.countDocuments(query);

    res.json({
      jobs: jobsWithCount,
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
 * GET DASHBOARD STATISTICS ENDPOINT
 * GET /api/admin/stats
 * Protected route - admin only
 *
 * Retrieves key metrics for the admin dashboard
 * Uses Promise.all for efficient parallel queries
 *
 * Returns:
 * - totalUsers: Total number of users in system
 * - totalJobs: Total number of job postings
 * - totalApplications: Total number of applications
 * - pendingApplications: Number of applications pending review
 */
router.get("/stats", authenticate, authorize("admin"), async (req, res) => {
  try {
    // Execute all queries in parallel for performance
    const [totalUsers, totalJobs, totalApplications, pendingApplications] =
      await Promise.all([
        User.countDocuments(),
        Job.countDocuments(),
        Application.countDocuments(),
        Application.countDocuments({ status: "pending" }),
      ]);

    res.json({
      totalUsers,
      totalJobs,
      totalApplications,
      pendingApplications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET ALL APPLICATIONS ENDPOINT
 * GET /api/admin/applications
 * Protected route - admin only
 *
 * Retrieves all applications with pagination and filtering
 *
 * Query parameters:
 * - page: Page number for pagination (default: 1)
 * - limit: Number of applications per page (default: 10)
 * - search: Search keyword to match applicant name, job title, or company
 * - status: Filter by application status (pending, reviewed, accepted, rejected)
 *
 * Returns:
 * - applications: Array of application objects
 * - totalPages: Total number of pages
 * - currentPage: Current page number
 * - total: Total number of applications
 */
router.get(
  "/applications",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { page = 1, limit = 10, search, status } = req.query;

      // Build query object for filtering
      let query = {};

      // Filter by status if specified
      if (status && status !== "all") {
        query.status = status;
      }

      // Query database with pagination and population
      let applications = await Application.find(query)
        .populate({
          path: "applicant",
          select: "name email",
        })
        .populate({
          path: "job",
          select: "title company",
        })
        .sort({ createdAt: -1 });

      // Apply search filter on populated data (in memory)
      if (search) {
        const searchLower = search.toLowerCase();
        applications = applications.filter(
          (app) =>
            app.applicant?.name?.toLowerCase().includes(searchLower) ||
            app.job?.title?.toLowerCase().includes(searchLower) ||
            app.job?.company?.toLowerCase().includes(searchLower),
        );
      }

      // Apply pagination manually
      const total = applications.length;
      const start = (page - 1) * limit;
      const paginatedApplications = applications.slice(
        start,
        start + limit * 1,
      );

      res.json({
        applications: paginatedApplications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

/**
 * GET RECENT APPLICATIONS ENDPOINT
 * GET /api/admin/applications/recent
 * Protected route - admin only
 *
 * Retrieves the 5 most recent applications
 * Used for dashboard widget showing latest activity
 *
 * Returns:
 * - Array of recent application objects (maximum 5)
 */
router.get(
  "/applications/recent",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      // Fetch the 5 most recent applications
      const applications = await Application.find()
        .populate("applicant", "name email")
        .populate("job", "title company")
        .sort({ createdAt: -1 })
        .limit(5);

      res.json(applications);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

/**
 * GET RECENT USERS ENDPOINT
 * GET /api/admin/users/recent
 * Protected route - admin only
 *
 * Retrieves the 5 most recently registered users
 * Used for dashboard widget showing latest registrations
 *
 * Returns:
 * - Array of recent user objects (maximum 5, excluding password)
 */
router.get(
  "/users/recent",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      // Fetch the 5 most recent regular users (excluding admins)
      const users = await User.find({ role: "user" })
        .select("-password") // Exclude password for security
        .sort({ createdAt: -1 })
        .limit(5);

      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

/**
 * GET SINGLE APPLICATION ENDPOINT
 * GET /api/admin/applications/:id
 * Protected route - admin only
 *
 * Retrieves detailed information about a specific application
 *
 * URL parameters:
 * - id: MongoDB application ID
 *
 * Returns:
 * - Application object with applicant and job details
 */
router.get(
  "/applications/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      // Find application by ID with populated details
      const application = await Application.findById(req.params.id)
        .populate("applicant", "name email")
        .populate("job", "title company");

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json(application);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

/**
 * UPDATE APPLICATION STATUS ENDPOINT
 * PUT /api/admin/applications/:id/status
 * Protected route - admin only
 *
 * Updates the status of an application during review process
 *
 * URL parameters:
 * - id: MongoDB application ID
 *
 * Request body:
 * - status: New status (pending, accepted, or rejected)
 *
 * Returns:
 * - Updated application object
 */
router.put(
  "/applications/:id/status",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      // Validate status value
      if (!["pending", "accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      // Find and update application status
      const application = await Application.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true },
      )
        .populate("applicant", "name email")
        .populate("job", "title company");

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
 * DELETE APPLICATION ENDPOINT
 * DELETE /api/admin/applications/:id
 * Protected route - admin only
 *
 * Removes an application from the system
 *
 * URL parameters:
 * - id: MongoDB application ID
 */
router.delete(
  "/applications/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const application = await Application.findById(req.params.id);

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Delete the application
      await Application.findByIdAndDelete(req.params.id);

      res.json({ message: "Application deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

/**
 * DELETE JOB ENDPOINT
 * DELETE /api/admin/jobs/:id
 * Protected route - admin only
 *
 * Removes a job posting and all associated applications
 *
 * URL parameters:
 * - id: MongoDB job ID
 *
 * Side effects:
 * - Deletes all applications associated with this job
 */
router.delete(
  "/jobs/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Cascade delete: remove all applications for this job
      await Application.deleteMany({ job: req.params.id });

      // Delete the job itself
      await Job.findByIdAndDelete(req.params.id);

      res.json({
        message: "Job and all associated applications deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

export default router;
