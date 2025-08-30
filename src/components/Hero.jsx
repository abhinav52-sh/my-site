import React from 'react';
import Particles from "react-tsparticles";
import { motion } from "framer-motion";

export default function Hero({ particlesInit }) {
  return (
    <section id="top" className="relative pt-36 md:pt-44 pb-24 overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 45 },
            move: { enable: true, speed: 0.6 },
            opacity: { value: 0.3 },
            size: { value: { min: 1, max: 3 } },
            links: { enable: true, opacity: 0.2 },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" } },
          },
        }}
        className="absolute inset-0 -z-10"
      />
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-slate-900 text-white rounded-full px-3 py-1">
            Melbourne • Software Engineer • Embedded + Web
          </p>
          <h1 className="mt-6 text-5xl md:text-7xl font-black leading-[1.05] bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Abhinav Sharma
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-xl">
            Bachelor of Software Engineering (Honours) @ Deakin. I build secure,
            scalable web apps, craft intelligent systems, and tinker with embedded hardware.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:contact@abhinavsharma.cc"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2"
            >
              Email
            </a>
            <a
              href="https://linkedin.com/in/abhinav431"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2"
            >
              LinkedIn
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2"
            >
              Projects
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="p-6 rounded-3xl backdrop-blur-md bg-white/20 dark:bg-slate-800/60 shadow-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/60 dark:bg-slate-800/80 p-4 shadow">
                <p className="text-xs text-slate-500">Current WAM</p>
                <p className="text-3xl font-extrabold">79</p>
                <p className="text-xs">Deakin University</p>
              </div>
              <div className="rounded-2xl bg-white/60 dark:bg-slate-800/80 p-4 shadow">
                <p className="text-xs text-slate-500">Focus</p>
                <p className="text-lg font-bold">Web • AI/ML • Embedded</p>
              </div>
              <div className="rounded-2xl bg-white/60 dark:bg-slate-800/80 p-4 shadow">
                <p className="text-xs text-slate-500">Location</p>
                <p className="text-lg font-bold">Melbourne, AU</p>
              </div>
              <div className="rounded-2xl bg-white/60 dark:bg-slate-800/80 p-4 shadow">
                <p className="text-xs text-slate-500">Availability</p>
                <p className="text-lg font-bold">Open to work</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
