'use client'

import { Bell, Search, Info, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { Input } from '@/components/ui/input'

export function DashboardNavbar() {
  const { user } = useAuthStore()

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 z-30 transition-all duration-300">
      <div className="h-full px-6 md:px-10 flex items-center justify-between">
        {/* Search / Context Area */}
        <div className="hidden md:flex relative w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <Input 
            placeholder="Search documents, payments..." 
            className="bg-slate-50 border-none rounded-2xl pl-12 h-11 focus-visible:ring-2 focus-visible:ring-blue-500/20 shadow-inner"
          />
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-4">
          <button className="relative p-3 text-slate-400 hover:text-blue-500 transition-colors group">
            <Bell size={22} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="h-8 w-[1px] bg-slate-100 mx-2" />
          
          <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Security</span>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                  <Shield size={10} /> Protected
                </span>
              </div>

              <div className="bg-slate-900 rounded-2xl p-1.5 flex items-center gap-3 border border-white/5 ml-2 shadow-xl">
                 <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                    <Info size={16} />
                 </div>
                 <div className="pr-4">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Unit Assignment</p>
                    <p className="text-[10px] font-black text-white uppercase tracking-tighter mt-1">Apt 4B • Prime</p>
                 </div>
              </div>
          </div>
        </div>
      </div>
    </header>
  )
}
