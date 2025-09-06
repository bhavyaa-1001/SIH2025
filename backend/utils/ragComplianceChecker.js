/**
 * RAG-based Compliance Checker Utility
 * 
 * This utility implements a Retrieval-Augmented Generation (RAG) approach
 * to check rainwater harvesting system compliance with local regulations.
 */

const fs = require('fs');
const path = require('path');

// Mock database of regulations (in production, this would be a proper database)
const regulationsDB = [
  {
    id: 'CGWB-2020-3.2',
    region: 'Delhi',
    text: 'Central Ground Water Board mandates a minimum 1.5m deep recharge structure for all buildings with roof area >100m²',
    source: 'CGWB Guidelines 2020, Section 3.2',
    checkFunction: (params) => {
      if (params.roofArea > 100 && 
          params.systemSpecs?.rechargePit?.depth >= 1.5) {
        return { compliant: true, details: 'Meets all requirements' };
      } else {
        return { 
          compliant: false, 
          details: 'Recharge pit depth must be at least 1.5m for roof areas greater than 100m²'
        };
      }
    }
  },
  {
    id: 'CGWB-2020-4.1',
    region: 'Delhi',
    text: 'Recharge pits must have a minimum diameter of 1m for effective groundwater recharge',
    source: 'CGWB Guidelines 2020, Section 4.1',
    checkFunction: (params) => {
      if (params.systemSpecs?.rechargePit?.diameter >= 1.0) {
        return { compliant: true, details: 'Meets minimum diameter requirement' };
      } else {
        return { 
          compliant: false, 
          details: 'Recharge pit diameter must be at least 1.0m'
        };
      }
    }
  },
  {
    id: 'NDMC-RWH-2019-5',
    region: 'Delhi',
    text: 'New Delhi Municipal Council requires all buildings with roof area >200m² to have a storage capacity of at least 2000L',
    source: 'NDMC Rainwater Harvesting Guidelines 2019, Section 5',
    checkFunction: (params) => {
      const estimatedStorageCapacity = params.systemSpecs?.storageCapacity || 
        (params.systemSpecs?.rechargePit?.depth * Math.PI * Math.pow(params.systemSpecs?.rechargePit?.diameter/2, 2) * 1000);
      
      if (params.roofArea <= 200 || estimatedStorageCapacity >= 2000) {
        return { compliant: true, details: 'Meets storage capacity requirements' };
      } else {
        return { 
          compliant: false, 
          details: 'Storage capacity must be at least 2000L for buildings with roof area >200m²'
        };
      }
    }
  },
  {
    id: 'MoHUA-2021-7.3',
    region: 'India',
    text: 'Ministry of Housing and Urban Affairs recommends a filtration system for all rainwater harvesting systems',
    source: 'MoHUA Urban Rainwater Harvesting Guidelines 2021, Section 7.3',
    checkFunction: (params) => {
      if (params.systemSpecs?.filtrationSystem) {
        return { compliant: true, details: 'Includes filtration system' };
      } else {
        return { 
          compliant: false, 
          details: 'A filtration system is recommended for all rainwater harvesting installations'
        };
      }
    }
  },
  {
    id: 'TNPCB-2018-4.2',
    region: 'Tamil Nadu',
    text: 'Tamil Nadu Pollution Control Board mandates rainwater harvesting for all buildings with roof area >60m²',
    source: 'TNPCB Guidelines 2018, Section 4.2',
    checkFunction: (params) => {
      if (params.roofArea <= 60 || 
          (params.systemSpecs?.rechargePit && params.infiltrationRate > 0)) {
        return { compliant: true, details: 'Meets mandatory harvesting requirements' };
      } else {
        return { 
          compliant: false, 
          details: 'Rainwater harvesting system is mandatory for buildings with roof area >60m²'
        };
      }
    }
  }
];

/**
 * Retrieves relevant regulations based on location
 * @param {string} location - User's location
 * @returns {Array} - Array of relevant regulations
 */
const retrieveRelevantRegulations = (location) => {
  // In a real RAG system, this would use embeddings and vector search
  // For this implementation, we'll use simple filtering
  
  // Get location-specific regulations
  const locationRegulations = regulationsDB.filter(reg => 
    reg.region.toLowerCase() === location.toLowerCase());
  
  // Get national regulations
  const nationalRegulations = regulationsDB.filter(reg => 
    reg.region.toLowerCase() === 'india');
  
  // Combine both sets of regulations
  return [...locationRegulations, ...nationalRegulations];
};

