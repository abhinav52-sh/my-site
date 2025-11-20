import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { fileSystem } from '../../data/filesystem';

const Terminal = () => {
  const { openApp, closeApp } = useOS();
  const [history, setHistory] = useState([
    { type: 'output', text: "Welcome to AbhinavOS v5.0\nType 'help' to see available commands or 'ls' to list apps." }
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState([]); // [] = root, ['projects'] = projects dir

  // Autocomplete State
  const [activeSuggestions, setActiveSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [ghostSuggestion, setGhostSuggestion] = useState("");
  const [menuAbove, setMenuAbove] = useState(false); // Track if menu should appear above
  const suggestionRefs = useRef([]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const terminalRef = useRef(null); // Reference to terminal container

  // Expanded Virtual File System
  const virtualFS = {
    root: {
      'about': { type: 'app', appId: 'about' },
      'contact': { type: 'app', appId: 'contact' },
      'projects': { type: 'dir', appId: 'projects' },
      'system-monitor': { type: 'app', appId: 'skills' },
      'terminal': { type: 'app', appId: 'terminal' },
      'settings': { type: 'app', appId: 'settings' },
      'settings': { type: 'app', appId: 'settings' },
      'documents': { type: 'dir', appId: 'projects' },
      'games': { type: 'dir', appId: 'games' },
    },
    games: {
      'snake': { type: 'app', appId: 'game_snake' },
      '2048': { type: 'app', appId: 'game_2048' },
      'tictactoe': { type: 'app', appId: 'game_tictactoe' },
      'maze': { type: 'app', appId: 'game_maze' },
    },
    projects: {
      'smart-helmet': { type: 'file', appId: 'proj_helmet' },
      'discount-mate': { type: 'file', appId: 'proj_capstone' },
      'patrolling-robot': { type: 'file', appId: 'proj_robot' },
      'dev-deakin': { type: 'file', appId: 'proj_dev' },
    },
    documents: {
      'resume.pdf': { type: 'file', action: () => window.open('/resume.pdf', '_blank') },
      'notes.txt': { type: 'file', content: "TODO: Update portfolio..." },
    }
  };

  const getPrompt = () => {
    const pathStr = currentPath.length === 0 ? '~' : `~/${currentPath.join('/')}`;
    return `abhinav@system:${pathStr}$`;
  };

  const getDirContent = (pathArray) => {
    if (pathArray.length === 0) return virtualFS.root;
    const dirName = pathArray[0];
    return virtualFS[dirName] || null;
  };

  const resolvePath = (pathStr) => {
    if (!pathStr || pathStr === '.') return currentPath;
    if (pathStr === '~') return [];
    if (pathStr === '..') return currentPath.slice(0, -1);

    // Handle simple relative paths for now (1 level deep)
    const target = pathStr.endsWith('/') ? pathStr.slice(0, -1) : pathStr;

    // Check if it's a valid directory in current path
    const currentDir = getDirContent(currentPath);
    if (currentDir && currentDir[target] && currentDir[target].type === 'dir') {
      return [...currentPath, target];
    }

    // Check if it's a valid directory in root (absolute-ish)
    if (virtualFS.root[target] && virtualFS.root[target].type === 'dir') {
      return [target];
    }

    return null;
  };

  const commands = ['help', 'ls', 'whoami', 'clear', 'cd', 'snake', '2048', 'tictactoe', 'maze'];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]); // Only scroll on history changes, not when suggestions appear

  // Detect if menu should appear above or below based on available space
  useEffect(() => {
    if (activeSuggestions.length > 0 && inputRef.current && terminalRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const terminalRect = terminalRef.current.getBoundingClientRect();
      const spaceBelow = terminalRect.bottom - inputRect.bottom;

      // If less than 200px space below, show above
      setMenuAbove(spaceBelow < 200);
    }
  }, [activeSuggestions]);

  // Scroll selected suggestion into view
  useEffect(() => {
    if (suggestionIndex >= 0 && suggestionRefs.current[suggestionIndex]) {
      suggestionRefs.current[suggestionIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [suggestionIndex]);

  // Ghost Text Logic (Simple prefix match)
  useEffect(() => {
    if (input && activeSuggestions.length === 0) {
      const lowerInput = input.toLowerCase();
      const currentDir = getDirContent(currentPath);
      const currentItems = currentDir ? Object.keys(currentDir) : [];
      const allPossibilities = [...commands, ...currentItems];

      // Only show ghost text if it's a unique match or a very strong signal
      // For simplicity, we'll just check if there's a single direct match in the current context

      // Check for 'cd' specifically
      if (lowerInput.startsWith('cd ')) {
        const query = lowerInput.slice(3);
        const dirs = currentItems.filter(k => currentDir[k].type === 'dir');
        const match = dirs.find(d => d.startsWith(query));
        if (match && match !== query) {
          setGhostSuggestion(match.slice(query.length));
          return;
        }
      }
      // Check for 'ls' specifically
      else if (lowerInput.startsWith('ls ')) {
        const query = lowerInput.slice(3);
        const match = currentItems.find(item => item.startsWith(query));
        if (match && match !== query) {
          setGhostSuggestion(match.slice(query.length));
          return;
        }
      }
      // General
      else if (!lowerInput.includes(' ')) {
        const match = allPossibilities.find(item => item.startsWith(lowerInput));
        if (match && match !== lowerInput) {
          setGhostSuggestion(match.slice(lowerInput.length));
          return;
        }
      }

      setGhostSuggestion("");
    } else {
      setGhostSuggestion("");
    }
  }, [input, currentPath, activeSuggestions]);

  const executeCommand = (cmdLine) => {
    const newHistory = [...history, { type: 'input', text: cmdLine, prompt: getPrompt() }];

    if (cmdLine) {
      setCommandHistory(prev => [...prev, cmdLine]);
      setHistoryIndex(-1);
    }

    const parts = cmdLine.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    let response = "";
    const currentDir = getDirContent(currentPath);

    if (cmd === 'help') {
      response = "Available commands:\n  ls [dir]      - List contents\n  cd [dir]      - Change directory\n  clear         - Clear terminal\n  exit          - Close terminal\n  [name]        - Run app or open file\n\nGames:\n  snake         - Play Snake\n  2048          - Play 2048 puzzle\n  tictactoe     - Play Tic-Tac-Toe\n  maze          - Play Maze Runner\n\nTip: Use 'Tab' for auto-completion. Press 'ESC' to exit games.";
    }
    else if (cmd === 'ls') {
      let targetDir = currentDir;

      if (args) {
        const resolved = resolvePath(args);
        if (resolved) {
          targetDir = getDirContent(resolved);
        } else {
          response = `ls: cannot access '${args}': No such directory`;
          targetDir = null;
        }
      }

      if (targetDir) {
        const sortedKeys = Object.keys(targetDir).sort((a, b) => {
          const itemA = targetDir[a];
          const itemB = targetDir[b];
          // Directories last
          if (itemA.type !== 'dir' && itemB.type === 'dir') return -1;
          if (itemA.type === 'dir' && itemB.type !== 'dir') return 1;
          // Alphabetical
          return a.localeCompare(b);
        });

        const items = sortedKeys.map(key => {
          const item = targetDir[key];
          return item.type === 'dir' ? `${key}/` : key;
        });
        response = items.length > 0 ? items.join('  ') : "(empty)";
      }
    }
    else if (cmd === 'clear') {
      setHistory([]);
      setInput("");
      setGhostSuggestion("");
      setActiveSuggestions([]);
      return;
    }
    else if (cmd === 'exit') {
      closeApp('terminal');
      return;
    }
    else if (cmd === 'cd') {
      if (!args || args === '~') {
        setCurrentPath([]);
      } else {
        const resolved = resolvePath(args);
        if (resolved) {
          setCurrentPath(resolved);
        } else {
          response = `cd: ${args}: No such directory`;
        }
      }
    }
    else if (cmd === 'whoami') {
      response = "Abhinav Sharma - Full Stack Engineer";
    }
    // Game Commands
    else if (cmd === 'snake') {
      openApp('game_snake');
      response = "Launching Snake...";
    }
    else if (cmd === '2048') {
      openApp('game_2048');
      response = "Launching 2048...";
    }
    else if (cmd === 'tictactoe') {
      openApp('game_tictactoe');
      response = "Launching Tic-Tac-Toe...";
    }
    else if (cmd === 'maze') {
      openApp('game_maze');
      response = "Launching Maze Runner...";
    }
    // Direct Execution
    else if (currentDir && currentDir[cmdLine]) {
      const item = currentDir[cmdLine];
      if (item.type === 'app' || item.type === 'file') {
        if (item.appId) {
          openApp(item.appId);
          response = `Opening ${cmdLine}...`;
        } else if (item.action) {
          item.action();
          response = `Executing ${cmdLine}...`;
        } else if (item.content) {
          response = item.content;
        }
      } else if (item.type === 'dir') {
        if (item.appId) {
          openApp(item.appId);
          response = `Opening ${cmdLine} in File Manager...`;
        }
      }
    }
    else if (cmdLine !== "") {
      response = `Command not found: ${cmdLine}`;
    }

    if (response) newHistory.push({ type: 'output', text: response });
    setHistory(newHistory);
    setInput("");
    setGhostSuggestion("");
    setActiveSuggestions([]);
  };

  const handleKeyDown = (e) => {
    // 1. Handle Navigation in Suggestions List
    if (activeSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev + 1) % activeSuggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev - 1 + activeSuggestions.length) % activeSuggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (suggestionIndex !== -1) {
          const selected = activeSuggestions[suggestionIndex];
          // Determine how to append. 
          // Simple logic: replace the last word or the whole query part
          const parts = input.split(' ');
          if (parts.length > 1) {
            // e.g. "cd pro" -> "cd projects/"
            parts.pop();
            const suffix = selected.endsWith('/') ? selected : selected + " ";
            setInput(parts.join(' ') + " " + suffix);
          } else {
            // e.g. "pro" -> "projects/"
            const suffix = selected.endsWith('/') ? selected : selected + " ";
            setInput(suffix);
          }
          setActiveSuggestions([]);
          setSuggestionIndex(-1);
          setGhostSuggestion("");
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setActiveSuggestions([]);
        setSuggestionIndex(-1);
        return;
      }
    }

    // 2. Normal Terminal Key Handling
    if (e.key === 'Enter') {
      executeCommand(input.trim());
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        } else {
          setHistoryIndex(-1);
          setInput("");
        }
      }
    }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const lowerInput = input.toLowerCase();
      const currentDir = getDirContent(currentPath);
      const currentItems = currentDir ? Object.keys(currentDir) : [];

      // If ghost suggestion exists and no list active, take it
      if (ghostSuggestion && activeSuggestions.length === 0) {
        setInput(input + ghostSuggestion);
        setGhostSuggestion("");
        return;
      }

      // Calculate matches for list
      let matches = [];
      let prefix = "";

      if (lowerInput.startsWith('cd ')) {
        prefix = lowerInput.slice(3);
        const dirs = currentItems.filter(k => currentDir[k].type === 'dir');
        matches = dirs.filter(d => d.startsWith(prefix)).map(d => `${d}/`);
      }
      else if (lowerInput.startsWith('ls ')) {
        prefix = lowerInput.slice(3);
        matches = currentItems.filter(i => i.startsWith(prefix)).map(i => currentDir[i].type === 'dir' ? `${i}/` : i);
      }
      else {
        prefix = lowerInput;
        const allPossibilities = [...commands, ...currentItems];
        matches = allPossibilities.filter(item => item.startsWith(prefix)).map(i => {
          // Add slash if it's a dir in current context
          if (currentItems.includes(i) && currentDir[i].type === 'dir') return `${i}/`;
          return i;
        });
      }

      if (matches.length > 1) {
        setActiveSuggestions(matches);
        setSuggestionIndex(0);
      } else if (matches.length === 1) {
        // Auto-complete immediately if only one match
        const completion = matches[0];
        const parts = input.split(' ');
        if (parts.length > 1) {
          parts.pop();
          setInput(parts.join(' ') + " " + completion);
        } else {
          setInput(completion);
        }
      }
    }
  };



  // If in game mode, render game instead of terminal
  // These lines are removed as games are now launched as apps
  // if (gameMode === 'snake') {
  //   return <SnakeGame />;
  // }
  // if (gameMode === '2048') {
  //   return <Game2048 />;
  // }
  // if (gameMode === 'tictactoe') {
  //   return <TicTacToe />;
  // }
  // if (gameMode === 'maze') {
  //   return <MazeGame />;
  // }

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (activeSuggestions.length > 0) {
      setActiveSuggestions([]);
      setSuggestionIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const parts = input.split(' ');
    if (parts.length > 1) {
      parts.pop();
      const suffix = suggestion.endsWith('/') ? suggestion : suggestion + " ";
      setInput(parts.join(' ') + " " + suffix);
    } else {
      const suffix = suggestion.endsWith('/') ? suggestion : suggestion + " ";
      setInput(suffix);
    }
    setActiveSuggestions([]);
    setSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div
      className="terminal-window"
      ref={terminalRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-content">
        {history.map((item, index) => (
          <div key={index} className="terminal-line">
            {item.type === 'input' ? (
              <div className="command-line">
                <span className="prompt">{item.prompt}</span>
                <span className="command-text">{item.text}</span>
              </div>
            ) : (
              <div className="output-line" style={{ whiteSpace: 'pre-wrap' }}>{item.text}</div>
            )}
          </div>
        ))}

        <div className="input-line">
          <span className="prompt">{getPrompt()}</span>
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              autoFocus
              spellCheck="false"
              autoComplete="off"
            />
            {/* Ghost Suggestion Overlay */}
            {ghostSuggestion && (
              <div className="ghost-suggestion">
                {input}{ghostSuggestion.slice(input.length)}
              </div>
            )}
          </div>
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Autocomplete Menu */}
      {activeSuggestions.length > 0 && (
        <div
          className={`autocomplete-menu ${menuAbove ? 'menu-above' : 'menu-below'}`}
          style={{
            left: '10px', // Fixed position relative to terminal
            bottom: menuAbove ? '60px' : 'auto',
            top: menuAbove ? 'auto' : 'calc(100% - 40px)'
          }}
        >
          {activeSuggestions.map((suggestion, index) => (
            <div
              key={index}
              ref={el => suggestionRefs.current[index] = el}
              className={`suggestion-item ${index === suggestionIndex ? 'active' : ''}`}
              onClick={() => {
                setInput(suggestion);
                setActiveSuggestions([]);
                inputRef.current?.focus();
              }}
            >
              {suggestion}
              {/* Show type hint if available */}
              {virtualFS.root[suggestion] && (
                <span className="type-hint">
                  {virtualFS.root[suggestion].type === 'dir' ? '/' : ''}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Terminal;