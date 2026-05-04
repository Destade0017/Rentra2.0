'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DollarSign, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useTenants, Tenant } from '@/hooks/use-tenants';
import { formatCurrency } from '@/lib/utils';

export default function PaymentsPage() {
  const { 
    data: tenants = [], 
    isLoading: loading, 
    error,
    refetch
  } = useTenants();

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px] animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-10 max-w-[340px] mx-auto p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200">
          <div className="w-20 h-20 bg-indigo-50 rounded-[28px] flex items-center justify-center mx-auto border border-indigo-100/30">
            <AlertCircle className="h-10 w-10 text-indigo-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sync Fault</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Failed to retrieve financial records.</p>
          </div>
          <Button onClick={() => refetch()} className="rounded-2xl h-14 w-full bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95 group">
            <span className="group-hover:mr-2 transition-all">Retry Connection</span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-10 animate-in fade-in duration-500">
        <div className="px-1">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-4 w-64 mt-2 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-28 rounded-[24px]" />
          <Skeleton className="h-28 rounded-[24px]" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 rounded-[24px]" />
          ))}
        </div>
      </div>
    );
  }

  const paidCount = tenants.filter(t => t.status === 'paid').length;
  const totalAmount = tenants.reduce((acc, t) => acc + (t.rentAmount || 0), 0);

  return (
    <div className="flex-1 space-y-10 lg:space-y-12 pb-24 animate-in fade-in duration-700">
      <div className="px-1 space-y-1">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Financials</h1>
        <p className="text-[10px] lg:text-sm text-slate-400 font-bold uppercase tracking-widest">Rent Collection Status</p>
      </div>

      {/* Summary Stats (Mobile-First) */}
      <div className="grid grid-cols-2 gap-4 lg:gap-6">
        <Card className="p-5 lg:p-6 rounded-[24px] lg:rounded-[32px] border-slate-100 bg-white shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100/50">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Collected</p>
            <p className="text-lg lg:text-2xl font-black text-slate-900 tracking-tighter tabular-nums">{paidCount}<span className="text-[10px] text-slate-300 ml-1">/ {tenants.length}</span></p>
          </div>
        </Card>
        <Card className="p-5 lg:p-6 rounded-[24px] lg:rounded-[32px] border-slate-100 bg-white shadow-sm flex flex-col gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Value</p>
            <p className="text-lg lg:text-2xl font-black text-slate-900 tracking-tighter tabular-nums">₦{formatCurrency(totalAmount)}</p>
          </div>
        </Card>
      </div>

      {/* Payments List */}
      <div className="space-y-6">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Recent Transactions</h2>
        {tenants.length === 0 ? (
          <div className="flex-1 flex items-center justify-center min-h-[300px] animate-in fade-in zoom-in duration-700">
            <div className="text-center space-y-6 max-w-[340px] mx-auto p-12 bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
                <DollarSign className="h-8 w-8 text-slate-300" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-slate-900">No Payments Yet</p>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Financial data will appear here once you onboard residents.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            {tenants.map((tenant) => (
              <div key={tenant._id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0 active:bg-slate-50">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    tenant.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {tenant.status === 'paid' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-900 text-sm truncate">{tenant.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Rent Payment</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-slate-900 text-base tabular-nums tracking-tighter">₦{formatCurrency(tenant.rentAmount)}</p>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${
                    tenant.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {tenant.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
