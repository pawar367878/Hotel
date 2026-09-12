import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Mail,
  Flame,
  ArrowUpRight,
  Shield,
  Instagram,
  Facebook,
} from 'lucide-react';

export const ContactFooter: React.FC = () => {
  const { settings, setIsAdminView } = useRestaurant();

  const handleWhatsApp = () => {
    const rawPhone = (settings.whatsapp || settings.phone).replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        'Hello 12 Maval! I would like to inquire about table booking / dining reservations.'
      )}`,
      '_blank'
    );
  };

  return (
    <footer id="contact" className="bg-stone-950 border-t border-stone-850 pt-16 pb-12 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-black">
                <Flame className="w-6 h-6 text-stone-950 fill-stone-950" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg text-stone-100 block">
                  {settings.name}
                </span>
                <span className="font-marathi text-xs text-amber-500 font-medium">
                  {settings.marathiTagline}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Serving the true culinary soul of Maval. Wood-fired hearth cooking, stone-ground masalas, and authentic rural Maharashtrian hospitality.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </button>

              <button
                onClick={() => setIsAdminView(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-stone-200 border border-stone-800"
              >
                <Shield className="w-3.5 h-3.5 text-amber-500/70" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          {/* Col 2: Timings & Hospitality */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Opening Hours</span>
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80">
                <p className="font-bold text-amber-400">All 7 Days Open</p>
                <p className="text-stone-200 mt-0.5">{settings.openingHours}</p>
                <p className="text-[11px] text-stone-400 mt-1">Lunch & Dinner Non-stop Hearth</p>
              </div>
              <p className="text-[11px] text-stone-400">
                Fresh batches of hot Tambda & Pandhra Rassa prepared twice daily.
              </p>
            </div>
          </div>

          {/* Col 3: Contact & Direct Inquiries */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Contact & Booking</span>
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-stone-900"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-bold">{settings.phone}</span>
              </a>

              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-stone-900"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{settings.email}</span>
                </a>
              )}

              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-[11px] text-amber-300/90">
                Special table arrangements available for family gatherings & highway travellers.
              </div>
            </div>
          </div>

          {/* Col 4: Location & Directions */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Restaurant Location</span>
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">{settings.address}</p>

            {settings.googleMapsUrl && (
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline pt-1"
              >
                <span>Open in Google Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} 12 Maval. All rights reserved. चुलीवरची अस्सल चव.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminView(true)}
              className="hover:text-amber-400 transition-colors"
            >
              CMS Admin Panel
            </button>
            <span>•</span>
            <a href="#table-booking" className="hover:text-amber-400 transition-colors">
              Book Table
            </a>
            <span>•</span>
            <a href="#menu" className="hover:text-amber-400 transition-colors">
              Dining Menu
            </a>
            <span>•</span>
            <a href="#specialties" className="hover:text-amber-400 transition-colors">
              Specialties
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
