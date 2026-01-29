const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/authController');

// --- 1. CONFIGURE MULTER FOR PROFILE PICS ---
const uploadDir = path.resolve(__dirname, '../uploads'); // Ensure points to main uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Save as: profileImage-123456789.jpg
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `profile-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// --- ROUTES ---
router.post('/register', authController.register);
router.post('/login', authController.login);

// ✅ FIX: Add 'upload.single' middleware here so the route accepts the file
router.put('/profile', upload.single('profileImage'), authController.updateProfile);

router.put('/password', authController.changePassword);

module.exports = router;