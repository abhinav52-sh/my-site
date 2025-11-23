/**
 * OS Configuration
 * 
 * Centralized configuration for timing, default settings, and app behavior.
 */

export const OS_CONFIG = {
  // Boot sequence timing (in milliseconds)
  boot: {
    loadingScreenDuration: 600,
    autoLaunchDelay: 1000,
    autoMaximizeDelay: 300
  },

  // Default window settings
  windows: {
    defaultWidth: 800,
    defaultHeight: 600,
    minWidth: 300,
    minHeight: 200
  },

  // Taskbar settings
  taskbar: {
    height: 48,
    iconSize: 32
  }
};
