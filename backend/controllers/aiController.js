// AI Controller - Analyze complaints using OpenRouter API with local fallback
const axios = require('axios');
const Complaint = require('../models/Complaint');
const { analyzeComplaintLocally } = require('../utils/localAIFallback');

// @desc    Analyze a complaint using AI
// @route   POST /api/ai/analyze
// @access  Private
const analyzeComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.body;

    // If complaintId is provided, fetch from DB; otherwise use request body
    let complaintData;
    if (complaintId) {
      const complaint = await Complaint.findById(complaintId);
      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      complaintData = complaint;
    } else {
      complaintData = req.body;
    }

    const { title, description, category, location, name } = complaintData;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required for analysis' });
    }

    let analysisResult;

    // Try OpenRouter API first
    if (process.env.OPENROUTER_API_KEY) {
      try {
        analysisResult = await analyzeWithOpenRouter({ title, description, category, location, name });
      } catch (apiError) {
        console.warn('⚠️ OpenRouter API failed, falling back to local analysis:', apiError.message);
        analysisResult = analyzeComplaintLocally({ title, description, category, location, name });
      }
    } else {
      // No API key configured, use local fallback
      console.log('ℹ️ No OpenRouter API key configured, using local fallback');
      analysisResult = analyzeComplaintLocally({ title, description, category, location, name });
    }

    // If complaint exists in DB, save the analysis results
    if (complaintId) {
      await Complaint.findByIdAndUpdate(complaintId, { aiAnalysis: analysisResult });
    }

    res.json({
      message: 'Complaint analyzed successfully',
      analysis: analysisResult,
    });
  } catch (error) {
    next(error);
  }
};

// Call OpenRouter API for AI analysis
async function analyzeWithOpenRouter({ title, description, category, location, name }) {
  const prompt = `You are an AI complaint analysis system for a municipal government. Analyze the following citizen complaint and return a JSON response.

Complaint Details:
- Title: ${title}
- Description: ${description}
- Category: ${category}
- Location: ${location}
- Submitted by: ${name || 'Anonymous'}

PRIORITY CLASSIFICATION RULES (follow strictly):
- "Critical": ONLY for immediate life-threatening danger (electrocution risk, building collapse, gas leak, active fire)
- "High": Urgent issues causing significant disruption (complete power outage, major water main break, road accidents)
- "Medium": Standard issues needing attention within days (potholes, irregular water supply, garbage not collected, broken streetlights)
- "Low": Minor inconveniences or improvement requests (cosmetic damage, noise complaints, suggestions, footpath tiles)

Most municipal complaints should be "Medium" or "High". Reserve "Critical" for genuine emergencies only.

Respond ONLY with a valid JSON object (no markdown, no code fences) with these exact keys:
{
  "priority": "Critical" or "High" or "Medium" or "Low",
  "department": "The most appropriate government department to handle this",
  "summary": "A concise 1-2 sentence summary of the complaint",
  "response": "A professional auto-generated response message to the citizen (2-3 paragraphs)"
}`;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    }
  );

  const content = response.data.choices[0].message.content.trim();
  const parsed = JSON.parse(content);

  return {
    priority: parsed.priority || 'Medium',
    department: parsed.department || 'General Administration',
    summary: parsed.summary || description.substring(0, 120),
    response: parsed.response || 'Your complaint has been received and is being processed.',
    source: 'ai',
  };
}

module.exports = { analyzeComplaint };
