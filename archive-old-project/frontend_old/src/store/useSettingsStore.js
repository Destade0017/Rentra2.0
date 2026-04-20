import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  isDemoMode: false,
  toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
  
  // Simulation for action loading states
  isActionLoading: false,
  setActionLoading: (val) => set({ isActionLoading: val }),
  
  // Theme Management
  darkMode: localStorage.getItem('darkMode') === 'true',
  toggleDarkMode: () => set((state) => {
    const newVal = !state.darkMode;
    localStorage.setItem('darkMode', newVal);
    if (newVal) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { darkMode: newVal };
  }),
  
  // UI Density
  density: 'comfortable',
  setDensity: (val) => set({ density: val }),
}));
