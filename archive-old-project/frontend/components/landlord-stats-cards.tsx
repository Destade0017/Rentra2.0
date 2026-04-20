'use client';

import { useDashboardStore } from '@/store/useDashboardStore';
import { Building2, Users, CreditCard, TrendingUp, Sparkles } from 'lucide-react';

export function LandlordStatsCards() {
  const { stats } = useDashboardStore();

  const totalRevenue = stats?.totalRevenue || 0;
  const paidTenants = stats?.paidTenants || 0;
  const owingTenants = stats?.owingTenants || 0;
  const occupancyRate = stats?.occupancyRate || 0;
  const occupiedUnits = (stats?.propertiesCount || 0) - (stats?.vacantUnits || 0);
  const totalUnits = stats?.propertiesCount || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 group/stats">
      {/* Revenue Card - Dark Mode Aesthetic */}
      <div className="bg-[#0f172a] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-950/20 group hover:-translate-y-1 transition-all duration-500">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <CreditCard size={120} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Total Money Collected</p>
        <div className="flex flex-col relative z-10">
          <span className="text-4xl font-black tracking-tight leading-tight">₦{totalRevenue.toLocaleString()}</span>
          {totalRevenue > 0 && (
            <span className="text-emerald-400 text-xs font-bold mt-4 flex items-center gap-1.5 bg-emerald-400/10 w-fit px-3 py-1 rounded-full">
              <TrendingUp size={14} /> Active
            </span>
          )}
        </div>
      </div>

      {/* Tenant Population - Brand Secondary Aesthetic */}
      <div className="bg-[#3b82f6] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 group hover:-translate-y-1 transition-all duration-500">
        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform duration-700">
          <Users size={80} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-3">Tenant Population</p>
        <div className="grid grid-cols-2 gap-6 mt-2 relative z-10">
          <div>
            <span className="text-4xl font-black text-white">{paidTenants}</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100 mt-1 opacity-80">Paid Rent</p>
          </div>
          <div>
            <span className="text-4xl font-black text-rose-100">{owingTenants}</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-100 mt-1 opacity-80">Owing</p>
          </div>
        </div>
      </div>

      {/* Occupancy - White Premium Aesthetic */}
      <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-premium relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
        <div className="absolute -right-10 -bottom-10 p-8 opacity-5 text-indigo-950 group-hover:scale-110 transition-transform duration-700">
          <Building2 size={160} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Occupancy Intelligence</p>
        <div className="flex flex-col relative z-10">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black tracking-tight leading-tight text-slate-900">{occupancyRate}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full mt-6 overflow-hidden">
            <div 
              className="bg-[#3b82f6] h-full rounded-full transition-all duration-1000" 
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">{occupiedUnits} / {totalUnits} Units indexed</p>
        </div>
      </div>
    </div>
  );
}
