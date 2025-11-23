import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../context/OSContext';
import { systemSounds } from '../utils/sounds';
import Terminal from './apps/Terminal';
import FileExplorer from './apps/FileExplorer';
import SystemMonitor from './apps/SystemMonitor';
import UserProfile from './apps/UserProfile';
import Contact from './apps/Contact';
import Properties from './apps/Properties';
import Settings from './apps/Settings';
import SnakeGame from './games/SnakeGame';
import Game2048 from './games/Game2048';
import TicTacToe from './games/TicTacToe';
import MazeGame from './games/MazeGame';
import TetrisGame from './games/TetrisGame';

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

import { THEMES } from '../data/themes';

const Window = ({ win }) => {
  const { windows, focusApp, closeApp, minimizeApp, maximizeApp, activeId, themeConfig, soundEnabled, snapState, setSnapState, osTheme } = useOS();
  const [pos, setPos] = useState({ x: win.x, y: win.y, w: win.width, h: win.height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState('');
  const [dragOffsetState, setDragOffsetState] = useState({ x: 0, y: 0 }); // Renamed to avoid conflict
  const [isSnapping, setIsSnapping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState(''); // 'minimize', 'maximize', 'close'

  const dragOffset = useRef({ x: 0, y: 0, w: 0, h: 0, startX: 0, startY: 0 });

  // Helper to convert hex to rgba with opacity
  const getThemeBackground = (opacity) => {
    const currentTheme = THEMES[osTheme] || THEMES.default;
    const hex = currentTheme.bg;

    // Parse hex
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const focusWindow = (e) => {
    e.stopPropagation();
    focusApp(win.id);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    if (soundEnabled) systemSounds.windowClose();
    setAnimationType('close');
    setIsAnimating(true);
    setTimeout(() => {
      closeApp(win.id);
    }, 250);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    if (soundEnabled) systemSounds.click();
    setAnimationType('minimize');
    setIsAnimating(true);
    // Minimize instantly - no delay
    minimizeApp(win.id);
    // Clean up animation state after it finishes
    setTimeout(() => {
      setIsAnimating(false);
    }, 150);
  };

  const handleMaximize = (e) => {
    e.stopPropagation();
    if (soundEnabled) systemSounds.click();
    if (!win.maximized) {
      setAnimationType('maximize');
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
    maximizeApp(win.id);
  };

  // --- DRAG LOGIC (With Animated Snap-to-Restore) ---
  const handleMouseDown = (e) => {
    if (e.target.closest('.win-controls')) return; // Ignore buttons
    if (e.target.closest('.resize-handle')) return; // Ignore resize handles

    focusApp(win.id);

    if (win.maximized) {
      // 1. Calculate Ratio: Where is the mouse on the header? (0.0 to 1.0)
      const clickRatio = e.clientX / window.innerWidth;

      // 2. Prepare for potential drag (don't restore yet)
      setIsDragging(true);

      // Store start position and ratio for the threshold check
      dragOffset.current = {
        startX: e.clientX,
        startY: e.clientY,
        clickRatio: clickRatio,
        isMaximizedDrag: true // Flag to indicate we are starting from maximized state
      };

    } else {
      setIsDragging(true);
      dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y, isMaximizedDrag: false };
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
        // CHECK FOR MAXIMIZED DRAG THRESHOLD
        if (dragOffset.current.isMaximizedDrag) {
          const dist = Math.hypot(e.clientX - dragOffset.current.startX, e.clientY - dragOffset.current.startY);

          if (dist > 15) { // Threshold of 15px
            // Trigger Restore
            const clickRatio = dragOffset.current.clickRatio;
            const targetX = e.clientX - (pos.w * clickRatio);
            const targetY = e.clientY - 15;

            setPos(prev => ({ ...prev, x: targetX, y: targetY }));
            maximizeApp(win.id);
            setIsSnapping(true);

            // Switch to normal drag mode
            dragOffset.current.isMaximizedDrag = false;
            dragOffset.current.x = pos.w * clickRatio;
            dragOffset.current.y = 15;

            setTimeout(() => setIsSnapping(false), 50);
          } else {
            // Haven't moved enough yet
            return;
          }
        }

        const newX = e.clientX - dragOffset.current.x;
        const newY = Math.max(0, e.clientY - dragOffset.current.y);

        // Enhanced snap detection zones
        const snapZone = 50;
        const cornerZone = 100; // Larger zone for corners
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight - 70; // Account for taskbar

        let snapState = null;

        // Corner detection (priority over edge detection)
        if (e.clientX < cornerZone && e.clientY < cornerZone) {
          snapState = 'top-left';
        } else if (e.clientX > screenWidth - cornerZone && e.clientY < cornerZone) {
          snapState = 'top-right';
        } else if (e.clientX < cornerZone && e.clientY > screenHeight - cornerZone + 70) {
          snapState = 'bottom-left';
        } else if (e.clientX > screenWidth - cornerZone && e.clientY > screenHeight - cornerZone + 70) {
          snapState = 'bottom-right';
        }
        // Edge detection
        else if (e.clientX < snapZone) {
          snapState = 'left';
        } else if (e.clientX > screenWidth - snapZone) {
          snapState = 'right';
        } else if (e.clientY < snapZone) {
          snapState = 'top';
        }

        // Update global snap state for preview
        setSnapState(snapState);

        if (snapState) {
          setIsSnapping(true);
        } else {
          setIsSnapping(false);
        }

        setPos(prev => ({ ...prev, x: newX, y: newY }));
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
      // Apply snap if dragging and in snap state
      // Use the global snapState from context (we need to access it via the hook, but we can't access the latest state inside the closure easily without a ref or checking the value)
      // Actually, since handleMouseUp is defined inside the effect which has [isDragging, isResizing, resizeDir] deps, but NOT snapState, it might be stale.
      // However, we can check the local 'isSnapping' or just trust the context if we include it in deps.
      // BETTER: We can just check the LAST set snapState.
      // But wait, 'snapState' from context is a value.

      // Let's use a ref to track the current snap state locally to avoid dependency issues, 
      // OR just rely on the fact that we set it.
      // Actually, we can just pass the calculated snapState to the mouseUp handler if we refactor, 
      // but here we are in a closure.

      // SIMPLER FIX: Re-calculate the snap state in mouseUp? No, that's redundant.
      // Let's assume we can access the latest snapState if we add it to the useEffect dependency array.
      // But adding it to dependency array will re-attach listeners on every mouse move (if snapState changes).
      // That's fine, snapState only changes when entering/leaving zones.

      if (isDragging && snapState) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight - 70;
        const snapType = snapState;

        // Clear snap state IMMEDIATELY to hide preview
        setSnapState(null);
        setIsSnapping(false);

        // Apply the snap based on type
        switch (snapType) {
          case 'left':
            // Ensure window is not maximized first
            if (win.maximized) {
              maximizeApp(win.id); // Toggle to un-maximize
            }
            setPos({ x: 0, y: 0, w: screenWidth / 2, h: screenHeight });
            break;
          case 'right':
            if (win.maximized) {
              maximizeApp(win.id);
            }
            setPos({ x: screenWidth / 2, y: 0, w: screenWidth / 2, h: screenHeight });
            break;
          case 'top':
            // Only maximize if not already maximized
            if (!win.maximized) {
              maximizeApp(win.id);
            }
            break;
          case 'top-left':
            if (win.maximized) {
              maximizeApp(win.id);
            }
            setPos({ x: 0, y: 0, w: screenWidth / 2, h: screenHeight / 2 });
            break;
          case 'top-right':
            if (win.maximized) {
              maximizeApp(win.id);
            }
            setPos({ x: screenWidth / 2, y: 0, w: screenWidth / 2, h: screenHeight / 2 });
            break;
          case 'bottom-left':
            if (win.maximized) {
              maximizeApp(win.id);
            }
            setPos({ x: 0, y: screenHeight / 2, w: screenWidth / 2, h: screenHeight / 2 });
            break;
          case 'bottom-right':
            if (win.maximized) {
              maximizeApp(win.id);
            }
            setPos({ x: screenWidth / 2, y: screenHeight / 2, w: screenWidth / 2, h: screenHeight / 2 });
            break;
        }
      } else {
        // Clear snap state even if not snapping
        if (win.snapState) {
          win.snapState = null;
        }
      }

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
  }, [isDragging, isResizing, resizeDir, snapState]);

  const renderContent = () => {
    switch (win.type) {
      case 'terminal': return <Terminal />;
      case 'explorer': return <FileExplorer />;
      case 'monitor': return <SystemMonitor />;
      case 'profile': return <UserProfile />;
      case 'contact': return <Contact />;
      case 'properties': return <Properties />;
      case 'settings':
        return <Settings initialTab={win.initialTab} />;
      case 'game_snake':
        return <SnakeGame />;
      case 'game_2048':
        return <Game2048 />;
      case 'game_tictactoe':
        return <TicTacToe />;
      case 'game_maze':
        return <MazeGame />;
      case 'game_tetris':
        return <TetrisGame />;
      default:
        return win.content;
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
        borderRadius: 'var(--radius)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        background: getThemeBackground(themeConfig.windowOpacity || 0.95),
        backdropFilter: 'blur(20px)',
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
      className={`window window-opening ${isAnimating ? `window-${animationType}` : ''}`}
      style={{
        position: 'absolute',
        background: getThemeBackground(themeConfig.windowOpacity || 0.95),
        backdropFilter: 'blur(20px)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        display: win.minimized && !isAnimating ? 'none' : 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: win.zIndex,
        fontSize: 'var(--base-font-size, 14px)',
        ...getStyles()
      }}
      onMouseDown={() => focusApp(win.id)}
      onClick={focusWindow}
      data-context="window"
      data-id={win.id}
    >
      {/* Header */}
      <div
        className="win-header"
        style={{
          height: '38px', background: 'var(--os-theme-card-bg, rgba(0,0,0,0.4))', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 10px', flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          cursor: 'default',
          userSelect: 'none',
          transition: 'background 0.5s ease'
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => maximizeApp(win.id)}
      >
        <div style={{ fontSize: '13px', color: 'var(--os-theme-text, #ddd)', fontWeight: 600, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.5s ease' }}>
          <img src={win.icon} alt="" width="14" />
          {win.title}
        </div>

        <div
          className="win-controls"
          style={{ display: 'flex', gap: '6px' }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ControlBtn onClick={handleMinimize} color="#f1c40f" icon="M6,12 L18,12" title="Minimize" />
          <ControlBtn
            onClick={handleMaximize}
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