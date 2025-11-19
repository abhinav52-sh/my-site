import React, { useEffect, useRef, useState } from 'react';

const ContextMenu = ({ x, y, options, onClose }) => {
  const menuRef = useRef(null);
  const [style, setStyle] = useState({ top: y, left: x, opacity: 0 });

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let newX = x;
      let newY = y;

      // Prevent overflow right
      if (x + rect.width > window.innerWidth) {
        newX = x - rect.width;
      }
      // Prevent overflow bottom
      if (y + rect.height > window.innerHeight) {
        newY = y - rect.height;
      }

      setStyle({ top: newY, left: newX, opacity: 1 });
    }

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    // Close on any click
    window.addEventListener('click', onClose);
    return () => window.removeEventListener('click', onClose);
  }, [x, y, onClose]);

  if (!options || options.length === 0) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: style.top,
        left: style.left,
        opacity: style.opacity,
        minWidth: '180px',
        background: 'rgba(30, 30, 35, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '6px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        zIndex: 9999,
        transition: 'opacity 0.1s ease-in'
      }}
      onContextMenu={(e) => e.preventDefault()} // Prevent browser menu on custom menu
    >
      {options.map((opt, i) => (
        opt.separator ? (
          <div key={i} style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '5px 0' }} />
        ) : (
          <div
            key={i}
            onClick={(e) => { e.stopPropagation(); opt.action(); onClose(); }}
            className="ctx-item"
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              color: opt.danger ? '#ff5f56' : '#eee',
              cursor: 'pointer',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = opt.danger ? 'rgba(255, 95, 86, 0.2)' : 'rgba(61, 174, 233, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {opt.icon && <span>{opt.icon}</span>}
            <span>{opt.label}</span>
          </div>
        )
      ))}
    </div>
  );
};

export default ContextMenu;