import React from 'react';
import { skills } from '../data/skills';

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-white/70 dark:bg-slate-950/40">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl md:text-4xl font-black">Skills</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl backdrop-blur-md bg-white/20 dark:bg-slate-800/60 p-6">
            <h3 className="font-semibold mb-3">Languages & Frameworks</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {skills.languages.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full bg-indigo-600 text-white">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl backdrop-blur-md bg-white/20 dark:bg-slate-800/60 p-6">
            <h3 className="font-semibold mb-3">Systems & Domains</h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              {skills.systems.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl backdrop-blur-md bg-white/20 dark:bg-slate-800/60 p-6">
            <h3 className="font-semibold mb-3">Embedded & Tools</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {skills.tools.map((tool) => (
                <span key={tool} className="px-3 py-1 rounded-full border">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
