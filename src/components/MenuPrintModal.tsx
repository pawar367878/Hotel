import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Printer, Download, X, Flame } from 'lucide-react';
import { downloadMenuPdf } from '../utils/pdfGenerator';

interface MenuPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuPrintModal: React.FC<MenuPrintModalProps> = ({ isOpen, onClose }) => {
  const { categories, menuItems, settings } = useRestaurant();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    downloadMenuPdf(categories, menuItems, settings);
  };

  return (
    <div
      id="menu-print-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-stone-950 border border-stone-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print p-4 sm:p-5 border-b border-stone-800 bg-stone-900 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-stone-100">
              Printable Menu Preview
            </h3>
            <p className="text-xs text-stone-400">
              Clean, printer-friendly layout with authentic pricing & descriptions
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Menu</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-100 bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-all shadow-md active:scale-95"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Menu Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-stone-900/40">
          <div
            id="printable-menu-area"
            className="print-area mx-auto max-w-3xl bg-white text-stone-900 rounded-xl p-8 shadow-2xl border border-stone-200"
          >
            {/* Header */}
            <div className="text-center pb-6 border-b-2 border-stone-800">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="w-6 h-6 text-amber-600" />
                <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-wider text-stone-950">
                  {settings.name || '12 MAVAL'}
                </h1>
              </div>
              <p className="font-marathi text-base font-bold text-amber-800">
                "{settings.marathiTagline || 'अस्सल चुलीची खानदानी परंपरा'}"
              </p>
              <p className="text-xs text-stone-600 mt-2 max-w-lg mx-auto">
                {settings.address}
              </p>
              <p className="text-xs text-stone-700 font-medium mt-1">
                Table Dining & Reservations: {settings.phone} | WhatsApp: {settings.whatsapp}
              </p>
            </div>

            {/* Menu Categories */}
            <div className="py-6 space-y-8">
              {categories.map((cat) => {
                const itemsInCat = menuItems.filter(
                  (m) =>
                    m.category.toLowerCase().trim() === cat.name.toLowerCase().trim() ||
                    m.category.toLowerCase().includes(cat.name.toLowerCase()) ||
                    cat.name.toLowerCase().includes(m.category.toLowerCase())
                );

                if (itemsInCat.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-3">
                    {/* Category Title */}
                    <div className="flex items-center justify-between border-b border-amber-700 pb-1.5">
                      <h2 className="font-heading text-base font-black text-amber-900 uppercase tracking-wide">
                        {cat.name}
                      </h2>
                      <span className="font-marathi text-sm font-bold text-stone-600">
                        {cat.marathiName}
                      </span>
                    </div>

                    {/* Dish List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {itemsInCat.map((item) => (
                        <div key={item.id} className="p-2 border-b border-stone-100 last:border-0">
                          <div className="flex justify-between items-baseline gap-2">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  item.isVegetarian ? 'bg-emerald-600' : 'bg-red-600'
                                }`}
                              />
                              <span className="font-bold text-xs sm:text-sm text-stone-900">
                                {item.name}
                              </span>
                            </div>
                            <span className="font-bold text-xs sm:text-sm font-mono text-amber-900 shrink-0">
                              ₹{item.price}
                            </span>
                          </div>

                          {item.marathiName && (
                            <p className="font-marathi text-xs text-amber-800 ml-3.5 mt-0.5">
                              {item.marathiName}
                            </p>
                          )}

                          {item.description && (
                            <p className="text-[11px] text-stone-500 ml-3.5 mt-0.5 leading-snug">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Menu Footer */}
            <div className="pt-6 border-t-2 border-stone-300 text-center text-xs text-stone-600 space-y-1">
              <p className="font-medium text-stone-800">
                All dishes are cooked fresh to order on wood-fire earthen chulhas.
              </p>
              <p className="font-marathi text-amber-800 text-sm">
                अस्सल चवीचा पुन्हा आनंद घ्या!
              </p>
              <p className="text-[10px] text-stone-400 mt-2">
                Authentic Table Dining at 12 Maval • Prices inclusive of taxes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
