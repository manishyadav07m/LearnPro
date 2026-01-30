import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components & Pages
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Topics from './pages/Topics';
import About from './pages/About';
import Profile from './pages/Profile'; // Re-added from first version

// Chatbot Component
import ChatWindow from './components/Chatbot/ChatWindow'; 

function App() {
  return (
    <Router>
      {/* 'relative' added here to allow ChatWindow to position itself absolutely if needed */}
      <div className="min-h-screen flex flex-col relative">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        {/* Chatbot Overlay - Persistent across all routes */}
        <ChatWindow />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;