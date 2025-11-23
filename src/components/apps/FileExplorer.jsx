import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { fileSystem } from '../../data/filesystem';

const FileExplorer = () => {
  const { openApp, hiddenApps, openProperties } = useOS();

  // Default to projects since Home is gone
  const [currentPath, setCurrentPath] = useState('projects');
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, itemId: null });

  // Helper to get items by category
  const getItemsByCategory = (category) => {
    return Object.keys(fileSystem)
      .filter(key => fileSystem[key].category === category)
      .map(key => ({
        id: key,
        label: fileSystem[key].title,
        icon: category === 'games' ? 'game' : 'app',
        action: () => openApp(key)
      }));
  };

  const contents = {
    projects: getItemsByCategory('projects'),
    games: getItemsByCategory('games'),
    docs: [
      {
        id: 'resume', label: 'Resume.pdf', icon: 'pdf', action: () => {
          const link = document.createElement('a');
          link.href = '/resume.pdf';
          link.download = 'Abhinav_Sharma_Resume.pdf';
          link.click();
        }
      },
      { id: 'about', label: 'About Me', icon: 'app', action: () => openApp('about') },
      { id: 'contact', label: 'Contact Info', icon: 'app', action: () => openApp('contact') },
    ]
  };

  const getIcon = (type) => {
    if (type === 'folder') return 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png';
    if (type === 'app') return 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png';
    if (type === 'game') return 'https://cdn-icons-png.flaticon.com/512/808/808439.png'; // Game Controller Icon
    if (type === 'pdf') return 'https://cdn-icons-png.flaticon.com/512/337/337946.png';
    if (type === 'txt') return 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png';
    return '';
  };

  const handleContextMenu = (e, itemId) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      itemId: itemId
    });
  };

  const handleCloseMenu = () => {
    if (contextMenu.show) setContextMenu({ ...contextMenu, show: false });
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: 'transparent' }} onClick={handleCloseMenu}>
      {/* Sidebar */}
      <div style={{ width: '160px', background: 'var(--os-theme-card-bg)', padding: '15px', borderRight: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '5px', transition: 'background 0.5s ease' }}>
        <div style={{ color: '#666', marginBottom: '5px', fontWeight: 700, fontSize: '11px' }}>LOCATIONS</div>

        {/* Removed Home Sidebar Item */}
        <SidebarItem label="Projects" active={currentPath === 'projects'} onClick={() => setCurrentPath('projects')} icon="🚀" />
        <SidebarItem label="Games" active={currentPath === 'games'} onClick={() => setCurrentPath('games')} icon="🎮" />
        <SidebarItem label="Documents" active={currentPath === 'docs'} onClick={() => setCurrentPath('docs')} icon="📄" />

        <div style={{ color: '#666', marginTop: '15px', marginBottom: '5px', fontWeight: 700, fontSize: '11px' }}>DRIVES</div>
        <SidebarItem label="512GB NVMe" icon="💾" />
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '15px', alignContent: 'start', color: 'var(--os-theme-text)', transition: 'color 0.5s ease' }}>
        {contents[currentPath] && contents[currentPath]
          .filter(item => !hiddenApps.includes(item.id))
          .map(item => (
            <div
              key={item.id}
              onClick={item.action}
              onContextMenu={(e) => handleContextMenu(e, item.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <img src={getIcon(item.icon)} width="42" style={{ marginBottom: '8px' }} alt="icon" />
              <span style={{ fontSize: '12px', color: '#ccc', wordBreak: 'break-word' }}>{item.label}</span>
            </div>
          ))}
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div style={{
          position: 'fixed',
          top: contextMenu.y,
          left: contextMenu.x,
          background: '#252526',
          border: '1px solid #454545',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          zIndex: 9999,
          minWidth: '150px',
          display: 'flex',
          flexDirection: 'column',
          padding: '4px 0'
        }}>
          <div
            style={{ padding: '8px 15px', cursor: 'pointer', color: '#eee', fontSize: '13px' }}
            onMouseEnter={(e) => e.target.style.background = '#094771'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            onClick={() => {
              const item = contents[currentPath].find(i => i.id === contextMenu.itemId);
              if (item) item.action();
            }}
          >
            Open
          </div>
          <div
            style={{ padding: '8px 15px', cursor: 'pointer', color: '#eee', fontSize: '13px' }}
            onMouseEnter={(e) => e.target.style.background = '#094771'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            onClick={() => openProperties(contextMenu.itemId)}
          >
            Properties
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ label, active, onClick, icon }) => (
  <div
    onClick={onClick}
    style={{
      padding: '8px 10px', borderRadius: '4px', cursor: 'pointer',
      background: active ? 'var(--os-theme-accent, #3daee9)33' : 'transparent',
      color: active ? 'var(--os-theme-accent, #3daee9)' : '#ccc', display: 'flex', gap: '10px',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
    onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'transparent')}
  >
    <span>{icon}</span> {label}
  </div>
);

export default FileExplorer;