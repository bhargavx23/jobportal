import React from "react";
import { motion } from "framer-motion";

const Logo = ({ className = "text-2xl" }) => {
  return (
    <motion.div
      className={`font-bold ${className}`}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        JobVerse
      </span>
    </motion.div>
  );
};

export default Logo;
