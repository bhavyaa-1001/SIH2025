const Assessment = require('../models/assessment.model');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs');
const sharp = require('sharp');
const { OpenAI } = require('@langchain/openai');
const { RetrievalQAChain } = require('langchain/chains');
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { TextLoader } = require('langchain/document_loaders/fs/text');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { FaissStore } = require('langchain/vectorstores/faiss');
const MultivariateLinearRegression = require('ml-regression-multivariate-linear');

// Basic CRUD operations

// @desc    Create a new assessment
// @route   POST /api/assessments
// @access  Private
const createAssessment = asyncHandler(async (req, res) => {
  const { location, roofArea, roofMaterial, soilType, groundwaterLevel } = req.body;

  if (!location || !roofArea || !roofMaterial || !soilType) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const assessment = await Assessment.create({
    user: req.user._id,
    location,
    roofArea,
    roofMaterial,
    soilType,
    groundwaterLevel: groundwaterLevel || 'medium',
  });

  if (assessment) {
    res.status(201).json(assessment);
  } else {
    res.status(400);
    throw new Error('Invalid assessment data');
  }
});

// @desc    Get all assessments for a user
// @route   GET /api/assessments
// @access  Private
const getAssessments = asyncHandler(async (req, res) => {
  const assessments = await Assessment.find({ user: req.user._id });
  res.status(200).json(assessments);
});

// @desc    Get a single assessment
// @route   GET /api/assessments/:id
// @access  Private
const getAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findById(req.params.id);

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  // Check if the assessment belongs to the logged-in user
  if (assessment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json(assessment);
});

// @desc    Update an assessment
// @route   PUT /api/assessments/:id
// @access  Private
const updateAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findById(req.params.id);

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  // Check if the assessment belongs to the logged-in user
  if (assessment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedAssessment = await Assessment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedAssessment);
});

// @desc    Delete an assessment
// @route   DELETE /api/assessments/:id
// @access  Private
const deleteAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findById(req.params.id);

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  // Check if the assessment belongs to the logged-in user
  if (assessment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await Assessment.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Assessment deleted' });
});

// Step 1 & 2: Baseline Assignment and AI/ML Refinement Layer
// @desc    Analyze roof image to calculate runoff coefficient
// @route   POST /api/assessments/analyze-roof
// @access  Private
const analyzeRoof = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a roof image');
  }

  const { roofMaterial, slope } = req.body;
  
  if (!roofMaterial) {
    res.status(400);
    throw new Error('Please provide roof material');
  }

  // Step 1: Baseline Assignment - Get standard runoff coefficient range
  const baselineCoefficients = {
    concrete: { min: 0.70, max: 0.80 },
    metal: { min: 0.85, max: 0.95 },
    asphalt: { min: 0.75, max: 0.85 },
    tile: { min: 0.65, max: 0.75 },
    gravel: { min: 0.50, max: 0.70 },
    green: { min: 0.10, max: 0.30 },
  };

  // Default to concrete if material not found
  const baselineRange = baselineCoefficients[roofMaterial.toLowerCase()] || baselineCoefficients.concrete;
  
  // Step 2: AI/ML Refinement Layer
  try {
    // Process image with sharp for analysis
    const imageBuffer = await sharp(req.file.path)
      .resize(224, 224) // Resize for model input
      .toBuffer();
    
    // Placeholder for actual CV model - in production would use TensorFlow.js
    // Here we simulate the analysis with some calculations
    
    // Extract image features (simulated)
    const imageFeatures = {
      contrast: Math.random() * 0.5 + 0.5, // Higher value means more contrast
      homogeneity: Math.random() * 0.7 + 0.3, // Higher value means more uniform
      entropy: Math.random() * 0.6 + 0.2, // Higher value means more complex/rough
    };
    
    // Adjust coefficient based on features
    let adjustedCoefficient = (baselineRange.min + baselineRange.max) / 2;
    
    // Adjust for slope if provided (higher slope = higher runoff)
    if (slope) {
      const slopeValue = parseFloat(slope);
      if (!isNaN(slopeValue)) {
        adjustedCoefficient += (slopeValue / 100) * 0.1; // Adjust up to 0.1 based on slope
      }
    }
    
    // Adjust for surface roughness (higher entropy = lower coefficient due to water trapping)
    adjustedCoefficient -= imageFeatures.entropy * 0.1;
    
    // Adjust for contrast (higher contrast might indicate cracks = lower coefficient)
    adjustedCoefficient -= imageFeatures.contrast * 0.05;
    
    // Ensure coefficient stays within valid range (0-1)
    adjustedCoefficient = Math.max(0, Math.min(1, adjustedCoefficient));
    
    // Round to 2 decimal places for cleaner output
    adjustedCoefficient = Math.round(adjustedCoefficient * 100) / 100;
    
    res.status(200).json({
      baselineRange,
      adjustedCoefficient,
      imageFeatures,
      message: 'Roof analysis completed successfully'
    });
  } catch (error) {
    console.error('Error analyzing roof:', error);
    res.status(500);
    throw new Error('Error processing roof image');
  }
});

