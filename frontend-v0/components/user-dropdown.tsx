'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function UserDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-slate-100 active:scale-95 outline-none group">
          <div className="h-7 w-7 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-indigo-200 transition-colors">
            <span className="text-slate-900 text-[10px] font-black uppercase">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <span className="hidden sm:inline text-xs font-bold text-slate-600 tracking-tight group-hover:text-slate-900 transition-colors">
            {user?.name || 'Landlord'}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 mt-2 p-2 rounded-[24px] border-slate-100 shadow-2xl shadow-slate-200/50 bg-white animate-in fade-in zoom-in-95 duration-200" align="end">
        <DropdownMenuLabel className="p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-black text-slate-900 leading-none">{user?.name || 'Landlord'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.email || 'admin@rentra.com'}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-50 mx-2" />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem 
            onClick={() => router.push('/dashboard/settings')}
            className="rounded-xl h-11 px-3 flex items-center gap-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 cursor-pointer transition-all active:scale-[0.98]"
          >
            <Settings className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
            <span className="text-xs font-bold tracking-tight">Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-slate-50 mx-2" />
        <div className="p-1">
          <DropdownMenuItem 
            onClick={handleLogout}
            className="rounded-xl h-11 px-3 flex items-center gap-3 text-slate-400 hover:text-red-600 hover:bg-red-50/50 cursor-pointer transition-all active:scale-[0.98]"
          >
            <LogOut className="h-4 w-4 text-slate-300 group-hover:text-red-500" />
            <span className="text-xs font-bold tracking-tight">Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
