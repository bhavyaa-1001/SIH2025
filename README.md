# Rainwater Harvesting Assessment System

## RAG-based Compliance Checking System

The RAG-based (Retrieval-Augmented Generation) compliance checking system is a key component of our rainwater harvesting assessment platform. It helps users ensure their rainwater harvesting system designs comply with local regulations and standards.

### Features

- **Location-based Regulation Retrieval**: Automatically identifies relevant regulations based on the user's location
- **Comprehensive Compliance Analysis**: Checks system specifications against multiple regulatory requirements
- **Detailed Compliance Reports**: Generates comprehensive reports highlighting compliant and non-compliant aspects
- **Actionable Recommendations**: Provides specific recommendations to address non-compliant elements
- **Visual Compliance Indicators**: Clear visual indicators showing compliance status for each regulation

### System Architecture

The compliance checking system consists of the following components:

1. **Knowledge Base**: Contains regulatory information from various regions and authorities
2. **Compliance Checker**: Core logic that evaluates system specifications against relevant regulations
3. **Report Generator**: Creates detailed compliance reports with recommendations
4. **Frontend Interface**: User-friendly interface for submitting system details and viewing results

### API Endpoints

#### Check Compliance

```
POST /api/compliance/check
```

Checks a rainwater harvesting system design against relevant regulations.

**Request Body:**
```json
{
  "location": "Delhi",
  "roofArea": 150,
  "infiltrationRate": 20,
  "rechargePotential": 3000,
  "systemSpecs": {
    "rechargePit": {
      "depth": 1.8,
      "diameter": 1.2
    }
  }
}
```

**Response:**
```json
{
  "isCompliant": true,
  "region": "Delhi",
  "results": [
    {
      "ruleId": "CGWB-2020-3.2",
      "text": "Central Ground Water Board mandates a minimum 1.5m deep recharge structure for all buildings with roof area >100m²",
      "source": "CGWB Guidelines 2020, Section 3.2",
      "compliant": true,
      "details": "Meets all requirements"
    },
    ...
  ],
  "summary": "Your rainwater harvesting system design is compliant with all applicable regulations. 3 requirements checked and passed."
}
```

#### Generate Detailed Report

```
POST /api/compliance/report
```

Generates a detailed compliance report based on compliance check results.

**Request Body:**
```json
{
  "complianceResults": {
    "isCompliant": false,
    "region": "Delhi",
    "results": [...]
  }
}
```

**Response:**
```json
{
  "report": "# Rainwater Harvesting Compliance Report\n\n## Summary\nYour rainwater harvesting system design does not meet 1 out of 3 regulatory requirements. Please review the details and make necessary adjustments.\n\n..."
}
```

### Frontend Component

The system includes a React component (`ComplianceChecker.jsx`) that provides a user-friendly interface for checking compliance. This component:

- Collects necessary system specifications from the user
- Submits data to the compliance checking API
- Displays results with clear visual indicators
- Shows detailed information about each regulation
- Provides recommendations for addressing non-compliant aspects

### Future Enhancements

- Integration with more regional and local regulations
- Machine learning-based recommendation system
- PDF export of compliance reports
- Integration with building permit application systems
- Real-time regulation updates