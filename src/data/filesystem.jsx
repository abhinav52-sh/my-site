import React from 'react';

const ProjectLayout = ({ img, title, date, desc, stack }) => (
  <>
    <img src={img} className="hero-img" alt={title} />
    <div className="content-pad">
      <h2>{title}</h2>
      <p style={{ color: '#aaa', fontSize: '12px' }}>{date}</p>
      <p>{desc}</p>
      <p><strong>Stack:</strong></p>
      <ul>
        {stack.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  </>
);

export const fileSystem = {
  about: {
    title: "User Profile",
    // Bright 3D Avatar
    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    width: 450,
    height: 600,
    type: "profile"
  },
  
  contact: {
    title: "Contact Me",
    // Bright Blue/White Mail Icon
    icon: "https://img.icons8.com/fluency/96/mail.png",
    width: 400,
    height: 500,
    type: "contact"
  },

  skills: {
    title: "System Monitor",
    // Bright Screen with Speedometer/Graph
    icon: "https://img.icons8.com/fluency/96/performance-macbook.png",
    width: 600,
    height: 450,
    type: "monitor"
  },

  projects: {
    title: "File Manager",
    // Distinct Blue Folder
    icon: "https://img.icons8.com/fluency/96/folder-invoices.png",
    width: 700,
    height: 450,
    type: "explorer"
  },

  terminal: {
    title: "Terminal",
    // High Contrast Command Prompt
    icon: "https://img.icons8.com/fluency/96/console.png",
    width: 600,
    height: 350,
    type: "terminal"
  },
  
  // --- Projects ---
  proj_helmet: {
    title: "Smart Helmet",
    icon: "https://cdn-icons-png.flaticon.com/512/1087/1087815.png", // Kept file icons simple
    width: 450,
    height: 500,
    content: (
      <ProjectLayout 
        img="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1000&auto=format&fit=crop"
        title="Smart LoRaWAN Helmet"
        date="Aug 2024 - Sep 2024"
        desc="Built an IoT-based helmet to monitor biometrics and environmental hazards for coal mine workers."
        stack={["LoRaWAN communication", "Full-stack admin portal", "Arduino & Raspberry Pi"]}
      />
    )
  },
  proj_capstone: {
    title: "DiscountMate",
    icon: "https://cdn-icons-png.flaticon.com/512/1087/1087815.png",
    width: 450,
    height: 500,
    content: (
      <ProjectLayout 
        img="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
        title="Web Dev Team Lead"
        date="Capstone Project"
        desc="Led a 5-member development team delivering key frontend features."
        stack={["Delivered product dashboard", "Improved efficiency by 25%", "Mentored 3 junior devs"]}
      />
    )
  },
  proj_robot: {
    title: "Patrolling Robot",
    icon: "https://cdn-icons-png.flaticon.com/512/1087/1087815.png",
    width: 450,
    height: 500,
    content: (
      <ProjectLayout 
        img="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop"
        title="Autonomous Robot"
        date="May 2023 - Jun 2023"
        desc="Designed for sensitive areas with automatic path following."
        stack={["Land mine detection", "Live video feed", "C++ Embedded"]}
      />
    )
  },
  proj_dev: {
    title: "DevDeakin",
    icon: "https://cdn-icons-png.flaticon.com/512/1087/1087815.png",
    width: 450,
    height: 500,
    content: (
      <ProjectLayout 
        img="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop"
        title="University Platform"
        date="Web Application"
        desc="Full-stack website for university news and authorization."
        stack={["ReactJS Frontend", "Firebase Backend", "Stripe Integration"]}
      />
    )
  }
};