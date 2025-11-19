import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';

const FileExplorer = () => {
  const { openApp, hiddenApps } = useOS();
  
  // Default to projects since Home is gone
  const [currentPath, setCurrentPath] = useState('projects');

  const contents = {
    projects: [
      { id: 'proj_helmet', label: 'Smart_Helmet', icon: 'app', action: () => openApp('proj_helmet') },
      { id: 'proj_capstone', label: 'DiscountMate', icon: 'app', action: () => openApp('proj_capstone') },
      { id: 'proj_robot', label: 'Robot_Ctrl', icon: 'app', action: () => openApp('proj_robot') },
      { id: 'proj_dev', label: 'DevDeakin', icon: 'app', action: () => openApp('proj_dev') },
    ],
    docs: [
      { id: 'about', label: 'Resume.pdf', icon: 'pdf', action: () => openApp('about') },
      { id: 'contact', label: 'Contact Info', icon: 'app', action: () => openApp('contact') },
    ]
  };

  const getIcon = (type) => {
    if (type === 'folder') return 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png';
    if (type === 'app') return 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png';
    if (type === 'pdf') return 'https://cdn-icons-png.flaticon.com/512/337/337946.png';
    if (type === 'txt') return 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png';
    return '';
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Sidebar */}
      <div style={{ width: '160px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRight: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ color: '#666', marginBottom: '5px', fontWeight: 700, fontSize: '11px' }}>LOCATIONS</div>
        
        {/* Removed Home Sidebar Item */}
        <SidebarItem label="Projects" active={currentPath === 'projects'} onClick={() => setCurrentPath('projects')} icon="🚀" />
        <SidebarItem label="Documents" active={currentPath === 'docs'} onClick={() => setCurrentPath('docs')} icon="📄" />
        
        <div style={{ color: '#666', marginTop: '15px', marginBottom: '5px', fontWeight: 700, fontSize: '11px' }}>DRIVES</div>
        <SidebarItem label="512GB NVMe" icon="💾" />
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '15px', alignContent: 'start' }}>
        {contents[currentPath] && contents[currentPath]
        .filter(item => !hiddenApps.includes(item.id))
        .map(item => (
          <div 
            key={item.id} 
            onClick={item.action}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <img src={getIcon(item.icon)} width="42" style={{ marginBottom: '8px' }} alt="icon" />
            <span style={{ fontSize: '12px', color: '#ccc', wordBreak: 'break-word' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SidebarItem = ({ label, active, onClick, icon }) => (
    <div 
        onClick={onClick}
        style={{ 
            padding: '8px 10px', borderRadius: '4px', cursor: 'pointer', 
            background: active ? 'rgba(61, 174, 233, 0.2)' : 'transparent',
            color: active ? '#3daee9' : '#ccc', display: 'flex', gap: '10px'
        }}
        onMouseEnter={(e) => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'transparent')}
    >
        <span>{icon}</span> {label}
    </div>
);

export default FileExplorer;