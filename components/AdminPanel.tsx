
'use client';
import React, { useState, useMemo, useRef } from 'react';
import { BlogPost, Category } from '../types';
import { MOCK_STATS } from '../constants';
import TelegramBot from './TelegramBot';

interface AdminPanelProps {
  posts: BlogPost[];
  categories: Category[];
  onAddPost: (post: BlogPost) => void;
  onUpdatePost: (post: BlogPost) => void;
  onAddCategory: (category: Category) => void;
  onDeletePost: (id: string) => void;
  onClose: () => void;
  botToken: string;
  setBotToken: (t: string) => void;
  isBotActive: boolean;
  setIsBotActive: (a: boolean) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  posts, categories, onAddPost, onUpdatePost, onDeletePost, onClose,
  botToken, setBotToken, isBotActive, setIsBotActive
}) => {
  const [view, setView] = useState<'dashboard' | 'editor' | 'posts' | 'telegram' | 'media'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'tech',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    hashtags: '',
    additionalImages: ''
  });

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const addLink = () => {
    const url = prompt('Havola URL manzilini kiriting:');
    if (url) execCommand('createLink', url);
  };

  const handleEditClick = (post: BlogPost) => {
    setEditingPostId(post.id);
    setNewPost({
      title: post.title,
      category: post.category,
      image: post.image,
      hashtags: post.hashtags.join(', '),
      additionalImages: (post.additionalImages || []).join(', ')
    });
    setView('editor');
    // Editor mazmunini yuklash uchun timeout kerak, chunki view o'zgargandan so'ng render bo'lishi kerak
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = post.content;
      }
    }, 0);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contentHtml = editorRef.current?.innerHTML || '';
    const plainText = contentHtml.replace(/<[^>]*>/g, '');

    const postData: BlogPost = {
      id: editingPostId || `post-${Date.now()}`,
      title: newPost.title,
      summary: plainText.slice(0, 150) + '...',
      content: contentHtml,
      author: editingPostId ? (posts.find(p => p.id === editingPostId)?.author || 'Admin') : 'Admin',
      date: editingPostId ? (posts.find(p => p.id === editingPostId)?.date || new Date().toLocaleDateString()) : new Date().toLocaleDateString(),
      image: newPost.image,
      additionalImages: newPost.additionalImages.split(',').map(i => i.trim()).filter(i => i),
      category: newPost.category,
      hashtags: newPost.hashtags.split(',').map(t => t.trim()).filter(t => t),
      comments: editingPostId ? (posts.find(p => p.id === editingPostId)?.comments || []) : [],
      views: editingPostId ? (posts.find(p => p.id === editingPostId)?.views || 0) : 0
    };

    if (editingPostId) {
      onUpdatePost(postData);
    } else {
      onAddPost(postData);
    }

    setView('posts');
    setEditingPostId(null);
    setNewPost({ title: '', category: 'tech', image: '', hashtags: '', additionalImages: '' });
    if (editorRef.current) editorRef.current.innerHTML = '';
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [posts, searchQuery]);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-[#0a0f1e] w-full max-w-7xl h-full md:h-[90vh] md:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden border border-white/10">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-80 bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-white/5 p-8 flex flex-col">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-slate-950 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black font-black text-xl shadow-xl">LD</div>
            <div>
              <h2 className="text-sm font-black dark:text-white uppercase tracking-widest">Admin Hub</h2>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Authorized
              </span>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
              { id: 'posts', label: 'Postlar Arxivi', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
              { id: 'editor', label: 'Yangi maqola', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
              { id: 'telegram', label: 'TG Simulyatsiya', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
              { id: 'media', label: 'Media Library', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setView(item.id as any);
                  if (item.id === 'editor' && !editingPostId) {
                     setNewPost({ title: '', category: 'tech', image: '', hashtags: '', additionalImages: '' });
                     if (editorRef.current) editorRef.current.innerHTML = '';
                  }
                }} 
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${view === item.id ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-lg scale-105' : 'text-slate-400 hover:bg-white/10'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} /></svg>
                {item.label}
              </button>
            ))}
          </nav>

          <button onClick={onClose} className="mt-auto flex items-center justify-center gap-2 py-5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4-4H7m6 4v1h-3V7h3v1zm0 0l4 4-4 4m4-4H7" /></svg>
            Chiqish
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar bg-slate-50/30 dark:bg-transparent">
          
          {view === 'dashboard' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black dark:text-white tracking-tighter uppercase">Dashboard</h2>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oxirgi yangilanish: Bugun, {new Date().getHours()}:00</div>
              </div>

              {/* Bento Grid Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 p-10 glass rounded-[3rem] border border-white/10">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Monthly Traffic</span>
                  <div className="text-6xl font-black dark:text-white mt-4 tracking-tighter">45.2K</div>
                  <div className="mt-6 flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    +12% vs last month
                  </div>
                </div>
                <div className="p-10 glass rounded-[3rem] border border-white/10 flex flex-col justify-between">
                  <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Postlar</span>
                  <div className="text-5xl font-black dark:text-white tracking-tighter">{posts.length}</div>
                </div>
                <div className="p-10 glass rounded-[3rem] border border-white/10 flex flex-col justify-between">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Subscribers</span>
                  <div className="text-5xl font-black dark:text-white tracking-tighter">854</div>
                </div>
              </div>
            </div>
          )}

          {view === 'editor' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black dark:text-white tracking-tighter uppercase">
                  {editingPostId ? 'Maqolani Tahrirlash' : 'Maqola Muharriri'}
                </h2>
                <button 
                  onClick={() => setShowPreview(!showPreview)} 
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
                >
                  {showPreview ? 'Tahrirlash' : 'Ko\'rish (Preview)'}
                </button>
              </div>

              {showPreview ? (
                <div className="glass p-12 rounded-[4rem] animate-in fade-in duration-500">
                   <img src={newPost.image} className="w-full h-64 object-cover rounded-3xl mb-8 shadow-2xl" alt="" />
                   <h1 className="text-5xl font-black dark:text-white uppercase mb-6 tracking-tighter">{newPost.title || 'Sarlavha yo\'q'}</h1>
                   <div 
                    className="prose prose-xl dark:prose-invert max-w-none font-serif leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || '' }} 
                   />
                </div>
              ) : (
                <form onSubmit={handlePostSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Sarlavha</label>
                       <input required value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="w-full bg-white dark:bg-white/5 border border-white/10 p-5 rounded-2xl outline-none dark:text-white font-bold" placeholder="..." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Kategoriya</label>
                       <select value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})} className="w-full bg-white dark:bg-white/5 border border-white/10 p-5 rounded-2xl outline-none dark:text-white font-bold appearance-none">
                         {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                  </div>

                  {/* Rich Text Toolbar */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Maqola mazmuni</label>
                    <div className="bg-white dark:bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                      <div className="flex items-center gap-1 p-3 bg-slate-100 dark:bg-white/5 border-b border-white/10">
                        <button type="button" onClick={() => execCommand('bold')} className="p-3 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all font-bold dark:text-white text-lg w-12 h-12 flex items-center justify-center">B</button>
                        <button type="button" onClick={() => execCommand('italic')} className="p-3 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all italic dark:text-white text-lg w-12 h-12 flex items-center justify-center">I</button>
                        <button type="button" onClick={() => execCommand('underline')} className="p-3 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all underline dark:text-white text-lg w-12 h-12 flex items-center justify-center">U</button>
                        <div className="w-px h-6 bg-slate-300 dark:bg-white/10 mx-2"></div>
                        <button type="button" onClick={addLink} className="p-3 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all dark:text-white w-12 h-12 flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        </button>
                        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-3 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all dark:text-white w-12 h-12 flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <button type="button" onClick={() => execCommand('formatBlock', 'h2')} className="px-4 py-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all dark:text-white text-xs font-black uppercase tracking-widest">H2</button>
                        <button type="button" onClick={() => execCommand('formatBlock', 'p')} className="px-4 py-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all dark:text-white text-xs font-black uppercase tracking-widest">P</button>
                      </div>
                      
                      <div 
                        ref={editorRef}
                        contentEditable
                        className="w-full p-8 min-h-[400px] outline-none dark:text-white font-serif text-lg leading-relaxed custom-scrollbar overflow-y-auto"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Rasm URL</label>
                       <input value={newPost.image} onChange={e => setNewPost({...newPost, image: e.target.value})} className="w-full bg-white dark:bg-white/5 border border-white/10 p-5 rounded-2xl outline-none dark:text-white text-xs" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Hashtaglar (vergul bilan)</label>
                       <input value={newPost.hashtags} onChange={e => setNewPost({...newPost, hashtags: e.target.value})} className="w-full bg-white dark:bg-white/5 border border-white/10 p-5 rounded-2xl outline-none dark:text-white text-xs" placeholder="minimalizm, tech..." />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button type="submit" className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-black font-black py-6 rounded-3xl uppercase text-[10px] tracking-[0.5em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                      {editingPostId ? 'Saqlash' : 'Chop etish'}
                    </button>
                    {editingPostId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingPostId(null);
                          setView('posts');
                        }}
                        className="px-10 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black py-6 rounded-3xl uppercase text-[10px] tracking-widest"
                      >
                        Bekor qilish
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {view === 'posts' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between gap-8">
                <h2 className="text-4xl font-black dark:text-white tracking-tighter uppercase">Arxiv</h2>
                <input 
                  type="text" 
                  placeholder="Qidirish..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="max-w-xs w-full bg-white dark:bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-xs dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredPosts.map((p) => (
                  <div key={p.id} className="group p-6 bg-white dark:bg-white/5 rounded-[2.5rem] flex items-center justify-between border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                        <img src={p.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{p.category}</span>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{p.date}</span>
                        </div>
                        <h4 className="font-black dark:text-white text-lg tracking-tight uppercase">{p.title}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditClick(p)} 
                        className="p-4 text-blue-500 hover:bg-blue-500 hover:text-white rounded-2xl transition-all"
                        title="Tahrirlash"
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button 
                        onClick={() => onDeletePost(p.id)} 
                        className="p-4 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                        title="O'chirish"
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'telegram' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 h-full animate-in slide-in-from-bottom-4">
              <div className="space-y-12">
                <div>
                  <h2 className="text-4xl font-black dark:text-white tracking-tighter uppercase">TG BOT API</h2>
                  <p className="text-slate-500 text-xs mt-4 font-medium">Telegram orqali maqola qo'shish tizimini boshqarish.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-white/5 space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bot Token</label>
                    <input 
                      type="password"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl outline-none dark:text-white font-mono text-sm"
                      placeholder="••••••••••••••••••••••••"
                    />
                  </div>
                  
                  <button 
                    onClick={() => setIsBotActive(!isBotActive)}
                    className={`w-full py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl ${isBotActive ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-blue-600 text-white shadow-blue-500/20'}`}
                  >
                    {isBotActive ? 'Pollingni To\'xtatish' : 'Pollingni Yoqish'}
                  </button>
                </div>
              </div>
              <div className="h-[600px] md:h-full pb-12">
                 <TelegramBot onAddPost={onAddPost} categories={categories} postsCount={posts.length} />
              </div>
            </div>
          )}

          {view === 'media' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4">
              <h2 className="text-4xl font-black dark:text-white tracking-tighter uppercase">Media Library</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {posts.map((p, i) => (
                   <div key={i} className="group relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer">
                      <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                         <span className="text-[9px] font-black text-white uppercase tracking-widest truncate">{p.title}</span>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
