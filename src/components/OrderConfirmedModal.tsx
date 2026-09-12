import React, { useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order } from '../types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Printer,
  Download,
  FileText,
  MessageSquare,
  X,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { downloadBillPdf } from '../utils/pdfGenerator';

interface OrderConfirmedModalProps {
  order: Order | null;
  onClose: () => void;
  onViewBill: () => void;
}

export const OrderConfirmedModal: React.FC<OrderConfirmedModalProps> = ({
  order,
  onClose,
  onViewBill,
}) => {
  const { settings } = useRestaurant();

  useEffect(() => {
    if (order) {
      // Fire celebratory confetti burst
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#b45309', '#10b981', '#fef3c7'],
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [order]);

  if (!order) return null;

  const handlePrint = () => {
    onViewBill();
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDownload = () => {
    downloadBillPdf(order, settings);
  };

  const handleWhatsAppOrder = () => {
    const rawPhone = (settings.whatsapp || settings.phone).replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

    const itemsSummary = order.items
      .map((item) => `• ${item.dishName} x ${item.quantity} = ₹${item.total}`)
      .join('\n');

    const message = `*12 Maval Dining Order Confirmation*
--------------------------------
*Order No:* ${order.orderNumber}
*Customer:* ${order.customerName}
*Phone:* ${order.phone}
*Order Type:* Table Dining (${order.tableNumber || 'Dine-In'})
${order.tableNumber ? `*Table / Baithak:* ${order.tableNumber}\n` : ''}
*Items:*
${itemsSummary}
--------------------------------
*Total Amount:* ₹${order.grandTotal}
${order.specialInstructions ? `*Cooking Notes:* ${order.specialInstructions}\n` : ''}
_Sent via 12 Maval Dining System_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div
      id="order-confirmed-modal-container"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4 no-print"
    >
      <div className="bg-stone-950 border border-amber-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        {/* Confirmed Banner */}
        <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 p-6 sm:p-8 text-center text-stone-950 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/20 hover:bg-stone-950/40 text-stone-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-stone-950/90 text-amber-400 mx-auto mb-3 flex items-center justify-center shadow-xl border border-amber-300">
            <CheckCircle2 className="w-10 h-10 text-amber-400" />
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-black tracking-tight">
            Order Confirmed!
          </h3>
          <p className="font-marathi text-sm font-bold text-amber-950 mt-1">
            तुमची ऑर्डर स्वीकारली आहे! धन्यवाद.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-6 space-y-5">
          <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-xs text-stone-400 uppercase font-semibold tracking-wider">
                Order Number
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm sm:text-base">
                {order.orderNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400">Customer Name:</span>
              <span className="text-sm font-bold text-stone-100">{order.customerName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400">Order Type:</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                {order.orderType}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-800">
              <span className="text-sm font-bold text-stone-300">Total Amount:</span>
              <span className="font-heading text-xl sm:text-2xl font-black text-amber-400">
                ₹{order.grandTotal}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-3 gap-2">
              <button
                id="confirmed-view-bill-btn"
                onClick={onViewBill}
                className="p-3 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-200 border border-stone-800 flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all hover:border-amber-500/40"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>View Bill</span>
              </button>

              <button
                id="confirmed-print-bill-btn"
                onClick={handlePrint}
                className="p-3 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-200 border border-stone-800 flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all hover:border-amber-500/40"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Bill</span>
              </button>

              <button
                id="confirmed-download-bill-btn"
                onClick={handleDownload}
                className="p-3 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-200 border border-stone-800 flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all hover:border-amber-500/40"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Bill</span>
              </button>
            </div>

            {/* WhatsApp Button */}
            <button
              id="confirmed-whatsapp-btn"
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 transition-all active:scale-98"
            >
              <MessageSquare className="w-5 h-5 fill-white text-emerald-600" />
              <span>Send Order Details on WhatsApp</span>
            </button>
          </div>

          <p className="text-[11px] text-stone-400 text-center">
            Our kitchen team has received your order and started preparation.
          </p>
        </div>
      </div>
    </div>
  );
};
