
import React, { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onAdminLogin?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onAdminLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin logini tekshiruvi
    if (formData.email === 'admin@panel.com' && formData.password === 'admin123') {
      if (onAdminLogin) {
        onAdminLogin();
      } else {
        alert('Admin Panel activated!');
        onClose();
      }
      return;
    }

    // Oddiy foydalanuvchilar uchun demo xabar
    alert('Oddiy foydalanuvchi tizimi tez kunda ishga tushadi! (Hozircha faqat Admin)');
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
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 text-center tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-10">Access your curated dashboard.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input 
                required
                type="email" 
                className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:border-slate-900 dark:focus:border-white outline-none transition-all dark:text-white text-sm"
                placeholder="Email Address"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <input 
                required
                type="password" 
                className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:border-slate-900 dark:focus:border-white outline-none transition-all dark:text-white text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl transition-all active:scale-[0.98] mt-4 shadow-xl text-xs uppercase tracking-widest"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-8 text-center space-y-4">
             <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest font-black">
              Cancel
            </button>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Demo Admin: admin@panel.com / admin123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
