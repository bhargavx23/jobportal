import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
  FaBriefcase,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaArrowLeft,
  FaFilter,
  FaFileAlt,
} from "react-icons/fa";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchJobs();
  }, [user, navigate]);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://jobportal-995j.onrender.com/api/admin/jobs?limit=1000",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.log(error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://jobportal-995j.onrender.com/api/jobs/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setJobs(jobs.filter((job) => job._id !== jobId));
      setDeleteConfirm(null);
    } catch (error) {
      console.log(error);
    }
  };

  const formatSalary = (min, max, type) => {
    if (!min && !max) return "Not specified";

    const formatNumber = (num) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    };

    if (min && max) {
      return `${formatNumber(min)} - ${formatNumber(max)} ${type}`;
    } else if (min) {
      return `From ${formatNumber(min)} ${type}`;
    } else {
      return `Up to ${formatNumber(max)} ${type}`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
              <p className="text-gray-600 mt-1">
                Create, edit, and manage job listings
              </p>
            </div>
            <Link
              to="/admin/jobs"
              className="btn-primary px-6 py-3 flex items-center gap-2"
            >
              <FaPlus />
              Post New Job
            </Link>
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
                  placeholder="Search jobs by title, company, or location..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Jobs List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Jobs ({filteredJobs.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <FaBriefcase className="text-gray-300 text-6xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {jobs.length === 0
                  ? "No jobs posted yet"
                  : "No jobs match your filters"}
              </h3>
              <p className="text-gray-500 mb-6">
                {jobs.length === 0
                  ? "Start by posting your first job listing."
                  : "Try adjusting your search or filters."}
              </p>
              {jobs.length === 0 && (
                <Link to="/admin/jobs/new" className="btn-primary px-8 py-3">
                  Post First Job
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Job
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Company
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Location
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Salary
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Applications
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job, index) => (
                    <motion.tr
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {job.companyLogo ? (
                            <img
                              src={`https://jobportal-995j.onrender.com/uploads/${job.companyLogo}`}
                              alt={job.company}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FaBriefcase className="text-purple-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">
                              {job.title}
                            </p>
                            <p className="text-sm text-gray-500">{job.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{job.company}</td>
                      <td className="py-4 px-4 text-gray-600">
                        {job.location}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {formatSalary(
                          job.salaryMin,
                          job.salaryMax,
                          job.salaryType,
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            job.status,
                          )}`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {job.applicationCount || 0}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/job/${job._id}/applications`}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                            title="View Applications"
                          >
                            <FaFileAlt />
                          </Link>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                            title="View Job"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/admin/jobs/${job._id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                            title="Edit Job"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(job._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                            title="Delete Job"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Delete Job
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this job? This action cannot be
                undone and will also delete all associated applications.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteJob(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageJobs;
