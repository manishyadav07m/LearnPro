
import React from 'react';
import { Clock, Users, BarChart3, Globe, Shield, Zap, Target, Book } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Generate study materials in seconds',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Exam Focused',
      description: 'Content tailored to your syllabus',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Personalized',
      description: 'Adapts to your learning style',
      color: 'from-green-400 to-teal-500'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Progress Tracking',
      description: 'Monitor your improvement',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Privacy First',
      description: 'Your data stays secure',
      color: 'from-purple-400 to-violet-500'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'All Subjects',
      description: 'From science to humanities',
      color: 'from-indigo-400 to-blue-500'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Increased stagger for smoother sequencing
        delayChildren: 0.1, // Small delay before starting
        ease: "easeOut", // Smoother easing
        duration: 0.6 // Longer duration for smoother transition
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 30, // Increased initial offset for more dramatic effect
      opacity: 0,
      scale: 0.95 // Slight scale down for depth
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring", // Changed to spring for bouncier effect
        stiffness: 100,
        damping: 15,
        mass: 1,
        duration: 0.8 // Longer duration for each item
      }
    }
  };

  const headingVariants = {
    hidden: { 
      opacity: 0,
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        delay: 0.1, // Small delay
        duration: 0.8
      }
    }
  };

  const paragraphVariants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        delay: 0.3, // Delay after heading
        duration: 0.8
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3, margin: "-100px" }} // More sensitive trigger
          className="text-center mb-12"
        >
          <motion.h2 
            variants={headingVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Why Choose AI LearnPro?
          </motion.h2>
          <motion.p 
            variants={paragraphVariants}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Revolutionize your study routine with our AI-powered platform
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "-50px" }} // Trigger earlier
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -8, // Lift effect on hover
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }
              }}
              whileTap={{ scale: 0.98 }}
              className="card text-center relative overflow-hidden group"
            >
              {/* Subtle background shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              
              <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-4 relative z-10 transform group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 relative z-10">{feature.title}</h3>
              <p className="text-gray-600 relative z-10">{feature.description}</p>
              
              {/* Subtle border animation on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-xl transition-all duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;