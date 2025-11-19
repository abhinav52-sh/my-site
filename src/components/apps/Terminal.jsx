import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';

const Terminal = () => {
  const { openApp } = useOS();
  const [history, setHistory] = useState([
    { type: 'output', text: "Welcome to AbhinavOS v5.0\nType 'help' to see available commands." }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      const newHistory = [...history, { type: 'input', text: input }];
      
      let response = "";
      if (cmd === 'help') response = "Available: help, ls, whoami, clear, open [app], contact";
      else if (cmd === 'ls') response = "Apps: projects, about, skills, terminal";
      else if (cmd === 'whoami') response = "Abhinav Sharma - Full Stack Engineer";
      else if (cmd === 'contact') response = "LinkedIn: linkedin.com/in/abhinav431";
      else if (cmd === 'clear') { setHistory([]); setInput(""); return; }
      else if (cmd.startsWith('open ')) {
        const app = cmd.split(' ')[1];
        openApp(app);
        response = `Opening ${app}...`;
      } else if (cmd !== "") {
        response = `Command not found: ${cmd}`;
      }

      if (response) newHistory.push({ type: 'output', text: response });
      setHistory(newHistory);
      setInput("");
    }
  };

  return (
    <div 
      style={{ fontFamily: 'monospace', padding: '15px', height: '100%', background: '#1e1e1e', color: '#ccc', fontSize: '13px' }} 
      onClick={() => document.getElementById('term-input')?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} style={{ marginBottom: '5px', whiteSpace: 'pre-wrap', color: line.type === 'input' ? '#fff' : '#ccc' }}>
          {line.type === 'input' && <span style={{ color: '#3daee9', marginRight: '8px' }}>abhinav@system:~$</span>}
          {line.text}
        </div>
      ))}
      <div style={{ display: 'flex' }}>
        <span style={{ color: '#3daee9', marginRight: '8px' }}>abhinav@system:~$</span>
        <input 
          id="term-input"
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ background: 'transparent', border: 'none', color: '#fff', flexGrow: 1, outline: 'none', fontFamily: 'inherit' }} 
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default Terminal;