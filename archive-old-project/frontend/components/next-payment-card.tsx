import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

interface NextPaymentCardProps {
  date: string
  amount: number
  daysUntilDue: number
}

export function NextPaymentCard({ date, amount, daysUntilDue }: NextPaymentCardProps) {
  const isUrgent = daysUntilDue <= 7

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Next Payment</CardTitle>
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Due Date</p>
          <p className="text-2xl font-bold text-foreground mt-1">{date}</p>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Amount</p>
          <p className="text-3xl font-bold text-foreground">${amount.toLocaleString()}</p>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">Time Until Due</p>
          <p className={`text-sm font-semibold mt-1 ${isUrgent ? 'text-red-500' : 'text-green-500'}`}>
            {daysUntilDue} days remaining
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
