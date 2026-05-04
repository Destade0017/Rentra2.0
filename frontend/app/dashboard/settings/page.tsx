'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Lock, 
  Building2, 
  Settings2,
  Camera,
  Check,
  ShieldCheck,
  Phone,
  MapPin,
  Coins
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (section: string) => {
    setLoadingSection(section);
    setTimeout(() => {
      setLoadingSection(null);
      toast.success(`${section} updated`, {
        className: 'rounded-2xl font-bold uppercase tracking-widest text-[9px] px-6 py-4 border-green-100 bg-white shadow-xl shadow-green-50/50',
        icon: <Check className="h-4 w-4 text-green-500" />
      });
    }, 1000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 max-w-[800px] mx-auto w-full space-y-16 pb-32 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="px-1 space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 font-medium">Manage your profile, business info, and account security.</p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* 1. PROFILE SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
             <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <User className="h-4 w-4" />
             </div>
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Personal Profile</h2>
          </div>
          
          <Card className="p-8 border-slate-100 bg-white rounded-[32px] shadow-sm hover:shadow-md transition-all duration-500">
            <div className="space-y-8">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-8 w-8 text-slate-300" />
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 hover:scale-110 active:scale-95 transition-all border-4 border-white"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Profile Picture</p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">JPG, PNG or GIF. Max size of 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                  <Input className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white font-semibold text-slate-700 transition-all" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                  <Input className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white font-semibold text-slate-700 transition-all" placeholder="your@email.com" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-50">
                <Button 
                  onClick={() => handleSave('Profile')}
                  disabled={loadingSection === 'Profile'}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 h-12 font-bold shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                >
                  {loadingSection === 'Profile' ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 2. BUSINESS / ACCOUNT SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
             <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Building2 className="h-4 w-4" />
             </div>
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Business Details</h2>
          </div>
          
          <Card className="p-8 border-slate-100 bg-white rounded-[32px] shadow-sm">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                    <User className="h-3 w-3" /> Landlord Display Name
                  </label>
                  <Input className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white font-semibold text-slate-700 transition-all" placeholder="e.g. Rentra Properties Ltd" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                    <Phone className="h-3 w-3" /> Phone Number
                  </label>
                  <Input className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white font-semibold text-slate-700 transition-all" placeholder="+234..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Business Address (Optional)
                </label>
                <Input className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white font-semibold text-slate-700 transition-all" placeholder="Enter physical address" />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-50">
                <Button 
                  onClick={() => handleSave('Business')}
                  disabled={loadingSection === 'Business'}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 h-12 font-bold shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                >
                  {loadingSection === 'Business' ? 'Updating...' : 'Save Business Info'}
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 3. SECURITY SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
             <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Lock className="h-4 w-4" />
             </div>
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Security</h2>
          </div>
          
          <Card className="p-8 border-slate-100 bg-white rounded-[32px] shadow-sm">
            <div className="space-y-8">
              <div className="flex items-center gap-4 p-5 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                 <ShieldCheck className="h-5 w-5 text-amber-600" />
                 <p className="text-xs font-bold text-amber-900">Your account is protected by industry-standard encryption.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Current Password</label>
                  <Input type="password" placeholder="••••••••" className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white font-semibold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">New Password</label>
                  <Input type="password" placeholder="Min. 8 characters" className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white font-semibold" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-50">
                <Button 
                  onClick={() => handleSave('Security')}
                  disabled={loadingSection === 'Security'}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 h-12 font-bold shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                >
                  {loadingSection === 'Security' ? 'Securing...' : 'Update Password'}
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 4. PREFERENCES SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
             <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Coins className="h-4 w-4" />
             </div>
             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Preferences</h2>
          </div>
          
          <Card className="p-8 border-slate-100 bg-white rounded-[32px] shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">Portfolio Currency</p>
                <p className="text-xs text-slate-400 font-medium">This will be the default currency for all rent metrics.</p>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                <Button variant="ghost" className="h-10 px-6 rounded-xl bg-white text-indigo-600 shadow-sm font-black text-sm border border-slate-100">
                   ₦ Naira
                </Button>
                <Button variant="ghost" disabled className="h-10 px-6 rounded-xl text-slate-300 font-bold text-sm">
                   $ USD
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
