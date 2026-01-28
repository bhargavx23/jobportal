import React from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaBuilding,
  FaRocket,
  FaShieldAlt,
  FaUsers,
  FaClock,
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaSearch className="text-4xl text-teal-400" />,
      title: "Smart Job Search",
      description:
        "Advanced filters and AI-powered recommendations to find your perfect job match.",
    },
    {
      icon: <FaBuilding className="text-4xl text-cyan-400" />,
      title: "Top Companies",
      description:
        "Connect with leading companies and startups from around the world.",
    },
    {
      icon: <FaRocket className="text-4xl text-emerald-400" />,
      title: "Fast Applications",
      description:
        "Apply to multiple jobs with one-click applications and track your progress.",
    },
    {
      icon: <FaShieldAlt className="text-4xl text-blue-400" />,
      title: "Secure & Trusted",
      description:
        "Your data is protected with enterprise-grade security and privacy.",
    },
    {
      icon: <FaUsers className="text-4xl text-orange-400" />,
      title: "Community Support",
      description:
        "Join a thriving community of professionals and get career advice.",
    },
    {
      icon: <FaClock className="text-4xl text-indigo-400" />,
      title: "Real-time Updates",
      description:
        "Get instant notifications about new jobs and application status.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-100 mb-4">
            Why Choose JobVerse?
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover the features that make JobVerse the ultimate platform for
            your career journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 shadow-2xl hover:shadow-teal-500/20 border border-slate-700 hover:border-teal-500/50 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-slate-100 mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
