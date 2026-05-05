'use client';

import { useEffect, useRef } from 'react';
import { X, Phone, Building2, MessageCircle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tenant } from '@/hooks/use-tenants';
import { useProperties } from '@/hooks/use-properties';
import { useMarkPaid } from '@/hooks/use-tenants';
import { openWhatsApp } from '@/lib/whatsapp';
import { formatCurrency } from '@/lib/utils';

interface TenantQuickViewProps {
  tenant: Tenant | null;
  onClose: () => void;
  onMarkPaid?: (id: string) => void;
  markingId?: string | null;
}

const STATUS_CONFIG = {
  paid: {
    label: 'Paid',
    icon: <CheckCircle2 className="h-4 w-4" />,
    classes: 'bg-green-50 text-green-700 border border-green-100',
    dot: 'bg-green-500',
  },
  unpaid: {
    label: 'Overdue',
    icon: <AlertCircle className="h-4 w-4" />,
    classes: 'bg-red-50 text-red-700 border border-red-100',
    dot: 'bg-red-500',
  },
  pending: {
    label: 'Pending',
    icon: <Clock className="h-4 w-4" />,
    classes: 'bg-amber-50 text-amber-700 border border-amber-100',
    dot: 'bg-amber-400',
  },
} as const;

export function TenantQuickViewModal({
  tenant,
  onClose,
  onMarkPaid,
  markingId,
}: TenantQuickViewProps) {
  const { data: properties = [] } = useProperties();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (tenant) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [tenant, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (tenant) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [tenant]);

  if (!tenant) return null;

  const status = (tenant.status ?? 'pending') as keyof typeof STATUS_CONFIG;
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  const propertyName = (() => {
    if (!tenant.property) return null;
    if (typeof tenant.property === 'object' && tenant.property?.name) return tenant.property.name;
    const found = properties.find((p) => p._id === tenant.property);
    return found?.name ?? null;
  })();

  const hasPhone = !!tenant.phone?.trim();
  const isMarking = markingId === tenant._id;
  const isPaid = tenant.status === 'paid';

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleMarkPaid = () => {
    if (onMarkPaid && !isPaid) onMarkPaid(tenant._id);
  };

  const handleWhatsApp = () => {
    openWhatsApp(tenant.phone, tenant.name, tenant.rentAmount);
  };

  return (
    /* ── Overlay ── */
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4 animate-in fade-in duration-200"
    >
      {/* ── Modal Card ── */}
      <div className="w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl shadow-slate-300/40 overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">

        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-center gap-4 px-6 pt-5 pb-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center font-black text-xl text-indigo-600 shrink-0 overflow-hidden">
            {tenant.profileImage ? (
              <img
                src={tenant.profileImage}
                alt={tenant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              (tenant.name ?? '?').charAt(0).toUpperCase()
            )}
          </div>

          {/* Name + status */}
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-slate-900 text-lg leading-tight truncate">
              {tenant.name}
            </h2>
            <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
              {tenant.email}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all active:scale-90 shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="mx-6 h-px bg-slate-50" />

        {/* ── Info Grid ── */}
        <div className="px-6 py-5 space-y-4">
          {/* Status badge */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Payment Status
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${cfg.classes}`}>
              <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>

          {/* Rent amount */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Monthly Rent
            </span>
            <span className="text-xl font-black text-slate-900 tabular-nums tracking-tight">
              ₦{formatCurrency(tenant.rentAmount)}
            </span>
          </div>

          {/* Property */}
          {propertyName && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                Property
              </span>
              <span className="text-sm font-semibold text-slate-700 truncate text-right flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                {propertyName}
              </span>
            </div>
          )}

          {/* Phone */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
              Phone
            </span>
            {hasPhone ? (
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                +{tenant.phone?.startsWith('0') ? `234${tenant.phone?.slice(1)}` : tenant.phone}
              </span>
            ) : (
              <span className="text-sm text-slate-300 font-medium">Not saved</span>
            )}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="px-6 pb-6 pt-2 space-y-3">
          {/* Mark as Paid — only show if not already paid */}
          {!isPaid && (
            <Button
              onClick={handleMarkPaid}
              disabled={isMarking}
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isMarking ? 'Marking…' : 'Mark as Paid'}
            </Button>
          )}

          {/* WhatsApp Remind */}
          <Button
            onClick={handleWhatsApp}
            disabled={!hasPhone}
            className={`w-full h-12 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
              hasPhone
                ? 'bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-lg shadow-green-100'
                : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
            }`}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {hasPhone ? 'Remind on WhatsApp' : 'No Phone Number Saved'}
          </Button>
        </div>
      </div>
    </div>
  );
}
