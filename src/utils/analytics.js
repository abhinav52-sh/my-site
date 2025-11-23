/**
 * Google Analytics 4 Tracking Utility
 * 
 * Centralized functions for tracking user interactions.
 * Make sure GA4 is initialized in index.html before using these functions.
 */

// Check if gtag is available
const isGtagAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Track a generic event
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Additional parameters
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (isGtagAvailable()) {
    window.gtag('event', eventName, eventParams);
    console.log('📊 GA Event:', eventName, eventParams);
  }
};

/**
 * Track when an app is opened
 * @param {string} appId - App identifier (e.g., 'about', 'terminal')
 * @param {string} appName - Human-readable app name
 */
export const trackAppOpen = (appId, appName) => {
  trackEvent('app_open', {
    app_id: appId,
    app_name: appName,
    event_category: 'engagement',
  });
};

/**
 * Track button clicks
 * @param {string} buttonName - Name of the button
 * @param {string} context - Where the button was clicked
 */
export const trackButtonClick = (buttonName, context = '') => {
  trackEvent('button_click', {
    button_name: buttonName,
    context: context,
    event_category: 'engagement',
  });
};

/**
 * Track resume download (important conversion metric!)
 */
export const trackResumeDownload = () => {
  trackEvent('resume_download', {
    method: 'button_click',
    event_category: 'conversion',
    value: 1, // Assign value to this important action
  });
};

/**
 * Track when a game is started
 * @param {string} gameName - Name of the game
 */
export const trackGameStart = (gameName) => {
  trackEvent('game_start', {
    game_name: gameName,
    event_category: 'engagement',
  });
};

/**
 * Track theme changes
 * @param {string} themeName - Name of the theme
 */
export const trackThemeChange = (themeName) => {
  trackEvent('theme_change', {
    theme_name: themeName,
    event_category: 'customization',
  });
};

/**
 * Track external link clicks
 * @param {string} linkType - Type of link (email, linkedin, github, etc.)
 * @param {string} destination - Where the link goes
 */
export const trackLinkClick = (linkType, destination = '') => {
  trackEvent('link_click', {
    link_type: linkType,
    destination: destination,
    event_category: 'navigation',
  });
};

/**
 * Track Start Menu opens
 */
export const trackStartMenuOpen = () => {
  trackEvent('start_menu_open', {
    event_category: 'navigation',
  });
};

/**
 * Track terminal commands (aggregate only, privacy-aware)
 * @param {string} command - The command executed
 */
export const trackTerminalCommand = (command) => {
  // Only track the command name, not arguments (privacy)
  const cmdName = command.split(' ')[0];
  trackEvent('terminal_command', {
    command_name: cmdName,
    event_category: 'engagement',
  });
};
