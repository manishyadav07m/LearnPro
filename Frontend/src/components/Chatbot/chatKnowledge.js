// chatbotKnowledge.js - Education-Focused AI Assistant

// Education Keywords Database
export const educationKeywords = [
  // Subjects
  "math", "mathematics", "algebra", "geometry", "calculus", "statistics",
  "physics", "mechanics", "optics", "thermodynamics", "electromagnetism",
  "chemistry", "organic", "inorganic", "physical", "biochemistry",
  "biology", "botany", "zoology", "microbiology", "genetics",
  "computer", "programming", "coding", "java", "python", "javascript", "c++", "html", "css",
  "history", "geography", "economics", "business", "accountancy",
  "english", "hindi", "sanskrit", "language", "literature",
  "political", "science", "psychology", "sociology", "philosophy",
  
  // Education Terms
  "exam", "examination", "test", "quiz", "assessment", "evaluation",
  "syllabus", "curriculum", "course", "subject", "topic", "chapter",
  "study", "learn", "learning", "education", "academic", "academics",
  "school", "college", "university", "institute", "institution",
  "student", "teacher", "professor", "faculty", "mentor",
  "homework", "assignment", "project", "thesis", "dissertation",
  "grade", "marks", "score", "percentage", "cgpa", "gpa",
  "book", "textbook", "reference", "notes", "material", "resource",
  
  // Platform Specific
  "ailearnpro", "ai learn", "smart learning", "learning platform",
  "upload", "download", "generate", "question", "answer", "pdf",
  "dashboard", "progress", "track", "analytics", "performance",
  "register", "login", "signup", "account", "profile",
  "free", "premium", "pro", "plan", "pricing", "cost",
  "feature", "tool", "application", "software", "platform",
  
  // Exam Types
  "board", "cbse", "icse", "state board", "secondary", "higher secondary",
  "jee", "neet", "upsc", "gate", "cat", "gre", "gmat", "ielts", "toefl",
  "engineering", "medical", "law", "ca", "cs", "cma",
  "entrance", "competitive", "admission", "scholarship",
  
  // Study Methods
  "practice", "revision", "memorize", "understand", "concept",
  "theory", "practical", "numerical", "problem", "solve",
  "essay", "paragraph", "short note", "long answer", "mcq",
  "diagram", "graph", "chart", "table", "figure",
  "formula", "equation", "definition", "principle", "law",
  
  // Time & Planning
  "schedule", "timetable", "routine", "plan", "strategy",
  "time", "duration", "hours", "minutes", "days", "weeks", "months",
  "deadline", "submission", "due", "date",
  
  // Technical Education
  "engineering", "technology", "diploma", "degree", "bachelor", "master", "phd",
  "it", "information technology", "software", "hardware", "network",
  "data", "science", "analysis", "machine learning", "ai", "artificial intelligence",
  "web", "development", "mobile", "app", "application",
  "database", "sql", "nosql", "cloud", "cybersecurity"
];

// Check if message is education-related
export const isEducationRelated = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Always respond to platform-related queries
  if (lowerMessage.includes('ailearnpro') || 
      lowerMessage.includes('ai learn') ||
      lowerMessage.includes('learning platform')) {
    return true;
  }
  
  // Check against education keywords
  return educationKeywords.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
};

