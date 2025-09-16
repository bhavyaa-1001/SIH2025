const WaterSavings = require('../models/waterSavings.model');
const Assessment = require('../models/assessment.model');
const asyncHandler = require('express-async-handler');

// @desc    Calculate and save water savings data
// @route   POST /api/water-savings
// @access  Private
const calculateWaterSavings = asyncHandler(async (req, res) => {
  const { assessmentId, roofArea, annualRainfall, runoffCoefficient, waterPrice, householdSize } = req.body;

  if (!assessmentId || !roofArea || !annualRainfall) {
    res.status(400);
    throw new Error('Please provide all required fields');
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

  // Calculate potential water collection in liters
  // Formula: Roof Area (m²) × Annual Rainfall (mm) × Runoff Coefficient × 0.001
  const potentialCollection = roofArea * annualRainfall * (runoffCoefficient || 0.8) * 0.001;
  
  // Calculate financial savings
  const financialSavings = potentialCollection * (waterPrice || 0.002);
  
  // Calculate water self-sufficiency percentage
  // Average person uses ~150L per day
  const annualHouseholdUsage = (householdSize || 4) * 150 * 365;
  const selfSufficiencyPercentage = Math.min(100, (potentialCollection / annualHouseholdUsage) * 100);
  
  // Calculate environmental impact (CO2 reduction in kg)
  // Approx 0.3 kg CO2 per 1000L of water
  const environmentalImpact = (potentialCollection / 1000) * 0.3;

  const waterSavings = await WaterSavings.create({
    user: req.user._id,
    assessment: assessmentId,
    roofArea,
    annualRainfall,
    runoffCoefficient: runoffCoefficient || 0.8,
    potentialCollection: Math.round(potentialCollection),
    financialSavings,
    selfSufficiencyPercentage,
    environmentalImpact,
    waterPrice: waterPrice || 0.002,
    householdSize: householdSize || 4,
    notes: req.body.notes || '',
  });

  if (waterSavings) {
    res.status(201).json(waterSavings);
  } else {
    res.status(400);
    throw new Error('Invalid water savings data');
  }
});

// @desc    Get all water savings calculations for a user
// @route   GET /api/water-savings
// @access  Private
const getWaterSavings = asyncHandler(async (req, res) => {
  const waterSavings = await WaterSavings.find({ user: req.user._id })
    .populate('assessment', 'location status')
    .sort({ createdAt: -1 });

  res.status(200).json(waterSavings);
});

// @desc    Get water savings calculation by ID
// @route   GET /api/water-savings/:id
// @access  Private
const getWaterSavingsById = asyncHandler(async (req, res) => {
  const waterSavings = await WaterSavings.findById(req.params.id)
    .populate('assessment', 'location status roofMaterial soilType');

  if (!waterSavings) {
    res.status(404);
    throw new Error('Water savings calculation not found');
  }

  // Check if the water savings belongs to the logged in user
  if (waterSavings.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json(waterSavings);
});

// @desc    Update water savings calculation
// @route   PUT /api/water-savings/:id
// @access  Private
const updateWaterSavings = asyncHandler(async (req, res) => {
  const waterSavings = await WaterSavings.findById(req.params.id);

  if (!waterSavings) {
    res.status(404);
    throw new Error('Water savings calculation not found');
  }

  // Check if the water savings belongs to the logged in user
  if (waterSavings.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const { roofArea, annualRainfall, runoffCoefficient, waterPrice, householdSize } = req.body;

  // Recalculate values if input parameters are provided
  if (roofArea && annualRainfall) {
    // Calculate potential water collection in liters
    const potentialCollection = roofArea * annualRainfall * (runoffCoefficient || waterSavings.runoffCoefficient) * 0.001;
    
    // Calculate financial savings
    const financialSavings = potentialCollection * (waterPrice || waterSavings.waterPrice);
    
    // Calculate water self-sufficiency percentage
    const annualHouseholdUsage = (householdSize || waterSavings.householdSize) * 150 * 365;
    const selfSufficiencyPercentage = Math.min(100, (potentialCollection / annualHouseholdUsage) * 100);
    
    // Calculate environmental impact (CO2 reduction in kg)
    const environmentalImpact = (potentialCollection / 1000) * 0.3;

    // Update the calculation values
    req.body.potentialCollection = Math.round(potentialCollection);
    req.body.financialSavings = financialSavings;
    req.body.selfSufficiencyPercentage = selfSufficiencyPercentage;
    req.body.environmentalImpact = environmentalImpact;
  }

  const updatedWaterSavings = await WaterSavings.findByIdAndUpdate(
    req.params.id,
    { ...req.body, lastUpdated: Date.now() },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedWaterSavings);
});

// @desc    Delete water savings calculation
// @route   DELETE /api/water-savings/:id
// @access  Private
const deleteWaterSavings = asyncHandler(async (req, res) => {
  const waterSavings = await WaterSavings.findById(req.params.id);

  if (!waterSavings) {
    res.status(404);
    throw new Error('Water savings calculation not found');
  }

  // Check if the water savings belongs to the logged in user
  if (waterSavings.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await waterSavings.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  calculateWaterSavings,
  getWaterSavings,
  getWaterSavingsById,
  updateWaterSavings,
  deleteWaterSavings,
};