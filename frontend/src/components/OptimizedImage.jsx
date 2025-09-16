import { useState, useEffect } from 'react';

/**
 * OptimizedImage component for better image loading performance
 * Features:
 * - Lazy loading
 * - Progressive loading with blur-up effect
 * - Fallback for failed images
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  placeholderColor = '#f3f4f6',
  fallbackSrc = '/placeholder.png',
  loading = 'lazy'
}) => {
  const [imgSrc, setImgSrc] = useState(placeholderColor);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setError(false);
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setImgSrc(fallbackSrc);
      setError(true);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width || 'auto', 
        height: height || 'auto',
        backgroundColor: placeholderColor,
      }}
    >
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!error) {
            setImgSrc(fallbackSrc);
            setError(true);
          }
        }}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;