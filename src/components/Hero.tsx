import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Flame, ArrowRight, Award, UtensilsCrossed, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  const { content, settings } = useRestaurant();
  const hero = content.hero;

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 sm:py-24">
      {/* Background Image with Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={hero.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1600&q=85'}
          alt="12 Maval Kitchen"
          className="w-full h-full object-cover object-center brightness-40 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/30 via-transparent to-stone-950/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heritage Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 shadow-xl backdrop-blur-md">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span>{hero.badgeText || 'Since 1994 • Wood-Fired Chulha Special'}</span>
        </div>

        {/* Marathi Royal Heading */}
        <h2 className="font-marathi text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-amber-400 mb-3 tracking-wide drop-shadow-md">
          {hero.marathiHeading || 'अस्सल चुलीची खानदानी परंपरा'}
        </h2>

        {/* English Main Title */}
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-stone-100 tracking-tight mb-6 leading-tight drop-shadow-xl">
          {hero.heading || 'Experience The Soul of Maval'}
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-stone-300/95 font-normal leading-relaxed mb-10">
          {hero.subtitle ||
            'Slow-cooked over traditional clay chulha using heirloom spices, wood-fire earthenware, and ancestral secret recipes passed through generations.'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <a
            id="hero-primary-cta"
            href={hero.primaryCtaLink || '#table-booking'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-950/60 active:scale-98 transition-all"
          >
            <span>{hero.primaryCtaText || 'Book a Table'}</span>
            <ArrowRight className="w-5 h-5 text-stone-950" />
          </a>

          <a
            id="hero-secondary-cta"
            href={hero.secondaryCtaLink || '#menu'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-semibold text-stone-200 bg-stone-900/80 hover:bg-stone-800 border border-stone-700/80 backdrop-blur-sm transition-all hover:border-amber-500/50"
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span>{hero.secondaryCtaText || 'View Dining Menu'}</span>
          </a>
        </div>

        {/* Highlights Bar */}
        <div className="mt-14 pt-8 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-3 rounded-xl bg-stone-900/40 border border-stone-800/60 backdrop-blur-xs">
            <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <p className="text-xs sm:text-sm font-bold text-stone-200">100% Wood-Fired Chulha</p>
            <p className="text-[11px] text-stone-400">Pure Clay Hearth Cooking</p>
          </div>
          <div className="p-3 rounded-xl bg-stone-900/40 border border-stone-800/60 backdrop-blur-xs">
            <Award className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <p className="text-xs sm:text-sm font-bold text-stone-200">Stone-Pounded Masala</p>
            <p className="text-[11px] text-stone-400">Authentic 32-Spice Blends</p>
          </div>
          <div className="p-3 rounded-xl bg-stone-900/40 border border-stone-800/60 backdrop-blur-xs">
            <UtensilsCrossed className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <p className="text-xs sm:text-sm font-bold text-stone-200">Unlimited Rassa</p>
            <p className="text-[11px] text-stone-400">Tambda & Pandhra Flavors</p>
          </div>
          <div className="p-3 rounded-xl bg-stone-900/40 border border-stone-800/60 backdrop-blur-xs">
            <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <p className="text-xs sm:text-sm font-bold text-stone-200">Express Table Dining</p>
            <p className="text-[11px] text-stone-400">Piping Hot & Fresh</p>
          </div>
        </div>
      </div>
    </section>
  );
};
