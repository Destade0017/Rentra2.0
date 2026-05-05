'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { useTenants, Tenant, useMarkPaid } from '@/hooks/use-tenants';
import { AddTenantModal } from '@/components/modals/add-tenant-modal';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const {
    data: tenants = [] as Tenant[],
    isLoading: loading,
    error,
    refetch,
  } = useTenants();

  const { mutate: markPaid, isPending: markingPaid } = useMarkPaid();
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const handleMarkPaid = useCallback(
    (id: string) => {
      setMarkingId(id);
      markPaid(id, { onSettled: () => setMarkingId(null) });
    },
    [markPaid]
  );

  const groups = useMemo(() => {
    const overdue = tenants.filter((t) => t.status === 'unpaid');
    const pending = tenants.filter((t) => t.status === 'pending');
    const paid = tenants.filter((t) => t.status === 'paid');
    const unpaidCount = overdue.length + pending.length;
    const collectedRent = paid.reduce((s, t) => s + (t.rentAmount || 0), 0);
    const outstandingRent = [...overdue, ...pending].reduce(
      (s, t) => s + (t.rentAmount || 0),
      0
    );
    return { overdue, pending, paid, unpaidCount, collectedRent, outstandingRent };
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
            <p className="text-sm text-slate-500">Could not retrieve tenant data.</p>
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
      <AddTenantModal
        isOpen={isTenantModalOpen}
        onClose={() => setIsTenantModalOpen(false)}
        onSuccess={refetch}
      />

      {/* HEADER */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
            Rent collection overview
          </p>
        </div>
        <Button
          onClick={() => setIsTenantModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-11 px-5 font-semibold shadow-lg shadow-indigo-100 transition-all active:scale-95 text-sm hidden sm:flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      {/* HERO ALERT BANNER */}
      {loading ? (
        <Skeleton className="h-24 rounded-3xl" />
      ) : tenants.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex items-center justify-center min-h-[380px]">
          <div className="text-center space-y-8 max-w-xs mx-auto p-10 bg-white rounded-[40px] border border-slate-100 shadow-xl">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
              <Users className="h-8 w-8 text-slate-300" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">No tenants yet</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Add your first tenant to start tracking rent payments.
              </p>
            </div>
            <Button
              onClick={() => setIsTenantModalOpen(true)}
              className="w-full rounded-2xl h-12 bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-100 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </div>
        </div>
      ) : groups.unpaidCount > 0 ? (
        <div className="bg-red-500 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-red-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-lg leading-tight">
                {groups.unpaidCount} tenant{groups.unpaidCount !== 1 ? 's' : ''}{' '}
                {groups.unpaidCount === 1 ? 'has' : 'have'} not paid rent
              </p>
              <p className="text-red-200 text-xs font-semibold mt-0.5">
                ₦{formatCurrency(groups.outstandingRent)} outstanding
              </p>
            </div>
          </div>
          <Link href="/dashboard/tenants" className="shrink-0">
            <Button className="bg-white text-red-600 hover:bg-red-50 rounded-2xl h-10 px-5 font-bold text-sm flex items-center gap-2 shadow-none transition-all active:scale-95">
              Take Action
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-green-500 rounded-3xl p-6 flex items-center gap-4 shadow-xl shadow-green-100">
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-tight">
              All tenants have paid
            </p>
            <p className="text-green-200 text-xs font-semibold mt-0.5">
              ₦{formatCurrency(groups.collectedRent)} collected this month
            </p>
          </div>
        </div>
      )}

      {/* SUMMARY STRIP */}
      {!loading && tenants.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <SummaryPill
            label="Overdue"
            count={groups.overdue.length}
            color="red"
            icon={<AlertCircle className="h-4 w-4" />}
          />
          <SummaryPill
            label="Pending"
            count={groups.pending.length}
            color="yellow"
            icon={<Clock className="h-4 w-4" />}
          />
          <SummaryPill
            label="Paid"
            count={groups.paid.length}
            color="green"
            icon={<CheckCircle2 className="h-4 w-4" />}
          />
        </div>
      )}

      {/* TENANT GROUPS */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* OVERDUE */}
          {groups.overdue.length > 0 && (
            <TenantGroup
              title="Overdue"
              accent="red"
              tenants={groups.overdue}
              markingId={markingId}
              onMarkPaid={handleMarkPaid}
            />
          )}

          {/* PENDING */}
          {groups.pending.length > 0 && (
            <TenantGroup
              title="Pending"
              accent="yellow"
              tenants={groups.pending}
              markingId={markingId}
              onMarkPaid={handleMarkPaid}
            />
          )}

          {/* PAID */}
          {groups.paid.length > 0 && (
            <TenantGroup
              title="Paid"
              accent="green"
              tenants={groups.paid}
              markingId={null}
              onMarkPaid={null}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function SummaryPill({
  label,
  count,
  color,
  icon,
}: {
  label: string;
  count: number;
  color: 'red' | 'yellow' | 'green';
  icon: React.ReactNode;
}) {
  const styles = {
    red: 'bg-red-50 text-red-600 border-red-100',
    yellow: 'bg-amber-50 text-amber-600 border-amber-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  };

  return (
    <div
      className={`${styles[color]} border rounded-2xl p-4 flex flex-col items-center gap-2 text-center`}
    >
      {icon}
      <span className="text-2xl font-black tabular-nums">{count}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{label}</span>
    </div>
  );
}

function TenantGroup({
  title,
  accent,
  tenants,
  markingId,
  onMarkPaid,
}: {
  title: string;
  accent: 'red' | 'yellow' | 'green';
  tenants: Tenant[];
  markingId: string | null;
  onMarkPaid: ((id: string) => void) | null;
}) {
  const dot = {
    red: 'bg-red-500',
    yellow: 'bg-amber-400',
    green: 'bg-green-500',
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div className={`w-2 h-2 rounded-full ${dot[accent]}`} />
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {title} · {tenants.length}
        </h2>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm divide-y divide-slate-50">
        {tenants.map((tenant) => (
          <TenantRow
            key={tenant._id}
            tenant={tenant}
            accent={accent}
            isMarking={markingId === tenant._id}
            onMarkPaid={onMarkPaid}
          />
        ))}
      </div>
    </section>
  );
}

function TenantRow({
  tenant,
  accent,
  isMarking,
  onMarkPaid,
}: {
  tenant: Tenant;
  accent: 'red' | 'yellow' | 'green';
  isMarking: boolean;
  onMarkPaid: ((id: string) => void) | null;
}) {
  const avatarColors = {
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-slate-50/60 transition-colors">
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 overflow-hidden ${avatarColors[accent]}`}
      >
        {tenant.profileImage ? (
          <img src={tenant.profileImage} alt={tenant.name} className="w-full h-full object-cover" />
        ) : (
          (tenant.name || '?').charAt(0).toUpperCase()
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm truncate">{tenant.name}</p>
        <p className="text-[11px] text-slate-400 font-semibold">
          ₦{formatCurrency(tenant.rentAmount)} / month
        </p>
      </div>

      {/* Action */}
      {onMarkPaid ? (
        <Button
          onClick={() => onMarkPaid(tenant._id)}
          disabled={isMarking}
          className="bg-green-500 hover:bg-green-600 text-white rounded-xl h-9 px-4 text-xs font-bold shadow-md shadow-green-100 transition-all active:scale-95 shrink-0 disabled:opacity-60"
        >
          {isMarking ? '...' : 'Mark Paid'}
        </Button>
      ) : (
        <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-xl uppercase tracking-widest shrink-0">
          Paid ✓
        </span>
      )}
    </div>
  );
}
