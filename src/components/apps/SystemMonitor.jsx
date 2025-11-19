import React, { useState, useEffect } from 'react';

const SystemMonitor = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [cpuHistory, setCpuHistory] = useState(new Array(40).fill(10));
  const [memHistory, setMemHistory] = useState(new Array(40).fill(20));
  const [netHistory, setNetHistory] = useState(new Array(40).fill(5));

  // Simulate Live Data
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuHistory(prev => [...prev.slice(1), Math.min(100, Math.max(5, prev[prev.length-1] + (Math.random() * 20 - 10)))]);
      setMemHistory(prev => [...prev.slice(1), Math.min(90, Math.max(20, prev[prev.length-1] + (Math.random() * 10 - 5)))]);
      setNetHistory(prev => [...prev.slice(1), Math.random() * 50]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'resources': return <ResourcesTab cpu={cpuHistory} mem={memHistory} net={netHistory} />;
      case 'processes': return <ProcessesTab />;
      case 'system': return <SystemInfoTab />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1e1e1e', color: '#eee', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* Sidebar / Tabs Header */}
      <div style={{ display: 'flex', background: '#252526', borderBottom: '1px solid #333' }}>
        <TabButton active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} icon="📈" label="Performance" />
        <TabButton active={activeTab === 'processes'} onClick={() => setActiveTab('processes')} icon="⚙️" label="Processes" />
        <TabButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} icon="ℹ️" label="System Info" />
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, overflow: 'hidden', padding: '0' }}>
        {renderContent()}
      </div>

      {/* Footer Status */}
      <div style={{ padding: '5px 10px', background: '#007acc', color: '#fff', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Threads: 12 Active</span>
        <span>Uptime: 21 Years</span>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const ResourcesTab = ({ cpu, mem, net }) => (
  <div style={{ padding: '20px', overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <GraphWidget title="CPU (Brain Power)" data={cpu} color="#3daee9" value={`${Math.round(cpu[cpu.length-1])}%`} sub="Neural Engine v21" />
    <GraphWidget title="Memory (Knowledge)" data={mem} color="#2ecc71" value={`${Math.round(mem[mem.length-1])}%`} sub="Deakin Honours Cache" />
    <GraphWidget title="Network (Social)" data={net} color="#f1c40f" value={`${Math.round(net[net.length-1])} Kbps`} sub="LinkedIn/GitHub I/O" />
  </div>
);

const GraphWidget = ({ title, data, color, value, sub }) => {
  const points = data.map((val, i) => `${i * (100 / (data.length - 1))},${100 - val}`).join(' ');

  return (
    <div style={{ background: '#2d2d2d', padding: '15px', borderRadius: '8px', borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#aaa' }}>{sub}</div>
        </div>
        <div style={{ fontSize: '24px', fontWeight: '300', color: color }}>{value}</div>
      </div>
      
      <div style={{ height: '60px', width: '100%', background: 'rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
        <div style={{ position: 'absolute', top: '25%', width: '100%', borderTop: '1px dashed rgba(255,255,255,0.1)' }}></div>
        <div style={{ position: 'absolute', top: '50%', width: '100%', borderTop: '1px dashed rgba(255,255,255,0.1)' }}></div>
        <div style={{ position: 'absolute', top: '75%', width: '100%', borderTop: '1px dashed rgba(255,255,255,0.1)' }}></div>
        
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline 
            points={points} 
            fill="none" 
            stroke={color} 
            strokeWidth="2" 
            vectorEffect="non-scaling-stroke"
          />
          <polygon 
            points={`0,100 ${points} 100,100`} 
            fill={color} 
            opacity="0.2" 
          />
        </svg>
      </div>
    </div>
  );
};

const ProcessesTab = () => {
  const processes = [
    { pid: 431, name: 'python3', user: 'abhinav', cpu: 12.4, mem: 4.5, desc: 'AI/ML Logic Core' },
    { pid: 892, name: 'node_js', user: 'abhinav', cpu: 8.1, mem: 3.2, desc: 'React Renderer' },
    { pid: 101, name: 'embedded_c', user: 'root', cpu: 15.0, mem: 1.1, desc: 'Hardware Control' },
    { pid: 554, name: 'dotnet', user: 'system', cpu: 5.2, mem: 6.4, desc: 'Legacy Systems' },
    { pid: 221, name: 'git_daemon', user: 'abhinav', cpu: 0.5, mem: 0.4, desc: 'Version Control' },
    { pid: 339, name: 'lorawan_svc', user: 'net', cpu: 2.1, mem: 1.0, desc: 'IoT Connectivity' },
    { pid: 666, name: 'sleep', user: 'human', cpu: 0.1, mem: 0.1, desc: 'Rest Process (Low Priority)' },
    { pid: 777, name: 'coffee', user: 'human', cpu: 45.0, mem: 0.5, desc: 'Energy Injector' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '50px 100px 60px 60px 1fr', padding: '8px', background: '#252526', fontSize: '12px', fontWeight: 'bold', color: '#aaa' }}>
        <span>PID</span>
        <span>Name</span>
        <span>CPU%</span>
        <span>MEM%</span>
        <span>Description</span>
      </div>
      <div style={{ overflowY: 'auto', flexGrow: 1, fontSize: '13px', fontFamily: 'monospace' }}>
        {processes.map(p => (
          <div key={p.pid} className="process-row" style={{ display: 'grid', gridTemplateColumns: '50px 100px 60px 60px 1fr', padding: '6px 8px', borderBottom: '1px solid #2a2a2a', cursor: 'pointer' }}>
            <span style={{ color: '#569cd6' }}>{p.pid}</span>
            <span style={{ color: '#eee', fontWeight: 'bold' }}>{p.name}</span>
            <span style={{ color: p.cpu > 10 ? '#e74c3c' : '#ccc' }}>{p.cpu}</span>
            <span style={{ color: p.mem > 4 ? '#f1c40f' : '#ccc' }}>{p.mem}</span>
            <span style={{ color: '#888' }}>{p.desc}</span>
          </div>
        ))}
      </div>
      <style>{`
        .process-row:hover { background: rgba(61, 174, 233, 0.2); }
      `}</style>
    </div>
  );
};

const SystemInfoTab = () => (
  // FIXED: Added overflowY and height to allow scrolling
  <div style={{ padding: '30px', textAlign: 'center', overflowY: 'auto', height: '100%' }}>
    <img src="https://cdn-icons-png.flaticon.com/512/900/900782.png" width="80" style={{ marginBottom: '20px' }} alt="chip" />
    <h2 style={{ margin: 0 }}>AbhinavOS 5.0</h2>
    <p style={{ color: '#aaa', fontSize: '14px' }}>Kernel: Linux 6.8 (Student Edition)</p>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '40px', textAlign: 'left' }}>
      <InfoItem label="Processor" value="Neural Engine v21 (Human)" />
      <InfoItem label="Memory" value="Software Engineering Honours (Deakin)" />
      <InfoItem label="Graphics" value="ReactJS / CSS3 Rendering Pipeline" />
      <InfoItem label="Storage" value="Full Stack & Embedded Knowledge Base" />
      <InfoItem label="Network" value="English (Native), Code (Fluent)" />
      <InfoItem label="Hardware" value="Arduino, Raspberry Pi, LoRaWAN" />
    </div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div style={{ background: '#252526', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
    <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '5px' }}>{value}</div>
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <div 
    onClick={onClick}
    style={{ 
      padding: '10px 20px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px',
      background: active ? '#1e1e1e' : 'transparent',
      borderBottom: active ? '2px solid #3daee9' : '2px solid transparent',
      color: active ? '#fff' : '#aaa'
    }}
  >
    <span>{icon}</span> {label}
  </div>
);

export default SystemMonitor;