import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const ChatIcon = ({ toggleChat, isOpen }) => {
  return (
    <button
      onClick={toggleChat}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-xl ${
        isOpen 
          ? 'bg-gradient-to-r from-red-500 to-red-600 rotate-90' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600 animate-bounce-slow'
      }`}
      aria-label="Open chat"
    >
      {isOpen ? (
        <span className="text-white font-bold text-lg">✕</span>
      ) : (
        <div className="relative">
          <ChatBubbleLeftRightIcon className="h-7 w-7 text-white" />
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      )}
    </button>
  );
};

export default ChatIcon;