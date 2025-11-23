import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { trackResumeDownload } from '../../utils/analytics';

const ROLES = ['Software Engineer', 'Full Stack Developer', 'AI Enthusiast', 'Problem Solver'];

import { THEMES } from '../../data/themes';
import ParticleBackground from '../ParticleBackground';

const TIMELINE_DATA = [
    {
        year: '2025',
        title: 'Web Development Team Lead',
        company: 'DataBytes - DiscountMate',
        type: 'work',
        description: 'Leading frontend development for capstone project'
    },
    {
        year: '2024',
        title: 'Smart LoRaWAN Helmet',
        company: 'IoT Project',
        type: 'project',
        description: 'Built safety monitoring system for coal miners'
    },
    {
        year: '2022',
        title: 'Software Engineering (Honours)',
        company: 'Deakin University',
        type: 'education',
        description: 'Distinction average (WAM: 79)'
    },
    {
        year: '2021',
        title: 'Started University',
        company: 'Deakin University',
        type: 'education',
        description: 'Beginning of tech journey'
    }
];

const UserProfile = () => {
    const { openApp, osTheme, updateOSTheme } = useOS();
    const [ageData, setAgeData] = useState({ level: 21, progress: 0 });
    const [showTerminal, setShowTerminal] = useState(false);
    const [terminalHistory, setTerminalHistory] = useState([]);
    const [terminalInput, setTerminalInput] = useState('');
    const [konamiProgress, setKonamiProgress] = useState(0);
    const [easterEggActive, setEasterEggActive] = useState(false);
    const [downloadingResume, setDownloadingResume] = useState(false);
    const scrollRef = useRef(null);
    const terminalOutputRef = useRef(null);

    const BIRTH_DATE = new Date('2004-06-19');
    const currentTheme = THEMES[osTheme] || THEMES.default;

    // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
    const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    useEffect(() => {
        const updateAge = () => {
            const now = new Date();
            const currentYear = now.getFullYear();
            let level = currentYear - BIRTH_DATE.getFullYear();

            const hasHadBirthday = (now.getMonth() > BIRTH_DATE.getMonth()) ||
                (now.getMonth() === BIRTH_DATE.getMonth() && now.getDate() >= BIRTH_DATE.getDate());

            if (!hasHadBirthday) level--;

            const lastBirthday = new Date(hasHadBirthday ? currentYear : currentYear - 1, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate());
            const nextBirthday = new Date(hasHadBirthday ? currentYear + 1 : currentYear, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate());

            const total = nextBirthday - lastBirthday;
            const current = now - lastBirthday;
            const progress = (current / total) * 100;

            setAgeData({ level, progress: progress.toFixed(5) });
        };

        updateAge();
        const timer = setInterval(updateAge, 100);
        return () => clearInterval(timer);
    }, []);

    // Particle system removed - now using global ParticleBackground component

    // Terminal Easter Egg (Ctrl + `)
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Terminal toggle
            if (e.ctrlKey && e.key === '`') {
                e.preventDefault();
                setShowTerminal(prev => !prev);
            }

            // Konami code
            if (KONAMI_CODE[konamiProgress] === e.key) {
                const newProgress = konamiProgress + 1;
                setKonamiProgress(newProgress);
                if (newProgress === KONAMI_CODE.length) {
                    setEasterEggActive(true);
                    setKonamiProgress(0);
                    setTimeout(() => setEasterEggActive(false), 5000);
                }
            } else {
                setKonamiProgress(0);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [konamiProgress]);

    // FIXED: Auto-scroll terminal to bottom
    useEffect(() => {
        if (terminalOutputRef.current) {
            terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
        }
    }, [terminalHistory]);

    const handleTerminalCommand = (cmd) => {
        const output = [];
        const parts = cmd.trim().toLowerCase().split(' ');
        const command = parts[0];

        switch (command) {
            case 'help':
                output.push('Available commands: help, whoami, skills, contact, clear, theme, exit');
                break;
            case 'whoami':
                output.push('Abhinav Sharma - Software Engineer');
                output.push('Full Stack Developer | AI Enthusiast');
                break;
            case 'skills':
                output.push('Languages: Python, C++, C#, JavaScript');
                output.push('Web: ReactJS, Firebase, REST APIs');
                output.push('Hardware: Arduino, Raspberry Pi, LoRaWAN');
                break;
            case 'contact':
                output.push('Email: abhinav431@gmail.com');
                output.push('LinkedIn: linkedin.com/in/abhinav431');
                output.push('Location: Melbourne, Australia');
                break;
            case 'clear':
                setTerminalHistory([]);
                return;
            case 'theme':
                const themeName = parts[1];
                if (themeName && THEMES[themeName]) {
                    updateOSTheme(themeName);
                    output.push(`Theme changed to: ${THEMES[themeName].name}`);
                } else {
                    output.push('Available themes: ' + Object.keys(THEMES).join(', '));
                }
                break;
            case 'exit':
                setShowTerminal(false);
                return;
            case '':
                break;
            default:
                output.push(`Command not found: ${command}. Type 'help' for available commands.`);
        }

        setTerminalHistory(prev => [...prev, { cmd, output }]);
    };

    const handleDownloadResume = () => {
        setDownloadingResume(true);

        // Track resume download (important conversion!)
        trackResumeDownload();

        // Confetti effect
        createConfetti();

        setTimeout(() => {
            const link = document.createElement('a');
            link.href = '/resume.pdf';
            link.download = 'Abhinav_Sharma_Resume.pdf';
            link.click();

            setTimeout(() => setDownloadingResume(false), 1000);
        }, 500);
    };

    const createConfetti = () => {
        const colors = [currentTheme.accent, '#f1c40f', '#e74c3c', '#2ecc71', '#9b59b6'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = '50%';
            confetti.style.top = '50%';
            confetti.style.opacity = '1';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '10000';
            confetti.style.borderRadius = '50%';

            document.body.appendChild(confetti);

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 10 + 5;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity - 5;

            let x = 0, y = 0, opacity = 1;
            const gravity = 0.5;
            let velocityY = vy;

            const animate = () => {
                x += vx;
                y += velocityY;
                velocityY += gravity;
                opacity -= 0.02;

                confetti.style.transform = `translate(${x}px, ${y}px)`;
                confetti.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };

            animate();
        }
    };

    return (
        <div ref={scrollRef} className="user-profile-app" style={{
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'relative',
            background: 'transparent'
        }}>
            {/* Content Wrapper */}
            <div style={{
                position: 'relative',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                color: currentTheme.text,
                transition: 'color 0.5s ease'
            }}>

                {/* Theme Switcher - Positioned absolute top-left */}
                <div
                    onMouseDown={(e) => e.stopPropagation()} // Prevent window drag/unmaximize
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        zIndex: 5002,
                        display: 'flex',
                        gap: '6px', // Reduced gap
                        background: 'rgba(0,0,0,0.5)',
                        padding: '6px', // Reduced padding
                        borderRadius: '20px',
                        backdropFilter: 'blur(10px)'
                    }}>
                    {Object.keys(THEMES).map(key => (
                        <button
                            key={key}
                            onClick={() => updateOSTheme(key)}
                            style={{
                                width: '16px', // FIXED: Smaller size (was 24px)
                                height: '16px',
                                borderRadius: '50%',
                                border: osTheme === key ? `2px solid ${THEMES[key].accent}` : '1px solid rgba(255,255,255,0.2)',
                                background: THEMES[key].accent,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            title={THEMES[key].name}
                        />
                    ))}
                </div>

                {/* Easter Egg Notification */}
                {easterEggActive && (
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.9)',
                        padding: '40px',
                        borderRadius: '20px',
                        border: `3px solid ${currentTheme.accent}`,
                        zIndex: 10000,
                        textAlign: 'center',
                        animation: 'pulse 1s infinite'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: currentTheme.accent }}>
                            KONAMI CODE ACTIVATED!
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '14px', opacity: 0.7 }}>
                            You found the secret! 🎮
                        </div>
                    </div>
                )}

                {/* Terminal Easter Egg - FIXED: Auto-scroll */}
                {showTerminal && (
                    <div style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px',
                        right: '20px',
                        height: '300px',
                        background: 'rgba(0, 0, 0, 0.95)',
                        border: `2px solid ${currentTheme.accent}`,
                        borderRadius: '12px',
                        zIndex: 5003,
                        padding: '20px',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        color: currentTheme.accent,
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: `0 0 20px ${currentTheme.accent}50`
                    }}>
                        <div style={{ marginBottom: '10px', borderBottom: `1px solid ${currentTheme.accent}`, paddingBottom: '10px' }}>
                            Terminal (Press Ctrl+` to close)
                        </div>
                        <div ref={terminalOutputRef} style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                            {terminalHistory.map((entry, i) => (
                                <div key={i} style={{ marginBottom: '10px' }}>
                                    <div style={{ color: '#888' }}>$ {entry.cmd}</div>
                                    {entry.output.map((line, j) => (
                                        <div key={j} style={{ marginLeft: '10px' }}>{line}</div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px' }}>$</span>
                            <input
                                type="text"
                                value={terminalInput}
                                onChange={(e) => setTerminalInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleTerminalCommand(terminalInput);
                                        setTerminalInput('');
                                    }
                                }}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: currentTheme.accent,
                                    fontFamily: 'monospace',
                                    fontSize: '14px'
                                }}
                                autoFocus
                                placeholder="Type 'help' for commands"
                            />
                        </div>
                    </div>
                )}

                {/* HERO BANNER */}
                <div className="hero-banner" style={{
                    height: '220px',
                    background: `linear-gradient(45deg, transparent, ${currentTheme.accent}30)`,
                    backgroundSize: '400% 400%',
                    animation: 'gradientBG 15s ease infinite',
                    position: 'relative',
                    flexShrink: 0,
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {/* Particles restricted to this banner */}
                    <ParticleBackground absolute={true} />

                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: '900',
                        color: 'rgba(255,255,255,0.05)',
                        letterSpacing: '10px',
                        textTransform: 'uppercase',
                        pointerEvents: 'none',
                        margin: 0, // Reset margin
                        paddingLeft: '10px', // Compensate for letter-spacing
                        textAlign: 'center', // Ensure center alignment
                        width: '100%', // Ensure full width
                        zIndex: 2 // Ensure text is above particles
                    }}>
                        Portfolio
                    </h1>

                    <div style={{
                        position: 'absolute', top: '15px', right: '15px',
                        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
                        padding: '6px 12px', borderRadius: '20px',
                        fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px',
                        border: `1px solid ${currentTheme.accent}30`,
                        zIndex: 2
                    }}>
                        INTERACTIVE MODE • Press Ctrl+` for terminal
                    </div>
                </div>

                {/* MAIN LAYOUT */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    padding: '0 30px 40px 30px',
                    gap: '40px',
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: '1200px',
                    margin: '0 auto',
                    width: '100%'
                }}>

                    {/* SIDEBAR */}
                    <div style={{
                        flex: '1 1 300px',
                        minWidth: '280px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '25px',
                        marginTop: '-100px'
                    }}>

                        {/* 3D TILT PROFILE CARD */}
                        <TiltCard theme={currentTheme}>
                            <div style={{
                                background: currentTheme.cardBg,
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                padding: '30px',
                                border: `1px solid ${currentTheme.accent}20`,
                                textAlign: 'center',
                                position: 'relative',
                                boxShadow: `0 20px 50px ${currentTheme.accent}20`,
                                overflow: 'hidden',
                                transition: 'all 0.5s ease'
                            }}>
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '5px',
                                    background: `linear-gradient(90deg, ${currentTheme.accent}, ${currentTheme.accent}80)`
                                }} />

                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                    style={{
                                        width: '140px', height: '140px',
                                        borderRadius: '50%',
                                        border: `4px solid ${currentTheme.cardBg}`,
                                        background: '#000',
                                        marginBottom: '15px',
                                        boxShadow: `0 0 20px ${currentTheme.accent}50`,
                                        transition: 'transform 0.3s'
                                    }}
                                    className="profile-avatar"
                                    alt="Profile"
                                />
                                <h2 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: '800', color: currentTheme.text }}>Abhinav Sharma</h2>
                                <div style={{ height: '24px', marginBottom: '5px' }}>
                                    <Typewriter texts={ROLES} theme={currentTheme} />
                                </div>
                                <div style={{ color: '#888', fontSize: '13px', marginTop: '8px' }}>
                                    <span style={{ position: 'relative', display: 'inline-block' }}>
                                        <span style={{ position: 'absolute', left: '-24px', top: '-1px' }}>🎓</span>
                                        Deakin University
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                                    <button
                                        onClick={() => openApp('contact')}
                                        className="action-btn primary"
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontSize: '14px',
                                            background: `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.accent}cc)`,
                                            color: osTheme === 'terminal' ? '#000' : 'white',
                                            boxShadow: `0 4px 15px ${currentTheme.accent}40`
                                        }}
                                    >
                                        Contact
                                    </button>
                                    <button
                                        onClick={() => window.open('https://linkedin.com/in/abhinav431', '_blank')}
                                        className="action-btn secondary"
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: `1px solid ${currentTheme.accent}40`,
                                            borderRadius: '8px',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: currentTheme.text,
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        LinkedIn
                                    </button>
                                </div>
                            </div>
                        </TiltCard>

                        {/* Level / Stats */}
                        <div className="glass-panel" style={{
                            padding: '25px',
                            background: currentTheme.cardBg,
                            backdropFilter: 'blur(10px)',
                            borderRadius: '16px',
                            border: `1px solid ${currentTheme.accent}10`,
                            boxShadow: `0 10px 30px ${currentTheme.accent}10`,
                            transition: 'all 0.5s ease'
                        }}>
                            <div style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '1px' }}>LIFETIME STATS</div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                <span style={{ fontSize: '13px', color: currentTheme.text }}>Level (Age)</span>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#f1c40f', textShadow: '0 0 10px rgba(241, 196, 15, 0.5)' }}>{ageData.level}</span>
                            </div>
                            <div style={{ height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden', marginBottom: '25px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }} title={`Progress to Level ${ageData.level + 1}`}>
                                <div style={{ width: `${ageData.progress}%`, height: '100%', background: 'linear-gradient(90deg, #f1c40f, #e67e22)', borderRadius: '4px', transition: 'width 0.1s linear' }}></div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderTop: `1px solid ${currentTheme.accent}20` }}>
                                <span style={{ fontSize: '13px', color: currentTheme.text }}>WAM Score</span>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2ecc71', textShadow: '0 0 10px rgba(46, 204, 113, 0.5)' }}>79</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#666', textAlign: 'right' }}>Distinction Average</div>
                        </div>

                        {/* Contact Info */}
                        <div className="glass-panel" style={{
                            padding: '25px',
                            fontSize: '14px',
                            background: currentTheme.cardBg,
                            backdropFilter: 'blur(10px)',
                            borderRadius: '16px',
                            border: `1px solid ${currentTheme.accent}10`,
                            transition: 'all 0.5s ease'
                        }}>
                            <div className="contact-row" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginBottom: '15px',
                                padding: '10px',
                                borderRadius: '8px',
                                transition: 'background 0.2s'
                            }}>
                                <span className="icon" style={{ fontSize: '18px' }}>📍</span>
                                <span style={{ color: currentTheme.text }}>Melbourne, Australia</span>
                            </div>
                            <div className="contact-row" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginBottom: '15px',
                                padding: '10px',
                                borderRadius: '8px',
                                transition: 'background 0.2s'
                            }}>
                                <span className="icon" style={{ fontSize: '18px' }}>📧</span>
                                <a href="mailto:abhinav431@gmail.com" style={{ color: currentTheme.accent, textDecoration: 'none' }}>abhinav431@gmail.com</a>
                            </div>
                            <div className="contact-row" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginBottom: '20px',
                                padding: '10px',
                                borderRadius: '8px',
                                transition: 'background 0.2s'
                            }}>
                                <span className="icon" style={{ fontSize: '18px' }}>📞</span>
                                <span style={{ color: currentTheme.text }}>+61 414 351 888</span>
                            </div>

                            {/* Download Resume with Animation */}
                            <button
                                onClick={handleDownloadResume}
                                disabled={downloadingResume}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    background: downloadingResume ? '#666' : `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.accent}cc)`,
                                    color: osTheme === 'terminal' ? '#000' : 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: downloadingResume ? 'not-allowed' : 'pointer',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    marginTop: '20px',
                                    transition: 'all 0.2s',
                                    boxShadow: downloadingResume ? 'none' : `0 4px 15px ${currentTheme.accent}40`,
                                    transform: downloadingResume ? 'scale(0.95)' : 'scale(1)'
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>{downloadingResume ? '⏳' : '📥'}</span>
                                {downloadingResume ? 'Downloading...' : 'Download Resume'}
                            </button>
                        </div>

                    </div>

                    {/* MAIN CONTENT */}
                    <div style={{ flex: '3 1 500px', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

                        <FadeInSection>
                            <Section title="About Me" theme={currentTheme}>
                                <p style={{
                                    color: currentTheme.text,
                                    lineHeight: '1.8',
                                    fontSize: '16px',
                                    margin: 0,
                                    background: `${currentTheme.accent}10`,
                                    padding: '20px',
                                    borderRadius: '12px',
                                    borderLeft: `4px solid ${currentTheme.accent}`,
                                    transition: 'all 0.5s ease'
                                }}>
                                    I build <strong style={{ color: currentTheme.accent }}>secure, scalable applications</strong> and have a passion for bridging the gap between software and hardware.
                                    From <strong style={{ color: currentTheme.accent }}>Full-Stack Web Development</strong> to <strong style={{ color: currentTheme.accent }}>Embedded Systems & AI</strong>, I enjoy applying intelligent software solutions to solve real-world problems.
                                    <br /><br />
                                    I thrive in challenging environments where innovation meets practicality. Whether it's optimizing a database query or soldering a microcontroller, I'm always ready to learn and build something extraordinary.
                                </p>
                            </Section>
                        </FadeInSection>

                        {/* Interactive Timeline */}
                        <FadeInSection>
                            <Section title="Journey Timeline" theme={currentTheme}>
                                <InteractiveTimeline data={TIMELINE_DATA} theme={currentTheme} />
                            </Section>
                        </FadeInSection>

                        <FadeInSection>
                            <Section title="Experience" theme={currentTheme}>
                                <ExpItem
                                    role="Web Development Team Lead"
                                    company="DataBytes - DiscountMate (Capstone)"
                                    date="Apr 2025 - Present"
                                    color={currentTheme.accent}
                                    theme={currentTheme}
                                >
                                    <li>Led a 5-member development team delivering key frontend features.</li>
                                    <li>Delivered product dashboard, forecast pages, and notifications.</li>
                                    <li>Improved user efficiency by 25% and cut API response times by 30%.</li>
                                    <li>Mentored 3 junior developers, reducing training time by 40%.</li>
                                </ExpItem>

                                <ExpItem
                                    role="Developer"
                                    company="Smart LoRaWAN Helmet"
                                    date="Aug 2024 - Sep 2024"
                                    color="#2ecc71"
                                    theme={currentTheme}
                                >
                                    <li>Built an IoT-based helmet to monitor biometrics for coal mine workers.</li>
                                    <li>Implemented LoRaWAN communication and full-stack admin portal.</li>
                                    <li>Improved worker safety by enabling real-time alerts.</li>
                                </ExpItem>
                            </Section>
                        </FadeInSection>

                        <FadeInSection>
                            <Section title="Technical Skills" theme={currentTheme}>
                                <div className="skill-category" style={{ marginBottom: '25px' }}>
                                    <div className="cat-title" style={{
                                        fontSize: '12px',
                                        color: '#888',
                                        marginBottom: '10px',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px'
                                    }}>LANGUAGES & CORE</div>
                                    <div className="tag-container" style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '10px'
                                    }}>
                                        <Tag label="Python" theme={currentTheme} />
                                        <Tag label="C++" theme={currentTheme} />
                                        <Tag label="C#" theme={currentTheme} />
                                        <Tag label="JavaScript (ES6+)" theme={currentTheme} />
                                        <Tag label=".NET Framework" theme={currentTheme} />
                                    </div>
                                </div>
                                <div className="skill-category" style={{ marginBottom: '25px' }}>
                                    <div className="cat-title" style={{
                                        fontSize: '12px',
                                        color: '#888',
                                        marginBottom: '10px',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px'
                                    }}>WEB & CLOUD</div>
                                    <div className="tag-container" style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '10px'
                                    }}>
                                        <Tag label="ReactJS" highlight theme={currentTheme} />
                                        <Tag label="Firebase" theme={currentTheme} />
                                        <Tag label="Stripe API" theme={currentTheme} />
                                        <Tag label="REST APIs" theme={currentTheme} />
                                        <Tag label="HTML5/CSS3" theme={currentTheme} />
                                    </div>
                                </div>
                                <div className="skill-category" style={{ marginBottom: '25px' }}>
                                    <div className="cat-title" style={{
                                        fontSize: '12px',
                                        color: '#888',
                                        marginBottom: '10px',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px'
                                    }}>HARDWARE & SYSTEMS</div>
                                    <div className="tag-container" style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '10px'
                                    }}>
                                        <Tag label="Arduino" theme={currentTheme} />
                                        <Tag label="Raspberry Pi" theme={currentTheme} />
                                        <Tag label="LoRaWAN" highlight theme={currentTheme} />
                                        <Tag label="Linux / Bash" theme={currentTheme} />
                                        <Tag label="Git / Agile" theme={currentTheme} />
                                    </div>
                                </div>
                            </Section>
                        </FadeInSection>

                    </div>

                </div>

                <style>{`
                @keyframes gradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes pulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.05); }
                }
                .profile-avatar:hover {
                    transform: scale(1.05) rotate(5deg);
                }
                .contact-row:hover {
                    background: rgba(255,255,255,0.05);
                }
                .action-btn.primary:hover {
                    transform: translateY(-2px);
                }
                .action-btn.secondary:hover {
                    background: rgba(255,255,255,0.1);
                }
            `}</style>
            </div>
        </div>
    );
};

