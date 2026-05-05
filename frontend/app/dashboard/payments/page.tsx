'use client';

import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { useTenants, Tenant } from '@/hooks/use-tenants';
import { formatCurrency } from '@/lib/utils';

export default function PaymentsPage() {
  const {
    data: tenants = [],
    isLoading: loading,
    error,
    refetch,
  } = useTenants();

  const summary = useMemo(() => {
    const paid = tenants.filter((t) => t.status === 'paid');
    const unpaid = tenants.filter((t) => t.status !== 'paid');
    const collected = paid.reduce((s, t) => s + (t.rentAmount || 0), 0);
    const outstanding = unpaid.reduce((s, t) => s + (t.rentAmount || 0), 0);
    return { paid, unpaid, collected, outstanding, total: tenants.length };
  }, [tenants]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-6 max-w-sm mx-auto p-10 bg-white rounded-3xl border border-slate-100 shadow-xl">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Failed to load</h2>
            <p className="text-sm text-slate-500">Could not retrieve payment data.</p>
          </div>
          <Button
            onClick={() => refetch()}
            className="w-full rounded-2xl h-12 bg-indigo-600 text-white font-semibold"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 pb-28 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="px-1">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
          Payments
        </h1>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
          Rent collection status
        </p>
      </div>

      {/* SUMMARY CARDS */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex flex-col gap-3">
            <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                Collected
              </p>
              <p className="text-2xl font-black text-green-700 tabular-nums tracking-tight mt-0.5">
                ₦{formatCurrency(summary.collected)}
              </p>
              <p className="text-[11px] text-green-500 font-semibold mt-0.5">
                {summary.paid.length} of {summary.total} tenants
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex flex-col gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
              <Clock className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                Outstanding
              </p>
              <p className="text-2xl font-black text-red-600 tabular-nums tracking-tight mt-0.5">
                ₦{formatCurrency(summary.outstanding)}
              </p>
              <p className="text-[11px] text-red-400 font-semibold mt-0.5">
                {summary.unpaid.length} tenant{summary.unpaid.length !== 1 ? 's' : ''} remaining
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTION LIST */}
      <div className="space-y-3">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
          All Transactions
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[68px] rounded-2xl" />
            ))}
          </div>
        ) : tenants.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <DollarSign className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-400">No payment records yet.</p>
            <p className="text-xs text-slate-300 mt-1">Add tenants to start tracking.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm divide-y divide-slate-50">
            {tenants.map((tenant) => (
              <PaymentRow key={tenant._id} tenant={tenant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentRow({ tenant }: { tenant: Tenant }) {
  const isPaid = tenant.status === 'paid';
  const isPending = tenant.status === 'pending';

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">
      {/* Status icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isPaid
            ? 'bg-green-50 text-green-600'
            : isPending
            ? 'bg-amber-50 text-amber-500'
            : 'bg-red-50 text-red-500'
        }`}
      >
        {isPaid ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Clock className="h-5 w-5" />
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm truncate">{tenant.name}</p>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight">
          Monthly Rent
        </p>
      </div>

      {/* Amount + status */}
      <div className="text-right shrink-0">
        <p className="font-black text-slate-900 text-sm tabular-nums tracking-tight">
          ₦{formatCurrency(tenant.rentAmount)}
        </p>
        <p
          className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${
            isPaid ? 'text-green-600' : isPending ? 'text-amber-500' : 'text-red-500'
          }`}
        >
          {isPaid ? 'Paid' : isPending ? 'Pending' : 'Overdue'}
        </p>
      </div>
    </div>
  );
}
