const express = require('express');
const OpenAI = require('openai');
const axios = require('axios');
const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get movies and series data from Main App
async function getMoviesData() {
  try {
    const moviesResponse = await axios.get(`${process.env.MAIN_APP_API}/movies`);
    const seriesResponse = await axios.get(`${process.env.MAIN_APP_API}/series`);
    
    // Simplify the data to avoid token limits
    const movies = (moviesResponse.data || []).map(movie => ({
      title: movie.title,
      year: movie.year,
      genre: movie.genre,
      desc: movie.desc ? movie.desc.substring(0, 100) + '...' : 'No description'
    }));

    const series = (seriesResponse.data || []).map(serie => ({
      title: serie.title,
      year: serie.year,
      genre: serie.genre,
      desc: serie.desc ? serie.desc.substring(0, 100) + '...' : 'No description'
    }));
    
    return { movies, series };
  } catch (error) {
    console.error('Error fetching movies data:', error.message);
    return { movies: [], series: [] };
  }
}

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get current movies and series data
    const { movies, series } = await getMoviesData();

    // Create context about available content
    const contentContext = `
Available Movies and Series on ChooFlex:

Movies (${movies.length} total):
${movies.slice(0, 10).map(movie => `- ${movie.title} (${movie.year}) - ${movie.genre}`).join('\n')}
${movies.length > 10 ? `... and ${movies.length - 10} more movies` : ''}

Series (${series.length} total):
${series.slice(0, 10).map(serie => `- ${serie.title} (${serie.year}) - ${serie.genre}`).join('\n')}
${series.length > 10 ? `... and ${series.length - 10} more series` : ''}

You are an AI assistant for ChooFlex streaming platform. You know about all the movies and series available on the platform. 
You can speak in multiple languages (English, Arabic, French, Darija). Be helpful, friendly, and knowledgeable about the content.
You can recommend movies/series, answer questions about them, help users find what they're looking for, and chat naturally.
When users ask for specific titles, you can provide more detailed information if available.
`;

    // Build conversation messages
    const messages = [
      {
        role: 'system',
        content: contentContext
      },
      // Add conversation history
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      // Add current user message
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
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      tokensUsed: completion.usage
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'API quota exceeded. Please check your OpenAI billing.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error.message 
    });
  }
});

// Get conversation suggestions based on available content
router.get('/suggestions', async (req, res) => {
  try {
    const { movies, series } = await getMoviesData();
    
    const suggestions = [
      "What movies do you recommend?",
      "Show me action movies",
      "What series are available?",
      "Find me something to watch tonight",
      "What's popular right now?",
      "Recommend a comedy movie",
      "Show me drama series"
    ];

    // Add content-specific suggestions
    if (movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      suggestions.push(`Tell me about ${randomMovie.title}`);
    }

    if (series.length > 0) {
      const randomSeries = series[Math.floor(Math.random() * series.length)];
      suggestions.push(`What's ${randomSeries.title} about?`);
    }

    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ 
      error: 'Failed to get suggestions',
      details: error.message 
    });
  }
});

module.exports = router;
