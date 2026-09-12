import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Order, OrderStatus, TableReservation } from '../../types';
import {
  Search,
  Filter,
  FileText,
  Printer,
  Clock,
  CheckCircle2,
  AlertCircle,
  Utensils,
  RefreshCw,
  Calendar,
  Users,
  MapPin,
  Phone,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface AdminOrdersManagerProps {
  onViewBill: (order: Order) => void;
}

export const AdminOrdersManager: React.FC<AdminOrdersManagerProps> = ({ onViewBill }) => {
  const { showToast } = useRestaurant();
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'reservations'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<TableReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ordersData, resData] = await Promise.all([
        api.getOrders().catch(() => []),
        api.getReservations().catch(() => []),
      ]);
      setOrders(ordersData);
      setReservations(resData);
    } catch (err: any) {
      showToast('Failed to load records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`);
      fetchData();
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleUpdateReservation = async (resId: string, newStatus: 'Confirmed' | 'Completed' | 'Cancelled') => {
    try {
      await api.updateReservationStatus(resId, newStatus);
      showToast(`Reservation updated to ${newStatus}`);
      fetchData();
    } catch (err: any) {
      showToast('Failed to update reservation status', 'error');
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'All' && order.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.phone.includes(q) ||
        (order.tableNumber && order.tableNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredReservations = reservations.filter((res) => {
    if (statusFilter !== 'All' && res.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        res.reservationNumber.toLowerCase().includes(q) ||
        res.customerName.toLowerCase().includes(q) ||
        res.phone.includes(q) ||
        res.tableNumber.toLowerCase().includes(q) ||
        (res.seatingSection && res.seatingSection.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-stone-100">
            12 Maval Dining & Table Management
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage live dining table orders, guest billing, and customer table reservations
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Sub-Tabs: Table Orders vs Table Reservations */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => {
            setActiveSubTab('orders');
            setStatusFilter('All');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeSubTab === 'orders'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 bg-stone-900 border border-stone-800'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Dining Orders & Bills ({orders.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('reservations');
            setStatusFilter('All');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeSubTab === 'reservations'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 bg-stone-900 border border-stone-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Table Bookings & Reservations ({reservations.length})</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeSubTab === 'orders'
                  ? 'Search by Order ID, Table, Customer Name, or Mobile...'
                  : 'Search by Booking ID, Guest Name, Mobile, or Table...'
              }
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-300 focus:outline-hidden focus:border-amber-500 flex-1 sm:flex-initial"
            >
              <option value="All">All Statuses</option>
              {activeSubTab === 'orders' ? (
                <>
                  <option value="New">New</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </>
              ) : (
                <>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Content for Orders */}
      {activeSubTab === 'orders' ? (
        <div className="bg-stone-900/80 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-stone-400">Loading dining orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500">
              No dining orders match the current filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950/70 text-stone-400 uppercase border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Table / Seating</th>
                    <th className="py-3 px-4">Dishes Ordered</th>
                    <th className="py-3 px-4">Bill Amount</th>
                    <th className="py-3 px-4">Kitchen Status</th>
                    <th className="py-3 px-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-300">
                  {filteredOrders.map((order) => {
                    const dateFormatted = new Date(order.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    });

                    return (
                      <tr key={order.id} className="hover:bg-stone-850/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-amber-400 block text-xs sm:text-sm">
                            {order.orderNumber}
                          </span>
                          <span className="text-[11px] text-stone-500">{dateFormatted}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-stone-100 block">{order.customerName}</span>
                          <span className="text-[11px] text-stone-400">{order.phone}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Utensils className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-bold text-amber-300">
                              {order.tableNumber || 'Table 1'}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 block">Dine-In Guest</span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="text-[11px] text-stone-300 space-y-0.5">
                            {order.items.map((i, idx) => (
                              <div key={idx} className="truncate">
                                <span className="font-bold text-amber-400">{i.quantity}x</span>{' '}
                                <span>{i.dishName}</span>
                              </div>
                            ))}
                          </div>
                          {order.specialInstructions && (
                            <p className="text-[10px] text-stone-500 italic mt-1 truncate">
                              Note: {order.specialInstructions}
                            </p>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-black text-amber-400 text-sm">
                          ₹{order.grandTotal}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateStatus(order.id, e.target.value as OrderStatus)
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              order.status === 'Completed'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : order.status === 'Preparing'
                                ? 'bg-amber-950 text-amber-300 border-amber-800'
                                : order.status === 'Cancelled'
                                ? 'bg-red-950 text-red-300 border-red-800'
                                : 'bg-blue-950 text-blue-300 border-blue-800'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Completed">Served & Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            id={`order-bill-btn-${order.id}`}
                            onClick={() => onViewBill(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold hover:border-amber-500/50 border border-stone-700 transition-all"
                            title="View, Print or Download Tax Bill"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            <span>Tax Bill</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Table Bookings & Reservations View */
        <div className="bg-stone-900/80 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-stone-400">Loading reservations...</div>
          ) : filteredReservations.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500">
              No table reservations match the current filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950/70 text-stone-400 uppercase border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Guest Info</th>
                    <th className="py-3 px-4">Date & Slot</th>
                    <th className="py-3 px-4">Zone & Table</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Requests</th>
                    <th className="py-3 px-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-300">
                  {filteredReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-stone-850/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {res.reservationNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-100 block">{res.customerName}</span>
                        <span className="text-[11px] text-stone-400 font-mono">{res.phone}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-stone-200 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>{res.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 mt-0.5">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{res.timeSlot}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-200 block">
                          {res.seatingSection || 'Dining Hall'}
                        </span>
                        <span className="text-[11px] text-amber-400 font-semibold">
                          {res.tableNumber}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-950 border border-stone-800 text-stone-200 font-bold text-xs">
                          <Users className="w-3 h-3 text-amber-400" />
                          <span>{res.guests} Guests</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-[11px] text-stone-400 italic truncate">
                          {res.specialRequests || 'None'}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={res.status}
                          onChange={(e) =>
                            handleUpdateReservation(
                              res.id,
                              e.target.value as 'Confirmed' | 'Completed' | 'Cancelled'
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            res.status === 'Completed'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : res.status === 'Cancelled'
                              ? 'bg-red-950 text-red-300 border-red-800'
                              : 'bg-amber-950 text-amber-300 border-amber-800'
                          }`}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed / Seated</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
