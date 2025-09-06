const express = require('express');
const router = express.Router();
const explanationController = require('../controllers/explanation.controller');

/**
 * Routes for personalized explanation and recommendations
 */

// Generate personalized explanation based on assessment data
router.post('/personalize', explanationController.personalizeExplanation);

// Get explanation history for a user
router.get('/history/:userId', explanationController.getExplanationHistory);

module.exports = router;