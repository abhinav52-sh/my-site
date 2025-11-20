import React from 'react';

const SnapPreview = ({ snapState }) => {
  if (!snapState) return null;

  const getPreviewStyle = () => {
    const baseStyle = {
      position: 'fixed',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '12px', // Match window radius
      pointerEvents: 'none',
      zIndex: 50, // Below active window but above desktop
      transition: 'all 0.2s cubic-bezier(0.19, 1, 0.22, 1)', // Smooth easing
      backdropFilter: 'blur(10px)',
      boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05), 0 0 30px rgba(0, 0, 0, 0.2)'
    };

    switch (snapState) {
      case 'left':
        return {
          ...baseStyle,
          top: '10px',
          left: '10px',
          width: 'calc(50% - 15px)',
          height: 'calc(100vh - 90px)' // Account for taskbar + margins
        };

      case 'right':
        return {
          ...baseStyle,
          top: '10px',
          right: '10px',
          width: 'calc(50% - 15px)',
          height: 'calc(100vh - 90px)'
        };

      case 'top':
        return {
          ...baseStyle,
          top: '10px',
          left: '10px',
          width: 'calc(100% - 20px)',
          height: 'calc(100vh - 90px)'
        };

      case 'top-left':
        return {
          ...baseStyle,
          top: '10px',
          left: '10px',
          width: 'calc(50% - 15px)',
          height: 'calc(50vh - 45px)'
        };

      case 'top-right':
        return {
          ...baseStyle,
          top: '10px',
          right: '10px',
          width: 'calc(50% - 15px)',
          height: 'calc(50vh - 45px)'
        };

      case 'bottom-left':
        return {
          ...baseStyle,
          bottom: '80px',
          left: '10px',
          width: 'calc(50% - 15px)',
          height: 'calc(50vh - 45px)'
        };

      case 'bottom-right':
        return {
          ...baseStyle,
          bottom: '80px',
          right: '10px',
          width: 'calc(50% - 15px)',
          height: 'calc(50vh - 45px)'
        };

      default:
        return null;
    }
  };

  const style = getPreviewStyle();
  if (!style) return null;

  return (
    <div style={style}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.3,
        filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))'
      }}>
        {/* Simple ghost window icon */}
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fff' }}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
        </svg>
      </div>
    </div>
  );
};

export default SnapPreview;
