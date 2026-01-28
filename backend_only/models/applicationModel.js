import mongoose from "mongoose";

/**
 * APPLICATION SCHEMA
 * Defines the structure for job applications in the MongoDB database
 * Stores information about a user's application to a specific job posting
 */
const applicationSchema = mongoose.Schema(
  {
    // Reference to the job being applied for (links to Job model)
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    // Reference to the user applying for the job (links to User model)
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Current status of the application in the review process
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending", // All new applications start in "pending" status
    },
    // Cover letter or motivation statement from the applicant
    coverLetter: String,
    // Path to uploaded resume/CV file
    resume: String,
    // Path to portfolio or project examples
    portfolio: String,
    // LinkedIn profile URL
    linkedin: String,
    // GitHub profile URL
    github: String,
    // Expected salary range provided by applicant
    expectedSalary: String,
    // Availability details (e.g., "Available from Jan 1st" or "2 weeks notice")
    availability: String,
    // Any additional information the applicant wants to provide
    additionalInfo: String,
    // Timestamp when the application was submitted (automatically set)
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps to documents
    timestamps: true,
  },
);

/**
 * UNIQUE INDEX
 * Prevents a user from applying to the same job twice
 * Creates a compound index on (job, applicant) and enforces uniqueness
 * If violated, MongoDB throws a duplicate key error
 */
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