/**
 * Checks compliance of system parameters against relevant regulations
 * @param {Object} params - System parameters
 * @returns {Object} - Compliance results
 */
const checkRAGCompliance = (params) => {
  const { location } = params;
  
  if (!location) {
    throw new Error('Location is required for compliance checking');
  }
  
  // Retrieve relevant regulations
  const relevantRegulations = retrieveRelevantRegulations(location);
  
  // Check compliance against each regulation
  const results = relevantRegulations.map(regulation => {
    const result = regulation.checkFunction(params);
    
    return {
      ruleId: regulation.id,
      text: regulation.text,
      source: regulation.source,
      compliant: result.compliant,
      details: result.details
    };
  });
  
  // Determine overall compliance
  const isCompliant = results.every(result => result.compliant);
  
  // Generate summary
  const totalRules = results.length;
  const passedRules = results.filter(r => r.compliant).length;
  const summary = isCompliant
    ? `Your rainwater harvesting system design is compliant with all applicable regulations. ${passedRules} requirements checked and passed.`
    : `Your rainwater harvesting system design does not meet ${totalRules - passedRules} out of ${totalRules} regulatory requirements. Please review the details and make necessary adjustments.`;
  
  return {
    isCompliant,
    region: location,
    results,
    summary
  };
};

/**
 * Generates a detailed compliance report with recommendations
 * @param {Object} complianceResults - Results from compliance check
 * @returns {string} - Markdown formatted report
 */
const generateRAGReport = (complianceResults) => {
  if (!complianceResults || !complianceResults.results) {
    throw new Error('Valid compliance results are required');
  }
  
  const { isCompliant, region, results, summary } = complianceResults;
  
  // Generate report header
  let report = `# Rainwater Harvesting Compliance Report\n\n`;
  
  // Add summary section
  report += `## Summary\n${summary}\n\n`;
  
  // Add region information
  report += `## Region: ${region}\n\n`;
  
  // Add compliance status
  const statusEmoji = isCompliant ? '✅' : '❌';
  report += `## Overall Status: ${statusEmoji} ${isCompliant ? 'Compliant' : 'Non-Compliant'}\n\n`;
  
  // Add detailed results
  report += `## Detailed Results\n\n`;
  
  results.forEach(result => {
    const resultEmoji = result.compliant ? '✅' : '❌';
    report += `### ${resultEmoji} ${result.ruleId}\n\n`;
    report += `**Regulation:** ${result.text}\n\n`;
    report += `**Source:** ${result.source}\n\n`;
    report += `**Status:** ${result.compliant ? 'Compliant' : 'Non-Compliant'}\n\n`;
    report += `**Details:** ${result.details}\n\n`;
    
    // Add recommendations for non-compliant items
    if (!result.compliant) {
      report += `**Recommendation:** ${getRecommendation(result.ruleId)}\n\n`;
    }
  });
  
  // Add conclusion
  if (isCompliant) {
    report += `## Conclusion\n\nYour rainwater harvesting system design meets all applicable regulatory requirements. You may proceed with implementation.\n`;
  } else {
    report += `## Next Steps\n\nPlease address the non-compliant aspects of your design before proceeding with implementation. Once you've made the necessary adjustments, you can run another compliance check to verify that all requirements are met.\n`;
  }
  
  return report;
};

/**
 * Provides recommendations for non-compliant rules
 * @param {string} ruleId - ID of the rule
 * @returns {string} - Recommendation
 */
const getRecommendation = (ruleId) => {
  const recommendations = {
    'CGWB-2020-3.2': 'Increase the depth of your recharge pit to at least 1.5m to comply with CGWB guidelines.',
    'CGWB-2020-4.1': 'Increase the diameter of your recharge pit to at least 1.0m for effective groundwater recharge.',
    'NDMC-RWH-2019-5': 'Increase your storage capacity to at least 2000L or consider adding additional storage tanks.',
    'MoHUA-2021-7.3': 'Add a filtration system to your design. Simple options include mesh filters, sand filters, or first-flush diverters.',
    'TNPCB-2018-4.2': 'Implement a basic rainwater harvesting system with at least one recharge pit to comply with mandatory requirements.'
  };
  
  return recommendations[ruleId] || 'Review the specific requirements and adjust your system design accordingly.';
};

module.exports = {
  checkRAGCompliance,
  generateRAGReport
};