/**
 * System Data
 * 
 * Contains mock data for the System Monitor application.
 */

export const SYSTEM_SPECS = {
  cpu: 'Neural Quantum Processor',
  cores: 16,
  memory: '64 GB DDR5',
  gpu: 'RTX 5090 Ti',
  os: 'AbhinavOS v5.0',
  kernel: 'Linux 6.8.0-generic'
};

export const MOCK_PROCESSES = [
  { name: 'System', cpu: 2, mem: 150, user: 'root' },
  { name: 'WindowServer', cpu: 5, mem: 300, user: 'root' },
  { name: 'ReactRenderer', cpu: 12, mem: 450, user: 'user' },
  { name: 'Chrome', cpu: 15, mem: 800, user: 'user' },
  { name: 'Spotify', cpu: 3, mem: 200, user: 'user' },
  { name: 'VS Code', cpu: 8, mem: 600, user: 'user' },
  { name: 'Terminal', cpu: 1, mem: 50, user: 'user' },
  { name: 'Node.js', cpu: 4, mem: 180, user: 'user' },
  { name: 'Docker', cpu: 6, mem: 400, user: 'root' },
  { name: 'Discord', cpu: 2, mem: 250, user: 'user' },
  { name: 'Antigravity', cpu: 45, mem: 1200, user: 'ai_agent' }
];
