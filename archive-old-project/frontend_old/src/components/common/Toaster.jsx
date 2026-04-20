import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore.js';
import { cn } from '../../utils/cn.js';

export default function Toaster() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={cn(
              "pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-premium border min-w-[320px] max-w-md bg-white",
              toast.type === 'success' ? "border-emerald-100" : 
              toast.type === 'error' ? "border-rose-100" : "border-slate-100"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              toast.type === 'success' ? "bg-emerald-50 text-emerald-500" : 
              toast.type === 'error' ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-500"
            )}>
              {toast.type === 'success' && <CheckCircle2 size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 leading-tight">{toast.message}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                {toast.type === 'success' ? 'Operation Verified' : 
                 toast.type === 'error' ? 'Sync Interrupted' : 'System Update'}
              </p>
            </div>

            <button 
              onClick={() => removeToast(toast.id)}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
