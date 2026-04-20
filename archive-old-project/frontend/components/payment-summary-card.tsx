'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

interface PaymentSummaryCardProps {
  amount: number
  dueDate: string
  status: 'paid' | 'due' | 'overdue'
  property?: string
}

export function PaymentSummaryCard({
  amount,
  dueDate,
  status,
  property = '123 Main Street',
}: PaymentSummaryCardProps) {
  const statusConfig = {
    paid: {
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      badge: 'bg-emerald-100 text-emerald-700',
      label: 'Paid',
    },
    due: {
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      badge: 'bg-amber-100 text-amber-700',
      label: 'Due',
    },
    overdue: {
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      badge: 'bg-red-100 text-red-700',
      label: 'Overdue',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Rent Payment</p>
            <p className="mt-1 text-xs text-slate-500">{property}</p>
          </div>
          <Badge className={`${config.badge} border-0`}>{config.label}</Badge>
        </div>

        <div className="mb-8">
          <div className="text-5xl font-bold tracking-tight">${amount.toLocaleString()}</div>
          <p className="mt-2 text-sm text-slate-400">Monthly rent amount</p>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-slate-700 pt-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Due Date</p>
            <p className="mt-2 text-lg font-semibold">{dueDate}</p>
          </div>
          <div className="flex items-end justify-end">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${config.bg}`}>
              <Icon className={`h-6 w-6 ${config.color}`} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
