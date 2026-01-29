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
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try { return saved ? JSON.parse(saved) : null; } catch (e) { return null; }
  });
  
  const [generatedData, setGeneratedData] = useState(null);
  const [history, setHistory] = useState([]); 
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          setUser(u);
          fetchHistory(u.id);
        } catch (e) { setUser(null); }
      } else {
        setUser(null);
        setHistory([]);
      }
    };
    if (user?.id) fetchHistory(user.id);
    window.addEventListener('authChange', loadData);
    return () => window.removeEventListener('authChange', loadData);
  }, []);

  const openAuthModal = (mode) => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode } }));

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
    } catch (err) { console.error(err); } 
    finally { setLoadingHistory(false); }
  };




  const handleNewUpload = (result) => {
    console.log("📦 Dashboard Received:", result); 

    


    let payload = null;
    if (result?.summary) payload = result;
    else if (result?.data?.summary) payload = result.data;
    else if (result?.questions?.summary) payload = result.questions;




    
    if (!payload || !payload.summary) {
      console.error("❌ Missing Summary. Full Result:", result);
      toast.error("Generation failed. Please check Server Logs for '429' errors.");
      return; 
    }



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
    if (user?.id) fetchHistory(user.id); 
  };

  const handleViewHistory = (item) => {
    const viewData = {
      _id: item._id,
      topic: item.topic,
      subject: item.subject || 'General',
      summary: item.summary,
      questions: item.questions || { short:[], medium:[], long:[], pyq:[], faq:[] },
      isHistory: true
    };
    setGeneratedData(viewData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = () => {
    if (!generatedData) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - (margin * 2);
    
    const addHeader = (page) => {
      doc.setFillColor(41, 98, 255); doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setTextColor(255); doc.setFontSize(16); doc.setFont("helvetica", "bold");
      doc.text("AI LearnPro Study Kit", pageWidth / 2, 15, { align: "center" });
      doc.setFontSize(10); doc.setFont("helvetica", "normal");
      doc.text("Generated Notes", pageWidth / 2, 22, { align: "center" });
      
      doc.setFillColor(245, 247, 250); doc.rect(0, 35, pageWidth, 20, 'F');
      doc.setTextColor(33); doc.setFontSize(10); doc.setFont("helvetica", "bold");
      doc.text(`Topic: ${generatedData.topic}`, margin, 48);
    };

    let yPos = 70; let pageCount = 1; addHeader(1);

    ['short', 'medium', 'long'].forEach(sec => {
      const list = generatedData.questions[sec] || [];
      if(list.length > 0) {
        if(yPos > pageHeight - 40) { doc.addPage(); pageCount++; addHeader(pageCount); yPos=70; }
        doc.setFontSize(12); doc.setTextColor(41, 98, 255); doc.setFont("helvetica","bold");
        doc.text(sec.toUpperCase(), margin, yPos); yPos+=10;

        list.forEach((q, i) => {
           const qText = `Q${i+1}: ${q.q || q.question}`;
           const aText = `Ans: ${q.a || q.answer}`;
           
           doc.setFontSize(10); doc.setTextColor(0); doc.setFont("helvetica","bold");
           const splitQ = doc.splitTextToSize(qText, maxLineWidth);
           if(yPos + splitQ.length*5 > pageHeight-20) { doc.addPage(); pageCount++; addHeader(pageCount); yPos=70; }
           doc.text(splitQ, margin, yPos); yPos += splitQ.length*5;

           doc.setFontSize(10); doc.setTextColor(80); doc.setFont("helvetica","normal");
           const splitA = doc.splitTextToSize(aText, maxLineWidth);
           if(yPos + splitA.length*5 > pageHeight-20) { doc.addPage(); pageCount++; addHeader(pageCount); yPos=70; }
           doc.text(splitA, margin, yPos); yPos += splitA.length*5 + 5;
        });
        yPos+=10;
      }
    });
    doc.save("StudyKit.pdf");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><User size={30}/></div>
           <h2 className="text-2xl font-bold mb-2">Access Dashboard</h2>
           <p className="text-gray-500 mb-6">Please log in to use the AI features.</p>
           <button onClick={() => openAuthModal('login')} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold mb-3">Log In</button>
           <button onClick={() => openAuthModal('signup')} className="w-full py-3 border-2 rounded-xl font-bold">Sign Up</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm mb-8">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">{user.name?.[0]}</div>
             <div><h1 className="text-xl font-bold">Welcome, {user.name}</h1><button onClick={handleLogout} className="text-xs text-red-500 flex items-center gap-1"><LogOut size={12}/> Logout</button></div>
          </div>
          {generatedData && <button onClick={handleDownloadPDF} className="bg-red-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"><Download size={18}/> PDF</button>}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
             <AnimatePresence mode="wait">
               {!generatedData ? (
                 <motion.div key="upload" initial={{opacity:0}} animate={{opacity:1}}><TopicUpload onUpload={handleNewUpload}/></motion.div>
               ) : (
                 <motion.div key="results" initial={{opacity:0}} animate={{opacity:1}}>
                    <button onClick={() => setGeneratedData(null)} className="mb-4 text-blue-600 font-bold">← New Topic</button>
                    <ResultsDisplay data={generatedData}/>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold flex items-center gap-2 mb-4"><Brain/> Stats</h3>
                <div className="flex justify-between border-b border-white/20 pb-2"><span>Topics</span><span className="font-bold">{history.length}</span></div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Clock size={18}/> History</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                   {history.map(h => (
                     <div key={h._id} onClick={() => handleViewHistory(h)} className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 cursor-pointer flex justify-between">
                        <span className="text-sm font-medium truncate w-40">{h.topic}</span>
                        <Eye size={16} className="text-gray-400"/>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;