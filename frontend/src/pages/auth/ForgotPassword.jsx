import React, { useState } from 'react';
import { Mail, ArrowRight, AlertCircle, Loader2, Building2, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await forgotPassword(email);
    if (result.success) {
      setSubmitted(true);
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

          {!submitted ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h1>
                <p className="text-slate-500 font-medium">Enter your email to receive a recovery link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-semibold">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-brand-500 text-white rounded-xl py-4 font-bold text-sm shadow-xl shadow-brand-200 hover:bg-brand-600 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      Send Reset link
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-emerald-500" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p className="text-slate-500 font-medium mb-8">
                We've sent a password reset link to <span className="text-slate-900 font-bold">{email}</span>.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-brand-500 font-bold hover:text-brand-600 flex items-center justify-center gap-2 mx-auto"
              >
                Try a different email
              </button>
            </motion.div>
          )}

          <p className="mt-8 text-center text-slate-400 text-sm font-medium">
            Remembered your password? <Link to="/login" className="text-brand-500 font-bold hover:text-brand-600">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center bg-slate-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="relative z-10 text-center max-w-sm">
            <h2 className="text-4xl font-bold text-white mb-6">Security first. Always.</h2>
            <p className="text-slate-400 leading-relaxed font-medium">
                Protecting your real estate data with enterprise-grade encryption and secure access protocols.
            </p>
        </div>
      </div>
    </div>
  );
}
