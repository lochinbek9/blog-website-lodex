
'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_BLOGS_BY_LANG, CATEGORIES as INITIAL_CATEGORIES } from './constants';
import { BlogPost, Category } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import BlogDetail from './components/BlogDetail';
import AboutMe from './components/AboutMe';
import VideoLessons from './components/VideoLessons';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import SignupModal from './components/SignupModal';
import LoginModal from './components/LoginModal';
import ShareModal from './components/ShareModal';
import { translations, LangType } from './translations';
import { TelegramService } from './services/telegramService';

type ViewMode = 'blog' | 'manifesto' | 'tags' | 'about' | 'videos';

const App: React.FC = () => {
  const [lang, setLang] = useState<LangType>('uz');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('blog');
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [sharingPost, setSharingPost] = useState<BlogPost | null>(null);
  const [isPreAuthorized, setIsPreAuthorized] = useState(false);

  const [botToken, setBotToken] = useState('');
  const [isBotActive, setIsBotActive] = useState(false);
  const tgServiceRef = useRef<TelegramService | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const storageKeyBlogs = `ld_blogs_${lang}`;
    const storageKeyCats = `ld_categories`;
    
    const savedBlogs = localStorage.getItem(storageKeyBlogs);
    const savedCats = localStorage.getItem(storageKeyCats);

    if (savedBlogs) {
      try {
        setBlogs(JSON.parse(savedBlogs));
      } catch (e) {
        setBlogs(MOCK_BLOGS_BY_LANG[lang] || MOCK_BLOGS_BY_LANG['en']);
      }
    } else {
      setBlogs(MOCK_BLOGS_BY_LANG[lang] || MOCK_BLOGS_BY_LANG['en']);
    }

    if (savedCats) {
      try {
        setCategories(JSON.parse(savedCats));
      } catch (e) {
        setCategories(INITIAL_CATEGORIES);
      }
    }
    
    const savedToken = localStorage.getItem('tg_token') || '';
    setBotToken(savedToken);
    
    setIsLoaded(true);
  }, [lang]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`ld_blogs_${lang}`, JSON.stringify(blogs));
      localStorage.setItem('ld_categories', JSON.stringify(categories));
    }
  }, [blogs, categories, lang, isLoaded]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    if (isBotActive && botToken) {
      tgServiceRef.current = new TelegramService(botToken);
      tgServiceRef.current.startPolling(
        (newPost) => setBlogs(prev => [newPost, ...prev]),
        categories,
        blogs.length
      );
    } else {
      tgServiceRef.current?.stopPolling();
    }
    return () => tgServiceRef.current?.stopPolling();
  }, [isBotActive, botToken, categories, blogs.length]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(post => {
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [blogs, activeCategory, searchQuery]);

  const latestPost = filteredBlogs[0] || blogs[0];
  const activePost = blogs.find(p => p.id === activePostId);

  const handlePostClick = (id: string) => {
    setActivePostId(id);
    setViewMode('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActivePostId(null);
    setActiveCategory('all');
    setViewMode('blog');
    setSearchQuery('');
  };

  const handleShowAbout = () => {
    setViewMode('about');
    setActivePostId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowVideos = () => {
    setViewMode('videos');
    setActivePostId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdatePost = (updatedPost: BlogPost) => {
    setBlogs(prev => prev.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  const handleAdminLogin = () => {
    setIsLoginOpen(false);
    setIsPreAuthorized(true);
    setIsAdminOpen(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col transition-colors duration-700">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-emerald-400/10 dark:bg-emerald-600/5 rounded-full blur-[80px] animate-blob animation-delay-4000"></div>
      </div>

      <Header 
        onSearch={setSearchQuery} 
        onNavigateHome={handleGoHome} 
        onNavigateAbout={handleShowAbout}
        onNavigateVideos={handleShowVideos}
        onLogin={() => setIsLoginOpen(true)}
        onSignup={() => setIsSignupOpen(true)}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        lang={lang}
        onLangChange={setLang}
        t={t}
      />

      <main className="relative z-10 flex-grow max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 w-full">
        {viewMode === 'about' ? (
          <AboutMe onBack={handleGoHome} t={t} />
        ) : viewMode === 'videos' ? (
          <VideoLessons t={t} />
        ) : activePost ? (
          <BlogDetail 
            post={activePost} 
            allPosts={blogs}
            onBack={() => setActivePostId(null)} 
            t={t}
            onShare={() => setSharingPost(activePost)}
            onNavigatePost={handlePostClick}
            onNavigateAbout={handleShowAbout}
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="order-2 lg:order-1 lg:w-80 shrink-0">
               <Sidebar 
                categories={categories}
                activeCategory={activeCategory} 
                onSelectCategory={setActiveCategory} 
                t={t}
               />
               <button 
                 onClick={() => { setIsPreAuthorized(false); setIsAdminOpen(true); }}
                 className="mt-10 w-full flex items-center justify-center gap-3 p-6 glass rounded-[2.5rem] text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-slate-950 dark:hover:text-white transition-all group shadow-xl hover:shadow-2xl"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                 Command Center
               </button>
            </div>

            <div className="flex-1 order-1 lg:order-2 space-y-12">
              {activeCategory === 'all' && !searchQuery && latestPost && (
                <Hero post={latestPost} onClick={() => handlePostClick(latestPost.id)} t={t} />
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                {filteredBlogs.map((post) => (
                  <article 
                    key={post.id} 
                    onClick={() => handlePostClick(post.id)} 
                    className="group cursor-pointer glass rounded-[2.5rem] md:rounded-[3rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl border border-white/40 dark:border-white/5"
                  >
                    <div className="h-48 md:h-72 overflow-hidden relative">
                      <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-6 md:p-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-500">{post.category}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black mb-4 dark:text-white leading-tight group-hover:text-blue-500 transition-colors">{post.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 font-medium leading-relaxed">{post.summary}</p>
                    </div>
                  </article>
                ))}
                {filteredBlogs.length === 0 && (
                  <div className="col-span-full py-20 text-center text-slate-400 uppercase font-black tracking-widest text-xs opacity-50">
                    Maqola topilmadi
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {isAdminOpen && (
        <AdminPanel 
          posts={blogs} 
          categories={categories}
          onAddPost={(p) => setBlogs([p, ...blogs])} 
          onUpdatePost={handleUpdatePost}
          onAddCategory={(cat) => setCategories([...categories, cat])}
          onDeletePost={(id) => setBlogs(blogs.filter(b => b.id !== id))} 
          onClose={() => setIsAdminOpen(false)}
          botToken={botToken}
          setBotToken={(t) => { setBotToken(t); localStorage.setItem('tg_token', t); }}
          isBotActive={isBotActive}
          setIsBotActive={setIsBotActive}
          initialAuthorized={isPreAuthorized}
        />
      )}

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} onAdminLogin={handleAdminLogin} />}
      {isSignupOpen && <SignupModal onClose={() => setIsSignupOpen(false)} />}
      {sharingPost && <ShareModal post={sharingPost} onClose={() => setSharingPost(null)} />}
      <Footer t={t} onArchives={handleGoHome} onAbout={handleShowAbout} onManifesto={() => {}} onTags={() => {}} onJournal={() => {}} />
    </div>
  );
};

export default App;
