import React, { useState, useEffect } from 'react';
import TopicUpload from '../components/TopicUpload';
import ResultsDisplay from '../components/ResultsDisplay'; 
import { 
  Brain, Download, User, Clock, Eye, Loader2, LogOut 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from "jspdf";
import { toast } from 'react-toastify';
import axios from 'axios';

const Dashboard = () => {
  // ==============================
  // 1. STATE MANAGEMENT
  // ==============================
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  
  const [generatedData, setGeneratedData] = useState(null);
  const [history, setHistory] = useState([]); 
  const [loadingHistory, setLoadingHistory] = useState(false);

  // ==============================
  // 2. AUTH & DATA FETCHING
  // ==============================
  useEffect(() => {
    const loadData = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          setUser(u);
          fetchHistory(u.id);
        } catch (e) {
          console.error("User parsing error", e);
          setUser(null);
        }
      } else {
        setUser(null);
        setHistory([]);
      }
    };

    if (user?.id) fetchHistory(user.id);
    
    window.addEventListener('authChange', loadData);
    return () => window.removeEventListener('authChange', loadData);
  }, []);

  const openAuthModal = (mode) => {
    window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode } }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setGeneratedData(null);
    setHistory([]);
    toast.info("Logged out successfully");
    window.dispatchEvent(new Event('authChange'));
  };

  const fetchHistory = async (userId) => {
    if (!userId) return;
    setLoadingHistory(true);
    try {
      const res = await axios.get(`http://127.0.0.1:5001/api/history/${userId}`);
      setHistory(res.data);
    } catch (err) {
      console.error("History Fetch Error:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // ==============================
  // 3. HANDLERS (Upload & History)
  // ==============================

  // ✅ ROBUST UPLOAD HANDLER
  const handleNewUpload = (result) => {
    console.log("📦 Raw Upload Result Received:", result); 

    // 1. Find the data (it might be in .data or .questions depending on TopicUpload)
    let payload = null;
    if (result?.summary) {
        payload = result;
    } else if (result?.data?.summary) {
        payload = result.data;
    } else if (result?.questions?.summary) {
        payload = result.questions;
    }

    // 2. Validate Summary
    if (!payload || !payload.summary) {
      console.error("❌ Missing Summary. Full Result:", result);
      toast.error("Generation failed. Please check Server Logs for '429' errors.");
      return; 
    }

    // 3. Normalize Data
    const newData = {
      _id: payload._id || Date.now(),
      topic: result.topic || payload.topic || "New Study Kit",
      subject: 'General',
      summary: payload.summary, 
      questions: { 
        short: payload.questions?.short || payload.short || [],
        medium: payload.questions?.medium || payload.medium || [],
        long: payload.questions?.long || payload.long || [],
        pyq: payload.questions?.pyq || payload.pyq || [],
        faq: payload.questions?.faq || payload.faq || []
      }
    };
    
    setGeneratedData(newData);
    
    // Refresh history if user exists
    if (user?.id) fetchHistory(user.id); 
  };

  // Handler for viewing a history item
  const handleViewHistory = (item) => {
    const normalizedQuestions = item.questions || {
        short: item.short || [],
        medium: item.medium || [],
        long: item.long || [],
        pyq: item.pyq || [],
        faq: item.faq || []
    };

    const viewData = {
      _id: item._id,
      topic: item.topic,
      subject: item.subject || 'General',
      summary: item.summary,
      questions: normalizedQuestions,
      isHistory: true
    };

    setGeneratedData(viewData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==============================
  // 4. PDF GENERATION LOGIC (FIXED)
  // ==============================
  const handleDownloadPDF = () => {
    if (!generatedData) return;
    
    // 🔍 DEBUG: Check what data we actually have
    console.log("📄 Generating PDF for:", generatedData);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - (margin * 2);
    
    // Header Helper
    const addHeader = (page) => {
      doc.setFillColor(41, 98, 255); 
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setTextColor(255); 
      doc.setFontSize(16); 
      doc.setFont("helvetica", "bold");
      doc.text("AI LearnPro Study Kit", pageWidth / 2, 15, { align: "center" });
      
      doc.setFontSize(10); 
      doc.setFont("helvetica", "normal");
      doc.text("Generated Notes", pageWidth / 2, 22, { align: "center" });
      
      doc.setFillColor(245, 247, 250); 
      doc.rect(0, 35, pageWidth, 20, 'F');
      doc.setTextColor(33); 
      doc.setFontSize(10); 
      doc.setFont("helvetica", "bold");
      doc.text(`Topic: ${generatedData.topic || "General Topic"}`, margin, 48);
    };

    let yPos = 70; 
    let pageCount = 1; 
    addHeader(1);

    // 🛠️ HELPER: Case-insensitive search for questions
    const getQuestions = (key) => {
      if (!generatedData.questions) return [];
      // 1. Direct match?
      if (generatedData.questions[key]) return generatedData.questions[key];
      // 2. Case-insensitive match?
      const foundKey = Object.keys(generatedData.questions).find(k => k.toLowerCase() === key.toLowerCase());
      return foundKey ? generatedData.questions[foundKey] : [];
    };

    const sections = ['short', 'medium', 'long'];

    sections.forEach(sec => {
      const list = getQuestions(sec); 

      if(list && list.length > 0) {
        if(yPos > pageHeight - 40) { 
          doc.addPage(); 
          pageCount++; 
          addHeader(pageCount); 
          yPos = 70; 
        }

        doc.setFontSize(12); 
        doc.setTextColor(41, 98, 255); 
        doc.setFont("helvetica","bold");
        doc.text(sec.toUpperCase() + " QUESTIONS", margin, yPos); 
        yPos += 10;

        list.forEach((q, i) => {
           const qText = `Q${i+1}: ${q.q || q.question || "No question text"}`;
           const aText = `Ans: ${q.a || q.answer || "No answer text"}`;
           
           doc.setFontSize(10); 
           doc.setTextColor(0); 
           doc.setFont("helvetica","bold");
           const splitQ = doc.splitTextToSize(qText, maxLineWidth);
           
           if(yPos + splitQ.length*5 > pageHeight-20) { doc.addPage(); pageCount++; addHeader(pageCount); yPos=70; }
           doc.text(splitQ, margin, yPos); 
           yPos += splitQ.length*5;

           doc.setFontSize(10); 
           doc.setTextColor(80); 
           doc.setFont("helvetica","normal");
           const splitA = doc.splitTextToSize(aText, maxLineWidth);
           
           if(yPos + splitA.length*5 > pageHeight-20) { doc.addPage(); pageCount++; addHeader(pageCount); yPos=70; }
           doc.text(splitA, margin, yPos); 
           yPos += splitA.length*5 + 8;
        });
        yPos += 10;
      }
    });

    doc.save("StudyKit.pdf");
  };

  // ==============================
  // 5. VIEW: NOT LOGGED IN
  // ==============================
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Access Dashboard</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Please log in to generate study kits, save your history, and download professional notes.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => openAuthModal('login')}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
            >
              Log In to Continue
            </button>
            <button 
              onClick={() => openAuthModal('signup')}
              className="w-full py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              Create New Account
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==============================
  // 6. VIEW: DASHBOARD (LOGGED IN)
  // ==============================
  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="container mx-auto">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold border-2 border-white shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-500 flex items-center gap-1"><User size={14}/> {user.email}</p>
                <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                  <LogOut size={12}/> Logout
                </button>
              </div>
            </div>
          </div>
          
          {generatedData && (
            <button onClick={handleDownloadPDF} className="mt-4 md:mt-0 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all shadow-md active:scale-95">
              <Download size={18} /> Download PDF
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* --- Main Content Area --- */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {!generatedData ? (
                // 1. Upload View
                <motion.div 
                  key="upload" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <TopicUpload onUpload={handleNewUpload} userId={user?.id} />
                </motion.div>
              ) : (
                // 2. Results View
                <motion.div 
                  key="results" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <button 
                      onClick={() => setGeneratedData(null)} 
                      className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                    >
                      ← Create New Topic
                    </button>
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                       {generatedData.topic}
                    </span>
                  </div>
                  
                  {/* Pass normalized data to ResultsDisplay */}
                  <ResultsDisplay data={generatedData} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- Sidebar (Stats & History) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Brain size={100} /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 rounded-lg"><Brain className="h-5 w-5"/></div>
                  <h3 className="text-xl font-bold">Your Stats</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="opacity-90">Topics Saved</span>
                    <span className="text-2xl font-bold">{history.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-90">Total Questions</span>
                    {/* Estimate: average 10 questions per topic */}
                    <span className="text-2xl font-bold">{history.length * 10}</span> 
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600"/> Recent History
                </h3>
              </div>
              
              {loadingHistory ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500 w-8 h-8"/></div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                   <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                     <Clock className="text-gray-300" />
                   </div>
                   <p className="text-sm text-gray-400">No history found.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                  {history.map((item) => (
                    <div 
                      key={item._id}
                      onClick={() => handleViewHistory(item)}
                      className="group p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-700 text-sm line-clamp-1 group-hover:text-blue-700">
                          {item.topic}
                        </h4>
                        <Eye size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors"/>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] bg-white border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          {item.subject || 'General'}
                        </span>
                        <p className="text-[10px] text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;