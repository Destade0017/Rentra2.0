'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Bell,
  Search,
  Plus,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LandlordNavbar() {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 z-30 transition-all duration-300">
      <div className="h-full px-6 md:px-10 flex items-center justify-between">
        {/* Search Bar */}
        <div className="hidden md:flex relative w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <Input 
            placeholder="Search tenants, properties..." 
            className="bg-slate-50 border-none rounded-2xl pl-12 h-11 focus-visible:ring-2 focus-visible:ring-blue-500/20"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-3 text-slate-400 hover:text-blue-500 transition-colors">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="h-8 w-[1px] bg-slate-100 mx-2" />
          
          <Button 
            onClick={() => router.push('/landlord/tenants')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl px-6 py-6 shadow-lg shadow-blue-600/20 flex items-center gap-2 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Add Tenant</span>
          </Button>

          <div className="bg-slate-900 rounded-2xl p-1 pl-4 flex items-center gap-3 border border-white/10 ml-2">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan</span>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Empire</span>
             </div>
             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-inner">
                <Rocket size={18} />
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
