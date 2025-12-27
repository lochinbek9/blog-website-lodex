
import React from 'react';

interface AboutMeProps {
  onBack: () => void;
  t: any;
}

const AboutMe: React.FC<AboutMeProps> = ({ onBack, t }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 md:py-24 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex flex-col lg:flex-row gap-16 md:gap-24 items-start mb-24">
        {/* Profile Image & Quick Info */}
        <div className="lg:w-1/3 w-full space-y-12">
          <div className="relative group">
            <div className="absolute -inset-4 bg-slate-900/10 dark:bg-white/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border border-white/20 dark:border-slate-800 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
                alt="Lochinbek Dehkonov" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {['UX Strategy', 'Brand Architecture', 'System Design', 'AI Ethics', 'Minimalist UI'].map(skill => (
                <span key={skill} className="px-5 py-2.5 bg-white/40 dark:bg-slate-900/40 border border-white/10 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Socials</h3>
            <div className="flex flex-col gap-4">
              <a href="#" className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest hover:text-blue-500 transition-colors">
                <span className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-lg">in</span>
                LinkedIn
              </a>
              <a href="#" className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-colors">
                <span className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-lg">tw</span>
                Twitter / X
              </a>
            </div>
          </div>
        </div>

        {/* Biography & Philosophy */}
        <div className="lg:w-2/3 w-full">
          <button 
            onClick={onBack}
            className="mb-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            ← {t.back}
          </button>
          
          <h1 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter leading-[0.9] text-slate-950 dark:text-white">
            Lochinbek <br /> Dehkonov
          </h1>
          
          <div className="prose prose-xl dark:prose-invert font-serif leading-relaxed text-slate-700 dark:text-slate-300 space-y-10">
            <p className="text-2xl md:text-4xl italic leading-tight text-slate-900 dark:text-white font-medium">
              "{t.about_quote}"
            </p>
            
            <p className="font-sans text-lg md:text-2xl font-medium tracking-tight leading-relaxed">
              {t.about_bio_1}
            </p>
            
            <p className="font-sans text-lg md:text-2xl font-medium tracking-tight leading-relaxed">
              {t.about_bio_2}
            </p>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-12 pt-16 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">{t.location}</span>
              <span className="font-black dark:text-white uppercase text-xs tracking-widest">Tashkent, UZ</span>
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">{t.status}</span>
              <span className="font-black dark:text-white uppercase text-xs tracking-widest">{t.available}</span>
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">{t.focus}</span>
              <span className="font-black dark:text-white uppercase text-xs tracking-widest">Web3 Architecture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent CTA / Contact Section */}
      <section className="glass rounded-[4rem] p-12 md:p-24 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-1000" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-6xl font-black dark:text-white uppercase tracking-tighter leading-none">
            Let's Shape the <br /> Future Together
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium">
            Available for selected consultancies, architectural design projects, and intellectual collaborations. Reach out to start a conversation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 w-full justify-center">
            <a 
              href="mailto:contact@ld-platform.com"
              className="w-full sm:w-auto px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl text-center"
            >
              Get in Touch
            </a>
            <button 
              className="w-full sm:w-auto px-12 py-6 glass rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white dark:hover:bg-white/10 transition-all text-center"
            >
              Download CV
            </button>
          </div>
          
          <div className="pt-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Response time: Usually within 24 hours
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutMe;
