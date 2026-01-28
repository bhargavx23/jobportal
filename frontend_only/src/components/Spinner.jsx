import React from 'react';
import { motion } from 'framer-motion';

const Spinner = () => {
  return (
    <div className='flex items-center justify-center p-4 sm:p-8'>
      <div className='relative'>
        <motion.div
          className='w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-300 rounded-full border-t-blue-500 border-r-indigo-500'
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        <motion.div
          className='absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent rounded-full border-t-blue-400 border-r-indigo-400 opacity-75'
          animate={{ scale: [1, 1.2, 1], opacity: [0.75, 0.5, 0.75] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
      </div>
    </div>
  );
};

export default Spinner;
