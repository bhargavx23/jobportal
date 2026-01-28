import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BooksTable = ({ books }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="card p-4 sm:p-6 lg:p-10"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-200">
              <th className="text-left py-4 px-4 sm:py-6 sm:px-6 font-semibold text-purple-900 text-sm sm:text-lg">
                #
              </th>
              <th className="text-left py-4 px-4 sm:py-6 sm:px-6 font-semibold text-purple-900 text-sm sm:text-lg">
                Title
              </th>
              <th className="text-left py-4 px-4 sm:py-6 sm:px-6 font-semibold text-purple-900 text-sm sm:text-lg hidden sm:table-cell">
                Author
              </th>
              <th className="text-left py-4 px-4 sm:py-6 sm:px-6 font-semibold text-purple-900 text-sm sm:text-lg hidden md:table-cell">
                Year
              </th>
              <th className="text-center py-4 px-4 sm:py-6 sm:px-6 font-semibold text-purple-900 text-sm sm:text-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <motion.tr
                key={book._id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="hover:bg-purple-50 transition-all duration-500 border-b border-purple-100 last:border-b-0 group micro-interaction"
              >
                <td className="py-4 px-4 sm:py-6 sm:px-6 text-purple-700 font-medium text-sm sm:text-lg">
                  {index + 1}
                </td>
                <td className="py-4 px-4 sm:py-6 sm:px-6">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {book.image ? (
                      <motion.img
                        src={`https://jobportal-995j.onrender.com/uploads/${book.image}`}
                        alt={book.title}
                        className="w-10 h-14 sm:w-14 sm:h-20 object-cover rounded-lg shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <motion.div
                        className="p-2 sm:p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-all duration-500 flex items-center justify-center text-purple-400 text-lg sm:text-xl font-bold"
                        whileHover={{ scale: 1.05 }}
                      >
                        📖
                      </motion.div>
                    )}
                    <span className="font-semibold text-gray-900 text-sm sm:text-lg line-clamp-2">
                      {book.title}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 sm:py-6 sm:px-6 text-gray-800 hidden sm:table-cell">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-purple-400 text-base sm:text-lg font-bold">
                      👤
                    </span>
                    <span className="font-medium text-sm sm:text-base">
                      {book.author}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 sm:py-6 sm:px-6 hidden md:table-cell">
                  <span className="px-3 py-1 sm:px-4 sm:py-2 bg-purple-600 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg">
                    {book.publishYear}
                  </span>
                </td>
                <td className="py-4 px-4 sm:py-6 sm:px-6">
                  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={`/books/details/${book._id}`}
                        className="btn-primary text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                      >
                        View
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={`/books/edit/${book._id}`}
                        className="btn-primary text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                      >
                        Edit
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={`/books/delete/${book._id}`}
                        className="btn-danger text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                      >
                        Delete
                      </Link>
                    </motion.div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BooksTable;
