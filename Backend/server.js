require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
// Ensure you have installed youtube-transcript: npm install youtube-transcript
// const { YoutubeTranscript } = require('youtube-transcript'); 

const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const UPLOAD_DIR = path.resolve(__dirname, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

// Connect Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));


// --- 🛠️ HELPER: ROBUST JSON CLEANER ---
// Fixes "Unexpected end of JSON input" by stripping Markdown formatting
function cleanAndParseJSON(rawText) {
  // 1. Remove Markdown code blocks (```json ... ```)
  let cleanText = rawText.replace(/```json|```/g, '').trim();

  // 2. Find the start '{' and end '}' to ignore intro/outro text
  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleanText = cleanText.substring(firstBrace, lastBrace + 1);
  }

  // 3. Attempt Parse
  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("❌ JSON Parse Failed. AI Output:", rawText);
    throw new Error("AI generated invalid JSON. Please try again.");
  }
}

// --- 🧠 AI GENERATION FUNCTION ---
async function generateStudyKit(extractedText) {
  const apiKey = process.env.GEMINI_API_KEY;
  // Use model from .env, but fallback to stable 1.5-flash if that fails/doesn't exist
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash"; 
  
  console.log(`🤖 Initializing AI with model: ${modelName}`);

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: { 
      // Force JSON mode where possible
      responseMimeType: "application/json", 
      maxOutputTokens: 8192, // High limit to prevent cut-off responses
    },
    // Turn off safety filters to prevent empty responses on academic topics
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ]
  });

  const prompt = `
    You are an expert educational AI. Analyze the provided content and generate a study kit.
    
    OUTPUT JSON SCHEMA:
    {
      "summary": "Concise summary string",
      "short": [{"q": "Question string", "a": "Answer string"}],
      "medium": [{"q": "Question string", "a": "Answer string"}],
      "long": [{"q": "Question string", "a": "Answer string"}]
    }

    RULES:
    1. Output strictly valid JSON.
    2. Do not add markdown formatting or introductory text.
    
    CONTENT:
    ${extractedText.substring(0, 20000)} 
  `;

  // Retry Logic (3 Attempts) to handle 503/429 errors
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`🧠 AI Attempt ${attempt}...`);
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Debug: Log length to ensure we got data
      console.log(`📄 AI Response Length: ${text.length} chars`);

      // Use the cleaner function to handle any formatting issues
      return cleanAndParseJSON(text);

    } catch (error) {
      console.warn(`⚠️ Attempt ${attempt} failed: ${error.message}`);
      
      // If it's the last attempt, throw error
      if (attempt === 3) throw new Error(`Final AI Failure: ${error.message}`);
      
      // If server overloaded (503) or rate limited (429), wait 2s and retry
      if (error.message.includes('503') || error.message.includes('429')) {
        console.log("⏳ Server busy. Waiting 2s...");
        await new Promise(res => setTimeout(res, 2000));
      } else {
        // If it's a different error (e.g. Model Not Found), stop retrying
        throw error;
      }
    }
  }
}

// --- 📂 UPLOAD CONFIG ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });


// --- 🚀 MAIN API ROUTE ---
app.post('/api/upload', upload.single('file'), async (req, res) => {
  let filePath = null;
  try {
    let extractedText = "";
    const { youtubeUrl, textInput } = req.body;

    // 1. YouTube Logic
    if (youtubeUrl) {
      console.log("📺 Fetching YouTube...");
      try {
        const transcriptItems = await YoutubeTranscript.fetchTranscript(youtubeUrl);
        extractedText = transcriptItems.map(item => item.text).join(' ');
      } catch (err) {
        throw new Error("Could not fetch YouTube transcript. Check URL or captions.");
      }
    } 
    // 2. File Upload Logic (Text/Image)
    else if (req.file) {
      filePath = path.resolve(req.file.path);
      if (req.file.mimetype === 'text/plain') {
        extractedText = fs.readFileSync(filePath, 'utf8');
      } else {
        console.log("🔍 Running OCR...");
        const imageBuffer = fs.readFileSync(filePath);
        if (imageBuffer.length < 100) throw new Error("Image file empty");
        
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
        extractedText = text;
      }
    } 
    // 3. Raw Text Logic
    else if (textInput) {
      extractedText = textInput;
    } 
    else {
      return res.status(400).json({ error: "No content provided." });
    }

    if (!extractedText || extractedText.trim().length < 10) {
      throw new Error("Extracted text is too short or empty.");
    }

    console.log("🧠 Sending to AI...");
    const studyKit = await generateStudyKit(extractedText);
    
    // Normalize Data (Ensure structure matches DB History format)
    const finalData = {
        summary: studyKit.summary || "No summary generated.",
        short: studyKit.short || [],
        medium: studyKit.medium || [],
        long: studyKit.long || [],
        pyq: studyKit.pyq || [],
        faq: studyKit.faq || []
    };

    res.json(finalData);

  } catch (error) {
    console.error("❌ Process Error:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    // Cleanup uploaded file
    if (filePath && fs.existsSync(filePath)) try { fs.unlinkSync(filePath); } catch(e) {}
  }
});

// Use Routes
app.use('/api/auth', authRoutes); 
app.use('/api/history', historyRoutes);

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on Port ${PORT}`));