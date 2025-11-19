import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';

const UserProfile = () => {
  const { openApp } = useOS();
  const [ageData, setAgeData] = useState({ level: 21, progress: 0 });

  // --- CONFIG: BIRTHDAY ---
  const BIRTH_DATE = new Date('2004-06-19'); 
  // ------------------------

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

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#111', color: '#eee', overflowY: 'auto' }}>
      
      {/* HERO BANNER */}
      <div style={{ 
          height: '160px', 
          background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', 
          position: 'relative',
          flexShrink: 0,
          zIndex: 0 
      }}>
         <div style={{ 
             position: 'absolute', top: '15px', right: '15px', 
             background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
             padding: '6px 12px', borderRadius: '20px', 
             fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px',
             border: '1px solid rgba(255,255,255,0.1)'
         }}>
            RESUME VIEW
         </div>
      </div>

      {/* MAIN LAYOUT CONTAINER */}
      <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          padding: '0 30px 40px 30px', 
          gap: '30px',
          position: 'relative', 
          zIndex: 1 
      }}>
        
        {/* --- SIDEBAR (Left) - Pulled UP to overlap banner --- */}
        <div style={{ 
            flex: '1 1 260px', 
            minWidth: '250px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            marginTop: '-80px' // <--- THE FIX: Only move this column up
        }}>
            
            {/* Avatar & Basic Info */}
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #333', textAlign: 'center', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                    style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #1a1a1a', background: '#000', marginBottom: '10px' }} 
                    alt="Profile"
                />
                <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: '700' }}>Abhinav Sharma</h2>
                <div style={{ color: '#3daee9', fontSize: '14px', fontWeight: '600' }}>Software Engineer (Honours)</div>
                <div style={{ color: '#888', fontSize: '13px', marginTop: '5px' }}>Deakin University</div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button 
                        onClick={() => window.open('mailto:abhinav431@gmail.com')}
                        style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', background: '#3daee9', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Hire Me
                    </button>
                    <button 
                        onClick={() => window.open('https://linkedin.com/in/abhinav431', '_blank')}
                        style={{ flex: 1, padding: '10px', border: '1px solid #444', borderRadius: '6px', background: 'transparent', color: '#fff', cursor: 'pointer' }}
                    >
                        LinkedIn
                    </button>
                </div>
            </div>

            {/* Level / Stats */}
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #333' }}>
                <div style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '1px' }}>LIFETIME STATS</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', color: '#ccc' }}>Age (Level)</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1c40f' }}>{ageData.level}</span>
                </div>
                <div style={{ height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }} title={`Progress to Level ${ageData.level + 1}`}>
                    <div style={{ width: `${ageData.progress}%`, height: '100%', background: 'linear-gradient(90deg, #f1c40f, #e67e22)' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #333' }}>
                    <span style={{ fontSize: '13px', color: '#ccc' }}>WAM Score</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2ecc71' }}>79</span>
                </div>
                <div style={{ fontSize: '11px', color: '#666', textAlign: 'right' }}>Distinction Average</div>
            </div>

            {/* Contact Info Box */}
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px', border: '1px solid #333', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span>📍</span> <span style={{ color: '#ccc' }}>Melbourne, Australia</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span>📧</span> <a href="mailto:abhinav431@gmail.com" style={{ color: '#3daee9', textDecoration: 'none' }}>abhinav431@gmail.com</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>📞</span> <span style={{ color: '#ccc' }}>+61 414 351 888</span>
                </div>
            </div>

        </div>

        {/* --- MAIN CONTENT (Right) - Starts slightly lower --- */}
        <div style={{ flex: '3 1 400px', paddingTop: '10px' }}>
            
            <Section title="Professional Summary">
                <p style={{ color: '#ccc', lineHeight: '1.7', fontSize: '14px', margin: 0 }}>
                    I build secure, scalable applications and have a passion for bridging the gap between software and hardware. 
                    From <strong>Full-Stack Web Development</strong> to <strong>Embedded Systems & AI</strong>, I enjoy applying intelligent software solutions to solve real-world problems.
                </p>
            </Section>

            <Section title="Experience">
                <ExpItem 
                    role="Web Development Team Lead" 
                    company="DataBytes - DiscountMate (Capstone)" 
                    date="Apr 2025 - Present"
                    color="#3daee9"
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
                >
                    <li>Built an IoT-based helmet to monitor biometrics for coal mine workers.</li>
                    <li>Implemented LoRaWAN communication and full-stack admin portal.</li>
                    <li>Improved worker safety by enabling real-time alerts.</li>
                </ExpItem>
            </Section>

            <Section title="Technical Skills">
                <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: 'bold' }}>LANGUAGES & CORE</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <Tag label="Python" />
                        <Tag label="C++" />
                        <Tag label="C#" />
                        <Tag label="JavaScript (ES6+)" />
                        <Tag label=".NET Framework" />
                    </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: 'bold' }}>WEB & CLOUD</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <Tag label="ReactJS" highlight />
                        <Tag label="Firebase" />
                        <Tag label="Stripe API" />
                        <Tag label="REST APIs" />
                        <Tag label="HTML5/CSS3" />
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: 'bold' }}>HARDWARE & SYSTEMS</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <Tag label="Arduino" />
                        <Tag label="Raspberry Pi" />
                        <Tag label="LoRaWAN" highlight />
                        <Tag label="Linux / Bash" />
                        <Tag label="Git / Agile" />
                    </div>
                </div>
            </Section>

        </div>

      </div>
    </div>
  );
};

/* --- SUB COMPONENTS --- */
const Section = ({ title, children }) => (
    <div style={{ marginBottom: '35px' }}>
        <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px', color: '#fff', fontSize: '16px', letterSpacing: '1px' }}>{title.toUpperCase()}</h3>
        {children}
    </div>
);

const ExpItem = ({ role, company, date, children, color }) => (
    <div style={{ marginBottom: '20px', position: 'relative', paddingLeft: '20px', borderLeft: `2px solid ${color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '5px' }}>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>{role}</span>
            <span style={{ fontSize: '12px', color: '#888', background: '#1a1a1a', padding: '2px 8px', borderRadius: '4px' }}>{date}</span>
        </div>
        <div style={{ fontSize: '13px', color: color, marginBottom: '8px', fontWeight: '600' }}>{company}</div>
        <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '13px', color: '#ccc', lineHeight: '1.6' }}>
            {children}
        </ul>
    </div>
);

const Tag = ({ label, highlight }) => (
    <span style={{ 
        background: highlight ? 'rgba(61, 174, 233, 0.15)' : 'rgba(255,255,255,0.05)', 
        border: highlight ? '1px solid rgba(61, 174, 233, 0.3)' : '1px solid #333', 
        color: highlight ? '#3daee9' : '#ccc',
        padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500'
    }}>
        {label}
    </span>
);

export default UserProfile;