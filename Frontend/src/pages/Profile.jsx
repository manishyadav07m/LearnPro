import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Camera, Save, Loader2, ArrowLeft, 
  LogOut, Trash2, Upload, Shield, Lock, Eye, EyeOff, 
  CheckCircle2, Bell, Smartphone, AlertTriangle, CreditCard 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://127.0.0.1:5001/api";
const UPLOAD_URL = "http://127.0.0.1:5001/uploads/";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal'); 
  
  // Profile Form States
  const [name, setName] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deletePhoto, setDeletePhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Password Form States
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false });
  const [isPassSaving, setIsPassSaving] = useState(false);

  // Notification States (Mock)
  const [notifSettings, setNotifSettings] = useState({ email: true, promo: false, security: true });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setName(parsed.name);
      if (parsed.profileImage) setPreviewImage(`${UPLOAD_URL}${parsed.profileImage}`);
    }
  }, []);

  // --- HANDLERS (Same as before + new ones) ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 6 * 1024 * 1024) return toast.error("Image too large (Max 6MB)");
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setDeletePhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setDeletePhoto(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('name', name);
      if (selectedFile) formData.append('profileImage', selectedFile);
      if (deletePhoto) formData.append('removeProfileImage', 'true');

      const response = await axios.put(`${API_URL}/auth/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setPreviewImage(updatedUser.profileImage ? `${UPLOAD_URL}${updatedUser.profileImage}` : null);
      setSelectedFile(null);
      setDeletePhoto(false);
      window.dispatchEvent(new Event('authChange'));
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Update failed");
    } finally { setIsSaving(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) return toast.error("New passwords do not match");
    if (passData.new.length < 8) return toast.error("Password too short");

    setIsPassSaving(true);
    try {
      await axios.put(`${API_URL}/auth/password`, {
        userId: user.id,
        currentPassword: passData.current,
        newPassword: passData.new
      });
      toast.success("Password changed successfully!");
      setPassData({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally { setIsPassSaving(false); }
  };

  const handleLogout = () => {
    if (window.confirm("Log out of your account?")) {
      localStorage.clear();
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    }
  };

  const handleDeleteAccount = () => {
    const confirmName = window.prompt(`Type "${name}" to confirm account deletion. This cannot be undone.`);
    if (confirmName === name) {
      toast.error("Account deletion feature coming soon (API needed).");
    } else if (confirmName !== null) {
      toast.error("Name didn't match.");
    }
  };

  if (!user) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto"/> Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
            <ArrowLeft size={20}/>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Account Settings</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* === LEFT SIDEBAR === */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-gray-50 overflow-hidden border border-gray-200">
                {previewImage ? <img src={previewImage} className="w-full h-full object-cover"/> : 
                <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-xl font-bold">{name[0]}</div>}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-1">{name}</h3>
                <p className="text-xs text-gray-500">{user.email}</p>
                <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-green-100 text-green-800">
                  Free Plan
                </span>
              </div>
            </div>
            
            <nav className="space-y-1">
              {[
                { id: 'personal', label: 'Personal Info', icon: User },
                { id: 'security', label: 'Security ', icon: Shield },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'Account', label: 'Account', icon: CreditCard },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)} 
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={18}/> {item.label}
                </button>
              ))}
            </nav>
          </div>

          
        </div>

        {/* === RIGHT CONTENT === */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            
            {/* --- TAB: PERSONAL --- */}
            {activeTab === 'personal' && (
              <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                {/* Photo Section */}
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="h-24 w-24 rounded-full bg-gray-50 overflow-hidden border-4 border-white shadow-xl">
                      {previewImage ? <img src={previewImage} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">{name[0]}</div>}
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="font-bold text-lg">Profile Photo</h2>
                      <p className="text-sm text-gray-500 mb-4">Accepts JPG, PNG or GIF (Max 2MB)</p>
                      <div className="flex gap-3 justify-center sm:justify-start">
                        <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium transition-all"><Upload size={16}/> Upload</button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange}/>
                        {previewImage && <button onClick={handleRemovePhoto} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-sm font-medium transition-all"><Trash2 size={16}/> Remove</button>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Form */}
                <form onSubmit={handleProfileSave} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                  <h2 className="font-bold text-lg mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                      <input value={name} onChange={e => setName(e.target.value)} className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all"/>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                      <input value={user.email} disabled className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"/>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t flex justify-end">
                    <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold shadow-lg shadow-blue-200 transition-all">
                      {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>} Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* --- TAB: SECURITY --- */}
            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Password Form */}
                <form onSubmit={handlePasswordSave} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                  <h2 className="font-bold text-lg mb-2">Change Password</h2>
                  <p className="text-sm text-gray-500 mb-8">Update your password to keep your account secure.</p>

                  <div className="space-y-6 max-w-lg">
                    <div className="relative">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Current Password</label>
                      <div className="relative mt-2">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input type={showPass.current ? "text" : "password"} name="current" value={passData.current} onChange={(e) => setPassData({...passData, current: e.target.value})} className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"/>
                        <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><Eye size={18}/></button>
                      </div>
                    </div>

                    <div className="relative">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">New Password</label>
                      <div className="relative mt-2">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input type={showPass.new ? "text" : "password"} name="new" value={passData.new} onChange={(e) => setPassData({...passData, new: e.target.value})} className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"/>
                        <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><Eye size={18}/></button>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Confirm New Password</label>
                      <div className="relative mt-2">
                        <CheckCircle2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input type="password" name="confirm" value={passData.confirm} onChange={(e) => setPassData({...passData, confirm: e.target.value})} className="w-full pl-11 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"/>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t flex justify-end">
                    <button type="submit" disabled={isPassSaving} className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 font-bold transition-all">
                      {isPassSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>} Update Password
                    </button>
                  </div>
                </form>

                {/* Device History (Mock) */}
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="font-bold text-lg mb-4">Active Sessions</h2>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="p-2 bg-white rounded-lg border shadow-sm"><Smartphone size={20} className="text-gray-600"/></div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Chrome on MacOS (This Device)</p>
                            <p className="text-xs text-green-600 font-medium">Active now • {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
              </motion.div>
            )}

            {/* --- TAB: NOTIFICATIONS --- */}
            {activeTab === 'notifications' && (
               <motion.div key="notif" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                 <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="font-bold text-lg mb-6">Email Preferences</h2>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900">Product Updates</h3>
                                <p className="text-sm text-gray-500">Receive news about new features and updates.</p>
                            </div>
                            <button onClick={() => setNotifSettings(p => ({...p, promo: !p.promo}))} className={`w-12 h-6 rounded-full transition-colors relative ${notifSettings.promo ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${notifSettings.promo ? 'left-6' : 'left-0.5'}`}></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                            <div>
                                <h3 className="font-bold text-gray-900">Security Alerts</h3>
                                <p className="text-sm text-gray-500">Receive alerts about suspicious login activity.</p>
                            </div>
                            <button className="w-12 h-6 rounded-full bg-blue-600 relative cursor-not-allowed opacity-60">
                                <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-6"></div>
                            </button>
                        </div>
                    </div>
                 </div>
               </motion.div>
            )}

            {activeTab === 'Account' && (
              <motion.div key="Account" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                




                    {/* Danger Zone */}
                 <div className="bg-white rounded-2xl border border-red-100 p-8 shadow-sm overflow-hidden">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-50 rounded-full text-red-600"><AlertTriangle size={24}/></div>
                        <div>
                            <h2 className="font-bold text-lg text-red-700">Danger Zone</h2>
                            <p className="text-sm text-gray-600 mt-1 mb-6">Permanently delete your account and all of your content. This action is not reversible, so please continue with caution.</p>
                            
                            <div className="flex gap-4">
                                <button onClick={handleDeleteAccount} className="px-5 py-2 bg-red-50 text-red-600 border border-red-100 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all text-sm">
                                    Delete Account
                                </button>
                                <button onClick={handleLogout} className="px-5 py-2 text-gray-600 font-bold rounded-lg hover:bg-gray-100 transition-all text-sm">
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Profile;