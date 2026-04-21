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
    { id: 'account', label: 'Identity & Profile', icon: <User className="h-4 w-4" /> },
    { id: 'security', label: 'Access Control', icon: <Lock className="h-4 w-4" /> },
    { id: 'notifications', label: 'Alert Engines', icon: <Bell className="h-4 w-4" /> },
    { id: 'billing', label: 'Financial Plan', icon: <CreditCard className="h-4 w-4" /> },
  ];

  return (
    <div className="flex-1 max-w-[1100px] mx-auto w-full space-y-16 pb-24 animate-in fade-in duration-1000">
      {/* Page Header */}
      <div className="flex flex-col gap-2.5 px-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Workspace Settings</h1>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">Management Console</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-200" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-600 capitalize">{activeTab}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Settings Sidebar */}
        <aside className="w-full lg:w-72 space-y-2 shrink-0">
          <p className="px-5 text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-5">Navigation</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SettingsTab)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all duration-500 group ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-900'
              }`}
            >
              <div className={`transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-indigo-600'}`}>
                {item.icon}
              </div>
              <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
              {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 ml-auto shadow-[0_0_10px_rgba(255,255,255,0.7)]" />}
            </button>
          ))}
        </aside>

        {/* Settings Content Area */}
        <div className="flex-1 max-w-2xl animate-in slide-in-from-right-4 duration-700">
          {activeTab === 'account' && (
            <div className="space-y-12">
              <section className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Public Identity</h2>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">Manage how your name and identity appear across the portfolio.</p>
                </div>
                <Card className="p-10 border-slate-200/50 bg-white rounded-[32px] shadow-sm">
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 ml-1">Legal Designation</label>
                        <Input className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white font-medium" placeholder="John Doe" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 ml-1">System Handle</label>
                        <Input className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white font-medium" placeholder="johndoe_admin" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 ml-1">Electronic Correspondence</label>
                      <Input className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white font-medium" placeholder="john@rentra.io" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 ml-1">Portfolio Biography</label>
                       <textarea className="w-full min-h-[140px] p-5 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:outline-none text-sm transition-all text-slate-600 font-medium leading-relaxed" placeholder="Brief metadata for the residents panel..." />
                    </div>
                  </div>
                </Card>
              </section>

              <div className="flex justify-end pt-4">
                 <Button 
                   onClick={handleSave} 
                   disabled={loading}
                   className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-12 h-14 shadow-xl shadow-indigo-100 font-bold tracking-tight text-sm active:scale-95 transition-all"
                 >
                   {loading ? 'Synchronizing Workspace...' : 'Update Identity'}
                 </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-12">
              <section className="space-y-8">
                 <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Access Control</h2>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">Rotate credentials and monitor active infrastructure endpoints.</p>
                </div>
                <Card className="p-10 border-slate-200/50 bg-white rounded-[32px] shadow-sm">
                  <div className="space-y-10">
                    <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                          <ShieldCheck className="h-7 w-7" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">Current Session Optimized</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status: Active • Ledger Protocol 2.4.0</p>
                       </div>
                    </div>
                    <Separator className="bg-slate-100/50" />
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 ml-1">Current Protocol Secret</label>
                        <Input type="password" placeholder="••••••••" className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white" />
                      </div>
                       <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 ml-1">Target New Secret</label>
                        <Input type="password" placeholder="Define new access key" className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white" />
                      </div>
                    </div>
                  </div>
                </Card>
              </section>

               <div className="flex justify-end pt-4 space-x-6">
                 <Button variant="ghost" className="text-xs font-bold text-slate-400 uppercase tracking-widest rounded-2xl hover:bg-slate-50 px-8 transition-colors">Rotate Key</Button>
                 <Button onClick={handleSave} className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-12 h-14 font-bold tracking-tight text-sm active:scale-95 transition-all">Apply Security</Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-20 border-dashed border-2 border-slate-100/60 bg-white text-center rounded-[40px] shadow-none animate-in zoom-in-95 duration-700">
              <div className="max-w-[300px] mx-auto space-y-8">
                <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto ring-1 ring-slate-100/50 shadow-inner text-slate-300">
                  <Bell className="h-10 w-10" />
                </div>
                <div className="space-y-3">
                  <p className="text-xl font-bold text-slate-900 tracking-tight">Signal Processor Offline</p>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed px-4">Automated rent alert engines are currently in secondary maintenance mode.</p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card className="p-20 border-dashed border-2 border-slate-100/60 bg-white text-center rounded-[40px] shadow-none">
              <div className="max-w-[300px] mx-auto space-y-8">
                <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto ring-1 ring-slate-100/50 shadow-inner text-slate-300">
                  <CreditCard className="h-10 w-10" />
                </div>
                <div className="space-y-3">
                   <p className="text-xl font-bold text-slate-900 tracking-tight">Financing Disabled</p>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed px-4">Direct settlement features activate automatically upon identity verification.</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
