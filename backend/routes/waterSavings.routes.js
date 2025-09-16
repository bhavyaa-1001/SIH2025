const express = require('express');
const router = express.Router();
const {
  calculateWaterSavings,
  getWaterSavings,
  getWaterSavingsById,
  updateWaterSavings,
  deleteWaterSavings,
} = require('../controllers/waterSavings.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @route   POST /api/water-savings
 * @desc    Calculate and save water savings data
 * @access  Private
 */
router.post('/', protect, calculateWaterSavings);

/**
 * @route   GET /api/water-savings
 * @desc    Get all water savings calculations for a user
 * @access  Private
 */
router.get('/', protect, getWaterSavings);

/**
 * @route   GET /api/water-savings/:id
 * @desc    Get water savings calculation by ID
 * @access  Private
 */
router.get('/:id', protect, getWaterSavingsById);

/**
 * @route   PUT /api/water-savings/:id
 * @desc    Update water savings calculation
 * @access  Private
 */
router.put('/:id', protect, updateWaterSavings);

/**
 * @route   DELETE /api/water-savings/:id
 * @desc    Delete water savings calculation
 * @access  Private
 */
router.delete('/:id', protect, deleteWaterSavings);

module.exports = router;