const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const explanationController = require('../controllers/explanation.controller');

/**
 * Routes for personalized explanation and recommendations
 */

// Generate personalized explanation based on assessment data
router.post('/personalize', protect, explanationController.personalizeExplanation);

// Get explanation history for a user
router.get('/history/:userId', protect, explanationController.getExplanationHistory);

module.exports = router;