import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaFileAlt,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaBriefcase,
  FaSearch,
} from "react-icons/fa";

const ReviewJobApplications = () => {
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { jobId } = useParams();

  // Check if user is admin on mount
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchJobAndApplications();
  }, [user, navigate, jobId]);

  // Filter applications whenever search or status filter changes
  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchJobAndApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch job details
      const jobResponse = await axios.get(
        `https://jobportal-995j.onrender.com/api/jobs/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setJob(jobResponse.data);

      // Fetch applications for this job
      const appResponse = await axios.get(
        `https://jobportal-995j.onrender.com/api/applications/job/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setApplications(appResponse.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter by applicant name
    if (searchTerm) {
      filtered = filtered.filter((app) =>
        app.applicant?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://jobportal-995j.onrender.com/api/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );
      setSelectedApplication(null);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update application status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "reviewed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 hover:bg-yellow-100";
      case "accepted":
        return "bg-green-50 hover:bg-green-100";
      case "rejected":
        return "bg-red-50 hover:bg-red-100";
      case "reviewed":
        return "bg-blue-50 hover:bg-blue-100";
      default:
        return "bg-gray-50 hover:bg-gray-100";
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
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 p-4 sm:p-6"
      >
        <div className="max-w-7xl mx-auto">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors mb-4"
          >
            <FaArrowLeft />
            Back to Dashboard
          </Link>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors mb-3"
          >
            <FaArrowLeft />
            Back to Dashboard
          </Link>

          {job && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FaBriefcase className="text-purple-600" />
                <span>{job.title}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Applications Review
              </h1>
              <p className="text-gray-600">
                {filteredApplications.length} of {applications.length}{" "}
                applications
                {statusFilter !== "all" && ` (${statusFilter})`}
              </p>
            </div>
          )}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <p className="text-gray-500 text-lg">No applications found</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${getStatusBgColor(
                  application.status,
                )}`}
                onClick={() => setSelectedApplication(application)}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Applicant Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <FaUser className="text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.applicant?.name}
                          </h3>
                          <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <FaEnvelope className="text-xs" />
                            {application.applicant?.email}
                          </div>
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        {application.coverLetter && (
                          <p>
                            <strong>Cover Letter:</strong>{" "}
                            {application.coverLetter.substring(0, 100)}...
                          </p>
                        )}
                        {application.linkedin && (
                          <p>
                            <strong>LinkedIn:</strong>{" "}
                            <a
                              href={application.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Profile
                            </a>
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                          <FaCalendarAlt />
                          {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col gap-2 sm:items-end">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                          application.status,
                        )}`}
                      >
                        {application.status.charAt(0).toUpperCase() +
                          application.status.slice(1)}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApplication(application);
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Application Details Modal */}
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedApplication.applicant?.name}
                </h2>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <FaEnvelope /> {selectedApplication.applicant?.email}
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Status Badge */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Current Status
                  </h3>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border inline-block ${getStatusColor(
                      selectedApplication.status,
                    )}`}
                  >
                    {selectedApplication.status.charAt(0).toUpperCase() +
                      selectedApplication.status.slice(1)}
                  </span>
                </div>

                {/* Cover Letter */}
                {selectedApplication.coverLetter && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Cover Letter
                    </h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                )}

                {/* LinkedIn */}
                {selectedApplication.linkedin && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      LinkedIn Profile
                    </h3>
                    <a
                      href={selectedApplication.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {selectedApplication.linkedin}
                    </a>
                  </div>
                )}

                {/* GitHub */}
                {selectedApplication.github && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      GitHub Profile
                    </h3>
                    <a
                      href={selectedApplication.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {selectedApplication.github}
                    </a>
                  </div>
                )}

                {/* Expected Salary */}
                {selectedApplication.expectedSalary && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Expected Salary
                    </h3>
                    <p className="text-gray-600">
                      {selectedApplication.expectedSalary}
                    </p>
                  </div>
                )}

                {/* Application Date */}
                <div className="text-xs text-gray-500 border-t pt-4">
                  Applied on{" "}
                  {new Date(selectedApplication.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-gray-50">
                {selectedApplication.status !== "accepted" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedApplication._id, "accepted")
                    }
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Accept
                  </button>
                )}

                {selectedApplication.status !== "rejected" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedApplication._id, "rejected")
                    }
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <FaTimes /> Reject
                  </button>
                )}

                <button
                  onClick={() => setSelectedApplication(null)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ReviewJobApplications;
