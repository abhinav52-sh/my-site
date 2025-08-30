import React from 'react';

export default function Footer() {
  return (
    <footer className="py-10 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} Abhinav Sharma • Built with React + Tailwind + Framer Motion
    </footer>
  );
}
