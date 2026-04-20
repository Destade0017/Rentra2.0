'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Wrench, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  MapPin, 
  Inbox,
  AlertOctagon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportIssueModal({ isOpen, onClose }: ReportIssueModalProps) {
  const { submitComplaint, tenants, stats } = useDashboardStore();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'medium',
    property: '',
    unit: '',
    tenantId: ''
  });

  // For tenants, we automatically assign their property
  // For landlords, we might need a property picker
  useEffect(() => {
    if (isOpen && user?.role === 'tenant') {
       // Ideally we'd have the tenant's property ID here. 
       // For now, let's assume we can fetch it or it's in the user object
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.property) {
      return toast.error('Please fill in all required fields');
    }

    setLoading(true);
    const res = await submitComplaint(formData);
    setLoading(false);

    if (res.success) {
      toast.success('Maintenance request submitted');
      setFormData({
        title: '',
        description: '',
        category: 'General',
        priority: 'medium',
        property: '',
        unit: '',
        tenantId: ''
      });
      onClose();
    } else {
      toast.error(res.message || 'Failed to submit request');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500 ease-out animate-in fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white dark:bg-[#0f172a] w-full max-w-2xl rounded-[40px] shadow-2xl shadow-slate-950/50 overflow-hidden border border-white/10 animate-in zoom-in-95 duration-300">
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                  <Wrench size={24} />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Report Issue</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Maintenance Request Portal</p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Title</label>
              <Input 
                placeholder="e.g., Leaking bathroom sink"
                className="h-14 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white px-6 focus-visible:ring-2 focus-visible:ring-blue-500/10"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                  <SelectTrigger className="h-14 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white px-6">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 dark:border-slate-800">
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="Carpentry">Carpentry</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Urgency Level</label>
                <div className="flex gap-2">
                    {['low', 'medium', 'high', 'urgent'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setFormData({...formData, priority: p})}
                          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            formData.priority === p 
                            ? (p === 'urgent' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 
                               p === 'high' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 
                               'bg-blue-600 text-white shadow-lg shadow-blue-600/20')
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
                          }`}
                        >
                          {p}
                        </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Attachment</label>
                <Select value={formData.property} onValueChange={(val) => setFormData({...formData, property: val})}>
                  <SelectTrigger className="h-14 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white px-6">
                    <SelectValue placeholder="Select Property" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 dark:border-slate-800">
                    {/* For MVP let's assume we use properties from store */}
                    <SelectItem value="prop-01">123 Main St, Apt 4A</SelectItem>
                    <SelectItem value="prop-02">456 Oak Avenue, Unit 12</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Describe the problem</label>
              <Textarea 
                placeholder="What seems to be the issue? Be as descriptive as possible."
                className="min-h-[120px] bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white px-6 py-4 focus-visible:ring-2 focus-visible:ring-blue-500/10 placeholder:text-slate-300"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button 
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 py-8 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-400 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button 
                disabled={loading}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-8 font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-600/30"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Log Request'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
