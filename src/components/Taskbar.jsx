import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../context/OSContext';
import { fileSystem } from '../data/filesystem';

const Taskbar = () => {
  const { windows, activeId, restoreApp, minimizeApp, openApp, shutdown, hiddenApps } = useOS();
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

  // App List for Start Menu
  const allApps = [
    'about', 'projects', 'skills', 'contact', 'terminal',
    'proj_helmet', 'proj_capstone', 'proj_robot', 'proj_dev'
  ];

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
      <div 
        ref={startRef}
        // Added className 'menu-animate'
        className={menuOpen ? 'menu-animate' : ''} 
        style={{
          position: 'fixed', bottom: '70px', left: '10px', width: '360px', height: '480px',
          background: 'rgba(30, 30, 35, 0.85)', backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
          padding: '20px', flexDirection: 'column',
          // Removed manual transition logic here because CSS class handles it better
          display: menuOpen ? 'flex' : 'none', 
          zIndex: 5001,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Type to search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus={menuOpen}
            style={{
              width: '100%', padding: '12px 15px', borderRadius: '8px', border: 'none',
              background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none'
            }}
          />
        </div>

        {/* Pinned / Filtered Apps Grid */}
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px', paddingLeft: '5px' }}>
          {searchQuery ? 'SEARCH RESULTS' : 'PINNED'}
        </div>
        
        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', alignContent: 'start' }}>
          {filteredApps.length > 0 ? filteredApps.map(appId => {
            const isHidden = hiddenApps.includes(appId);
            return (
            <div 
              key={appId} 
              onClick={() => { openApp(appId); setMenuOpen(false); }}
              // ENABLE RIGHT CLICK CONTEXT MENU FOR PROPERTIES
              data-context="icon"
              data-id={appId}
              style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', 
                  padding: '10px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                  opacity: isHidden ? 0.5 : 1,
                  filter: isHidden ? 'grayscale(100%)' : 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <img src={fileSystem[appId].icon} width="32" style={{ marginBottom: '5px' }} alt="icon" />
              <span style={{ fontSize: '11px', color: '#eee', wordWrap: 'break-word', lineHeight: '1.2' }}>
                {fileSystem[appId].title.replace('Smart Helmet', 'Helmet').replace('DiscountMate', 'Capstone')}
              </span>
            </div>
          )}) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', marginTop: '20px' }}>No apps found</div>
          )}
        </div>

        {/* User Footer */}
        <div style={{ 
          marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
        }}>
          <div 
            onClick={() => { openApp('about'); setMenuOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px', borderRadius: '6px' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ width: '32px', height: '32px', background: '#444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AS</div>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>Abhinav Sharma</div>
          </div>
          
          {/* Logout Button */}
          <div 
            onClick={() => setShowLogoutModal(true)}
            style={{ padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
            title="Logout"
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,0,0,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="20" height="20" fill="none" stroke="#ff5f56" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </div>
        </div>
      </div>


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
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>😴</div>
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
      <div ref={calendarRef}>
        <CalendarWidget isOpen={calendarOpen} date={time} />
      </div>


      {/* --- DOCK --- */}
      <div 
        data-context="taskbar" // Enable context menu on taskbar
        style={{
          position: 'fixed', bottom: '10px', left: '10px', right: '10px', height: '50px',
          background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)', borderRadius: '12px',
          display: 'flex', alignItems: 'center', padding: '0 10px', zIndex: 5000
        }}
      >
        <div 
          ref={buttonRef}
          onClick={toggleMenu} 
          style={{ 
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            cursor: 'pointer', borderRadius: '8px', marginRight: '15px', transition: '0.2s',
            background: menuOpen ? 'rgba(61, 174, 233, 0.3)' : 'transparent' 
          }}
        >
          <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: '#fff' }}><path d="M12,2L2,22H22L12,2M12,6L18,18H6L12,6Z" /></svg>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexGrow: 1 }}>
          {windows.map(win => (
            <div 
              key={win.id} 
              onClick={() => handleTaskClick(win.id)}
              style={{ 
                padding: '0 15px', height: '36px', 
                background: activeId === win.id ? 'rgba(61, 174, 233, 0.15)' : 'rgba(255,255,255,0.05)', 
                borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', 
                cursor: 'pointer', borderBottom: activeId === win.id ? '2px solid var(--accent)' : '2px solid transparent',
                transition: '0.2s'
              }}
            >
              <img src={win.icon} width="18" alt="icon" />
              <span style={{ fontSize: '13px', color: '#ddd' }}>{win.title}</span>
            </div>
          ))}
        </div>

        <div 
            ref={clockRef}
            onClick={() => { setCalendarOpen(!calendarOpen); setMenuOpen(false); }}
            style={{ 
                fontSize: '13px', color: '#ccc', marginLeft: '15px', cursor: 'pointer', padding: '5px 10px', borderRadius: '6px',
                background: calendarOpen ? 'rgba(255,255,255,0.1)' : 'transparent', textAlign: 'center', lineHeight: '1.2'
            }}
        >
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div style={{ fontSize: '10px', color: '#aaa' }}>{time.toLocaleDateString()}</div>
        </div>
      </div>
    </>
  );
};

/* --- CALENDAR COMPONENT --- */
const CalendarWidget = ({ isOpen, date }) => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const getDaysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const getFirstDay = (d) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDay(date);
    const currentDay = date.getDate();
    const blanks = Array(firstDay).fill(null);
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div style={{
            position: 'fixed', bottom: '70px', right: '10px', width: '260px',
            background: 'rgba(30, 30, 35, 0.95)', backdropFilter: 'blur(30px)',
            border: '1px solid var(--glass-border)', borderRadius: '12px',
            padding: '20px', transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
            opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none',
            transition: '0.2s', zIndex: 5001, boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '15px', fontWeight: 'bold', fontSize: '16px' }}>
                {date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center', fontSize: '12px', color: '#888', marginBottom: '5px' }}>
                {days.map(d => <div key={d}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center', fontSize: '13px' }}>
                {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                {monthDays.map(d => (
                    <div key={d} style={{ padding: '6px 0', borderRadius: '4px', background: d === currentDay ? 'var(--accent)' : 'transparent', color: d === currentDay ? '#fff' : '#ccc' }}>{d}</div>
                ))}
            </div>
        </div>
    );
};

export default Taskbar;