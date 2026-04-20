'use client'

import { useState } from 'react'
import { Building2, LayoutDashboard, CreditCard, Wrench, Settings, LogOut, ChevronRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Payments',
    href: '/dashboard/payments',
    icon: CreditCard,
  },
  {
    label: 'Repairs',
    href: '/dashboard/repairs',
    icon: Wrench,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { logout, user } = useAuthStore()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-[#3b82f6] text-white rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-72 bg-[#020617] text-white flex flex-col transition-all duration-500 z-40 lg:translate-x-0 shadow-2xl shadow-indigo-950/20",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="px-8 py-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Building2 className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase italic leading-none">Rentra</h1>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1">Tenant Hub</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center justify-between group px-6 py-4 rounded-3xl transition-all duration-300",
                  active
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-4">
                  <Icon className={cn("w-5 h-5 transition-transform duration-300", active ? "scale-110" : "group-hover:scale-110")} />
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                </div>
                {active && <ChevronRight className="w-4 h-4 opacity-50" />}
              </Link>
            )
          })}
        </nav>

        {/* User Card */}
        <div className="p-6 m-4 bg-white/5 rounded-[32px] border border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center font-black text-blue-400 transition-all hover:scale-105">
                {user?.name?.[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-white truncate max-w-[100px]">{user?.name || 'Member'}</p>
                <p className="text-[10px] font-bold text-slate-500">Tenant Portal</p>
              </div>
           </div>
           <button 
             onClick={logout} 
             className="p-2 hover:bg-rose-500/10 hover:text-rose-500 text-slate-500 rounded-lg transition-colors group"
             title="Logout"
           >
              <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
           </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
