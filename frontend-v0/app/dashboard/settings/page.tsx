'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Lock, 
  Bell, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

type SettingsTab = 'account' | 'security' | 'notifications' | 'billing';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully', {
        className: 'rounded-2xl font-bold uppercase tracking-tighter text-[10px]'
      });
    }, 800);
  };

  const navItems = [
    { id: 'account', label: 'Account', icon: <User className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" /> },
  ];

  return (
    <div className="flex-1 max-w-[1000px] mx-auto w-full space-y-12 pb-24 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="px-1">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your profile and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Settings Sidebar */}
        <aside className="w-full lg:w-64 space-y-1 shrink-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SettingsTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`}>
                {item.icon}
              </div>
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Settings Content Area */}
        <div className="flex-1 max-w-xl animate-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'account' && (
            <div className="space-y-8">
              <section className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-900">Profile</h2>
                  <p className="text-sm text-slate-400">Update your personal information.</p>
                </div>
                <Card className="p-8 border-slate-200/50 bg-white rounded-2xl shadow-sm">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                        <Input className="h-11 rounded-xl bg-slate-50 border-slate-100 focus:bg-white font-medium" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Username</label>
                        <Input className="h-11 rounded-xl bg-slate-50 border-slate-100 focus:bg-white font-medium" placeholder="johndoe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Email</label>
                      <Input className="h-11 rounded-xl bg-slate-50 border-slate-100 focus:bg-white font-medium" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Bio</label>
                       <textarea className="w-full min-h-[100px] p-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none text-sm transition-all text-slate-600 font-medium" placeholder="A short description about yourself..." />
                    </div>
                  </div>
                </Card>
              </section>

              <div className="flex justify-end">
                 <Button 
                   onClick={handleSave} 
                   loading={loading}
                   className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl px-8 h-11 shadow-md shadow-indigo-100 font-semibold text-sm active:scale-95 transition-all"
                 >
                   Save Changes
                 </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <section className="space-y-6">
                 <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-900">Security</h2>
                  <p className="text-sm text-slate-500">Manage your password and access.</p>
                </div>
                <Card className="p-8 border-slate-200/50 bg-white rounded-2xl shadow-sm">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                       <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 border border-slate-100 shadow-sm">
                          <ShieldCheck className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">Account Secured</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status: Protected</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Current Password</label>
                        <Input type="password" placeholder="••••••••" className="h-11 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" />
                      </div>
                       <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">New Password</label>
                        <Input type="password" placeholder="Enter new password" className="h-11 rounded-xl bg-slate-50 border-slate-100 focus:bg-white" />
                      </div>
                    </div>
                    <Button 
                      onClick={handleSave} 
                      loading={loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-bold shadow-md shadow-indigo-100"
                    >
                      Save Changes
                    </Button>
                  </div>
                </Card>
              </section>
            </div>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-16 text-center border-dashed border-2 bg-white rounded-2xl">
              <div className="max-w-[240px] mx-auto space-y-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100 text-slate-300">
                  <Bell className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-slate-900">Coming Soon</p>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">Notifications and alerts are currently being developed.</p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card className="p-16 text-center border-dashed border-2 bg-white rounded-2xl">
              <div className="max-w-[240px] mx-auto space-y-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100 text-slate-300">
                  <CreditCard className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                   <p className="text-lg font-bold text-slate-900">Coming Soon</p>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed">Billing and plans will be available soon.</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
