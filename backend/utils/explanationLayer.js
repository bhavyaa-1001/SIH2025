const { OpenAI } = require('@langchain/openai');
const fs = require('fs');
const path = require('path');

/**
 * LLM-based personalization and explanation layer for rainwater harvesting system
 * This module provides personalized recommendations and explanations based on user data
 */

// Configuration for OpenAI client
// In production, API key should be stored in environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-api-key-here';

// Initialize OpenAI client
let openai;
try {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    temperature: 0.7,
    maxTokens: 1000
  });
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
  // Fallback to template-based explanations if OpenAI initialization fails
}

/**
 * Generate personalized explanation for assessment results
 * @param {Object} assessmentData - Complete assessment data
 * @param {Object} userContext - User context information
 * @returns {Promise<Object>} Personalized explanation
 */
async function generatePersonalizedExplanation(assessmentData, userContext) {
  try {
    // Check if OpenAI client is available
    if (!openai || !OPENAI_API_KEY || OPENAI_API_KEY === 'your-api-key-here') {
      console.warn('OpenAI client not available, using template-based explanation');
      return generateTemplateExplanation(assessmentData, userContext);
    }
    
    // Prepare context for LLM
    const context = prepareContext(assessmentData, userContext);
    
    // Generate explanation using LLM
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Use appropriate model based on requirements
      messages: [
        {
          role: "system",
          content: `You are an expert in rainwater harvesting systems and water conservation. 
          Your task is to provide a personalized explanation of the assessment results 
          and recommendations for the user's specific context. Be informative, 
          educational, and encouraging. Focus on practical benefits and implementation steps.`
        },
        {
          role: "user",
          content: `Please provide a personalized explanation for my rainwater harvesting assessment results. 
          Here is the data: ${JSON.stringify(context)}`
        }
      ]
    });
    
    // Process and structure the response
    return processLLMResponse(response.choices[0].message.content, assessmentData);
    
  } catch (error) {
    console.error('Error generating personalized explanation:', error);
    // Fallback to template-based explanation
    return generateTemplateExplanation(assessmentData, userContext);
  }
}

/**
 * Prepare context for LLM from assessment data and user context
 * @param {Object} assessmentData - Complete assessment data
 * @param {Object} userContext - User context information
 * @returns {Object} Structured context for LLM
 */
function prepareContext(assessmentData, userContext) {
  // Extract relevant information from assessment data
  const {
    location,
    roofArea,
    runoffCoefficient,
    infiltrationRate,
    rechargePotential,
    complianceResults
  } = assessmentData;
  
  // Extract user context information
  const {
    userType, // homeowner, builder, government official, etc.
    technicalExpertise, // beginner, intermediate, expert
    primaryConcern, // water conservation, compliance, cost, etc.
    budget,
    propertyType
  } = userContext || {};
  
  // Create structured context
  return {
    assessment: {
      location,
      roofArea: `${roofArea} sq.m`,
      runoffCoefficient,
      infiltrationRate: `${infiltrationRate} mm/hr`,
      rechargePotential: `${rechargePotential} liters/year`,
      isCompliant: complianceResults?.isCompliant || 'unknown'
    },
    user: {
      userType: userType || 'homeowner',
      technicalExpertise: technicalExpertise || 'beginner',
      primaryConcern: primaryConcern || 'water conservation',
      budget: budget || 'moderate',
      propertyType: propertyType || 'residential'
    },
    regionalContext: {
      location,
      waterScarcityLevel: getWaterScarcityLevel(location),
      annualRainfall: getAnnualRainfall(location),
      regulatoryRequirements: complianceResults?.results || []
    }
  };
}

/**
 * Process LLM response and structure it for the application
 * @param {string} llmResponse - Raw response from LLM
 * @param {Object} assessmentData - Original assessment data
 * @returns {Object} Structured explanation
 */
