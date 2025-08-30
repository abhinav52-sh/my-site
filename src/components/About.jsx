import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-3 gap-10 items-center">
        <div className="md:col-span-2">
          <h2 className="text-3xl md:text-4xl font-black">About</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
            Hi, I’m a Software Engineering (Honours) student at Deakin University (2022–2026), and I love turning ideas into real things. Whether it’s building web apps from scratch, designing secure and scalable systems, or tinkering with Arduino and Raspberry Pi projects, I enjoy bringing code (and sometimes hardware) to life. I’m always exploring new ways to solve problems, experiment with technology, and create projects that are not just functional, but also meaningful.
          </p>
        </div>
        <div className="p-6 rounded-3xl backdrop-blur-md bg-white/20 dark:bg-slate-800/60">
          <h3 className="font-semibold">Quick Facts</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Degree</dt>
              <dd>BSE (Hons), Deakin</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Grad Year</dt>
              <dd>2026</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Email</dt>
              <dd>contact@abhinavsharma.cc</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">LinkedIn</dt>
              <dd>/abhinav431</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
