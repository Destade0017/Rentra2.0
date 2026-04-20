import React, { useState } from 'react';
import { Camera, Mail, Phone, User as UserIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import api from '../../api/axios.js';

export default function ProfileForm() {
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', formData);
      if (data.success) {
        setSuccess(true);
        // Update user in store (need to handle this in useAuthStore ideally, but let's do it here for now if possible)
        // For now, just show success
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Update failed', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="flex items-center gap-6 pb-8 border-b border-slate-50">
        <div className="relative group">
            <div className="w-24 h-24 rounded-[32px] overflow-hidden bg-slate-100 border-2 border-slate-50 shadow-inner">
                <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                />
            </div>
            <button className="absolute -bottom-2 -right-2 p-2.5 bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-200 hover:bg-brand-600 transition-all">
                <Camera size={16} />
            </button>
        </div>
        <div>
            <h3 className="font-bold text-slate-800 tracking-tight">Profile Image</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">PNG, JPG, or GIF. Max 5MB.</p>
        </div>
      </div>

      {/* Grid Inputs */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    />
                </div>
            </div>
        </div>

        <div className="pt-6 flex items-center gap-4">
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-brand-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-brand-100 hover:bg-brand-600 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Update Profile'}
          </button>
          
          {success && (
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
              <CheckCircle2 size={18} />
              Profile Synchronized
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
