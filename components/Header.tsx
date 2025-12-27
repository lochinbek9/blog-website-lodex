'use client';
import React, { useState, useRef, useEffect } from 'react';
import { LangType } from '../translations';

interface HeaderProps {
  onSearch: (query: string) => void;
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateVideos: () => void;
  onLogin: () => void;
  onSignup: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  lang: LangType;
  onLangChange: (l: LangType) => void;
  t: any;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, onNavigateHome, onNavigateAbout, onNavigateVideos, onLogin, onSignup, isDarkMode, toggleTheme, lang, onLangChange, t
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const languages: {code: LangType, label: string, icon: string}[] = [
    { code: 'uz', label: 'O\'zbekcha', icon: '🇺🇿' },
    { code: 'en', label: 'English', icon: '🇺🇸' },
    { code: 'ru', label: 'Русский', icon: '🇷🇺' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-[60] glass border-b border-white/20 dark:border-white/5 h-16 md:h-28 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex items-center justify-between gap-2 md:gap-8">
          <div className="flex items-center gap-3 md:gap-10">
            {/* Logo */}
            <div onClick={() => { onNavigateHome(); closeMenu(); }} className="flex items-center gap-2 md:gap-4 cursor-pointer group shrink-0">
              <div className="w-9 h-9 md:w-16 md:h-16 bg-slate-950 dark:bg-white rounded-lg md:rounded-2xl flex items-center justify-center text-white dark:text-black font-black text-sm md:text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl">
                LD
              </div>
              <span className="text-xs md:text-2xl font-black tracking-tighter hidden sm:block text-slate-950 dark:text-white uppercase">
                Platform
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
               <button 
                 onClick={onNavigateVideos}
                 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all"
               >
                 {t.video_lessons}
               </button>
               <button 
                 onClick={onNavigateAbout}
                 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all underline-offset-8 hover:underline"
               >
                 {t.about}
               </button>
            </nav>
          </div>

          {/* Desktop Search */}
          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative group">
              <input
                type="text"
                placeholder={t.search}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full bg-slate-200/40 dark:bg-slate-800/40 border border-transparent focus:border-blue-500/50 rounded-[1.5rem] px-14 py-4 outline-none transition-all dark:text-white text-sm font-medium placeholder:text-slate-400"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-5">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 md:p-3 bg-white/50 dark:bg-white/5 rounded-lg md:rounded-2xl hover:scale-110 transition-all text-slate-600 dark:text-slate-400">
              {isDarkMode ? (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              ) : (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4">
              <button onClick={onLogin} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-950 dark:hover:text-white transition-all px-4">
                {t.login}
              </button>
              <button onClick={onSignup} className="px-6 md:px-8 py-3 md:py-4 bg-slate-950 dark:bg-white text-white dark:text-black rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                {t.join}
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 bg-slate-950 dark:bg-white text-white dark:text-black rounded-lg shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[55] lg:hidden">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300" onClick={closeMenu}></div>
          <div className="absolute top-16 left-0 right-0 glass border-b border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder={t.search}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full bg-slate-200/40 dark:bg-slate-800/40 border border-transparent focus:border-blue-500/50 rounded-2xl px-12 py-4 outline-none transition-all dark:text-white text-sm font-medium"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <nav className="flex flex-col gap-3">
              <button 
                onClick={() => { onNavigateHome(); closeMenu(); }}
                className="w-full text-left py-4 px-6 rounded-2xl bg-white/50 dark:bg-white/5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 active:scale-95 transition-transform"
              >
                {t.all}
              </button>
              <button 
                onClick={() => { onNavigateVideos(); closeMenu(); }}
                className="w-full text-left py-4 px-6 rounded-2xl bg-white/50 dark:bg-white/5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 active:scale-95 transition-transform"
              >
                {t.video_lessons}
              </button>
              <button 
                onClick={() => { onNavigateAbout(); closeMenu(); }}
                className="w-full text-left py-4 px-6 rounded-2xl bg-white/50 dark:bg-white/5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300 active:scale-95 transition-transform"
              >
                {t.about}
              </button>
            </nav>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { onLogin(); closeMenu(); }} className="py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white active:scale-95 transition-transform">
                {t.login}
              </button>
              <button onClick={() => { onSignup(); closeMenu(); }} className="py-4 rounded-2xl bg-slate-950 dark:bg-white text-[10px] font-black uppercase tracking-widest text-white dark:text-black active:scale-95 transition-transform shadow-lg">
                {t.join}
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Language</span>
              <div className="flex gap-4">
                {languages.map(l => (
                  <button 
                    key={l.code}
                    onClick={() => { onLangChange(l.code); closeMenu(); }}
                    className={`text-2xl ${lang === l.code ? 'opacity-100 scale-125' : 'opacity-40 grayscale'} transition-all`}
                  >
                    {l.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;