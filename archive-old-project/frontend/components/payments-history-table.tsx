'use client';

import { useState } from 'react';
import { 
  Calendar, 
  CreditCard, 
  Search, 
  ArrowUpRight, 
  MoreHorizontal,
  CloudDownload,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDashboardStore } from '@/store/useDashboardStore';

export function PaymentsHistoryTable() {
  const { payments, loading } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPayments = payments.filter((payment: any) => {
    const matchesSearch = 
      (payment.tenant?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.property?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || payment.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
            <CheckCircle2 size={12} />
            Paid
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-100">
            <Clock size={12} />
            Pending
          </div>
        );
      case 'overdue':
      case 'failed':
        return (
          <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-rose-100">
            <AlertCircle size={12} />
            {status}
          </div>
        );
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Table Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <Input 
            placeholder="Search transactions..." 
            className="pl-10 bg-white border-slate-200 rounded-xl focus-visible:ring-blue-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="rounded-xl border-slate-200 gap-2 text-slate-600">
            <Filter size={16} />
            Filters
          </Button>
          <Button variant="outline" className="rounded-xl border-slate-200 gap-2 text-slate-600">
            <CloudDownload size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Property / Unit</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment: any) => (
                  <tr key={payment._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 tracking-tight">{payment.tenant?.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {new Date(payment.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <p className="text-sm font-bold text-slate-600">{payment.property?.name || 'Main Unit'}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{payment.method}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-900">₦{payment.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                        <AlertCircle size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No payment records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