function processLLMResponse(llmResponse, assessmentData) {
  // Basic structure for the explanation
  const explanation = {
    summary: '',
    benefits: [],
    implementation: [],
    maintenance: [],
    costSavings: '',
    environmentalImpact: ''
  };
  
  // Simple parsing of LLM response
  // In a production system, this would be more robust
  const sections = llmResponse.split('\n\n');
  
  // Extract summary (first paragraph)
  explanation.summary = sections[0];
  
  // Look for specific sections in the response
  sections.forEach(section => {
    if (section.toLowerCase().includes('benefit')) {
      const benefits = section.split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[\-\*]\s*/, ''));
      
      if (benefits.length > 0) {
        explanation.benefits = benefits;
      }
    }
    
    if (section.toLowerCase().includes('implement')) {
      const steps = section.split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim()))
        .map(line => line.replace(/^[\-\*\d\.]+\s*/, ''));
      
      if (steps.length > 0) {
        explanation.implementation = steps;
      }
    }
    
    if (section.toLowerCase().includes('maintenance')) {
      const maintenance = section.split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[\-\*]\s*/, ''));
      
      if (maintenance.length > 0) {
        explanation.maintenance = maintenance;
      }
    }
    
    if (section.toLowerCase().includes('cost') || section.toLowerCase().includes('saving')) {
      explanation.costSavings = section;
    }
    
    if (section.toLowerCase().includes('environment') || section.toLowerCase().includes('impact')) {
      explanation.environmentalImpact = section;
    }
  });
  
  // If we couldn't extract structured data, use the whole response as summary
  if (!explanation.benefits.length && !explanation.implementation.length) {
    explanation.summary = llmResponse;
  }
  
  return explanation;
}

/**
 * Generate template-based explanation when LLM is not available
 * @param {Object} assessmentData - Complete assessment data
 * @param {Object} userContext - User context information
 * @returns {Object} Template-based explanation
 */
function generateTemplateExplanation(assessmentData, userContext) {
  const {
    location,
    roofArea,
    runoffCoefficient,
    infiltrationRate,
    rechargePotential,
    complianceResults
  } = assessmentData;
  
  const userType = userContext?.userType || 'homeowner';
  const technicalExpertise = userContext?.technicalExpertise || 'beginner';
  
  // Basic template explanation
  const explanation = {
    summary: `Based on your ${roofArea} sq.m roof area in ${location}, your rainwater harvesting system can collect approximately ${rechargePotential} liters of water per year. This can significantly reduce your dependence on municipal water supply and help conserve groundwater resources.`,
    benefits: [
      'Reduces dependency on municipal water supply',
      'Helps in groundwater recharge',
      'Reduces water bills',
      'Environmentally sustainable practice',
      'Can improve quality of groundwater'
    ],
    implementation: [
      'Install gutters and downspouts to collect rainwater from your roof',
      'Connect downspouts to a first flush diverter to remove initial contaminants',
      'Direct water to storage tanks or recharge pits based on your needs',
      'Ensure proper filtration before storage or recharge',
      'Regular maintenance of the system components'
    ],
    maintenance: [
      'Clean gutters and downspouts regularly',
      'Check and clean filters monthly during rainy season',
      'Inspect storage tanks for leaks or cracks annually',
      'Clean storage tanks annually',
      'Ensure recharge pits are free from clogging'
    ],
    costSavings: `With an annual harvesting potential of ${rechargePotential} liters, you could save approximately ₹${Math.round(rechargePotential * 0.05)} per year on water bills (based on average municipal water rates).`,
    environmentalImpact: `Your rainwater harvesting system can help recharge groundwater and reduce urban flooding. By harvesting ${rechargePotential} liters annually, you're contributing to sustainable water management in your community.`
  };
  
  // Adjust explanation based on user type
  if (userType === 'builder' || userType === 'architect') {
    explanation.summary += ' Implementing this system will help meet regulatory requirements and enhance the property value.';
  } else if (userType === 'government official') {
    explanation.summary += ' This assessment demonstrates compliance with local regulations and contributes to sustainable urban water management.';
  }
  
  // Adjust explanation based on technical expertise
  if (technicalExpertise === 'expert') {
    explanation.implementation = explanation.implementation.map(step => step.replace(/simple terms/g, 'technical specifications'));
  } else if (technicalExpertise === 'beginner') {
    explanation.implementation = explanation.implementation.map(step => step.replace(/technical terms/g, 'simple language'));
  }
  
  return explanation;
}

