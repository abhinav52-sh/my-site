import React from 'react';
import { experience } from '../data/experience';

export default function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl md:text-4xl font-black">Experience</h2>
        <ul className="mt-8 space-y-6">
          {experience.map((item) => (
            <li key={item.title} className="p-6 rounded-2xl backdrop-blur-md bg-white/20 dark:bg-slate-800/60 shadow">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-xs text-slate-500">{item.date}</p>
              <ul className="mt-3 text-sm list-disc list-inside space-y-1">
                {item.description.map((desc) => (
                  <li key={desc}>{desc}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
