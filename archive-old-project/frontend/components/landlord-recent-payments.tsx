import { useDashboardStore } from '@/store/useDashboardStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, Landmark, Banknote } from 'lucide-react';

export function LandlordRecentPayments() {
  const { payments, loading } = useDashboardStore();

  const recentPayments = payments
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'overdue':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Card Payment': return <CreditCard size={14} />;
      case 'Bank Transfer': return <Landmark size={14} />;
      case 'Cash': return <Banknote size={14} />;
      default: return <Wallet size={14} />;
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Transaction Feed</p>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-600 font-bold uppercase text-[10px] tracking-widest hover:bg-blue-50">
          History
        </Button>
      </div>

      <div className="space-y-6">
        {loading && recentPayments.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center gap-3">
             <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Ledger</p>
          </div>
        ) : recentPayments.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest italic">No transactions found</p>
          </div>
        ) : (
          recentPayments.map((payment: any) => (
            <div
              key={payment._id}
              className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  {getMethodIcon(payment.method)}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 tracking-tight">
                    {payment.tenant?.name || 'Anonymous Member'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{payment.property?.name || 'Main Portfolio'}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-black text-slate-900">
                  +₦{payment.amount.toLocaleString()}
                </p>
                <div className="flex items-center justify-end gap-2 mt-1">
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    {new Date(payment.paymentDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border ${getStatusColor(payment.status)} uppercase tracking-tighter`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
