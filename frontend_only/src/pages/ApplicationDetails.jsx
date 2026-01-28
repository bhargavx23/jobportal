import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaEnvelope,
  FaFileAlt,
  FaDownload,
} from "react-icons/fa";

const ApplicationDetails = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchApplication();
  }, [user, navigate, id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3001/api/admin/applications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setApplication(response.data);
    } catch (err) {
      console.error("Error fetching application:", err);
      setError(err.response?.data?.message || "Failed to load application");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/applications/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setApplication({ ...application, status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update application status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 p-4 sm:p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <FaFileAlt className="text-gray-300 text-6xl mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Application Not Found
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/admin/applications"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
            >
              <FaArrowLeft />
              Back to Applications
            </Link>
          </div>
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
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link
                to="/admin/applications"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors duration-200 mb-2"
              >
                <FaArrowLeft />
                Back to Applications
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Application Details
              </h1>
              <p className="text-gray-600 mt-1">
                Review and manage this application
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                  application.status,
                )}`}
              >
                {application.status}
              </span>
              {application.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate("accepted")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <FaCheck />
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("rejected")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <FaTimes />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Application Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="space-y-8">
            {/* Applicant Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaUser className="text-purple-600" />
                Applicant Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <p className="text-lg text-gray-900">
                    {application.applicant?.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <p className="text-lg text-gray-900">
                    {application.applicant?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaBriefcase className="text-purple-600" />
                Job Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <p className="text-lg text-gray-900">
                    {application.job?.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <p className="text-lg text-gray-900">
                    {application.job?.company}
                  </p>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaFileAlt className="text-purple-600" />
                Application Details
              </h2>
              <div className="space-y-6">
                {/* Cover Letter */}
                {application.coverLetter && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {application.coverLetter}
                      </p>
                    </div>
                  </div>
                )}

                {/* Expected Salary */}
                {application.expectedSalary && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary
                    </label>
                    <p className="text-lg text-gray-900">
                      ${application.expectedSalary}
                    </p>
                  </div>
                )}

                {/* Availability */}
                {application.availability && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <p className="text-lg text-gray-900">
                      {application.availability}
                    </p>
                  </div>
                )}

                {/* Portfolio */}
                {application.portfolio && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio
                    </label>
                    <a
                      href={application.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 underline"
                    >
                      {application.portfolio}
                    </a>
                  </div>
                )}

                {/* LinkedIn */}
                {application.linkedin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <a
                      href={application.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 underline"
                    >
                      {application.linkedin}
                    </a>
                  </div>
                )}

                {/* GitHub */}
                {application.github && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Profile
                    </label>
                    <a
                      href={application.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 underline"
                    >
                      {application.github}
                    </a>
                  </div>
                )}

                {/* Resume */}
                {application.resume && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume
                    </label>
                    <a
                      href={`http://localhost:3001/uploads/${application.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <FaDownload />
                      Download Resume
                    </a>
                  </div>
                )}

                {/* Additional Information */}
                {application.additionalInfo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {application.additionalInfo}
                      </p>
                    </div>
                  </div>
                )}

                {/* Application Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    Application Date
                  </label>
                  <p className="text-lg text-gray-900">
                    {new Date(application.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ApplicationDetails;
