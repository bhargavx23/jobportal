import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import BookModal from "./BookModal";

const BookSingleCard = ({ book }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="card p-4 sm:p-6 relative group min-h-[320px] sm:min-h-[380px] bg-gradient-to-br from-white to-purple-50/30"
    >
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <span className="px-2 py-1 sm:px-3 sm:py-1 bg-purple-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg">
          {book.publishYear}
        </span>
      </div>

      <div className="mb-4 flex-1">
        <p className="text-xs text-purple-600 font-mono mb-2">
          ID: {book._id.slice(-8)}
        </p>
        <div className="flex justify-start items-start gap-x-3 mb-3">
          {book.image ? (
            <img
              src={`https://jobportal-995j.onrender.com/uploads/${book.image}`}
              alt={book.title}
              className="w-12 h-16 sm:w-16 sm:h-24 object-cover rounded-lg shadow-md flex-shrink-0"
            />
          ) : (
            <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-all duration-300 flex items-center justify-center text-purple-400 text-xl sm:text-2xl font-bold flex-shrink-0">
              📖
            </div>
          )}
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
            {book.title}
          </h2>
        </div>
        <div className="flex justify-start items-center gap-x-3 mb-3">
          <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-all duration-300 flex items-center justify-center text-purple-400 text-xl sm:text-2xl font-bold flex-shrink-0">
            👤
          </div>
          <h3 className="text-base sm:text-lg text-gray-700 font-medium line-clamp-1">
            {book.author}
          </h3>
        </div>
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-1">
            Genre:{" "}
            <span className="text-purple-600 font-medium">{book.genre}</span>
          </p>
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {book.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-x-2 mt-auto pt-4 border-t border-purple-100">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary text-sm px-3 py-2 flex-1 order-1 sm:order-none"
          onClick={() => setShowModal(true)}
        >
          Quick View
        </motion.button>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 order-2 sm:order-none"
        >
          <Link
            to={`/books/details/${book._id}`}
            className="btn-primary text-sm px-3 py-2 block text-center"
          >
            View
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 order-3 sm:order-none"
        >
          <Link
            to={`/books/edit/${book._id}`}
            className="btn-primary text-sm px-3 py-2 block text-center"
          >
            Edit
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 order-4 sm:order-none"
        >
          <Link
            to={`/books/delete/${book._id}`}
            className="btn-danger text-sm px-3 py-2 block text-center"
          >
            Delete
          </Link>
        </motion.div>
      </div>

      {showModal && (
        <BookModal book={book} onClose={() => setShowModal(false)} />
      )}
    </motion.div>
  );
};

export default BookSingleCard;