/**
 * Get water scarcity level for a location
 * @param {string} location - User location
 * @returns {string} Water scarcity level
 */
function getWaterScarcityLevel(location) {
  // This would ideally be based on actual data
  // For now, using a simple mapping for demonstration
  const scarcityMap = {
    'delhi': 'Extreme',
    'rajasthan': 'Extreme',
    'maharashtra': 'High',
    'mumbai': 'High',
    'bangalore': 'High',
    'bengaluru': 'High',
    'chennai': 'High',
    'kerala': 'Low',
    'assam': 'Low',
    'meghalaya': 'Low'
  };
  
  const locationLower = location.toLowerCase();
  
  for (const [region, level] of Object.entries(scarcityMap)) {
    if (locationLower.includes(region)) {
      return level;
    }
  }
  
  return 'Moderate'; // Default
}

/**
 * Get annual rainfall for a location
 * @param {string} location - User location
 * @returns {string} Annual rainfall
 */
function getAnnualRainfall(location) {
  // This would ideally be based on actual meteorological data
  // For now, using a simple mapping for demonstration
  const rainfallMap = {
    'delhi': '600-800 mm',
    'rajasthan': '400-600 mm',
    'maharashtra': '2000-2500 mm',
    'mumbai': '2200 mm',
    'bangalore': '900 mm',
    'bengaluru': '900 mm',
    'chennai': '1400 mm',
    'kerala': '3000 mm',
    'assam': '2800 mm',
    'meghalaya': '11000 mm' // Cherrapunji, one of the wettest places on Earth
  };
  
  const locationLower = location.toLowerCase();
  
  for (const [region, rainfall] of Object.entries(rainfallMap)) {
    if (locationLower.includes(region)) {
      return rainfall;
    }
  }
  
  return '1100 mm'; // National average
}

/**
 * Generate a personalized recommendation certificate
 * @param {Object} assessmentData - Complete assessment data
 * @param {Object} userContext - User context information
 * @returns {Object} Certificate data
 */
function generateCertificate(assessmentData, userContext) {
  const {
    location,
    roofArea,
    runoffCoefficient,
    infiltrationRate,
    rechargePotential,
    complianceResults
  } = assessmentData;
  
  const isCompliant = complianceResults?.isCompliant || false;
  
  // Generate certificate data
  return {
    title: 'Rainwater Harvesting System Certificate',
    issuedTo: userContext?.name || 'Property Owner',
    location,
    assessmentDate: new Date().toISOString().split('T')[0],
    systemDetails: {
      roofArea: `${roofArea} sq.m`,
      runoffCoefficient,
      infiltrationRate: `${infiltrationRate} mm/hr`,
      rechargePotential: `${rechargePotential} liters/year`
    },
    complianceStatus: isCompliant ? 'Compliant' : 'Non-Compliant',
    recommendations: isCompliant ? 
      'Maintain the system as per guidelines to ensure continued compliance.' :
      'Please review the compliance report and make necessary adjustments to meet regulatory requirements.',
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0], // Valid for 2 years
    certificateId: generateCertificateId(location, roofArea)
  };
}

/**
 * Generate a unique certificate ID
 * @param {string} location - User location
 * @param {number} roofArea - Roof area
 * @returns {string} Certificate ID
 */
function generateCertificateId(location, roofArea) {
  const timestamp = Date.now().toString(36);
  const locationCode = location.substring(0, 3).toUpperCase();
  const areaCode = Math.round(roofArea).toString(36);
  
  return `RWH-${locationCode}-${areaCode}-${timestamp}`;
}

module.exports = {
  generatePersonalizedExplanation,
  generateCertificate
};