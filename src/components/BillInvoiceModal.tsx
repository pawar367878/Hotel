import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order } from '../types';
import { Printer, Download, X, Flame, CheckCircle, Smartphone, Receipt } from 'lucide-react';
import { downloadBillPdf } from '../utils/pdfGenerator';

interface BillInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const BillInvoiceModal: React.FC<BillInvoiceModalProps> = ({ order, onClose }) => {
  const { settings } = useRestaurant();
  const [printFormat, setPrintFormat] = useState<'A4' | 'Thermal'>('A4');

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    downloadBillPdf(order, settings);
  };

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      id="bill-invoice-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-stone-950 border border-stone-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="no-print p-4 sm:p-5 border-b border-stone-800 bg-stone-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-stone-100">Official Bill / Invoice</h3>
              <p className="text-xs text-stone-400">Order Ref: {order.orderNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle for preview */}
            <div className="hidden sm:flex items-center bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs">
              <button
                onClick={() => setPrintFormat('A4')}
                className={`px-2.5 py-1 rounded font-semibold ${
                  printFormat === 'A4' ? 'bg-stone-800 text-amber-400' : 'text-stone-400'
                }`}
              >
                Standard A4
              </button>
              <button
                onClick={() => setPrintFormat('Thermal')}
                className={`px-2.5 py-1 rounded font-semibold ${
                  printFormat === 'Thermal' ? 'bg-stone-800 text-amber-400' : 'text-stone-400'
                }`}
              >
                Thermal (80mm)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-stone-900/40">
          <div
            id="printable-bill-area"
            className={`print-area mx-auto bg-white text-stone-900 rounded-xl p-6 sm:p-8 shadow-2xl border border-stone-200 ${
              printFormat === 'Thermal' ? 'max-w-xs font-mono text-xs' : 'max-w-xl'
            }`}
          >
            {/* Bill Header */}
            <div className="text-center pb-5 border-b-2 border-dashed border-stone-300">
              <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-wider text-stone-950">
                {settings.name || '12 MAVAL'}
              </h1>
              <p className="font-marathi text-sm font-bold text-amber-800 mt-0.5">
                "{settings.marathiTagline || 'अस्सल चुलीची खानदानी परंपरा'}"
              </p>
              <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
                {settings.address}
              </p>
              <p className="text-xs text-stone-700 font-medium mt-1">
                Phone: {settings.phone} {settings.email ? `| Email: ${settings.email}` : ''}
              </p>
            </div>

            {/* Bill Title & Details */}
            <div className="py-4 border-b border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm uppercase tracking-wider text-stone-900">
                  BILL / ORDER RECEIPT
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {order.orderType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
                <div>
                  <span className="text-stone-500">Order Number: </span>
                  <span className="font-bold text-stone-900">{order.orderNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500">Date: </span>
                  <span className="font-medium text-stone-900">{orderDate}</span>
                </div>
                <div>
                  <span className="text-stone-500">Customer: </span>
                  <span className="font-bold text-stone-900">{order.customerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500">Time: </span>
                  <span className="font-medium text-stone-900">{orderTime}</span>
                </div>
                <div>
                  <span className="text-stone-500">Mobile: </span>
                  <span className="font-medium text-stone-900">{order.phone}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500">Status: </span>
                  <span className="font-bold text-emerald-700 uppercase">{order.status}</span>
                </div>

                {order.orderType === 'Delivery' && order.address && (
                  <div className="col-span-2 pt-1 border-t border-stone-100">
                    <span className="text-stone-500">Delivery Address: </span>
                    <span className="text-stone-900">{order.address}</span>
                  </div>
                )}

                {order.orderType === 'Dine-In' && order.tableNumber && (
                  <div className="col-span-2 pt-1 border-t border-stone-100">
                    <span className="text-stone-500">Table Allocation: </span>
                    <span className="text-stone-900 font-semibold">{order.tableNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="py-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-stone-800 text-stone-900 font-bold uppercase">
                    <th className="py-2">Item Name</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {order.items.map((item) => (
                    <tr key={item.id} className="text-stone-800">
                      <td className="py-2 font-medium">{item.dishName}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right font-mono">₹{item.price}</td>
                      <td className="py-2 text-right font-mono font-bold">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Breakdown */}
            <div className="pt-3 border-t-2 border-dashed border-stone-300 space-y-1.5 text-xs text-stone-800">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-bold">₹{order.subtotal.toFixed(2)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Discount ({order.appliedCoupon || 'Special'}):</span>
                  <span className="font-mono font-bold">- ₹{order.discount.toFixed(2)}</span>
                </div>
              )}

              {order.tax > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>GST / Tax ({settings.taxGstPercentage}%):</span>
                  <span className="font-mono">₹{order.tax.toFixed(2)}</span>
                </div>
              )}

              {order.deliveryCharge > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge:</span>
                  <span className="font-mono">₹{order.deliveryCharge.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-sm sm:text-base font-black text-stone-950">
                <span>Grand Total:</span>
                <span className="font-mono text-lg text-amber-900">
                  ₹{order.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Bill Footer Note */}
            <div className="mt-8 pt-4 border-t border-stone-300 text-center text-xs text-stone-600 space-y-1">
              <p className="font-medium text-stone-800">Thank you for dining at 12 Maval.</p>
              <p className="font-marathi italic text-amber-800 text-sm">
                "अस्सल चवीचा पुन्हा आनंद घ्या."
              </p>
              <p className="text-[10px] text-stone-400 mt-2">
                Computer Generated Tax Invoice • No signature required
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Controls (Hidden in Print) */}
        <div className="no-print p-4 sm:p-5 border-t border-stone-800 bg-stone-900 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-400">
            <span>Bill is ready for customer presentation or printing</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="print-bill-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>🖨 Print Bill</span>
            </button>

            <button
              id="download-bill-btn"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-stone-100 bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-all shadow-md active:scale-95"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>⬇ Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-stone-400 hover:text-stone-200 bg-stone-950 border border-stone-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
