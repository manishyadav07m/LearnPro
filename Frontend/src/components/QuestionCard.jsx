import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Copy, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const QuestionCard = ({ question, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const difficultyColors = {
    easy: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800',
    medium: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800',
    hard: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800',
  };

  const typeColors = {
    theory: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800',
    numerical: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800',
    application: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800',
  };

  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(question.answer);
    toast.success('Answer copied to clipboard!');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card hover:shadow-2xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              Q{index + 1}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[question.difficulty]}`}>
              {question.difficulty}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[question.type]}`}>
              {question.type}
            </span>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-900 mb-6">
            {question.question}
          </h4>
          
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnswer(!showAnswer)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAnswer ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              <span>{showAnswer ? 'Hide Answer' : 'Show Answer'}</span>
            </motion.button>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyAnswer}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Copy answer"
              >
                <Copy size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50' 
                    : 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
              >
                <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
              </motion.button>
            </div>
          </div>
          
          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-green-800">AI-Generated Answer</h5>
                      <p className="text-sm text-green-600">Verified for accuracy</p>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-white/50 p-4 rounded-lg">
                      {question.answer}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;