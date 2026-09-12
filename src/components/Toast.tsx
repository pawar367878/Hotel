import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useRestaurant();

  if (!toast.visible) return null;

  return (
    <div
      id="app-toast"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 bg-stone-900/95 text-stone-100 border-amber-500/40"
    >
      {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
      {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
      {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
      <p className="text-sm font-medium tracking-wide">{toast.message}</p>
    </div>
  );
};
