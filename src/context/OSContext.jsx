import React, { createContext, useState, useContext, useEffect } from 'react';
import { fileSystem } from '../data/filesystem';

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

  // Initialize Icons in a column layout
  useEffect(() => {
    const keys = ['about', 'projects', 'skills', 'contact', 'terminal'];
    const initialIcons = keys.map((key, index) => ({
      id: key,
      x: 20, // Left margin
      y: 20 + (index * 110) // Stack vertically with 110px spacing
    }));
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
    const keys = ['about', 'projects', 'skills', 'contact', 'terminal'];
    const resetState = keys.map((key, index) => ({
      id: key,
      x: 20,
      y: 20 + (index * 110)
    }));
    setDesktopIcons(resetState);
  };

  const toggleHideApp = (id) => {
    setHiddenApps(prev => prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]);
  };

  const openApp = (appId) => {
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
      zIndex: zCounter + 1,
      minimized: false,
      maximized: false,
      x: Math.max(0, startX),
      y: Math.max(0, startY)
    };

    setWindows([...windows, newWindow]);
    setZCounter(zCounter + 1);
    setActiveId(appId);
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

  const shutdown = () => {
    setIsShuttingDown(true);
    try { window.close(); } catch(e) {} 
  };

  return (
    <OSContext.Provider value={{ 
      windows, activeId, openApp, closeApp, minimizeApp, maximizeApp, restoreApp, focusApp, 
      shutdown, isShuttingDown,
      openProperties, propTargetId,
      hiddenApps, toggleHideApp,
      desktopIcons, moveIcon, resetIcons // Exported Grid Logic
    }}>
      {children}
    </OSContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOS = () => useContext(OSContext);