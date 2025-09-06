const Assessment = require('../models/assessment.model');
const User = require('../models/user.model');
const { generatePersonalizedExplanation } = require('../utils/explanationLayer');

/**
 * Controller for generating personalized explanations and recommendations
 * based on assessment data and user context using LLM
 */
const explanationController = {
  /**
   * Get personalized explanation for a specific assessment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} Personalized explanation
   */
  getPersonalizedExplanation: async (req, res) => {
    try {
      const assessmentId = req.params.assessmentId;
      
      if (!assessmentId) {
        return res.status(400).json({
          success: false,
          message: 'Assessment ID is required'
        });
      }

      // Find the assessment
      const assessment = await Assessment.findById(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }
      
      // Get user context
      const user = await User.findById(assessment.userId);
      const userContext = user ? {
        name: user.name,
        waterScarcity: user.preferences?.waterScarcity || 'medium',
        gardenArea: user.propertyDetails?.gardenArea || 0,
        waterRates: user.location?.waterRates || 0.02
      } : {};
      
      // Generate explanation if it doesn't exist
      if (!assessment.explanation || !assessment.explanation.generated) {
        const explanation = await generatePersonalizedExplanation(assessment, userContext);
        
        // Save the explanation to the assessment
        assessment.explanation = explanation;
        assessment.explanation.generated = true;
        await assessment.save();
      }
      
      return res.status(200).json({
        success: true,
        explanation: assessment.explanation
      });
    } catch (error) {
      console.error('Error getting personalized explanation:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get personalized explanation',
        error: error.message
      });
    }
  },
  /**
   * Generate personalized explanation and recommendations
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} Personalized explanation and recommendations
   */
  personalizeExplanation: async (req, res) => {
    try {
      const { assessmentData, userContext } = req.body;
      
      if (!assessmentData) {
        return res.status(400).json({ 
          success: false, 
          message: 'Assessment data is required' 
        });
      }

      // Extract key metrics from assessment data
      const {
        runoffCoefficient,
        infiltrationRate,
        rechargePotential,
        governmentCompliance,
        location,
        propertyType,
        roofArea,
        soilType,
        annualRainfall
      } = assessmentData;

      // Generate personalized explanation using the LLM-based explanation layer
      const explanation = await generatePersonalizedExplanation(assessmentData, userContext);

      // Generate compliance certificate if system is compliant
      let certificate = null;
      if (governmentCompliance && governmentCompliance.isCompliant) {
        certificate = generateCertificate({
          assessmentData,
          userContext
        });
      }

      // Log successful explanation generation
      console.log(`Generated personalized explanation for ${location} with ${propertyType} property`);

      return res.status(200).json({
        success: true,
        explanation,
        certificate
      });
    } catch (error) {
      console.error('Error generating personalized explanation:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate personalized explanation',
        error: error.message
      });
    }
  },

  /**
   * Get explanation history for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Array} List of previous explanations
   */
  getExplanationHistory: async (req, res) => {
    try {
      const userId = req.params.userId || req.user?.id;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      // Find assessments for this user that have explanations
      const assessments = await Assessment.find({
        userId,
        'explanation.generated': true
      }).select('explanation createdAt location propertyType');

      return res.status(200).json({
        success: true,
        explanations: assessments.map(assessment => ({
          id: assessment._id,
          date: assessment.createdAt,
          location: assessment.location,
          propertyType: assessment.propertyType,
          summary: assessment.explanation.summary
        }))
      });
    } catch (error) {
      console.error('Error fetching explanation history:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch explanation history',
        error: error.message
      });
    }
  }
};

/**
 * Generate personalized explanation based on assessment data
 * @param {Object} data - Assessment data and user context
 * @returns {Object} Structured explanation object
 */
