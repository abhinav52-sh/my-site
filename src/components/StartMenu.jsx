import React, { useState, useEffect, forwardRef } from 'react';
import { useOS } from '../context/OSContext';
import { fileSystem } from '../data/filesystem';

const StartMenu = forwardRef(({ isOpen, onClose, toggleLogout }, ref) => {
  const { openApp, hiddenApps } = useOS();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState('pinned'); // 'pinned' or 'all'

  // App List
  // App List (Dynamic Pinned)
  const pinnedApps = Object.keys(fileSystem).filter(key => fileSystem[key].pinned);

  const allApps = Object.keys(fileSystem).filter(key =>
    fileSystem[key].type && fileSystem[key].type !== 'properties'
  );

  // Filter Apps
  let displayApps = [];
  if (searchQuery) {
    displayApps = allApps.filter(id => fileSystem[id].title.toLowerCase().includes(searchQuery.toLowerCase()));
  } else if (activeTab === 'pinned') {
    displayApps = pinnedApps;
  } else {
    // All Apps: Sort Alphabetically, but keep 'about' (User Profile) at top
    const sorted = allApps
      .filter(id => id !== 'about')
      .sort((a, b) => fileSystem[a].title.localeCompare(fileSystem[b].title));

    if (allApps.includes('about')) {
      displayApps = ['about', ...sorted];
    } else {
      displayApps = sorted;
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="start-menu-container"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        bottom: '70px',
        left: '10px',
        width: '380px',
        height: '550px',
        background: 'var(--os-theme-card-bg, rgba(30, 30, 35, 0.85))',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 5001,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        animation: 'slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        transition: 'background 0.5s ease'
      }}
    >
      {/* Header / Search */}
      <div style={{ padding: '20px 20px 10px 20px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', background: 'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {getGreeting()}, Abhinav
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }}>🔍</span>
          <input
            type="text"
            placeholder="Search for apps, files, or settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '10px 10px 10px 35px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.2)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.background = 'rgba(0,0,0,0.4)'}
            onBlur={(e) => e.target.style.background = 'rgba(0,0,0,0.2)'}
          />
        </div>
      </div>

      {/* Tabs (Pinned / All) */}
      {!searchQuery && (
        <div style={{ display: 'flex', padding: '0 20px', gap: '15px', marginBottom: '10px', fontSize: '13px', fontWeight: 600 }}>
          <div
            onClick={() => setActiveTab('pinned')}
            style={{
              cursor: 'pointer',
              color: activeTab === 'pinned' ? '#fff' : '#888',
              borderBottom: activeTab === 'pinned' ? '2px solid var(--os-theme-accent, var(--accent))' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.2s'
            }}
          >
            Pinned
          </div>
          <div
            onClick={() => setActiveTab('all')}
            style={{
              cursor: 'pointer',
              color: activeTab === 'all' ? '#fff' : '#888',
              borderBottom: activeTab === 'all' ? '2px solid var(--os-theme-accent, var(--accent))' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.2s'
            }}
          >
            All Apps
          </div>
        </div>
      )}

      {/* App Grid / List */}
      <div className="custom-scrollbar" style={{ flexGrow: 1, overflowY: 'auto', padding: '0 20px 20px 20px' }}>
        <div style={{
          display: activeTab === 'pinned' && !searchQuery ? 'grid' : 'flex',
          gridTemplateColumns: activeTab === 'pinned' && !searchQuery ? 'repeat(4, 1fr)' : 'none',
          flexDirection: 'column',
          gap: activeTab === 'pinned' && !searchQuery ? '15px' : '5px'
        }}>
          {displayApps.map(appId => {
            const app = fileSystem[appId];
            if (!app) return null;
            const isHidden = hiddenApps.includes(appId);
            const isList = activeTab === 'all' || searchQuery;

            return (
              <div
                key={appId}
                onClick={() => { openApp(appId); onClose(); }}
                className="start-menu-item"
                style={{
                  display: 'flex',
                  flexDirection: isList ? 'row' : 'column',
                  alignItems: 'center',
                  gap: isList ? '15px' : '8px',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: isHidden ? 0.5 : 1,
                  filter: isHidden ? 'grayscale(100%)' : 'none',
                  textAlign: isList ? 'left' : 'center'
                }}
              >
                <div style={{
                  width: isList ? '32px' : '48px',
                  height: isList ? '32px' : '48px',
                  background: isList ? 'transparent' : 'rgba(255,255,255,0.05)',
                  borderRadius: isList ? '0' : '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isList ? 'none' : '0 4px 10px rgba(0,0,0,0.2)'
                }}>
                  <img src={app.icon} width={isList ? "24" : "32"} height={isList ? "24" : "32"} alt={app.title} />
                </div>
                <span style={{ fontSize: '13px', color: '#ddd', lineHeight: '1.2', fontWeight: isList ? 500 : 400 }}>
                  {app.title}
                </span>
              </div>
            );
          })}
          {displayApps.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No apps found
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '15px 20px',
        background: 'rgba(0,0,0,0.2)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* User Profile */}
        <div
          onClick={() => { openApp('about'); onClose(); }}
          className="start-menu-footer-item"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }}
        >
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3daee9, #2c3e50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
            AS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Abhinav Sharma</span>
            <span style={{ fontSize: '11px', color: '#aaa' }}>Administrator</span>
          </div>
        </div>

        {/* Power Button */}
        <div
          onClick={toggleLogout}
          className="start-menu-footer-item"
          style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
          title="Power Options"
        >
          <svg width="20" height="20" fill="none" stroke="#ff5f56" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
            <line x1="12" y1="2" x2="12" y2="12"></line>
          </svg>
        </div>
      </div>

      <style>{`
        .start-menu-item:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }
        .start-menu-footer-item:hover {
          background: rgba(255,255,255,0.1);
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
});

export default StartMenu;
