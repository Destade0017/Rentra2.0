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
  Save, 
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Check
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
      toast.success('Settings synchronized successfully', {
        className: 'rounded-xl font-bold uppercase tracking-tighter'
      });
    }, 800);
  };

  const navItems = [
    { id: 'account', label: 'Account Profile', icon: <User className="h-4 w-4" /> },
    { id: 'security', label: 'Security & Access', icon: <Lock className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'billing', label: 'Billing & Plans', icon: <CreditCard className="h-4 w-4" /> },
  ];

  return (
    <div className="flex-1 max-w-[1200px] mx-auto w-full space-y-12 pb-24 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">Settings</h1>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Workspace Control</span>
          <ChevronRight className="h-3 w-3 text-zinc-200" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-950 capitalize">{activeTab}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Settings Sidebar */}
        <aside className="w-full lg:w-64 space-y-2">
          <p className="px-4 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-4">Configuration</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SettingsTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' 
                  : 'text-zinc-500 hover:bg-white hover:shadow-sm hover:text-zinc-950'
              }`}
            >
              <div className={`transition-colors ${activeTab === item.id ? 'text-white' : 'text-zinc-300 group-hover:text-zinc-950'}`}>
                {item.icon}
              </div>
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
              {activeTab === item.id && <Check className="h-3 w-3 ml-auto text-zinc-400" />}
            </button>
          ))}
        </aside>

        {/* Settings Content Area */}
        <div className="flex-1 max-w-2xl animate-in slide-in-from-right-4 duration-500">
          {activeTab === 'account' && (
            <div className="space-y-10">
              <section className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="text-lg font-bold text-zinc-950 tracking-tight">Public Profile</h2>
                  <p className="text-sm text-zinc-400 font-medium tracking-tight">Manage how your name and identity appear in the workspace.</p>
                </div>
                <Card className="p-8 border-zinc-100 bg-white">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                        <Input className="h-12 rounded-xl bg-zinc-50/30 border-zinc-100 focus:bg-white" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Public Identifier</label>
                        <Input className="h-12 rounded-xl bg-zinc-50/30 border-zinc-100 focus:bg-white" placeholder="johndoe_01" />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Electronic Address</label>
                      <Input className="h-12 rounded-xl bg-zinc-50/30 border-zinc-100 focus:bg-white" placeholder="john@rentra.io" />
                    </div>
                    <div className="space-y-2.5">
                       <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Communication Bio</label>
                       <textarea className="w-full min-h-[120px] p-4 rounded-xl bg-zinc-50/30 border border-zinc-100 focus:bg-white focus:outline-none text-sm transition-all text-zinc-600 font-medium" placeholder="Brief description for messages..." />
                    </div>
                  </div>
                </Card>
              </section>

              <div className="flex justify-end pt-4">
                 <Button 
                   onClick={handleSave} 
                   disabled={loading}
                   className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl px-10 h-12 shadow-lg shadow-zinc-100 font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all"
                 >
                   {loading ? 'Synchronizing...' : 'Update Settings'}
                 </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-10">
              <section className="space-y-6">
                 <div className="space-y-1.5">
                  <h2 className="text-lg font-bold text-zinc-950 tracking-tight">Security & Access</h2>
                  <p className="text-sm text-zinc-400 font-medium tracking-tight">Update password and configure Multi-Factor Authentication.</p>
                </div>
                <Card className="p-8 border-zinc-100 bg-white">
                  <div className="space-y-10">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                          <ShieldCheck className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-zinc-950">Active Session Secure</p>
                          <p className="text-xs text-zinc-400 font-medium">Verified from Miami, FL • 10.0.1.5</p>
                       </div>
                    </div>
                    <Separator className="bg-zinc-50" />
                    <div className="space-y-6">
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Current Secret</label>
                        <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-zinc-50/30 border-zinc-100 focus:bg-white" />
                      </div>
                       <div className="space-y-2.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Proposed New Secret</label>
                        <Input type="password" placeholder="New Secret" className="h-12 rounded-xl bg-zinc-50/30 border-zinc-100 focus:bg-white" />
                      </div>
                    </div>
                  </div>
                </Card>
              </section>

               <div className="flex justify-end pt-4 space-x-4">
                 <Button variant="ghost" className="text-[11px] font-black text-zinc-400 uppercase tracking-widest rounded-xl hover:bg-zinc-50 px-8">Rotate Access</Button>
                 <Button onClick={handleSave} className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl px-10 h-12 font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">Synchronize</Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-16 border-dashed border-2 border-zinc-100 bg-white text-center rounded-[32px] shadow-none animate-in zoom-in-95 duration-500">
              <div className="max-w-[280px] mx-auto space-y-6">
                <div className="w-16 h-16 bg-zinc-50 rounded-[24px] flex items-center justify-center mx-auto ring-1 ring-zinc-50 shadow-sm text-zinc-300">
                  <Bell className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-zinc-950 tracking-tight">Engine Offline</p>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed">Advanced alert configurations are currently being synchronized for your workspace.</p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card className="p-16 border-dashed border-2 border-zinc-100 bg-white text-center rounded-[32px] shadow-none">
              <div className="max-w-[280px] mx-auto space-y-6">
                <div className="w-16 h-16 bg-zinc-50 rounded-[24px] flex items-center justify-center mx-auto ring-1 ring-zinc-50 shadow-sm text-zinc-300">
                  <CreditCard className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                   <p className="text-lg font-bold text-zinc-950 tracking-tight">Financing Ready</p>
                   <p className="text-xs text-zinc-400 font-medium leading-relaxed">Integration with bank terminals is available upon completion of onboarding.</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
