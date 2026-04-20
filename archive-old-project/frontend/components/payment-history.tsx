'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface PaymentRecord {
  id: string
  date: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  method: string
  reference?: string
}

interface PaymentHistoryProps {
  payments: PaymentRecord[]
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      badge: 'bg-emerald-100 text-emerald-700',
      label: 'Completed',
      color: 'text-emerald-600',
    },
    pending: {
      icon: Clock,
      badge: 'bg-amber-100 text-amber-700',
      label: 'Pending',
      color: 'text-amber-600',
    },
    failed: {
      icon: AlertCircle,
      badge: 'bg-red-100 text-red-700',
      label: 'Failed',
      color: 'text-red-600',
    },
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Payment History</h3>

      <Card className="overflow-hidden border-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((payment) => {
                const config = statusConfig[payment.status]
                const Icon = config.icon
                return (
                  <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{payment.date}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-foreground">
                        ${payment.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{payment.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${config.color}`} />
                        <Badge variant="secondary" className={config.badge}>
                          {config.label}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-muted-foreground">{payment.reference || '—'}</code>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
