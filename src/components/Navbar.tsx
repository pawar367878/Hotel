import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { UtensilsCrossed, Phone, Menu, X, Flame, Shield, Calendar } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, totalCartItems, setIsCartOpen, setIsAdminView, offers } = useRestaurant();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [badgeBump, setBadgeBump] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate badge on cart change
  useEffect(() => {
    if (totalCartItems > 0) {
      setBadgeBump(true);
      const timer = setTimeout(() => setBadgeBump(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalCartItems]);

  const activeOffer = offers.find((o) => o.isActive);

  return (
    <>
      {/* Top Banner Announcement if Offer Active */}
      {activeOffer && (
        <div id="announcement-banner" className="no-print bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-amber-50 px-4 py-1.5 text-center text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 border-b border-amber-500/30">
          <Flame className="w-4 h-4 text-amber-200 shrink-0" />
          <span>
            <strong>{activeOffer.title}:</strong> {activeOffer.description} Use code:{' '}
            <span className="font-mono bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-200 border border-amber-400/40">
              {activeOffer.couponCode}
            </span>
          </span>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        id="main-navbar"
        className={`no-print sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 shadow-2xl py-3'
            : 'bg-stone-950/80 backdrop-blur-sm border-b border-stone-800/40 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-900/30 border border-amber-300/40 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-stone-950 fill-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-wider text-stone-100 group-hover:text-amber-400 transition-colors">
                  {settings.name || '12 MAVAL'}
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-amber-900/40 text-amber-400 border border-amber-600/30 rounded">
                  Chulha Kitchen
                </span>
              </div>
              <p className="font-marathi text-xs sm:text-sm text-amber-500/90 font-medium">
                {settings.marathiTagline || 'अस्सल चुलीची खानदानी परंपरा'}
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-300">
            <a href="#specialties" className="hover:text-amber-400 transition-colors">
              आमच्या खासियत
            </a>
            <a href="#menu" className="hover:text-amber-400 transition-colors">
              Dining Menu (मेनू)
            </a>
            <a href="#table-booking" className="text-amber-400 hover:text-amber-300 transition-colors font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Table (आरक्षण)</span>
            </a>
            <a href="#about" className="hover:text-amber-400 transition-colors">
              Our Story
            </a>
            <a href="#gallery" className="hover:text-amber-400 transition-colors">
              Gallery
            </a>
            <a href="#reviews" className="hover:text-amber-400 transition-colors">
              Reviews
            </a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">
              Contact
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Phone Call button */}
            <a
              id="nav-call-btn"
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-200 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 transition-all hover:border-amber-500/40"
              title="Call for Dining Reservations or Inquiries"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call: {settings.phone.split(' ')[2] || settings.phone}</span>
            </a>

            {/* Table Order / Dining Bill Button */}
            <button
              id="navbar-cart-button"
              onClick={() => setIsCartOpen(true)}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 ${
                totalCartItems > 0
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-400 hover:to-amber-500 shadow-amber-900/40'
                  : 'bg-stone-900 text-stone-200 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Table Order {totalCartItems > 0 ? `(${totalCartItems})` : ''}</span>
              {totalCartItems > 0 && (
                <span
                  className={`flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-xs font-black bg-stone-950 text-amber-400 transition-transform ${
                    badgeBump ? 'scale-125' : 'scale-100'
                  }`}
                >
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Admin CMS Access Button */}
            <button
              id="navbar-admin-btn"
              onClick={() => setIsAdminView(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-100 bg-stone-900/60 hover:bg-stone-800 border border-stone-800/80 transition-all"
              title="Admin CMS Portal"
            >
              <Shield className="w-3.5 h-3.5 text-amber-500/70" />
              <span>Admin</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-900 border border-stone-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-800/80 bg-stone-950/98 px-5 py-4 space-y-3 animate-in slide-in-from-top-2">
            <a
              href="#specialties"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-stone-300 hover:text-amber-400 py-1"
            >
              आमच्या खासियत (Specialties)
            </a>
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-stone-300 hover:text-amber-400 py-1"
            >
              Dining Menu (भोजन मेनू)
            </a>
            <a
              href="#table-booking"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-amber-400 hover:text-amber-300 py-1"
            >
              Book a Table (टेबल आरक्षण)
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-stone-300 hover:text-amber-400 py-1"
            >
              Our Chulha Heritage
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-stone-300 hover:text-amber-400 py-1"
            >
              Photo Gallery
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-stone-300 hover:text-amber-400 py-1"
            >
              Patron Reviews
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-stone-300 hover:text-amber-400 py-1"
            >
              Location & Contact
            </a>

            <div className="pt-3 border-t border-stone-800 flex flex-col gap-2.5">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-stone-900 text-stone-200 border border-stone-800"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                Call Restaurant: {settings.phone}
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminView(true);
                }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-amber-950/40 text-amber-300 border border-amber-800/40"
              >
                <Shield className="w-3.5 h-3.5" />
                Open Admin CMS Portal
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
