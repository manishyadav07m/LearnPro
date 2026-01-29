import React, { useState } from 'react';
import { Users, Target, Globe, Heart, Sparkles, Award, Book, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const About = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  
  const akashPhotoPath = '/images/akash-photo.jpeg';
  const manishPhotoPath = '/images/manish-photo.jpeg';
  const shivangiPhotoPath = '/images/shivangi-photo.jpeg';
  const nitishPhotoPath = '/images/nitish-photo.jpeg';

  const team = [
    { 
      name: 'Akash Raj', 
      role: 'Front-end Developer', 
      photo: akashPhotoPath,
      color: 'from-blue-400 to-cyan-400'
    },
    { 
      name: 'Nitish Kumar', 
      role: 'Full Stack Developer', 
      photo: nitishPhotoPath,
      color: 'from-purple-400 to-pink-400'
    },
    { 
      name: 'Shivangi Singh', 
      role: 'UI/UX Designer', 
      photo: shivangiPhotoPath,
      color: 'from-green-400 to-teal-400'
    },
    { 
      name: 'Manish Yadav', 
      role: 'Back-end Developer', 
      photo: manishPhotoPath,
      color: 'from-orange-400 to-red-400'
    },
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: '10,000+', label: 'Active Students' },
    { icon: <Book className="h-6 w-6" />, value: '5,000+', label: 'Questions Generated' },
    { icon: <Target className="h-6 w-6" />, value: '95%', label: 'Success Rate' },
    { icon: <Award className="h-6 w-6" />, value: '50+', label: 'Subjects Covered' },
  ];




  const handleGetInvolved = () => {
   



    const event = new CustomEvent('openAuthModal', { detail: { mode: 'signup' } });
    window.dispatchEvent(event);
   
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1, ease: "easeOut", duration: 0.8 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0, opacity: 1, scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15, mass: 1, duration: 0.8 }
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15, mass: 1, delay: 0.1, duration: 0.8 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 15, mass: 1, duration: 0.7 }
    }
  };

  const teamVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1, y: 0,
      transition: { type: "spring", stiffness: 120, damping: 15, mass: 1, duration: 0.7 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full p-3"
              >
                <X className="h-8 w-8" />
              </button>
              <div className="relative w-full max-w-5xl h-full max-h-[85vh] flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Full screen preview"
                  className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="text-center mb-16 relative"
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="h-8 w-8 text-yellow-400 opacity-70" />
          </div>
          <motion.h1 variants={headingVariants} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="gradient-text">AI LearnPro</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing education through artificial intelligence, making quality learning accessible to every student worldwide.
          </motion.p>

          <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                custom={index}
                whileHover={{ y: -5, scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center"
              >
                <div className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-100 text-blue-600 mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-8 mb-20"
        >
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, transition: { type: "spring", stiffness: 250 } }}
            className="card relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 mb-4">
                To democratize education by providing AI-powered learning tools that adapt to each student's needs, helping them achieve academic excellence.
              </p>
              <div className="flex items-center space-x-2 text-blue-600">
                <Target className="h-5 w-5" />
                <span className="font-medium">Making learning accessible to all</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, transition: { type: "spring", stiffness: 250 } }}
            className="card relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <Globe className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 mb-4">
                We envision a world where every student has access to personalized, high-quality education resources, regardless of their background or location.
              </p>
              <div className="flex items-center space-x-2 text-purple-600">
                <Globe className="h-5 w-5" />
                <span className="font-medium">Global educational impact</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <motion.h2 variants={headingVariants} className="text-3xl font-bold text-gray-900 mb-4">
            Meet Our <span className="gradient-text">Team</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 mb-8">
            Passionate educators and technologists working together
          </motion.p>

          <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={teamVariants}
                custom={index}
                whileHover={{ y: -10, scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
                className="card text-center relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <motion.div 
                    className="relative h-48 w-48 mx-auto mb-6 group/image"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div 
                      className="h-full w-full rounded-full overflow-hidden border-4 border-white shadow-xl cursor-pointer relative"
                      onClick={() => member.photo && setSelectedImage(member.photo)}
                    >
                      {member.photo ? (
                        <>
                          <img 
                            src={member.photo} 
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/90 p-3 rounded-full transform -translate-y-2">
                              <Maximize2 className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                            Click to view
                          </div>
                        </>
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-r ${member.color} flex items-center justify-center`}>
                          <Users className="h-20 w-20 text-white opacity-80" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl -z-10 group-hover/image:opacity-100 opacity-0 transition-opacity duration-300" />
                  </motion.div>
                  
                  <h3 className="font-bold text-gray-900 text-xl mb-2">{member.name}</h3>
                  <p className="text-gray-600 mb-3">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={cardVariants}
          className="card bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-50 animate-gradient" />
          
          <div className="relative z-10">
            <motion.div 
              className="flex items-center justify-center space-x-4 mb-6"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            >
              <Heart className="h-10 w-10 text-white/90" />
              <Users className="h-10 w-10 text-white/90" />
            </motion.div>
            
            <motion.h3 variants={headingVariants} className="text-2xl font-bold mb-4">
              Join Our <span className="text-yellow-300">Community</span>
            </motion.h3>
            
            <motion.p variants={itemVariants} className="mb-8 text-white/90 max-w-2xl mx-auto">
              Be part of the educational revolution. Together, we're shaping the future of learning with AI-powered education.
            </motion.p>
            



            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetInvolved}
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300"
            >
              Get Involved
            </motion.button>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default About;