const express = require('express');
const router = express.Router();
const { getRainfallPrediction } = require('../controllers/rainfall.controller');

router.post('/predict', getRainfallPrediction);

module.exports = router;