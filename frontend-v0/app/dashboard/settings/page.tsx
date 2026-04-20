'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Save, Bell, Lock } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Profile Settings */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Profile Settings
          </h2>
          <Separator className="mb-6" />
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                className="h-10 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="john@example.com"
                className="h-10 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="h-10 rounded-lg"
              />
            </div>

            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-10 gap-2 mt-6">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </h2>
          <Separator className="mb-6" />
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Notification preferences coming soon.</p>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </h2>
          <Separator className="mb-6" />
          
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full border-border hover:bg-secondary rounded-lg h-10"
            >
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full border-border hover:bg-secondary rounded-lg h-10"
            >
              Enable Two-Factor Authentication
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
