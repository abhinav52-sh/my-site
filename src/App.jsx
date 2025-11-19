import React, { useState, useEffect } from 'react';
import { OSProvider, useOS } from './context/OSContext';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import ContextMenu from './components/ContextMenu';

const OSInterface = () => {
  const { 
    windows, 
    isShuttingDown, 
    closeApp, 
    minimizeApp, 
    maximizeApp, 
    openApp, 
    shutdown, 
    openProperties,
    resetIcons // NEW IMPORT
  } = useOS();

  const [booting, setBooting] = useState(true);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, options: [] });

  useEffect(() => {
    setTimeout(() => setBooting(false), 2000);
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();

    const target = e.target;
    let options = [];

    // 1. CLICKED ON A WINDOW
    const windowEl = target.closest('[data-context="window"]');
    if (windowEl) {
      const appId = windowEl.dataset.id;
      const win = windows.find(w => w.id === appId);
      
      if (win) {
        options = [
          { label: win.title, icon: '🪟', action: () => {} },
          { separator: true },
          { label: 'Minimize', icon: '─', action: () => minimizeApp(appId) },
          { label: win.maximized ? 'Restore' : 'Maximize', icon: '□', action: () => maximizeApp(appId) },
          { separator: true },
          { label: 'Close', icon: '✕', danger: true, action: () => closeApp(appId) }
        ];
      }
    }
    // 2. CLICKED ON TASKBAR
    else if (target.closest('[data-context="taskbar"]')) {
      options = [
        { label: 'Taskbar Settings', icon: '⚙️', action: () => alert("Taskbar is locked.") },
        { label: 'Show Desktop', icon: '🖥️', action: () => windows.forEach(w => minimizeApp(w.id)) }
      ];
    }
    // 3. CLICKED ON AN ICON
    else if (target.closest('[data-context="icon"]')) {
        const element = target.closest('[data-context="icon"]');
        const appId = element.dataset.id;
        if (appId) {
            options = [
                { label: 'Open', icon: '🚀', action: () => openApp(appId) },
                { separator: true },
                { label: 'Properties', icon: 'ℹ️', action: () => openProperties(appId) }
            ];
        }
    }
    // 4. DESKTOP BACKGROUND
    else {
      options = [
        { label: 'Refresh', icon: '🔄', action: () => window.location.reload() },
        { label: 'Auto Arrange Icons', icon: '🔲', action: () => resetIcons() }, // NEW OPTION
        { separator: true },
        { label: 'Change Wallpaper', icon: '🖼️', action: () => alert("Wallpaper is managed by the theme engine.") },
        { label: 'Display Settings', icon: '⚙️', action: () => openApp('skills') },
        { separator: true },
        { label: 'Shut Down...', icon: '🛑', danger: true, action: () => shutdown() }
      ];
    }

    if (options.length > 0) {
      setContextMenu({
        show: true,
        x: e.clientX,
        y: e.clientY,
        options
      });
    }
  };

  // --- BOOT ---
  if (booting) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 9999 }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #3daee9', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <div style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '2px' }}>ABHINAV OS v5.0</div>
      </div>
    );
  }

  // --- SHUTDOWN ---
  if (isShuttingDown) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 9999 }}>
        <h2 style={{ fontWeight: 400, margin: 0 }}>System Halted</h2>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>It is now safe to close this tab.</p>
      </div>
    );
  }

  // --- MAIN ---
  return (
    <div 
        style={{ height: '100vh', overflow: 'hidden', userSelect: 'none' }} 
        onContextMenu={handleContextMenu} 
        onClick={() => contextMenu.show && setContextMenu({ ...contextMenu, show: false })}
        data-context="desktop"
    >
      <Desktop />
      {windows.map(win => <Window key={win.id} win={win} />)}
      <Taskbar />
      {contextMenu.show && <ContextMenu x={contextMenu.x} y={contextMenu.y} options={contextMenu.options} onClose={() => setContextMenu({ ...contextMenu, show: false })} />}
    </div>
  );
};

function App() {
  return (
    <OSProvider>
      <OSInterface />
    </OSProvider>
  );
}

export default App;