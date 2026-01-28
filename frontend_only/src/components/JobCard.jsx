import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaBuilding,
} from "react-icons/fa";

const JobCard = ({ job }) => {
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
      "full-time":
        "bg-emerald-900/50 text-emerald-300 border border-emerald-700",
      "part-time": "bg-cyan-900/50 text-cyan-300 border border-cyan-700",
      contract: "bg-orange-900/50 text-orange-300 border border-orange-700",
      internship: "bg-teal-900/50 text-teal-300 border border-teal-700",
    };
    return (
      colors[type] || "bg-slate-700 text-slate-300 border border-slate-600"
    );
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden hover:shadow-teal-500/20 border border-slate-700 hover:border-teal-500/50 transition-all duration-500 group"
    >
      <div className="p-6 relative">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          {/* Company Logo and Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {job.companyLogo ? (
                <img
                  src={`https://jobportal-995j.onrender.com/uploads/${job.companyLogo}`}
                  alt={job.company}
                  className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-2 ring-teal-500/20 group-hover:ring-teal-400/40 transition-all duration-300"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-teal-800 to-cyan-800 rounded-2xl flex items-center justify-center ring-2 ring-teal-500/30 group-hover:ring-teal-400/50 shadow-lg transition-all duration-300">
                  <FaBuilding className="text-teal-300 text-2xl" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-xl text-slate-100 group-hover:text-teal-300 transition-colors duration-300 mb-1">
                  {job.title}
                </h3>
                <p className="text-slate-400 text-sm font-medium">
                  {job.company}
                </p>
              </div>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-md ${getTypeColor(
              job.type,
            )} group-hover:scale-105 transition-transform duration-200`}
          >
            {job.type.replace("-", " ").toUpperCase()}
          </span>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-xl border border-slate-600/50 hover:border-teal-500/30 transition-colors duration-200">
            <div className="p-2 bg-teal-900/50 rounded-lg">
              <FaMapMarkerAlt className="text-teal-400 text-sm" />
            </div>
            <div>
              <p className="text-slate-300 text-sm font-medium">
                {job.location}
              </p>
              <p className="text-slate-500 text-xs">Location</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-xl border border-slate-600/50 hover:border-teal-500/30 transition-colors duration-200">
            <div className="p-2 bg-teal-900/50 rounded-lg">
              <FaClock className="text-teal-400 text-sm" />
            </div>
            <div>
              <p className="text-slate-300 text-sm font-medium">
                {job.experience} level
              </p>
              <p className="text-slate-500 text-xs">Experience</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-xl border border-slate-600/50 hover:border-teal-500/30 transition-colors duration-200">
            <div className="p-2 bg-teal-900/50 rounded-lg">
              <FaDollarSign className="text-teal-400 text-sm" />
            </div>
            <div>
              <p className="text-slate-300 text-sm font-medium">
                {formatSalary(job.salary)}
              </p>
              <p className="text-slate-500 text-xs">Salary</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm line-clamp-3 mb-4">
          {job.description}
        </p>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-teal-900/50 text-teal-300 text-xs rounded-lg border border-teal-700/50"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-3 py-1 bg-slate-700 text-slate-400 text-xs rounded-lg border border-slate-600">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-500">
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
          <Link
            to={`/jobs/${job._id}`}
            className="btn-primary px-4 py-2 text-sm hover:scale-105 transition-transform duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
