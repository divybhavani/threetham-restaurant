import React, { useState } from 'react';
import { RESTAURANT_DATA } from '../data/restaurantData';
import { MapPin, Phone, Clock, Mail, CheckCircle2, Flame, Sparkles, Navigation, Send } from 'lucide-react';

export const VisitSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '13:00',
    guests: '2',
    mealType: 'sadya',
    specialNotes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMsg('Please provide a valid 10-digit phone number');
      return;
    }

    setErrorMsg('');
    const randomId = `TH-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingRef(randomId);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setBookingRef('');
    setFormData({
      name: '',
      phone: '',
      date: new Date().toISOString().split('T')[0],
      time: '13:00',
      guests: '2',
      mealType: 'sadya',
      specialNotes: ''
    });
  };

  return (
    <section id="visit" className="relative w-full py-24 sm:py-32 bg-[#262D15] text-[#FFF8E7] overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(200,150,62,0.15)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#C8963E] mb-2">
            <MapPin className="w-4 h-4 text-[#C8963E]" />
            <span>Welcome to Our Sanctuary</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl text-[#FFF8E7] font-bold">
            Visit Us & Reserve a Table
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#FFF8E7]/80 font-light">
            Conveniently nestled along Gangapur Road, Anandvalli, Nashik.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Contact & Location Info + Google Map */}
          <div className="lg:col-span-5 space-y-8">
            {/* Address & Timings Card with Apple Liquid Glass */}
            <div className="liquid-glass-dark-strong rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6 backdrop-blur-md">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#4F5A2A] border border-[#C8963E]/40 flex items-center justify-center text-[#C8963E] shrink-0 mt-1 shadow-inner">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-[#C8963E] font-semibold">
                    Address
                  </h3>
                  <p className="text-sm sm:text-base text-[#FFF8E7] mt-1 leading-relaxed font-light">
                    {RESTAURANT_DATA.address}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#4F5A2A] border border-[#C8963E]/40 flex items-center justify-center text-[#C8963E] shrink-0 mt-1 shadow-inner">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-[#C8963E] font-semibold">
                    Service Hours
                  </h3>
                  <div className="text-xs sm:text-sm text-[#FFF8E7]/90 space-y-1 font-light">
                    <p>
                      <strong>{RESTAURANT_DATA.hours.breakfast.label}:</strong> {RESTAURANT_DATA.hours.breakfast.timing}
                    </p>
                    <p>
                      <strong>{RESTAURANT_DATA.hours.lunch.label}:</strong> {RESTAURANT_DATA.hours.lunch.timing}
                    </p>
                    <p>
                      <strong>{RESTAURANT_DATA.hours.dinner.label}:</strong> {RESTAURANT_DATA.hours.dinner.timing}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Phone & Email */}
              <div className="flex items-start gap-4 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#4F5A2A] border border-[#C8963E]/40 flex items-center justify-center text-[#C8963E] shrink-0 mt-1 shadow-inner">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-[#C8963E] font-semibold">
                    Reservations & Inquiries
                  </h3>
                  <p className="text-sm sm:text-base text-[#FFF8E7] font-medium mt-1">
                    {RESTAURANT_DATA.phone}
                  </p>
                  <p className="text-xs text-[#FFF8E7]/70 mt-0.5">
                    {RESTAURANT_DATA.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map Styled Liquid Glass Card */}
            <div className="liquid-glass-dark rounded-3xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-md">
              <div className="relative h-52 sm:h-60 bg-[#2A3515]/60 flex flex-col items-center justify-center p-6 text-center">
                {/* Decorative map grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#C8963E" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#C8963E] text-[#1F3A1F] flex items-center justify-center shadow-lg mb-2">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <h4 className="font-display text-lg text-[#FFF8E7] font-bold">
                    Gangapur Road, Anandvalli, Nashik
                  </h4>
                  <p className="text-xs text-[#FFF8E7]/75 mt-1 max-w-xs font-light">
                    5 mins from Navshya Ganapati Temple · Valet Parking Available
                  </p>
                  <a
                    href={RESTAURANT_DATA.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-5 py-2.5 liquid-glass-subtle hover:bg-[#C8963E] hover:text-[#1F3A1F] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 border border-white/30 min-h-[44px] flex items-center justify-center shadow-sm"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Reservation Form with Liquid Glass */}
          <div className="lg:col-span-7">
            <div className="liquid-glass-dark-strong rounded-3xl p-6 sm:p-10 border border-white/25 shadow-2xl relative backdrop-blur-md">
              {/* SUCCESS STATE WITH LAMP LIGHTING UP */}
              {submitted ? (
                <div className="py-8 flex flex-col items-center text-center">
                  {/* Brass Lamp that lights up with flame glow */}
                  <div className="relative w-28 h-28 mb-4">
                    <div className="absolute inset-0 bg-[#E8A33D]/25 rounded-full blur-xl animate-pulse" />
                    <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
                      {/* Nilavilakku base & stem */}
                      <path d="M35 88 H65 M40 88 V70 M45 70 H55 M50 70 V52 M42 52 H58 M50 52 V40" stroke="#C8963E" strokeWidth="3" strokeLinecap="round" />
                      <ellipse cx="50" cy="40" rx="18" ry="7" fill="#C8963E" />
                      {/* Lit Lamp Flame */}
                      <path
                        d="M50 16 C42 26 42 34 50 38 C58 34 58 26 50 16 Z"
                        fill="#E8A33D"
                        className="animate-pulse"
                        style={{ filter: 'drop-shadow(0 0 16px rgba(232, 163, 61, 0.9))' }}
                      />
                      <circle cx="50" cy="30" r="3" fill="#FFF8E7" />
                    </svg>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C8963E] mb-2">
                    <Sparkles className="w-4 h-4 text-[#C8963E]" />
                    <span>The Lamp is Lit</span>
                    <Sparkles className="w-4 h-4 text-[#C8963E]" />
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FFF8E7] mb-2">
                    Vanakkam, {formData.name}!
                  </h3>

                  <p className="text-sm text-[#FFF8E7]/90 max-w-md mx-auto leading-relaxed">
                    Your table at Theertham has been honored and held. A warm banana-leaf setting is prepared for your party of {formData.guests}.
                  </p>

                  <div className="mt-6 p-4 rounded-xl bg-black/40 border border-[#C8963E]/40 inline-flex flex-col items-center gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#FFF8E7]/70">
                      Booking Reference
                    </span>
                    <span className="text-xl font-mono font-bold text-[#C8963E] tracking-widest">
                      {bookingRef}
                    </span>
                    <span className="text-xs text-[#FFF8E7]/80">
                      {formData.date} at {formData.time}
                    </span>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <a
                      href={`https://wa.me/${RESTAURANT_DATA.whatsappNumber}?text=${encodeURIComponent(
                        `Vanakkam! I have booked table reference ${bookingRef} for ${formData.name} on ${formData.date} at ${formData.time} (${formData.guests} guests).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-[#3E7B3A] hover:bg-[#4F994A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <span>Confirm via WhatsApp</span>
                    </a>
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-[#FFF8E7] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors min-h-[44px]"
                    >
                      Book Another Table
                    </button>
                  </div>
                </div>
              ) : (
                /* RESERVATION FORM */
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[#C8963E] font-semibold block mb-1">
                      Reserve Your Experience
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FFF8E7]">
                      Table Reservation
                    </h3>
                    <p className="text-xs sm:text-sm text-[#FFF8E7]/70 mt-1">
                      No cancellation charges. Please arrive within 15 minutes of your reserved slot.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-[#B3261E]/20 border border-[#B3261E] text-xs text-[#FFF8E7]">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C8963E] font-semibold mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Anand Menon"
                        className="w-full px-4 py-3 rounded-xl liquid-glass-dark border border-white/25 text-[#FFF8E7] placeholder-[#FFF8E7]/40 focus:outline-none focus:border-[#C8963E] focus:ring-2 focus:ring-[#C8963E]/30 text-sm min-h-[44px] transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C8963E] font-semibold mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98230 XXXXX"
                        className="w-full px-4 py-3 rounded-xl liquid-glass-dark border border-white/25 text-[#FFF8E7] placeholder-[#FFF8E7]/40 focus:outline-none focus:border-[#C8963E] focus:ring-2 focus:ring-[#C8963E]/30 text-sm min-h-[44px] transition-all"
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C8963E] font-semibold mb-1.5">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl liquid-glass-dark border border-white/25 text-[#FFF8E7] focus:outline-none focus:border-[#C8963E] text-sm min-h-[44px] transition-all"
                      />
                    </div>

                    {/* Meal Session / Time */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C8963E] font-semibold mb-1.5">
                        Time Slot *
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl liquid-glass-dark border border-white/25 text-[#FFF8E7] focus:outline-none focus:border-[#C8963E] text-sm min-h-[44px] transition-all"
                      >
                        <optgroup label="Morning Tiffin">
                          <option value="08:00">08:00 AM</option>
                          <option value="09:00">09:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                        </optgroup>
                        <optgroup label="Traditional Sadya Lunch">
                          <option value="12:30">12:30 PM (Sadya)</option>
                          <option value="13:30">01:30 PM (Sadya)</option>
                          <option value="14:30">02:30 PM (Sadya)</option>
                        </optgroup>
                        <optgroup label="Evening Tiffin & Dinner">
                          <option value="19:00">07:00 PM</option>
                          <option value="20:00">08:00 PM</option>
                          <option value="21:00">09:00 PM</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Number of Guests */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C8963E] font-semibold mb-1.5">
                        Guests *
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl liquid-glass-dark border border-white/25 text-[#FFF8E7] focus:outline-none focus:border-[#C8963E] text-sm min-h-[44px] transition-all"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, '10+', 'Large Family / 15+'].map((num) => (
                          <option key={num} value={String(num)}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dining Style */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#C8963E] font-semibold mb-1.5">
                        Dining Preference
                      </label>
                      <select
                        value={formData.mealType}
                        onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl liquid-glass-dark border border-white/25 text-[#FFF8E7] focus:outline-none focus:border-[#C8963E] text-sm min-h-[44px] transition-all"
                      >
                        <option value="sadya">Traditional Banana Leaf Table</option>
                        <option value="tiffin">A la carte Tiffin & Dosa Table</option>
                        <option value="courtyard">Garden Courtyard Seating</option>
                      </select>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C8963E] font-semibold mb-1.5">
                      Special Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.specialNotes}
                      onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                      placeholder="e.g., Birthday celebration, high chair needed, low spice preference"
                      className="w-full px-4 py-3 rounded-xl liquid-glass-dark border border-white/25 text-[#FFF8E7] placeholder-[#FFF8E7]/40 focus:outline-none focus:border-[#C8963E] text-sm min-h-[44px] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#C8963E] hover:bg-[#DEAC53] active:bg-[#B38330] text-[#1F3A1F] text-sm font-bold tracking-wider uppercase rounded-2xl shadow-[0_6px_24px_rgba(200,150,62,0.45),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-white/40 transition-all duration-300 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Reserve My Table & Light the Lamp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
