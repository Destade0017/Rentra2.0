'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function PaymentsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/tenants');
      setTenants(response.data.data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  if (loading) {
    return (
      <div className="flex-1 space-y-8 animate-in fade-in duration-500">
        <div className="px-1">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-4 w-64 mt-2 rounded-xl" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl border border-slate-100" />)}
        </div>
      </div>
    );
  }

  const paidCount = tenants.filter(t => t.status === 'paid').length;
  const totalAmount = tenants.reduce((acc, t) => acc + (t.rentAmount || 0), 0);

  return (
    <div className="flex-1 space-y-12 pb-24 animate-in fade-in duration-700">
      <div className="px-1">
        <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
        <p className="text-sm text-slate-500">Track rent collection status.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl border-slate-200/50 bg-white shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Collected</p>
            <p className="text-2xl font-bold text-slate-900">{paidCount} / {tenants.length} Tenants</p>
          </div>
        </Card>
        <Card className="p-6 rounded-2xl border-slate-200/50 bg-white shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Value</p>
            <p className="text-2xl font-bold text-slate-900">${totalAmount.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">Recent Activity</h2>
        {tenants.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 bg-white rounded-2xl">
            <p className="text-sm text-slate-500">No payment history available.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {tenants.map((tenant) => (
              <Card key={tenant._id} className="p-5 rounded-2xl border-slate-200/50 bg-white shadow-sm flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${tenant.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {tenant.status === 'paid' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{tenant.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">Rent Payment</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm">${tenant.rentAmount.toLocaleString()}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${tenant.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                    {tenant.status}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
