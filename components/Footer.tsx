import React from 'react';

interface FooterProps {
  t: any;
  onArchives: () => void;
  onAbout: () => void;
  onManifesto: () => void;
  onTags: () => void;
  onJournal: () => void;
}

const Footer: React.FC<FooterProps> = ({ t, onArchives, onAbout, onManifesto, onTags, onJournal }) => {
  return (
    <footer className="bg-slate-950 text-slate-500 py-16 md:py-32 mt-10 md:mt-20 border-t border-slate-900 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
        <div className="col-span-1 sm:col-span-2">
          <div className="flex items-center gap-3 md:gap-4 text-white mb-6 md:mb-10">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center font-black text-black text-xl md:text-2xl">LD</div>
            <span className="text-xl md:text-3xl font-black tracking-tighter uppercase">Lochinbek Dehkonov</span>
          </div>
          <p className="text-sm md:text-lg leading-relaxed mb-8 md:mb-12 max-w-sm font-medium text-slate-400">
            {t.footer_text}
          </p>
          
          <div className="flex flex-wrap gap-6 md:gap-10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] mb-6 md:mb-10">Navigation</h4>
          <ul className="space-y-4 md:space-y-6 text-sm font-bold">
            <li>
              <button onClick={onArchives} className="hover:text-white transition-colors text-left uppercase text-[9px] md:text-[10px] tracking-widest font-black">
                The Archives
              </button>
            </li>
            <li>
              <button onClick={onAbout} className="hover:text-white transition-colors text-left uppercase text-[9px] md:text-[10px] tracking-widest font-black">
                {t.about}
              </button>
            </li>
            <li>
              <button onClick={onManifesto} className="hover:text-white transition-colors text-left uppercase text-[9px] md:text-[10px] tracking-widest font-black">
                Manifesto
              </button>
            </li>
            <li>
              <button onClick={onTags} className="hover:text-white transition-colors text-left uppercase text-[9px] md:text-[10px] tracking-widest font-black">
                Curated Tags
              </button>
            </li>
            <li>
              <button onClick={onJournal} className="hover:text-white transition-colors text-left uppercase text-[9px] md:text-[10px] tracking-widest font-black">
                Journal
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] mb-6 md:mb-10">Language</h4>
          <div className="flex flex-col gap-4 text-[9px] md:text-[10px] font-bold">
             <a href="?lang=uz" className="hover:text-white uppercase tracking-widest">O'zbekcha</a>
             <a href="?lang=en" className="hover:text-white uppercase tracking-widest">English</a>
             <a href="?lang=ru" className="hover:text-white uppercase tracking-widest">Русский</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-16 md:mt-32 pt-8 md:pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-[8px] md:text-[10px] uppercase font-black tracking-[0.3em] md:tracking-[0.4em] text-slate-800 text-center">
        <span>© 2025 LOCHINBEK DEHKONOV PLATFORM</span>
        <div className="flex gap-8 md:gap-12">
            <a href="#" className="hover:text-slate-400">Security</a>
            <a href="#" className="hover:text-slate-400">Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;