import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Briefcase,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
  Home,
  Settings,
  Eye,
  Trash2,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Mail,
  Phone,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalUsers: 0,
    totalApplications: 0,
    activeJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  // Check if user is admin
  useEffect(() => {
    console.log("Current user:", user);
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate("/login");
    } else if (user.role !== "admin") {
      console.log("User role is not admin:", user.role);
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching with token:", token ? "exists" : "missing");

        // Fetch all jobs
        const jobsRes = await axios.get(
          "http://localhost:3001/api/admin/jobs?limit=1000",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );
        console.log("Jobs response:", jobsRes.data);

        // Fetch users
        let usersData = [];
        try {
          const usersRes = await axios.get(
            "http://localhost:3001/api/admin/users?limit=1000",
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            },
          );
          console.log("Users response:", usersRes.data);
          usersData = usersRes.data.users || [];
        } catch (userError) {
          console.warn("Could not fetch users:", userError.message);
        }

        // Fetch applications
        let applicationsData = [];
        try {
          const applicationsRes = await axios.get(
            "http://localhost:3001/api/admin/applications",
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            },
          );
          console.log("Applications response:", applicationsRes.data);
          applicationsData =
            applicationsRes.data.applications || applicationsRes.data || [];
        } catch (appError) {
          console.warn("Could not fetch applications:", appError.message);
        }

        const jobsArray = jobsRes.data.jobs || jobsRes.data || [];

        setStats({
          totalJobs: jobsArray.length || 0,
          totalApplications: applicationsData.length || 0,
          activeJobs:
            jobsArray.filter((j) => j.status === "active").length || 0,
          totalUsers: usersData.length || 0,
        });
        setJobs(jobsArray);
        setUsers(usersData);
        setApplications(applicationsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error.message);
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchStats();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== jobId));
      setDeleteConfirm(null);
      setDeleteType(null);
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
      setDeleteConfirm(null);
      setDeleteType(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3001/api/admin/applications/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setApplications(applications.filter((app) => app._id !== applicationId));
      setDeleteConfirm(null);
      setDeleteType(null);
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application");
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/admin/applications/${applicationId}/status`,
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
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update application status");
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace("border", "bg")}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name || "Admin"}! Here's your portal overview.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Briefcase}
          label="Total Jobs"
          value={stats.totalJobs || 0}
          color="border-blue-500 bg-blue-50"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers || 0}
          color="border-green-500 bg-green-50"
        />
        <StatCard
          icon={FileText}
          label="Applications"
          value={stats.totalApplications || 0}
          color="border-purple-500 bg-purple-50"
        />
        <StatCard
          icon={BarChart3}
          label="System Health"
          value="100%"
          color="border-orange-500 bg-orange-50"
        />
      </div>

      {/* Recent Jobs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Jobs</h2>
          <button
            onClick={() => setActiveTab("jobs")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Job Title
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Company
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                    Applications
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.slice(0, 5).map((job) => (
                  <tr
                    key={job._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      {job.title}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{job.company}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {job.applicationCount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 py-8 text-center">
            No jobs available. Click "Create Job" to get started.
          </p>
        )}
      </motion.div>
    </div>
  );

  const JobsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Job Management</h1>
        <button
          onClick={() => navigate("/admin/jobs")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" /> Create Job
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {jobs.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Job Title
                </th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Company
                </th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Location
                </th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Type
                </th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-6 text-gray-800 font-medium">
                    {job.title}
                  </td>
                  <td className="py-4 px-6 text-gray-600">{job.company}</td>
                  <td className="py-4 px-6 text-gray-600">{job.location}</td>
                  <td className="py-4 px-6">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {job.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex gap-2">
                    <button
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="text-blue-600 hover:text-blue-700 p-2 transition"
                      title="View Job"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteConfirm(job._id);
                        setDeleteType("job");
                      }}
                      className="text-red-600 hover:text-red-700 p-2 transition"
                      title="Delete Job"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No jobs available yet.</p>
            <button
              onClick={() => navigate("/admin/jobs")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Create First Job
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );

  const ApplicationsView = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Applications</h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {applications.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Job Title
                </th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Applicant
                </th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 10).map((app) => (
                <tr
                  key={app._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-6 text-gray-800 font-medium">
                    {app.job?.title || "Job Deleted"}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {app.applicant?.name || "Unknown"}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleUpdateApplicationStatus(app._id, e.target.value)
                      }
                      className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/applications/${app._id}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium transition"
                      title="View Application"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteConfirm(app._id);
                        setDeleteType("application");
                      }}
                      className="text-red-600 hover:text-red-700 font-medium transition"
                      title="Delete Application"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No applications yet. Create jobs to receive applications.</p>
          </div>
        )}
      </motion.div>
    </div>
  );

  const UsersView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {users.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Name
                </th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Email
                </th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Joined Date
                </th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-6 text-gray-800 font-medium">
                    {user.name}
                  </td>
                  <td className="py-4 px-6 text-gray-600">{user.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm transition"
                        title="View User"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {user.role !== "admin" && (
                        <button
                          onClick={() => {
                            setDeleteConfirm(user._id);
                            setDeleteType("user");
                          }}
                          className="text-red-600 hover:text-red-700 font-medium text-sm transition"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No users found.</p>
          </div>
        )}
      </motion.div>
    </div>
  );

  const SettingsView = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 max-w-2xl"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={user?.role || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="bg-gray-900 text-white transition-all duration-300 overflow-hidden fixed h-screen z-40"
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-2xl font-bold">Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {[
            {
              id: "dashboard",
              icon: Home,
              label: "Dashboard",
            },
            {
              id: "jobs",
              icon: Briefcase,
              label: "Jobs",
            },
            {
              id: "users",
              icon: Users,
              label: "Users",
            },
            {
              id: "applications",
              icon: FileText,
              label: "Applications",
            },
            {
              id: "settings",
              icon: Settings,
              label: "Settings",
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="p-8 h-screen overflow-y-auto">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "jobs" && <JobsView />}
          {activeTab === "users" && <UsersView />}
          {activeTab === "applications" && <ApplicationsView />}
          {activeTab === "settings" && <SettingsView />}
        </div>
      </main>

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
              {deleteType === "job"
                ? "Delete Job"
                : deleteType === "user"
                  ? "Delete User"
                  : "Delete Application"}
            </h3>
            <p className="text-gray-600 mb-6">
              {deleteType === "job"
                ? "Are you sure you want to delete this job? This will also delete all associated applications."
                : deleteType === "user"
                  ? "Are you sure you want to delete this user? This action cannot be undone and will also delete all their applications."
                  : "Are you sure you want to delete this application? This action cannot be undone."}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setDeleteConfirm(null);
                  setDeleteType(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteType === "job") {
                    handleDeleteJob(deleteConfirm);
                  } else if (deleteType === "user") {
                    handleDeleteUser(deleteConfirm);
                  } else if (deleteType === "application") {
                    handleDeleteApplication(deleteConfirm);
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
