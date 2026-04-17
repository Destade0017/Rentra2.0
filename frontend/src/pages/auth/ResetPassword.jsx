import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, Loader2, Building2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { motion } from 'framer-motion';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return; // Add validation message if needed
    }
    const result = await resetPassword(token, password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-brand-50 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200">
              <Building2 className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Rentra</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">New Password</h1>
            <p className="text-slate-500 font-medium">Create a strong password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-semibold">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
              {password !== confirmPassword && confirmPassword !== '' && (
                <p className="text-[10px] text-rose-500 font-bold ml-1">Passwords do not match</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading || password !== confirmPassword}
              className="w-full bg-brand-500 text-white rounded-xl py-4 font-bold text-sm shadow-xl shadow-brand-200 hover:bg-brand-600 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  Update Password
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 text-sm font-medium">
            Go back to <Link to="/login" className="text-brand-500 font-bold hover:text-brand-600">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center bg-slate-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-600 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="relative z-10 text-center max-w-sm">
            <h2 className="text-4xl font-bold text-white mb-6">Recover Access</h2>
            <p className="text-slate-400 leading-relaxed font-medium">
                We use secure tokens to ensure only you can regain access to your Rentra account.
            </p>
        </div>
      </div>
    </div>
  );
}
