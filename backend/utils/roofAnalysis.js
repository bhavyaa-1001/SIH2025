const tf = require('@tensorflow/tfjs');
const sharp = require('sharp');

/**
 * Analyzes roof image to extract features for runoff coefficient calculation
 * @param {Buffer} imageBuffer - The buffer of the uploaded roof image
 * @param {Object} metadata - Additional metadata about the roof
 * @returns {Object} Extracted features and adjusted runoff coefficient
 */
async function analyzeRoofImage(imageBuffer, metadata) {
  try {
    // Process image with sharp for analysis
    const processedImage = await sharp(imageBuffer)
      .resize(224, 224) // Resize for model input
      .greyscale() // Convert to greyscale for texture analysis
      .raw() // Get raw pixel data
      .toBuffer();
    
    // Extract image features using computer vision techniques
    const imageFeatures = await extractImageFeatures(processedImage);
    
    // Get baseline runoff coefficient range based on roof material
    const baselineRange = getBaselineCoefficient(metadata.roofMaterial);
    
    // Calculate adjusted coefficient based on image features and metadata
    const adjustedCoefficient = calculateAdjustedCoefficient(
      baselineRange,
      imageFeatures,
      metadata
    );
    
    return {
      baselineRange,
      adjustedCoefficient,
      imageFeatures,
    };
  } catch (error) {
    console.error('Error analyzing roof image:', error);
    throw new Error('Failed to analyze roof image');
  }
}

/**
 * Extract texture features from the image using GLCM and FFT techniques
 * @param {Buffer} imageBuffer - Processed image buffer
 * @returns {Object} Extracted image features
 */
async function extractImageFeatures(imageBuffer) {
  // In a production environment, this would use TensorFlow.js or a similar library
  // to perform actual computer vision analysis
  
  // For this implementation, we'll simulate the feature extraction
  
  // Convert buffer to array for processing
  const pixelArray = new Uint8Array(imageBuffer);
  
  // Calculate basic statistics from pixel values
  let sum = 0;
  let sumSquared = 0;
  let min = 255;
  let max = 0;
  
  for (const pixel of pixelArray) {
    sum += pixel;
    sumSquared += pixel * pixel;
    min = Math.min(min, pixel);
    max = Math.max(max, pixel);
  }
  
  const mean = sum / pixelArray.length;
  const variance = (sumSquared / pixelArray.length) - (mean * mean);
  const stdDev = Math.sqrt(variance);
  
  // Calculate contrast (normalized)
  const contrast = (max - min) / 255;
  
  // Calculate homogeneity (simulated)
  // Higher values mean more uniform texture
  const homogeneity = 1 - (stdDev / 128);
  
  // Calculate entropy (simulated)
  // Higher values mean more complex/random texture
  // We'll use a function of variance as a proxy for entropy
  const entropy = Math.min(1, Math.log(1 + variance) / 10);
  
  return {
    contrast,
    homogeneity,
    entropy,
    mean,
    stdDev
  };
}

/**
 * Get baseline runoff coefficient range based on roof material
 * @param {string} roofMaterial - Type of roof material
 * @returns {Object} Min and max values for the baseline coefficient
 */
function getBaselineCoefficient(roofMaterial) {
  const baselineCoefficients = {
    concrete: { min: 0.70, max: 0.80 },
    metal: { min: 0.85, max: 0.95 },
    asphalt: { min: 0.75, max: 0.85 },
    tile: { min: 0.65, max: 0.75 },
    gravel: { min: 0.50, max: 0.70 },
    green: { min: 0.10, max: 0.30 },
    other: { min: 0.60, max: 0.80 } // Default for unknown materials
  };

  return baselineCoefficients[roofMaterial.toLowerCase()] || baselineCoefficients.other;
}

/**
 * Calculate adjusted runoff coefficient based on image features and metadata
 * @param {Object} baselineRange - Min and max values for the baseline coefficient
 * @param {Object} imageFeatures - Extracted features from the roof image
 * @param {Object} metadata - Additional metadata about the roof
 * @returns {number} Adjusted runoff coefficient
 */
function calculateAdjustedCoefficient(baselineRange, imageFeatures, metadata) {
  // Start with the middle of the baseline range
  let coefficient = (baselineRange.min + baselineRange.max) / 2;
  
  // Adjust for slope if provided (higher slope = higher runoff)
  if (metadata.roofSlope) {
    const slopeValue = parseFloat(metadata.roofSlope);
    if (!isNaN(slopeValue)) {
      // Adjust up to 0.1 based on slope (0-90 degrees)
      coefficient += (slopeValue / 90) * 0.1;
    }
  }
  
  // Adjust for surface roughness (higher entropy = lower coefficient due to water trapping)
  coefficient -= imageFeatures.entropy * 0.1;
  
  // Adjust for contrast (higher contrast might indicate cracks = lower coefficient)
  coefficient -= imageFeatures.contrast * 0.05;
  
  // Adjust for homogeneity (more uniform surface = higher coefficient)
  coefficient += imageFeatures.homogeneity * 0.05;
  
  // Adjust for age if provided (older roof = higher coefficient due to smoothing)
  if (metadata.roofAge) {
    const ageValue = parseFloat(metadata.roofAge);
    if (!isNaN(ageValue)) {
      // Adjust up to 0.05 based on age (0-30 years)
      coefficient += Math.min(ageValue, 30) / 30 * 0.05;
    }
  }
  
  // Ensure coefficient stays within valid range (0-1)
  coefficient = Math.max(0, Math.min(1, coefficient));
  
  // Round to 2 decimal places for cleaner output
  return Math.round(coefficient * 100) / 100;
}

module.exports = {
  analyzeRoofImage,
  getBaselineCoefficient,
  calculateAdjustedCoefficient
};