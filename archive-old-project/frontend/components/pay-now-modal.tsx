'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  Building2, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  Lock,
  Wallet,
  Landmark
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore } from '@/store/useDashboardStore';
import { toast } from 'sonner';

interface PayNowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId?: string;
  defaultAmount?: number;
}

export function PayNowModal({ open, onOpenChange, tenantId, defaultAmount }: PayNowModalProps) {
  const { tenants, recordPayment, loading } = useDashboardStore();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'Bank Transfer' | 'Card Payment' | 'Cash'>('Card Payment');
  const [formData, setFormData] = useState({
    tenantId: tenantId || '',
    amount: defaultAmount || 0,
    propertyId: '',
    notes: ''
  });

  // Reset modal when opened
  useEffect(() => {
    if (open) {
      setStep(1);
      setFormData({
        tenantId: tenantId || '',
        amount: defaultAmount || 0,
        propertyId: '',
        notes: ''
      });
    }
  }, [open, tenantId, defaultAmount]);

  const selectedTenant = tenants.find(t => t._id === formData.tenantId);

  const handleSubmit = async () => {
    if (!formData.tenantId || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Capture property ID from tenant record
    const propertyId = selectedTenant?.property?._id;
    
    if (!propertyId) {
      toast.error('Tenant has no associated property');
      return;
    }

    const result = await recordPayment({
      ...formData,
      propertyId,
      method,
      status: 'Paid'
    });

    if (result.success) {
      setStep(3); // Success step
      toast.success('Payment recorded successfully');
    } else {
      toast.error(result.message || 'Payment failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
        <div className="bg-[#1E1B4B] p-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CreditCard size={100} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight text-white">
              {step === 3 ? 'Transaction Complete' : 'Secure Payment'}
            </DialogTitle>
            <DialogDescription className="text-indigo-200 font-bold uppercase tracking-widest text-[10px]">
              {step === 3 ? 'Proof of Payment' : 'Internal Portfolio Transaction'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 bg-white">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Member</label>
                    <Select value={formData.tenantId} onValueChange={(val) => setFormData({...formData, tenantId: val})}>
                      <SelectTrigger className="w-full bg-slate-50 border-none rounded-2xl h-14 font-bold text-slate-700">
                        <SelectValue placeholder="Which tenant is paying?" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100">
                        {tenants.map(t => (
                          <SelectItem key={t._id} value={t._id} className="font-bold">{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transaction Amount</label>
                    <div className="relative">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₦</div>
                       <Input 
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-slate-50 border-none rounded-2xl h-14 pl-10 font-black text-lg focus-visible:ring-2 focus-visible:ring-blue-500/10 placeholder:text-slate-200"
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                       />
                    </div>
                 </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!formData.tenantId || !formData.amount}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-8 font-black text-sm shadow-xl shadow-blue-600/20 group uppercase tracking-widest"
                >
                  Continue to Method <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'Card Payment', icon: CreditCard, label: 'Card' },
                    { id: 'Bank Transfer', icon: Landmark, label: 'Transfer' },
                    { id: 'Cash', icon: Wallet, label: 'Cash' },
                    { id: 'Electronic', icon: Lock, label: 'Wallet' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id as any)}
                      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] border-2 transition-all ${
                        method === m.id 
                          ? 'border-blue-600 bg-blue-50 text-blue-600' 
                          : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <m.icon size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                    </button>
                  ))}
               </div>

               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-center">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Assigned</p>
                    <p className="text-sm font-black text-slate-700">{selectedTenant?.property?.name || 'Main Portfolio'}</p>
                  </div>
               </div>

               <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 rounded-2xl py-7 font-black text-xs uppercase tracking-widest text-slate-400">Back</Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-7 font-black text-xs shadow-xl shadow-blue-600/20 uppercase tracking-widest items-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                      <>Push Transaction <CheckCircle2 size={18} /></>
                    )}
                  </Button>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-10 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-300">
               <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={60} strokeWidth={3} />
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Funds Secured</h3>
                  <p className="text-slate-400 font-bold text-sm mt-2">Payment of ₦{formData.amount.toLocaleString()} has been added to {selectedTenant?.name}&apos;s history.</p>
               </div>
               <Button 
                onClick={() => onOpenChange(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-8 font-black text-sm uppercase tracking-widest mt-4"
               >
                 Close Window
               </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
