
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { BotMessage, BlogPost, Category } from '../types';
import { generateBlogImage } from '../services/geminiService';

interface TelegramBotProps {
  onAddPost: (post: BlogPost) => void;
  categories: Category[];
  postsCount: number;
}

type BotSimState = 'IDLE' | 'TITLE' | 'CONTENT' | 'IMAGE_CHOICE' | 'IMAGE_UPLOAD' | 'CATEGORY';

const TelegramBot: React.FC<TelegramBotProps> = ({ onAddPost, categories, postsCount }) => {
  const [messages, setMessages] = useState<BotMessage[]>([
    { id: '1', text: 'Salom, Admin! Men LD Blog botiman. /start tugmasini bosing yoki yangi post yaratishni boshlang.', sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [state, setState] = useState<BotSimState>('IDLE');
  const [draft, setDraft] = useState<Partial<BlogPost>>({});
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const addMsg = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender, timestamp: new Date() }]);
  };

  const handleAction = async (val: string) => {
    if (val === '/start' || val === '🏠 Bosh Menyu') {
      setState('IDLE');
      addMsg("LD Admin Botga xush kelibsiz! Harakatni tanlang:", 'bot');
      return;
    }

    if (val === '📝 Yangi Post') {
      setState('TITLE');
      addMsg("Post uchun **Sarlavha** yuboring:", 'bot');
      return;
    }

    if (state === 'TITLE') {
      setDraft({ ...draft, title: val });
      setState('CONTENT');
      addMsg("Endi maqola **matnini** yuboring:", 'bot');
      return;
    }

    if (state === 'CONTENT') {
      setDraft({ ...draft, content: val });
      setState('IMAGE_CHOICE');
      addMsg("Rasm qo'shish usulini tanlang:", 'bot');
      return;
    }

    if (state === 'IMAGE_CHOICE') {
      if (val === '🤖 AI Rasm') {
        setIsTyping(true);
        const img = await generateBlogImage(draft.title || 'Design');
        setDraft({ ...draft, image: img || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab' });
        setIsTyping(false);
        setState('CATEGORY');
        addMsg("AI rasm tayyor! Endi kategoriyani tanlang:", 'bot');
      } else if (val === '🖼️ Lokal yuklash') {
        setState('IMAGE_UPLOAD');
        addMsg("Marhamat, rasm URL manzilini yoki 'test-img' deb yozing:", 'bot');
      } else if (val === '⏭️ Rasmsiz') {
        setDraft({ ...draft, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab' });
        setState('CATEGORY');
        addMsg("Maqola rasmsiz saqlanadi. Kategoriyani tanlang:", 'bot');
      }
      return;
    }

    if (state === 'IMAGE_UPLOAD') {
      setDraft({ ...draft, image: val === 'test-img' ? 'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa' : val });
      setState('CATEGORY');
      addMsg("Rasm qabul qilindi. Kategoriyani tanlang:", 'bot');
      return;
    }

    if (state === 'CATEGORY') {
      const finalPost: BlogPost = {
        id: `sim-${Date.now()}`,
        title: draft.title || 'No Title',
        summary: draft.content?.slice(0, 100) + '...',
        content: draft.content || '',
        image: draft.image || '',
        category: val.toLowerCase(),
        author: 'Sim Admin',
        date: new Date().toLocaleDateString(),
        hashtags: ['sim'],
        comments: [],
        views: 0
      };
      onAddPost(finalPost);
      setState('IDLE');
      addMsg(`✅ Muvaffaqiyatli! "${finalPost.title}" qo'shildi.`, 'bot');
      return;
    }
    
    addMsg("Tushunmadim. /start ni bosing.", 'bot');
  };

  return (
    <div className="flex flex-col h-full bg-[#0E1621] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="bg-[#17212B] p-4 border-b border-black/20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-black text-white">LD</div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm leading-none">LD Admin Bot (Sim)</span>
          <span className="text-blue-400 text-[10px] font-medium uppercase tracking-widest mt-1">online</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0E1621]">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-[1.5rem] text-[13px] max-w-[85%] leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-[#2B5278] text-white rounded-tr-sm' : 'bg-[#17212B] text-slate-200 rounded-tl-sm'}`}>
              {m.text}
              <div className="text-[9px] opacity-40 mt-1 text-right">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-[#17212B] p-4 rounded-[1.5rem] rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-[#17212B] border-t border-black/20">
         <div className="grid grid-cols-2 gap-2">
            {state === 'IDLE' && (
              <>
                <button onClick={() => handleAction('📝 Yangi Post')} className="bg-[#2B5278] hover:bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">📝 Yangi Post</button>
                <button onClick={() => handleAction('📊 Statistika')} className="bg-[#2B5278] hover:bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">📊 Statistika</button>
              </>
            )}
            {state === 'IMAGE_CHOICE' && (
              <>
                <button onClick={() => handleAction('🤖 AI Rasm')} className="bg-[#2B5278] hover:bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">🤖 AI Rasm</button>
                <button onClick={() => handleAction('🖼️ Lokal yuklash')} className="bg-[#2B5278] hover:bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">🖼️ Lokal yuklash</button>
                <button onClick={() => handleAction('⏭️ Rasmsiz')} className="bg-[#2B5278] hover:bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors col-span-2">⏭️ Rasmsiz</button>
              </>
            )}
            {state === 'CATEGORY' && categories.filter(c => c.id !== 'all').slice(0, 4).map(c => (
              <button key={c.id} onClick={() => handleAction(c.name)} className="bg-[#2B5278] hover:bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
                {c.icon} {c.name}
              </button>
            ))}
         </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if(inputValue) { addMsg(inputValue, 'user'); handleAction(inputValue); setInputValue(''); } }} className="p-4 bg-[#17212B] flex items-center gap-4">
        <button type="button" onClick={() => handleAction('🏠 Bosh Menyu')} className="text-slate-400">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
        <input 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)} 
          className="flex-1 bg-transparent text-white text-[13px] outline-none placeholder:text-slate-500" 
          placeholder="Xabar yozing..." 
        />
        <button type="submit" className="text-blue-400 hover:text-white transition-colors">
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </form>
    </div>
  );
};

export default TelegramBot;
