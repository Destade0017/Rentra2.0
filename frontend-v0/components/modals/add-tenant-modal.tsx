'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { toast } from 'sonner';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddTenantModal({ isOpen, onClose, onSuccess }: AddTenantModalProps) {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    property: '',
    rentAmount: '',
    dueDate: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
    }
  }, [isOpen]);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.property || !formData.rentAmount || !formData.dueDate) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/tenants', {
        ...formData,
        rentAmount: Number(formData.rentAmount),
      });
      toast.success('Tenant added successfully');
      setFormData({ name: '', email: '', property: '', rentAmount: '', dueDate: '' });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error adding tenant:', error);
      toast.error(error.response?.data?.message || 'Failed to add tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] bg-white border-slate-100 rounded-[32px] p-0 overflow-hidden gap-0">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">New Resident</DialogTitle>
          <p className="text-sm text-slate-400 font-medium mt-1">Assign a new tenant to your portfolio.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 px-8 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold text-slate-500 ml-1">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
              className="rounded-xl h-11 bg-slate-50/50 border-slate-200/50 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold text-slate-500 ml-1">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              className="rounded-xl h-11 bg-slate-50/50 border-slate-200/50 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="property" className="text-xs font-bold text-slate-500 ml-1">Assign to Property</Label>
            <Select 
              onValueChange={(val) => setFormData({ ...formData, property: val })}
              value={formData.property}
            >
              <SelectTrigger className="h-11 rounded-xl bg-slate-50/50 border-slate-200/50 focus:bg-white text-sm">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-100 rounded-xl">
                {properties.map((property) => (
                  <SelectItem key={property._id} value={property._id} className="text-sm font-semibold text-slate-700">
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rentAmount" className="text-xs font-bold text-slate-500 ml-1">Rent Amount ($)</Label>
              <Input
                id="rentAmount"
                type="number"
                placeholder="2500"
                value={formData.rentAmount}
                onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                disabled={loading}
                className="rounded-xl h-11 bg-slate-50/50 border-slate-200/50 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-xs font-bold text-slate-500 ml-1">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                disabled={loading}
                className="rounded-xl h-11 bg-slate-50/50 border-slate-200/50 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
          </div>
          <DialogFooter className="p-8 pt-4 bg-slate-50/30 -mx-8 mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="text-xs font-bold text-slate-400 hover:text-slate-900 px-6 h-11 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-11 px-8 font-bold text-xs shadow-sm active:scale-95 transition-all"
            >
              {loading ? 'Adding...' : 'Add Resident'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
