import React from 'react';
import { BlogPost } from '../types';

interface HeroProps {
  post: BlogPost;
  onClick: () => void;
  t: any;
}

const Hero: React.FC<HeroProps> = ({ post, onClick, t }) => {
  return (
    <div 
      onClick={onClick}
      className="relative w-full h-[400px] md:h-[750px] rounded-[2rem] md:rounded-[5rem] overflow-hidden group cursor-pointer shadow-2xl transition-all duration-700 hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)]"
    >
      <img 
        src={post.image} 
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 p-6 md:p-24 w-full">
        <div className="max-w-4xl space-y-4 md:space-y-8">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <span className="bg-white text-black text-[8px] md:text-[10px] font-black px-3 md:px-6 py-1.5 md:py-2.5 rounded-full uppercase tracking-widest shadow-2xl">
              Featured
            </span>
            <span className="text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-widest">{post.date}</span>
            <div className="hidden md:block h-px w-12 bg-white/20"></div>
            <span className="text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-widest hidden sm:inline">{post.views?.toLocaleString()} Views</span>
          </div>
          
          <h1 className="text-2xl md:text-8xl font-black text-white leading-[1.1] md:leading-[0.9] tracking-tighter uppercase transition-all duration-700 group-hover:tracking-normal line-clamp-3 md:line-clamp-none">
            {post.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8 pt-2 md:pt-4">
            <button className="w-full sm:w-auto bg-white text-black px-8 md:px-12 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl">
              {t.explore}
            </button>
            <div className="flex items-center gap-3 md:gap-4 group/author">
              <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center font-black text-white text-xs md:text-xl shadow-xl transition-transform duration-500 group-hover/author:rotate-12">
                {post.author[0]}
              </div>
              <div>
                <span className="block font-black text-white text-[10px] md:text-sm uppercase tracking-widest">{post.author}</span>
                <span className="block text-[7px] md:text-[10px] text-white/40 uppercase tracking-widest">Lead Strategist</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;