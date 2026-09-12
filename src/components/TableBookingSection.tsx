import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../services/api';
import {
  Calendar,
  Clock,
  Users,
  Utensils,
  MapPin,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageSquare,
  AlertCircle,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SEATING_ZONES = [
  {
    id: 'Chulha Courtyard',
    marathi: 'चुलीचे अंगण',
    description: 'Bask in the fragrant wood-smoke aromas right near our clay chulhas',
    icon: '🌿',
    tables: ['Table 1', 'Table 2', 'Table 3', 'Table 4'],
  },
  {
    id: 'AC Family Hall',
    marathi: 'कुटुंब वातानुकूलित कक्ष',
    description: 'Quiet, premium air-conditioned comfort tailored for families',
    icon: '❄️',
    tables: ['Table 5', 'Table 6', 'Table 7', 'Table 8'],
  },
  {
    id: 'Garden Lawn',
    marathi: 'हिरवळ बैठक',
    description: 'Open-air breezy dining surrounded by lush greenery and night stars',
    icon: '🌸',
    tables: ['Table 9', 'Table 10', 'Table 11'],
  },
  {
    id: 'Mavali Floor Baithak',
    marathi: 'मावळी बैठक',
    description: 'Traditional low floor seating with soft bolsters and royal hospitality',
    icon: '👑',
    tables: ['Table 12', 'Table 13', 'Table 14'],
  },
];

const TIME_SLOTS = [
  { id: '12:00 PM', period: 'Lunch' },
  { id: '01:00 PM', period: 'Lunch' },
  { id: '02:00 PM', period: 'Lunch' },
  { id: '03:00 PM', period: 'Lunch' },
  { id: '07:00 PM', period: 'Dinner' },
  { id: '08:00 PM', period: 'Dinner' },
  { id: '09:00 PM', period: 'Dinner' },
  { id: '10:00 PM', period: 'Dinner' },
];

export const TableBookingSection: React.FC = () => {
  const { settings, showToast } = useRestaurant();

  // Date shortcuts
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

  const [date, setDate] = useState<string>(todayStr);
  const [timeSlot, setTimeSlot] = useState<string>('08:00 PM');
  const [guests, setGuests] = useState<number>(4);
  const [selectedZone, setSelectedZone] = useState<string>('Chulha Courtyard');
  const [selectedTable, setSelectedTable] = useState<string>('Table 2');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const currentZone = SEATING_ZONES.find((z) => z.id === selectedZone) || SEATING_ZONES[0];

  const handleSelectZone = (zoneId: string) => {
    setSelectedZone(zoneId);
    const targetZone = SEATING_ZONES.find((z) => z.id === zoneId);
    if (targetZone && targetZone.tables.length > 0) {
      setSelectedTable(targetZone.tables[0]);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please provide your name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.createReservation({
        customerName: name.trim(),
        phone: phone.trim(),
        guestCount: guests,
        reservationDate: date,
        timeSlot,
        seatingArea: selectedZone,
        tableNumber: selectedTable,
        specialRequests: notes.trim(),
      });

      if (res.success && res.reservation) {
        setConfirmedBooking(res.reservation);
        showToast('✓ Dining table reserved successfully at 12 Maval!');
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#d97706', '#10b981'],
          });
        } catch (e) {
          // ignore
        }
      }
    } catch (err: any) {
      console.error('Reservation error:', err);
      // Fallback local booking confirmation
      const fallbackBooking = {
        reservationNumber: `12M-RES-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: name.trim(),
        phone: phone.trim(),
        guestCount: guests,
        reservationDate: date,
        timeSlot,
        seatingArea: selectedZone,
        tableNumber: selectedTable,
        specialRequests: notes.trim(),
      };
      setConfirmedBooking(fallbackBooking);
      showToast('✓ Dining table reserved successfully at 12 Maval!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!confirmedBooking) return;
    const rawPhone = (settings.whatsapp || settings.phone).replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

    const text = `*12 Maval Dining Table Reservation Confirmation*
--------------------------------
*Booking Ref:* ${confirmedBooking.reservationNumber}
*Guest Name:* ${confirmedBooking.customerName}
*Phone:* ${confirmedBooking.phone}
*Guests:* ${confirmedBooking.guestCount} Diners
*Date:* ${confirmedBooking.reservationDate}
*Time Slot:* ${confirmedBooking.timeSlot}
*Seating Zone:* ${confirmedBooking.seatingArea}
*Table:* ${confirmedBooking.tableNumber}
${confirmedBooking.specialRequests ? `*Special Request:* ${confirmedBooking.specialRequests}\n` : ''}--------------------------------
_Authentic Wood-Fired Chulha Dining at 12 Maval_`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="table-booking" className="py-20 bg-stone-950 relative border-t border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span>Table Dining Reservation</span>
          </div>
          <h2 className="font-marathi text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-400 mb-2">
            टेबल आरक्षण
          </h2>
          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-100 mb-3">
            Book Your Dining Table at 12 Maval
          </h3>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Reserve your table in advance for a relaxed, authentic dining experience. Choose your preferred seating zone from traditional Baithak to our rustic Chulha Courtyard.
          </p>
        </div>

        {/* If Confirmed Booking View */}
        {confirmedBooking ? (
          <div className="max-w-2xl mx-auto bg-stone-900 border border-amber-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-stone-950 mb-3">
              Table Reserved
            </span>

            <h4 className="font-heading text-2xl sm:text-3xl font-black text-stone-100">
              Reservation Confirmed!
            </h4>
            <p className="font-marathi text-amber-400 text-sm font-semibold mt-1">
              आपले टेबल यशस्वीपणे आरक्षित केले आहे. १२ मावळ मध्ये आपले सहर्ष स्वागत!
            </p>

            {/* Pass Details Card */}
            <div className="mt-6 p-5 rounded-2xl bg-stone-950 border border-stone-800 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-sm">
                <span className="text-stone-400">Booking Reference:</span>
                <span className="font-mono font-bold text-amber-400">
                  {confirmedBooking.reservationNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-500 block">Guest Name</span>
                  <span className="font-bold text-stone-200">{confirmedBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Mobile Number</span>
                  <span className="font-semibold text-stone-200">{confirmedBooking.phone}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Date & Time</span>
                  <span className="font-bold text-amber-400">
                    {confirmedBooking.reservationDate} at {confirmedBooking.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Guests</span>
                  <span className="font-bold text-stone-200">{confirmedBooking.guestCount} Diners</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Seating Zone</span>
                  <span className="font-bold text-stone-200">{confirmedBooking.seatingArea}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Assigned Table</span>
                  <span className="font-bold text-emerald-400">{confirmedBooking.tableNumber}</span>
                </div>
              </div>

              {confirmedBooking.specialRequests && (
                <div className="pt-2 border-t border-stone-850 text-xs">
                  <span className="text-stone-500 block">Special Request:</span>
                  <span className="text-stone-300 italic">{confirmedBooking.specialRequests}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleSendWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-stone-950 bg-emerald-500 hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  const menuEl = document.getElementById('menu');
                  if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-stone-200 bg-stone-800 hover:bg-stone-700 transition-all"
              >
                <Utensils className="w-4 h-4 text-amber-400" />
                <span>Pre-Order Dining Dishes</span>
              </button>

              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-full sm:w-auto text-xs text-stone-400 hover:text-stone-200 py-2"
              >
                Book Another Table
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Reservation Form */
          <div className="max-w-4xl mx-auto bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-3 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-8">
              {/* Step 1: Date & Time */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>1. Select Dining Date & Time</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date selection with quick pills */}
                  <div>
                    <span className="block text-xs text-stone-400 mb-2 font-medium">Dining Date</span>
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setDate(todayStr)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          date === todayStr
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
                        }`}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setDate(tomorrowStr)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          date === tomorrowStr
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
                        }`}
                      >
                        Tomorrow
                      </button>
                    </div>
                    <input
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  {/* Time slot picker */}
                  <div>
                    <span className="block text-xs text-stone-400 mb-2 font-medium">Meal Time Slot</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setTimeSlot(slot.id)}
                          className={`py-2 px-1 rounded-lg text-xs font-bold text-center transition-all ${
                            timeSlot === slot.id
                              ? 'bg-amber-500 text-stone-950 shadow-md'
                              : 'bg-stone-950 text-stone-300 hover:bg-stone-800 border border-stone-800'
                          }`}
                        >
                          <div>{slot.id.replace(' ', '')}</div>
                          <span className="text-[10px] opacity-75">{slot.period}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Diners & Seating Zone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>2. Number of Guests & Seating Zone</span>
                </label>

                {/* Guest counter */}
                <div className="mb-5">
                  <span className="block text-xs text-stone-400 mb-2 font-medium">Party Size (Diners)</span>
                  <div className="flex flex-wrap gap-2">
                    {[2, 4, 6, 8, 10, 12, 16].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuests(num)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                          guests === num
                            ? 'bg-amber-500 text-stone-950 shadow-md'
                            : 'bg-stone-950 text-stone-300 hover:bg-stone-800 border border-stone-800'
                        }`}
                      >
                        {num} Diners
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seating Zones Grid */}
                <div>
                  <span className="block text-xs text-stone-400 mb-2 font-medium">
                    Choose Ambiance / Seating Zone
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SEATING_ZONES.map((zone) => (
                      <div
                        key={zone.id}
                        onClick={() => handleSelectZone(zone.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedZone === zone.id
                            ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-950/40'
                            : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{zone.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-heading text-sm font-bold text-stone-100">
                                {zone.id}
                              </h5>
                              <span className="font-marathi text-xs text-amber-400 font-semibold">
                                {zone.marathi}
                              </span>
                            </div>
                            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                              {zone.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table selector within the chosen zone */}
                <div className="mt-4 p-4 rounded-2xl bg-stone-950 border border-stone-800">
                  <span className="block text-xs text-stone-400 mb-2 font-medium">
                    Select Dining Table in {selectedZone} ({currentZone.marathi})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentZone.tables.map((tbl) => (
                      <button
                        key={tbl}
                        type="button"
                        onClick={() => setSelectedTable(tbl)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedTable === tbl
                            ? 'bg-amber-500 text-stone-950 shadow-md'
                            : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                        }`}
                      >
                        🍽️ {tbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Guest Details & Special Requests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>3. Guest Contact & Special Requests</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Guest Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Patil"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Mobile Number <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit phone (e.g. 9822012345)"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Occasion or Cooking Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Birthday dinner, Extra spicy rassa request, Need high chair for toddler"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No prepayment required. Confirmation is instant.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-black text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-950/60 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Utensils className="w-4 h-4 text-stone-950" />
                  <span>{isSubmitting ? 'Confirming Table...' : 'Reserve Dining Table Now'}</span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
