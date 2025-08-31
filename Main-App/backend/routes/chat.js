const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize OpenAI only if API key is available (check at runtime)
    let openai = null;
    console.log('🔑 Checking OpenAI API Key at runtime...');
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);
    console.log('API Key starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-'));

    if (process.env.OPENAI_API_KEY && 
        process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' && 
        process.env.OPENAI_API_KEY !== 'your_actual_openai_api_key_here' &&
        process.env.OPENAI_API_KEY.startsWith('sk-')) {
      const OpenAI = require('openai');
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      console.log('✅ OpenAI initialized successfully');
    } else {
      console.log('❌ OpenAI not initialized - API key invalid or missing');
    }

    // Check if OpenAI is configured
    if (!openai) {
      return res.json({
        response: `مرحباً! أنا مساعد ChooFlex الذكي 🎬

أعتذر، خدمة الذكاء الاصطناعي غير متاحة حالياً لأن مفتاح OpenAI API غير مُعرَّف.

لتفعيل الذكاء الاصطناعي:
1. احصل على مفتاح API من OpenAI
2. أضف المفتاح في ملف .env: OPENAI_API_KEY=your_key_here

في الوقت الحالي، يمكنك تصفح مكتبة الأفلام والمسلسلات مباشرة! 🍿

Hi! I'm ChooFlex AI Assistant 🎬

Sorry, AI service is not available because OpenAI API key is not configured.

To enable AI:
1. Get an API key from OpenAI
2. Add it to .env file: OPENAI_API_KEY=your_key_here

For now, you can browse our movie and series library directly! 🍿`,
        timestamp: new Date().toISOString()
      });
    }

    // Get some movie data for context
    const movies = await Movie.find().limit(20);
    const movieTitles = movies.map(movie => movie.title).join(', ');

    // Prepare conversation history for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are ChooFlex AI, a helpful assistant for a Netflix-like streaming platform. You help users discover movies and TV series. You have access to our content library which includes: ${movieTitles}. Be friendly, helpful, and focus on movie/series recommendations. Respond in both Arabic and English when appropriate. Keep responses concise and engaging.`
      },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    if (error.status === 401) {
      return res.status(500).json({ 
        error: 'AI service configuration error. Please check API key.' 
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'AI service is busy. Please try again in a moment.' 
      });
    }

    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check for chat service
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'ChooFlex AI Chat',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
