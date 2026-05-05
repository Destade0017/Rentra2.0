'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import { useTenants, Tenant, useMarkPaid } from '@/hooks/use-tenants';
import { openWhatsApp } from '@/lib/whatsapp';
import { AddTenantModal } from '@/components/modals/add-tenant-modal';
import { TenantQuickViewModal } from '@/components/modals/tenant-quick-view-modal';
import { formatCurrency } from '@/lib/utils';

type Filter = 'all' | 'unpaid' | 'pending' | 'paid';

export default function TenantsPage() {
  const {
    data: tenants = [],
    isLoading: loading,
    error,
    refetch: fetchTenants,
  } = useTenants();

  const { mutate: markPaid } = useMarkPaid();
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [markingId, setMarkingId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      all: tenants.length,
      unpaid: tenants.filter((t) => t.status === 'unpaid').length,
      pending: tenants.filter((t) => t.status === 'pending').length,
      paid: tenants.filter((t) => t.status === 'paid').length,
    }),
    [tenants]
  );

  const filtered = useMemo(() => {
    let list = filter === 'all' ? tenants : tenants.filter((t) => t.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tenants, filter, search]);

  const handleMarkPaid = (id: string) => {
    setMarkingId(id);
    markPaid(id, {
      onSuccess: (response) => {
        // If the quick-view modal is open for this tenant, update its data
        if (selectedTenant && selectedTenant._id === id) {
          setSelectedTenant(response.data);
        }
      },
      onSettled: () => {
        setMarkingId(null);
      },
    });
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-6 max-w-sm mx-auto p-10 bg-white rounded-3xl border border-slate-100 shadow-xl">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Failed to load</h2>
            <p className="text-sm text-slate-500">Could not retrieve tenant records.</p>
          </div>
          <Button
            onClick={() => fetchTenants()}
            className="w-full rounded-2xl h-12 bg-indigo-600 text-white font-semibold"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 pb-28 animate-in fade-in duration-500">
      <AddTenantModal
        isOpen={isTenantModalOpen}
        onClose={() => setIsTenantModalOpen(false)}
        onSuccess={fetchTenants}
      />

      {/* Quick View Modal — always mounted, controlled by selectedTenant */}
      <TenantQuickViewModal
        tenant={selectedTenant}
        onClose={() => setSelectedTenant(null)}
        onMarkPaid={handleMarkPaid}
        markingId={markingId}
      />

      {/* HEADER */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Tenants
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
            {tenants.length} resident{tenants.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => setIsTenantModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-11 px-5 font-semibold shadow-lg shadow-indigo-100 transition-all active:scale-95 text-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Tenant</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* SEARCH BAR */}
      {!loading && tenants.length > 0 && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl h-12 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all shadow-sm font-medium"
          />
        </div>
      )}

      {/* FILTER TABS */}
      {!loading && tenants.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['all', 'unpaid', 'pending', 'paid'] as Filter[]).map((f) => (
            <FilterTab
              key={f}
              label={f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              count={counts[f]}
              active={filter === f}
              status={f}
              onClick={() => setFilter(f)}
            />
          ))}
        </div>
      )}

      {/* TENANT LIST */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[76px] rounded-2xl" />
          ))}
        </div>
      ) : tenants.length === 0 ? (
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
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-slate-400 font-semibold text-sm">No tenants match this filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm divide-y divide-slate-50">
          {filtered.map((tenant) => (
            <TenantRow
              key={tenant._id}
              tenant={tenant}
              isMarking={markingId === tenant._id}
              onMarkPaid={handleMarkPaid}
              onRowClick={() => setSelectedTenant(tenant)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Filter Tab ─────────────────────────────────────────────── */
function FilterTab({
  label,
  count,
  active,
  status,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  status: Filter;
  onClick: () => void;
}) {
  const activeColors: Record<Filter, string> = {
    all: 'bg-indigo-600 text-white shadow-lg shadow-indigo-100',
    unpaid: 'bg-red-500 text-white shadow-lg shadow-red-100',
    pending: 'bg-amber-400 text-white shadow-lg shadow-amber-100',
    paid: 'bg-green-500 text-white shadow-lg shadow-green-100',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
        active
          ? activeColors[status]
          : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-200'
      }`}
    >
      {label}
      <span
        className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
          active ? 'bg-white/20' : 'bg-slate-100 text-slate-400'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/* ─── Tenant Row ─────────────────────────────────────────────── */
function TenantRow({
  tenant,
  isMarking,
  onMarkPaid,
  onRowClick,
}: {
  tenant: Tenant;
  isMarking: boolean;
  onMarkPaid: (id: string) => void;
  onRowClick: () => void;
}) {
  const statusConfig = {
    paid: {
      dot: 'bg-green-500',
      label: 'Paid',
      badge: 'bg-green-50 text-green-600',
    },
    unpaid: {
      dot: 'bg-red-500',
      label: 'Overdue',
      badge: 'bg-red-50 text-red-600',
    },
    pending: {
      dot: 'bg-amber-400',
      label: 'Pending',
      badge: 'bg-amber-50 text-amber-600',
    },
  };

  const cfg = statusConfig[tenant.status] ?? statusConfig.pending;
  const hasPhone = !!tenant.phone?.trim();

  return (
    /* Entire row is clickable — buttons stop propagation */
    <div
      role="button"
      tabIndex={0}
      onClick={onRowClick}
      onKeyDown={(e) => e.key === 'Enter' && onRowClick()}
      className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50/80 active:bg-slate-50 transition-colors cursor-pointer group"
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-sm text-slate-700 shrink-0 overflow-hidden group-hover:border-indigo-100 transition-colors">
        {tenant.profileImage ? (
          <img src={tenant.profileImage} alt={tenant.name} className="w-full h-full object-cover" />
        ) : (
          (tenant.name ?? '?').charAt(0).toUpperCase()
        )}
      </div>

      {/* Name + email */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-700 transition-colors">
          {tenant.name}
        </p>
        <p className="text-[11px] text-slate-400 font-medium truncate">{tenant.email}</p>
      </div>

      {/* Rent amount — hidden on mobile, shown on sm+ */}
      <div className="text-right hidden sm:block shrink-0">
        <p className="font-black text-slate-900 text-sm tabular-nums">
          ₦{formatCurrency(tenant.rentAmount)}
        </p>
        <p className="text-[10px] text-slate-400 font-semibold">/ month</p>
      </div>

      {/* WhatsApp remind button — stops row click propagation */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          openWhatsApp(tenant.phone, tenant.name, tenant.rentAmount);
        }}
        disabled={!hasPhone}
        title={hasPhone ? `Remind ${tenant.name} on WhatsApp` : 'No phone number saved'}
        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
          hasPhone
            ? 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white cursor-pointer'
            : 'bg-slate-50 text-slate-200 cursor-not-allowed'
        }`}
      >
        <MessageCircle className="h-4 w-4" />
      </button>

      {/* Status badge or Mark Paid — stops row click propagation */}
      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        {tenant.status === 'paid' ? (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${cfg.badge}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        ) : (
          <Button
            onClick={() => onMarkPaid(tenant._id)}
            disabled={isMarking}
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl h-9 px-4 text-xs font-bold shadow-md shadow-green-100 transition-all active:scale-95 disabled:opacity-60"
          >
            {isMarking ? '…' : 'Mark Paid'}
          </Button>
        )}
      </div>

      {/* Chevron hint — visible on hover */}
      <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-indigo-400 transition-colors shrink-0 hidden sm:block" />
    </div>
  );
}
