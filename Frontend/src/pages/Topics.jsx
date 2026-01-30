import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, TrendingUp, Clock, Trash2, History, FileText, Zap, Plus, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// ✅ IMPORT API FUNCTIONS
import { getUserHistory, deleteUserHistory } from '../api/apiService';
import { toast } from 'react-toastify';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 1. Load User & Fetch History from DB
  useEffect(() => {
    const loadTopics = async () => {
      setIsLoading(true);
      const savedUser = localStorage.getItem('user');
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        try {
          // 🔥 FETCH FROM MONGODB
          const data = await getUserHistory(parsedUser.id);
          setTopics(data);
        } catch (error) {
          console.error("Failed to load history", error);
        }
      } else {
        setTopics([]); // Clear if no user
      }
      setIsLoading(false);
    };

    loadTopics();
  }, []);

  // 2. Delete Handler (Calls API)
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this topic permanently?')) {
      const success = await deleteUserHistory(id);
      if (success) {
        setTopics(prev => prev.filter(t => t._id !== id));
        toast.success("Topic deleted");
      } else {
        toast.error("Delete failed");
      }
    }
  };

  // Get unique subjects
  const subjects = ['All', ...new Set(topics.filter(t => t.subject).map(t => t.subject))];

  // Filter topics
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (topic.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || topic.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  // Calculate stats based on DB data
  const stats = {
    totalTopics: topics.length,
    totalQuestions: topics.reduce((sum, t) => {
      // Count questions inside the object
      let count = 0;
      if (t.questions) {
        if (t.questions.short) count += t.questions.short.length;
        if (t.questions.medium) count += t.questions.medium.length;
        if (t.questions.long) count += t.questions.long.length;
      }
      return sum + count;
    }, 0),
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Recently';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Please log in to view your history.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your <span className="gradient-text">Topics History</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Access all your previously generated study materials stored in the cloud.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-xl p-5 shadow-lg flex justify-between items-center">
              <div className="p-2 bg-white/20 rounded-lg"><BookOpen className="h-5 w-5" /></div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.totalTopics}</div>
                <div className="text-sm opacity-90">Total Topics</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-teal-400 text-white rounded-xl p-5 shadow-lg flex justify-between items-center">
              <div className="p-2 bg-white/20 rounded-lg"><FileText className="h-5 w-5" /></div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.totalQuestions}</div>
                <div className="text-sm opacity-90">Questions Generated</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-4 rounded-xl border border-gray-300 focus:border-blue-500 bg-white"
          >
            <option value="All">All Subjects</option>
            {subjects.filter(s => s !== 'All').map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center py-20"><div className="loader"></div> Loading...</div>
        ) : filteredTopics.length > 0 ? (
          <motion.div layout className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {filteredTopics.map((topic) => (
              <motion.div
                key={topic._id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-shadow cursor-pointer relative group"
                onClick={() => {
                  // Optional: You could navigate to Dashboard with state here if needed
                  // but typically History view is read-only or download focused
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen size={20}/></div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{topic.topic}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border">{topic.subject}</span>
                        <span className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1"/> {formatDate(topic.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, topic._id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <History className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">No History Yet</h3>
            <Link to="/dashboard" className="text-blue-600 font-bold mt-4 inline-block">Go to Dashboard to Generate →</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topics;