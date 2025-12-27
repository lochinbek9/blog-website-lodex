import React from 'react';
import { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  t: any;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, activeCategory, onSelectCategory, t }) => {
  return (
    <aside className="w-full space-y-8 md:space-y-12">
      <div>
        <h3 className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-6 md:mb-8 px-4 md:px-8">
          {t.discover}
        </h3>
        <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-3 px-2 md:px-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 lg:w-full flex items-center gap-3 md:gap-5 px-6 md:px-8 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-500 group ${
                activeCategory === cat.id
                  ? 'glass bg-white dark:bg-white text-slate-950 dark:text-black font-black shadow-2xl scale-[1.02]'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 bg-slate-100/50 dark:bg-slate-900/50 lg:bg-transparent'
              }`}
            >
              <span className={`text-xl md:text-2xl transition-transform duration-500 group-hover:scale-125 ${activeCategory === cat.id ? 'scale-110' : ''}`}>
                {cat.icon}
              </span>
              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                {cat.id === 'all' ? t.all : cat.name}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/40 dark:border-white/5 shadow-2xl relative overflow-hidden group mx-2 md:mx-0">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <h4 className="font-black mb-3 md:mb-4 text-xl md:text-2xl dark:text-white tracking-tighter leading-tight uppercase">{t.digest}</h4>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs mb-8 md:mb-10 leading-relaxed font-medium">Intellectual curation for modern architects.</p>
        <div className="space-y-3 md:space-y-4">
          <input 
            type="email" 
            placeholder="E-mail" 
            className="w-full bg-slate-100 dark:bg-slate-950/50 border border-transparent focus:border-blue-500/30 rounded-2xl px-6 py-4 md:py-5 text-xs outline-none transition-all dark:text-white font-medium"
          />
          <button className="w-full bg-slate-950 dark:bg-white text-white dark:text-black font-black py-4 md:py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-[1.05] active:scale-95 transition-all shadow-xl">
            {t.subscribe}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;