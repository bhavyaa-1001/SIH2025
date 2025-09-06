// Animation variants for framer-motion
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 } 
  }
};

export const slideIn = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5 } 
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5 } 
  }
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// CSS animation classes
export const cssAnimations = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  bounceSlow: 'animate-bounce-slow',
  pulse: 'hover:scale-105 transition-transform duration-300',
  hover: 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
};