import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import {
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaBuilding,
  FaArrowLeft,
  FaBriefcase,
} from "react-icons/fa";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://jobportal-995j.onrender.com/api/jobs/${id}`,
      );
      console.log("Job details response:", response.data);
      if (response.data && response.data._id) {
        setJob(response.data);
        setError("");
      } else {
        setError("Invalid job data received");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      setError(error.response?.data?.message || "Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    if (typeof salary === "string") {
      return salary;
    }
    const { min, max, currency = "USD" } = salary;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return "Not specified";
  };

  const getTypeColor = (type) => {
    const colors = {
      "full-time": "bg-green-100 text-green-800",
      "part-time": "bg-blue-100 text-blue-800",
      contract: "bg-orange-100 text-orange-800",
      internship: "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !job) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Job not found"}
          </h2>
          <Link to="/" className="btn-primary px-6 py-3">
            Back to Jobs
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
          >
            <FaArrowLeft />
            Back to Jobs
          </Link>
        </motion.div>

        {/* Job Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              {job.companyLogo ? (
                <img
                  src={`https://jobportal-995j.onrender.com/uploads/${job.companyLogo}`}
                  alt={job.company}
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaBuilding className="text-purple-600 text-2xl" />
                </div>
              )}
            </div>

            {/* Job Info */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-2">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock />
                      <span>{job.experience} level</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaDollarSign />
                      <span>{formatSalary(job.salary)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium self-start ${getTypeColor(
                      job.type,
                    )}`}
                  >
                    {job.type.replace("-", " ").toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Apply Button */}
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={`/jobs/${job._id}/apply`}
                    className="btn-primary px-8 py-3 text-lg inline-flex items-center gap-2"
                  >
                    <FaBriefcase />
                    Apply Now
                  </Link>
                </motion.div>
              ) : (
                <div className="flex gap-4">
                  <Link to="/login" className="btn-primary px-6 py-3">
                    Sign In to Apply
                  </Link>
                  <Link to="/register" className="btn-secondary px-6 py-3">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Requirements
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {job.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Responsibilities
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {job.responsibilities}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Job Details Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Job Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-medium capitalize">
                    {job.type.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{job.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary</span>
                  <span className="font-medium">
                    {formatSalary(job.salary)}
                  </span>
                </div>
                {job.applicationDeadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline</span>
                    <span className="font-medium">
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About {job.company}
              </h3>
              {job.companyDescription ? (
                <p className="text-gray-700 text-sm">
                  {job.companyDescription}
                </p>
              ) : (
                <p className="text-gray-500 text-sm">
                  Company information not available.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobDetails;
