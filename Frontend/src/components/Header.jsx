import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, Home, BookOpen, Zap, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { loginUser, registerUser } from '../api/apiService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Independent Password Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const UPLOAD_URL = "http://127.0.0.1:5001/uploads/"; 

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const handleAuthEvent = (e) => {
      const mode = e.detail?.mode || 'login';
      setIsLoginForm(mode === 'login');
      setIsLoginModalOpen(true);
      setShowPassword(false);
      setShowConfirmPassword(false);
    };

    const updateAuthStatus = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('openAuthModal', handleAuthEvent);
    window.addEventListener('authChange', updateAuthStatus);
    
    return () => {
      window.removeEventListener('openAuthModal', handleAuthEvent);
      window.removeEventListener('authChange', updateAuthStatus);
    };
  }, []);

  // ✅ STRICT INPUT CONTROL (Real-time Blocking)
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 1. Strict Name Control
    if (name === 'name') {
      // Allow ONLY letters (a-z, A-Z) and spaces. 
      // If user types a number or symbol, this regex returns true, and we RETURN early (ignoring the input).
      if (/[^a-zA-Z\s]/.test(value)) return;

      // Hard Limit: Max 30 characters
      if (value.length > 30) return;
    }

    // 2. Strict Email Length Control
    if (name === 'email') {
      // Prevent typing more than 50 characters
      if (value.length > 50) return;
    }

    // Update State if checks pass
    setFormData({ ...formData, [name]: value });
  };

  const validateInputs = () => {
    const { name, email, password } = formData;
    
    // Strict Gmail Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid @gmail.com address.");
      return false;
    }

    if (!isLoginForm) {
      // Name length check (Frontend logic)
      if (name.length < 3) {
        toast.error("Name must be at least 3 letters long.");
        return false;
      }

      const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passRegex.test(password)) {
        toast.error("Password must be 8+ chars, 1 Uppercase, 1 Number, 1 Symbol.");
        return false;
      }
      if (password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return false;
      }
    }
    return true;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const data = isLoginForm 
        ? await loginUser({ email: formData.email, password: formData.password })
        : await registerUser({ name: formData.name, email: formData.email, password: formData.password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      window.dispatchEvent(new Event('authChange'));

      setIsLoginModalOpen(false);
      toast.success(isLoginForm ? `Welcome back, ${data.user.name}!` : `Account created!`);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <Zap size={20} /> },
    { path: '/topics', label: 'Topics', icon: <BookOpen size={20} /> },
    { path: '/about', label: 'About', icon: <BookOpen size={20} /> },
  ];

  const modalVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-lg border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className=" bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <motion.div whileHover={{ rotate: 360 }} className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
               <Brain className="h-7 w-7 text-white" />
               </motion.div>
            </div>
            <h1 className="text-2xl font-bold gradient-text">AI LearnPro</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map(item => (
              <Link key={item.path} to={item.path} className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${location.pathname === item.path ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50'}`}>
                {item.icon} <span>{item.label}</span>
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                  title="Go to Profile"
                >
                  <div className="h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm border border-white shadow-sm">
                    {user.profileImage ? (
                      <img 
                        src={`${UPLOAD_URL}${user.profileImage}`} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                        onError={(e) => {e.target.style.display='none'}} 
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="font-medium text-gray-700 text-sm max-w-[100px] truncate">
                    {user.name}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex gap-2 ml-4">
                <button onClick={() => { setIsLoginForm(true); setIsLoginModalOpen(true); }} className="px-4 py-2 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50">Log In</button>
                <button onClick={() => { setIsLoginForm(false); setIsLoginModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:shadow-lg">Sign Up</button>
              </div>
            )}
          </nav>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden"><Menu/></button>
        </div>
      </header>

      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsLoginModalOpen(false)}>
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="hidden" className="bg-white rounded-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex mb-6 border-b">
                <button onClick={() => setIsLoginForm(true)} className={`flex-1 py-3 ${isLoginForm ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-400'}`}>Log In</button>
                <button onClick={() => setIsLoginForm(false)} className={`flex-1 py-3 ${!isLoginForm ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-400'}`}>Sign Up</button>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLoginForm && (
                  <div className="space-y-1">
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="Full Name" 
                      className="w-full p-3 border rounded-xl" 
                      required 
                      


                      
                      maxLength={30}
                    />
                    <p className="text-xs text-gray-400 px-1">Letters only (Max 30 chars)</p>
                  </div>
                )}
                
                <input 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Email (@gmail.com)" 
                  className="w-full p-3 border rounded-xl" 
                  required 
                  maxLength={50}
                />
                
                



                <div className="space-y-1 relative">
                  <div className="relative">
                    <input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      placeholder="Password" 
                      className="w-full p-3 border rounded-xl pr-12"
                      required 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {!isLoginForm && <p className="text-xs text-gray-400 px-1">Min 8 chars, 1 Uppercase, 1 Number, 1 Symbol</p>}
                </div>

                {!isLoginForm && (
                  <div className="relative">
                    <input 
                      name="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={formData.confirmPassword} 
                      onChange={handleInputChange} 
                      placeholder="Confirm Password" 
                      className="w-full p-3 border rounded-xl pr-12" 
                      required 
                    />
                     <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                )}
                
                <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                  {isLoading ? 'Processing...' : (isLoginForm ? 'Log In' : 'Create Account')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;