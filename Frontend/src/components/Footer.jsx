import React from 'react';
import { Brain, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        ease: "easeOut",
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        mass: 1,
        duration: 0.6
      }
    }
  };

  const sectionVariants = {
    hidden: { 
      y: 30, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        duration: 0.7
      }
    }
  };

  const copyrightVariants = {
    hidden: { 
      opacity: 0,
      y: 10 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "-50px" }}
      className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20 overflow-hidden"
    >
      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-4 gap-8"
        >
         



          <motion.div variants={sectionVariants}>
            <motion.div 
              variants={itemVariants}
              className="flex items-center space-x-3 mb-4"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Brain className="h-8 w-8" />
              </motion.div>
              <span className="text-2xl font-bold">AI LearnPro</span>
            </motion.div>
            <motion.p 
              variants={itemVariants}
              className="text-gray-400"
            >
              Revolutionizing education with AI-powered learning solutions for students worldwide.
            </motion.p>
          </motion.div>





          <motion.div variants={sectionVariants}>
            <motion.h3 
              variants={itemVariants}
              className="text-lg font-semibold mb-4"
            >
              Quick Links
            </motion.h3>
            <ul className="space-y-2">
              {['Home', 'Dashboard', 'Topics', 'About Us'].map((link, index) => (
                <motion.li 
                  key={link}
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} 
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

         




          <motion.div variants={sectionVariants}>
            <motion.h3 
              variants={itemVariants}
              className="text-lg font-semibold mb-4"
            >
              Contact
            </motion.h3>
            <ul className="space-y-3">
              {[
                { icon: <Mail className="h-5 w-5" />, text: 'codeDynomos@gmail.com' },
                { icon: <Phone className="h-5 w-5" />, text: '+91 8340677401' },
                { icon: <MapPin className="h-5 w-5" />, text: 'Chandigarh India' }
              ].map((contact, index) => (
                <motion.li 
                  key={index}
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="text-blue-400"
                  >
                    {contact.icon}
                  </motion.div>
                  <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                    {contact.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          



          <motion.div variants={sectionVariants}>
            <motion.h3 
              variants={itemVariants}
              className="text-lg font-semibold mb-4"
            >
              Follow Us
            </motion.h3>
            <motion.div 
              variants={itemVariants}
              className="flex space-x-4"
            >
              {[
                { icon: <Facebook className="h-5 w-5" />, color: 'hover:bg-blue-600', delay: 0 },
                { icon: <Twitter className="h-5 w-5" />, color: 'hover:bg-blue-400', delay: 0.05 },
                { icon: <Linkedin className="h-5 w-5" />, color: 'hover:bg-blue-700', delay: 0.1 },
                { icon: <Instagram className="h-5 w-5" />, color: 'hover:bg-pink-600', delay: 0.15 }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -5, 
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: social.delay }}
                  className={`p-2 bg-gray-800 rounded-lg ${social.color} transition-colors duration-300 relative overflow-hidden group`}
                >
                 



                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  <div className="relative z-10">
                    {social.icon}
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

       




        <motion.div 
          variants={copyrightVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400"
        >
          <p>© {new Date().getFullYear()} AI LearnPro. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;