// Platform Knowledge Base
export const platformKnowledge = {
  // Basic Info
  basics: {
    name: "AI LearnPro",
    tagline: "Smart Learning Platform",
    description: "AI-powered platform for generating exam questions from syllabus, helping students study smarter.",
    founder: "Team of educators and developers passionate about revolutionizing education"
  },
  
  // Core Features
  features: [
    {
      name: "Syllabus Upload",
      description: "Upload PDF/DOC/text or paste syllabus content",
      details: "Supports multiple formats, OCR for images, text extraction"
    },
    {
      name: "Question Generation",
      description: "AI generates Short (1-2), Medium (3-5), Long (6-10) marks questions",
      details: "Balanced mix, answer keys, difficulty adjustment"
    },
    {
      name: "PDF Download",
      description: "Download generated questions in customizable PDF format",
      details: "Multiple layouts, answer space, bookmarks, print-ready"
    },
    {
      name: "Progress Tracking",
      description: "Dashboard with analytics and performance metrics",
      details: "Subject-wise progress, weak areas, improvement tracking"
    }
  ],
  
  // Subjects Supported
  subjects: {
    science: ["Physics", "Chemistry", "Biology", "Mathematics"],
    commerce: ["Accountancy", "Business Studies", "Economics", "Statistics"],
    arts: ["History", "Geography", "Political Science", "Psychology", "Sociology"],
    languages: ["English", "Hindi", "Sanskrit", "Regional Languages"],
    professional: ["Computer Science", "Engineering", "Medical", "Law", "CA"]
  },
  
  // Pricing
  pricing: {
    free: {
      name: "Free Plan",
      price: "₹0",
      features: ["50 questions/month", "Basic PDF", "Community support"]
    },
    pro: {
      name: "Pro Plan", 
      price: "₹499/month",
      features: ["Unlimited questions", "Advanced PDF", "Priority support", "No ads"]
    }
  }
};