// Step 3: Infiltration Rate Prediction
// @desc    Calculate infiltration rate based on soil and water conditions
// @route   POST /api/assessments/infiltration-rate
// @access  Private
const calculateInfiltrationRate = asyncHandler(async (req, res) => {
  const { soilType, soilProperties, groundwaterLevel, fieldTestResults } = req.body;
  
  if (!soilType) {
    res.status(400);
    throw new Error('Please provide soil type');
  }

  // Soil type base infiltration rates in mm/hr
  const baseInfiltrationRates = {
    sandy: { min: 20, max: 30 },
    loam: { min: 10, max: 20 },
    clay: { min: 1, max: 5 },
    silt: { min: 5, max: 10 },
    gravel: { min: 30, max: 50 },
  };

  // Default to clay if soil type not found (most conservative)
  const baseRate = baseInfiltrationRates[soilType.toLowerCase()] || baseInfiltrationRates.clay;
  
  // Start with average of min and max
  let infiltrationRate = (baseRate.min + baseRate.max) / 2;
  
  // Adjust for groundwater level if provided
  if (groundwaterLevel) {
    switch (groundwaterLevel.toLowerCase()) {
      case 'high':
        infiltrationRate *= 0.7; // Reduce by 30% for high water table
        break;
      case 'low':
        infiltrationRate *= 1.2; // Increase by 20% for low water table
        break;
      // 'medium' is default, no adjustment
    }
  }
  
  // Adjust for soil properties if provided
  if (soilProperties) {
    if (soilProperties.porosity) {
      // Higher porosity = higher infiltration
      infiltrationRate *= (1 + (soilProperties.porosity - 0.3) / 0.3);
    }
    
    if (soilProperties.permeability) {
      // Higher permeability = higher infiltration
      infiltrationRate *= (1 + (soilProperties.permeability - 0.5) / 0.5);
    }
  }
  
  // Use field test results if available (most accurate)
  if (fieldTestResults && fieldTestResults.doubleRingTest) {
    // Double Ring Infiltrometer test results override calculated values
    infiltrationRate = fieldTestResults.doubleRingTest;
  }
  
  // Ensure rate is within reasonable bounds
  infiltrationRate = Math.max(0.5, Math.min(100, infiltrationRate));
  
  // Round to 1 decimal place
  infiltrationRate = Math.round(infiltrationRate * 10) / 10;
  
  res.status(200).json({
    soilType,
    baseRate,
    infiltrationRate,
    unit: 'mm/hr',
    message: 'Infiltration rate calculated successfully'
  });
});

// Step 4: Recharge Potential Estimation
// @desc    Calculate recharge potential based on rainfall, roof area, and other factors
// @route   POST /api/assessments/recharge-potential
// @access  Private
const calculateRechargePotential = asyncHandler(async (req, res) => {
  const { annualRainfall, roofArea, runoffCoefficient, infiltrationFactor } = req.body;
  
  if (!annualRainfall || !roofArea || !runoffCoefficient) {
    res.status(400);
    throw new Error('Please provide annual rainfall, roof area, and runoff coefficient');
  }
  
  // Convert inputs to numbers
  const rainfall = parseFloat(annualRainfall);
  const area = parseFloat(roofArea);
  const coefficient = parseFloat(runoffCoefficient);
  const factor = infiltrationFactor ? parseFloat(infiltrationFactor) : 0.9; // Default 90% efficiency
  
  if (isNaN(rainfall) || isNaN(area) || isNaN(coefficient) || isNaN(factor)) {
    res.status(400);
    throw new Error('Invalid numerical inputs');
  }
  
  // Calculate recharge potential in liters
  // Formula: Annual Rainfall (mm) × Roof Area (m²) × Runoff Coefficient × Infiltration Factor
  // 1mm of rain on 1m² = 1 liter of water
  const rechargePotential = rainfall * area * coefficient * factor;
  
  // Round to nearest whole number
  const roundedPotential = Math.round(rechargePotential);
  
  res.status(200).json({
    annualRainfall: rainfall,
    roofArea: area,
    runoffCoefficient: coefficient,
    infiltrationFactor: factor,
    rechargePotential: roundedPotential,
    unit: 'liters/year',
    message: 'Recharge potential calculated successfully'
  });
});

