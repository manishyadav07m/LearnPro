const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/syllabusController');

// Configure Multer for temp storage
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), controller.processSyllabus);

module.exports = router;