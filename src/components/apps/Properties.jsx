import React from 'react';
import { useOS } from '../../context/OSContext';
import { fileSystem } from '../../data/filesystem';

const Properties = () => {
  const { propTargetId, hiddenApps, toggleHideApp } = useOS(); // Import hidden logic

  // Default data
  let data = {
    title: 'Unknown',
    icon: 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png',
    type: 'Unknown File',
    size: '0 KB',
    location: 'C:\\Users\\Abhinav\\Desktop'
  };

  if (propTargetId && fileSystem[propTargetId]) {
    const item = fileSystem[propTargetId];
    data.title = item.title;
    data.icon = item.icon;
    
    if (propTargetId.includes('proj')) {
        data.type = 'Project Directory';
        data.size = '145 MB';
        data.location = '~/projects';
    } else if (propTargetId === 'about') {
        data.type = 'System File';
        data.size = '2.4 MB';
        data.location = '~/system';
    } else if (propTargetId === 'terminal') {
        data.type = 'Executable (ELF)';
        data.size = '450 KB';
        data.location = '/bin/bash';
    } else if (propTargetId === 'contact') {
        data.type = 'Application Link';
        data.size = '4 KB';
        data.location = '~/desktop';
    } else {
        data.type = 'Application';
        data.size = '12 MB';
    }
  } else if (propTargetId) {
      data.title = propTargetId.charAt(0).toUpperCase() + propTargetId.slice(1);
      data.type = 'Shortcut';
      data.location = 'Desktop';
  }

  return (
    <div style={{ padding: '20px', color: '#eee', fontSize: '13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={data.icon} width="48" alt="icon" />
            <div style={{ width: '100%' }}>
                <input type="text" value={data.title} readOnly style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid #444', color: '#fff', padding: '5px', borderRadius: '4px' }} />
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '10px 0', marginBottom: '20px' }}>
            <div style={{ color: '#aaa' }}>Type:</div>
            <div>{data.type}</div>
            <div style={{ color: '#aaa' }}>Location:</div>
            <div>{data.location}</div>
            <div style={{ color: '#aaa' }}>Size:</div>
            <div>{data.size}</div>
            <div style={{ color: '#aaa' }}>Created:</div>
            <div>Nov 20, 2025, 1:46 AM</div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', display: 'flex', gap: '10px', fontSize: '12px' }}>
            <label style={{ display: 'flex', gap: '5px' }}>
                <input type="checkbox" checked readOnly /> Read-only
            </label>
            <label style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
                {/* CONNECTED CHECKBOX */}
                <input 
                    type="checkbox" 
                    checked={hiddenApps.includes(propTargetId)} 
                    onChange={() => toggleHideApp(propTargetId)} 
                /> 
                Hidden
            </label>
        </div>
    </div>
  );
};

export default Properties;