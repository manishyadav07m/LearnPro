require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");


const History = require('./models/History'); 
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const UPLOAD_DIR = path.resolve(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB Connected'))
  .catch(err => console.error(' DB Error:', err));


function cleanAndParseJSON(rawText) {
  let cleanText = rawText.replace(/```json|```/g, '').trim();
  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleanText = cleanText.substring(firstBrace, lastBrace + 1);
  }
  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error(" JSON Parse Failed. AI Output:", rawText);
    throw new Error("AI generated invalid JSON. Please try again.");
  }
}

// --- AI GENERATION ---
async function generateStudyKit(extractedText) {
  const apiKey = process.env.GEMINI_API_KEY;
  let currentModel = process.env.GEMINI_MODEL || "gemini-1.5-flash"; 
  
  const genAI = new GoogleGenerativeAI(apiKey);

  // UPDATED PROMPT: Forces AI to fill all categories
  const prompt = `
    You are an expert educational AI. Analyze the provided content and generate a study kit.
    
    INSTRUCTIONS:
    1. Generate a concise summary.
    2. Generate EXACTLY:
       - 5 Short Answer Questions (1-2 sentences)
       - 3 Medium Answer Questions (3-4 sentences)
       - 2 Long Essay Questions (Detailed paragraphs)
    
    OUTPUT JSON SCHEMA:
    {
      "summary": "...",
      "short": [{"q": "...", "a": "..."}],
      "medium": [{"q": "...", "a": "..."}],
      "long": [{"q": "...", "a": "..."}]
    }

    RULES:
    - Return ONLY valid JSON.
    - Do NOT return empty arrays for medium or long.
    - If content is short, extrapolate or ask conceptual questions to fill the requirements.
    
    CONTENT: 
    ${extractedText.substring(0, 15000)} 
  `;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(` AI Attempt ${attempt} (Model: ${currentModel})...`);
      
      const model = genAI.getGenerativeModel({ 
        model: currentModel,
        generationConfig: { responseMimeType: "application/json" }
      });

      const result = await model.generateContent(prompt);
      return cleanAndParseJSON(result.response.text());

    } catch (error) {
      console.warn(` Attempt ${attempt} failed: ${error.message}`);
      
      if (error.message.includes('429') || error.message.includes('503')) {
        console.log(" Switching to stable 'gemini-1.5-flash'...");
        currentModel = "gemini-1.5-flash";
        await new Promise(res => setTimeout(res, 2000));
      } else if (attempt === 3) {
        throw new Error(`Final AI Failure: ${error.message}`);
      }
    }
  }
}

// --- UPLOAD ROUTE ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  let filePath = null;
  try {
    let extractedText = "";
    const { youtubeUrl, textInput, userId, topicName } = req.body; 

    // 1. Extract Text
    if (youtubeUrl) {
      const transcriptItems = await YoutubeTranscript.fetchTranscript(youtubeUrl);
      extractedText = transcriptItems.map(item => item.text).join(' ');
    } else if (req.file) {
      filePath = path.resolve(req.file.path);
      if (req.file.mimetype === 'text/plain') {
        extractedText = fs.readFileSync(filePath, 'utf8');
      } else {
        const imageBuffer = fs.readFileSync(filePath);
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
        extractedText = text;
      }
    } else if (textInput) {
      extractedText = textInput;
    } else {
      return res.status(400).json({ error: "No content provided." });
    }

    if (!extractedText || extractedText.trim().length < 10) {
      throw new Error("Extracted text is too short or empty.");
    }

    console.log("🧠 Sending to AI...");
    const studyKit = await generateStudyKit(extractedText);
    
    // 2. Save to DB
    if (userId) {
      try {
        await History.create({
          userId: userId,
          topic: topicName || "Generated Study Kit",
          subject: "General",
          questions: studyKit
        });
        console.log(" History saved to DB for user:", userId);
      } catch (dbErr) {
        console.error(" Database Save Error:", dbErr.message);
      }
    }

    // 3. Send Response
    res.json({
        summary: studyKit.summary || "No summary generated.",
        short: studyKit.short || [],
        medium: studyKit.medium || [],
        long: studyKit.long || [],
        pyq: studyKit.pyq || [],
        faq: studyKit.faq || []
    });

  } catch (error) {
    console.error(" Process Error:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    if (filePath && fs.existsSync(filePath)) try { fs.unlinkSync(filePath); } catch(e) {}
  }
});

app.use('/api/auth', authRoutes); 
app.use('/api/history', historyRoutes);

app.listen(PORT, '0.0.0.0', () => console.log(` Server running on Port ${PORT}`));