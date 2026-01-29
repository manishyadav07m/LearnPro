const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"AI LearnPro" <no-reply@ailearnpro.com>',
      to,
      subject,
      text
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
};

// --- VALIDATION HELPERS ---

// Strict Gmail Validation
const validateEmail = (email) => {
  if (email.length > 50) return false;
  // Regex: Only standard chars before @, must end in @gmail.com
  const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return re.test(email);
};

// Strict Name Validation (Matches Frontend)
const validateName = (name) => {
  // Regex: Only letters and spaces, 3 to 30 chars
  const re = /^[A-Za-z\s]{3,30}$/;
  return re.test(name);
};

// Password Validation
const validatePassword = (password) => {
  const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return re.test(password);
};

// --- CONTROLLERS ---

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Name Check
    if (!validateName(name)) {
      return res.status(400).json({ error: 'Name must be 3-30 characters long and contain only letters.' });
    }

    // 2. Gmail Check
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid @gmail.com address (max 50 chars).' });
    }

    // 3. Password Check
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be 8+ characters with 1 Uppercase, 1 Number, and 1 Symbol.' });
    }

    // 4. Check Existence
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    // 5. Hash & Save
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // 6. Welcome Email
    sendEmail(email, "Welcome to AI LearnPro!", `Hi ${name},\n\nThank you for signing up!`);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid Gmail format.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    sendEmail(email, "New Login Detected", `Hi ${user.name},\n\nWe detected a new login to your account.`);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, profileImage: user.profileImage } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId, name, removeProfileImage } = req.body;
    let updateData = {};

    // Validate Name on Update too
    if (name) {
      if (!validateName(name)) {
         return res.status(400).json({ error: 'Name must be 3-30 characters long and contain only letters.' });
      }
      updateData.name = name;
    }

    if (req.file) {
      updateData.profileImage = req.file.filename;
    } 
    else if (removeProfileImage === 'true') {
      updateData.profileImage = ""; 
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ 
      user: { 
        id: updatedUser._id, 
        name: updatedUser.name, 
        email: updatedUser.email, 
        profileImage: updatedUser.profileImage 
      } 
    });

  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ error: "New password must be 8+ characters with 1 Uppercase, 1 Number, and 1 Symbol." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};