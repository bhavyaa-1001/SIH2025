import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Assessment API services
const assessmentService = {
  // Create a new assessment
  createAssessment: (assessmentData) => api.post('/assessments', assessmentData),
  
  // Get all assessments for the logged-in user
  getAssessments: () => api.get('/assessments'),
  
  // Get a specific assessment by ID
  getAssessment: (id) => api.get(`/assessments/${id}`),
  
  // Update an assessment
  updateAssessment: (id, assessmentData) => api.put(`/assessments/${id}`, assessmentData),
  
  // Delete an assessment
  deleteAssessment: (id) => api.delete(`/assessments/${id}`),
  
  // Analyze roof image
  analyzeRoof: (id, imageData) => {
    const formData = new FormData();
    formData.append('roofImage', imageData);
    return api.post(`/assessments/${id}/analyze-roof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Calculate infiltration rate
  calculateInfiltrationRate: (id, data) => api.post(`/assessments/${id}/infiltration`, data),
  
  // Calculate recharge potential
  calculateRechargePotential: (id, data) => api.post(`/assessments/${id}/recharge-potential`, data),
  
  // Check compliance status
  checkCompliance: (id) => api.get(`/assessments/${id}/compliance`),
  
  // Generate assessment report
  generateReport: (id) => api.get(`/assessments/${id}/report`),
};

// Compliance API services
const complianceService = {
  // Check compliance with local regulations
  checkComplianceWithRegulations: (data) => api.post('/compliance/check', data),
  
  // Generate detailed compliance report
  generateDetailedReport: (data) => api.post('/compliance/report', data),
};

// Explanation API services
const explanationService = {
  // Get personalized explanation
  personalizeExplanation: (data) => api.post('/explanation/personalize', data),
  
  // Get explanation history for a user
  getExplanationHistory: (userId) => api.get(`/explanation/history/${userId}`),
};

// Authentication API services
const authService = {
  // Register a new user
  register: (userData) => api.post('/users/register', userData),
  
  // Login user
  login: (credentials) => api.post('/users/login', credentials),
  
  // Get current user profile
  getProfile: () => api.get('/users/profile'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/users/profile', userData),
};

export { assessmentService, complianceService, explanationService, authService };