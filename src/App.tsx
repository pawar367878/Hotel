import React, { useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TableBookingSection } from './components/TableBookingSection';
import { SpecialDishes } from './components/SpecialDishes';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactFooter } from './components/ContactFooter';
import { CartDrawer } from './components/CartDrawer';
import { OrderSummaryModal } from './components/OrderSummaryModal';
import { OrderConfirmedModal } from './components/OrderConfirmedModal';
import { BillInvoiceModal } from './components/BillInvoiceModal';
import { MenuPrintModal } from './components/MenuPrintModal';
import { Toast } from './components/Toast';

import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

const AppContent: React.FC = () => {
  const {
    isAdminView,
    setIsAdminView,
    isAdminLoggedIn,
    confirmedOrder,
    setConfirmedOrder,
    viewingBillOrder,
    setViewingBillOrder,
    isPrintMenuOpen,
    setIsPrintMenuOpen,
  } = useRestaurant();

  // Listen to url hash changes for #admin
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminView(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setIsAdminView]);

  if (isAdminView) {
    return isAdminLoggedIn ? <AdminLayout /> : <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950">
      {/* Public Facing Website */}
      <Navbar />
      <main>
        <Hero />
        <TableBookingSection />
        <SpecialDishes />
        <MenuSection />
        <AboutSection />
        <GallerySection />
        <ReviewsSection />
      </main>
      <ContactFooter />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Order Summary & Customer Details Checkout Modal */}
      <OrderSummaryModal />

      {/* Order Confirmed Celebration Modal */}
      <OrderConfirmedModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onViewBill={() => {
          setViewingBillOrder(confirmedOrder);
          setConfirmedOrder(null);
        }}
      />

      {/* Bill & Tax Invoice Modal */}
      <BillInvoiceModal
        order={viewingBillOrder}
        onClose={() => setViewingBillOrder(null)}
      />

      {/* Full Menu Print Modal */}
      <MenuPrintModal
        isOpen={isPrintMenuOpen}
        onClose={() => setIsPrintMenuOpen(false)}
      />

      {/* Notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}
