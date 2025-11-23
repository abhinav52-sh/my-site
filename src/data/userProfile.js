/**
 * User Profile Data
 * 
 * This file contains all the static data for the User Profile application.
 * Modify this file to update the "About Me" section, Experience, Skills, and Contact info.
 */

export const USER_PROFILE = {
  name: 'Abhinav Sharma',
  initials: 'AS',
  role: 'Software Engineer',
  location: 'Melbourne, Australia',
  email: 'abhinav431@gmail.com',
  phone: '+61 414 351 888',
  linkedin: 'https://linkedin.com/in/abhinav431',
  avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',

  // Typewriter effect roles
  roles: [
    'Software Engineer',
    'Full Stack Developer',
    'AI Enthusiast',
    'Problem Solver'
  ],

  // Stats for the profile card
  stats: {
    level: 21, // Will be dynamically calculated based on birth date in component
    wam: 79,
    wamLabel: 'Distinction Average'
  },

  birthDate: '2004-06-19', // YYYY-MM-DD

  // "About Me" section content
  bio: {
    intro: 'I build secure, scalable applications and have a passion for bridging the gap between software and hardware.',
    description: 'From Full-Stack Web Development to Embedded Systems & AI, I enjoy applying intelligent software solutions to solve real-world problems.',
    outro: 'I thrive in challenging environments where innovation meets practicality. Whether it\'s optimizing a database query or soldering a microcontroller, I\'m always ready to learn and build something extraordinary.'
  }
};

export const TIMELINE_DATA = [
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

export const EXPERIENCE_DATA = [
  {
    role: 'Web Development Team Lead',
    company: 'DataBytes - DiscountMate (Capstone)',
    date: 'Apr 2025 - Present',
    color: 'accent', // Uses theme accent
    points: [
      'Led a 5-member development team delivering key frontend features.',
      'Delivered product dashboard, forecast pages, and notifications.',
      'Improved user efficiency by 25% and cut API response times by 30%.',
      'Mentored 3 junior developers, reducing training time by 40%.'
    ]
  },
  {
    role: 'Developer',
    company: 'Smart LoRaWAN Helmet',
    date: 'Aug 2024 - Sep 2024',
    color: '#2ecc71', // Specific color override
    points: [
      'Built an IoT-based helmet to monitor biometrics for coal mine workers.',
      'Implemented LoRaWAN communication and full-stack admin portal.',
      'Improved worker safety by enabling real-time alerts.'
    ]
  }
];

export const SKILLS_DATA = [
  {
    category: 'LANGUAGES & CORE',
    items: [
      { label: 'Python' },
      { label: 'C++' },
      { label: 'C#' },
      { label: 'JavaScript (ES6+)' },
      { label: '.NET Framework' }
    ]
  },
  {
    category: 'WEB & CLOUD',
    items: [
      { label: 'ReactJS', highlight: true },
      { label: 'Firebase' },
      { label: 'Stripe API' },
      { label: 'REST APIs' },
      { label: 'HTML5/CSS3' }
    ]
  },
  {
    category: 'HARDWARE & SYSTEMS',
    items: [
      { label: 'Arduino' },
      { label: 'Raspberry Pi' },
      { label: 'LoRaWAN', highlight: true },
      { label: 'Linux / Bash' },
      { label: 'Git / Agile' }
    ]
  }
];