// Intelligent Response Generator - Education Focused
export const getAIResponse = (userMessage) => {
  const message = userMessage.toLowerCase().trim();
  
  // First check if it's education related
  if (!isEducationRelated(message)) {
    return `**I specialize in education and learning topics!** 📚\n\nI notice your question isn't directly related to education. As the **AI LearnPro Assistant**, I can help you with:\n\n🎓 **Education Topics:**\n• Subject queries (Math, Science, Languages)\n• Exam preparation guidance\n• Study techniques and tips\n• Syllabus and curriculum help\n\n🚀 **Platform Features:**\n• How to use AI LearnPro\n• Syllabus upload process\n• Question generation\n• PDF download\n• Progress tracking\n\nPlease ask me about **education, learning, exams, or our platform features**! 😊`;
  }
  
  // =============== PLATFORM INTRODUCTION ===============
  if (message.includes('what is') && (message.includes('ailearnpro') || message.includes('ai learn'))) {
    return `**${platformKnowledge.basics.name}** - ${platformKnowledge.basics.tagline}\n\n${platformKnowledge.basics.description}\n\n**Core Purpose:**\n• Help students generate practice questions from syllabus\n• Provide AI-powered learning assistance\n• Make exam preparation more efficient\n• Track and improve academic performance\n\n**Founded by:** ${platformKnowledge.basics.founder}`;
  }
  
  // =============== FEATURES EXPLANATION ===============
  if (message.includes('feature') || message.includes('what can') || message.includes('capability')) {
    return `**AI LearnPro Features:**\n\n${platformKnowledge.features.map(f => 
      `**${f.name}:** ${f.description}\n${f.details}\n`
    ).join('\n')}\n\n**Platform Benefits:**\n• Save time on question creation\n• Get exam-focused practice material\n• Track learning progress\n• Access anytime, anywhere\n• Affordable learning solution`;
  }
  
  // =============== SUBJECTS SUPPORTED ===============
  if (message.includes('subject') || message.includes('course') || message.includes('stream')) {
    const subs = platformKnowledge.subjects;
    return `**Subjects Supported on AI LearnPro:**\n\n🔬 **Science Stream:**\n${subs.science.map(s => `• ${s}`).join('\n')}\n\n💼 **Commerce Stream:**\n${subs.commerce.map(s => `• ${s}`).join('\n')}\n\n🎨 **Arts/Humanities:**\n${subs.arts.map(s => `• ${s}`).join('\n')}\n\n🗣️ **Languages:**\n${subs.languages.map(s => `• ${s}`).join('\n')}\n\n👨‍💻 **Professional:**\n${subs.professional.map(s => `• ${s}`).join('\n')}\n\n**Total:** 20+ subjects with regular additions!`;
  }
  
  // =============== SYLLABUS UPLOAD ===============
  if (message.includes('upload') || message.includes('syllabus')) {
    return `**Syllabus Upload Process:**\n\n**Step-by-Step:**\n1. Login to your AI LearnPro account\n2. Go to Dashboard → Upload Syllabus\n3. **Choose method:**\n   a. **File Upload** (PDF/DOC/TXT/Image)\n   b. **Text Input** (Copy-paste content)\n   c. **Image Scan** (Photo of physical syllabus)\n4. Submit for AI processing\n5. Wait 2-5 minutes for analysis\n6. Review extracted topics\n7. Generate questions\n\n**Best Practices:**\n• Use structured syllabus with clear topics\n• Include chapter names and subtopics\n• Mention marks distribution if available\n• Ensure good quality for image uploads\n\n**File Specifications:**\n• Max size: 10MB\n• Formats: PDF, DOCX, TXT, JPG, PNG\n• Languages: English, Hindi`;
  }
  
  // =============== QUESTION TYPES ===============
  if (message.includes('question') || message.includes('type') || 
      message.includes('short') || message.includes('medium') || message.includes('long')) {
    return `**Question Types Generated:**\n\n📝 **SHORT ANSWER QUESTIONS (1-2 marks)**\n• **Purpose:** Basic recall, definitions\n• **Examples:**\n  - Define photosynthesis\n  - State Newton's First Law\n  - What is GDP?\n• **Answer length:** 1-2 lines\n• **Time required:** 1-2 minutes\n\n📝 **MEDIUM ANSWER QUESTIONS (3-5 marks)**\n• **Purpose:** Understanding, application\n• **Examples:**\n  - Explain water cycle with diagram\n  - Solve: 2x + 3 = 15\n  - Describe causes of French Revolution\n• **Answer length:** 5-10 lines\n• **Time required:** 5-10 minutes\n\n📝 **LONG ANSWER QUESTIONS (6-10 marks)**\n• **Purpose:** Analysis, evaluation\n• **Examples:**\n  - Essay on climate change impacts\n  - Complete numerical problem solving\n  - Critical analysis of literary text\n• **Answer length:** 15-25 lines\n• **Time required:** 15-20 minutes\n\n**AI ensures balanced distribution of all types!**`;
  }
  
  // =============== PDF DOWNLOAD ===============
  if (message.includes('pdf') || message.includes('download') || message.includes('print')) {
    return `**PDF Download Features:**\n\n**Options Available:**\n1. **Questions Only** - For practice sessions\n2. **Questions with Answers** - For study reference\n3. **Separate Answer Key** - For self-assessment\n\n**Customization:**\n• **Page Size:** A4, Letter, A5\n• **Font Size:** Small, Medium, Large\n• **Layout:** Single/Two columns\n• **Include:** Page numbers, Header/Footer\n• **Add:** Student name, Date, Institution\n\n**Special Features:**\n✅ Space for writing answers\n✅ Bookmark enabled\n✅ Searchable text\n✅ Table of contents\n✅ High print quality\n✅ Answer key separate\n\n**Process:** Generate → Customize → Download → Print/Study!`;
  }
  
  // =============== STUDY GUIDANCE ===============
  if (message.includes('study') || message.includes('learn') || message.includes('prepare') || 
      message.includes('padhai') || message.includes('पढ़ाई')) {
    
    // Subject-specific study tips
    if (message.includes('math') || message.includes('गणित')) {
      return `**Mathematics Study Guide:**\n\n📐 **Key Strategies:**\n1. **Practice Daily** - Minimum 10 problems daily\n2. **Understand Concepts** - Don't just memorize formulas\n3. **Step-by-Step Solving** - Show complete working\n4. **Formula Revision** - Regular formula practice\n5. **Mock Tests** - Time-bound practice\n\n🎯 **Using AI LearnPro for Math:**\n• Upload math syllabus with chapters\n• Get numerical problems of varying difficulty\n• Practice short calculation questions\n• Download PDFs for offline practice\n• Track progress in different math topics\n\n**Pro Tip:** Focus on weak areas identified in dashboard!`;
    }
    
    if (message.includes('science') || message.includes('विज्ञान')) {
      return `**Science Study Guide:**\n\n🔬 **Science Stream Tips:**\n**Physics:**\n• Understand concepts before numericals\n• Practice derivations regularly\n• Use diagrams for explanations\n\n**Chemistry:**\n• Learn periodic table trends\n• Practice chemical equations\n• Understand reaction mechanisms\n\n**Biology:**\n• Make flowcharts for processes\n• Practice diagram labeling\n• Memorize scientific terms\n\n🎯 **Using AI LearnPro for Science:**\n• Get subject-specific questions\n• Practice numerical problems (Physics/Chemistry)\n• Study diagrams and processes (Biology)\n• Download topic-wise question papers\n• Track subject-wise performance`;
    }
    
    if (message.includes('english') || message.includes('अंग्रेजी')) {
      return `**English Study Guide:**\n\n📖 **Key Areas:**\n1. **Grammar** - Tenses, prepositions, articles\n2. **Vocabulary** - New words daily, synonyms, antonyms\n3. **Comprehension** - Reading practice, inference\n4. **Writing** - Essays, letters, reports\n5. **Literature** - Text analysis, character study\n\n🎯 **Using AI LearnPro for English:**\n• Upload literature syllabus\n• Get comprehension passages with questions\n• Practice grammar exercises\n• Download essay topics\n• Get writing practice questions\n\n**Pro Tip:** Read daily and practice writing regularly!`;
    }
    
    // General study tips
    return `**Effective Study Strategies:**\n\n⏰ **Time Management:**\n• Study 2-3 hours daily with breaks\n• Morning hours for difficult subjects\n• Evening for revision\n• Weekly planning\n\n📚 **Study Techniques:**\n1. **Active Learning** - Explain concepts aloud\n2. **Spaced Repetition** - Regular revision\n3. **Practice Testing** - Self-assessment\n4. **Interleaving** - Mix different subjects\n5. **Elaboration** - Connect new with known\n\n🎯 **Using AI LearnPro:**\n• Generate practice questions regularly\n• Track progress in dashboard\n• Identify weak areas\n• Download PDFs for offline study\n• Set study goals\n\n**Success Formula:** Consistency + Smart Work = Results!`;
  }
  
  // =============== EXAM PREPARATION ===============
  if (message.includes('exam') || message.includes('test') || message.includes('परीक्षा')) {
    
    if (message.includes('board') || message.includes('cbse') || message.includes('icse')) {
      return `**Board Exam Preparation Guide:**\n\n📘 **CBSE/ICSE/State Board Strategy:**\n\n**3 Months Before Exam:**\n• Complete syllabus\n• Chapter-wise revision\n• Previous year papers\n\n**2 Months Before Exam:**\n• Topic-wise practice\n• Mock tests weekly\n• Weak area improvement\n\n**1 Month Before Exam:**\n• Full syllabus revision\n• Time-bound practice\n• Important question focus\n\n🎯 **AI LearnPro for Board Exams:**\n• Upload complete board syllabus\n• Get board-pattern questions\n• Practice marking scheme wise\n• Download sample papers\n• Track subject completion\n\n**Board Exam Tip:** Focus on NCERT/board textbooks!`;
    }
    
    if (message.includes('jee') || message.includes('neet')) {
      return `**JEE/NEET Preparation Guide:**\n\n🎯 **Competitive Exam Strategy:**\n\n**Foundation Phase:**\n• Strong basics\n• Concept clarity\n• Regular practice\n\n**Practice Phase:**\n• Numerical solving speed\n• MCQ practice\n• Time management\n\n**Revision Phase:**\n• Formula revision\n• Mock test analysis\n• Error reduction\n\n🎯 **AI LearnPro for JEE/NEET:**\n• Upload JEE/NEET syllabus\n• Get difficulty-level questions\n• Practice chapter-wise\n• Track progress analytics\n• Download topic-wise PDFs\n\n**Success Tip:** Quality practice over quantity!`;
    }
    
    return `**Exam Preparation Strategy:**\n\n📅 **Study Plan:**\n• **3+ months before:** Complete syllabus\n• **2 months before:** Practice and revision\n• **1 month before:** Mock tests\n• **Last week:** Quick revision\n\n📝 **Exam Day Strategy:**\n1. Read all questions first\n2. Start with confident sections\n3. Manage time per question\n4. Review answers if time\n5. Stay calm and focused\n\n🎯 **Using AI LearnPro:**\n• Generate exam-pattern questions\n• Practice time-bound tests\n• Download last-minute notes\n• Track preparation progress\n• Identify improvement areas\n\n**Remember:** Preparation + Confidence = Success!`;
  }
  
  // =============== PRICING & PLANS ===============
  if (message.includes('price') || message.includes('cost') || message.includes('plan') || 
      message.includes('free') || message.includes('paid') || message.includes('₹')) {
    const pricing = platformKnowledge.pricing;
    return `**AI LearnPro Pricing Plans:**\n\n🎯 **${pricing.free.name}** (${pricing.free.price})\nPerfect for trying out the platform:\n${pricing.free.features.map(f => `✓ ${f}`).join('\n')}\n\n🚀 **${pricing.pro.name}** (${pricing.pro.price})\nFor serious learners:\n${pricing.pro.features.map(f => `✓ ${f}`).join('\n')}\n\n**Comparison:**\n• Free: Limited questions, basic features\n• Pro: Unlimited, advanced features, priority\n\n**Recommendation:** Start with Free, upgrade to Pro when needed!`;
  }
  
  // =============== REGISTRATION & LOGIN ===============
  if (message.includes('register') || message.includes('signup') || message.includes('account') ||
      message.includes('login') || message.includes('sign in')) {
    return `**Account Process:**\n\n📝 **Registration:**\n1. Visit AI LearnPro website\n2. Click 'Sign Up'\n3. Enter email & password\n4. Verify email (OTP sent)\n5. Complete profile\n6. Start learning!\n\n🔐 **Login:**\n1. Click 'Log In'\n2. Enter credentials\n3. Access dashboard\n\n**Account Features:**\n• Save your syllabus\n• Track progress history\n• Download previous PDFs\n• Personalized recommendations\n• Performance analytics\n\n**Need Help?** Contact: support@ailearnpro.com`;
  }
  
  // =============== TECHNICAL HELP ===============
  if (message.includes('error') || message.includes('problem') || message.includes('issue') ||
      message.includes('not working') || message.includes('trouble')) {
    return `**Common Issues & Solutions:**\n\n🔄 **Upload Problems:**\n• File too large? Compress or split\n• Format not supported? Convert to PDF\n• Slow upload? Check internet\n\n⏳ **Generation Delay:**\n• Large syllabus = more time (5-10 mins)\n• Server busy? Try after few minutes\n• Processing stuck? Refresh page\n\n📄 **PDF Issues:**\n• Not downloading? Check browser settings\n• Format errors? Use Chrome/Firefox\n• Missing content? Regenerate\n\n🔐 **Account Issues:**\n• Forgot password? Use 'Reset Password'\n• Login failed? Check credentials\n• Account locked? Contact support\n\n**Still having trouble?** Email: support@ailearnpro.com`;
  }
  
  // =============== CONTACT & SUPPORT ===============
  if (message.includes('contact') || message.includes('email') || message.includes('support') ||
      message.includes('help') || message.includes('helpline')) {
    return `**AI LearnPro Support:**\n\n📧 **Email:** support@ailearnpro.com\n⏰ **Hours:** 10 AM - 6 PM (Mon-Sat)\n📍 **Based in:** Delhi NCR, India\n\n**Support Channels:**\n1. **Email Support** - Detailed queries\n2. **Help Center** - Articles & guides\n3. **FAQ Section** - Common questions\n4. **Community Forum** - Peer help\n\n**Response Time:**\n• Email: Within 24 hours\n• Urgent: Mark as 'URGENT'\n• Weekends: Limited support\n\n**For Technical Issues:** Include screenshots and error details!`;
  }
  
  // =============== GREETINGS ===============
  if (message.includes('hi') || message.includes('hello') || message.includes('hey') || 
      message === 'hii' || message.includes('नमस्ते') || message.includes('हैलो')) {
    return `Hello! 👋 Welcome to **AI LearnPro Assistant**!\n\nI'm here to help you with **education and learning** using our AI-powered platform.\n\n**I can assist with:**\n📚 **Subjects:** Math, Science, Languages, Commerce, Arts\n🎯 **Exams:** Board, JEE, NEET, Competitive exams\n📝 **Study:** Techniques, planning, preparation\n🚀 **Platform:** How to use AI LearnPro features\n🔧 **Technical:** Issues, troubleshooting\n\n**Ask me anything about education or using our platform!** 😊\n\nTry: "How to study math effectively?" or "How to upload syllabus?"`;
  }
  
  if (message.includes('thank') || message.includes('thanks') || message.includes('धन्यवाद')) {
    return `You're welcome! 😊\n\nI'm glad I could help with your education query. Remember, **consistent learning with AI LearnPro** can significantly improve your academic performance.\n\nKeep studying smart! 📚🎯\n\nNeed more help? Just ask!`;
  }
  
  if (message.includes('bye') || message.includes('goodbye') || message.includes('अलविदा')) {
    return `Goodbye! 👋\n\n**Study Tip:** Regular practice with AI LearnPro generated questions can boost your exam performance!\n\nCome back anytime for education-related help. Best of luck! 🌟`;
  }
  
  // =============== SUBJECT-SPECIFIC QUERIES ===============
  // Check for any subject mentioned
  const allSubjects = [
    ...platformKnowledge.subjects.science,
    ...platformKnowledge.subjects.commerce,
    ...platformKnowledge.subjects.arts,
    ...platformKnowledge.subjects.languages,
    ...platformKnowledge.subjects.professional
  ];
  
  const mentionedSubject = allSubjects.find(subject => 
    message.includes(subject.toLowerCase())
  );
  
  if (mentionedSubject) {
    return `**${mentionedSubject} Learning Guide:**\n\n**Using AI LearnPro for ${mentionedSubject}:**\n1. Upload ${mentionedSubject} syllabus\n2. Get chapter-wise questions\n3. Practice regularly\n4. Track ${mentionedSubject} progress\n5. Download ${mentionedSubject} question PDFs\n\n**Study Tips for ${mentionedSubject}:**\n• Make detailed notes\n• Practice numerical/theory as applicable\n• Revise regularly\n• Solve previous year questions\n• Focus on important topics\n\n**Need specific ${mentionedSubject} syllabus format guidance?**`;
  }
  
  // =============== DEFAULT INTELLIGENT RESPONSE ===============
  // For any other education-related query
  return `**Education Focused Response:**\n\nI understand you're asking about an **education-related topic**. Here's how I can help:\n\n🎓 **If it's about a specific subject:**\nI can provide study tips, important topics, and how to use AI LearnPro for that subject.\n\n📚 **If it's about study methods:**\nI can suggest effective learning techniques, time management, and exam strategies.\n\n🎯 **If it's about exams:**\nI can guide on preparation, important topics, time management, and practice.\n\n🚀 **If it's about AI LearnPro:**\nI can explain features, how to use, pricing, and technical help.\n\n**Please be more specific** or ask about:\n• "How to study [subject] effectively?"\n• "Exam preparation tips for [exam]"\n• "How to use AI LearnPro for [purpose]"\n• "Study techniques for better learning"`;
};

// Quick responses for common education queries
export const getQuickResponse = (type) => {
  const responses = {
    math: "**Math Study:** Practice daily, understand concepts, use AI LearnPro for numerical problems.",
    science: "**Science:** Combine theory with practical understanding, use diagrams, practice regularly.",
    english: "**English:** Read daily, practice writing, learn new words, use grammar exercises.",
    exam: "**Exams:** Start early, practice previous papers, time management, regular revision.",
    upload: "**Upload:** PDF/DOC/text formats, 10MB max, 2-5 minutes processing time.",
    download: "**PDF:** Customizable format, questions+answers, print-ready, multiple layouts."
  };
  return responses[type] || "I can help with education topics, study methods, exam prep, and AI LearnPro features!";
};