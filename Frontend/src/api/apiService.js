import axios from 'axios';



const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";


// --- UPLOAD ---
export const uploadSyllabus = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Upload failed. Is backend running?");
  }
};

// --- AUTH ---
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Registration failed");
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

// --- HISTORY (NEW) ---
export const saveUserHistory = async (historyData) => {
  try {
    const response = await axios.post(`${API_URL}/history/save`, historyData);
    return response.data;
  } catch (error) {
    console.error("Save History Error:", error);
    return null;
  }
};

export const getUserHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Fetch History Error:", error);
    return [];
  }
};

// --- NEW DELETE FUNCTION ---
export const deleteUserHistory = async (historyId) => {
  try {
    await axios.delete(`${API_URL}/history/${historyId}`);
    return true;
  } catch (error) {
    console.error("Delete Failed:", error);
    return false;
  }
};



export const updateUserProfile = async (formData) => {
  try {
    // Note: formData must contain 'userId', 'name', and optionally 'profileImage'
    const response = await axios.put(`${API_URL}/auth/profile`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Profile update failed");
  }
};