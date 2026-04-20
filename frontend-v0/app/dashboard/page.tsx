'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building2,
  Users,
  DollarSign,
  Plus,
  ArrowRight,
  Home,
  User as UserIcon,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { AddPropertyModal } from '@/components/modals/add-property-modal';
import { AddTenantModal } from '@/components/modals/add-tenant-modal';

interface SummaryCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  subtext?: string;
}

interface ActivityItem {
  id: string;
  type: 'property' | 'tenant';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  date: Date;
}

export default function DashboardPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [propRes, tenantRes] = await Promise.all([
        api.get('/properties'),
        api.get('/tenants')
      ]);

      setProperties(propRes.data.data || []);
      setTenants(tenantRes.data.data || []);
      setError('');
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Calculations
  const totalProperties = properties.length;
  const totalTenants = tenants.length;
  const paidTenants = tenants.filter(t => t.status === 'paid').length;
  const totalRentAmount = tenants.reduce((acc, t) => acc + (t.rentAmount || 0), 0);

  const summaryCards: SummaryCard[] = [
    {
      label: 'Total Properties',
      value: totalProperties.toString(),
      icon: <Building2 className="h-6 w-6" />,
      subtext: 'Active listings',
    },
    {
      label: 'Total Tenants',
      value: totalTenants.toString(),
      icon: <Users className="h-6 w-6" />,
      subtext: 'Occupied units',
    },
    {
      label: 'Rent Collected',
      value: `${paidTenants}/${totalTenants}`,
      icon: <DollarSign className="h-6 w-6" />,
      subtext: `Total: $${totalRentAmount.toLocaleString()}`,
    },
  ];

  // Combine and sort activities
  const recentActivity: ActivityItem[] = [
    ...properties.map(p => ({
      id: p._id,
      type: 'property' as const,
      title: 'Property Added',
      description: p.name,
      timestamp: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
      icon: <Home className="h-4 w-4" />,
      date: new Date(p.createdAt)
    })),
    ...tenants.map(t => ({
      id: t._id,
      type: 'tenant' as const,
      title: 'Tenant Added',
      description: `${t.name} - ${t.email}`,
      timestamp: formatDistanceToNow(new Date(t.createdAt), { addSuffix: true }),
      icon: <UserIcon className="h-4 w-4" />,
      date: new Date(t.createdAt)
    }))
  ]
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 5);

  const isEmpty = !loading && properties.length === 0 && tenants.length === 0;

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-6 w-96 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchDashboardData} variant="outline">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Modals */}
      <AddPropertyModal 
        isOpen={isPropertyModalOpen} 
        onClose={() => setIsPropertyModalOpen(false)} 
        onSuccess={fetchDashboardData}
      />
      <AddTenantModal 
        isOpen={isTenantModalOpen} 
        onClose={() => setIsTenantModalOpen(false)} 
        onSuccess={fetchDashboardData}
      />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your properties and tenants.
        </p>
      </div>

      {isEmpty ? (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summaryCards.map((card, index) => (
              <Card key={index} className="p-6 bg-card border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{card.value}</p>
                    {card.subtext && <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>}
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg text-accent">{card.icon}</div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-12 bg-card border-border text-center">
            <Empty
              icon={<Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
              title="No properties yet"
              description="Get started by adding your first property to manage tenants and track rent."
            />
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button onClick={() => setIsPropertyModalOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg h-10 gap-2">
                <Plus className="h-4 w-4" /> Add Property
              </Button>
              <Button variant="outline" onClick={() => setIsTenantModalOpen(true)} className="border-border hover:bg-secondary rounded-lg h-10 gap-2">
                <Plus className="h-4 w-4" /> Add Tenant
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summaryCards.map((card, index) => (
              <Card key={index} className="p-6 bg-card border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{card.value}</p>
                    {card.subtext && <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>}
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg text-accent">{card.icon}</div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setIsPropertyModalOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg h-10 gap-2">
              <Plus className="h-4 w-4" /> Add Property
            </Button>
            <Button variant="outline" onClick={() => setIsTenantModalOpen(true)} className="border-border hover:bg-secondary rounded-lg h-10 gap-2">
              <Plus className="h-4 w-4" /> Add Tenant
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
              <Button variant="ghost" className="text-accent hover:bg-accent/10 rounded-lg h-8 gap-1 p-2">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <Card className="bg-card border-border overflow-hidden">
              <div className="divide-y divide-border">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-accent/10 rounded-lg text-accent">{activity.icon}</div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground italic">No recent activity yet.</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
