import React from 'react';
import { Sun, Moon, Layout, Maximize } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { useSettingsStore } from '../../store/useSettingsStore.js';

export default function AppearanceSettings() {
  const { darkMode, toggleDarkMode, density, setDensity } = useSettingsStore();

  return (
    <div className="space-y-12">
      {/* Theme Selection */}
      <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Interface Theme</h3>
          <div className="grid grid-cols-2 gap-4 max-w-sm">
              <button 
                onClick={() => !darkMode && toggleDarkMode()}
                className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                    !darkMode ? "border-brand-500 bg-brand-50/50" : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200"
                )}
              >
                  <Sun size={24} className={!darkMode ? "text-brand-500" : "text-slate-400"} />
                  <span className={cn("text-xs font-bold", !darkMode ? "text-brand-600" : "text-slate-500")}>Light Mode</span>
              </button>
              <button 
                onClick={() => darkMode && toggleDarkMode()}
                className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                    darkMode ? "border-brand-500 bg-brand-50/50" : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200"
                )}
              >
                  <Moon size={24} className={darkMode ? "text-brand-500" : "text-slate-400"} />
                  <span className={cn("text-xs font-bold", darkMode ? "text-brand-600" : "text-slate-500")}>Dark Mode</span>
              </button>
          </div>
      </section>

      {/* Density Selection */}
      <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Interface Density</h3>
          <div className="grid grid-cols-2 gap-4 max-w-sm">
              <button 
                onClick={() => setDensity('comfortable')}
                className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                    density === 'comfortable' ? "border-brand-500 bg-brand-50/50" : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200"
                )}
              >
                  <Layout size={24} className={density === 'comfortable' ? "text-brand-500" : "text-slate-400"} />
                  <span className={cn("text-xs font-bold", density === 'comfortable' ? "text-brand-600" : "text-slate-500")}>Comfortable</span>
              </button>
              <button 
                onClick={() => setDensity('compact')}
                className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                    density === 'compact' ? "border-brand-500 bg-brand-50/50" : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200"
                )}
              >
                  <Maximize size={24} className={density === 'compact' ? "text-brand-500" : "text-slate-400"} />
                  <span className={cn("text-xs font-bold", density === 'compact' ? "text-brand-600" : "text-slate-500")}>Compact</span>
              </button>
          </div>
      </section>
    </div>
  );
}
