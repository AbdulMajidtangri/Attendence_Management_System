import React from 'react';

const RippleGrid = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Main gradient grid */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 95%, rgba(79, 70, 229, 0.1) 100%),
            linear-gradient(transparent 95%, rgba(79, 70, 229, 0.1) 100%)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.4
        }}
      />
      
      {/* Animated dots */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          animation: 'pulseDots 3s ease-in-out infinite'
        }}
      />
      
      {/* Color overlays */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-l from-blue-400/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-purple-400/10 to-transparent" />
      
      <style jsx>{`
        @keyframes pulseDots {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default RippleGrid;