'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Users, Mail, Building2, Calendar } from 'lucide-react';
import api from '@/lib/api';
import { AddTenantModal } from '@/components/modals/add-tenant-modal';
import { format } from 'date-fns';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/tenants');
      setTenants(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
      <AddTenantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTenants} 
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tenants</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tenant database and lease terms
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg h-10 gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      ) : tenants.length === 0 ? (
        <Card className="p-12 bg-card border-border text-center">
          <Empty
            icon={<Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
            title="No tenants yet"
            description="Add your first tenant to start tracking rent and managing lease agreements."
          />
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg h-10 gap-2 mt-6 mx-auto"
          >
            <Plus className="h-4 w-4" />
            Add First Tenant
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => (
            <Card key={tenant._id} className="p-6 bg-card border-border hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    {tenant.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{tenant.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {tenant.email}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Rent
                    </span>
                    <span className="font-semibold text-foreground">${tenant.rentAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Due Date
                    </span>
                    <span className="text-foreground">{format(new Date(tenant.dueDate), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      tenant.status === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {tenant.status}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4 text-xs hover:bg-secondary">
                View Agreement
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