const generateExplanation = (data) => {
  const {
    runoffCoefficient,
    infiltrationRate,
    rechargePotential,
    governmentCompliance,
    location,
    propertyType,
    roofArea,
    soilType,
    annualRainfall,
    userContext
  } = data;

  // Calculate potential water savings
  const potentialWaterCollection = calculateWaterCollection(roofArea, annualRainfall, runoffCoefficient);
  
  // Determine system type recommendation based on property and soil characteristics
  const systemType = determineSystemType(propertyType, soilType, infiltrationRate, rechargePotential);
  
  // Generate benefits based on user context and assessment data
  const benefits = generateBenefits(userContext, potentialWaterCollection, systemType, location);
  
  // Generate implementation steps based on system type
  const implementation = generateImplementationSteps(systemType, propertyType, soilType);
  
  // Generate maintenance tips
  const maintenance = generateMaintenanceTips(systemType, propertyType);
  
  // Calculate cost savings
  const costSavings = calculateCostSavings(potentialWaterCollection, location, userContext?.waterRates);
  
  // Calculate environmental impact
  const environmentalImpact = calculateEnvironmentalImpact(potentialWaterCollection, systemType);

  return {
    summary: `Based on your assessment, your property at ${location} with a roof area of ${roofArea} sq.m. and ${soilType} soil has excellent potential for rainwater harvesting. We recommend a ${systemType} system that could collect approximately ${potentialWaterCollection.toFixed(2)} liters of water annually.`,
    benefits,
    implementation,
    maintenance,
    costSavings,
    environmentalImpact,
    systemType,
    potentialWaterCollection
  };
};

/**
 * Generate compliance certificate
 * @param {Object} data - Assessment data and user context
 * @returns {Object} Certificate object
 */
