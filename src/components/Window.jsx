import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../context/OSContext';
import Terminal from './apps/Terminal';
import FileExplorer from './apps/FileExplorer';
import SystemMonitor from './apps/SystemMonitor';
import UserProfile from './apps/UserProfile';
import Contact from './apps/Contact';
import Properties from './apps/Properties';

const ResizeHandle = ({ cursor, top, bottom, left, right, width, height, onMouseDown }) => (
  <div
    className="resize-handle"
    onMouseDown={onMouseDown}
    style={{
      position: 'absolute',
      top, bottom, left, right,
      width: width || (left !== undefined && right !== undefined ? 'auto' : '10px'),
      height: height || (top !== undefined && bottom !== undefined ? 'auto' : '10px'),
      cursor,
      zIndex: 20
    }}
  />
);

const ControlBtn = ({ onClick, icon, color, isClose, title }) => (
  <div
    onClick={onClick}
    title={title}
    style={{
      width: '24px', height: '24px', borderRadius: '4px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: '#ccc'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = isClose ? '#e74c3c' : 'rgba(255,255,255,0.1)';
      e.currentTarget.style.color = '#fff';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = '#ccc';
    }}
  >
    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none">
      <path d={icon} />
    </svg>
  </div>
);

const Window = ({ win }) => {
  const { closeApp, minimizeApp, maximizeApp, focusApp } = useOS();
  const [pos, setPos] = useState({ x: win.x, y: win.y, w: win.width, h: win.height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState(null); // 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'

  // Used to temporarily disable transitions during the "snap" frame
  const [isSnapping, setIsSnapping] = useState(false);

  const dragOffset = useRef({ x: 0, y: 0, w: 0, h: 0, startX: 0, startY: 0 });

  // --- DRAG LOGIC (With Animated Snap-to-Restore) ---
  const handleMouseDown = (e) => {
    if (e.target.closest('.win-controls')) return; // Ignore buttons
    if (e.target.closest('.resize-handle')) return; // Ignore resize handles

    focusApp(win.id);

    if (win.maximized) {
      // 1. Calculate Ratio: Where is the mouse on the header? (0.0 to 1.0)
      const clickRatio = e.clientX / window.innerWidth;

      // 2. Calculate "Restored" Target Position based on that ratio
      // This keeps the window under the mouse visually
      const targetX = e.clientX - (pos.w * clickRatio);
      const targetY = e.clientY - 15; // Slight buffer from top

      // 3. Update Local State to Restored Size immediately
      setPos(prev => ({ ...prev, x: targetX, y: targetY }));

      // 4. Trigger Global Restore
      maximizeApp(win.id);

      // 5. Set Snapping State:
      // We want width/height to animate (morph), but X/Y to follow mouse instantly.
      setIsSnapping(true);
      setIsDragging(true);

      // 6. Set Drag Offset
      dragOffset.current = { x: pos.w * clickRatio, y: 15 };

      // Reset snapping flag shortly after animation starts so standard drag takes over
      setTimeout(() => setIsSnapping(false), 50);
    } else {
      setIsDragging(true);
      dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    }
  };

  // --- RESIZE LOGIC ---
  const handleResizeDown = (e, dir) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDir(dir);
    focusApp(win.id);
    // Store initial state for delta calculation
    dragOffset.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: pos.w,
      startH: pos.h,
      startPosX: pos.x,
      startPosY: pos.y
    };
  };

  // --- GLOBAL MOUSE LISTENERS ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        // Update position based on mouse
        setPos(prev => ({
          ...prev,
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y
        }));
      }
      if (isResizing && resizeDir) {
        const deltaX = e.clientX - dragOffset.current.startX;
        const deltaY = e.clientY - dragOffset.current.startY;

        setPos(prev => {
          let newX = dragOffset.current.startPosX;
          let newY = dragOffset.current.startPosY;
          let newW = dragOffset.current.startW;
          let newH = dragOffset.current.startH;

          // Horizontal Resizing
          if (resizeDir.includes('e')) {
            newW = Math.max(300, dragOffset.current.startW + deltaX);
          }
          if (resizeDir.includes('w')) {
            const maxDelta = dragOffset.current.startW - 300;
            const validDelta = Math.min(maxDelta, deltaX);
            newW = dragOffset.current.startW - validDelta;
            newX = dragOffset.current.startPosX + validDelta;
          }

          // Vertical Resizing
          if (resizeDir.includes('s')) {
            newH = Math.max(200, dragOffset.current.startH + deltaY);
          }
          if (resizeDir.includes('n')) {
            const maxDelta = dragOffset.current.startH - 200;
            const validDelta = Math.min(maxDelta, deltaY);
            newH = dragOffset.current.startH - validDelta;
            newY = dragOffset.current.startPosY + validDelta;
          }

          return { x: newX, y: newY, w: newW, h: newH };
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDir(null);
      setIsSnapping(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDir]);

  const renderContent = () => {
    switch (win.type) {
      case 'terminal': return <Terminal />;
      case 'explorer': return <FileExplorer />;
      case 'monitor': return <SystemMonitor />;
      case 'profile': return <UserProfile />;
      case 'contact': return <Contact />;
      case 'properties': return <Properties />;
      default: return win.content;
    }
  };

  if (win.minimized) return null;

  // --- DYNAMIC STYLES ---
  // The secret sauce for the animation logic
  const getStyles = () => {
    // 1. Maximized State
    if (win.maximized) {
      return {
        top: 0, left: 0, width: '100%', height: 'calc(100vh - 70px)',
        borderRadius: 0, border: 'none',
        transition: 'all 0.4s var(--ease-window)' // Smooth resize to max
      };
    }

    // 2. Resizing State (No animations, pure response)
    if (isResizing) {
      return {
        top: pos.y, left: pos.x, width: pos.w, height: pos.h,
        borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)',
        transition: 'none'
      };
    }

    // 3. Dragging State
    if (isDragging) {
      return {
        top: pos.y, left: pos.x, width: pos.w, height: pos.h,
        borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)',
        // Critical: If snapping (un-maximizing), animate W/H but not X/Y. 
        // If normal drag, no animation.
        transition: isSnapping ? 'width 0.4s var(--ease-window), height 0.4s var(--ease-window)' : 'none'
      };
    }

    // 4. Idle State (Floating)
    return {
      top: pos.y, left: pos.x, width: pos.w, height: pos.h,
      borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)',
      transition: 'all 0.4s var(--ease-window)' // Smooth movement for restore/snap
    };
  };

  return (
    <div
      className="window window-opening"
      style={{
        position: 'absolute',
        backgroundColor: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        zIndex: win.zIndex,
        ...getStyles()
      }}
      onMouseDown={() => focusApp(win.id)}
      data-context="window"
      data-id={win.id}
    >
      {/* Header */}
      <div
        className="win-header"
        style={{
          height: '38px', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 10px', flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          cursor: 'default',
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => maximizeApp(win.id)}
      >
        <div style={{ fontSize: '13px', color: '#ddd', fontWeight: 600, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={win.icon} alt="" width="14" />
          {win.title}
        </div>

        <div
          className="win-controls"
          style={{ display: 'flex', gap: '6px' }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ControlBtn onClick={() => minimizeApp(win.id)} color="#f1c40f" icon="M6,12 L18,12" title="Minimize" />
          <ControlBtn
            onClick={() => maximizeApp(win.id)}
            color="#2ecc71"
            icon={win.maximized
              ? "M6,8 L6,18 L16,18 L16,8 Z M8,6 L18,6 L18,16"
              : "M6,6 L18,6 L18,18 L6,18 Z"
            }
            title={win.maximized ? "Restore" : "Maximize"}
          />
          <ControlBtn onClick={() => closeApp(win.id)} color="#e74c3c" icon="M6,6 L18,18 M18,6 L6,18" isClose title="Close" />
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', color: '#eee', position: 'relative' }}>
        {renderContent()}
      </div>

      {!win.maximized && (
        <>
          {/* Corners */}
          <ResizeHandle cursor="nw-resize" top={0} left={0} onMouseDown={(e) => handleResizeDown(e, 'nw')} />
          <ResizeHandle cursor="ne-resize" top={0} right={0} onMouseDown={(e) => handleResizeDown(e, 'ne')} />
          <ResizeHandle cursor="sw-resize" bottom={0} left={0} onMouseDown={(e) => handleResizeDown(e, 'sw')} />
          <ResizeHandle cursor="se-resize" bottom={0} right={0} onMouseDown={(e) => handleResizeDown(e, 'se')} />

          {/* Sides */}
          <ResizeHandle cursor="n-resize" top={0} left={10} right={10} height={5} onMouseDown={(e) => handleResizeDown(e, 'n')} />
          <ResizeHandle cursor="s-resize" bottom={0} left={10} right={10} height={5} onMouseDown={(e) => handleResizeDown(e, 's')} />
          <ResizeHandle cursor="w-resize" left={0} top={10} bottom={10} width={5} onMouseDown={(e) => handleResizeDown(e, 'w')} />
          <ResizeHandle cursor="e-resize" right={0} top={10} bottom={10} width={5} onMouseDown={(e) => handleResizeDown(e, 'e')} />
        </>
      )}
    </div>
  );
};

export default Window;