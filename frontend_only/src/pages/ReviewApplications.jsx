import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
  FaFileAlt,
  FaEye,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaEnvelope,
} from "react-icons/fa";

const ReviewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchApplications();
  }, [user, navigate]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://jobportal-995j.onrender.com/api/admin/applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setApplications(response.data.applications || []);
    } catch (error) {
      console.log(error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.applicant?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          app.job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.job?.company.toLowerCase().includes(searchTerm.toLowerCase()),
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
    } catch (error) {
      console.log(error);
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors duration-200 mb-2"
              >
                <FaArrowLeft />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Review Applications
              </h1>
              <p className="text-gray-600 mt-1">
                Review and manage job applications
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications by applicant, job, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Applications ({filteredApplications.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="text-gray-300 text-6xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {applications.length === 0
                  ? "No applications received yet"
                  : "No applications match your filters"}
              </h3>
              <p className="text-gray-500">
                {applications.length === 0
                  ? "Applications will appear here once candidates apply for jobs."
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application, index) => (
                <motion.div
                  key={application._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaUser className="text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.applicant?.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {application.applicant?.email}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            application.status,
                          )}`}
                        >
                          {application.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <FaBriefcase className="text-gray-400" />
                            <span className="font-medium">
                              {application.job?.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <FaUser className="text-gray-400" />
                            <span>{application.job?.company}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <FaCalendarAlt className="text-gray-400" />
                            <span>
                              Applied{" "}
                              {new Date(
                                application.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          {application.expectedSalary && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaEnvelope className="text-gray-400" />
                              <span>
                                Expected: ${application.expectedSalary}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {application.coverLetter && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Cover Letter
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {application.coverLetter}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                          <FaEye />
                          View Details
                        </button>
                        {application.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(application._id, "accepted")
                              }
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
                            >
                              <FaCheck />
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(application._id, "rejected")
                              }
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
                            >
                              <FaTimes />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Application Details Modal */}
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Application Details
                </h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-6">
                {/* Applicant Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Applicant Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">
                        {selectedApplication.applicant?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">
                        {selectedApplication.applicant?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Job Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Job Title</p>
                      <p className="font-medium">
                        {selectedApplication.job?.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="font-medium">
                        {selectedApplication.job?.company}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Application Details
                  </h4>
                  <div className="space-y-4">
                    {selectedApplication.coverLetter && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Cover Letter
                        </p>
                        <p className="text-sm bg-gray-50 p-3 rounded-lg">
                          {selectedApplication.coverLetter}
                        </p>
                      </div>
                    )}

                    {selectedApplication.expectedSalary && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Expected Salary
                        </p>
                        <p className="font-medium">
                          ${selectedApplication.expectedSalary}
                        </p>
                      </div>
                    )}

                    {selectedApplication.availability && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Availability
                        </p>
                        <p className="font-medium">
                          {selectedApplication.availability}
                        </p>
                      </div>
                    )}

                    {selectedApplication.portfolio && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Portfolio</p>
                        <a
                          href={selectedApplication.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800"
                        >
                          {selectedApplication.portfolio}
                        </a>
                      </div>
                    )}

                    {selectedApplication.linkedin && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">LinkedIn</p>
                        <a
                          href={selectedApplication.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800"
                        >
                          {selectedApplication.linkedin}
                        </a>
                      </div>
                    )}

                    {selectedApplication.github && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">GitHub</p>
                        <a
                          href={selectedApplication.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800"
                        >
                          {selectedApplication.github}
                        </a>
                      </div>
                    )}

                    {selectedApplication.resume && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Resume</p>
                        <a
                          href={`https://jobportal-995j.onrender.com/uploads/${selectedApplication.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800"
                        >
                          View Resume
                        </a>
                      </div>
                    )}

                    {selectedApplication.additionalInfo && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Additional Information
                        </p>
                        <p className="text-sm bg-gray-50 p-3 rounded-lg">
                          {selectedApplication.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Close
                  </button>
                  {selectedApplication.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            selectedApplication._id,
                            "accepted",
                          )
                        }
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                      >
                        Accept Application
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            selectedApplication._id,
                            "rejected",
                          )
                        }
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                      >
                        Reject Application
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ReviewApplications;
