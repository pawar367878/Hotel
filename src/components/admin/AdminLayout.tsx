import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { api } from '../../services/api';
import {
  LayoutDashboard,
  Utensils,
  Sparkles,
  Flame,
  Camera,
  MessageSquare,
  Tag,
  ShoppingBag,
  Settings,
  LogOut,
  ExternalLink,
  Receipt,
  Menu,
  X,
  FileText,
} from 'lucide-react';

import { AdminDashboard } from './AdminDashboard';
import { AdminMenuManager } from './AdminMenuManager';
import { AdminSpecialsManager } from './AdminSpecialsManager';
import { AdminContentManager } from './AdminContentManager';
import { AdminGalleryManager } from './AdminGalleryManager';
import { AdminOffersManager } from './AdminOffersManager';
import { AdminOrdersManager } from './AdminOrdersManager';
import { AdminReviewsManager } from './AdminReviewsManager';
import { AdminSettingsManager } from './AdminSettingsManager';
import { BillInvoiceModal } from '../BillInvoiceModal';
import { Order } from '../../types';

export const AdminLayout: React.FC = () => {
  const { settings, setIsAdminView, setIsAdminLoggedIn, showToast } = useRestaurant();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeBillOrder, setActiveBillOrder] = useState<Order | null>(null);

  const handleLogout = () => {
    api.adminLogout();
    setIsAdminLoggedIn(false);
    showToast('Logged out of Admin');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders & Bills', icon: ShoppingBag },
    { id: 'menu', label: 'Menu & Recipes', icon: Utensils },
    { id: 'specials', label: 'आमच्या खासियत', icon: Sparkles },
    { id: 'content', label: 'Hero & Heritage Content', icon: Flame },
    { id: 'gallery', label: 'Photo Gallery', icon: Camera },
    { id: 'reviews', label: 'Customer Reviews', icon: MessageSquare },
    { id: 'offers', label: 'Coupons & Offers', icon: Tag },
    { id: 'settings', label: 'Business & Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-stone-900 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-black">
            <Flame className="w-5 h-5 text-stone-950 fill-stone-950" />
          </div>
          <span className="font-heading font-black text-sm tracking-wide">
            {settings.name} Admin
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-stone-800 text-stone-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-stone-900/95 border-r border-stone-800 flex flex-col justify-between shrink-0 z-30`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-stone-800/80 hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-950/40">
              <Flame className="w-6 h-6 text-stone-950 fill-stone-950" />
            </div>
            <div>
              <h2 className="font-heading font-black text-sm text-stone-100 uppercase tracking-wider">
                {settings.name}
              </h2>
              <p className="font-marathi text-xs text-amber-400">Admin Control Panel</p>
            </div>
          </div>

          {/* Nav list */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer actions */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <button
            onClick={() => setIsAdminView(false)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            onNavigate={(tab) => setActiveTab(tab)}
            onViewOrderBill={(order) => setActiveBillOrder(order)}
          />
        )}
        {activeTab === 'orders' && (
          <AdminOrdersManager onViewBill={(order) => setActiveBillOrder(order)} />
        )}
        {activeTab === 'menu' && <AdminMenuManager />}
        {activeTab === 'specials' && <AdminSpecialsManager />}
        {activeTab === 'content' && <AdminContentManager />}
        {activeTab === 'gallery' && <AdminGalleryManager />}
        {activeTab === 'reviews' && <AdminReviewsManager />}
        {activeTab === 'offers' && <AdminOffersManager />}
        {activeTab === 'settings' && <AdminSettingsManager />}
      </main>

      {/* Bill modal when viewing order */}
      <BillInvoiceModal order={activeBillOrder} onClose={() => setActiveBillOrder(null)} />
    </div>
  );
};
