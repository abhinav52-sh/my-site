import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { fileSystem } from '../data/filesystem';

const Desktop = () => {
  const { openApp, hiddenApps, desktopIcons, moveIcon } = useOS();

  // Local state for drag operation
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // This prevents the "Click" event from firing after a "Drag"
  const isDraggingRef = useRef(false);

  const GRID_W = 100; // Grid cell width
  const GRID_H = 110; // Grid cell height
  const MARGIN_X = 20; // Left margin
  const MARGIN_Y = 20; // Top margin

  const handleMouseDown = (e, id, currentX, currentY) => {
    e.stopPropagation(); // Don't trigger desktop context menu
    setDraggingId(id);
    setDragOffset({
      x: e.clientX - currentX,
      y: e.clientY - currentY
    });
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingId) {
        isDraggingRef.current = true; // We are definitely dragging now

        // Calculate visual position immediately for smoothness
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Update via a temporary local update or just force update logic?
        // For best performance, we usually drag a "ghost" or update directly.
        // Here we'll update the global state directly for simplicity, 
        // though in large apps you might use local state while dragging.
        moveIcon(draggingId, newX, newY);
      }
    };

    const handleMouseUp = (e) => {
      if (draggingId) {
        // SNAP TO GRID LOGIC
        const currentIcon = desktopIcons.find(i => i.id === draggingId);
        if (currentIcon) {
          // Calculate column and row index based on margins
          const col = Math.round((currentIcon.x - MARGIN_X) / GRID_W);
          const row = Math.round((currentIcon.y - MARGIN_Y) / GRID_H);

          // Calculate snapped position
          let snappedX = (col * GRID_W) + MARGIN_X;
          let snappedY = (row * GRID_H) + MARGIN_Y;

          // Boundary Checks
          // 1. Left/Top edges
          snappedX = Math.max(MARGIN_X, snappedX);
          snappedY = Math.max(MARGIN_Y, snappedY);

          // 2. Right edge
          if (snappedX > window.innerWidth - GRID_W) snappedX = window.innerWidth - GRID_W;

          // 3. Bottom edge (Taskbar Protection)
          // Taskbar is approx 60px height + 10px margin
          if (snappedY > window.innerHeight - GRID_H - 60) {
            snappedY = window.innerHeight - GRID_H - 60;
          }

          // Commit Snap
          moveIcon(draggingId, snappedX, snappedY);
        }

        setDraggingId(null);
        // Allow click event to fire if we didn't actually move much
        setTimeout(() => isDraggingRef.current = false, 100);
      }
    };

    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, dragOffset, desktopIcons, moveIcon]);

  // Handle Click (Open App)
  const handleClick = (id) => {
    if (!isDraggingRef.current) {
      openApp(id);
    }
  };

  return (
    // Changed from Grid to Relative for absolute positioning
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 50px)', overflow: 'hidden' }}>
      {desktopIcons
        .filter(icon => !hiddenApps.includes(icon.id))
        .map(icon => (
          <div
            key={icon.id}
            onMouseDown={(e) => handleMouseDown(e, icon.id, icon.x, icon.y)}
            onClick={() => handleClick(icon.id)}
            data-context="icon"
            data-id={icon.id}
            style={{
              position: 'absolute',
              top: icon.y,
              left: icon.x,
              width: '90px', // Slightly smaller than grid cell for spacing
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              cursor: 'pointer', padding: '10px', borderRadius: '8px',
              transition: draggingId === icon.id ? 'none' : 'top 0.2s cubic-bezier(0.25, 1, 0.5, 1), left 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
              zIndex: draggingId === icon.id ? 999 : 1, // Bring to front while dragging
            }}
            className="d-icon"
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <img
              src={fileSystem[icon.id].icon}
              style={{ width: '48px', height: '48px', marginBottom: '5px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))', pointerEvents: 'none' }}
              alt="icon"
            />
            <span style={{ fontSize: '13px', textShadow: '0 2px 4px rgba(0,0,0,0.9)', textAlign: 'center', color: 'white', lineHeight: '1.2', pointerEvents: 'none' }}>
              {fileSystem[icon.id].title}
            </span>
          </div>
        ))}
    </div>
  );
};

export default Desktop;