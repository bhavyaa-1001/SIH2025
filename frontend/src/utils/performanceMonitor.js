/**
 * Performance monitoring utility for tracking and improving website performance
 */

// Store performance metrics
const metrics = {
  pageLoads: {},
  resourceLoads: {},
  interactions: {}
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  // Monitor page load performance
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance.timing;
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        const domReadyTime = timing.domComplete - timing.domLoading;
        
        metrics.pageLoads[window.location.pathname] = {
          pageLoadTime,
          domReadyTime,
          timestamp: new Date().toISOString()
        };
        
        // Log performance data
        console.log('Performance metrics:', metrics.pageLoads[window.location.pathname]);
      }, 0);
    });
  }

  // Monitor resource load performance
  if (window.performance && window.performance.getEntriesByType) {
    window.addEventListener('load', () => {
      const resources = window.performance.getEntriesByType('resource');
      
      resources.forEach(resource => {
        // Only track larger resources
        if (resource.transferSize > 50000) {
          metrics.resourceLoads[resource.name] = {
            transferSize: resource.transferSize,
            duration: resource.duration,
            timestamp: new Date().toISOString()
          };
        }
      });
    });
  }
};

// Track user interaction performance
export const trackInteraction = (interactionName, startTime) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  metrics.interactions[interactionName] = {
    duration,
    timestamp: new Date().toISOString()
  };
  
  return duration;
};

// Get all collected metrics
export const getPerformanceMetrics = () => {
  return metrics;
};

// Clear collected metrics
export const clearPerformanceMetrics = () => {
  metrics.pageLoads = {};
  metrics.resourceLoads = {};
  metrics.interactions = {};
};

export default {
  initPerformanceMonitoring,
  trackInteraction,
  getPerformanceMetrics,
  clearPerformanceMetrics
};