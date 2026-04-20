'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

interface AddTenantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTenant: (tenant: TenantFormData) => void;
}

interface TenantFormData {
  name: string;
  email: string;
  property: string;
  rentAmount: string;
}

export function AddTenantModal({
  open,
  onOpenChange,
  onAddTenant,
}: AddTenantModalProps) {
  const [formData, setFormData] = useState<TenantFormData>({
    name: '',
    email: '',
    property: '',
    rentAmount: '',
  });

  const [errors, setErrors] = useState<Partial<TenantFormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof TenantFormData
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handlePropertyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      property: value,
    }));
    if (errors.property) {
      setErrors((prev) => ({
        ...prev,
        property: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<TenantFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.property) {
      newErrors.property = 'Property is required';
    }
    if (!formData.rentAmount.trim()) {
      newErrors.rentAmount = 'Rent amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onAddTenant(formData);
      setFormData({
        name: '',
        email: '',
        property: '',
        rentAmount: '',
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Tenant</DialogTitle>
          <DialogDescription>
            Fill in the tenant information below to add them to your properties.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => handleChange(e, 'name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleChange(e, 'email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="property">Property *</Label>
            <Select value={formData.property} onValueChange={handlePropertyChange}>
              <SelectTrigger
                id="property"
                className={errors.property ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="123-main-st">123 Main St, Apt 4A</SelectItem>
                <SelectItem value="456-oak-ave">456 Oak Ave, Apt 2B</SelectItem>
                <SelectItem value="789-pine-rd">789 Pine Rd, Apt 1C</SelectItem>
                <SelectItem value="321-elm-st">321 Elm St, Apt 3D</SelectItem>
                <SelectItem value="654-birch-ln">654 Birch Ln, Apt 5E</SelectItem>
              </SelectContent>
            </Select>
            {errors.property && (
              <p className="text-sm text-red-500">{errors.property}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rent-amount">Monthly Rent Amount *</Label>
            <div className="flex items-center gap-2">
              <span className="text-foreground">$</span>
              <Input
                id="rent-amount"
                type="number"
                placeholder="2000"
                value={formData.rentAmount}
                onChange={(e) => handleChange(e, 'rentAmount')}
                className={`${errors.rentAmount ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.rentAmount && (
              <p className="text-sm text-red-500">{errors.rentAmount}</p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Add Tenant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
