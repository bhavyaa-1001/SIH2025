const express = require('express');
const router = express.Router();
const { getAnnualRainfall } = require('../controllers/geospatial.controller');

// Defines the endpoint: GET /api/geospatial/rainfall
router.get('/rainfall', getAnnualRainfall);

module.exports = router;