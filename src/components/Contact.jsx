import React from 'react';

export default function Contact() {
  return (
    <section id="contact" className="py-20">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-black">Let's build something great</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Whether it's a web platform, embedded system, or a hybrid of both—I'm keen to
            collaborate.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:contact@abhinavsharma.cc"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 shadow"
            >
              Email me
            </a>
            <a
              href="https://linkedin.com/in/abhinav431"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thanks! This demo form is static.");
          }}
        >
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Message</label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              placeholder="Tell me about your project…"
              required
            ></textarea>
          </div>
          <button className="w-full rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3">
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
