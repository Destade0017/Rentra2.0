import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface RentStatusCardProps {
  status: 'paid' | 'due' | 'overdue'
  amount: number
  dueDate?: string
}

export function RentStatusCard({ status, amount, dueDate }: RentStatusCardProps) {
  const isPaid = status === 'paid'
  const isOverdue = status === 'overdue'

  return (
    <Card className="bg-gradient-to-br from-background to-secondary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Rent Status</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isPaid ? 'Payment received' : 'Payment required'}
            </p>
          </div>
          {isPaid ? (
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          ) : (
            <AlertCircle className="w-8 h-8 text-red-500" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-4xl font-bold text-foreground">${amount.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Monthly rent</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Status</p>
            <Badge
              className="mt-2"
              variant={isPaid ? 'default' : isOverdue ? 'destructive' : 'secondary'}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          {dueDate && !isPaid && (
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Due Date</p>
              <p className="text-sm text-muted-foreground mt-1">{dueDate}</p>
            </div>
          )}
        </div>

        {!isPaid && (
          <Button className="w-full" size="lg">
            Pay Rent Now
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