/* --- SUB COMPONENTS --- */

const TiltCard = ({ children, theme }) => {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('');
    const [glow, setGlow] = useState('');

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
        setGlow(`radial-gradient(circle at ${x}px ${y}px, ${theme.accent}20, transparent 80%)`);
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0) rotateY(0) scale(1)');
        setGlow('');
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform, transition: 'transform 0.1s ease-out', position: 'relative' }}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: glow, pointerEvents: 'none', zIndex: 2, borderRadius: '20px' }} />
            {children}
        </div>
    );
};

const Typewriter = ({ texts, theme }) => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [blink, setBlink] = useState(true);

    useEffect(() => {
        let timer;
        const i = loopNum % texts.length;
        const fullText = texts[i];

        if (isDeleting) {
            if (text === '') {
                setIsDeleting(false);
                setLoopNum(prev => prev + 1);
                timer = setTimeout(() => { }, 200);
            } else {
                timer = setTimeout(() => {
                    setText(fullText.substring(0, text.length - 1));
                }, 30);
            }
        } else {
            if (text === fullText) {
                timer = setTimeout(() => setIsDeleting(true), 2000);
            } else {
                timer = setTimeout(() => {
                    setText(fullText.substring(0, text.length + 1));
                }, 50);
            }
        }

        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, texts]);

    useEffect(() => {
        const timeout = setInterval(() => setBlink((prev) => !prev), 500);
        return () => clearInterval(timeout);
    }, []);

    return (
        <div style={{ color: theme.accent, fontSize: '16px', fontWeight: '600', fontFamily: 'monospace', minHeight: '24px' }}>
            {text}
            <span style={{ opacity: blink ? 1 : 0 }}>|</span>
        </div>
    );
};

