
import React, { useState } from 'react';
import { BlogPost } from '../types';

interface ShareModalProps {
  post: BlogPost;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ post, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/archives/${post.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out this post: ${post.title}`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20 dark:border-slate-800">
        <div className="p-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Spread the Insight</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-10">Choose your preferred medium to share "{post.title}".</p>
          
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-4 p-5 bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <input 
                readOnly 
                value={shareUrl}
                className="flex-1 bg-transparent text-xs font-medium text-slate-500 outline-none overflow-hidden text-ellipsis"
              />
              <button 
                onClick={handleCopy}
                className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 whitespace-nowrap"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={shareOnTwitter}
                className="flex items-center justify-center gap-3 p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl font-black text-[10px] uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                Twitter
              </button>
              <button 
                onClick={shareOnFacebook}
                className="flex items-center justify-center gap-3 p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl font-black text-[10px] uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
