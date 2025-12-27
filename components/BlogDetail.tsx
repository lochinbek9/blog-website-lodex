
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { BlogPost, Comment } from '../types';
import { getBlogAISummary } from '../services/geminiService';

interface BlogDetailProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onBack: () => void;
  t: any;
  onShare: () => void;
  onNavigatePost: (id: string) => void;
  onNavigateAbout: () => void;
}

const ImageCarousel: React.FC<{ images: string[]; title: string; hashtags: string[] }> = ({ images, title, hashtags }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images.length) return null;

  return (
    <div className="relative mb-8 md:mb-16 rounded-[1.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl group h-[280px] sm:h-[400px] md:h-[600px]">
      <div className="absolute inset-0 transition-transform duration-700 ease-in-out">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${title} - image ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover grayscale-[30%] transition-opacity duration-1000 ${
              idx === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 glass rounded-full opacity-60 md:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-10"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 glass rounded-full opacity-60 md:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-10"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="absolute bottom-4 md:bottom-12 right-6 md:right-12 flex gap-1.5 md:gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 md:h-1.5 transition-all rounded-full ${
                  idx === currentIndex ? 'w-6 md:w-8 bg-white' : 'w-1.5 md:w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-4 md:bottom-12 left-4 md:left-12 flex flex-wrap gap-1.5 md:gap-3 z-10">
        {hashtags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[7px] md:text-[10px] font-black tracking-widest text-white bg-white/20 backdrop-blur-md px-3 md:px-6 py-1 md:py-2 rounded-full uppercase">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const CommentItem: React.FC<{ 
  comment: Comment; 
  onReply: (parentId: string, text: string) => void;
  t: any;
  level?: number;
  isLast?: boolean;
}> = ({ comment, onReply, t, level = 0, isLast = false }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText('');
    setIsReplying(false);
  };

  const avatarChar = comment.author ? comment.author.charAt(0).toUpperCase() : (comment.avatar || '?');

  return (
    <div className={`relative group animate-in fade-in duration-500 ${level > 0 ? 'ml-4 md:ml-10 mt-4 md:mt-6' : 'mt-8 md:mt-10 first:mt-0'}`}>
      {level > 0 && (
        <>
          <div 
            className="absolute -left-4 md:-left-10 top-0 border-l border-slate-200 dark:border-slate-800" 
            style={{ 
              height: isLast ? '16px' : 'calc(100% + 16px)',
              top: '-16px' 
            }}
          />
          <div 
            className="absolute -left-4 md:-left-10 top-4 md:top-6 w-4 md:w-10 border-t border-slate-200 dark:border-slate-800 rounded-bl-lg md:rounded-bl-xl" 
          />
        </>
      )}

      <div className="flex gap-3 md:gap-6 relative z-10">
        <div className="shrink-0 w-8 h-8 md:w-12 md:h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg md:rounded-xl flex items-center justify-center font-black text-slate-900 dark:text-white text-[10px] md:text-sm shadow-sm">
          {avatarChar}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
            <span className="font-black text-[9px] md:text-xs dark:text-white uppercase tracking-widest truncate">{comment.author}</span>
            <span className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">{comment.date}</span>
          </div>
          
          <div className="bg-slate-50/50 dark:bg-white/[0.02] p-4 md:p-6 rounded-xl md:rounded-3xl border border-slate-100 dark:border-white/5 group-hover:bg-white dark:group-hover:bg-white/[0.04] transition-colors">
            <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 leading-relaxed break-words">{comment.text}</p>
          </div>
          
          <div className="mt-2 flex items-center gap-4">
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              {isReplying ? t.cancel : t.reply}
            </button>
          </div>

          {isReplying && (
            <form onSubmit={handleSubmitReply} className="mt-4 animate-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <textarea
                  autoFocus
                  placeholder={t.thought_placeholder}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs md:text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 dark:text-white min-h-[80px] md:min-h-[100px] shadow-inner transition-all"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="mt-2 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-slate-900 dark:bg-white text-white dark:text-black font-black px-4 py-2 rounded-lg text-[8px] md:text-[9px] uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    {t.post_reply}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply, idx) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              onReply={onReply} 
              t={t}
              level={level + 1}
              isLast={idx === (comment.replies?.length || 0) - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BlogDetail: React.FC<BlogDetailProps> = ({ post, allPosts, onBack, t, onShare, onNavigatePost, onNavigateAbout }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [post.id]);

  const carouselImages = useMemo(() => {
    const imgs = [post.image];
    if (post.additionalImages) {
      imgs.push(...post.additionalImages);
    }
    return imgs;
  }, [post.image, post.additionalImages]);

  const hashtagRelatedPosts = useMemo(() => {
    if (!post.hashtags || post.hashtags.length === 0) return [];
    return allPosts
      .filter(p => p.id !== post.id && p.hashtags.some(tag => post.hashtags.includes(tag)))
      .slice(0, 3);
  }, [post.id, allPosts, post.hashtags]);

  const handleAISummarize = async () => {
    setLoadingAI(true);
    const summary = await getBlogAISummary(post.content);
    setAiSummary(summary);
    setLoadingAI(false);
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      author: 'Guest User',
      text: commentText,
      date: new Date().toLocaleDateString(),
      avatar: 'G',
      replies: []
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleReply = (parentId: string, text: string) => {
    const addReplyToComments = (list: Comment[]): Comment[] => {
      return list.map(c => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [
              ...(c.replies || []),
              {
                id: `reply-${Date.now()}`,
                author: 'Guest User',
                text,
                date: new Date().toLocaleDateString(),
                avatar: 'G',
                replies: []
              }
            ]
          };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: addReplyToComments(c.replies) };
        }
        return c;
      });
    };
    setComments(addReplyToComments(comments));
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 md:pb-20 animate-in slide-in-from-bottom-8 duration-700 px-4 md:px-0">
      <div className="flex items-center justify-between mb-6 md:mb-12">
        <button onClick={onBack} className="flex items-center gap-1.5 md:gap-2 text-slate-500 dark:text-slate-400 font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">
          ← {t.back}
        </button>
        <button 
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" /></svg>
          {t.share}
        </button>
      </div>

      <ImageCarousel images={carouselImages} title={post.title} hashtags={post.hashtags} />

      <h1 className="text-3xl md:text-7xl font-black mb-6 md:mb-12 leading-[1.1] md:leading-[1] text-slate-950 dark:text-white tracking-tighter uppercase break-words">
        {post.title}
      </h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 md:pb-12 mb-8 md:mb-16 gap-6">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="w-10 h-10 md:w-16 md:h-16 bg-slate-900 dark:bg-white rounded-lg md:rounded-[1.5rem] flex items-center justify-center font-black text-white dark:text-black text-lg md:text-2xl shadow-xl transition-transform hover:rotate-6 cursor-default">
            {post.author?.[0] || 'A'}
          </div>
          <div>
            <div className="font-black text-base md:text-xl dark:text-white flex items-center gap-2 md:gap-3">
              {post.author || 'Admin'}
              <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            </div>
            <div className="text-slate-400 text-[9px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span>{post.date}</span>
              <span className="opacity-30">•</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                {comments.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-3xl p-3 md:p-6 shadow-sm">
          <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-500/10 rounded-lg md:rounded-2xl flex items-center justify-center text-blue-500">
             <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-2xl font-black dark:text-white leading-none tracking-tighter">
              {post.views?.toLocaleString()}
            </span>
            <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
              Total {t.views}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-slate-800 p-6 md:p-10 rounded-2xl md:rounded-[3rem] mb-8 shadow-inner">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="font-black text-slate-950 dark:text-white text-[9px] md:text-xs uppercase tracking-[0.3em]">{t.ai_summary}</h3>
          <button 
            onClick={handleAISummarize}
            disabled={loadingAI}
            className="flex items-center gap-2 text-[8px] md:text-[10px] font-black bg-slate-950 dark:bg-white text-white dark:text-black px-4 py-2 md:px-6 md:py-2.5 rounded-lg md:rounded-xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest shadow-lg"
          >
            {loadingAI ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.extracting}
              </span>
            ) : (
              'Extract'
            )}
          </button>
        </div>
        {aiSummary && (
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-sm md:text-lg italic animate-in fade-in slide-in-from-top-2 duration-500">
            "{aiSummary}"
          </p>
        )}
      </div>

      {hashtagRelatedPosts.length > 0 && (
        <section className="mb-12 md:mb-20 animate-in fade-in duration-1000">
          <div className="px-6 md:px-10 py-8 md:py-12 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm">
            <div className="flex items-center gap-4 mb-8 md:mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
              <h4 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {t.more_on_tags}
              </h4>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {hashtagRelatedPosts.map(rp => (
                <div 
                  key={rp.id} 
                  onClick={() => onNavigatePost(rp.id)}
                  className="group cursor-pointer flex flex-col gap-4"
                >
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1">
                    <img src={rp.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={rp.title} />
                  </div>
                  <div className="px-1">
                    <h5 className="font-black text-xs md:text-sm dark:text-white leading-tight line-clamp-2 group-hover:text-blue-500 transition-colors uppercase tracking-tight">
                      {rp.title}
                    </h5>
                    <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">Discover</span>
                      <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Render HTML Content */}
      <article 
        className="prose prose-slate prose-sm sm:prose-base md:prose-2xl dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-[1.6] mb-12 md:mb-20 font-serif"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Author Bio Section */}
      <section className="mb-12 md:mb-20 p-8 md:p-12 glass rounded-[2.5rem] md:rounded-[3rem] border border-white/40 dark:border-white/5 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-20 h-20 md:w-32 md:h-32 shrink-0 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl grayscale hover:grayscale-0 transition-all duration-700">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
            alt="Lochinbek Dehkonov" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">The Author</h4>
          <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-4">Lochinbek Dehkonov</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-6 font-medium">
            Dizayn-arxitektor va texnologik tadqiqotchi. Raqamli minimalizm va foydalanuvchi tajribasining intellektual qatlamlari ustida ish olib boradi.
          </p>
          <button 
            onClick={onNavigateAbout}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-2 mx-auto md:mx-0 group/bio"
          >
            Learn More About the Author 
            <svg className="w-3.5 h-3.5 transition-transform group-hover/bio:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

      <section id="comments" className="pt-10 md:pt-20 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl md:text-4xl font-black mb-8 md:mb-12 dark:text-white tracking-tight uppercase">{t.dialogue}</h2>

        <form onSubmit={(e) => { e.preventDefault(); handlePostComment(); }} className="mb-12 md:mb-20">
          <textarea
            placeholder={t.thought_placeholder}
            className="w-full bg-white/30 dark:bg-slate-950/30 border border-white/20 dark:border-slate-800 rounded-2xl md:rounded-[2rem] p-5 md:p-10 min-h-[120px] md:min-h-[200px] focus:border-slate-400 transition-all outline-none resize-none mb-4 md:mb-6 dark:text-white text-sm md:text-lg font-medium"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex justify-end">
            <button 
              type="submit"
              className="w-full sm:w-auto bg-slate-950 dark:bg-white text-white dark:text-black font-black px-10 py-4 md:px-12 md:py-5 rounded-xl md:rounded-[2rem] hover:scale-105 transition-all shadow-2xl text-[10px] uppercase tracking-widest"
            >
              {t.post_comment}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {comments.map((comment, idx) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onReply={handleReply} 
              t={t}
              isLast={idx === comments.length - 1}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