const generateCertificate = (data) => {
  const { assessmentData, userContext } = data;
  
  // Generate a unique certificate ID
  const certificateId = `RWH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  
  // Set validity period (1 year from now)
  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);
  
  return {
    certificateId,
    issuedTo: userContext?.name || 'Property Owner',
    location: assessmentData.location,
    assessmentDate: new Date().toISOString().split('T')[0],
    complianceStatus: assessmentData.governmentCompliance.isCompliant ? 'Compliant' : 'Partially Compliant',
    validUntil: validUntil.toISOString().split('T')[0],
    recommendations: assessmentData.governmentCompliance.recommendations || 'Maintain the system as per guidelines.'
  };
};

/**
 * Calculate potential water collection based on roof area and rainfall
 * @param {Number} roofArea - Roof area in square meters
 * @param {Number} annualRainfall - Annual rainfall in mm
 * @param {Number} runoffCoefficient - Runoff coefficient
 * @returns {Number} Potential water collection in liters
 */
const calculateWaterCollection = (roofArea, annualRainfall, runoffCoefficient) => {
  // Formula: Roof area (sq.m) × Annual rainfall (mm) × Runoff coefficient
  return roofArea * annualRainfall * runoffCoefficient;
};

/**
 * Determine appropriate rainwater harvesting system type
 * @param {String} propertyType - Type of property
 * @param {String} soilType - Type of soil
 * @param {Number} infiltrationRate - Infiltration rate
 * @param {Number} rechargePotential - Recharge potential
 * @returns {String} Recommended system type
 */
const determineSystemType = (propertyType, soilType, infiltrationRate, rechargePotential) => {
  // Logic to determine system type based on property characteristics
  if (propertyType === 'Residential' && soilType === 'Sandy' && infiltrationRate > 15) {
    return 'Recharge Pit System';
  } else if (propertyType === 'Commercial' || roofArea > 200) {
    return 'Storage Tank System with Filtration';
  } else if (rechargePotential > 0.7) {
    return 'Combined Storage and Recharge System';
  } else {
    return 'Basic Rainwater Collection System';
  }
};

/**
 * Generate benefits based on user context and assessment data
 * @param {Object} userContext - User context information
 * @param {Number} potentialWaterCollection - Potential water collection
 * @param {String} systemType - Recommended system type
 * @param {String} location - Property location
 * @returns {Array} List of benefits
 */
const generateBenefits = (userContext, potentialWaterCollection, systemType, location) => {
  const benefits = [
    `Collect approximately ${potentialWaterCollection.toFixed(2)} liters of water annually`,
    'Reduce dependency on municipal water supply',
    'Contribute to groundwater recharge and environmental sustainability',
    'Comply with local rainwater harvesting regulations'
  ];

  // Add context-specific benefits
  if (userContext?.waterScarcity === 'high') {
    benefits.push('Ensure water availability during shortage periods');
  }

  if (userContext?.gardenArea > 0) {
    benefits.push('Provide chemical-free water for your garden');
  }

  if (systemType.includes('Storage')) {
    benefits.push('Store water for future use during dry periods');
  }

  return benefits;
};

/**
 * Generate implementation steps based on system type
 * @param {String} systemType - Recommended system type
 * @param {String} propertyType - Type of property
 * @param {String} soilType - Type of soil
 * @returns {Array} Implementation steps
 */
const generateImplementationSteps = (systemType, propertyType, soilType) => {
  const commonSteps = [
    'Install gutters and downspouts to collect roof runoff',
    'Add first flush diverter to remove initial contaminated runoff',
    'Implement mesh filters to prevent debris from entering the system'
  ];

  let specificSteps = [];

  switch (systemType) {
    case 'Recharge Pit System':
      specificSteps = [
        'Dig a recharge pit of appropriate dimensions based on your infiltration rate',
        'Layer the pit with gravel, sand, and boulders for natural filtration',
        'Connect downspouts to the recharge pit'
      ];
      break;
    case 'Storage Tank System with Filtration':
      specificSteps = [
        'Install appropriate sized storage tanks based on your collection potential',
        'Set up a multi-stage filtration system',
        'Connect overflow from storage to drainage or recharge pit'
      ];
      break;
    case 'Combined Storage and Recharge System':
      specificSteps = [
        'Install storage tanks for immediate use',
        'Create recharge structures for excess water',
        'Implement a distribution system with appropriate pumps if needed'
      ];
      break;
    default:
      specificSteps = [
        'Set up simple collection barrels at downspout locations',
        'Install basic filtration screens',
        'Create overflow mechanisms to prevent flooding'
      ];
  }

  return [...commonSteps, ...specificSteps];
};

/**
 * Generate maintenance tips based on system type
 * @param {String} systemType - Recommended system type
 * @param {String} propertyType - Type of property
 * @returns {Array} Maintenance tips
 */
const generateMaintenanceTips = (systemType, propertyType) => {
  const commonTips = [
    'Clean gutters and downspouts regularly, especially before monsoon season',
    'Inspect and clean filters monthly',
    'Check for and repair any leaks in the system'
  ];

  let specificTips = [];

  switch (systemType) {
    case 'Recharge Pit System':
      specificTips = [
        'Clean the silt trap before monsoon season',
        'Check for clogging in the recharge pit annually',
        'Maintain the surrounding area to prevent soil erosion'
      ];
      break;
    case 'Storage Tank System with Filtration':
      specificTips = [
        'Clean storage tanks annually',
        'Replace filter media as recommended by manufacturer',
        'Check and maintain pumps if installed'
      ];
      break;
    case 'Combined Storage and Recharge System':
      specificTips = [
        'Maintain both storage and recharge components regularly',
        'Check valves and distribution system quarterly',
        'Test water quality bi-annually if used for domestic purposes'
      ];
      break;
    default:
      specificTips = [
        'Empty and clean collection barrels between rainy seasons',
        'Check for mosquito breeding and use appropriate preventive measures',
        'Ensure overflow systems are working properly'
      ];
  }

  return [...commonTips, ...specificTips];
};

/**
 * Calculate cost savings based on water collection potential
 * @param {Number} potentialWaterCollection - Potential water collection in liters
 * @param {String} location - Property location
 * @param {Number} waterRates - Water rates in the area
 * @returns {String} Cost savings description
 */
const calculateCostSavings = (potentialWaterCollection, location, waterRates = 0.02) => {
  // Convert liters to kiloliters
  const kiloliters = potentialWaterCollection / 1000;
  
  // Calculate annual savings
  const annualSavings = kiloliters * waterRates * 1000; // Assuming waterRates is per liter
  
  return `Based on average water rates in your area, you could save approximately ₹${annualSavings.toFixed(2)} annually by harvesting rainwater. Over 5 years, this amounts to ₹${(annualSavings * 5).toFixed(2)} in savings.`;
};

/**
 * Calculate environmental impact
 * @param {Number} potentialWaterCollection - Potential water collection in liters
 * @param {String} systemType - Recommended system type
 * @returns {String} Environmental impact description
 */
const calculateEnvironmentalImpact = (potentialWaterCollection, systemType) => {
  // Calculate carbon footprint reduction
  // Assuming 0.5 kg CO2 saved per 1000 liters of water not drawn from municipal supply
  const carbonReduction = (potentialWaterCollection / 1000) * 0.5;
  
  let impact = `By harvesting ${potentialWaterCollection.toFixed(2)} liters of rainwater annually, you'll reduce your carbon footprint by approximately ${carbonReduction.toFixed(2)} kg of CO2 equivalent.`;
  
  if (systemType.includes('Recharge')) {
    impact += ' Additionally, your system will help replenish groundwater levels in your area, contributing to the overall water table health.';
  }
  
  return impact;
};

module.exports = explanationController;