// Step 5: Government Compliance via RAG Layer
// @desc    Check compliance with local regulations
// @route   POST /api/assessments/check-compliance
// @access  Private
const checkCompliance = asyncHandler(async (req, res) => {
  const { location, soilType, groundwaterLevel, rechargePotential, infiltrationRate } = req.body;
  
  if (!location) {
    res.status(400);
    throw new Error('Please provide location information');
  }
  
  try {
    // Simulated RAG process - in production would use actual document retrieval
    // and LLM processing with proper knowledge base
    
    // Mock knowledge base entries
    const mockRegulations = [
      {
        region: 'Delhi',
        rule: 'Central Ground Water Board mandates a minimum 1.5m deep recharge structure for all buildings with roof area >100m²',
        source: 'CGWB Guidelines 2020, Section 3.2'
      },
      {
        region: 'Maharashtra',
        rule: 'Bureau of Indian Standards requires minimum infiltration rate of 15mm/hr for effective groundwater recharge',
        source: 'BIS Code 16182:2014, Section 4.3'
      },
      {
        region: 'Karnataka',
        rule: 'State authority requires all buildings to harvest minimum 20 liters per sq.m of roof area annually',
        source: 'Karnataka Rainwater Harvesting Act, 2009, Rule 3(a)'
      }
    ];
    
    // Find relevant regulation based on location
    const relevantRegulation = mockRegulations.find(reg => 
      location.toLowerCase().includes(reg.region.toLowerCase())
    ) || mockRegulations[0]; // Default to Delhi if no match
    
    // Determine compliance status
    let isCompliant = true;
    let complianceDetails = '';
    
    if (location.toLowerCase().includes('delhi')) {
      // Check Delhi-specific compliance
      if (infiltrationRate < 10) {
        isCompliant = false;
        complianceDetails = 'Infiltration rate below CGWB minimum requirement of 10mm/hr';
      }
    } else if (location.toLowerCase().includes('maharashtra')) {
      // Check Maharashtra-specific compliance
      if (infiltrationRate < 15) {
        isCompliant = false;
        complianceDetails = 'Infiltration rate below BIS minimum requirement of 15mm/hr';
      }
    } else if (location.toLowerCase().includes('karnataka')) {
      // Check Karnataka-specific compliance
      if (rechargePotential < 20000) {
        isCompliant = false;
        complianceDetails = 'Recharge potential below Karnataka minimum requirement of 20,000 liters/year';
      }
    }
    
    // Generate compliance response
    res.status(200).json({
      isCompliant,
      regulation: relevantRegulation.rule,
      source: relevantRegulation.source,
      complianceDetails: complianceDetails || 'All requirements met',
      message: 'Compliance check completed successfully'
    });
    
  } catch (error) {
    console.error('Error checking compliance:', error);
    res.status(500);
    throw new Error('Error processing compliance check');
  }
});

// Step 6: Fine-Tuned RLHF-Based LLM (Personalization & Explanation Layer)
// This would be implemented in the frontend with API calls to OpenAI or similar service

// Step 7: Image/Diagram Generation
// This would be implemented in the frontend with API calls to Stable Diffusion or similar service

// Step 8: Final Multimodal Output
// This would be implemented in the frontend by combining all the outputs

module.exports = {
  createAssessment,
  getAssessments,
  getAssessment,
  updateAssessment,
  deleteAssessment,
  analyzeRoof,
  calculateInfiltrationRate,
  calculateRechargePotential,
  checkCompliance
};