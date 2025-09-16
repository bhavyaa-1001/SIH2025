const express = require('express');
const router = express.Router();
const runoffReportController = require('../controllers/runoff_report.controller');

// POST /api/runoff-report - Generate a runoff coefficient report
router.post('/', runoffReportController.generateReport);

module.exports = router;