import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { api } from '../../services/api';
import { Order } from '../../types';
import {
  TrendingUp,
  ShoppingBag,
  Utensils,
  Clock,
  ArrowRight,
  Download,
  FileText,
  CheckCircle2,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { downloadMenuPdf } from '../../utils/pdfGenerator';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
  onViewOrderBill: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onViewOrderBill,
}) => {
  const { menuItems, specialDishes, categories, settings, showToast } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .getOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  // Compute metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, o) => (o.status !== 'Cancelled' ? acc + o.grandTotal : acc), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));
  const todayRevenue = todayOrders.reduce((acc, o) => (o.status !== 'Cancelled' ? acc + o.grandTotal : acc), 0);

  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing');
  const recentOrders = orders.slice(0, 6);

  const handleDownloadMenu = () => {
    showToast('Downloading live Menu PDF...');
    downloadMenuPdf(categories, menuItems, settings);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 p-6 sm:p-8 rounded-3xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
            Control Center
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-stone-100 mt-1">
            Welcome to {settings.name} Admin
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Live management of your Chulha restaurant menu, live incoming orders, customer bills & visual content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadMenu}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Menu PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-heading text-stone-100">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-500">Across all completed orders</p>
        </div>

        {/* Today's Sales */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Today's Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 text-amber-400 flex items-center justify-center border border-amber-800/40">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-heading text-amber-400">
            ₹{todayRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-500">{todayOrders.length} orders received today</p>
        </div>

        {/* Active Orders */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Live Kitchen Queue</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center border border-blue-800/40">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-heading text-stone-100">
            {pendingOrders.length}
          </div>
          <p className="text-[11px] text-stone-500">Pending or preparing</p>
        </div>

        {/* Total Dishes */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Menu Items</span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 text-purple-400 flex items-center justify-center border border-purple-800/40">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-heading text-stone-100">
            {menuItems.length}
          </div>
          <p className="text-[11px] text-stone-500">In {categories.length} categories</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-stone-900/80 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-stone-100">Recent Customer Orders</h3>
            <p className="text-xs text-stone-400">Instant view of latest incoming bills</p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading orders...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500">No orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950/60 text-stone-400 uppercase border-b border-stone-800">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-300">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-850/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-200 block">{order.customerName}</span>
                      <span className="text-[11px] text-stone-500">{order.phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-800 text-stone-300 border border-stone-700">
                        {order.orderType}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-stone-400">
                      {order.items.map((i) => `${i.quantity}x ${i.dishName}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-100">
                      ₹{order.grandTotal}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          order.status === 'Completed' || order.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : order.status === 'Preparing'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : order.status === 'Cancelled'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewOrderBill(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
                        title="View and Print Bill"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Bill</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('menu')}
          className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 text-left transition-all group"
        >
          <Utensils className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-heading text-sm font-bold text-stone-100">Update Food Menu</h4>
          <p className="text-xs text-stone-400 mt-1">
            Add new recipes, update rates in ₹, or upload dish photos.
          </p>
        </button>

        <button
          onClick={() => onNavigate('specials')}
          className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 text-left transition-all group"
        >
          <TrendingUp className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-heading text-sm font-bold text-stone-100">Manage 'आमच्या खासियत'</h4>
          <p className="text-xs text-stone-400 mt-1">
            Pin signature wood-fired specials with Bestseller & Chef badges.
          </p>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 text-left transition-all group"
        >
          <FileText className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-heading text-sm font-bold text-stone-100">Tax & Dining Settings</h4>
          <p className="text-xs text-stone-400 mt-1">
            Configure GST %, table settings, address & contact numbers.
          </p>
        </button>
      </div>
    </div>
  );
};
