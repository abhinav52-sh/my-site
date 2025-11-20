import React, { useState, useEffect, useRef } from 'react';
import { OSProvider, useOS } from './context/OSContext';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import ContextMenu from './components/ContextMenu';
import ParticleEffect from './components/ParticleEffect';
import SnapPreview from './components/SnapPreview';
import ParticleBackground from './components/ParticleBackground';

const OSInterface = () => {
  const {
    windows,
    activeId,
    restoreApp,
    minimizeApp,
    maximizeApp,
    centerApp,
    openApp,
    shutdown,
    isShuttingDown,
    openProperties,
    openSettings,
    resetIcons
  } = useOS();

  const [booting, setBooting] = useState(true);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, options: [] });
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [viewedProjects, setViewedProjects] = useState(new Set());

  // Check if all projects have been viewed
  useEffect(() => {
    const projectIds = ['proj_helmet', 'proj_capstone', 'proj_robot', 'proj_dev'];
    const openProjectIds = windows.filter(w => projectIds.includes(w.id)).map(w => w.id);

    openProjectIds.forEach(id => {
      if (!viewedProjects.has(id)) {
        setViewedProjects(prev => new Set([...prev, id]));
      }
    });

    // Trigger confetti if all 4 projects viewed
    if (viewedProjects.size === 4 && !sessionStorage.getItem('confetti_shown')) {
      setConfettiTrigger(prev => prev + 1);
      sessionStorage.setItem('confetti_shown', 'true');
    }
  }, [windows, viewedProjects]);

  useEffect(() => {
    setTimeout(() => setBooting(false), 2000);
  }, []);

  // Track openApp reference to avoid stale closures in timeout
  const openAppRef = useRef(openApp);
  useEffect(() => {
    openAppRef.current = openApp;
  }, [openApp]);

  const hasScheduledLaunch = useRef(false);

  // Auto-open User Profile after boot
  useEffect(() => {
    if (!booting && !hasScheduledLaunch.current) {
      hasScheduledLaunch.current = true;
      const timer = setTimeout(() => {
        openAppRef.current('about');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [booting]);

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
          { label: win.title, icon: '🪟', action: () => { } },
          { separator: true },
          { label: 'Minimize', icon: '─', action: () => minimizeApp(appId) },
          { label: win.maximized ? 'Restore' : 'Maximize', icon: '□', action: () => maximizeApp(appId) },
          { label: 'Center Window', icon: '⊡', action: () => centerApp(appId) },
          { separator: true },
          { label: 'Close', icon: '✕', danger: true, action: () => closeApp(appId) }
        ];
      }
    }
    // 2. CLICKED ON TASKBAR
    else if (target.closest('[data-context="taskbar"]')) {
      options = [
        { label: 'Taskbar Settings', icon: '⚙️', action: () => openSettings('taskbar') },
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
        { label: 'Change Wallpaper', icon: '🖼️', action: () => openApp('settings') },
        { label: 'Display Settings', icon: '⚙️', action: () => openApp('settings') },
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

  // --- MAIN ---
  const { background, snapState } = useOS(); // Get background and snapState from context

  return (
    <>
      {/* Boot Screen Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        zIndex: 9999,
        opacity: booting ? 1 : 0,
        pointerEvents: booting ? 'all' : 'none',
        transition: 'opacity 0.5s ease-out'
      }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #3daee9', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <div style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '2px' }}>ABHINAV OS v5.0</div>
      </div>

      {/* Shutdown Screen Overlay */}
      {isShuttingDown && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          zIndex: 10000 // Above boot screen
        }}>
          <h2 style={{ fontWeight: 400, margin: 0 }}>System Halted</h2>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>It is now safe to close this tab.</p>
        </div>
      )}

      {/* Main Desktop Interface */}
      <div
        style={{
          height: '100vh',
          overflow: 'hidden',
          userSelect: 'none',
          background: `${background} no-repeat center center / cover`,
          backgroundSize: background.includes('url') ? 'cover' : '400% 400%',
          animation: background.includes('linear-gradient') && background.includes('#667eea') ||
            background.includes('#ee7752') ||
            background.includes('#0f2027') ? 'gradientShift 15s ease infinite' : 'none'
        }}
        onContextMenu={handleContextMenu}
        onClick={() => contextMenu.show && setContextMenu({ ...contextMenu, show: false })}
        data-context="desktop"
      >
        <ParticleBackground />
        <Desktop />
        {windows.map(win => <Window key={win.id} win={win} />)}
        <SnapPreview snapState={snapState} />
        <ParticleEffect type="confetti" trigger={confettiTrigger} />
        <Taskbar />
        {contextMenu.show && <ContextMenu x={contextMenu.x} y={contextMenu.y} options={contextMenu.options} onClose={() => setContextMenu({ ...contextMenu, show: false })} />}
      </div>
    </>
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