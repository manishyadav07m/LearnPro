import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FileText, Upload, Camera, RefreshCw, Loader2, FileCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios'; 
import { motion, AnimatePresence } from 'framer-motion';

const TopicUpload = ({ onUpload, userId }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState('text'); 
  const [file, setFile] = useState(null);
  const [showCam, setShowCam] = useState(false);
  const webcamRef = useRef(null);
  const fileRef = useRef(null);

  const videoConstraints = { width: 1280, height: 720, facingMode: "environment" };

  const capture = useCallback(() => {
    const src = webcamRef.current.getScreenshot();
    if (src) {
      fetch(src).then(r => r.blob()).then(b => {
        const capturedFile = new File([b], `scan-${Date.now()}.jpg`, { type: "image/jpeg" });
        setFile(capturedFile);
        setShowCam(false);
        toast.info("Image captured!");
      });
    }
  }, [webcamRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (method === 'text' && !topic.trim()) return toast.error('Enter text first');
    if (method !== 'text' && !file) return toast.error('Select an image');

    setIsLoading(true);
    try {
      
      const formData = new FormData();
      
     
      if (userId) formData.append('userId', userId);

    
      if (method === 'text') {
        formData.append('textInput', topic);
        formData.append('topicName', topic.substring(0, 30));
      } else {
        formData.append('file', file);
        formData.append('topicName', file.name);
      }
      
     
      const response = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      
      onUpload(response.data);
      
      toast.success('✨ Study kit generated & saved!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to generate.");
      if (method !== 'text') setFile(null);
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="flex gap-2 mb-8 bg-gray-50 p-1.5 rounded-2xl">
        {['text', 'file', 'scan'].map(m => (
          <button key={m} type="button" 
            onClick={() => { setMethod(m); setFile(null); setTopic(''); setShowCam(m === 'scan'); }} 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${method === m ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400'}`}
          >
            {m === 'text' ? <FileText size={18}/> : m === 'file' ? <Upload size={18}/> : <Camera size={18}/>}
            <span className="capitalize">{m === 'scan' ? 'Scan' : m}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">


        <AnimatePresence mode="wait">



          {method === 'text' ? (
            <motion.textarea initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              value={topic} onChange={e => setTopic(e.target.value)} rows={6} 
              placeholder="Paste your notes here..." 
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none" 
            />
          ) : method === 'scan' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
              {showCam ? (
                <div className="relative rounded-2xl overflow-hidden w-full max-w-sm border-4 border-indigo-50">
                  <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} className="w-full" />
                  <button type="button" onClick={capture} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-xl">Capture</button>
                </div>
              ) : file ? (
                <div className="text-center p-6 border-2 border-indigo-100 rounded-3xl bg-indigo-50/30 w-full">
                  <img src={URL.createObjectURL(file)} className="h-48 mx-auto rounded-xl mb-4 object-contain" alt="Preview" />
                  <button type="button" onClick={() => setShowCam(true)} className="flex items-center gap-2 mx-auto text-indigo-600 font-bold"><RefreshCw size={16}/> Retake</button>
                </div>
              ) : (
                <button type="button" onClick={() => setShowCam(true)} className="py-16 w-full border-4 border-dashed border-gray-100 rounded-3xl text-gray-400 font-medium">Click to Start Camera</button>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => fileRef.current.click()} 
              className="py-16 border-4 border-dashed border-gray-100 rounded-3xl text-center cursor-pointer hover:border-indigo-200"
            >
              <input type="file" ref={fileRef} onChange={e => setFile(e.target.files[0])} className="hidden" accept="image/*" />
              {file ? <FileCheck size={40} className="mx-auto text-green-500 mb-2" /> : <Upload size={40} className="mx-auto text-gray-300 mb-2" />}
              <p className="text-gray-500 font-bold">{file ? file.name : "Upload Image"}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" disabled={isLoading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-3">
          {isLoading ? <><Loader2 className="animate-spin" /> Generating...</> : "Generate Study Pack"}
        </button>
      </form>
    </div>
  );
};
export default TopicUpload;