import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2, Clock, Plus } from 'lucide-react'

interface RepairRequest {
  id: string
  title: string
  status: 'open' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  submittedDate: string
}

interface RepairsSectionProps {
  repairs: RepairRequest[]
}

export function RepairsSection({ repairs }: RepairsSectionProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Open</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="secondary">Low</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'high':
        return <Badge variant="destructive">High</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Repair Requests</CardTitle>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Request</span>
        </Button>
      </CardHeader>
      <CardContent>
        {repairs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No repair requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {repairs.map((repair) => (
              <div
                key={repair.id}
                className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(repair.status)}
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{repair.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submitted: {repair.submittedDate}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {getStatusBadge(repair.status)}
                      {getPriorityBadge(repair.priority)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
