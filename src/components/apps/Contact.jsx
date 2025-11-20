import React, { useState } from 'react';

const Contact = () => {
  const [copied, setCopied] = useState(null);

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--os-theme-bg, linear-gradient(135deg, #1a1a2e 0%, #16213e 100%))',
      color: 'var(--os-theme-text, #fff)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.5s ease, color 0.5s ease'
    }}>

      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, var(--os-theme-accent, #3daee9)33 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '-30px',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(46, 204, 113, 0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ padding: '30px', zIndex: 1, height: '100%', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '90px',
            height: '90px',
            background: 'linear-gradient(135deg, var(--os-theme-accent, #3daee9), #2ecc71)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            boxShadow: '0 10px 25px rgba(61, 174, 233, 0.4)',
            animation: 'float 6s ease-in-out infinite'
          }}>
            <span style={{ fontSize: '40px' }}>📬</span>
          </div>
          <h2 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(to right, #fff, #ccc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Get In Touch</h2>
          <p style={{ color: '#aab', margin: '10px 0 0 0', fontSize: '14px', lineHeight: '1.5' }}>
            I am available for full-stack & embedded projects.<br />Let's build something amazing together!
          </p>
        </div>

        {/* Contact List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>

          <ContactRow
            icon="📧"
            label="Email"
            value="abhinav.as431@gmail.com"
            action={() => window.open('mailto:abhinav.as431@gmail.com')}
            onCopy={() => handleCopy('abhinav.as431@gmail.com', 'Email')}
            color="#e74c3c"
          />

          <ContactRow
            icon="📱"
            label="Phone"
            value="+61 414 351 888"
            action={() => window.open('tel:+61414351888')}
            onCopy={() => handleCopy('+61414351888', 'Phone')}
            color="#2ecc71"
          />

          <ContactRow
            icon="💼"
            label="LinkedIn"
            value="linkedin.com/in/abhinav431"
            action={() => window.open('https://linkedin.com/in/abhinav431', '_blank')}
            onCopy={() => handleCopy('linkedin.com/in/abhinav431', 'LinkedIn')}
            isLink
            color="#0077b5"
          />

          <ContactRow
            icon="🛠️"
            label="GitHub"
            value="github.com/abhinav52-sh/"
            action={() => window.open('https://github.com/abhinav52-sh/', '_blank')}
            onCopy={() => handleCopy('github.com/abhinav52-sh/', 'GitHub')}
            isLink
            color="#0077b5"
          />

          <ContactRow
            icon="📍"
            label="Location"
            value="Melbourne, Australia"
            noAction
            color="#f1c40f"
          />

        </div>
      </div>

      {/* Toast Notification for Copy */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: `translateX(-50%) translateY(${copied ? '0' : '100px'})`,
        background: 'rgba(46, 204, 113, 0.9)',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '30px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s',
        opacity: copied ? 1 : 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backdropFilter: 'blur(5px)',
        zIndex: 10
      }}>
        <span>✅</span> {copied} copied to clipboard!
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

const ContactRow = ({ icon, label, value, action, onCopy, isLink, noAction, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: isHovered ? 'var(--os-theme-accent, #3daee9)20' : 'var(--os-theme-card-bg, rgba(255,255,255,0.05))',
        padding: '15px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'none',
        boxShadow: isHovered ? `0 5px 15px rgba(0,0,0,0.2)` : 'none',
        cursor: noAction ? 'default' : 'pointer'
      }}
    >
      <div style={{
        fontSize: '24px',
        marginRight: '15px',
        width: '40px',
        height: '40px',
        background: `rgba(255,255,255,0.1)`,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color || '#fff'
      }}>
        {icon}
      </div>
      <div style={{ flexGrow: 1 }} onClick={!noAction ? action : undefined}>
        <div style={{ fontSize: '11px', color: '#889', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '2px' }}>{label}</div>
        <div
          style={{
            fontSize: '15px',
            color: isLink ? 'var(--os-theme-accent, #3daee9)' : 'var(--os-theme-text, #fff)',
            textDecoration: isLink && isHovered ? 'underline' : 'none',
            fontWeight: '500'
          }}
        >
          {value}
        </div>
      </div>
      {onCopy && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          style={{
            padding: '10px',
            cursor: 'pointer',
            color: isHovered ? '#fff' : '#666',
            borderRadius: '8px',
            transition: '0.2s',
            background: isHovered ? 'rgba(255,255,255,0.1)' : 'transparent'
          }}
          title="Copy to clipboard"
        >
          📋
        </div>
      )}
    </div>
  );
};

export default Contact;