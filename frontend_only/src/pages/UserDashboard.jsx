import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
  FaFileAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaUser,
  FaEnvelope,
  FaBriefcase,
} from "react-icons/fa";

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchApplications();
  }, [user, navigate]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://jobportal-995j.onrender.com/api/applications/my-applications",
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

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: FaCheckCircle,
        };
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-800", icon: FaTimesCircle };
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: FaHourglassHalf,
        };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", icon: FaFileAlt };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 p-4 sm:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Profile */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {user?.name || "User"}!
              </h1>
              <p className="text-gray-600">
                Track and manage your job applications
              </p>
            </div>
            <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                <FaUser className="text-lg" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Profile</p>
                <p className="font-semibold text-gray-900">{user?.email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">
                  {applications.length}
                </p>
              </div>
              <FaBriefcase className="text-4xl text-purple-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Accepted</p>
                <p className="text-3xl font-bold text-green-600">
                  {
                    applications.filter((app) => app.status === "accepted")
                      .length
                  }
                </p>
              </div>
              <FaCheckCircle className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {
                    applications.filter((app) => app.status === "pending")
                      .length
                  }
                </p>
              </div>
              <FaHourglassHalf className="text-4xl text-yellow-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {
                    applications.filter((app) => app.status === "rejected")
                      .length
                  }
                </p>
              </div>
              <FaTimesCircle className="text-4xl text-red-200" />
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            My Applications ({applications.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="text-gray-300 text-6xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500">
                Start applying to jobs and track your progress here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, index) => {
                const statusInfo = getStatusColor(app.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={app._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {app.job?.title || "Job Title"}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <FaBriefcase className="text-purple-600" />
                            {app.job?.company || "Company"}
                          </span>
                          <span className="flex items-center gap-2">
                            <FaEnvelope className="text-blue-600" />
                            {app.applicant?.email || "No email"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bg}`}
                        >
                          <StatusIcon className={statusInfo.text} />
                          <span
                            className={`text-sm font-medium capitalize ${statusInfo.text}`}
                          >
                            {app.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {app.feedback && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Feedback:</span>{" "}
                          {app.feedback}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-500">
                      Applied on{" "}
                      {new Date(app.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
