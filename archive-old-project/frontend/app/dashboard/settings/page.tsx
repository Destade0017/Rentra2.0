'use client';

import { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardNavbar } from '@/components/dashboard-navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from 'next-themes';
import { 
  User, 
  Lock, 
  Palette, 
  LogOut, 
  Trash2, 
  Loader2, 
  ShieldCheck,
  Mail,
  UserCircle,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Smartphone,
  Bell
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

  // Sync theme to backend
  useEffect(() => {
    if (theme && user && (user as any).preferences?.darkMode !== (theme === 'dark')) {
      updatePreferences({ darkMode: theme === 'dark' });
    }
  }, [theme, user, updatePreferences]);

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
      <DashboardSidebar />

      <div className="lg:ml-72 flex flex-col min-h-screen">
        <DashboardNavbar />

        <main className="flex-1 p-6 md:p-10 lg:p-14 mt-20 max-w-7xl mx-auto w-full space-y-12 transition-all duration-300">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              Account Settings
            </h1>
            <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] italic opacity-80">
              Personal Information • Security • Preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             {/* Left Column: Forms */}
             <div className="lg:col-span-2 space-y-12">
                
                {/* Profile Section */}
                <Card className="premium-card p-10 dark:bg-slate-900/50 border-none shadow-2xl shadow-blue-900/5 rounded-[40px]">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3 mb-8">
                      <UserCircle className="text-blue-500" size={24} />
                      Identity & Contact
                   </h3>
                   <form onSubmit={handleProfileUpdate} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                              <div className="relative">
                                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                  <Input 
                                    className="h-14 pl-12 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-blue-500/10"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                  />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                              <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                  <Input 
                                    className="h-14 pl-12 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white"
                                    value={profileForm.email}
                                    disabled
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="flex justify-end pt-4">
                          <Button 
                            disabled={profileLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-10 py-7 font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20"
                          >
                            {profileLoading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                          </Button>
                      </div>
                   </form>
                </Card>

                {/* Security Section */}
                <Card className="premium-card p-10 dark:bg-slate-900/50 border-none shadow-2xl shadow-blue-900/5 rounded-[40px]">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3 mb-8">
                      <ShieldCheck className="text-emerald-500" size={24} />
                      Security Protocol
                   </h3>
                   <form onSubmit={handlePasswordChange} className="space-y-8">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                          <div className="relative">
                              <Input 
                                type={showPasswords.current ? "text" : "password"}
                                className="h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white"
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
                              <Input 
                                type={showPasswords.new ? "text" : "password"}
                                className="h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirm New</label>
                              <Input 
                                type={showPasswords.new ? "text" : "password"}
                                className="h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                              />
                          </div>
                      </div>
                      <div className="flex justify-end pt-4">
                          <Button 
                            disabled={passwordLoading}
                            className="bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 rounded-2xl px-10 py-7 font-black text-xs uppercase tracking-widest"
                          >
                            {passwordLoading ? <Loader2 className="animate-spin" /> : 'Update Securely'}
                          </Button>
                      </div>
                   </form>
                </Card>
             </div>

             {/* Right Column: Appearance & Danger */}
             <div className="space-y-12">
                {/* Visual Settings */}
                <Card className="premium-card p-10 dark:bg-slate-900/50 border-none shadow-2xl shadow-blue-900/5 rounded-[40px] space-y-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                       <Palette className="text-amber-500" size={24} />
                       Visual Style
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setTheme('light')}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${theme === 'light' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                        >
                            <Sun size={20} />
                            <p className="text-[8px] font-black uppercase tracking-widest">Day</p>
                        </button>
                        <button 
                          onClick={() => setTheme('dark')}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${theme === 'dark' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                        >
                            <Moon size={20} />
                            <p className="text-[8px] font-black uppercase tracking-widest">Night</p>
                        </button>
                    </div>
                </Card>

                {/* Account Actions */}
                <Card className="premium-card p-10 bg-rose-50 dark:bg-rose-950/20 border-none rounded-[40px] space-y-8">
                    <h3 className="text-xl font-black text-rose-600 dark:text-rose-400 tracking-tight flex items-center gap-3">
                       <LogOut size={24} />
                       Account
                    </h3>
                    <div className="space-y-4">
                        <Button 
                          onClick={logout}
                          variant="outline" 
                          className="w-full h-14 border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-xs uppercase tracking-widest"
                        >
                           Sign Out
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full text-rose-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-100/50"
                        >
                           Delete Account
                        </Button>
                    </div>
                </Card>
             </div>

          </div>
        </main>
      </div>
    </div>
  );
}
