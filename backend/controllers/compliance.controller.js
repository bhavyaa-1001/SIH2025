const { checkRAGCompliance, generateRAGReport } = require('../utils/ragComplianceChecker');
const Compliance = require('../models/compliance.model');
const Assessment = require('../models/assessment.model');
const asyncHandler = require('express-async-handler');

/**
 * Controller for compliance checking functionality
 */

// @desc    Check compliance with local regulations and save to database
// @route   POST /api/compliance/check
// @access  Private
const checkComplianceWithRegulations = asyncHandler(async (req, res) => {
  const { assessmentId, location } = req.body;
  
  if (!assessmentId || !location) {
    res.status(400);
    throw new Error('Assessment ID and location are required for compliance checking');
  }

  // Verify assessment exists and belongs to user
  const assessment = await Assessment.findOne({
    _id: assessmentId,
    user: req.user._id,
  });

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }
  
  // Check compliance using RAG-based compliance checker
  const complianceResults = checkRAGCompliance(req.body);
  
  // Generate detailed report with recommendations
  const detailedReport = generateRAGReport(complianceResults);
  
  // Create or update compliance record in database
  let compliance = await Compliance.findOne({ assessment: assessmentId });
  
  if (compliance) {
    // Update existing compliance record
    compliance = await Compliance.findByIdAndUpdate(
      compliance._id,
      {
        status: complianceResults.status || 'Pending',
        regulations: complianceResults.regulations || [],
        recommendations: complianceResults.recommendations || [],
        lastUpdated: Date.now(),
        notes: req.body.notes || compliance.notes,
      },
      { new: true }
    );
  } else {
    // Create new compliance record
    compliance = await Compliance.create({
      user: req.user._id,
      assessment: assessmentId,
      location,
      status: complianceResults.status || 'Pending',
      regulations: complianceResults.regulations || [],
      recommendations: complianceResults.recommendations || [],
      notes: req.body.notes || '',
    });
  }
  
  // Return compliance results with detailed report
  res.status(201).json({
    compliance,
    detailedReport
  });
});

// @desc    Generate a detailed compliance report
// @route   POST /api/compliance/report
// @access  Private
const generateDetailedReport = asyncHandler(async (req, res) => {
  const { complianceId } = req.body;
  
  if (!complianceId) {
    res.status(400);
    throw new Error('Compliance ID is required');
  }
  
  const compliance = await Compliance.findById(complianceId);
  
  if (!compliance) {
    res.status(404);
    throw new Error('Compliance record not found');
  }
  
  // Check if the compliance belongs to the logged in user
  if (compliance.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  // Generate report using RAG-based report generator
  const report = generateRAGReport(compliance);
  
  res.status(200).json({ report });
});

// @desc    Get all compliance records for a user
// @route   GET /api/compliance
// @access  Private
const getComplianceRecords = asyncHandler(async (req, res) => {
  const compliance = await Compliance.find({ user: req.user._id })
    .populate('assessment', 'location status')
    .sort({ createdAt: -1 });

  res.status(200).json(compliance);
});

// @desc    Get compliance record by ID
// @route   GET /api/compliance/:id
// @access  Private
const getComplianceById = asyncHandler(async (req, res) => {
  const compliance = await Compliance.findById(req.params.id)
    .populate('assessment', 'location status roofMaterial soilType');

  if (!compliance) {
    res.status(404);
    throw new Error('Compliance record not found');
  }

  // Check if the compliance belongs to the logged in user
  if (compliance.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json(compliance);
});

// @desc    Update compliance record
// @route   PUT /api/compliance/:id
// @access  Private
const updateCompliance = asyncHandler(async (req, res) => {
  const compliance = await Compliance.findById(req.params.id);

  if (!compliance) {
    res.status(404);
    throw new Error('Compliance record not found');
  }

  // Check if the compliance belongs to the logged in user
  if (compliance.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedCompliance = await Compliance.findByIdAndUpdate(
    req.params.id,
    { ...req.body, lastUpdated: Date.now() },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedCompliance);
});

// @desc    Delete compliance record
// @route   DELETE /api/compliance/:id
// @access  Private
const deleteCompliance = asyncHandler(async (req, res) => {
  const compliance = await Compliance.findById(req.params.id);

  if (!compliance) {
    res.status(404);
    throw new Error('Compliance record not found');
  }

  // Check if the compliance belongs to the logged in user
  if (compliance.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await compliance.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  checkComplianceWithRegulations,
  generateDetailedReport,
  getComplianceRecords,
  getComplianceById,
  updateCompliance,
  deleteCompliance
};