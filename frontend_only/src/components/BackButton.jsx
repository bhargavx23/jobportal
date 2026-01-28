import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BackButton = ({ destination = "/" }) => {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex justify-start mb-4 sm:mb-6"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to={destination}
          className="btn-secondary text-sm px-3 sm:px-4 py-2"
          title="Go Back"
        >
          ← Back
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default BackButton;
