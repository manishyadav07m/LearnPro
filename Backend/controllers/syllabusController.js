const Tesseract = require('tesseract.js');
const { HfInference } = require('@huggingface/inference');
const Syllabus = require('../models/Syllabus');
const fs = require('fs');

const hf = new HfInference(process.env.HF_TOKEN);

exports.processSyllabus = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // 1. OCR Processing (Server-side)
    console.log(`Processing file: ${req.file.path}`);
    const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
    
    // Clean up uploaded file after OCR
    fs.unlinkSync(req.file.path);

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: "OCR failed. Text too short." });
    }

    // 2. AI Generation (Using Phi-3 for stability)
    const truncatedText = text.slice(0, 2500); // Limit for Free Tier
    
    const prompt = `
      Analyze this syllabus and return ONLY valid JSON.
      Structure: { "short": [{"q":"", "a":""}], "medium": [], "long": [], "pyq": [], "faq": [] }
      Do not use markdown.
      Syllabus: ${truncatedText}
    `;

    const aiResponse = await hf.chatCompletion({
      model: "microsoft/Phi-3-mini-4k-instruct",
      messages: [
        { role: "system", content: "You are a JSON-only API." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.1
    });

    // 3. Parse JSON
    let content = aiResponse.choices[0].message.content;
    content = content.replace(/```json|```/g, "").trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error("Invalid AI Response");
    
    const parsedQuestions = JSON.parse(jsonMatch[0]);

    // 4. Save to MongoDB
    const newSyllabus = new Syllabus({
      fileName: req.file.originalname,
      extractedText: text,
      questions: parsedQuestions
    });
    
    await newSyllabus.save();

    // 5. Send Response
    res.json(parsedQuestions);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};