'use client';

import { useState, useEffect } from 'react';
import { LandlordSidebar } from '@/components/landlord-sidebar';
import { LandlordNavbar } from '@/components/landlord-navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from 'next-themes';
import { 
  User, 
  Lock, 
  Palette, 
  LogOut, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck,
  Mail,
  UserCircle,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, updateProfile, changePassword, updatePreferences, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Sync theme to backend
  useEffect(() => {
    if (theme && user && (user as any).preferences?.darkMode !== (theme === 'dark')) {
      updatePreferences({ darkMode: theme === 'dark' });
    }
  }, [theme, user, updatePreferences]);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    const res = await updateProfile(profileForm);
    setProfileLoading(false);
    if (res.success) {
      toast.success('Profile updated successfully');
    } else {
      toast.error(res.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setPasswordLoading(true);
    const res = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
    setPasswordLoading(false);

    if (res.success) {
      toast.success('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(res.message || 'Failed to update password');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500">
      <LandlordSidebar />
      <LandlordNavbar />

      <main className="lg:ml-72 mt-20 p-6 md:p-10 lg:p-14 max-w-5xl mx-auto space-y-12 transition-all duration-300">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            System Preferences
          </h1>
          <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] italic opacity-80">
            Account Management • Security • Visual Styling
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Section 1: Profile */}
           <div className="lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-0 lg:pr-12">
              <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-[28px] flex items-center justify-center text-white shadow-xl shadow-blue-600/20 mb-6">
                      <UserCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Personal Identity</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      Update your public name and associated business email address.
                  </p>
              </div>
           </div>

           <div className="lg:col-span-2">
              <Card className="premium-card p-10 dark:bg-slate-900/50 border-none shadow-2xl shadow-blue-900/5 rounded-[40px]">
                  <form onSubmit={handleProfileUpdate} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Display Name</label>
                              <div className="relative">
                                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                  <Input 
                                    className="h-14 pl-12 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-500/10 placeholder:text-slate-200"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                  />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Primary Email</label>
                              <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                  <Input 
                                    className="h-14 pl-12 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-500/10 placeholder:text-slate-200"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="flex justify-end pt-4">
                          <Button 
                            disabled={profileLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-10 py-7 font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20"
                          >
                            {profileLoading ? <Loader2 className="animate-spin" /> : 'Save Profile'}
                          </Button>
                      </div>
                  </form>
              </Card>
           </div>

           <div className="col-span-full border-t border-slate-100 dark:border-slate-800" />

           {/* Section 2: Security */}
           <div className="lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-0 lg:pr-12">
              <div className="space-y-4">
                  <div className="w-16 h-16 bg-rose-600 rounded-[28px] flex items-center justify-center text-white shadow-xl shadow-rose-600/20 mb-6">
                      <Lock size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Security Protocol</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      Maintain a strong password to protect your real estate portfolio data.
                  </p>
              </div>
           </div>

           <div className="lg:col-span-2">
              <Card className="premium-card p-10 dark:bg-slate-900/50 border-none shadow-2xl shadow-blue-900/5 rounded-[40px]">
                  <form onSubmit={handlePasswordChange} className="space-y-8">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                          <div className="relative">
                              <Input 
                                type={showPasswords.current ? "text" : "password"}
                                className="h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-500/10"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                              />
                              <button 
                                type="button" 
                                onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                              >
                                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                              <div className="relative">
                                  <Input 
                                    type={showPasswords.new ? "text" : "password"}
                                    className="h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-500/10"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                                  >
                                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </button>
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                              <div className="relative">
                                  <Input 
                                    type={showPasswords.confirm ? "text" : "password"}
                                    className="h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-500/10"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                                  >
                                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </button>
                              </div>
                          </div>
                      </div>
                      <div className="flex justify-end pt-4">
                          <Button 
                            disabled={passwordLoading}
                            className="bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 rounded-2xl px-10 py-7 font-black text-xs uppercase tracking-widest"
                          >
                            {passwordLoading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                          </Button>
                      </div>
                  </form>
              </Card>
           </div>

           <div className="col-span-full border-t border-slate-100 dark:border-slate-800" />

           {/* Section 3: Appearance */}
           <div className="lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-0 lg:pr-12">
              <div className="space-y-4">
                  <div className="w-16 h-16 bg-amber-500 rounded-[28px] flex items-center justify-center text-white shadow-xl shadow-amber-600/20 mb-6">
                      <Palette size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Visual Styling</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      Customise the interface to match your working environment.
                  </p>
              </div>
           </div>

           <div className="lg:col-span-2">
              <Card className="premium-card p-10 dark:bg-slate-900/50 border-none shadow-2xl shadow-blue-900/5 rounded-[40px] space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button 
                        onClick={() => setTheme('light')}
                        className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-6 ${theme === 'light' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400 shadow-sm'}`}
                      >
                          <Sun size={24} />
                          <div className="text-left">
                              <p className="font-extrabold uppercase text-[10px] tracking-widest">Day Mode</p>
                              <p className="text-xs font-medium opacity-60">High contrast clarity</p>
                          </div>
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-6 ${theme === 'dark' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400 shadow-sm'}`}
                      >
                          <Moon size={24} />
                          <div className="text-left">
                              <p className="font-extrabold uppercase text-[10px] tracking-widest">Night Mode</p>
                              <p className="text-xs font-medium opacity-60">Deep cinematic focus</p>
                          </div>
                      </button>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-[28px]">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                              <Smartphone size={20} />
                          </div>
                          <div>
                              <p className="font-black text-sm tracking-tight text-slate-900 dark:text-white">System Preference</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Follow OS Appearance</p>
                          </div>
                      </div>
                      <Switch 
                        checked={theme === 'system'} 
                        onCheckedChange={(checked) => setTheme(checked ? 'system' : 'light')} 
                      />
                  </div>
              </Card>
           </div>

           <div className="col-span-full border-t border-slate-100 dark:border-slate-800 pt-12 pb-24">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                      <h4 className="text-xl font-black text-rose-600 tracking-tight">Danger Zone</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Actions cannot be reversed</p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                      <Button 
                        onClick={logout}
                        variant="outline" 
                        className="flex-1 md:flex-none border-slate-200 rounded-2xl py-7 font-black text-[10px] uppercase tracking-widest gap-2 text-slate-600 dark:text-slate-400"
                      >
                        <LogOut size={16} /> Sign Out
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1 md:flex-none bg-rose-500 hover:bg-rose-600 rounded-2xl py-7 font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-rose-600/20"
                      >
                        <Trash2 size={16} /> Delete Empire
                      </Button>
                  </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
