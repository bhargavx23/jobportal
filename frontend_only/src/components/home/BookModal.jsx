import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BookModal = ({ book, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(event) => event.stopPropagation()}
        className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto relative bg-white"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 icon-btn text-red-400 hover:text-red-300 z-10 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </motion.button>

        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            {book.image ? (
              <img
                src={`https://jobportal-995j.onrender.com/uploads/${book.image}`}
                alt={book.title}
                className="w-20 h-20 object-cover rounded-full mx-auto mb-4 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400 text-3xl font-bold">
                📖
              </div>
            )}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {book.title}
            </h2>
            <div className="flex items-center justify-center gap-2 text-lg text-gray-700 mb-2">
              <span className="text-purple-400 text-xl font-bold">👤</span>
              <span>{book.author}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Genre:{" "}
              <span className="text-purple-600 font-medium">{book.genre}</span>
            </p>
            <span className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
              Published in {book.publishYear}
            </span>
          </motion.div>

          {/* Book ID */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Book ID</span>
              <span className="text-sm font-mono text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                {book._id}
              </span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              About This Book
            </h3>
            <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500">
              <p className="text-gray-700 leading-relaxed">
                {book.description}
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 pt-6 border-t border-purple-200"
          >
            <Link
              to={`/books/details/${book._id}`}
              className="btn-secondary flex-1 text-center"
              onClick={onClose}
            >
              View Full Details
            </Link>
            <Link
              to={`/books/edit/${book._id}`}
              className="btn-primary flex-1 text-center"
              onClick={onClose}
            >
              Edit Book
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookModal;
