import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon, DocumentTextIcon, AcademicCapIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { getAIResponse } from './chatKnowledge';
import ChatIcon from './ChatIcon';

const ChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Hello! 👋 I\'m your **AI LearnPro Assistant**!\n\nI can help you with:\n• Syllabus upload process\n• Question generation\n• PDF download\n• Study tips\n• Technical support\n\nHow can I assist you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Get AI response from knowledge base
      const aiResponse = getAIResponse(input);
      const botMessage = { sender: 'bot', text: aiResponse };
      
      setMessages((prev) => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        sender: 'bot', 
        text: 'I apologize for the inconvenience. Please try asking in a different way or contact support if the issue persists.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
      
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        sender: 'bot', 
        text: 'Chat cleared! Hello again! 👋\n\nI\'m your AI LearnPro Assistant. How can I help you with your learning journey today?' 
      }
    ]);
  };

  // Quick action buttons
  const quickActions = [
    { 
      text: 'Upload Syllabus', 
      icon: <DocumentTextIcon className="h-4 w-4" />,
      prompt: 'How to upload syllabus?' 
    },
    { 
      text: 'Question Types', 
      icon: <AcademicCapIcon className="h-4 w-4" />,
      prompt: 'What are short medium long questions?' 
    },
    { 
      text: 'Download PDF', 
      icon: <ArrowDownTrayIcon className="h-4 w-4" />,
      prompt: 'How to download PDF?' 
    },
  ];

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    // Auto-send after setting input
    setTimeout(() => {
      const event = new Event('submit', { bubbles: true });
      document.querySelector('form')?.dispatchEvent(event);
    }, 100);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden font-sans">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">AI LearnPro Assistant</h3>
                <p className="text-xs text-white/80">Smart Learning Platform</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={clearChat}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                title="Clear chat"
              >
                Clear
              </button>
              <button onClick={toggleChat} className="hover:text-gray-200 transition-colors p-1">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 border-b border-gray-200">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="flex items-center gap-1.5 bg-white text-gray-700 text-xs font-medium px-3 py-2 rounded-lg border border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 whitespace-nowrap flex-shrink-0"
                >
                  {action.icon}
                  {action.text}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-4 rounded-2xl ${msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 rounded-bl-none border border-gray-200 shadow-sm'
                  }`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.startsWith('**') && line.endsWith('**') ? (
                        <strong className="block mb-2 text-lg">{line.replace(/\*\*/g, '')}</strong>
                      ) : line.startsWith('• ') ? (
                        <div className="ml-4 flex items-start mt-1">
                          <span className="mr-2">•</span>
                          <span>{line.substring(2)}</span>
                        </div>
                      ) : line.includes('**') ? (
                        <div className="my-2">
                          {line.split('**').map((part, j) => 
                            j % 2 === 0 ? part : <strong key={j}>{part}</strong>
                          )}
                        </div>
                      ) : (
                        <p className={`${i > 0 ? 'mt-3' : ''}`}>{line}</p>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 rounded-2xl rounded-bl-none border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-600">AI LearnPro is thinking</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about syllabus upload, questions, PDF download..."
                className="flex-1 border-2 border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    sendMessage(e);
                  }
                }}
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()} 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                <PaperAirplaneIcon className="h-5 w-5 transform transition-transform group-hover:rotate-45" />
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center">
              Try: "How to upload syllabus?" • "PDF download process" • "Study tips"
            </div>
          </form>
        </div>
      )}

      {/* Chat Icon */}
      <ChatIcon toggleChat={toggleChat} isOpen={isOpen} />
    </>
  );
};

export default ChatWindow;