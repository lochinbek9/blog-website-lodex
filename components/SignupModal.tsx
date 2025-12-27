
import React, { useState } from 'react';

interface SignupModalProps {
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for joining LD! (Demo Mode)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20 dark:border-slate-800">
        <div className="p-12">
          <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black font-black text-2xl mx-auto mb-8 shadow-xl">
            LD
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 text-center tracking-tight">Join LD</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-10">Start your journey into high-level design.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <input 
              required
              type="text" 
              className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:border-slate-900 dark:focus:border-white outline-none transition-all dark:text-white text-sm"
              placeholder="Full Name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <input 
              required
              type="email" 
              className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:border-slate-900 dark:focus:border-white outline-none transition-all dark:text-white text-sm"
              placeholder="Email Address"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <input 
              required
              type="password" 
              className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:border-slate-900 dark:focus:border-white outline-none transition-all dark:text-white text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
            <button 
              type="submit"
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl transition-all active:scale-[0.98] mt-4 shadow-xl text-xs uppercase tracking-widest"
            >
              Create Account
            </button>
          </form>
          
          <button onClick={onClose} className="mt-8 text-center w-full text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest font-black">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
