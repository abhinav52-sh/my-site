import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';

const Settings = ({ initialTab = 'personalization' }) => {
  const { background, setBackground, resetIcons, taskbarConfig, updateTaskbarConfig, themeConfig, updateThemeConfig, resetThemeConfig, soundEnabled, toggleSound, osTheme, updateOSTheme, particlesEnabled, toggleParticles } = useOS();
  const [activeTab, setActiveTab] = useState(initialTab);

  const gradients = [
    { name: 'Midnight', value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)' },
    { name: 'Ocean', value: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
    { name: 'Nebula', value: 'linear-gradient(135deg, #c33764 0%, #1d2671 100%)' },
  ];

  const wallpapers = [
    { name: 'Default', value: 'url(/wallpaper.png)' },
    { name: 'Mountains', value: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop)' },
    { name: 'Abstract', value: 'url(https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop)' },
    { name: 'Cyberpunk', value: 'url(https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=2000&auto=format&fit=crop)' },
  ];

  const animatedBackgrounds = [
    {
      name: 'Aurora Flow',
      value: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      animated: true
    },
    {
      name: 'Cyber Wave',
      value: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #4facfe)',
      animated: true
    },
    {
      name: 'Neon Pulse',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 100%)',
      animated: true
    },
    {
      name: 'Matrix Flow',
      value: 'linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #0f2027)',
      animated: true
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', color: 'var(--os-theme-text, #eee)', fontSize: '14px', transition: 'color 0.5s ease' }}>
      {/* Sidebar */}
      <div style={{ width: '180px', background: 'var(--os-theme-card-bg, rgba(0,0,0,0.2))', padding: '20px 10px', borderRight: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.5s ease' }}>
        <div style={{ marginBottom: '20px', paddingLeft: '10px', fontSize: '18px', fontWeight: 'bold' }}>Settings</div>
        <SidebarItem label="Personalization" active={activeTab === 'personalization'} onClick={() => setActiveTab('personalization')} icon="🎨" />
        <SidebarItem label="Appearance" active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} icon="✨" />
        <SidebarItem label="Taskbar" active={activeTab === 'taskbar'} onClick={() => setActiveTab('taskbar')} icon="📌" />
        <SidebarItem label="System" active={activeTab === 'system'} onClick={() => setActiveTab('system')} icon="💻" />
        <SidebarItem label="About" active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon="ℹ️" />
      </div>

      {/* Content */}
      <div style={{ flexGrow: 1, padding: '30px', overflowY: 'auto' }}>
        {activeTab === 'personalization' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Personalization</h2>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#aaa' }}>Background</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
                {gradients.map((g, i) => (
                  <div
                    key={i}
                    onClick={() => setBackground(g.value)}
                    style={{
                      height: '80px', borderRadius: '8px', cursor: 'pointer',
                      background: g.value,
                      border: background === g.value ? '2px solid #3daee9' : '2px solid transparent',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}
                    title={g.name}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#aaa' }}>Wallpapers</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
                {wallpapers.map((w, i) => (
                  <div
                    key={i}
                    onClick={() => setBackground(w.value)}
                    style={{
                      height: '80px', borderRadius: '8px', cursor: 'pointer',
                      backgroundImage: w.value, backgroundSize: 'cover', backgroundPosition: 'center',
                      border: background === w.value ? '2px solid #3daee9' : '2px solid transparent',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}
                    title={w.name}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#aaa' }}>Animated</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
                {animatedBackgrounds.map((bg, i) => (
                  <div
                    key={i}
                    onClick={() => setBackground(bg.value)}
                    style={{
                      height: '80px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: bg.value,
                      backgroundSize: '400% 400%',
                      animation: bg.animated ? 'gradientShift 15s ease infinite' : 'none',
                      border: background === bg.value ? '2px solid #3daee9' : '2px solid transparent',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}
                    title={bg.name}
                  />
                ))}
              </div>
              <style>{`
                @keyframes gradientShift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}</style>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Appearance</h2>

            {/* OS Theme */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#aaa' }}>OS Theme</h3>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '15px' }}>
                Choose a theme that affects the entire OS including User Profile, apps, and UI elements
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                {[
                  { key: 'default', name: 'Default', accent: '#3daee9', bg: '#0a0a0a' },
                  { key: 'cyberpunk', name: 'Cyberpunk', accent: '#ff006e', bg: '#0d0221' },
                  { key: 'terminal', name: 'Terminal', accent: '#00ff00', bg: '#000000' },
                  { key: 'sunset', name: 'Sunset', accent: '#ff6b6b', bg: '#1a1a2e' }
                ].map(theme => (
                  <div
                    key={theme.key}
                    onClick={() => updateOSTheme(theme.key)}
                    style={{
                      height: '100px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: `linear-gradient(135deg, ${theme.bg}, ${theme.accent}40)`,
                      border: osTheme === theme.key ? `3px solid ${theme.accent}` : '2px solid rgba(255,255,255,0.1)',
                      boxShadow: osTheme === theme.key ? `0 0 20px ${theme.accent}50` : '0 4px 6px rgba(0,0,0,0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                    title={theme.name}
                  >
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: theme.accent,
                      boxShadow: `0 0 15px ${theme.accent}80`
                    }} />
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{theme.name}</div>
                    {osTheme === theme.key && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: '16px'
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#aaa' }}>Accent Color</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="color"
                  value={themeConfig.accentColor}
                  onChange={(e) => updateThemeConfig('accentColor', e.target.value)}
                  style={{ width: '60px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                />
                <div style={{ color: '#ccc', fontSize: '14px' }}>{themeConfig.accentColor}</div>
                <button
                  onClick={() => updateThemeConfig('accentColor', '#3daee9')}
                  style={{
                    padding: '8px 16px', background: '#444', color: '#fff',
                    border: 'none', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '13px', marginLeft: 'auto'
                  }}
                >Reset to Default</button>
              </div>
            </div>

            {/* Window Opacity */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ marginBottom: '10px', fontSize: '16px', color: '#aaa' }}>Window Opacity</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={themeConfig.windowOpacity}
                  onChange={(e) => updateThemeConfig('windowOpacity', parseFloat(e.target.value))}
                  style={{ flex: 1, cursor: 'pointer' }}
                />
                <span style={{ color: '#ccc', fontSize: '14px', minWidth: '50px' }}>
                  {Math.round(themeConfig.windowOpacity * 100)}%
                </span>
              </div>
            </div>

            {/* Font Size */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#aaa' }}>Font Size</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {['small', 'medium', 'large', 'xlarge'].map(size => (
                  <button
                    key={size}
                    onClick={() => updateThemeConfig('fontSize', size)}
                    style={{
                      padding: '10px',
                      background: themeConfig.fontSize === size ? 'var(--accent)' : '#444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      textTransform: 'capitalize'
                    }}
                  >{size}</button>
                ))}
              </div>
            </div>

            {/* Retro Mode */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#aaa' }}>Retro Mode (Windows 95/98)</h3>
              <ToggleSetting
                label="Enable retro mode"
                description="Classic Windows 95/98 aesthetic with flat design"
                checked={themeConfig.retroMode}
                onChange={(val) => updateThemeConfig('retroMode', val)}
              />
            </div>

            {/* Particle Effects */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#aaa' }}>Visual Effects</h3>
              <ToggleSetting
                label="Particle effects"
                description="Show animated particles throughout the OS"
                checked={particlesEnabled}
                onChange={toggleParticles}
              />
            </div>

            {/* Reset All */}
            <button
              onClick={resetThemeConfig}
              style={{
                padding: '12px 24px', background: '#dc3545', color: 'white',
                border: 'none', borderRadius: '6px', cursor: 'pointer',
                fontSize: '14px', fontWeight: 'bold'
              }}
            >
              Reset All Settings to Default
            </button>
          </div>
        )}

        {activeTab === 'taskbar' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Taskbar</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', color: '#aaa' }}>Appearance</h3>

              <ToggleSetting
                label="Show app names"
                description="Display application names next to icons"
                checked={taskbarConfig.showAppNames}
                onChange={(val) => updateTaskbarConfig('showAppNames', val)}
              />

              <ToggleSetting
                label="Show clock"
                description="Display system clock on taskbar"
                checked={taskbarConfig.showClock}
                onChange={(val) => updateTaskbarConfig('showClock', val)}
              />

              <ToggleSetting
                label="Enable calendar"
                description="Show calendar widget when clicking clock"
                checked={taskbarConfig.enableCalendar}
                onChange={(val) => updateTaskbarConfig('enableCalendar', val)}
              />

              <ToggleSetting
                label="Sound effects"
                description="Play sounds for clicks and window actions"
                checked={soundEnabled}
                onChange={toggleSound}
              />
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>System</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px', fontSize: '16px', color: '#aaa' }}>Desktop Icons</h3>
              <button
                onClick={resetIcons}
                style={{
                  padding: '10px 20px', background: '#3daee9', color: 'white',
                  border: 'none', borderRadius: '4px', cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Reset Icon Layout
              </button>
              <p style={{ marginTop: '10px', color: '#888', fontSize: '12px' }}>Restores desktop icons to their default grid positions.</p>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>About</h2>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>AbhinavOS</div>
              <div style={{ color: '#aaa', marginBottom: '20px' }}>Version 5.0.1</div>
              <p>A React-based desktop environment simulation showcasing web development skills.</p>
              <p style={{ marginTop: '20px', color: '#666' }}>© 2025 Abhinav Sharma</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ToggleSetting = ({ label, description, checked, onChange }) => (
  <div style={{
    background: 'rgba(255,255,255,0.05)',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div style={{ flex: 1 }}>
      <div style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: '#888', fontSize: '12px' }}>{description}</div>
    </div>
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: '48px',
        height: '24px',
        borderRadius: '12px',
        background: checked ? '#3daee9' : '#444',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s'
      }}
    >
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: '2px',
        left: checked ? '26px' : '2px',
        transition: 'left 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }} />
    </div>
  </div>
);

const SidebarItem = ({ label, active, onClick, icon }) => (
  <div
    onClick={onClick}
    style={{
      padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', marginBottom: '5px',
      background: active ? 'var(--os-theme-accent, #3daee9)33' : 'transparent',
      color: active ? 'var(--os-theme-accent, #3daee9)' : '#ccc', display: 'flex', gap: '10px', alignItems: 'center',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
    onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'transparent')}
  >
    <span>{icon}</span> {label}
  </div>
);

export default Settings;
