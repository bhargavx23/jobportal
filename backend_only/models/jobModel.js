import mongoose from "mongoose";

/**
 * JOB SCHEMA
 * Defines the structure for job postings in the MongoDB database
 * Contains all information about a job listing posted by employers
 */
const jobSchema = mongoose.Schema(
  {
    // Job title (e.g., "Senior React Developer") - required
    title: {
      type: String,
      required: true,
    },
    // Company name that posted the job - required
    company: {
      type: String,
      required: true,
    },
    // Job location (e.g., "New York, NY" or "Remote") - required
    location: {
      type: String,
      required: true,
    },
    // Type of employment - restricted to predefined options
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "freelance", "internship"],
      required: true,
    },
    // Salary range or amount (stored as string to allow flexible formats like "50k-70k")
    salary: {
      type: String,
    },
    // Detailed job description and responsibilities
    description: {
      type: String,
      required: true,
    },
    // Job requirements as a formatted string
    requirements: String,
    // Benefits offered by the company
    benefits: String,
    // Array of required skills (e.g., ["React", "Node.js", "MongoDB"])
    skills: [String],
    // Experience level required
    experience: {
      type: String,
      enum: ["entry", "mid", "senior", "executive"],
    },
    // Job category/classification (e.g., "Engineering", "Sales")
    category: String,
    // Path to uploaded company logo image
    companyLogo: String,
    // Deadline for job applications
    applicationDeadline: Date,
    // Email address for job inquiries
    contactEmail: String,
    // Reference to the admin/user who posted this job (creates relationship with User model)
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Flag to indicate if job is still active (can be deactivated without deletion)
    isActive: {
      type: Boolean,
      default: true,
    },
    // Counter for total applications received for this job (incremented when someone applies)
    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps to documents
    timestamps: true,
  },
);

export const Job = mongoose.model("Job", jobSchema);
