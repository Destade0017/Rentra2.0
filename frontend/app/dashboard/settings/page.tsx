'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Lock, 
  Building2, 
  Settings2,
  Camera,
  Check,
  Phone,
  MapPin,
  Bell,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'profile' | 'account' | 'notifications' | 'property-defaults' | 'preferences';

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'property-defaults', label: 'Property Defaults', icon: Home },
  { id: 'preferences', label: 'Preferences', icon: Settings2 },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
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

  const SaveButton = ({ section }: { section: string }) => (
    <div className="flex justify-end pt-2">
      <Button 
        onClick={() => handleSave(section)}
        disabled={loadingSection === section}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 h-11 font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all text-sm"
      >
        {loadingSection === section ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );

  return (
    <div className="flex-1 max-w-[1000px] mx-auto w-full space-y-8 pb-32 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="px-1 space-y-1">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 font-medium">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation / Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 scrollbar-none border-b lg:border-b-0 border-slate-100">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 max-w-2xl">
          <Card className="p-6 sm:p-8 border-slate-100 bg-white rounded-[32px] shadow-sm">
            
            {/* 1. PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SectionHeader title="Personal Profile" description="Update your photo and personal details." />
                
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-8 w-8 text-slate-300" />
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 hover:scale-110 active:scale-95 transition-all border-4 border-white"
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

                <Divider />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField label="Full Name" placeholder="Enter your name" />
                  <InputField label="Email Address" type="email" placeholder="your@email.com" />
                </div>
                
                <Divider />
                <SaveButton section="Profile" />
              </div>
            )}

            {/* 2. ACCOUNT */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SectionHeader title="Account & Security" description="Manage your business details and password." />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField label="Landlord Display Name" icon={Building2} placeholder="Rentra Properties Ltd" />
                  <InputField label="Phone Number" icon={Phone} placeholder="+234..." />
                </div>
                <InputField label="Business Address (Optional)" icon={MapPin} placeholder="Enter physical address" />
                
                <Divider />
                
                <div className="space-y-5">
                  <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Change Password</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputField label="Current Password" type="password" placeholder="••••••••" />
                    <InputField label="New Password" type="password" placeholder="Min. 8 characters" />
                  </div>
                </div>

                <Divider />
                <SaveButton section="Account" />
              </div>
            )}

            {/* 3. NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SectionHeader title="Notifications" description="Choose how you want to be updated." />
                
                <div className="space-y-6">
                  <ToggleRow title="Email Reminders" description="Receive emails about overdue payments." defaultChecked={true} />
                  <ToggleRow title="WhatsApp Notifications" description="Send automated WhatsApp alerts to tenants." defaultChecked={false} />
                  <ToggleRow title="Weekly Report" description="Get a weekly summary of your properties." defaultChecked={true} />
                </div>

                <Divider />
                <SaveButton section="Notifications" />
              </div>
            )}

            {/* 4. PROPERTY DEFAULTS */}
            {activeTab === 'property-defaults' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SectionHeader title="Property Defaults" description="Set default values for new properties and tenants." />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField label="Default Rent Due Date" type="number" placeholder="e.g. 1 (1st of the month)" />
                  <InputField label="Late Fee Percentage" type="number" placeholder="e.g. 5%" />
                </div>

                <Divider />
                <SaveButton section="Property Defaults" />
              </div>
            )}

            {/* 5. PREFERENCES */}
            {activeTab === 'preferences' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SectionHeader title="Preferences" description="Customize your Rentra experience." />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">Portfolio Currency</p>
                    <p className="text-xs text-slate-400 font-medium">Default currency for all metrics.</p>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 w-full sm:w-auto">
                    <Button variant="ghost" className="flex-1 sm:flex-none h-10 px-6 rounded-xl bg-white text-indigo-600 shadow-sm font-black text-sm border border-slate-100">
                      ₦ Naira
                    </Button>
                    <Button variant="ghost" disabled className="flex-1 sm:flex-none h-10 px-6 rounded-xl text-slate-300 font-bold text-sm">
                      $ USD
                    </Button>
                  </div>
                </div>

                <Divider />
                <ToggleRow title="Dark Mode" description="Switch to a dark theme interface (Coming Soon)." defaultChecked={false} />
                
                <Divider />
                <SaveButton section="Preferences" />
              </div>
            )}

          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared Components ─── */

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-lg font-black text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 font-medium">{description}</p>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-slate-100/60 my-6" />;
}

function InputField({ 
  label, 
  placeholder, 
  type = 'text', 
  icon: Icon 
}: { 
  label: string; 
  placeholder: string; 
  type?: string;
  icon?: any;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </label>
      <Input 
        type={type} 
        placeholder={placeholder} 
        className="h-11 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 font-medium text-slate-700 transition-all text-sm px-4" 
      />
    </div>
  );
}

function ToggleRow({ 
  title, 
  description, 
  defaultChecked 
}: { 
  title: string; 
  description: string; 
  defaultChecked?: boolean 
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs text-slate-400 font-medium">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}
