import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, BookOpen, Clock, HelpCircle, FileQuestion, AlertCircle } from 'lucide-react';

const ResultsDisplay = ({ data }) => {
 


    
  if (!data || !data.questions) {
    return null;
  }

  
  
  const sections = [
    { key: 'short', title: 'Short Answer Questions', icon: <Clock className="w-5 h-5 text-blue-500" />, color: 'border-blue-500' },
    { key: 'medium', title: 'Medium Answer Questions', icon: <BookOpen className="w-5 h-5 text-indigo-500" />, color: 'border-indigo-500' },
    { key: 'long', title: 'Long Answer Questions', icon: <FileQuestion className="w-5 h-5 text-purple-500" />, color: 'border-purple-500' },
    { key: 'pyq', title: 'Previous Year Questions', icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, color: 'border-green-500' },
    { key: 'faq', title: 'Common Doubts (FAQs)', icon: <HelpCircle className="w-5 h-5 text-orange-500" />, color: 'border-orange-500' }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Study Material Generated</h2>
        <p className="text-gray-500">
          Topic: <span className="font-semibold text-indigo-600">{data.topic}</span> • 
          Subject: <span className="font-semibold text-indigo-600">{data.subject || 'General'}</span>
        </p>
      </div>

      {sections.map((section, sectionIdx) => {
        
        
        const questionsList = data.questions[section.key];
        
        

        if (!questionsList || !Array.isArray(questionsList) || questionsList.length === 0) {
          return null; 
        }

        return (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.1 }}
            className={`bg-white rounded-2xl shadow-sm border-l-4 ${section.color} p-6`}
          >
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                {section.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
              <span className="ml-auto text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                {questionsList.length} Questions
              </span>
            </div>

            <div className="grid gap-4">
              {questionsList.map((item, idx) => (
                <div key={idx} className="group p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                  <div className="flex gap-3">
                    <span className="font-mono text-sm text-gray-400 mt-1">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="space-y-2 w-full">
                      <p className="font-semibold text-gray-900 leading-relaxed">
                        {item.q || item.question}
                      </p>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-100 rounded-full"></div>
                        <p className="pl-4 text-sm text-gray-600 leading-relaxed">
                          {item.a || item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      

      {Object.keys(data.questions).length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-xl">
          <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No questions could be generated from this content.</p>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;