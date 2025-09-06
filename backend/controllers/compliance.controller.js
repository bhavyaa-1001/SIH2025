const { checkRAGCompliance, generateRAGReport } = require('../utils/ragComplianceChecker');

/**
 * Controller for compliance checking functionality
 */

// @desc    Check compliance with local regulations
// @route   POST /api/compliance/check
// @access  Public
const checkComplianceWithRegulations = async (req, res) => {
  try {
    const params = req.body;
    
    // Validate required parameters
    if (!params.location) {
      return res.status(400).json({ error: 'Location is required for compliance checking' });
    }
    
    // Check compliance using RAG-based compliance checker
    const complianceResults = checkRAGCompliance(params);
    
    // Generate detailed report with recommendations
    const detailedReport = generateRAGReport(complianceResults);
    
    // Return compliance results with detailed report
    res.json({
      ...complianceResults,
      detailedReport
    });
  } catch (error) {
    console.error('Compliance check error:', error);
    res.status(500).json({ error: error.message || 'Failed to check compliance' });
  }
};

// @desc    Generate a detailed compliance report
// @route   POST /api/compliance/report
// @access  Public
const generateDetailedReport = async (req, res) => {
  try {
    const { complianceResults } = req.body;
    
    if (!complianceResults) {
      return res.status(400).json({ error: 'Compliance results are required' });
    }
    
    // Generate report using RAG-based report generator
    const report = generateRAGReport(complianceResults);
    
    res.json({ report });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate compliance report' });
  }
};

module.exports = {
  checkComplianceWithRegulations,
  generateDetailedReport
};