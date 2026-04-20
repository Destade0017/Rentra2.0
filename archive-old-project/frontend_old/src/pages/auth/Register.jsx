import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  UserCircle,
  Eye,
  EyeOff,
  Check,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'landlord'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register, loading, error: serverError, clearError, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Password Strength Logic
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  // Real-time Validation
  useEffect(() => {
    const errors = {};
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setValidationErrors(errors);
  }, [formData.email, formData.password, formData.confirmPassword]);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = user?.role === 'landlord' ? '/' : '/tenant-dashboard';
      navigate(redirectPath, { replace: true });
    }
    return () => clearError();
  }, [isAuthenticated, user, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(validationErrors).length > 0) return;
    
    // We only send what the backend expects
    const { confirmPassword, ...submitData } = formData;
    const result = await register(submitData);
    if (result.success) {
      // Success handled by useEffect
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-slate-200';
    if (passwordStrength <= 2) return 'bg-amber-400';
    return 'bg-emerald-500';
  };

  const isFormValid = formData.name && 
                      formData.email && 
                      formData.password.length >= 6 && 
                      formData.password === formData.confirmPassword &&
                      !validationErrors.email;

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[40%] bg-brand-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <Building2 className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white uppercase italic">Rentra</span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
              Manage your <span className="text-accent-400">Empire</span> <br /> from anywhere.
            </h1>
            <p className="text-slate-300 text-lg font-medium max-w-md leading-relaxed">
              Join thousands of landlords automating their rental business with Rentra's next-gen platform.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex -space-x-3 mb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-500 bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-brand-500 bg-accent-500 flex items-center justify-center text-[10px] text-white font-bold">
              +2k
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Trusted by proprietors globally.
          </p>
        </div>
      </div>

      {/* Main Content - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24 relative">
        <div className="w-full max-w-md mx-auto relative z-10">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Building2 className="text-brand-500" size={28} />
            <span className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Rentra</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Create Account</h2>
            <p className="text-slate-500 font-medium">Get started with your property management portfolio.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence>
              {serverError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-semibold"
                >
                  <AlertCircle size={18} />
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4 mb-2">
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, role: 'landlord'})}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      formData.role === 'landlord' 
                        ? "border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-100" 
                        : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                  }`}
                >
                    <ShieldCheck size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Landlord</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: 'tenant'})}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      formData.role === 'tenant' 
                        ? "border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-100" 
                        : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                  }`}
                >
                    <UserCircle size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Tenant</span>
                </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all font-medium placeholder:text-slate-300"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full bg-slate-50 border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 transition-all font-medium placeholder:text-slate-300 ${
                    validationErrors.email ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-slate-100 focus:ring-accent-500/20 focus:border-accent-500'
                  }`}
                  placeholder="name@example.com"
                  required
                />
              </div>
              {validationErrors.email && <p className="text-[10px] text-rose-500 font-bold ml-4 tracking-wide">{validationErrors.email}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-end mr-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 w-4 rounded-full transition-colors ${i <= passwordStrength ? getStrengthColor() : 'bg-slate-100'}`} />
                  ))}
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all font-medium placeholder:text-slate-300"
                  placeholder="Minimum 6 characters"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent-500 transition-colors">
                  <ShieldCheck size={18} />
                </div>
                <input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full bg-slate-50 border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 transition-all font-medium ${
                    validationErrors.confirmPassword ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-slate-100 focus:ring-accent-500/20 focus:border-accent-500'
                  }`}
                  placeholder="Repeat your password"
                  required
                />
                {formData.confirmPassword && !validationErrors.confirmPassword && (
                    <div className="absolute inset-y-0 right-4 flex items-center text-emerald-500 pointer-events-none">
                        <Check size={18} />
                    </div>
                )}
              </div>
              {validationErrors.confirmPassword && <p className="text-[10px] text-rose-500 font-bold ml-4 tracking-wide">{validationErrors.confirmPassword}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading || !isFormValid}
              className="w-full bg-brand-500 text-white rounded-2xl py-4 font-bold text-sm shadow-xl shadow-brand-200 hover:bg-brand-600 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  Register for Rentra
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-500 font-bold hover:text-accent-500 underline-offset-4 hover:underline transition-all">
                    Sign in here
                </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
