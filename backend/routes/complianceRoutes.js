const express = require('express');
const router = express.Router();
const {
  checkComplianceWithRegulations,
  generateDetailedReport,
  getComplianceRecords,
  getComplianceById,
  updateCompliance,
  deleteCompliance
} = require('../controllers/compliance.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @route   POST /api/compliance/check
 * @desc    Check compliance with local regulations
 * @access  Private
 */
router.post('/check', protect, checkComplianceWithRegulations);

/**
 * @route   POST /api/compliance/report
 * @desc    Generate a detailed compliance report
 * @access  Private
 */
router.post('/report', protect, generateDetailedReport);

/**
 * @route   GET /api/compliance
 * @desc    Get all compliance records for a user
 * @access  Private
 */
router.get('/', protect, getComplianceRecords);

/**
 * @route   GET /api/compliance/:id
 * @desc    Get compliance record by ID
 * @access  Private
 */
router.get('/:id', protect, getComplianceById);

/**
 * @route   PUT /api/compliance/:id
 * @desc    Update compliance record
 * @access  Private
 */
router.put('/:id', protect, updateCompliance);

/**
 * @route   DELETE /api/compliance/:id
 * @desc    Delete compliance record
 * @access  Private
 */
router.delete('/:id', protect, deleteCompliance);

module.exports = router;