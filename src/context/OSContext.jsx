import React, { createContext, useContext, useState, useEffect } from 'react';
import { fileSystem } from '../data/filesystem';
import { systemSounds } from '../utils/sounds';
import { THEMES } from '../data/themes';
import { trackAppOpen, trackThemeChange } from '../utils/analytics';

const OSContext = createContext();

export const OSProvider = ({ children }) => {
  const [windows, setWindows] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [zCounter, setZCounter] = useState(100);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [propTargetId, setPropTargetId] = useState(null);
  const [hiddenApps, setHiddenApps] = useState([]);

  // NEW: Desktop Icon Positions State
  const [desktopIcons, setDesktopIcons] = useState([]);

  // Initialize Icons in a column layout (Dynamic Grid)
  useEffect(() => {
    // Filter apps that should be on desktop
    const desktopApps = Object.keys(fileSystem).filter(key => fileSystem[key].desktop);

    const startX = 20;
    const startY = 20;
    const spacingY = 110;
    const spacingX = 100;
    const maxPerColumn = Math.floor((window.innerHeight - 60) / spacingY); // -60 for taskbar/margin

    const initialIcons = desktopApps.map((key, index) => {
      const col = Math.floor(index / maxPerColumn);
      const row = index % maxPerColumn;
      return {
        id: key,
        x: startX + (col * spacingX),
        y: startY + (row * spacingY)
      };
    });
    setDesktopIcons(initialIcons);
  }, []);

  // NEW: Move Icon Function
  const moveIcon = (id, x, y) => {
    setDesktopIcons(prev => prev.map(icon =>
      icon.id === id ? { ...icon, x, y } : icon
    ));
  };

  // NEW: Auto Arrange (Reset) Function
  const resetIcons = () => {
    const desktopApps = Object.keys(fileSystem).filter(key => fileSystem[key].desktop);

    const startX = 20;
    const startY = 20;
    const spacingY = 110;
    const spacingX = 100;
    const maxPerColumn = Math.floor((window.innerHeight - 60) / spacingY);

    const resetState = desktopApps.map((key, index) => {
      const col = Math.floor(index / maxPerColumn);
      const row = index % maxPerColumn;
      return {
        id: key,
        x: startX + (col * spacingX),
        y: startY + (row * spacingY)
      };
    });
    setDesktopIcons(resetState);
  };

  const toggleHideApp = (id) => {
    setHiddenApps(prev => prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]);
  };

  const openApp = (appId, params = {}) => {
    if (windows.find(w => w.id === appId)) {
      restoreApp(appId);
      return;
    }

    const appData = fileSystem[appId];
    if (!appData) return;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const offset = (windows.length * 30) % 150;
    const startX = (viewportW / 2) - (appData.width / 2) + offset;
    const startY = (viewportH / 2) - (appData.height / 2) + offset;

    const newWindow = {
      id: appId,
      ...appData,
      ...params, // Merge additional params
      zIndex: zCounter + 1,
      minimized: false,
      maximized: false,
      x: Math.max(0, startX),
      y: Math.max(0, startY)
    };

    setWindows([...windows, newWindow]);
    setZCounter(zCounter + 1);
    setActiveId(appId);

    // Track app open
    trackAppOpen(appId, appData.title);

    // Play open sound
    if (soundEnabled) {
      systemSounds.windowOpen();
    }
  };

  const openSettings = (tab = 'personalization') => {
    openApp('settings', { initialTab: tab });
  };

  const openProperties = (id) => {
    setPropTargetId(id);
    openApp('properties');
  };

  const closeApp = (appId) => {
    setWindows(prev => prev.filter(w => w.id !== appId));
    setActiveId(prev => prev === appId ? null : prev);
  };

  const minimizeApp = (appId) => {
    setWindows(prev => prev.map(w => w.id === appId ? { ...w, minimized: true } : w));
    setActiveId(prev => prev === appId ? null : prev);
  };

  const restoreApp = (appId) => {
    setWindows(prev => prev.map(w => w.id === appId ? { ...w, minimized: false, zIndex: zCounter + 1 } : w));
    setZCounter(prev => prev + 1);
    setActiveId(appId);
  };

  const maximizeApp = (appId) => {
    setWindows(prev => prev.map(w =>
      w.id === appId ? { ...w, maximized: !w.maximized, zIndex: zCounter + 1 } : w
    ));
    setZCounter(prev => prev + 1);
    setActiveId(appId);
  };

  const focusApp = (appId) => {
    setWindows(prev => prev.map(w =>
      w.id === appId ? { ...w, zIndex: zCounter + 1 } : w
    ));
    setZCounter(prev => prev + 1);
    setActiveId(appId);
  };

  const centerApp = (appId) => {
    setWindows(prev => prev.map(w => {
      if (w.id === appId) {
        const width = 800;
        const height = 600;
        const x = (window.innerWidth - width) / 2;
        const y = (window.innerHeight - height) / 2;
        return {
          ...w,
          maximized: false,
          x,
          y,
          width,
          height,
          zIndex: zCounter + 1
        };
      }
      return w;
    }));
    setZCounter(prev => prev + 1);
    setActiveId(appId);
  };

  const shutdown = () => {
    setIsShuttingDown(true);
    try { window.close(); } catch (e) { }
  };

  // NEW: Background State
  const [background, setBackground] = useState('url(/wallpaper.png)');

  // NEW: Taskbar Configuration State
  const [taskbarConfig, setTaskbarConfig] = useState({
    showAppNames: true,
    showClock: true,
    enableCalendar: true
  });

  const updateTaskbarConfig = (key, value) => {
    setTaskbarConfig(prev => ({ ...prev, [key]: value }));
  };

  // NEW: Snap State for Global Preview
  const [snapState, setSnapState] = useState(null);

  // Sound Effects
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : false; // Changed default to false
  });

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('soundEnabled', JSON.stringify(newValue));
    systemSounds.setEnabled(newValue);
  };

  // Initialize sound system
  useEffect(() => {
    systemSounds.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // NEW: Theme Configuration State
  const [themeConfig, setThemeConfig] = useState(() => {
    const saved = localStorage.getItem('themeConfig');
    return saved ? JSON.parse(saved) : {
      accentColor: '#3daee9',
      iconTheme: 'default',
      windowOpacity: 0.95, // Default to 95% opacity
      fontSize: 'medium',
      retroMode: false
    };
  });

  // NEW: Global OS Theme State (for User Profile themes)
  const [osTheme, setOSTheme] = useState(() => {
    const saved = localStorage.getItem('osTheme');
    return saved || 'default';
  });

  const updateOSTheme = (themeName) => {
    setOSTheme(themeName);
    localStorage.setItem('osTheme', themeName);

    // Track theme change
    trackThemeChange(themeName);
  };

  // NEW: Particle Effects Toggle
  const [particlesEnabled, setParticlesEnabled] = useState(() => {
    const saved = localStorage.getItem('particlesEnabled');
    return saved !== null ? JSON.parse(saved) : true; // Default: enabled
  });

  const toggleParticles = () => {
    const newValue = !particlesEnabled;
    setParticlesEnabled(newValue);
    localStorage.setItem('particlesEnabled', JSON.stringify(newValue));
  };

  const updateThemeConfig = (key, value) => {
    setThemeConfig(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('themeConfig', JSON.stringify(updated));
      return updated;
    });
  };

  const resetThemeConfig = () => {
    const defaultTheme = {
      accentColor: '#3daee9',
      iconTheme: 'default',
      windowOpacity: 0.95,
      fontSize: 'medium',
      retroMode: false
    };
    setThemeConfig(defaultTheme);
    localStorage.setItem('themeConfig', JSON.stringify(defaultTheme));
  };

  // Apply OS theme colors as CSS variables
  useEffect(() => {
    const currentTheme = THEMES[osTheme] || THEMES.default;

    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--os-theme-bg', currentTheme.bg);
    document.documentElement.style.setProperty('--os-theme-card-bg', currentTheme.cardBg);
    document.documentElement.style.setProperty('--os-theme-accent', currentTheme.accent);
    document.documentElement.style.setProperty('--os-theme-text', currentTheme.text);
    document.documentElement.style.setProperty('--os-theme-particle', currentTheme.particleColor);
  }, [osTheme]);

  // Apply accent color to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', themeConfig.accentColor);
    document.documentElement.style.setProperty('--window-opacity', themeConfig.windowOpacity);
    document.documentElement.classList.toggle('retro-mode', themeConfig.retroMode);

    // Font size
    const fontSizeMap = { small: '12px', medium: '14px', large: '16px', xlarge: '18px' };
    document.documentElement.style.setProperty('--base-font-size', fontSizeMap[themeConfig.fontSize] || '14px');
  }, [themeConfig]);

  return (
    <OSContext.Provider value={{
      windows, activeId, openApp, closeApp, minimizeApp, maximizeApp, restoreApp, focusApp, centerApp,
      shutdown, isShuttingDown,
      openProperties, propTargetId, openSettings,
      hiddenApps, toggleHideApp,
      desktopIcons, moveIcon, resetIcons,
      background, setBackground, // Exported Background Logic
      taskbarConfig, updateTaskbarConfig, // Exported Taskbar Configuration
      themeConfig, updateThemeConfig, resetThemeConfig, // Exported Theme Configuration
      osTheme, updateOSTheme, // Global OS Theme
      particlesEnabled, toggleParticles, // Particle Effects Toggle
      soundEnabled, toggleSound, // Sound Effects
      snapState, setSnapState // Global Snap Preview State
    }}>
      {children}
    </OSContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOS = () => useContext(OSContext);