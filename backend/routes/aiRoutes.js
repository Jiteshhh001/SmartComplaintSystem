// AI analysis routes
const express = require('express');
const router = express.Router();
const { analyzeComplaint } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ai/analyze - Analyze a complaint using AI
router.post('/analyze', protect, analyzeComplaint);

module.exports = router;
