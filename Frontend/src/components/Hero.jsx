import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, Target, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  // KEEP ALL your original click effect states
  const [knowledgeParticles, setKnowledgeParticles] = useState([]);
  const [wisps, setWisps] = useState([]);
  const [lightOrbs, setLightOrbs] = useState([]);
  const [gridHighlights, setGridHighlights] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  
  // ADD NEW state for hover border highlights
  const [hoverBorders, setHoverBorders] = useState([]);
  
  const containerRef = useRef(null);

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'AI-Powered',
      desc: 'Smart question generation',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Instant',
      desc: 'Real-time results',
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Accurate',
      desc: 'Exam-focused content',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure',
      desc: 'Privacy guaranteed',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // ==================== ORIGINAL CLICK EFFECTS ====================
  // KEEP ALL your original click effect functions
  const createKnowledgeParticles = (x, y) => {
    const particles = Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const speed = 1.5 + Math.random() * 1.5;
      const size = 3 + Math.random() * 4;
      const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const life = 1200 + Math.random() * 800;
      
      const gridSize = 20;
      const endX = Math.round((x + Math.cos(angle) * 100) / gridSize) * gridSize;
      const endY = Math.round((y + Math.sin(angle) * 100) / gridSize) * gridSize;
      
      return {
        id: `particle-${Date.now()}-${i}`,
        startX: x,
        startY: y,
        endX,
        endY,
        size,
        color,
        life,
        type: 'knowledge',
        progress: 0,
      };
    });

    setKnowledgeParticles(prev => [...prev, ...particles]);

    setTimeout(() => {
      setKnowledgeParticles(prev => prev.filter(p => !particles.includes(p)));
    }, 2000);
  };

  const createSparkleEffect = (x, y) => {
    const gridSize = 20;
    const sparkleCount = 12;
    
    const newSparkles = Array.from({ length: sparkleCount }).map((_, i) => {
      const radius = 60 + Math.random() * 80;
      const angle = (i / sparkleCount) * Math.PI * 2 + Math.random() * 0.5;
      const sparkleX = Math.round((x + Math.cos(angle) * radius) / gridSize) * gridSize;
      const sparkleY = Math.round((y + Math.sin(angle) * radius) / gridSize) * gridSize;
      const colors = ['#3B82F6', '#8B5CF6', '#06B6D4'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 2 + Math.random() * 3;
      
      return {
        id: `sparkle-${Date.now()}-${i}`,
        x: sparkleX,
        y: sparkleY,
        color,
        size,
        life: 600 + Math.random() * 400,
        scale: 1,
      };
    });

    setSparkles(prev => [...prev, ...newSparkles]);

    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.includes(s)));
    }, 1000);
  };

  const createWisps = (x, y) => {
    const wispId = `wisp-${Date.now()}`;
    const colors = ['#3B82F6', '#8B5CF6', '#06B6D4'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const gridSize = 20;
    const path = [];
    let currentX = Math.round(x / gridSize) * gridSize;
    let currentY = Math.round(y / gridSize) * gridSize;
    
    for (let i = 0; i < 4; i++) {
      path.push({ x: currentX, y: currentY });
      if (i % 2 === 0) {
        currentX += gridSize;
      } else {
        currentY += gridSize;
      }
    }
    
    const newWisp = {
      id: wispId,
      color,
      size: 8 + Math.random() * 4,
      path,
      currentPoint: 0,
      opacity: 1,
    };

    setWisps(prev => [...prev, newWisp]);

    const interval = setInterval(() => {
      setWisps(prev => 
        prev.map(w => {
          if (w.id === wispId) {
            const nextPoint = w.currentPoint + 1;
            if (nextPoint >= w.path.length) {
              if (w.opacity <= 0) {
                setTimeout(() => {
                  setWisps(prev => prev.filter(wisp => wisp.id !== wispId));
                }, 100);
                return w;
              }
              return { ...w, opacity: w.opacity - 0.3 };
            }
            return { ...w, currentPoint: nextPoint };
          }
          return w;
        })
      );
    }, 200);

    setTimeout(() => clearInterval(interval), 1500);
  };

  const createLightOrbs = (x, y) => {
    const gridSize = 20;
    const orbCount = 4;
    
    const orbs = Array.from({ length: orbCount }).map((_, i) => {
      const radius = 40 + Math.random() * 60;
      const angle = (i / orbCount) * Math.PI * 2;
      const orbX = Math.round((x + Math.cos(angle) * radius) / gridSize) * gridSize;
      const orbY = Math.round((y + Math.sin(angle) * radius) / gridSize) * gridSize;
      const colors = ['rgba(59, 130, 246, 0.2)', 'rgba(139, 92, 246, 0.2)', 'rgba(6, 182, 212, 0.2)'];
      
      return {
        id: `orb-${Date.now()}-${i}`,
        x: orbX,
        y: orbY,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 20 + Math.random() * 30,
      };
    });

    setLightOrbs(prev => [...prev, ...orbs]);

    setTimeout(() => {
      setLightOrbs(prev => prev.filter(o => !orbs.includes(o)));
    }, 1000);
  };

  const createGridHighlights = (x, y) => {
    const gridSize = 20;
    const centerGridX = Math.round(x / gridSize);
    const centerGridY = Math.round(y / gridSize);
    const highlights = [];
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const gridX = (centerGridX + dx) * gridSize;
        const gridY = (centerGridY + dy) * gridSize;
        
        highlights.push({
          id: `grid-${Date.now()}-${dx}-${dy}`,
          x: gridX,
          y: gridY,
          color: dx === 0 && dy === 0 
            ? 'rgba(59, 130, 246, 0.15)' 
            : 'rgba(139, 92, 246, 0.08)',
        });
      }
    }
    
    setGridHighlights(prev => [...prev, ...highlights]);

    setTimeout(() => {
      setGridHighlights(prev => prev.filter(h => !highlights.includes(h)));
    }, 600);
  };

  // Handle click for original effects
  const handleBackgroundClick = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create original click effects
    createKnowledgeParticles(x, y);
    createSparkleEffect(x, y);
    createWisps(x, y);
    createLightOrbs(x, y);
    createGridHighlights(x, y);
  };

  // ==================== NEW HOVER BORDER EFFECT ====================
  // UPDATED function for hover border effect with lower contrast
  const createHoverBorders = (x, y) => {
    const gridSize = 20;
    const centerGridX = Math.round(x / gridSize);
    const centerGridY = Math.round(y / gridSize);
    const borders = [];
    
    // Create a 4x4 grid (16 squares total)
    for (let dx = -2; dx <= 1; dx++) {
      for (let dy = -2; dy <= 1; dy++) {
        const gridX = (centerGridX + dx) * gridSize;
        const gridY = (centerGridY + dy) * gridSize;
        
        // Check if this is a valid position within container bounds
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          if (gridX >= 0 && gridX <= rect.width && gridY >= 0 && gridY <= rect.height) {
            borders.push({
              id: `hover-${dx}-${dy}`,
              x: gridX,
              y: gridY,
              borderColor: 'rgba(59, 130, 246, 0.35)', // LOWER CONTRAST: Reduced from 0.7 to 0.25
              delay: Math.abs(dx) + Math.abs(dy),
            });
          }
        }
      }
    }
    
    setHoverBorders(borders);
  };

  // Handle mouse move for hover borders
  const handleMouseMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    createHoverBorders(x, y);
  };

  // Handle mouse leave - clear hover borders
  const handleMouseLeave = () => {
    setHoverBorders([]);
  };

  // ==================== EVENT LISTENERS ====================
  // Click listener for original effects
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        handleBackgroundClick(e);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Mouse move listener for hover borders
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // ==================== ANIMATION LOOP ====================
  // Keep your original animation loop for click effects
  useEffect(() => {
    const interval = setInterval(() => {
      setKnowledgeParticles(prev => 
        prev.map(particle => ({
          ...particle,
          progress: Math.min(1, particle.progress + 0.015),
        })).filter(p => p.progress < 1)
      );

      setLightOrbs(prev => 
        prev.map(orb => ({
          ...orb,
          size: orb.size * 0.97,
        })).filter(o => o.size > 5)
      );

      setSparkles(prev => 
        prev.map(sparkle => ({
          ...sparkle,
          scale: 0.5 + Math.sin(Date.now() * 0.01 + sparkle.x) * 0.5,
          life: sparkle.life - 16,
        })).filter(s => s.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative py-12 md:py-24 overflow-hidden bg-white cursor-pointer"
    >
      {/* Interactive Background */}
      <div className="absolute inset-0">
        {/* Original Grid Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.07) 0.5px, transparent 0.5px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.07) 0.5px, transparent 0.5px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0'
          }}
        />

        {/* Effects Container */}
        <div className="relative w-full h-full overflow-hidden">
          {/* ==================== NEW HOVER BORDERS (LOW CONTRAST) ==================== */}
          {hoverBorders.map((border) => (
            <motion.div
              key={border.id}
              className="absolute pointer-events-none"
              style={{
                left: border.x,
                top: border.y,
                width: '40px',
                height: '40px',
                border: '1px solid rgba(59, 130, 246, 0.35)', // Thinner border (1px instead of 1.5px)
                backgroundColor: 'transparent',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
              }}
              transition={{ 
                duration: 0.3,
                delay: border.delay * 0.03,
                ease: "easeOut",
              }}
            />
          ))}

          {/* ==================== ORIGINAL CLICK EFFECTS ==================== */}
          {/* Grid Highlights */}
          {gridHighlights.map((highlight) => (
            <motion.div
              key={highlight.id}
              className="absolute pointer-events-none"
              style={{
                left: highlight.x,
                top: highlight.y,
                width: '20px',
                height: '20px',
                backgroundColor: highlight.color,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          ))}

          {/* Light Orbs */}
          {lightOrbs.map((orb) => (
            <motion.div
              key={orb.id}
              className="absolute pointer-events-none rounded-full"
              style={{
                left: orb.x,
                top: orb.y,
                width: orb.size,
                height: orb.size,
                backgroundColor: orb.color,
                transform: 'translate(-50%, -50%)',
                filter: 'blur(6px)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.4 }}
            />
          ))}

          {/* Sparkles */}
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute pointer-events-none rounded-full"
              style={{
                left: sparkle.x,
                top: sparkle.y,
                width: sparkle.size,
                height: sparkle.size,
                backgroundColor: sparkle.color,
                transform: `translate(-50%, -50%) scale(${sparkle.scale})`,
                boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
              }}
            />
          ))}

          

          
          {knowledgeParticles.map((particle) => {
            const currentX = particle.startX + (particle.endX - particle.startX) * particle.progress;
            const currentY = particle.startY + (particle.endY - particle.startY) * particle.progress;
            
            return (
              <motion.div
                key={particle.id}
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: currentX,
                  top: currentY,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 ${particle.size * 1.5}px ${particle.color}`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                }}
              />
            );
          })}

          


          {wisps.map((wisp) => {
            const point = wisp.path[wisp.currentPoint];
            if (!point) return null;
            
            return (
              <motion.div
                key={wisp.id}
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: point.x,
                  top: point.y,
                  width: wisp.size,
                  height: wisp.size,
                  backgroundColor: wisp.color,
                  transform: 'translate(-50%, -50%)',
                  opacity: wisp.opacity,
                  boxShadow: `0 0 ${wisp.size * 2}px ${wisp.color}`,
                  filter: 'blur(1px)',
                }}
              />
            );
          })}
        </div>
      </div>

      

      <div className="container relative mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          

          
          <motion.div variants={itemVariants} className="animate-fade-in max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-6">
              <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-blue-700">AI-Powered Learning Platform</span>
            </div>
            
            


            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Master your exams with{' '}
            </h1>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mt-2">
              <span className="gradient-text">AI-generated</span>{' '}
              questions
            </h1>
            
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              Upload your syllabus topics and get instantly generated practice questions 
              with detailed answers. Study smarter, not harder.
            </p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
            >
              <Link to="/dashboard" className="btn-primary flex items-center justify-center space-x-2 group">
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/topics" className="btn-secondary">
                View Demo
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-purple-400" />
                ))}
              </div>
              <div>
                <p className="font-semibold text-gray-900">10,000+ Students Learning</p>
                <p className="text-sm text-gray-500">Join the revolution in education</p>
              </div>
            </motion.div>
          </motion.div>

          


          
          <motion.div 
            variants={itemVariants} 
            className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="card flex flex-col items-center text-center p-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                
                

                <div className="flex flex-col items-center mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white w-fit mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-2">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;