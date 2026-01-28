import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import {
  Briefcase,
  MapPin,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Search,
  LogOut,
  LogIn,
  User,
  Menu,
  X,
} from "lucide-react";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalCategories: 0,
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://jobportal-995j.onrender.com/api/jobs")
      .then((response) => {
        const jobsData =
          response.data.data || response.data.jobs || response.data;
        const validJobs = Array.isArray(jobsData) ? jobsData : [];
        setJobs(validJobs);
        setFilteredJobs(validJobs);

        // Calculate stats
        const totalJobs = validJobs.length;
        const companies = new Set(validJobs.map((job) => job.company));
        const categories = new Set(validJobs.map((job) => job.category));
        setStats({
          totalJobs,
          totalCompanies: companies.size,
          totalCategories: categories.size,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const featuredJobs = filteredJobs.slice(0, 3);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Briefcase className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900 hidden sm:inline">
                JobHub
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <a
                href="#home"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Home
              </a>
              <a
                href="#jobs"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Jobs
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                About
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {!user ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/register")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
                  >
                    Sign Up
                  </motion.button>
                </>
              ) : (
                <>
                  {user.role === "admin" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate("/admin")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Admin Panel
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    <User className="w-4 h-4" />
                    {user.name}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 font-medium transition flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden pb-4 border-t border-gray-200 space-y-2"
            >
              <a
                href="#home"
                className="block text-gray-700 hover:text-blue-600 py-2"
              >
                Home
              </a>
              <a
                href="#jobs"
                className="block text-gray-700 hover:text-blue-600 py-2"
              >
                Jobs
              </a>
              <a
                href="#about"
                className="block text-gray-700 hover:text-blue-600 py-2"
              >
                About
              </a>
              {!user ? (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full text-left text-gray-700 hover:text-blue-600 py-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  {user.role === "admin" && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full text-left text-gray-700 hover:text-blue-600 py-2"
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:text-red-700 py-2"
                  >
                    Logout
                  </button>
                </>
              )}
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your <span className="text-blue-600">Dream Job</span> Today
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover thousands of job opportunities from top companies around
              the world. Start your career journey with us.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-12">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by job title, company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-300">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.totalJobs}+
                </div>
                <p className="text-gray-600">Job Openings</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.totalCompanies}+
                </div>
                <p className="text-gray-600">Companies</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.totalCategories}+
                </div>
                <p className="text-gray-600">Categories</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section id="jobs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Jobs
            </h2>
            <p className="text-lg text-gray-600">
              Top opportunities for talented professionals like you
            </p>
          </motion.div>

          {loading ? (
            <Spinner />
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      {job.type}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      {job.category}
                    </span>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/${job._id}`);
                      }}
                    >
                      View <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No jobs available yet</p>
            </div>
          )}

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/jobs")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition inline-flex items-center gap-2"
            >
              View All Jobs <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Sign up and build your professional profile",
              },
              {
                step: "2",
                title: "Search Jobs",
                description: "Browse thousands of job opportunities",
              },
              {
                step: "3",
                title: "Apply",
                description: "Submit your application in one click",
              },
              {
                step: "4",
                title: "Get Hired",
                description: "Connect with employers and land your dream job",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