const InteractiveTimeline = ({ data, theme }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);

    return (
        <div style={{ position: 'relative', paddingLeft: '30px' }}>
            <div style={{
                position: 'absolute',
                left: '0',
                top: '0',
                bottom: '0',
                width: '2px',
                background: `linear-gradient(to bottom, ${theme.accent}, transparent)`,
            }} />

            {data.map((item, index) => (
                <div
                    key={index}
                    onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                    style={{
                        marginBottom: '30px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        transform: selectedIndex === index ? 'translateX(10px)' : 'translateX(0)'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        left: '-6px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: theme.accent,
                        boxShadow: `0 0 10px ${theme.accent}`,
                        border: `2px solid ${theme.bg}`,
                        transition: 'all 0.3s',
                        transform: selectedIndex === index ? 'scale(1.5)' : 'scale(1)'
                    }} />

                    <div style={{
                        background: selectedIndex === index ? `${theme.accent}15` : `${theme.accent}05`,
                        padding: '15px 20px',
                        borderRadius: '12px',
                        border: `1px solid ${selectedIndex === index ? theme.accent : `${theme.accent}30`}`,
                        transition: 'all 0.3s'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: theme.text }}>{item.title}</span>
                            <span style={{
                                fontSize: '12px',
                                color: theme.accent,
                                background: `${theme.accent}20`,
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontWeight: 'bold'
                            }}>{item.year}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: theme.accent, marginBottom: '8px', fontWeight: '600' }}>{item.company}</div>
                        {selectedIndex === index && (
                            <div style={{
                                fontSize: '13px',
                                color: theme.text,
                                marginTop: '10px',
                                opacity: 0,
                                animation: 'fadeIn 0.3s forwards'
                            }}>
                                {item.description}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            <style>{`
                @keyframes fadeIn {
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

const FadeInSection = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => setIsVisible(entry.isIntersecting));
        });
        if (domRef.current) observer.observe(domRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={domRef}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
            }}
        >
            {children}
        </div>
    );
};

const Section = ({ title, children, theme }) => (
    <div style={{ marginBottom: '35px' }}>
        <h3 style={{
            borderBottom: `1px solid ${theme.accent}20`,
            paddingBottom: '15px',
            marginBottom: '20px',
            color: theme.text,
            fontSize: '20px',
            letterSpacing: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.5s ease'
        }}>
            <span style={{ width: '8px', height: '8px', background: theme.accent, borderRadius: '50%', display: 'inline-block' }}></span>
            {title.toUpperCase()}
        </h3>
        {children}
    </div>
);

const ExpItem = ({ role, company, date, children, color, theme }) => (
    <div className="exp-item" style={{
        marginBottom: '30px',
        position: 'relative',
        paddingLeft: '30px',
        borderLeft: `2px solid ${theme.accent}20`,
        transition: 'all 0.5s ease'
    }}>
        <div style={{ position: 'absolute', left: '-6px', top: '0', width: '10px', height: '10px', borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: theme.text }}>{role}</span>
            <span style={{ fontSize: '12px', color: '#aaa', background: `${theme.accent}10`, padding: '4px 10px', borderRadius: '20px', border: `1px solid ${theme.accent}20` }}>{date}</span>
        </div>
        <div style={{ fontSize: '15px', color: color, marginBottom: '12px', fontWeight: '600' }}>{company}</div>
        <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '14px', color: theme.text, lineHeight: '1.7' }}>
            {children}
        </ul>
    </div>
);

const Tag = ({ label, highlight, theme }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <span
            className="skill-tag"
            style={{
                background: highlight ? `${theme.accent}20` : `${theme.accent}05`,
                border: highlight ? `1px solid ${theme.accent}50` : `1px solid ${theme.accent}20`,
                color: highlight ? theme.accent : theme.text,
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'default',
                transition: 'all 0.2s',
                display: 'inline-block',
                transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: isHovered ? (highlight ? `0 5px 15px ${theme.accent}30` : '0 5px 15px rgba(0,0,0,0.2)') : 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {label}
        </span>
    );
};

export default UserProfile;