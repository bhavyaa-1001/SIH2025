const express = require('express');
const router = express.Router();
const { checkComplianceWithRegulations, generateDetailedReport } = require('../controllers/compliance.controller');

/**
 * @route   POST /api/compliance/check
 * @desc    Check compliance with local regulations
 * @access  Public
 */
router.post('/check', checkComplianceWithRegulations);

/**
 * @route   POST /api/compliance/report
 * @desc    Generate a detailed compliance report
 * @access  Public
 */
router.post('/report', generateDetailedReport);

module.exports = router;