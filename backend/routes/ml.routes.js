const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeRunoff } = require('../ml/analyze');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/ml-inputs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Endpoint to analyze data with ML model
router.post('/analyze', upload.single('roofImage'), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { latitude, longitude, roofArea, materialType, propertyType } = req.body;
    
    // Validate required inputs
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    // Call the analyze function from the ML module
    const analysisResult = await analyzeRunoff({ latitude, longitude });
    
    // Log the result for debugging
    console.log('Analysis result:', analysisResult);
    
    // Return the analysis result
    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Error in ML analysis:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;