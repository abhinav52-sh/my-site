import React from 'react';
import { projects } from '../data/projects';

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-white/70 dark:bg-slate-950/40">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl md:text-4xl font-black">Projects</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.title} className="rounded-3xl backdrop-blur-md bg-white/20 dark:bg-slate-800/60 p-6">
              {project.image && <img src={project.image} alt={project.title} className="rounded-2xl mb-4" />} 
              <h3 className="font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm">{project.description}</p>
              {project.link && <a href={project.link} className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 inline-block">View Project</a>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
