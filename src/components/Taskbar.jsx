import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../context/OSContext';
import { fileSystem } from '../data/filesystem';
import StartMenu from './StartMenu';
import CalendarWidget from './CalendarWidget';

const Taskbar = () => {
  const { windows, activeId, restoreApp, minimizeApp, openApp, shutdown, hiddenApps, taskbarConfig } = useOS();
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Refs for click detection
  const calendarRef = useRef(null);
  const clockRef = useRef(null);
  const startRef = useRef(null);
  const buttonRef = useRef(null);

  // App List for Start Menu (Dynamic)
  const allApps = Object.keys(fileSystem).filter(key => fileSystem[key].startMenu);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Update Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close Calendar
      if (calendarOpen && calendarRef.current && !calendarRef.current.contains(event.target) && clockRef.current && !clockRef.current.contains(event.target)) {
        setCalendarOpen(false);
      }
      // Close Start Menu
      if (menuOpen && startRef.current && !startRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        // Only close if we aren't clicking the logout modal
        if (!showLogoutModal) setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [calendarOpen, menuOpen, showLogoutModal]);

  // Windows Key Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Meta") setMenuOpen(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTaskClick = (id) => {
    const win = windows.find(w => w.id === id);
    if (win.minimized || activeId !== id) restoreApp(id);
    else minimizeApp(id);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setCalendarOpen(false);
    setSearchQuery(""); // Reset search on toggle
  };

  // Filter Apps based on search
  const filteredApps = allApps.filter(appId =>
    fileSystem[appId].title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* --- ADVANCED START MENU --- */}

      <StartMenu
        ref={startRef}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        toggleLogout={() => { setMenuOpen(false); setShowLogoutModal(true); }}
      />


      {/* --- CUSTOM LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#1e1e1e', width: '350px', padding: '25px',
            borderRadius: '12px', border: '1px solid #333',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            textAlign: 'center'
          }}>
            {/* Title */}
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>Start Menu</div>
            <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '15px' }}>{getGreeting()}!</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>Ready to leave?</h3>
            <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '25px' }}>
              Are you sure you want to shut down the system?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: '6px', border: 'none',
                  background: '#333', color: '#fff', cursor: 'pointer', fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => shutdown()}
                style={{
                  padding: '10px 20px', borderRadius: '6px', border: 'none',
                  background: '#ff5f56', color: '#fff', cursor: 'pointer', fontWeight: 600
                }}
              >
                Shut Down
              </button>
            </div>
          </div>
        </div>
      )}


      {/* --- CALENDAR WIDGET --- */}
      {taskbarConfig.enableCalendar && (
        <div ref={calendarRef}>
          <CalendarWidget isOpen={calendarOpen} date={time} />
        </div>
      )}


      {/* --- DOCK --- */}
      <div
        data-context="taskbar" // Enable context menu on taskbar
        style={{
          position: 'fixed', bottom: '10px', left: '10px', right: '10px', height: '50px',
          background: 'var(--os-theme-card-bg, rgba(20, 20, 20, 0.8))', backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)', borderRadius: '12px',
          display: 'flex', alignItems: 'center', padding: '0 10px', zIndex: 5000,
          transition: 'background 0.5s ease'
        }}
      >
        <div
          ref={buttonRef}
          onClick={toggleMenu}
          style={{
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', borderRadius: '8px', marginRight: '15px', transition: '0.2s',
            background: menuOpen ? 'var(--os-theme-accent, #3daee9)40' : 'transparent'
          }}
        >
          <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: 'var(--os-theme-text, #fff)' }}><path d="M12,2L2,22H22L12,2M12,6L18,18H6L12,6Z" /></svg>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexGrow: 1 }}>
          {windows.map(win => (
            <div
              key={win.id}
              onClick={() => handleTaskClick(win.id)}
              title={win.title}
              style={{
                minWidth: '40px',
                maxWidth: '180px',
                height: '36px',
                padding: '0 12px',
                background: activeId === win.id ? 'var(--os-theme-accent, #3daee9)30' : 'rgba(255,255,255,0.05)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                borderBottom: activeId === win.id ? `2px solid var(--os-theme-accent, var(--accent))` : '2px solid transparent',
                transition: '0.2s',
                flexShrink: 0
              }}
            >
              <img src={win.icon} width="18" alt="icon" style={{ flexShrink: 0 }} />
              {taskbarConfig.showAppNames && (
                <span style={{
                  fontSize: '13px',
                  color: 'var(--os-theme-text, #ddd)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flexShrink: 1,
                  minWidth: 0
                }}>
                  {win.title}
                </span>
              )}
            </div>
          ))}
        </div>

        {taskbarConfig.showClock && (
          <div
            ref={clockRef}
            onClick={() => { if (taskbarConfig.enableCalendar) setCalendarOpen(!calendarOpen); setMenuOpen(false); }}
            style={{
              fontSize: '13px', color: 'var(--os-theme-text, #ccc)', marginLeft: '15px', cursor: taskbarConfig.enableCalendar ? 'pointer' : 'default', padding: '5px 10px', borderRadius: '6px',
              background: calendarOpen ? 'var(--os-theme-accent, #3daee9)20' : 'transparent', textAlign: 'center', lineHeight: '1.2',
              transition: 'background 0.2s, color 0.5s'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div style={{ fontSize: '10px', color: '#aaa' }}>{time.toLocaleDateString()}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Taskbar;