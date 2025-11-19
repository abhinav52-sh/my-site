import React, { useState } from 'react';

const Contact = () => {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ padding: '30px', height: '100%', display: 'flex', flexDirection: 'column', background: '#1a1a1a', color: '#fff' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #3daee9, #2ecc71)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', boxShadow: '0 10px 20px rgba(61, 174, 233, 0.3)' }}>
          <span style={{ fontSize: '32px' }}>📬</span>
        </div>
        <h2 style={{ margin: 0, fontSize: '24px' }}>Get In Touch</h2>
        <p style={{ color: '#aaa', margin: '5px 0 0 0' }}>I am available for full-stack & embedded projects.</p>
      </div>

      {/* Contact List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
        
        <ContactRow 
          icon="📧" 
          label="Email" 
          value="abhinav431@gmail.com" 
          action={() => window.open('mailto:abhinav431@gmail.com')}
          onCopy={() => handleCopy('abhinav431@gmail.com', 'Email')}
        />

        <ContactRow 
          icon="📱" 
          label="Phone" 
          value="+61 414 351 888" 
          action={() => window.open('tel:+61414351888')}
          onCopy={() => handleCopy('+61414351888', 'Phone')}
        />

        <ContactRow 
          icon="💼" 
          label="LinkedIn" 
          value="linkedin.com/in/abhinav431" 
          action={() => window.open('https://linkedin.com/in/abhinav431', '_blank')}
          isLink
        />

        <ContactRow 
          icon="📍" 
          label="Location" 
          value="Melbourne, Australia" 
          noAction
        />

      </div>

      {/* Toast Notification for Copy */}
      {copied && (
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#2ecc71', color: '#000', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>
          {copied} copied to clipboard!
        </div>
      )}
    </div>
  );
};

const ContactRow = ({ icon, label, value, action, onCopy, isLink, noAction }) => (
  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', transition: '0.2s' }}>
    <div style={{ fontSize: '24px', marginRight: '15px' }}>{icon}</div>
    <div style={{ flexGrow: 1 }}>
      <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>{label}</div>
      <div 
        onClick={!noAction ? action : undefined}
        style={{ fontSize: '14px', color: isLink ? '#3daee9' : '#eee', cursor: noAction ? 'default' : 'pointer', textDecoration: isLink ? 'underline' : 'none' }}
      >
        {value}
      </div>
    </div>
    {onCopy && (
      <div 
        onClick={onCopy}
        style={{ padding: '8px', cursor: 'pointer', color: '#666', borderRadius: '4px' }}
        title="Copy"
      >
        📋
      </div>
    )}
  </div>
);

export default Contact;