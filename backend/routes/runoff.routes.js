const express = require('express');
const router = express.Router();
const runoffController = require('../controllers/runoff.controller');

// POST route to calculate runoff coefficient
router.post('/calculate', runoffController.calculateRunoffCoefficient);

module.exports = router;