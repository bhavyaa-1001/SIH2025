const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Import assessment controller
const {
  createAssessment,
  getAssessments,
  getAssessment,
  updateAssessment,
  deleteAssessment,
  analyzeRoof,
  calculateInfiltrationRate,
  calculateRechargePotential,
  checkCompliance,
  generateReport
} = require('../controllers/assessment.controller');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/roofs');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Basic CRUD routes
router.route('/')
  .post(protect, createAssessment)
  .get(protect, getAssessments);

router.route('/:id')
  .get(protect, getAssessment)
  .put(protect, updateAssessment)
  .delete(protect, deleteAssessment);

// Analysis routes
router.post(
  '/analyze-roof',
  protect,
  upload.single('roofImage'),
  analyzeRoof
);

router.post(
  '/infiltration-rate',
  protect,
  calculateInfiltrationRate
);

router.post(
  '/recharge-potential',
  protect,
  calculateRechargePotential
);

router.post(
  '/check-compliance',
  protect,
  checkCompliance
);

// Download assessment report
router.get(
  '/:id/report',
  protect,
  generateReport
);

module.exports = router;